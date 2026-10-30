// Climatological helpers shared by views 1 and 2 (pure, no DOM): "annual" = months 1..12 of the 2010–2024
// climatology, a month = [m]. Zonal means and the view-1 TOA readout come from the precomputed series, averaged
// over the matching months of 2010-01..2024-12 with multiplicity. The map's global-mean readout comes from
// data.fieldGlobalMean (ratio fields: ratio of global-mean fluxes), the same helper Free explore uses.
import { seasonalTrend } from '../timesel.js';
import { fmt, signed } from '../charts.js';
import { MONTH_NAMES } from '../controls.js';

const NBASE = 180, NLAT = 90;
export const ALL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/** Time indices in 2010-01..2024-12 whose calendar month is in `months` (1..12). */
export function climMonthIdx(months) {
  const out = [];
  for (let t = 0; t < NBASE; t++) if (months.includes((t % 12) + 1)) out.push(t);
  return out;
}

/** Mean of a 181-month series over the matching climatological months. */
export function climMean(series, months) {
  const idx = climMonthIdx(months);
  let s = 0;
  for (const t of idx) s += series[t];
  return s / idx.length;
}

/** Zonal mean (90 lats) from a time-major 181×90 zonal series, averaged over the matching months. */
export function zonalClimMean(zon, months) {
  const idx = climMonthIdx(months), out = new Float64Array(NLAT);
  for (const t of idx) for (let i = 0; i < NLAT; i++) out[i] += zon[t * NLAT + i];
  for (let i = 0; i < NLAT; i++) out[i] /= idx.length;
  return out;
}

/** View-1 readout from the global toa_net series over 2010-01..2024-12 (180 months). */
export function toaReadout(series) {
  const s = series.slice(0, NBASE);
  // The series starts in January 2010; the trend is fitted with a mean per calendar month (seasonalTrend).
  const months = Array.from(s, (_, i) => ({ y: 2010 + Math.floor(i / 12), m: (i % 12) + 1 }));
  const mean = climMean(series, ALL_MONTHS), tr = seasonalTrend(s, months);
  return `Global mean 2010–2024: ${readoutValue(mean, 'W m-2', true)} W m⁻²; trend: ${readoutValue(tr.slopePerDecade, 'W m-2', true)} W m⁻² per decade`;
}

/** Readout value: '+' for positive values of signed (diverging) fields. */
export const readoutValue = (v, units, diverging) => {
  const d = units === 'W m-2' ? 2 : undefined;
  return diverging ? signed(v, units, d) : fmt(v, units, d);
};

export const periodText = months => (months.length === 12 ? 'annual mean, 2010–2024' : `${MONTH_NAMES[months[0] - 1]}, 2010–2024 average`);
