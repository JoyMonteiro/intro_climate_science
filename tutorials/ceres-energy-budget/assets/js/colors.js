// Colour maps built at load time from documented control points (256 entries each).

// Viridis (matplotlib; perceptually uniform, colour-blind safe), sampled at 9 stops.
const VIRIDIS_STOPS = [
  [68, 1, 84], [71, 44, 122], [59, 81, 139], [44, 113, 142], [33, 144, 141],
  [39, 173, 129], [92, 200, 99], [170, 220, 50], [253, 231, 37],
];
// ColorBrewer RdBu (colour-blind safe), reversed so blue = negative, red = positive;
// centre stop set to pure white.
const RDBU_STOPS = [
  [5, 48, 97], [33, 102, 172], [67, 147, 195], [146, 197, 222], [209, 229, 240],
  [255, 255, 255],
  [253, 219, 199], [244, 165, 130], [214, 96, 77], [178, 24, 43], [103, 0, 31],
];

// sRGB <-> linear helpers: interpolate in linear light to avoid muddy midpoints.
const toLin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const toSrgb = l => 255 * (l <= 0.0031308 ? 12.92 * l : 1.055 * l ** (1 / 2.4) - 0.055);

function build(stops) {
  const lin = stops.map(s => s.map(toLin)), k = stops.length - 1, out = [];
  for (let i = 0; i < 256; i++) {
    const t = (i / 255) * k, a = Math.min(Math.floor(t), k - 1), f = t - a;
    out.push(lin[a].map((v, c) => Math.round(Math.min(255, Math.max(0, toSrgb(v + f * (lin[a + 1][c] - v)))))));
  }
  return out;
}

export const SEQUENTIAL = build(VIRIDIS_STOPS);
export const DIVERGING = build(RDBU_STOPS);
const GREY = [160, 160, 160];

/** Colour for a value on [lo, hi]; clamps outside; NaN -> grey; hi === lo -> middle. Returns a fresh [r,g,b]. */
export function colorFor(value, lo, hi, cmap) {
  if (Number.isNaN(value) || value === null || value === undefined) return GREY.slice();
  const span = hi - lo;               // degenerate range (hi === lo, or NaN ends) -> middle colour
  let t = span ? (value - lo) / span : 0.5;
  t = Math.min(1, Math.max(0, t));
  return cmap[Math.round(t * 255)].slice();
}

/** Display range: mean -> range_mean (symmetric about 0 for diverging fields); anomaly/diff -> ±range_anom. */
export function rangeFor(fieldDef, mode) {
  if (mode === 'mean') {
    const [lo, hi] = fieldDef.range_mean;
    if (fieldDef.kind === 'div') { const m = Math.max(Math.abs(lo), Math.abs(hi)); return [-m, m]; }
    return [lo, hi];
  }
  return [-fieldDef.range_anom, fieldDef.range_anom];
}

const NICE = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
/** Smallest "nice" number >= x (x > 0). */
export function niceCeil(x) {
  const e = 10 ** Math.floor(Math.log10(x)), f = x / e;
  for (const n of NICE) if (f <= n * (1 + 1e-9)) return +(n * e).toPrecision(12);
  return 10 * e;
}

/** Auto range symmetric about 0 from the data: the p-quantile of |value| (NaN skipped), rounded up to a nice
 *  number. Used for differences whose seasonal cycle does not cancel. Never zero-width: falls back to ±fallback. */
export function robustSymRange(values, p = 0.98, fallback = 1) {
  const a = [];
  for (const v of values) if (Number.isFinite(v)) a.push(Math.abs(v));
  if (!a.length) return [-fallback, fallback];
  a.sort((x, y) => x - y);
  const q = a[Math.floor(p * (a.length - 1))];
  if (!(q > 0)) return [-fallback, fallback];
  const m = niceCeil(q);
  return [-m, m];
}
