// View 3, Surface and column: TOA net, surface net and column net (TOA − surface) side by side, one shared colour
// range by default; a toggle splits the column into its shortwave and longwave parts. Annual or one average month
// of the 2010–2024 climatology. A click on any map picks a point: bars of the numbers there for the period shown,
// and their monthly series (2010–2025). The prompt asks the column question and nothing here answers it.
import { PROMPTS } from '../prompts.js';
import { fieldById } from '../fields.js';
import { rangeFor, robustSymRange } from '../colors.js';
import { createMap, fmtLatLon, coarsePointer } from '../map.js';
import { bars, timeSeries, redraw, downloadCSV, prettyUnits } from '../charts.js';
import { segmented, rangeLock, MONTH_NAMES } from '../controls.js';
import { ensoPhases } from '../timesel.js';
import { ALL_MONTHS, readoutValue, periodText } from './clim.js';

const NLON = 180;
export const id = 3;
export const title = 'Surface and column';
export const prompt = PROMPTS[3];
export const defaults = {
  maps: ['toa_net', 'sfc_net', 'col_net'],
  period: { clim: ALL_MONTHS.slice() },
  split: false,
  lock: true,                 // one colour range on every map
  point: [45, 105],           // 1°N, 149°W: central equatorial Pacific (as Free explore)
  series: 'raw',
  runningMean: true,
};
const SPLIT_MAPS = ['toa_net', 'sfc_net', 'col_sw', 'col_lw'];
/** Every field the view reads: the bars always show TOA, surface and column net, plus SW and LW when split. */
const ALL_IDS = ['toa_net', 'sfc_net', 'col_net', 'col_sw', 'col_lw'];
const LABELS = { toa_net: 'TOA', sfc_net: 'Surface', col_net: 'Column', col_sw: 'Column SW', col_lw: 'Column LW' };
const TITLES = { toa_net: 'Top of atmosphere, net', sfc_net: 'Surface, net', col_net: 'Column (atmosphere), net',
  col_sw: 'Column, shortwave', col_lw: 'Column, longwave' };

// ---------- pure helpers (tested under Node) ----------

/** Fields mapped: column net, or (split) its shortwave and longwave parts. */
export const mapsFor = split => (split ? SPLIT_MAPS : defaults.maps).slice();

/** One symmetric range wide enough for every field shown (each field's own mean range). */
export function sharedRange(fieldDefs) {
  const m = Math.max(...fieldDefs.map(f => rangeFor(f, 'mean')[1]));
  return [-m, m];
}

/** Bar items at flat cell k: TOA, surface, column (+ column SW and LW when split), from period-mean grids by id. */
export function barItems(grids, k, split) {
  const ids = split ? ALL_IDS : ALL_IDS.slice(0, 3);
  return ids.map(i => ({ label: LABELS[i], value: grids[i][k] }));
}

// ---------- view ----------

export function mount(el, data) {
  const { lat, lon } = data.meta;
  const phases = ensoPhases(data.nino.anom);
  const st = structuredClone(defaults);
  let dead = false, pending = 0, renders = 0, mapsDone = false, seriesDone = false;
  let grids = null, gms = null, shownMonths = null, csv = null, views = [];

  el.innerHTML = `
    <p class="prompt">${prompt}</p>
    <div class="panel ctl-bar controls" aria-label="Controls"></div>
    <h3 class="charttitle maps-title"></h3>
    <div class="maps"></div>
    <div class="pt-section">
      <div class="series-bar panel"></div>
      <div class="chartbox"><h3 class="charttitle bars-title"></h3><svg class="chart bars" role="img" aria-label="Bars at the picked point"></svg></div>
      <div class="chartbox"><h3 class="charttitle pt-title"></h3><svg class="chart ts pt" role="img" aria-label="Time series at the picked point"></svg></div>
    </div>`;
  const $ = s => el.querySelector(s);
  const panel = $('.controls');

  // ---- controls ----
  const pbox = document.createElement('div'); pbox.className = 'ctl w-period';
  pbox.innerHTML = `<label><span class="ctl-label">Period (2010–2024 average)</span>
    <select data-role="clim-month"><option value="0">Annual mean</option>${MONTH_NAMES.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('')}</select></label>`;
  panel.append(pbox);
  const monthSel = pbox.querySelector('select');
  monthSel.addEventListener('change', () => {
    const m = +monthSel.value;
    st.period = { clim: m === 0 ? ALL_MONTHS.slice() : [m] };
    updateMaps();
  });
  segmented(panel, { label: 'Column', role: 'split', value: st.split, options: [[false, 'Net'], [true, 'Shortwave and longwave']],
    onChange: v => { st.split = v; buildMaps(); drawMaps(); drawBars(); updateSeries(); } });
  rangeLock(panel, { value: st.lock, label: 'Same colour range on every map', onChange: on => { st.lock = on; drawMaps(); } });

  // ---- maps: one box per field, rebuilt when the column is split or joined ----
  function buildMaps() {
    for (const v of views) v.map.destroy();
    const host = $('.maps'), ids = mapsFor(st.split);
    host.className = `maps n${ids.length}`;
    host.innerHTML = ids.map(i => `<div class="mapbox" data-field="${i}"><h3 class="charttitle">${TITLES[i]}</h3>` +
      '<div class="map-host"></div><p class="readout gm">&nbsp;</p></div>').join('');
    views = ids.map((fid, n) => {
      const box = host.children[n], mh = box.querySelector('.map-host');
      // Four maps a row leaves ~300 px each: a shorter mouse hint keeps the readout on one line (touch keeps "Tap the map…").
      const map = createMap(mh, { lat, lon, coast: data.coast, ...(coarsePointer() ? {} : { hint: 'Hover to read; click to pick a point.' }) });
      map.onPick((iLat, iLon) => setPoint(iLat, iLon));
      if (!grids) map.setBusy('Loading…');
      return { id: fid, map, host: mh, gm: box.querySelector('.gm') };
    });
    markPoint();
  }
  function markPoint() {
    const [iLat, iLon] = st.point;
    for (const v of views) { v.map.mark(iLat, iLon); v.host.dataset.pick = `${iLat},${iLon}`; }
  }
  function setPoint(iLat, iLon) {
    st.point = [iLat, iLon];
    markPoint(); drawBars(); updateSeries();
  }

  // ---- series toolbar ----
  const bar = $('.series-bar');
  segmented(bar, { label: 'Time series', role: 'series', value: st.series, options: [['raw', 'Values'], ['anom', 'Anomaly']],
    onChange: v => { st.series = v; updateSeries(); } });
  const rmLab = document.createElement('label'); rmLab.className = 'ctl check';
  rmLab.innerHTML = '<input type="checkbox" data-role="running-mean" checked> 12-month running mean';
  rmLab.querySelector('input').addEventListener('change', e => { st.runningMean = e.target.checked; updateSeries(); });
  bar.append(rmLab);
  const dl = document.createElement('button'); dl.type = 'button'; dl.className = 'btn'; dl.dataset.role = 'csv';
  dl.textContent = 'Download CSV';
  dl.addEventListener('click', () => downloadCSV(csv));
  bar.append(dl);

  function settle() {
    if (dead) return;          // after unmount, #view belongs to the next view
    pending--; renders++;
    el.dataset.renders = String(renders);
    el.dataset.busy = String(pending);
    if (mapsDone && seriesDone && pending === 0) el.dataset.ready = '1';
  }
  const fail = (what, e) => { if (e && e.stale) return; console.error(`Surface and column: ${what} failed`, e); };

  // ---- maps + bars ----
  async function updateMaps() {
    const months = st.period.clim.slice(), sel = { mode: 'mean', a: { clim: months } };
    pending++; el.dataset.busy = String(pending);
    for (const v of views) v.map.setBusy('Loading…');
    try {
      // All five fields in one latest() guard, so the maps and bars always come from the same period.
      const res = await data.latest('column:maps')(Promise.all(ALL_IDS.map(i =>
        Promise.all([data.fieldMap(i, sel), data.fieldGlobalMean(i, sel)]))));
      if (dead) return;
      grids = Object.fromEntries(ALL_IDS.map((i, n) => [i, res[n][0]]));
      gms = Object.fromEntries(ALL_IDS.map((i, n) => [i, res[n][1]]));
      shownMonths = months;
      drawMaps(); drawBars();
      mapsDone = true;
    } catch (e) {
      if (!e || !e.stale) for (const v of views) v.map.setBusy('Could not load this map.');
      fail('maps', e);
    } finally { settle(); }
  }

  function drawMaps() {
    if (!grids) return;
    const defs = views.map(v => fieldById(data.fields, v.id)), shared = sharedRange(defs);
    $('.maps-title').textContent = `Net radiation into each part (positive = energy in): ${periodText(shownMonths)}`;
    views.forEach((v, n) => {
      const f = defs[n], g = grids[v.id];
      const range = st.lock ? shared : robustSymRange(g, 0.98, rangeFor(f, 'mean')[1]);
      v.map.draw(g, { lo: range[0], hi: range[1], cmap: 'div', units: f.units, label: f.label });
      v.map.setBusy(false);
      v.gm.innerHTML = `Global mean: <b class="nowrap">${readoutValue(gms[v.id], f.units, true)}&nbsp;${prettyUnits(f.units).replace(' ', '&nbsp;')}</b>`;
    });
  }

  function drawBars() {
    if (!grids) return;
    const [iLat, iLon] = st.point;
    $('.bars-title').textContent = `At ${fmtLatLon(lat[iLat], lon[iLon])}: ${periodText(shownMonths)}`;
    bars($('.bars'), barItems(grids, iLat * NLON + iLon, st.split), { units: 'W m-2' });
  }

  // ---- series at the point: the fields mapped ----
  async function updateSeries() {
    const ids = mapsFor(st.split), [iLat, iLon] = st.point, anom = st.series === 'anom';
    pending++; el.dataset.busy = String(pending);
    try {
      const pts = await data.latest('column:point')(Promise.all(ids.map(i => data.fieldPoint(i, iLat, iLon, { anomaly: anom }))));
      if (dead) return;
      const where = fmtLatLon(lat[iLat], lon[iLon]);
      $('.pt-title').textContent = `Net radiation at ${where}${anom ? ', anomaly' : ''} (W m⁻²)` +
        (st.runningMean ? '; thin lines monthly, thick lines 12-month mean' : '');
      timeSeries($('.pt'), { times: data.meta.times, shade: phases, runningMean: st.runningMean, units: 'W m-2', legend: 'series',
        series: ids.map((i, n) => ({ values: pts[n], label: LABELS[i], style: `s${n}` })) });
      const sfx = anom ? '_anom' : '';
      csv = { name: `ceres_column${sfx}_lat${lat[iLat]}_lon${lon[iLon]}.csv`, times: data.meta.times,
        columns: { ...Object.fromEntries(ids.map((i, n) => [`${i}${sfx}_lat${lat[iLat]}_lon${lon[iLon]}`, pts[n]])), nino34_anom: data.nino.anom } };
      seriesDone = true;
    } catch (e) { fail('time series', e); } finally { settle(); }
  }

  const ro = new ResizeObserver(() => { for (const s of el.querySelectorAll('svg.bars, svg.ts')) redraw(s); });
  ro.observe($('.pt-section'));

  buildMaps();
  updateMaps(); updateSeries();
  return {
    unmount() { dead = true; ro.disconnect(); for (const v of views) v.map.destroy(); el.innerHTML = ''; },
  };
}

export default { id, title, prompt, defaults, mount };
