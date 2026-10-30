// Data access layer: JSON on open, zarr chunks on demand (zarrita), memoised. Decoded year chunks and per-period
// base means are the big items (~0.8 MB and ~0.26 MB each), so those two caches are bounded (least recently used).
// Plain ES module with relative imports only, so it also runs under Node (tests).
import * as zarr from './vendor/zarrita.js';
import { deriveFrom, basesOf, fieldById } from './fields.js';

const NLAT = 90, NLON = 180, NCELL = NLAT * NLON, NT = 181, T0_YEAR = 2010;
const CLIM_Y0 = 2010, CLIM_Y1 = 2024; // climatology base period (calendar years)
const YEAR_CACHE = 24, MEANS_CACHE = 64;   // base-years (~19 MB) and base period means (~17 MB) kept

const toNaN = arr => Float64Array.from(arr, v => v ?? NaN); // JSON null -> NaN (not 0)

/** Promise cache keeping the `limit` most recently used keys; a rejected promise is dropped so it can be retried. */
function lru(limit) {
  const m = new Map();
  return (key, fn) => {
    let p = m.get(key);
    if (p) { m.delete(key); m.set(key, p); return p; }
    p = fn().catch(e => { if (m.get(key) === p) m.delete(key); throw e; });
    m.set(key, p);
    while (m.size > limit) m.delete(m.keys().next().value);
    return p;
  };
}

/** int16 -> Float32 with scale, fill -> NaN. */
function decode(int16, scale, fill, n = int16.length) {
  const out = new Float32Array(n).fill(NaN);
  for (let i = 0; i < int16.length; i++) { const v = int16[i]; out[i] = v === fill ? NaN : v * scale; }
  return out;
}

export async function openData(baseUrl) {
  const base = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
  const getJSON = async p => { const r = await fetch(base + p); if (!r.ok) throw new Error(`${p}: ${r.status}`); return r.json(); };
  const [meta, fields, nino, coast, global] = await Promise.all(
    ['meta.json', 'fields.json', 'nino34.json', 'coast.json', 'series/global.json'].map(getJSON));
  nino.anom = toNaN(nino.anom);
  const globalArr = Object.fromEntries(Object.entries(global).map(([k, v]) => [k, toNaN(v)]));

  const root = zarr.root(new zarr.FetchStore(base + 'ceres.zarr'));
  const memo = new Map();
  const once = (key, fn) => { if (!memo.has(key)) memo.set(key, fn().catch(e => { memo.delete(key); throw e; })); return memo.get(key); };
  // The store is zarr v3: open as v3 directly. Plain zarr.open probes v2 metadata first when several arrays open
  // at once, and those 404s show up as console errors in the browser.
  const arr = (group, b) => once(`arr:${group}/${b}`, () => zarr.open.v3(root.resolve(`${group}/${b}`), { kind: 'array' }));
  const read = async (group, b, sel, n) => {
    const a = await arr(group, b);
    const { data } = await zarr.get(a, sel);
    return decode(data, a.attrs.scale, a.fillValue, n);
  };

  const clim = b => once(`clim:${b}`, () => read('clim', b, null));
  // Year y -> 12 months; months past the record (2025 Feb-Dec) are NaN.
  const yearCache = lru(YEAR_CACHE), meansCache = lru(MEANS_CACHE);
  const year = (b, y) => yearCache(`${b}:${y}`, () => {
    const t0 = (y - T0_YEAR) * 12;
    if (t0 < 0 || t0 >= NT) return Promise.reject(new Error(`year ${y} off the record`));
    return read('map', b, [zarr.slice(t0, Math.min(t0 + 12, NT)), null, null], 12 * NCELL);
  });
  const point = (b, iLat, iLon) => once(`point:${b}:${iLat}:${iLon}`, () => read('point', b, [null, iLat, iLon]));

  const formulaOf = id => { const f = fieldById(fields, id); if (!f) throw new Error(`unknown field ${id}`); return f.formula; };

  // Mean map of one base over a period, plus the matching climatological mean (same months, same multiplicity).
  // The period's year chunks are fetched together and summed as each arrives. Results are shared: never mutate them.
  const periodKey = period => (period.clim ? `c${period.clim.join(',')}` : `i${period.idx.join(',')}`);
  // A period must name at least one month: a null or empty idx (e.g. seasonIdx off the record) would otherwise throw a
  // TypeError or divide by zero into an all-NaN map. Throws a clear error instead (callers' promises reject).
  const checkPeriod = period => {
    const ms = period && (period.clim || period.idx);
    if (!ms || !ms.length) throw new Error(`period has no months: ${JSON.stringify(period)}`);
  };
  const baseMeans = (b, period) => meansCache(`${b}|${periodKey(period)}`, async () => {
    const raw = new Float64Array(NCELL), cl = new Float64Array(NCELL);
    const C = await clim(b);
    const add = (src, off, coff) => { for (let i = 0; i < NCELL; i++) { raw[i] += src[off + i]; cl[i] += C[coff + i]; } };
    let n;
    if (period.clim) {
      for (const m of period.clim) add(C, (m - 1) * NCELL, (m - 1) * NCELL);
      n = period.clim.length;
    } else {
      const byYear = new Map();
      for (const t of period.idx) {
        const y = T0_YEAR + Math.floor(t / 12);
        if (!byYear.has(y)) byYear.set(y, []);
        byYear.get(y).push(t % 12);
      }
      await Promise.all([...byYear].map(async ([y, ms]) => {
        const src = await year(b, y);
        for (const mi of ms) add(src, mi * NCELL, mi * NCELL);
      }));
      n = period.idx.length;
    }
    for (let i = 0; i < NCELL; i++) { raw[i] /= n; cl[i] /= n; }
    return { raw, cl };
  });

  // Period mean of a field (ratio of mean fluxes for ratio fields), raw or as anomaly from climatology.
  async function periodMap(id, period, anom) {
    checkPeriod(period);
    const formula = formulaOf(id), bs = basesOf(formula);
    const means = Object.fromEntries(await Promise.all(bs.map(async b => [b, await baseMeans(b, period)])));
    const raw = deriveFrom(formula, b => means[b].raw, NCELL);
    if (!anom) return raw;
    const cl = deriveFrom(formula, b => means[b].cl, NCELL);
    for (let i = 0; i < NCELL; i++) raw[i] -= cl[i];
    return raw;
  }

  /** sel = {mode:'mean'|'anomaly'|'diff', a, b?, anom?}; diff = map(a) - map(b), each an anomaly if sel.anom. */
  async function fieldMap(id, sel) {
    if (sel.mode === 'mean') return periodMap(id, sel.a, false);
    if (sel.mode === 'anomaly') return periodMap(id, sel.a, true);
    if (sel.mode === 'diff') {
      const [a, b] = await Promise.all([periodMap(id, sel.a, !!sel.anom), periodMap(id, sel.b, !!sel.anom)]);
      for (let i = 0; i < NCELL; i++) a[i] -= b[i];
      return a;
    }
    throw new Error(`unknown mode ${sel.mode}`);
  }

  /** Global (area-weighted, cos lat) mean of a field for a selection shaped like fieldMap's. Each base is
   *  area-averaged first and the field derived from those means, so a ratio field is the ratio of global-mean fluxes
   *  (e.g. albedo = global reflected / global incoming); for a linear field this is the area mean of fieldMap(id, sel).
   *  The average runs over the cells where every input map is defined, the same cells as the map's own mean. */
  async function fieldGlobalMean(id, sel) {
    if (!['mean', 'anomaly', 'diff'].includes(sel.mode)) throw new Error(`unknown mode ${sel.mode}`);
    const formula = formulaOf(id), bs = basesOf(formula);
    const periods = sel.mode === 'diff' ? [sel.a, sel.b] : [sel.a];
    periods.forEach(checkPeriod);
    const withClim = sel.mode === 'anomaly' || (sel.mode === 'diff' && !!sel.anom);
    const means = await Promise.all(periods.map(p => Promise.all(bs.map(b => baseMeans(b, p)))));
    const maps = means.flat().flatMap(m => (withClim ? [m.raw, m.cl] : [m.raw]));
    let wsum = 0;
    const w = new Float64Array(NCELL);
    for (let i = 0; i < NLAT; i++) {
      const c = Math.cos(meta.lat[i] * Math.PI / 180);
      for (let j = 0; j < NLON; j++) {
        const k = i * NLON + j;
        if (maps.every(m => !Number.isNaN(m[k]))) { w[k] = c; wsum += c; }
      }
    }
    if (!(wsum > 0)) return NaN;
    const gm = x => { let s = 0; for (let k = 0; k < NCELL; k++) if (w[k]) s += w[k] * x[k]; return s / wsum; };
    const derive = (pi, which) => {
      const g = Object.fromEntries(bs.map((b, j) => [b, [gm(means[pi][j][which])]]));
      return deriveFrom(formula, b => g[b], 1)[0];
    };
    const one = pi => (withClim ? derive(pi, 'raw') - derive(pi, 'cl') : derive(pi, 'raw'));
    return sel.mode === 'diff' ? one(0) - one(1) : one(0);
  }

  /** Time series at one cell (point/ chunks only). Anomaly: minus the 2010-2024 monthly climatology of the bases. */
  async function fieldPoint(id, iLat, iLon, { anomaly = false } = {}) {
    const formula = formulaOf(id), bs = basesOf(formula);
    const ser = Object.fromEntries(await Promise.all(bs.map(async b => [b, await point(b, iLat, iLon)])));
    const out = deriveFrom(formula, b => ser[b], NT);
    if (!anomaly) return out;
    const t0 = (CLIM_Y0 - T0_YEAR) * 12, t1 = (CLIM_Y1 - T0_YEAR + 1) * 12;
    const climB = Object.fromEntries(bs.map(b => {
      const c = new Float64Array(12);
      for (let t = t0; t < t1; t++) c[t % 12] += ser[b][t];
      return [b, c.map(v => v / ((t1 - t0) / 12))];
    }));
    const c = deriveFrom(formula, b => climB[b], 12);
    for (let t = 0; t < NT; t++) out[t] -= c[t % 12];
    return out;
  }

  const globalSeries = id => {
    if (!globalArr[id]) throw new Error(`no global series for ${id}`);
    return globalArr[id];
  };
  const zonal = id => once(`zonal:${id}`, async () => toNaN((await getJSON(`series/zonal/${id}.json`)).values));

  // latest(key)(promise): resolves only if this is still the most recent call for key, else rejects {stale:true}.
  const gen = new Map();
  const latest = key => {
    const g = (gen.get(key) || 0) + 1;
    gen.set(key, g);
    return p => Promise.resolve(p).then(
      v => { if (gen.get(key) !== g) throw { stale: true }; return v; },
      e => { if (gen.get(key) !== g) throw { stale: true }; throw e; });
  };

  return { meta, fields, nino, coast, clim, year, point, fieldMap, fieldGlobalMean, fieldPoint, globalSeries, zonal, latest };
}
