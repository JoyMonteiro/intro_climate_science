// Time selection and simple statistics. Plain browser ES module, no imports.

const SEASON_MONTHS = {
  // [month, yearOffset] relative to the season's labelled year
  DJF: [[12, 0], [1, 1], [2, 1]],   // DJF year = year of December
  MAM: [[3, 0], [4, 0], [5, 0]],
  JJA: [[6, 0], [7, 0], [8, 0]],
  SON: [[9, 0], [10, 0], [11, 0]],
  ANN: [7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6].map(m => [m, m >= 7 ? 0 : 1]), // Jul y .. Jun y+1
};

/** "YYYY-MM" strings -> [{y, m}] */
export function parseTimes(strs) {
  return strs.map(s => { const [y, m] = s.split('-').map(Number); return { y, m }; });
}

/** Index of year y, month m (1-12), or -1. */
export function monthIdx(times, y, m) {
  return times.findIndex(t => t.y === y && t.m === m);
}

/** Indices of the months in a season of `year`, or null if any month is off the record. */
export function seasonIdx(times, season, year) {
  const spec = SEASON_MONTHS[season];
  if (!spec) throw new Error(`unknown season ${season}`);
  const out = [];
  for (const [m, dy] of spec) {
    const i = monthIdx(times, year + dy, m);
    if (i < 0) return null;
    out.push(i);
  }
  return out;
}

/** Years for which the season is complete in the record. */
export function seasonYears(times, season) {
  if (!times.length) return [];
  const ys = [];
  for (let y = times[0].y - 1; y <= times[times.length - 1].y; y++) {
    if (seasonIdx(times, season, y)) ys.push(y);
  }
  return ys;
}

/** Indices of all months in calendar years y0..y1 inclusive. */
export function spanIdx(times, y0, y1) {
  const out = [];
  times.forEach((t, i) => { if (t.y >= y0 && t.y <= y1) out.push(i); });
  return out;
}

/** Centred running mean: window i-floor((n-1)/2) .. i+floor(n/2) (n=12: i-5..i+6). NaN if incomplete or any NaN. */
export function runningMean(arr, n = 12) {
  const len = arr.length, out = new Float64Array(len).fill(NaN);
  const back = Math.floor((n - 1) / 2), fwd = n - 1 - back;
  for (let i = back; i + fwd < len; i++) {
    let s = 0;
    for (let k = i - back; k <= i + fwd; k++) s += arr[k];
    out[i] = s / n; // NaN propagates
  }
  return out;
}

/** Least-squares line against month index; NaN-skipping. Slope reported per decade (x120). */
export function linTrend(arr) {
  let n = 0, sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (Number.isNaN(v)) continue;
    n++; sx += i; sy += v; sxx += i * i; sxy += i * v;
  }
  const d = n * sxx - sx * sx;
  if (n < 2 || d === 0) return { slopePerDecade: NaN, intercept: NaN };
  const b = (n * sxy - sx * sy) / d;
  return { slopePerDecade: b * 120, intercept: (sy - b * sx) / n };
}

/** cos(lat)-weighted mean of a flat grid (row-major lat then lon), skipping NaN. */
export function areaMean(grid, lat) {
  const nlat = lat.length, nlon = grid.length / nlat;
  let num = 0, den = 0;
  for (let i = 0; i < nlat; i++) {
    const w = Math.cos(lat[i] * Math.PI / 180);
    for (let j = 0; j < nlon; j++) {
      const v = grid[i * nlon + j];
      if (!Number.isNaN(v)) { num += w * v; den += w; }
    }
  }
  return den > 0 ? num / den : NaN;
}

/** Mean over longitude for each latitude row, skipping NaN (all-NaN row -> NaN). */
export function zonalMean(grid, nlat, nlon) {
  const out = new Float64Array(nlat);
  for (let i = 0; i < nlat; i++) {
    let s = 0, c = 0;
    for (let j = 0; j < nlon; j++) { const v = grid[i * nlon + j]; if (!Number.isNaN(v)) { s += v; c++; } }
    out[i] = c ? s / c : NaN;
  }
  return out;
}

/** ENSO phases: 3-month centred mean >= +0.5 (nino) or <= -0.5 (nina) for >= 5 consecutive months. */
export function ensoPhases(anom) {
  const sm = runningMean(anom, 3), out = [];
  let i = 0;
  while (i < sm.length) {
    const ph = sm[i] >= 0.5 ? 'nino' : sm[i] <= -0.5 ? 'nina' : null;
    if (!ph) { i++; continue; }
    let j = i;
    while (j + 1 < sm.length && (ph === 'nino' ? sm[j + 1] >= 0.5 : sm[j + 1] <= -0.5)) j++;
    if (j - i + 1 >= 5) out.push({ start: i, end: j, phase: ph });
    i = j + 1;
  }
  return out;
}

/** Monthly series minus its own mean seasonal cycle over calendar years y0..y1 (NaN-skipping). */
export function monthlyAnomaly(arr, times, y0 = 2010, y1 = 2024) {
  const sum = new Float64Array(12), n = new Float64Array(12);
  times.forEach((t, i) => {
    if (t.y >= y0 && t.y <= y1 && !Number.isNaN(arr[i])) { sum[t.m - 1] += arr[i]; n[t.m - 1]++; }
  });
  return Float64Array.from(times, (t, i) => arr[i] - (n[t.m - 1] ? sum[t.m - 1] / n[t.m - 1] : NaN));
}

/** Linear trend of a monthly series, fitted with a separate mean for each calendar month (least squares with
 *  month-of-year offsets), so the seasonal cycle cannot leak into the slope. A plain linTrend of raw months is biased
 *  by the cycle, because within each year the months' order correlates with time: the TOA-net cycle alone tilts the
 *  2010–2024 fit by about −0.2 W m⁻² per decade. NaN months are skipped. Same return shape as linTrend; the line
 *  intercept + slope·i passes through the mean of the twelve calendar-month means. */
export function seasonalTrend(arr, times) {
  const st = Array.from({ length: 12 }, () => ({ n: 0, t: 0, x: 0 }));
  arr.forEach((v, i) => { if (!Number.isNaN(v)) { const s = st[times[i].m - 1]; s.n++; s.t += i; s.x += v; } });
  for (const s of st) if (s.n) { s.t /= s.n; s.x /= s.n; }
  let sxy = 0, sxx = 0;
  arr.forEach((v, i) => {
    if (Number.isNaN(v)) return;
    const s = st[times[i].m - 1];
    sxy += (i - s.t) * (v - s.x); sxx += (i - s.t) ** 2;
  });
  if (!(sxx > 0)) return { slopePerDecade: NaN, intercept: NaN };
  const b = sxy / sxx, used = st.filter(s => s.n);
  return { slopePerDecade: b * 120, intercept: used.reduce((a, s) => a + s.x - b * s.t, 0) / used.length };
}
