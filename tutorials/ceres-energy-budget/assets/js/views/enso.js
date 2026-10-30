// View 4, El Niño vs La Niña: a Niño-3.4 strip with El Niño / La Niña shading; a season (DJF, MAM, JJA, SON or the
// July–June year) and two years A and B, only complete seasons offered. Three maps: A's anomaly, B's anomaly and
// A − B (computed here from the two anomaly maps) with one symmetric colour range from the cells in view. Any field;
// Globe or Pacific. A click on the strip sets A (or the year chosen in "The strip sets"), shift-click the other one.
import { PROMPTS } from '../prompts.js';
import { fieldById } from '../fields.js';
import { robustSymRange } from '../colors.js';
import { createMap, cellsIn, coarsePointer } from '../map.js';
import { ninoStrip, redraw, prettyUnits } from '../charts.js';
import { fieldPicker, segmented, rangeLock, periodLabel } from '../controls.js';
import { parseTimes, seasonIdx, seasonYears, ensoPhases } from '../timesel.js';
import { readoutValue } from './clim.js';

export const id = 4;
export const title = 'El Niño vs La Niña';
export const prompt = PROMPTS[4];
export const defaults = { season: 'DJF', a: 2015, b: 2010, field: 'olr', extent: 'pacific' };
const SEASONS = [['DJF', 'DJF (Dec–Feb)'], ['MAM', 'MAM (Mar–May)'], ['JJA', 'JJA (Jun–Aug)'], ['SON', 'SON (Sep–Nov)'],
  ['ANN', 'Jul–Jun year']];

// ---------- pure helpers (tested under Node) ----------

/** Years offered for a season: the complete seasons on record (DJF 2015 = Dec 2015 + Jan–Feb 2016). */
export const yearOptions = (times, season) => seasonYears(times, season);

/** Season year for a click on month index i: the season (on record) whose months are nearest to i; ties go to
 *  the later season, since an ENSO event grows through the year before the season it peaks in. */
export function seasonForClick(times, season, i) {
  let best = null, bd = Infinity;
  for (const y of seasonYears(times, season)) {
    const d = Math.min(...seasonIdx(times, season, y).map(t => Math.abs(t - i)));
    if (d <= bd) { bd = d; best = y; }
  }
  return best;
}

/** a − b, cell by cell (NaN where either is NaN). */
export function diffGrid(a, b) {
  const out = new Float64Array(a.length);
  for (let k = 0; k < a.length; k++) out[k] = a[k] - b[k];
  return out;
}

/** One symmetric colour range for several maps: the 98th percentile of |value| over the given cells of all of
 *  them, rounded up to a nice number (robustSymRange); ±fallback if there is nothing to go on. */
export function symRangeOver(grids, cells, fallback) {
  const vals = new Float64Array(grids.length * cells.length);
  let n = 0;
  for (const g of grids) for (const k of cells) vals[n++] = g[k];
  return robustSymRange(vals, 0.98, fallback);
}

/** Anomaly maps of A and B, A − B from those two maps, and the global-mean anomaly of each (data.fieldGlobalMean). */
export async function ensoGrids(data, fid, selA, selB) {
  const [a, b, gmA, gmB] = await Promise.all([
    data.fieldMap(fid, { mode: 'anomaly', a: selA }), data.fieldMap(fid, { mode: 'anomaly', a: selB }),
    data.fieldGlobalMean(fid, { mode: 'anomaly', a: selA }), data.fieldGlobalMean(fid, { mode: 'anomaly', a: selB }),
  ]);
  return { a, b, d: diffGrid(a, b), gmA, gmB };
}

// ---------- view ----------

const yearText = (season, y) => (season === 'DJF' || season === 'ANN' ? `${y}–${String((y + 1) % 100).padStart(2, '0')}` : String(y));

export function mount(el, data) {
  const T = parseTimes(data.meta.times), { lat, lon } = data.meta;
  const phases = ensoPhases(data.nino.anom);
  const st = { ...structuredClone(defaults), target: 'a' };
  let dead = false, pending = 0, renders = 0, mapsDone = false;
  let shown = null, lockRange = null, lockField = null;

  el.innerHTML = `
    <p class="prompt">${prompt}</p>
    <div class="panel ctl-bar controls" aria-label="Controls"></div>
    <div class="chartbox nino-box"><h3 class="charttitle">Niño-3.4 index (°C): El Niño spells shaded red, La Niña blue</h3>
      <svg class="chart nino" role="img" aria-label="Niño-3.4 index"></svg><p class="hint"></p></div>
    <h3 class="charttitle maps-title"></h3>
    <div class="maps n3">
      ${['a', 'b', 'd'].map(w => `<div class="mapbox" data-map="${w}"><h3 class="charttitle"></h3><div class="map-host"></div><p class="readout gm">&nbsp;</p></div>`).join('')}
    </div>`;
  const $ = s => el.querySelector(s);
  const panel = $('.controls');

  // ---- controls ----
  const fp = fieldPicker(panel, data.fields, { value: st.field, onChange: v => { st.field = v; update(); } });
  fp.el.classList.add('w-field');
  const mk = (cls, role, label) => {
    const box = document.createElement('div'); box.className = `ctl ${cls}`;
    box.innerHTML = `<label><span class="ctl-label">${label}</span><select data-role="${role}"></select></label>`;
    panel.append(box);
    return box.querySelector('select');
  };
  const seasonSel = mk('w-season', 'season', 'Season');
  seasonSel.innerHTML = SEASONS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  seasonSel.value = st.season;
  const yearA = mk('w-year', 'year-a', 'Year A'), yearB = mk('w-year', 'year-b', 'Year B');
  function fillYears() {
    const ys = yearOptions(T, st.season);
    const near = y => (ys.includes(y) ? y : ys.reduce((p, q) => (Math.abs(q - y) < Math.abs(p - y) ? q : p)));
    st.a = near(st.a); st.b = near(st.b);
    for (const s of [yearA, yearB]) s.innerHTML = ys.map(y => `<option value="${y}">${yearText(st.season, y)}</option>`).join('');
    yearA.value = String(st.a); yearB.value = String(st.b);
  }
  fillYears();
  seasonSel.addEventListener('change', () => { st.season = seasonSel.value; fillYears(); update(); });
  yearA.addEventListener('change', () => { st.a = +yearA.value; update(); });
  yearB.addEventListener('change', () => { st.b = +yearB.value; update(); });
  segmented(panel, { label: 'Area', role: 'extent', value: st.extent, options: [['global', 'Globe'], ['pacific', 'Pacific']],
    onChange: v => { st.extent = v; for (const m of maps) m.map.setExtent(v); drawMaps(); } });
  // Touch screens have no shift key: this toggle says which year a tap on the strip sets.
  segmented(panel, { label: 'The strip sets', role: 'strip-target', value: st.target, options: [['a', 'Year A'], ['b', 'Year B']],
    onChange: v => { st.target = v; paintHint(); } });
  const lock = rangeLock(panel, { onChange: on => {
    if (on && shown) { lockRange = shown.range.slice(); lockField = shown.f.id; } else { lockRange = lockField = null; }
  } });

  function paintHint() {
    const t = st.target.toUpperCase(), o = st.target === 'a' ? 'B' : 'A';
    $('.nino-box .hint').textContent = coarsePointer() ? `Tap a month to set year ${t}.`
      : `Click a month to set year ${t}; shift-click to set year ${o}.`;
  }
  paintHint();

  // ---- maps (they read values; they do not pick points) ----
  const maps = ['a', 'b', 'd'].map(w => {
    const box = $(`.mapbox[data-map="${w}"]`);
    const map = createMap(box.querySelector('.map-host'), { lat, lon, coast: data.coast, pick: false });
    map.setExtent(st.extent);
    return { w, map, title: box.querySelector('.charttitle'), gm: box.querySelector('.gm') };
  });

  const selOf = y => ({ idx: seasonIdx(T, st.season, y) });

  function drawNino() {
    const ia = seasonIdx(T, st.season, st.a), ib = seasonIdx(T, st.season, st.b);
    ninoStrip($('.nino'), { times: data.meta.times, anom: data.nino.anom, phases,
      marks: [{ idx: ia, label: 'A' }, { idx: ib, label: 'B' }],
      onPick: (i, ev) => {
        const which = ev && ev.shiftKey ? (st.target === 'a' ? 'b' : 'a') : st.target;
        const y = seasonForClick(T, st.season, i);
        if (y === null || y === st[which]) return;
        st[which] = y;
        (which === 'a' ? yearA : yearB).value = String(y);
        update();
      } });
  }

  function settle() {
    if (dead) return;
    pending--; renders++;
    el.dataset.renders = String(renders);
    el.dataset.busy = String(pending);
    if (mapsDone && pending === 0) el.dataset.ready = '1';
  }
  const fail = (what, e) => { if (e && e.stale) return; console.error(`El Niño vs La Niña: ${what} failed`, e); };

  async function update() {
    const f = fieldById(data.fields, st.field), season = st.season, ya = st.a, yb = st.b;
    drawNino();
    if (lock.locked && lockField !== f.id) { lock.set(false); lockRange = lockField = null; }   // a new field: new range
    pending++; el.dataset.busy = String(pending);
    for (const m of maps) m.map.setBusy('Loading…');
    try {
      const g = await data.latest('enso:maps')(ensoGrids(data, f.id, selOf(ya), selOf(yb)));
      if (dead) return;
      shown = { f, season, ya, yb, ...g, range: null };
      drawMaps();
      mapsDone = true;
    } catch (e) {
      if (!e || !e.stale) for (const m of maps) m.map.setBusy('Could not load this map.');
      fail('maps', e);
    } finally { settle(); }
  }

  // Shared symmetric range over the cells in view of all three maps (recomputed when the area changes), unless fixed.
  function drawMaps() {
    if (!shown) return;
    const { f, season, ya, yb } = shown;
    const range = lock.locked && lockRange ? lockRange
      : symRangeOver([shown.a, shown.b, shown.d], cellsIn(st.extent, lat, lon), f.range_anom);
    shown.range = range;
    const u = f.units === 'fraction' ? '' : '&nbsp;' + prettyUnits(f.units).replace(' ', '&nbsp;');
    const val = v => `<b class="nowrap">${readoutValue(v, f.units, true)}${u}</b>`;
    const la = periodLabel({ kind: 'season', season, y: ya }), lb = periodLabel({ kind: 'season', season, y: yb });
    $('.maps-title').textContent = `${f.label}: anomaly from the 2010–2024 average of the same months`;
    const parts = { a: [shown.a, `A: ${la}`, `Global-mean anomaly: ${val(shown.gmA)}`],
      b: [shown.b, `B: ${lb}`, `Global-mean anomaly: ${val(shown.gmB)}`],
      d: [shown.d, 'A − B', `Global mean, A − B: ${val(shown.gmA - shown.gmB)}`] };
    for (const m of maps) {
      const [g, t, gm] = parts[m.w];
      m.map.draw(g, { lo: range[0], hi: range[1], cmap: 'div', units: f.units, label: f.label });
      m.map.setBusy(false);
      m.title.textContent = t;
      m.gm.innerHTML = gm;
    }
  }

  const ro = new ResizeObserver(() => redraw($('.nino')));
  ro.observe($('.nino-box'));

  update();
  return {
    unmount() { dead = true; ro.disconnect(); for (const m of maps) m.map.destroy(); el.innerHTML = ''; },
  };
}

export default { id, title, prompt, defaults, mount };
