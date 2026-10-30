// Field derivation from base fields; mirrors pipeline/fields.py `derive`.

function lin(terms, getBase, n) {
  const out = new Float64Array(n);
  for (const [c, b] of terms) {
    const x = getBase(b);
    for (let i = 0; i < n; i++) out[i] += c * x[i];
  }
  return out;
}

/** Linear sum of terms, or ratio num/den that is NaN where den < min_den or den is NaN. */
export function deriveFrom(formula, getBase, n) {
  if (formula.terms) return lin(formula.terms, getBase, n);
  const r = formula.ratio;
  const num = lin(r.num, getBase, n), den = lin(r.den, getBase, n);
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = den[i] >= r.min_den ? num[i] / den[i] : NaN;
  return out;
}

/** Unique base names a formula needs. */
export function basesOf(formula) {
  const terms = formula.terms ? formula.terms : [...formula.ratio.num, ...formula.ratio.den];
  return [...new Set(terms.map(t => t[1]))];
}

export function fieldById(registry, id) {
  return registry.fields.find(f => f.id === id);
}
