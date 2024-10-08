# compound interest

A finance calculator to:

- calculate `compound interest` over a period of time with different investment types.
- calculate `mortgage` repayments and interest only payments.

### Features

This calculator can be used to calculate the future value of a present lump sum with contributions, debt repayment or mortgage. The calculator compounds interest per period and can be used to calculate the value of investments or debt over a period of time.

For example, if you invest $1,000 today at a 7% annual interest rate, how much will $1,000 be worth if invested for 10 years?

#### Compound Interest

- [x] 1. calculate compound interest of a lump sum over time
- [x] 2. calculate compound interest with additional contributions and annual contribution adjustments
- [x] 3. calculate compound interest with interest only payments towards the principal borrowed
- [x] 4. calculate compound interest with repayments towards the principal

#### Mortgage

- [x] 1. calculate mortgage - repayment
- [x] 2. calculate mortgage - interest only

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
const { compoundInterestPerPeriod, mortgageCalculator } = require("@jdizm/finance-calculator");
```

```js
// ESM
import { compoundInterestPerPeriod, mortgageCalculator } from "@jdizm/finance-calculator";
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
