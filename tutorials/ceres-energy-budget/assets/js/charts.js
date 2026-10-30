// SVG charts (time series, zonal mean, bars, Niño-3.4 strip) and CSV export.
// Charts are drawn as markup into an <svg> sized by CSS; colours come from CSS classes so the theme
// switches without a redraw. Nothing here touches the DOM at import time, so the pure helpers run under Node.
import { runningMean, seasonalTrend } from './timesel.js';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MINUS = '−';

// ---------- pure helpers ----------

/** Tick values on a round step (1, 2, 2.5 or 5 × 10^k) that lie inside [lo, hi]. */
export function niceTicks(lo, hi, n = 5) {
  if (!(hi > lo)) return Number.isFinite(lo) ? [lo] : [];
  const raw = (hi - lo) / Math.max(1, n - 1), e = 10 ** Math.floor(Math.log10(raw));
  // The round step whose tick count is closest to n (ties go to the larger step).
  const count = st => Math.floor(hi / st + 1e-9) - Math.ceil(lo / st - 1e-9) + 1;
  let step = e, best = Infinity;
  for (const c of [0.5, 1, 2, 2.5, 5, 10, 20]) {
    const st = c * e, d = Math.abs(count(st) - n);
    if (d <= best) { best = d; step = st; }
  }
  const out = [];
  for (let k = Math.ceil(lo / step - 1e-9); k * step <= hi + step * 1e-9; k++) out.push(+(k * step).toPrecision(12));
  return out;
}

/** "W m-2" -> "W m⁻²". */
export function prettyUnits(u) {
  return u === 'W m-2' ? 'W m⁻²' : u;
}

/** Display value: 3 decimals for fractions, 1 otherwise; true minus sign; NaN -> en dash. */
export function fmt(v, units, digits) {
  if (!Number.isFinite(v)) return '–';
  const d = digits ?? (units === 'fraction' ? 3 : 1);
  let s = v.toFixed(d);
  if (/^-0\.?0*$/.test(s)) s = s.slice(1);
  return s.replace('-', MINUS);
}

/** fmt with a '+' on positive values that do not round to zero. */
export const signed = (v, units, d) => (v > 0 && fmt(v, units, d) !== fmt(0, units, d) ? '+' : '') + fmt(v, units, d);
const tickFmt = (v, step) => {
  const d = Math.max(0, -Math.floor(Math.log10(step) + 1e-9) + (step / 10 ** Math.floor(Math.log10(step)) === 2.5 ? 1 : 0));
  return fmt(v, '', d);
};

/** CSV text: a time column, the given columns, and always a nino34_anom column (empty if not supplied). */
export function toCSV({ times, columns, nino }) {
  const cols = { ...columns };
  if (!('nino34_anom' in cols)) cols.nino34_anom = nino || [];
  const names = Object.keys(cols);
  const cell = v => (v === null || v === undefined || !Number.isFinite(+v) ? '' : String(+(+v).toPrecision(10)));
  const lines = ['time,' + names.join(',')];
  times.forEach((t, i) => lines.push([typeof t === 'string' ? t : `${t.y}-${String(t.m).padStart(2, '0')}`,
    ...names.map(n => cell(cols[n][i]))].join(',')));
  return lines.join('\n') + '\n';
}

/** Save a CSV ({name, times, columns, nino?} as toCSV takes, plus the file name) through a temporary download link.
 *  Touches the DOM only when called. */
export function downloadCSV(csv) {
  if (!csv) return;
  const blob = new Blob([toCSV(csv)], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = csv.name;
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const tDec = t => (typeof t === 'string' ? (([y, m]) => +y + (+m - 0.5) / 12)(t.split('-')) : t.y + (t.m - 0.5) / 12);
const tLabel = t => (typeof t === 'string' ? (([y, m]) => `${MONTHS[+m - 1]} ${y}`)(t.split('-')) : `${MONTHS[t.m - 1]} ${t.y}`);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r1 = v => Math.round(v * 10) / 10;
const textW = s => String(s).length * 6.3 + 2;   // ~11 px Inter

function extent(arrs) {
  let lo = Infinity, hi = -Infinity;
  for (const a of arrs) for (const v of a) if (Number.isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; }
  if (lo === Infinity) return [0, 1];
  if (lo === hi) return [lo - 1, hi + 1];
  const pad = (hi - lo) * 0.06;
  return [lo - pad, hi + pad];
}

/** Path through finite points; NaN breaks the line. */
function linePath(xs, ys) {
  let d = '', pen = false;
  for (let i = 0; i < xs.length; i++) {
    if (!Number.isFinite(ys[i])) { pen = false; continue; }
    d += (pen ? 'L' : 'M') + r1(xs[i]) + ' ' + r1(ys[i]);
    pen = true;
  }
  return d;
}

/** Legend laid out in rows across width w starting at (x0, y0). Items: {cls, kind:'line'|'box', label}. */
function legend(items, x0, y0, w) {
  let x = x0, y = y0, s = '';
  for (const it of items) {
    const iw = 22 + textW(it.label) + 12;
    if (x > x0 && x + iw > x0 + w) { x = x0; y += 16; }
    s += it.kind === 'box'
      ? `<rect class="${it.cls}" x="${x}" y="${y - 8}" width="16" height="10" rx="2"/>`
      : `<line class="${it.cls}" x1="${x}" x2="${x + 16}" y1="${y - 3}" y2="${y - 3}"/>`;
    s += `<text class="lg" x="${x + 21}" y="${y}">${esc(it.label)}</text>`;
    x += iw;
  }
  return { svg: s, bottom: y + 6 };
}
function legendRows(items, w) { return (legend(items, 0, 0, w).bottom - 6) / 16 + 1; }

function size(svg) {
  const r = svg.getBoundingClientRect();
  return [Math.max(120, Math.round(r.width)), Math.max(80, Math.round(r.height))];
}

/** Tooltip group: lines of text in a box placed beside (x, y), flipped to stay inside [0, W]. */
function tooltip(lines, x, y, W, H) {
  const w = Math.max(...lines.map(textW)) + 12, h = lines.length * 15 + 8;
  const tx = x + 10 + w > W ? x - 10 - w : x + 10, ty = Math.min(Math.max(2, y - h / 2), H - h - 2);
  return `<g class="tip"><rect x="${r1(tx)}" y="${r1(ty)}" width="${r1(w)}" height="${h}" rx="4"/>` +
    lines.map((l, i) => `<text x="${r1(tx + 6)}" y="${r1(ty + 16 + i * 15)}">${esc(l)}</text>`).join('') + '</g>';
}

function remember(svg, fn, args) { svg._chart = { fn, args }; }
/** Redraw a chart with its last arguments (after a resize). */
export function redraw(svg) { if (svg && svg._chart) svg._chart.fn(svg, ...svg._chart.args); }

function xYearAxis(t0, t1, X, top, bottom, W) {
  const span = t1 - t0, px = W / span;
  const step = [1, 2, 5, 10].find(s => s * px >= 44) || 10;
  let s = '';
  for (let y = Math.ceil(t0); y <= t1; y++) {
    s += `<line class="gridv" x1="${r1(X(y))}" x2="${r1(X(y))}" y1="${top}" y2="${bottom}"/>`;
    if (y % step === 0 && X(y) > 14 && X(y) < X(t1) - 4) s += `<text class="tk" x="${r1(X(y))}" y="${bottom + 14}" text-anchor="middle">${y}</text>`;
  }
  return s;
}

function shadeRects(shade, times, X, top, bottom) {
  if (!shade) return '';
  return shade.map(p => {
    const a = X(tDec(times[p.start]) - 1 / 24), b = X(tDec(times[p.end]) + 1 / 24);
    return `<rect class="shade-${p.phase}" x="${r1(a)}" y="${top}" width="${r1(b - a)}" height="${bottom - top}"/>`;
  }).join('');
}

// ---------- charts ----------

/**
 * timeSeries(svg, {times, series:[{values,label,style}], shade, runningMean, trend, units, legend})
 * series style: 's0' | 's1' ... (colour slot). With runningMean the monthly line is faint and the 12-month
 * running mean is drawn over it. Shade: ensoPhases() output, drawn behind everything.
 * legend: 'series' gives one legend entry per series (drawn like its bold line) and a one-line tooltip per series,
 * for charts with several series; the chart's title then says which line is which.
 */
export function timeSeries(svg, opts) {
  remember(svg, timeSeries, [opts]);
  const { times, series, shade, units = '' } = opts;
  const [W, H] = size(svg);
  const rms = series.map(s => (opts.runningMean ? runningMean(s.values, 12) : null));
  const items = [], compact = opts.legend === 'series';
  series.forEach((s, i) => {
    const cls = s.style || `s${i}`;
    if (compact) { items.push({ cls: `ln ${cls}${opts.runningMean ? ' rm' : ''}`, kind: 'line', label: s.label }); return; }
    items.push({ cls: `ln ${cls}${opts.runningMean ? ' faint' : ''}`, kind: 'line', label: s.label });
    if (opts.runningMean) items.push({ cls: `ln ${cls} rm`, kind: 'line', label: '12-month mean' });
  });
  let tr = null;
  if (opts.trend && series[0]) {
    // Fitted with a mean per calendar month, so the seasonal cycle does not tilt the line (timesel.seasonalTrend).
    const tt = times.map(t => (typeof t === 'string' ? { y: +t.slice(0, 4), m: +t.slice(5, 7) } : t));
    tr = seasonalTrend(series[0].values, tt);
    if (Number.isFinite(tr.slopePerDecade)) items.push({ cls: 'ln trend', kind: 'line', label: `Trend ${signed(tr.slopePerDecade, units, 2)} per decade` });
    else tr = null;
  }
  if (shade && shade.length) items.push({ cls: 'shade-nino', kind: 'box', label: 'El Niño' }, { cls: 'shade-nina', kind: 'box', label: 'La Niña' });
  const L = 44, R = 10, B = 20, T = 8 + legendRows(items, W - L - R) * 16;
  const t0 = tDec(times[0]) - 1 / 24, t1 = tDec(times[times.length - 1]) + 1 / 24;
  const X = t => L + (t - t0) / (t1 - t0) * (W - L - R);
  const [lo, hi] = extent(series.map(s => s.values));
  const Y = v => H - B - (v - lo) / (hi - lo) * (H - B - T);
  const xs = times.map(t => X(tDec(t)));
  const ticks = niceTicks(lo, hi, Math.max(3, Math.round((H - B - T) / 40)));
  const step = ticks.length > 1 ? ticks[1] - ticks[0] : 1;
  let s = shadeRects(shade, times, X, T, H - B);
  s += ticks.map(v => `<line class="grid" x1="${L}" x2="${W - R}" y1="${r1(Y(v))}" y2="${r1(Y(v))}"/>` +
    `<text class="tk" x="${L - 5}" y="${r1(Y(v) + 4)}" text-anchor="end">${tickFmt(v, step)}</text>`).join('');
  if (lo < 0 && hi > 0) s += `<line class="zero" x1="${L}" x2="${W - R}" y1="${r1(Y(0))}" y2="${r1(Y(0))}"/>`;
  s += xYearAxis(t0, t1, X, T, H - B, W - L - R);
  series.forEach((ser, i) => {
    const cls = ser.style || `s${i}`;
    s += `<path class="ln ${cls}${opts.runningMean ? ' faint' : ''}" d="${linePath(xs, Array.from(ser.values, Y))}"/>`;
    if (rms[i]) s += `<path class="ln ${cls} rm" d="${linePath(xs, Array.from(rms[i], Y))}"/>`;
  });
  if (tr) {
    const n = times.length - 1, ya = tr.intercept, yb = tr.intercept + tr.slopePerDecade / 120 * n;
    s += `<line class="ln trend" x1="${r1(xs[0])}" x2="${r1(xs[n])}" y1="${r1(Y(ya))}" y2="${r1(Y(yb))}"/>`;
  }
  s += `<line class="axis" x1="${L}" x2="${W - R}" y1="${H - B}" y2="${H - B}"/>`;
  s += legend(items, L, 14, W - L - R).svg;
  s += '<g class="hover"></g>';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = s;
  const hov = svg.querySelector('.hover');
  svg.onpointermove = ev => {
    const r = svg.getBoundingClientRect(), x = ev.clientX - r.left;
    if (x < L || x > W - R) { hov.innerHTML = ''; return; }
    let i = Math.round((x - xs[0]) / ((xs[xs.length - 1] - xs[0]) / (xs.length - 1)));
    i = Math.max(0, Math.min(times.length - 1, i));
    const lines = [tLabel(times[i])];
    series.forEach((ser, k) => {
      const rm = rms[k] && Number.isFinite(rms[k][i]) ? fmt(rms[k][i], units) : null;
      if (compact) { lines.push(`${ser.label}: ${fmt(ser.values[i], units)}${rm !== null ? ` (12-month mean ${rm})` : ''}`); return; }
      lines.push(`${ser.label}: ${fmt(ser.values[i], units)}`);
      if (rm !== null) lines.push(`12-month mean: ${rm}`);
    });
    hov.innerHTML = `<line class="cross" x1="${r1(xs[i])}" x2="${r1(xs[i])}" y1="${T}" y2="${H - B}"/>` + tooltip(lines, xs[i], (T + H - B) / 2, W, H);
  };
  svg.onpointerleave = () => { hov.innerHTML = ''; };
}

/**
 * zonalPanel(svg, {lat, lines:[{values,label}], latRange, units, plotTop})
 * Latitude runs down the y axis (north at the top) so the panel lines up with the map beside it;
 * plotTop = 0 puts the latRange top at the svg top.
 */
export function zonalPanel(svg, opts) {
  remember(svg, zonalPanel, [opts]);
  const { lat, lines, latRange = [-90, 90], units = '' } = opts;
  const [W, H] = size(svg);
  const items = lines.length > 1 ? lines.map((l, i) => ({ cls: `ln s${i}`, kind: 'line', label: l.label })) : [];
  const L = 34, R = 10, T = opts.plotTop ?? 0;
  const B = 20 + (items.length ? legendRows(items, W - 12) * 16 + 4 : 0);
  const [la0, la1] = latRange;
  const Y = φ => T + (la1 - φ) / (la1 - la0) * (H - B - T);
  const inLat = lat.map(φ => φ >= la0 && φ <= la1);
  const [lo, hi] = extent(lines.map(l => Array.from(l.values).filter((_, i) => inLat[i])));
  const X = v => L + (v - lo) / (hi - lo) * (W - L - R);
  const ticks = niceTicks(lo, hi, Math.max(2, Math.round((W - L - R) / 55)));
  const step = ticks.length > 1 ? ticks[1] - ticks[0] : 1;
  const latStep = la1 - la0 > 90 ? 30 : 10;
  let s = '';
  s += ticks.map(v => `<line class="gridv" x1="${r1(X(v))}" x2="${r1(X(v))}" y1="${T}" y2="${H - B}"/>` +
    `<text class="tk" x="${r1(X(v))}" y="${H - B + 14}" text-anchor="middle">${tickFmt(v, step)}</text>`).join('');
  for (let φ = Math.ceil((la0 + 1) / latStep) * latStep; φ < la1; φ += latStep) {
    const lab = φ === 0 ? '0°' : `${Math.abs(φ)}°${φ > 0 ? 'N' : 'S'}`;
    s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${r1(Y(φ))}" y2="${r1(Y(φ))}"/>` +
      `<text class="tk" x="${L - 4}" y="${r1(Y(φ) + 4)}" text-anchor="end">${lab}</text>`;
  }
  if (lo < 0 && hi > 0) s += `<line class="zero" x1="${r1(X(0))}" x2="${r1(X(0))}" y1="${T}" y2="${H - B}"/>`;
  const ys = lat.map(Y);
  lines.forEach((l, i) => {
    const xv = Array.from(l.values, (v, k) => (inLat[k] ? X(v) : NaN));
    let d = '', pen = false;
    for (let k = 0; k < lat.length; k++) {
      if (!Number.isFinite(xv[k])) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + r1(xv[k]) + ' ' + r1(ys[k]); pen = true;
    }
    s += `<path class="ln s${i} zl" d="${d}"/>`;
  });
  s += `<line class="axis" x1="${L}" x2="${L}" y1="${T}" y2="${H - B}"/>`;
  if (items.length) s += legend(items, 6, H - B + 34, W - 12).svg;
  s += '<g class="hover"></g>';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = s;
  const hov = svg.querySelector('.hover');
  svg.onpointermove = ev => {
    const r = svg.getBoundingClientRect(), y = ev.clientY - r.top;
    if (y < T || y > H - B) { hov.innerHTML = ''; return; }
    let k = 0;
    for (let j = 1; j < lat.length; j++) if (Math.abs(ys[j] - y) < Math.abs(ys[k] - y)) k = j;
    const φ = lat[k];
    const out = [`${Math.abs(φ)}°${φ >= 0 ? 'N' : 'S'}`, ...lines.map(l => `${lines.length > 1 ? l.label + ': ' : ''}${fmt(l.values[k], units)}`)];
    hov.innerHTML = `<line class="cross" x1="${L}" x2="${W - R}" y1="${r1(ys[k])}" y2="${r1(ys[k])}"/>` + tooltip(out, L + 4, ys[k], W, H);
  };
  svg.onpointerleave = () => { hov.innerHTML = ''; };
}

/**
 * bars(svg, [{label, value}], {units}): vertical bars from zero, coloured by sign, value labels on the bars.
 * The plot keeps a label's height clear above the highest bar and below the lowest one, so value labels never meet
 * the category labels or the chart edge. A category label too wide for its slot breaks onto two lines at a space.
 * The units sit at the top left, above the axis labels.
 */
export function bars(svg, items, opts = {}) {
  remember(svg, bars, [items, opts]);
  const units = opts.units || '';
  const [W, H] = size(svg);
  const L = 44, R = 8, LINE = 13, VAL = 14;           // VAL: room for a value label beyond a bar's end
  const bw = (W - L - R) / Math.max(1, items.length);
  const split = lab => {
    const i = lab.lastIndexOf(' ');
    return textW(lab) > bw * 0.85 && i > 0 ? [lab.slice(0, i), lab.slice(i + 1)] : [lab];
  };
  const cats = items.map(d => split(d.label)), nLines = Math.max(1, ...cats.map(c => c.length));
  const B = nLines * LINE + 10, top = 8 + VAL, bottom = H - B - VAL;
  const vals = items.map(d => d.value).filter(Number.isFinite);
  let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
  if (lo === hi) hi = lo + 1;
  const Y = v => top + (hi - v) / (hi - lo) * (bottom - top);
  const ticks = niceTicks(lo, hi, 4), step = ticks.length > 1 ? ticks[1] - ticks[0] : 1;
  let s = ticks.map(v => `<line class="grid" x1="${L}" x2="${W - R}" y1="${r1(Y(v))}" y2="${r1(Y(v))}"/>` +
    `<text class="tk" x="${L - 5}" y="${r1(Y(v) + 4)}" text-anchor="end">${tickFmt(v, step)}</text>`).join('');
  if (units) s += `<text class="tk unit" x="4" y="11">${esc(prettyUnits(units))}</text>`;
  items.forEach((d, i) => {
    const x = L + i * bw + bw * 0.2, w = bw * 0.6, cx = x + w / 2;
    if (Number.isFinite(d.value)) {
      const y0 = Y(0), y1 = Y(d.value);
      s += `<rect class="bar ${d.value >= 0 ? 'pos' : 'neg'}" x="${r1(x)}" y="${r1(Math.min(y0, y1))}" width="${r1(w)}" height="${r1(Math.max(1, Math.abs(y1 - y0)))}" rx="2"/>`;
      const ly = d.value >= 0 ? y1 - 4 : y1 + 12;
      s += `<text class="val" x="${r1(cx)}" y="${r1(ly)}" text-anchor="middle">${signed(d.value, units)}</text>`;
    }
    const lines = cats[i], y = H - 6 - (lines.length - 1) * LINE;
    s += `<text class="tk cat" x="${r1(cx)}" y="${y}" text-anchor="middle">` + (lines.length === 1 ? esc(lines[0])
      : lines.map((l, k) => `<tspan x="${r1(cx)}" dy="${k ? LINE : 0}">${esc(l)}</tspan>`).join('')) + '</text>';
  });
  s += `<line class="zero" x1="${L}" x2="${W - R}" y1="${r1(Y(0))}" y2="${r1(Y(0))}"/>`;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = s;
}

/**
 * ninoStrip(svg, {times, anom, phases, onPick(i, event), marks:[{idx:[...], label}]})
 * Monthly Niño-3.4 anomaly bars over the El Niño / La Niña shading; marks outline chosen months.
 */
export function ninoStrip(svg, opts) {
  remember(svg, ninoStrip, [opts]);
  const { times, anom, phases, marks = [] } = opts;
  const [W, H] = size(svg);
  const L = 44, R = 10, T = 14, B = 20;
  const t0 = tDec(times[0]) - 1 / 24, t1 = tDec(times[times.length - 1]) + 1 / 24;
  const X = t => L + (t - t0) / (t1 - t0) * (W - L - R);
  // Symmetric range rounded up to half a degree; grid lines at ±1 and ±2 °C, labels only at ±2 so they never
  // crowd each other or meet the year labels at the bottom edge.
  const m = Math.max(2.5, Math.ceil(Math.max(...Array.from(anom).filter(Number.isFinite).map(Math.abs)) * 2) / 2);
  const Y = v => T + (m - v) / (2 * m) * (H - T - B);
  const bw = (W - L - R) / times.length;
  let s = shadeRects(phases, times, X, T, H - B);
  for (const v of [-2, -1, 1, 2]) {
    s += `<line class="grid" x1="${L}" x2="${W - R}" y1="${r1(Y(v))}" y2="${r1(Y(v))}"/>`;
    if (Math.abs(v) === 2) s += `<text class="tk" x="${L - 5}" y="${r1(Y(v) + 4)}" text-anchor="end">${v > 0 ? '+' : ''}${fmt(v, '', 0)}</text>`;
  }
  s += xYearAxis(t0, t1, X, T, H - B, W - L - R);
  times.forEach((t, i) => {
    const v = anom[i]; if (!Number.isFinite(v)) return;
    const x = X(tDec(t)) - bw / 2, y0 = Y(0), y1 = Y(v);
    s += `<rect class="nbar ${v >= 0 ? 'pos' : 'neg'}" x="${r1(x + 0.15 * bw)}" y="${r1(Math.min(y0, y1))}" width="${r1(Math.max(0.6, bw * 0.7))}" height="${r1(Math.max(0.5, Math.abs(y1 - y0)))}"/>`;
  });
  s += `<line class="zero" x1="${L}" x2="${W - R}" y1="${r1(Y(0))}" y2="${r1(Y(0))}"/>`;
  for (const mk of marks) {
    if (!mk.idx || !mk.idx.length) continue;
    const a = X(tDec(times[Math.min(...mk.idx)])) - bw / 2, b = X(tDec(times[Math.max(...mk.idx)])) + bw / 2;
    s += `<rect class="mark" x="${r1(a)}" y="${T}" width="${r1(Math.max(2, b - a))}" height="${H - B - T}"/>` +
      `<text class="mk" x="${r1((a + b) / 2)}" y="${T - 3}" text-anchor="middle">${esc(mk.label)}</text>`;
  }
  s += '<g class="hover"></g>';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = s;
  const hov = svg.querySelector('.hover');
  const idxAt = ev => {
    const r = svg.getBoundingClientRect(), x = ev.clientX - r.left;
    if (x < L || x > W - R) return -1;
    return Math.max(0, Math.min(times.length - 1, Math.floor((x - L) / bw)));
  };
  svg.onpointermove = ev => {
    const i = idxAt(ev);
    if (i < 0) { hov.innerHTML = ''; return; }
    const x = X(tDec(times[i]));
    hov.innerHTML = `<line class="cross" x1="${r1(x)}" x2="${r1(x)}" y1="${T}" y2="${H - B}"/>` +
      tooltip([tLabel(times[i]), `Niño-3.4: ${signed(anom[i], '', 2)} °C`], x, (T + H - B) / 2, W, H);
  };
  svg.onpointerleave = () => { hov.innerHTML = ''; };
  svg.onclick = opts.onPick ? ev => { const i = idxAt(ev); if (i >= 0) opts.onPick(i, ev); } : null;
  svg.style.cursor = opts.onPick ? 'pointer' : '';
}
