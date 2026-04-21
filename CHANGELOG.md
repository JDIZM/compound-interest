# Changelog

## 1.5.0 — 2026-04-21

Added:

- `solveContributionForGoal(options)` / `solveYearsToGoal(options)` — reverse savings-goal solvers using the future-value-of-annuity formula. Solve for either the monthly contribution needed to reach a target by a date, or the years needed at a given contribution.
- `earlyMortgagePayoff(options)` — simulate a repayment mortgage with extra monthly payments and one-off lump sums. Returns months saved, interest saved, and a per-month schedule versus the baseline term.
- `fireNumber(options)` / `yearsToFire(options)` — FIRE number from annual spend and safe withdrawal rate, and years-to-FIRE from current savings, contributions, and expected return.
- Shared `toDecimalRate` helper extracted to `calc/helpers.ts` so rate inputs accept either percentage (6) or decimal (0.06) interchangeably across all calculators.

Unchanged:

- `compoundInterestPerPeriod`, `mortgageCalculator`, `PMT`, `calcInterestPayments`, `calcTotalPayments`, `compoundInterestOverYears` — existing API is untouched.

Test coverage: 45 tests across 5 files.
