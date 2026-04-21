# @jdizm/finance-calculator

A TypeScript finance library for compound interest, mortgage, savings goal, early mortgage payoff, and FIRE number calculations. Client + server, dual ESM/CJS.

### Features

Calculate the future value of a present lump sum with contributions, debt repayment or mortgage. Compounds interest per period and returns rich per-period data suitable for charting.

For example, if you invest $1,000 today at a 7% annual interest rate, how much will $1,000 be worth invested for 10 years? Or: how much per month do I need to save to hit £100k in 10 years? Or: what's my FIRE number on £40k/year spend?

#### Compound Interest

- [x] 1. calculate compound interest of a lump sum over time
- [x] 2. calculate compound interest with additional contributions and annual contribution adjustments
- [x] 3. calculate compound interest with interest only payments towards the principal borrowed
- [x] 4. calculate compound interest with repayments towards the principal

#### Mortgage

- [x] 1. calculate mortgage - repayment
- [x] 2. calculate mortgage - interest only
- [x] 3. simulate early mortgage payoff with extra monthly + lump sum payments (v1.5.0)

#### Savings goal (v1.5.0)

- [x] 1. solve for monthly contribution needed to reach a target by a date
- [x] 2. solve for years needed at a given monthly contribution

#### FIRE (v1.5.0)

- [x] 1. calculate FIRE number from annual spend + withdrawal rate
- [x] 2. solve for years to FIRE given savings, contributions, and return rate

### Installation

This library will work both client and server side, it is bundled using [esbuild](https://esbuild.github.io/) and is written in TypeScript.

If this package is being used on the server then it requires `node 18` and above however it exports for both `CJS` and `ESM`.

```bash
npm install @jdizm/finance-calculator
```

### Usage

Importing the library:

```js
// CommonJS
const {
  compoundInterestPerPeriod,
  mortgageCalculator,
  solveContributionForGoal,
  solveYearsToGoal,
  earlyMortgagePayoff,
  fireNumber,
  yearsToFire,
} = require("@jdizm/finance-calculator");
```

```js
// ESM
import {
  compoundInterestPerPeriod,
  mortgageCalculator,
  solveContributionForGoal,
  solveYearsToGoal,
  earlyMortgagePayoff,
  fireNumber,
  yearsToFire,
} from "@jdizm/finance-calculator";
```

#### Mortgage Calculator

```ts
// example interest only mortgage repayment
const result = mortgageCalculator(
  {
    homeValue: 150_000,
    deposit: 15_000,
    interestRate: 6,
    years: 25
  },
  "interestOnly"
);
```

#### Compound Interest Calculator

```ts
// calculate a lump sum over 2 years
const lumpSum = compoundInterestPerPeriod({
  type: "lumpSum",
  principal: 500,
  rate: 3.4,
  years: 2,
  paymentsPerAnnum: 12 // displays monthly interest balance
});

 // calculate a lump sum over 2 years with additional contributions of 500 per month with 2% adjustment every year
const additionalContributions = compoundInterestPerPeriod({
  type: "contribution",
  principal: 500,
  rate: 3.4,
  years: 2,
  paymentsPerAnnum: 12,
  amountPerAnnum: 6_000,
  contributionPerAnnumChange: 2,
  accrualOfPaymentsPerAnnum: true
});

// example interest only payment that compounds at 4% per annum
// with an interest rate of 6% on a principal of 250,000
const interestOnly = compoundInterestPerPeriod({
  type: "debtRepayment",
  principal: 250_000,
  rate: 4,
  years: 25,
  paymentsPerAnnum: 12,
  debtRepayment: {
    interestRate: 6,
    type: "interestOnly"
  }
});

// example debtRepayment that compounds at 4% per annum
// with an interest rate of 6% on a principal of 150,000
const repayment = compoundInterestPerPeriod({
  type: "debtRepayment",
  principal: 150_000,
  rate: 4,
  years: 25,
  paymentsPerAnnum: 12,
  debtRepayment: {
    interestRate: 6,
    type: "repayment"
  }
});
```

##### Options

- `type: 'lumpSum' | 'contribution' | 'debtRepayment` - the type of investment to calculate
- `principal: number` The initial amount invested or borrowed
- `rate: number` The interest rate (or growth rate) per annum
- `years: number` The number of years invested
- `paymentsPerAnnum: number` The number of contribution payments per annum (eg 12 for monthly) will be used to show the interest balance per period. So if you want the interest to show monthly for each year then make sure you define the paymentsPerAnnum as 12.
- `currentPositionInYears: number` The current position in years (eg 2 for the second year of the investment)

###### Contribution Options

- `amountPerAnnum: number` The amount of contributions per annum (eg 6_000 for 500 per month)
- `accrualOfPaymentsPerAnnum: boolean` If provided payments accrue interest per annum; Otherwise interest is only accrued on the principal payment.
- `contributionPerAnnumChange: number` Changes of annual contribution in percents (to adjust contribution according inflation rates, good for long investments)

###### Debt Repayment Options

- `debtRepayment: object` if provided this denotes that the principal is borrowed.

It will calculate the monthly interest payments for a given interest rate and principal borrowed.

- `interestRate: number` - the interest rate of borrowing
- `type: "interestOnly"` // this is the default

##### Investment Types

What are investment types? These are used to calculate the final results:

1. lumpSum - a single investment calculated over a period of time
2. debtRepayment - a borrowed investment calculated over a period of time with a decreasing principal or interest only payments
3. contribution - a single investment calculated over a period of time with additional contribution

#### Savings Goal Calculator (v1.5.0)

Solve for either the monthly contribution needed to reach a target or the years required given a contribution. Uses the future-value-of-annuity formula.

```ts
// How much per month to reach £100k in 10 years at 6% with £5k seed?
const result = solveContributionForGoal({
  target: 100_000,
  years: 10,
  annualRate: 6,
  startingBalance: 5_000,
});
// -> { contributionPerMonth: 609.39, totalContributions: 78_126, interestEarned: 16_874, ... }

// How many years to reach £100k at £500/mo?
const years = solveYearsToGoal({
  target: 100_000,
  contributionPerMonth: 500,
  annualRate: 7,
  startingBalance: 5_000,
});
// -> 12.44
```

#### Early Mortgage Payoff (v1.5.0)

Simulate extra monthly payments and one-off lump sums against a standard repayment mortgage. Returns months + interest saved plus a per-month schedule.

```ts
const result = earlyMortgagePayoff({
  homeValue: 300_000,
  deposit: 30_000,
  interestRate: 5,
  years: 25,
  extraMonthly: 200,
  lumpSums: [{ month: 24, amount: 10_000 }],
});
// -> {
//   baselineMonths: 300, baselineTotalInterest, newMonths,
//   monthsSaved, interestSaved, baseMonthlyPayment, schedule: [...]
// }
```

#### FIRE Number (v1.5.0)

Calculate the savings target for financial independence, then the years needed to reach it.

```ts
const fire = fireNumber({ annualSpend: 40_000, withdrawalRate: 4 });
// -> { target: 1_000_000, monthlyIncome: 3_333.33, ... }

const years = yearsToFire({
  currentSavings: 50_000,
  annualContribution: 20_000,
  annualReturn: 7,
  target: fire.target,
});
// -> 19.85
```

Rates accept either percentage (`6`) or decimal (`0.06`) — the library normalises internally.

### Building with Typescript

[Only certain tsconfig.json fields are respected when building with esbuild.](https://esbuild.github.io/content-types/#tsconfig-json)

#### tsconfig.json

```json
"target": "es2022", // recommended over ESNext
"module": "preserve", // added in ts 5.4 and implies "moduleResolution": "bundler"
```

#### References

- https://www.totaltypescript.com/tsconfig-cheat-sheet
- https://www.typescriptlang.org/tsconfig/#module
- https://www.typescriptlang.org/tsconfig/#preserve
- https://evertpot.com/universal-commonjs-esm-typescript-packages/
- https://janessagarrow.com/blog/typescript-and-esbuild/
- https://github.com/microsoft/TypeScript/wiki/Node-Target-Mapping
