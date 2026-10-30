// Shared mount for the guided climatology views (1 Top of atmosphere, 2 Clouds): a field picker limited to the
// view's fields, Annual / one of the 12 climatological months (optional play button), optional all-sky/clear-sky
// toggle, map + zonal panel, a global-mean readout (data.fieldGlobalMean), and an optional extra block below.
import { fieldById } from '../fields.js';
import { rangeFor } from '../colors.js';
import { createMap } from '../map.js';
import { zonalPanel, redraw, prettyUnits } from '../charts.js';
import { fieldPicker, segmented, MONTH_NAMES } from '../controls.js';
import { ALL_MONTHS, readoutValue, zonalClimMean, periodText } from './clim.js';

const PLAY_MS = 700;

/**
 * cfg: {key, prompt, defaults:{field, period, sky?}, fields, clearSky?, play?, zonalLines(fieldId) -> [[id, label]],
 *       below?: {html, draw($, data) -> Promise}}
 */
export function mountClimView(el, data, cfg) {
  const { lat, lon } = data.meta;
  const st = structuredClone(cfg.defaults);
  let dead = false, pending = 0, renders = 0, mapDone = false, belowDone = !cfg.below, timer = null;

  el.innerHTML = `
    <p class="prompt">${cfg.prompt}</p>
    <div class="ex-main">
      <aside class="panel controls" aria-label="Controls"></aside>
      <h3 class="charttitle map-title"></h3>
      <div class="map-host"></div>
      <h3 class="charttitle zonal-title">Zonal mean</h3>
      <div class="zonal-host"><svg class="chart zonal" role="img" aria-label="Zonal mean"></svg></div>
    </div>
    ${cfg.below ? cfg.below.html : ''}`;
  const $ = s => el.querySelector(s);
  const panel = $('.controls');

  // ---- controls ----
  fieldPicker(panel, data.fields, { ids: cfg.fields, value: st.field, onChange: v => { st.field = v; paintSky(); update(); } });
  const pbox = document.createElement('div'); pbox.className = 'ctl period-clim';
  pbox.innerHTML = `<label><span class="ctl-label">Period (2010–2024 average)</span>
    <select data-role="clim-month"><option value="0">Annual mean</option>${MONTH_NAMES.map((m, i) => `<option value="${i + 1}">${m}</option>`).join('')}</select></label>`;
  panel.append(pbox);
  const monthSel = pbox.querySelector('select');
  const curMonth = () => (st.period.clim.length === 12 ? 0 : st.period.clim[0]);
  monthSel.value = String(curMonth());
  monthSel.addEventListener('change', () => { stop(); setMonth(+monthSel.value); });
  let playBtn = null;
  if (cfg.play) {
    playBtn = document.createElement('button');
    playBtn.type = 'button'; playBtn.className = 'btn play'; playBtn.dataset.role = 'play';
    playBtn.textContent = '▶ Play the months'; playBtn.setAttribute('aria-pressed', 'false');
    playBtn.addEventListener('click', () => (timer ? stop() : start()));
    pbox.append(playBtn);
  }
  let skySeg = null;
  if (cfg.clearSky) {
    skySeg = segmented(panel, { label: 'Sky (OLR and ASR only)', role: 'sky', value: st.sky,
      options: [['all', 'All-sky'], ['clr', 'Clear-sky']], onChange: v => { st.sky = v; update(); } });
  }
  const gread = document.createElement('p'); gread.className = 'readout global-readout'; panel.append(gread);

  function paintSky() {
    if (!skySeg) return;
    const on = st.field in cfg.clearSky;
    // Disabled: show neither choice as pressed, so the toggle does not look active.
    for (const b of skySeg.el.querySelectorAll('button')) {
      b.disabled = !on;
      b.setAttribute('aria-pressed', String(on && b.dataset.value === st.sky));
    }
  }
  paintSky();

  function setMonth(m) {
    st.period = { clim: m === 0 ? ALL_MONTHS.slice() : [m] };
    monthSel.value = String(m);
    updateMap();
  }
  function start() {
    playBtn.textContent = '❚❚ Pause'; playBtn.setAttribute('aria-pressed', 'true');
    const step = () => { const m = curMonth(); setMonth(m >= 12 ? 1 : m + 1); };
    step();
    timer = setInterval(step, PLAY_MS);
  }
  function stop() {
    if (!timer) return;
    clearInterval(timer); timer = null;
    playBtn.textContent = '▶ Play the months'; playBtn.setAttribute('aria-pressed', 'false');
  }

  // ---- map ----
  const map = createMap($('.map-host'), { lat, lon, coast: data.coast, pick: false });

  const shownId = () => (cfg.clearSky && st.sky === 'clr' && cfg.clearSky[st.field]) || st.field;

  function settle() {
    if (dead) return;
    pending--; renders++;
    el.dataset.renders = String(renders);
    el.dataset.busy = String(pending);
    if (mapDone && belowDone && pending === 0) el.dataset.ready = '1';
  }
  const fail = (what, e) => { if (e && e.stale) return; console.error(`${cfg.key}: ${what} failed`, e); };

  let zLines = null;
  async function updateMap() {
    const id = shownId(), f = fieldById(data.fields, id), months = st.period.clim.slice();
    pending++; el.dataset.busy = String(pending);
    map.setBusy('Loading…');
    try {
      const zIds = cfg.zonalLines(id);
      // One latest() guard over map and zonal together, so a slow older request can never overwrite a newer one.
      const sel = { mode: 'mean', a: { clim: months } };
      const [g, gm, zs] = await data.latest(`${cfg.key}:map`)(Promise.all([
        data.fieldMap(id, sel), data.fieldGlobalMean(id, sel),
        Promise.all(zIds.map(([z]) => data.zonal(z))),
      ]));
      if (dead) return;
      const range = rangeFor(f, 'mean');
      map.draw(g, { lo: range[0], hi: range[1], cmap: f.kind === 'seq' ? 'seq' : 'div', units: f.units, label: f.label });
      map.setBusy(false);
      $('.map-title').textContent = `${f.label}: ${periodText(months)}`;
      const v = readoutValue(gm, f.units, f.kind === 'div');
      const u = f.units === 'fraction' ? '' : '&nbsp;' + prettyUnits(f.units).replace(' ', '&nbsp;');
      gread.innerHTML = `Global mean, ${months.length === 12 ? 'annual' : MONTH_NAMES[months[0] - 1]}: <b class="nowrap">${v}${u}</b>`;
      const zu = fieldById(data.fields, zIds[0][0]).units;
      zLines = { lines: zIds.map(([, label], i) => ({ values: zonalClimMean(zs[i], months), label })), units: zu,
        title: `Zonal mean (${prettyUnits(zu)})` };
      drawZonal();
      mapDone = true;
    } catch (e) {
      if (!e || !e.stale) map.setBusy('Could not load this map.');
      fail('map', e);
    } finally { settle(); }
  }

  function drawZonal() {
    if (!zLines) return;
    $('.zonal-title').textContent = zLines.title;
    sizeZonal();
    zonalPanel($('.zonal'), { lat, lines: zLines.lines, latRange: [-90, 90], units: zLines.units, plotTop: 0 });
  }
  function sizeZonal() {
    const z = $('.zonal'), wrap = $('.map-wrap');
    const beside = Math.abs(z.parentElement.getBoundingClientRect().top - wrap.getBoundingClientRect().top) < 4;
    const legend = zLines && zLines.lines.length > 1 ? 24 : 0;
    const want = beside ? Math.round(wrap.getBoundingClientRect().height) + 20 + legend : 220 + legend;
    if (Math.abs(parseFloat(z.style.height || 0) - want) > 0.5) z.style.height = want + 'px';
  }

  async function updateBelow() {
    if (!cfg.below) return;
    pending++; el.dataset.busy = String(pending);
    try { await cfg.below.draw($, data); if (!dead) belowDone = true; } catch (e) { fail('series', e); } finally { settle(); }
  }

  function update() { updateMap(); }

  const ro = new ResizeObserver(() => {
    if (zLines) { sizeZonal(); redraw($('.zonal')); }
    for (const s of el.querySelectorAll('svg.ts')) redraw(s);
  });
  ro.observe($('.map-host'));

  updateMap(); updateBelow();
  return {
    unmount() { dead = true; stop(); ro.disconnect(); map.destroy(); el.innerHTML = ''; },
  };
}
