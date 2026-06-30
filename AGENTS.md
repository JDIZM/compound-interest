# AGENTS.md

Guidance for AI agents and contributors working in this repo. See `README.md` for the
full calculator API and worked examples.

## What this is

A dependency-free TypeScript finance library published to npm as **`@jdizm/finance-calculator`**.
It provides compound-interest, mortgage, savings-goal, early-payoff, and FIRE calculators.

## Setup & tooling

- **Package manager: npm** (this library uses npm, not pnpm — `pnpm-lock.yaml`/`package-lock.json` are gitignored).
- **Node: 24** (pinned via Volta).
- No runtime dependencies — keep it that way.

## Commands

```bash
npm install
npm run dev          # run index.ts via vite-node (scratch/demo)
npm test             # vitest --run --coverage (istanbul)
npm run lint         # eslint, --max-warnings 4
npm run format:check # prettier check
npm run tsc:check    # type-check, no emit
npm run build        # tsc:check then bundle to dist/ via build.mjs
```

Run `npm test`, `npm run lint`, `npm run format:check`, and `npm run tsc:check` before pushing —
CI (`.github/workflows/node.yml`) runs the same on Node 20/22/24 for every PR.

## Layout

- `calc/` — one file per calculator, with its `*.test.ts` colocated. Shared helpers in `calc/helpers.ts`,
  the `PMT` annuity primitive in `calc/compoundInterest.ts`.
- `index.ts` — public barrel (the npm entry; `istanbul ignore file`).
- `types/calculator.ts` — shared option/result types.
- `dist/` — build output, gitignored, produced at publish time (`files: ["dist"]`).

## Conventions

- **Rates are percentages.** `savingsGoal`, `earlyPayoff`, and `fireNumber` normalise via
  `toDecimalRate` (always `÷100`): pass `6` for 6%, `0.5` for 0.5%. The older
  `compoundInterestPerPeriod` / `mortgageCalculator` keep their own inline percentage handling.
- **Calculators throw on invalid input** rather than returning `NaN`/garbage. Guard new edge
  cases (zero/negative rates, non-convergence) explicitly and cover them with tests.
- Keep coverage high (currently ~76 tests; 100% of functions). Add tests with each fix.

## Release flow (npm publish is automated)

1. Do the work on a feature branch; update `CHANGELOG.md`.
2. **Do not pre-bump `package.json`** — the release workflow owns the version bump.
3. Merge the PR to `main`.
4. `gh release create vX.Y.Z --target main --generate-notes`.
5. `.github/workflows/release.yml` triggers on the published release: it tests/builds, runs
   `npm version X.Y.Z` against `main`, commits the bump, and `npm publish`es using the
   `NPM_TOKEN` secret.

No manual `npm publish` is needed.
