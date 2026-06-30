/**
 * Convert a rate expressed as a percentage to its decimal form (6 -> 0.06, 0.5 -> 0.005).
 *
 * Rates are always treated as percentages. The previous `rate >= 1 ? rate / 100 : rate`
 * heuristic was ambiguous: a genuine sub-1% rate such as a 0.5% withdrawal rate was read as
 * 50%. Callers must pass percentages (e.g. 6 for 6%, 0.5 for 0.5%).
 */
export const toDecimalRate = (rate: number): number => rate / 100;
