// Equirectangular map on a canvas: field cells, coastlines, a colour bar with units, hover readout and click pick.
// Hover and pick both go through pixelToCell, so the value read out is the cell picked.
import { colorFor, DIVERGING, SEQUENTIAL, niceCeil } from './colors.js';
import { niceTicks, fmt, prettyUnits } from './charts.js';

const NLAT = 90, NLON = 180, DEG = 2;

/** Visible window and wrapping frame. L0: start of the 360° longitude frame the cells and coastlines are drawn in.
 *  Pacific (100°E–300°E, 30°S–30°N) is continuous in 0–360, so it uses that frame whatever the centre. */
export function frameOf(centre, extent) {
  if (extent === 'pacific') return { L0: 0, lon0: 100, lon1: 300, lat0: -30, lat1: 30 };
  const L0 = centre - 180;
  return { L0, lon0: L0, lon1: L0 + 360, lat0: -90, lat1: 90 };
}

/** Grid cell of a point. Longitudes are absolute (any 360° window), so the cell does not depend on the centre;
 *  `centre` is accepted so callers can pass what they have. iLon = floor(lon/2) on 0–360, iLat = floor((lat+90)/2). */
// eslint-disable-next-line no-unused-vars
export function lonLatToIndex(lon, lat, centre) {
  const l = ((lon % 360) + 360) % 360;
  const iLon = Math.floor(l / DEG) % NLON;
  const iLat = Math.min(NLAT - 1, Math.max(0, Math.floor((lat + 90) / DEG)));
  return [iLat, iLon];
}

/** Canvas pixel (CSS px from the top-left) -> [lon, lat] in the frame of (centre, extent). */
export function pixelToLonLat(x, y, w, h, centre, extent) {
  const f = frameOf(centre, extent);
  return [f.lon0 + (x / w) * (f.lon1 - f.lon0), f.lat1 - (y / h) * (f.lat1 - f.lat0)];
}

/** Canvas pixel -> [iLat, iLon] of the cell drawn there. The pixel is clamped onto the canvas, then mapped to a
 *  column/row of the drawn window and read at that cell's centre, so edge pixels never wrap or land off the map. */
export function pixelToCell(x, y, w, h, centre, extent) {
  const f = frameOf(centre, extent);
  const nc = (f.lon1 - f.lon0) / DEG, nr = (f.lat1 - f.lat0) / DEG;
  const c = Math.min(nc - 1, Math.max(0, Math.floor((x / w) * nc)));
  const r = Math.min(nr - 1, Math.max(0, Math.floor((y / h) * nr)));
  return lonLatToIndex(f.lon0 + DEG * c + DEG / 2, f.lat1 - DEG * r - DEG / 2, centre);
}

/** Flat indices (iLat*NLON + iLon) of the cells drawn in an extent ('global' | 'pacific'), in the frame used to draw
 *  it: cell centres inside [lon0, lon1] × [lat0, lat1]. The centre only shifts the global window, so it is not needed. */
export function cellsIn(extent, lat, lon) {
  const f = frameOf(180, extent), out = [];
  for (let i = 0; i < lat.length; i++) {
    if (lat[i] < f.lat0 || lat[i] > f.lat1) continue;
    for (let j = 0; j < lon.length; j++) {
      const l = f.L0 + (((lon[j] - f.L0) % 360) + 360) % 360;
      if (l >= f.lon0 && l <= f.lon1) out.push(i * lon.length + j);
    }
  }
  return Int32Array.from(out);
}

/** Put lines into the frame [L0, L0+360] and cut every segment that crosses the seam, so nothing streaks
 *  across the map. Points follow the shorter way round; a crossing is interpolated onto both edges. */
export function splitAtSeam(lines, L0) {
  const out = [], L1 = L0 + 360;
  for (const line of lines) {
    if (!line.length) continue;
    let cur = [], prev = null;
    for (const [lon, lat] of line) {
      if (!prev) {
        const w = L0 + (((lon - L0) % 360) + 360) % 360;
        cur.push([w, lat]); prev = [w, lat]; continue;
      }
      let d = lon - ((prev[0] % 360) + 360) % 360;
      d = ((d % 360) + 360) % 360; if (d > 180) d -= 360;
      let q = prev[0] + d;
      if (q > L1 || q < L0) {
        const s = q > L1 ? L1 : L0, t = (s - prev[0]) / (q - prev[0]);
        const ls = prev[1] + t * (lat - prev[1]);
        cur.push([s, ls]);
        if (cur.length > 1) out.push(cur);
        const s2 = s === L1 ? L0 : L1;
        cur = [[s2, ls]];
        q += s === L1 ? -360 : 360;
      }
      cur.push([q, lat]); prev = [q, lat];
    }
    // Drop zero-length pieces (e.g. a point sitting exactly on the seam).
    if (cur.length > 1) out.push(cur);
  }
  return out.filter(l => l.some(p => p[0] !== l[0][0] || p[1] !== l[0][1]));
}

/** Colour-bar ticks: round ticks that include both ends if a round quarter step allows (±80 -> ±80, ±40, 0),
 *  otherwise the usual round ticks inside the range. A range symmetric about zero always gets its ends, halves and
 *  zero (±150 -> ±150, ±75, 0; ±250 -> ±250, ±125, 0), so an auto or shared range never ends unlabelled. */
export function barTicks(lo, hi) {
  const t = niceTicks(lo, hi, 5);
  if (!(hi > lo) || (t[0] === lo && t[t.length - 1] === hi)) return t;
  const q = (hi - lo) / 4;
  if (Math.abs(niceCeil(q) - q) < 1e-9 * q || Math.abs(lo + hi) < 1e-12 * (hi - lo)) {
    return [0, 1, 2, 3, 4].map(k => +(lo + k * q).toPrecision(12));
  }
  return t;
}

/** Decimals for tick labels: the fewest (0–3) that show the tick step exactly (7.5 -> 1, 0.025 -> 3, 125 -> 0). */
export function tickDecimals(ticks) {
  if (ticks.length < 2) return 1;
  const step = Math.abs(ticks[1] - ticks[0]);
  for (let d = 0; d < 3; d++) { const x = step * 10 ** d; if (Math.abs(x - Math.round(x)) < 1e-6 * Math.max(1, x)) return d; }
  return 3;
}

const fmtLat = φ => (φ === 0 ? '0°' : `${Math.abs(φ)}°${φ > 0 ? 'N' : 'S'}`);
const fmtLon = λ => { const l = ((λ % 360) + 360) % 360; return l === 0 || l === 180 ? `${l}°` : l < 180 ? `${l}°E` : `${360 - l}°W`; };
/** "1°N, 149°W" */
export const fmtLatLon = (lat, lon) => `${fmtLat(lat)}, ${fmtLon(lon)}`;

/** Readout text while nothing is hovered: hover/click wording for a mouse, tap wording on a touch screen. */
export function mapHint(pick, coarse) {
  if (coarse) return pick ? 'Tap the map to read a value and pick a point.' : 'Tap the map to read a value.';
  return pick ? 'Hover over the map to read a value; click to pick a point.' : 'Hover over the map to read a value.';
}
/** True on a touch screen (coarse pointer): hints say "Tap" there. */
export const coarsePointer = () => typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

/**
 * createMap(container, {lat, lon, coast}) -> MapView
 *   pick: whether clicks pick a point (default true); only changes the hint text, which suits the pointer type.
 *   hint: readout text when the pointer is off the map (overrides the default from mapHint).
 *   draw(grid, {lo, hi, cmap: 'div'|'seq'|table, units, label}), setCentre(0|180), setExtent('global'|'pacific'),
 *   onPick(cb(iLat, iLon, lat, lon)), onHover(cb(value, lat, lon)) (value null when the pointer leaves),
 *   mark(iLat, iLon) / mark(null), setBusy(text|false), destroy().
 */
export function createMap(container, { lat, lon, coast, pick = true, hint = mapHint(pick, coarsePointer()) }) {
  container.classList.add('map');
  container.innerHTML = `
    <div class="map-wrap"><canvas class="map-canvas" role="img"></canvas><div class="map-msg" hidden></div></div>
    <div class="cbar"><canvas class="cbar-strip" width="256" height="1"></canvas><div class="cbar-ticks"></div><div class="cbar-label"></div></div>
    <div class="map-readout">${hint}</div>`;
  const wrap = container.querySelector('.map-wrap'), cv = container.querySelector('.map-canvas');
  const msg = container.querySelector('.map-msg'), strip = container.querySelector('.cbar-strip');
  const ticksEl = container.querySelector('.cbar-ticks'), labelEl = container.querySelector('.cbar-label');
  const readout = container.querySelector('.map-readout');
  const coastLines = (coast && coast.lines) || [];
  const off = document.createElement('canvas'); off.width = NLON; off.height = NLAT;
  let centre = 180, extent = 'global', grid = null, opts = null, marked = null, coastCache = null;
  const pickCbs = [], hoverCbs = [];

  const table = c => (c === 'seq' ? SEQUENTIAL : c === 'div' || !c ? DIVERGING : c);

  function paintCells() {
    // Offscreen 180×90 image in frame L0: column c is lon L0 + 2c + 1, row r is lat 89 - 2r.
    const ctx = off.getContext('2d'), img = ctx.createImageData(NLON, NLAT), f = frameOf(centre, extent);
    const cm = table(opts.cmap);
    for (let r = 0; r < NLAT; r++) {
      const iLat = NLAT - 1 - r;
      for (let c = 0; c < NLON; c++) {
        const [, iLon] = lonLatToIndex(f.L0 + DEG * c + 1, 0, centre);
        const [R, G, B] = colorFor(grid[iLat * NLON + iLon], opts.lo, opts.hi, cm);
        const k = (r * NLON + c) * 4;
        img.data[k] = R; img.data[k + 1] = G; img.data[k + 2] = B; img.data[k + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function render() {
    const f = frameOf(centre, extent);
    const w = cv.clientWidth, h = cv.clientHeight;
    if (!w || !h) return;
    const dpr = window.devicePixelRatio || 1;
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (grid) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(off, (f.lon0 - f.L0) / DEG, (90 - f.lat1) / DEG, (f.lon1 - f.lon0) / DEG, (f.lat1 - f.lat0) / DEG, 0, 0, cv.width, cv.height);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const X = λ => (λ - f.lon0) / (f.lon1 - f.lon0) * w, Y = φ => (f.lat1 - φ) / (f.lat1 - f.lat0) * h;
    if (!coastCache || coastCache.L0 !== f.L0) coastCache = { L0: f.L0, lines: splitAtSeam(coastLines, f.L0) };
    ctx.strokeStyle = 'rgba(17, 17, 17, 0.9)'; ctx.lineWidth = extent === 'pacific' ? 1.1 : 0.8; ctx.lineJoin = 'round';
    ctx.beginPath();
    for (const line of coastCache.lines) {
      line.forEach(([λ, φ], i) => (i ? ctx.lineTo(X(λ), Y(φ)) : ctx.moveTo(X(λ), Y(φ))));
    }
    ctx.stroke();
    if (marked) {
      let λ = lon[marked[1]];
      while (λ < f.lon0) λ += 360;
      while (λ >= f.lon0 + 360) λ -= 360;
      const φ = lat[marked[0]];
      // Draw every copy in the window, so a point on the seam shows on both edges.
      for (const l of [λ - 360, λ, λ + 360]) {
        if (l < f.lon0 - 4 || l > f.lon1 + 4 || φ < f.lat0 || φ > f.lat1) continue;
        const x = X(l), y = Y(φ);
        ctx.lineWidth = 3; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.stroke();
        ctx.lineWidth = 1.5; ctx.strokeStyle = '#111'; ctx.beginPath(); ctx.arc(x, y, 6, 0, 2 * Math.PI); ctx.stroke();
      }
    }
  }

  function renderBar() {
    const cm = table(opts.cmap), sctx = strip.getContext('2d'), img = sctx.createImageData(256, 1);
    cm.forEach(([R, G, B], i) => { img.data.set([R, G, B, 255], i * 4); });
    sctx.putImageData(img, 0, 0);
    const { lo, hi } = opts;
    const ticks = barTicks(lo, hi);
    ticksEl.innerHTML = ticks.map(v => {
      const p = hi > lo ? (v - lo) / (hi - lo) * 100 : 50;
      const cls = p < 4 ? 'first' : p > 96 ? 'last' : '';
      return `<span class="${cls}" style="left:${p.toFixed(2)}%">${fmt(v, opts.units, tickDecimals(ticks))}</span>`;
    }).join('');
    labelEl.textContent = [opts.label, prettyUnits(opts.units)].filter(Boolean).join(', ');
  }

  function setAspect() {
    const f = frameOf(centre, extent);
    wrap.style.aspectRatio = `${f.lon1 - f.lon0} / ${f.lat1 - f.lat0}`;
  }

  function cellAt(ev) {
    const r = cv.getBoundingClientRect();
    return pixelToCell(ev.clientX - r.left, ev.clientY - r.top, r.width, r.height, centre, extent);
  }
  function showReadout([iLat, iLon]) {
    const v = grid ? grid[iLat * NLON + iLon] : NaN;
    readout.textContent = `${Number.isFinite(v) ? `${fmt(v, opts.units)} ${prettyUnits(opts.units)}` : 'No value'} at ${fmtLatLon(lat[iLat], lon[iLon])}`;
    container.dataset.hover = `${iLat},${iLon}`;
    for (const cb of hoverCbs) cb(v, lat[iLat], lon[iLon]);
  }
  cv.addEventListener('pointermove', ev => { if (grid) showReadout(cellAt(ev)); });
  cv.addEventListener('pointerleave', () => {
    readout.textContent = hint; delete container.dataset.hover;
    for (const cb of hoverCbs) cb(null, NaN, NaN);
  });
  cv.addEventListener('click', ev => {
    if (!grid) return;
    const c = cellAt(ev);
    showReadout(c);
    for (const cb of pickCbs) cb(c[0], c[1], lat[c[0]], lon[c[1]]);
  });

  const ro = new ResizeObserver(() => render());
  ro.observe(wrap);
  setAspect();

  return {
    el: container,
    canvas: cv,
    draw(g, o) {
      grid = g; opts = { ...o };
      readout.textContent = hint; delete container.dataset.hover;   // no stale value from the previous map
      paintCells(); render(); renderBar();
      cv.setAttribute('aria-label', `Map of ${o.label || 'the field'}`);
    },
    setCentre(c) { if (c === centre) return; centre = c; setAspect(); if (grid) paintCells(); render(); },
    setExtent(e) { if (e === extent) return; extent = e; setAspect(); if (grid) paintCells(); render(); },
    get centre() { return centre; },
    get extent() { return extent; },
    onPick(cb) { pickCbs.push(cb); },
    onHover(cb) { hoverCbs.push(cb); },
    mark(iLat, iLon) { marked = iLat === null || iLat === undefined ? null : [iLat, iLon]; render(); },
    setBusy(text) { msg.hidden = !text; msg.textContent = text || ''; },
    destroy() { ro.disconnect(); container.innerHTML = ''; },
  };
}
