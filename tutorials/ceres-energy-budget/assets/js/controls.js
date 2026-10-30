// Shared controls: field picker, period picker, segmented buttons (mode etc.), colour-range lock.
// The period helpers at the top are pure (no DOM) and are tested under Node.
import { monthIdx, seasonIdx, seasonYears, spanIdx } from './timesel.js';

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December'];
const SEASONS = [['DJF', 'DJF (Dec–Feb)'], ['MAM', 'MAM (Mar–May)'], ['JJA', 'JJA (Jun–Aug)'], ['SON', 'SON (Sep–Nov)'],
  ['ANN', 'Jul–Jun year']];
const KIND_TEXT = { clim: 'Average month or year', month: 'One month', season: 'One season', span: 'Calendar years' };

// ---------- pure period helpers ----------

/** Year choices that are fully on the record: seasons via seasonYears, spans = complete calendar years. */
export function periodChoices(times) {
  const ys = [...new Set(times.map(t => t.y))];
  return {
    seasonYears: Object.fromEntries(SEASONS.map(([s]) => [s, seasonYears(times, s)])),
    spanYears: ys.filter(y => times.filter(t => t.y === y).length === 12),
    monthYears: ys,
    monthsIn: y => times.filter(t => t.y === y).map(t => t.m),
  };
}

/** Period value -> data.js Period ({clim:[months]} or {idx:[...]}), or null if any of it is off the record. */
export function periodSel(v, times) {
  switch (v.kind) {
    case 'clim': return { clim: v.month ? [v.month] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] };
    case 'month': { const i = monthIdx(times, v.y, v.m); return i < 0 ? null : { idx: [i] }; }
    case 'season': { const idx = seasonIdx(times, v.season, v.y); return idx ? { idx } : null; }
    case 'span': {
      const y0 = Math.min(v.y0, v.y1), y1 = Math.max(v.y0, v.y1);
      const full = periodChoices(times).spanYears;
      if (y0 < full[0] || y1 > full[full.length - 1]) return null;
      const idx = spanIdx(times, y0, y1);
      return idx.length ? { idx } : null;
    }
    default: throw new Error(`unknown period kind ${v.kind}`);
  }
}

const yy = y => String((y + 1) % 100).padStart(2, '0');
/** Human label for a period value. */
export function periodLabel(v) {
  switch (v.kind) {
    case 'clim': return v.month ? `${MONTH_NAMES[v.month - 1]}, 2010–2024 mean` : '2010–2024 annual mean';
    case 'month': return `${MONTH_NAMES[v.m - 1]} ${v.y}`;
    case 'season':
      if (v.season === 'ANN') return `Jul ${v.y} – Jun ${v.y + 1}`;
      return v.season === 'DJF' ? `DJF ${v.y}–${yy(v.y)}` : `${v.season} ${v.y}`;
    case 'span': {
      const y0 = Math.min(v.y0, v.y1), y1 = Math.max(v.y0, v.y1);
      return y0 === y1 ? `${y0}` : `${y0}–${y1} mean`;
    }
    default: return '';
  }
}

/** Share of each calendar month (Jan..Dec) in a Period. */
export function monthWeights(sel, times) {
  const w = new Array(12).fill(0);
  const ms = sel.clim ? sel.clim : sel.idx.map(i => times[i].m);
  for (const m of ms) w[m - 1] += 1 / ms.length;
  return w;
}

/** True when A and B weight the calendar months alike, so the seasonal cycle cancels in A − B. */
export function sameMonthMix(a, b, times) {
  const wa = monthWeights(a, times), wb = monthWeights(b, times);
  return wa.every((v, i) => Math.abs(v - wb[i]) < 1e-9);
}

// ---------- DOM controls ----------

const h = (tag, attrs = {}, html = '') => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
};
const options = (sel, list, value) => {
  sel.innerHTML = list.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  sel.value = String(value);
};

/** fieldPicker(el, registry, {ids?, groups?, value, onChange, label?}) -> {value, set(id)}. Shows the field's note. */
export function fieldPicker(el, registry, { ids, groups, value, onChange, label = 'Field' }) {
  const box = h('div', { class: 'ctl field-picker' });
  const lab = h('label', {}, `<span class="ctl-label">${label}</span>`);
  const sel = h('select', { 'data-role': 'field' });
  const note = h('p', { class: 'note' });
  const list = registry.fields.filter(f => (!ids || ids.includes(f.id)) && (!groups || groups.includes(f.group)));
  const byGroup = new Map();
  for (const f of list) { if (!byGroup.has(f.group)) byGroup.set(f.group, []); byGroup.get(f.group).push(f); }
  sel.innerHTML = [...byGroup].map(([g, fs]) => `<optgroup label="${g}">` +
    fs.map(f => `<option value="${f.id}">${f.label}</option>`).join('') + '</optgroup>').join('');
  lab.append(sel); box.append(lab, note); el.append(box);
  let cur = value;
  const show = () => { sel.value = cur; const f = list.find(x => x.id === cur); note.textContent = f ? f.note : ''; };
  show();
  sel.addEventListener('change', () => { cur = sel.value; show(); onChange && onChange(cur); });
  return { el: box, get value() { return cur; }, set(id) { cur = id; show(); } };
}

/** segmented(el, {label, options:[[value, text]], value, onChange, role}) -> {value, set(v)} */
export function segmented(el, { label, options: opts, value, onChange, role = '' }) {
  const box = h('div', { class: 'ctl seg-box', role: 'group', 'aria-label': label || role });
  if (label) box.append(h('span', { class: 'ctl-label' }, label));
  const row = h('div', { class: 'seg', 'data-role': role });
  let cur = value;
  const btns = opts.map(([v, t]) => {
    const b = h('button', { type: 'button', 'data-value': String(v) }, t);
    b.addEventListener('click', () => { if (cur === v) return; cur = v; paint(); onChange && onChange(v); });
    row.append(b);
    return [v, b];
  });
  const paint = () => btns.forEach(([v, b]) => b.setAttribute('aria-pressed', String(v === cur)));
  paint();
  box.append(row); el.append(box);
  return { el: box, get value() { return cur; }, set(v) { cur = v; paint(); } };
}

/** modePicker(el, {value, onChange}): Mean / Anomaly / A − B. */
export function modePicker(el, { value = 'mean', onChange, label = 'Show' }) {
  return segmented(el, { label, role: 'mode', value, onChange,
    options: [['mean', 'Mean'], ['anomaly', 'Anomaly'], ['diff', 'A − B']] });
}

/** rangeLock(el, {value, onChange}): "Fix colour range" checkbox -> {locked, set(b)} */
export function rangeLock(el, { value = false, onChange, label = 'Fix the colour range' }) {
  const lab = h('label', { class: 'ctl check' });
  const cb = h('input', { type: 'checkbox', 'data-role': 'lock' });
  cb.checked = value;
  lab.append(cb, document.createTextNode(' ' + label));
  cb.addEventListener('change', () => onChange && onChange(cb.checked));
  el.append(lab);
  return { el: lab, get locked() { return cb.checked; }, set(b) { cb.checked = !!b; } };
}

/**
 * periodPicker(el, times, {kinds, value, onChange, label, name}) -> {value, set(v), setKinds(kinds)}
 * Value shapes: {kind:'clim', month:0..12} (0 = annual), {kind:'month', y, m}, {kind:'season', season, y},
 * {kind:'span', y0, y1}. Only on-record choices are offered, so periodSel(value) is never null.
 */
export function periodPicker(el, times, { kinds = ['clim', 'month', 'season', 'span'], value, onChange, label = 'Period', name = '' }) {
  const ch = periodChoices(times);
  const box = h('fieldset', { class: 'ctl period', 'data-period': name });
  box.append(h('legend', { class: 'ctl-label' }, label));
  const kindSel = h('select', { 'data-role': 'kind', 'aria-label': `${label}: kind` });
  const sub = h('div', { class: 'period-sub' });
  box.append(kindSel, sub); el.append(box);
  let cur = { ...value }, allowed = kinds;

  const near = (ys, y) => (ys.includes(y) ? y : ys.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a)));
  const yearOf = v => v.y ?? v.y0 ?? 2015;
  function fresh(kind, from) {
    const y = yearOf(from);
    if (kind === 'clim') return { kind, month: 0 };
    if (kind === 'month') { const yr = near(ch.monthYears, y); return { kind, y: yr, m: ch.monthsIn(yr).includes(from.m) ? from.m : ch.monthsIn(yr)[0] }; }
    if (kind === 'season') { const s = from.season || 'DJF'; return { kind, season: s, y: near(ch.seasonYears[s], y) }; }
    const yr = near(ch.spanYears, y);
    return { kind, y0: yr, y1: yr };
  }
  function sel(role, list, v, aria) {
    const s = h('select', { 'data-role': role, 'aria-label': `${label}: ${aria}` });
    options(s, list, v);
    sub.append(s);
    return s;
  }
  function build() {
    options(kindSel, allowed.map(k => [k, KIND_TEXT[k]]), cur.kind);
    sub.innerHTML = '';
    const v = cur;
    if (v.kind === 'clim') {
      sel('clim-month', [[0, 'Annual mean'], ...MONTH_NAMES.map((m, i) => [i + 1, m])], v.month, 'month')
        .addEventListener('change', e => set({ ...v, month: +e.target.value }));
    } else if (v.kind === 'month') {
      sel('month', ch.monthsIn(v.y).map(m => [m, MONTH_NAMES[m - 1]]), v.m, 'month')
        .addEventListener('change', e => set({ ...v, m: +e.target.value }));
      sel('year', ch.monthYears.map(y => [y, y]), v.y, 'year')
        .addEventListener('change', e => { const y = +e.target.value; set({ ...v, y, m: ch.monthsIn(y).includes(v.m) ? v.m : ch.monthsIn(y)[0] }); });
    } else if (v.kind === 'season') {
      sel('season', SEASONS, v.season, 'season')
        .addEventListener('change', e => { const s = e.target.value; set({ ...v, season: s, y: near(ch.seasonYears[s], v.y) }); });
      const span2 = v.season === 'DJF' || v.season === 'ANN';
      sel('year', ch.seasonYears[v.season].map(y => [y, span2 ? `${y}–${yy(y)}` : y]), v.y, 'year')
        .addEventListener('change', e => set({ ...v, y: +e.target.value }));
    } else {
      sel('y0', ch.spanYears.map(y => [y, y]), v.y0, 'from')
        .addEventListener('change', e => set({ ...v, y0: +e.target.value }));
      sub.append(h('span', { class: 'to' }, 'to'));
      sel('y1', ch.spanYears.map(y => [y, y]), v.y1, 'to')
        .addEventListener('change', e => set({ ...v, y1: +e.target.value }));
    }
  }
  function set(v, quiet = false) {
    cur = { ...v };
    build();
    if (!quiet && onChange) onChange({ ...cur });
  }
  kindSel.addEventListener('change', () => set(fresh(kindSel.value, cur)));
  if (!allowed.includes(cur.kind)) cur = fresh(allowed[0], cur);
  build();
  return {
    el: box,
    get value() { return { ...cur }; },
    set: v => set(v, true),
    setKinds(ks) {
      allowed = ks;
      if (!ks.includes(cur.kind)) set(fresh(ks[0], cur), true);
      else build();
    },
  };
}
