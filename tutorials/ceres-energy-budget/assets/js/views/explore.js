// View 5, Free explore: any field; mean, anomaly or A − B; a month, season, year or span of years.
// Map + zonal mean + time series at the clicked point + global-mean series, Niño-3.4 shading, CSV export.
import { parseTimes, ensoPhases, monthlyAnomaly } from '../timesel.js';
import { fieldById } from '../fields.js';
import { rangeFor, robustSymRange } from '../colors.js';
import { createMap, fmtLatLon, cellsIn } from '../map.js';
import { timeSeries, zonalPanel, ninoStrip, redraw, downloadCSV, signed, prettyUnits } from '../charts.js';
import { PROMPTS } from '../prompts.js';
import { fieldPicker, modePicker, periodPicker, segmented, rangeLock, periodSel, periodLabel, sameMonthMix } from '../controls.js';

const NLAT = 90, NLON = 180;

export const id = 5;
export const title = 'Free explore';
export const prompt = PROMPTS[5];
export const defaults = {
  field: 'toa_net',
  mode: 'mean',
  a: { kind: 'clim', month: 0 },
  b: { kind: 'span', y0: 2010, y1: 2010 },
  point: [45, 105],            // 1°N, 149°W: central equatorial Pacific
  centre: 180,
  extent: 'global',
  series: 'raw',
  runningMean: true,
};

const KINDS = { mean: ['clim', 'month', 'season', 'span'], anomaly: ['month', 'season', 'span'], diff: ['clim', 'month', 'season', 'span'] };
const PACIFIC_LON = [100, 300];

/** Mean over longitudes in [l0, l1] (0–360) for each latitude row, NaN-skipping. */
function zonalOver(grid, lon, l0, l1) {
  const out = new Float64Array(NLAT);
  for (let i = 0; i < NLAT; i++) {
    let s = 0, c = 0;
    for (let j = 0; j < NLON; j++) {
      if (lon[j] < l0 || lon[j] > l1) continue;
      const v = grid[i * NLON + j];
      if (!Number.isNaN(v)) { s += v; c++; }
    }
    out[i] = c ? s / c : NaN;
  }
  return out;
}

export function mount(el, data) {
  const T = parseTimes(data.meta.times), { lat, lon } = data.meta;
  const phases = ensoPhases(data.nino.anom);
  const st = structuredClone(defaults);
  let dead = false, pending = 0, renders = 0, mapDone = false, seriesDone = false;
  let lockRange = null, lockKey = null, lastRange = null, csv = null;

  el.innerHTML = `
    <p class="prompt">${prompt}</p>
    <div class="ex-main">
      <aside class="panel controls" aria-label="Controls"></aside>
      <h3 class="charttitle map-title"></h3>
      <div class="map-host"></div>
      <h3 class="charttitle zonal-title">Zonal mean</h3>
      <div class="zonal-host"><svg class="chart zonal" role="img" aria-label="Zonal mean"></svg></div>
    </div>
    <div class="ex-series">
      <div class="series-bar panel"></div>
      <div class="chartbox"><h3 class="charttitle pt-title"></h3><svg class="chart ts pt" role="img"></svg></div>
      <div class="chartbox"><h3 class="charttitle gl-title"></h3><svg class="chart ts gl" role="img"></svg></div>
      <div class="chartbox wide"><h3 class="charttitle">Niño-3.4 index (°C). Click a month to map it.</h3><svg class="chart nino" role="img" aria-label="Niño-3.4 index"></svg></div>
    </div>`;
  const $ = s => el.querySelector(s);
  const panel = $('.controls');

  // ---- controls ----
  const fp = fieldPicker(panel, data.fields, { value: st.field, onChange: v => { st.field = v; unlock(); update(); } });
  const mp = modePicker(panel, { value: st.mode, onChange: v => {
    st.mode = v; unlock();
    pa.setKinds(KINDS[v]); st.a = pa.value;
    pb.el.hidden = v !== 'diff';
    pa.el.querySelector('legend').textContent = v === 'diff' ? 'Period A' : 'Period';
    updateMap();
  } });
  const pa = periodPicker(panel, T, { kinds: KINDS[st.mode], value: st.a, label: 'Period', name: 'a', onChange: v => { st.a = v; updateMap(); } });
  const pb = periodPicker(panel, T, { kinds: KINDS.diff, value: st.b, label: 'Period B', name: 'b', onChange: v => { st.b = v; updateMap(); } });
  pb.el.hidden = true;
  const viewRow = document.createElement('div'); viewRow.className = 'ctl-row'; panel.append(viewRow);
  const centreSeg = segmented(viewRow, { label: 'Centre', role: 'centre', value: st.centre, options: [[180, '180°'], [0, '0°']],
    onChange: v => { st.centre = v; map.setCentre(v); } });
  segmented(viewRow, { label: 'Area', role: 'extent', value: st.extent, options: [['global', 'Globe'], ['pacific', 'Pacific']],
    onChange: v => {
      st.extent = v; map.setExtent(v); paintCentre();
      drawMap(); drawZonal();     // an auto colour range depends on the cells in view
    } });
  // The Pacific window (100°E–60°W) is always drawn centred on the Pacific, so the centre choice does not apply:
  // disabled, and neither choice shown as pressed (as the sky toggle in views 1–2).
  function paintCentre() {
    const off = st.extent === 'pacific';
    for (const b of centreSeg.el.querySelectorAll('button')) {
      b.disabled = off;
      b.setAttribute('aria-pressed', String(!off && b.dataset.value === String(st.centre)));
    }
  }
  const lock = rangeLock(panel, { onChange: on => {
    if (on && lastRange) { lockRange = lastRange.slice(); lockKey = keyOf(); } else { lockRange = lockKey = null; }
  } });
  const gread = document.createElement('p'); gread.className = 'readout global-readout'; panel.append(gread);

  // ---- map ----
  const map = createMap($('.map-host'), { lat, lon, coast: data.coast });
  map.onPick((iLat, iLon) => { st.point = [iLat, iLon]; map.mark(iLat, iLon); $('.map-host').dataset.pick = `${iLat},${iLon}`; updateSeries(); });
  map.mark(...st.point);
  $('.map-host').dataset.pick = st.point.join(',');

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

  const fieldDef = () => fieldById(data.fields, st.field);
  const keyOf = () => `${st.field}:${st.mode === 'mean' ? 'mean' : 'anom'}`;
  function unlock() { lock.set(false); lockRange = lockKey = null; }

  function settle() {
    if (dead) return;          // after unmount, #view belongs to the next view
    pending--;
    renders++;
    el.dataset.renders = String(renders);
    el.dataset.busy = String(pending);
    if (mapDone && seriesDone && pending === 0) el.dataset.ready = '1';
  }
  const fail = (what, e) => {
    if (e && e.stale) return;
    console.error(`Free explore: ${what} failed`, e);
  };

  // ---- map + zonal ----
  let grid = null, shown = null;   // shown: what `grid` is (field, mode, periods), for redraws without a fetch
  async function updateMap() {
    const f = fieldDef(), selA = periodSel(st.a, T), selB = st.mode === 'diff' ? periodSel(st.b, T) : null;
    if (!selA || (st.mode === 'diff' && !selB)) {
      data.latest('explore:map');   // supersede any request in flight, so an older map cannot land after this
      map.setBusy('That period is not in the record.');
      return;
    }
    pending++; el.dataset.busy = String(pending);
    map.setBusy('Loading…');
    try {
      const sel = { mode: st.mode, a: selA, b: selB || undefined };
      const [g, gm] = await data.latest('explore:map')(Promise.all([data.fieldMap(f.id, sel), data.fieldGlobalMean(f.id, sel)]));
      if (dead) return;
      grid = g;
      shown = { f, mode: st.mode, selA, selB, what: st.mode === 'mean' ? periodLabel(st.a)
        : st.mode === 'anomaly' ? `anomaly, ${periodLabel(st.a)}`
          : `${periodLabel(st.a)} minus ${periodLabel(st.b)}` };
      drawMap();
      map.setBusy(false);
      $('.map-title').textContent = `${f.label}: ${shown.what}`;
      gread.innerHTML = `Mean over the whole globe: <b class="nowrap">${signed(gm, f.units)}&nbsp;${prettyUnits(f.units).replace(' ', '&nbsp;')}</b>`;
      drawZonal();
      drawNino();
      mapDone = true;
    } catch (e) {
      if (!e || !e.stale) map.setBusy('Could not load this map.');
      fail('map', e);
    } finally { settle(); }
  }

  // Colour range: A − B with different month mixes auto-ranges over the cells in view; otherwise the field's range.
  function drawMap() {
    if (!grid) return;
    const { f, mode, selA, selB } = shown;
    let range;
    if (mode === 'diff' && !sameMonthMix(selA, selB, T)) {
      range = robustSymRange(Array.from(cellsIn(st.extent, lat, lon), k => grid[k]), 0.98, f.range_anom);
    } else range = rangeFor(f, mode);
    if (lock.locked && lockKey === keyOf() && lockRange) range = lockRange;
    lastRange = range;
    const cmap = mode === 'mean' && f.kind === 'seq' ? 'seq' : 'div';
    map.draw(grid, { lo: range[0], hi: range[1], cmap, units: f.units, label: f.label });
  }

  function drawZonal() {
    if (!grid) return;
    const f = shown.f, pac = st.extent === 'pacific';
    const values = zonalOver(grid, lon, ...(pac ? PACIFIC_LON : [0, 360]));
    $('.zonal-title').textContent = `${pac ? 'Mean, 100°E–60°W' : 'Zonal mean'} (${prettyUnits(f.units)})`;
    sizeZonal();
    zonalPanel($('.zonal'), { lat, lines: [{ values, label: f.label }], latRange: pac ? [-30, 30] : [-90, 90], units: f.units, plotTop: 0 });
  }
  // Beside the map, the zonal plot area is exactly as tall as the map so latitudes line up; stacked, it is fixed.
  function sizeZonal() {
    const z = $('.zonal'), wrap = $('.map-wrap');
    const beside = Math.abs(z.parentElement.getBoundingClientRect().top - wrap.getBoundingClientRect().top) < 4;
    const want = beside ? Math.round(wrap.getBoundingClientRect().height) + 20 : 220;
    if (Math.abs(parseFloat(z.style.height || 0) - want) > 0.5) z.style.height = want + 'px';
  }

  function drawNino() {
    const marks = [];
    const a = periodSel(st.a, T);
    if (a && a.idx) marks.push({ idx: a.idx, label: 'A' });
    if (st.mode === 'diff') { const b = periodSel(st.b, T); if (b && b.idx) marks.push({ idx: b.idx, label: 'B' }); }
    if (st.mode !== 'diff' && marks[0]) marks[0].label = '';
    ninoStrip($('.nino'), { times: data.meta.times, anom: data.nino.anom, phases, marks, onPick: i => {
      const v = { kind: 'month', y: T[i].y, m: T[i].m };
      pa.set(v); st.a = pa.value; updateMap();
    } });
  }

  // ---- series ----
  async function updateSeries() {
    const f = fieldDef(), [iLat, iLon] = st.point, anom = st.series === 'anom';
    pending++; el.dataset.busy = String(pending);
    try {
      const pt = await data.latest('explore:point')(data.fieldPoint(f.id, iLat, iLon, { anomaly: anom }));
      if (dead) return;
      const g0 = data.globalSeries(f.id), gl = anom ? monthlyAnomaly(g0, T, 2010, 2024) : g0;
      const u = prettyUnits(f.units), lab = anom ? 'Monthly anomaly' : 'Monthly';
      const where = fmtLatLon(lat[iLat], lon[iLon]);
      $('.pt-title').textContent = `${f.label} at ${where}${anom ? ', anomaly' : ''} (${u})`;
      $('.gl-title').textContent = `${f.label}, global mean${anom ? ', anomaly' : ''} (${u})`;
      const common = { times: data.meta.times, shade: phases, runningMean: st.runningMean, units: f.units };
      timeSeries($('.pt'), { ...common, series: [{ values: pt, label: lab, style: 's0' }] });
      timeSeries($('.gl'), { ...common, series: [{ values: gl, label: lab, style: 's0' }], trend: true });
      const sfx = anom ? '_anom' : '';
      csv = { name: `ceres_${f.id}${sfx}_lat${lat[iLat]}_lon${lon[iLon]}.csv`, times: data.meta.times,
        columns: { [`${f.id}${sfx}_lat${lat[iLat]}_lon${lon[iLon]}`]: pt, [`${f.id}${sfx}_global`]: gl, nino34_anom: data.nino.anom } };
      seriesDone = true;
    } catch (e) { fail('time series', e); } finally { settle(); }
  }

  function update() { updateMap(); updateSeries(); }

  const ro = new ResizeObserver(() => {
    if (grid) { sizeZonal(); redraw($('.zonal')); }
    for (const s of el.querySelectorAll('svg.ts, svg.nino')) redraw(s);
  });
  ro.observe($('.map-host')); ro.observe($('.ex-series'));

  update();
  return {
    unmount() { dead = true; ro.disconnect(); map.destroy(); el.innerHTML = ''; },
  };
}

export default { id, title, prompt, defaults, mount };
