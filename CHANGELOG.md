# Changelog

## 1.5.0 — 2026-04-21

Added:

- `solveContributionForGoal(options)` / `solveYearsToGoal(options)` — reverse savings-goal solvers using the future-value-of-annuity formula. Solve for either the monthly contribution needed to reach a target by a date, or the years needed at a given contribution.
- `earlyMortgagePayoff(options)` — simulate a repayment mortgage with extra monthly payments and one-off lump sums. Returns months saved, interest saved, and a per-month schedule versus the baseline term.
- `fireNumber(options)` / `yearsToFire(options)` — FIRE number from annual spend and safe withdrawal rate, and years-to-FIRE from current savings, contributions, and expected return.
- Shared `toDecimalRate` helper extracted to `calc/helpers.ts`. Used by the three new calculators (`savingsGoal`, `earlyPayoff`, `fireNumber`) to convert a percentage rate to its decimal form. Rates are always treated as percentages: `6` is 6%, `0.5` is 0.5%. (See the note below — the earlier ambiguous heuristic was dropped before release.)

Fixed (pre-release hardening):

- `PMT` now handles a zero interest rate explicitly (`(pv + fv) / nper`) instead of dividing by zero and returning `NaN`. This silently affected every repayment built on it at 0%: `mortgageCalculator` (repayment), `earlyMortgagePayoff`, and `compoundInterestPerPeriod`'s debt-repayment path. A 0% mortgage now returns straight-line principal division rather than `NaN`.
- `toDecimalRate` no longer uses the `rate >= 1 ? rate / 100 : rate` heuristic, which misread a genuine sub-1% rate (e.g. a 0.5% safe-withdrawal rate) as 50%. It now always divides by 100, so the three new calculators are percentage-based. **Behaviour change:** decimal rate inputs such as `0.06` are read as 0.06%, not 6% — pass `6` for 6%.
- `solveYearsToGoal` validates all inputs (including a new `startingBalance < 0` guard) before its "already met the target" early return, so bad inputs surface an error instead of being skipped.
- `solveYearsToGoal` and `yearsToFire` reject rates of −100% or lower up front (these break the `Math.log` solve and produced `NaN`).

Unchanged:

- `compoundInterestPerPeriod`, `mortgageCalculator`, `calcInterestPayments`, `calcTotalPayments`, `compoundInterestOverYears` — existing API and rate semantics are untouched (these keep their own percentage handling).

Test coverage: 76 tests across 5 files.
