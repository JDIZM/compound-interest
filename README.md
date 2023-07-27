# compound interest

There are some libraries to take inspiration from

https://www.npmjs.com/package/react-compound-interest

https://www.npmjs.com/package/compound-interest-calc

- https://github.com/BrooksPoltl/compound-interest/blob/master/index.js

https://cameronnokes.com/blog/the-30-second-guide-to-publishing-a-typescript-package-to-npm/

### Features

- [x] 1. calculate compound interest of a lump sum over time
- [x] 2. calculate compound interest with additional contributions
- [x] 3. calculate compound interest with interest only payments towards the principal borrowed
- [ ] 4. calculate compound interest with a decreasing principal

There are a few options and circumstances to consider when calculating compound interest:

- The interest rate (or growth rate) per annum.
- The number of times interest is compounded per year
- The initial amount invested (the principal)
- The number of years invested
- The amount of money accumulated after n years, including interest
- The amount of interest earned
- Whether the interest is compounded annually, quarterly, monthly, or daily
- The future value of a present lump sum
- Whether additional contributions are made to the account on a periodic basis
- Whether the principal is being decreased by additional contributions

This calculator can also be used to calculate the future value of a present lump sum. For example, if you invest $1,000 today at a 7% annual interest rate, how much will $1,000 be worth if invested for 10 years?

### Options

- `principal` The initial amount invested
- `rate` The interest rate (or growth rate) per annum
- `years` The number of years invested
- `paymentsPerAnnum` The number of contribution payments per annum (eg 12 for monthly) -- also used to show the interest balance per period?? so if you want the interest to show monthly for each year.
- `amountPerAnnum` The amount of contributions per annum (eg 6_000 for 500 per month)
- `accrualOfPaymentsPerAnnum` If provided payments accrue interest per annum; Otherwise interest is only accrued on the principal payment.
- `currentPositionInYears` The current position in years (eg 2 for the second year of the investment)
- `debtRepayment` if provided this denotes that the principal is borrowed. `amountPerAnnum` will become the cost of paying off the principal over the duration and principal will be excluded from the `totalInvestment`. This is essentially an interest only payment and will be the only investment cost over the duration.

### Examples

```ts
// calculate a lump sum over 2 years
const lumpSum = compoundInterestPerPeriod({
  principal: 500,
  rate: 3.4,
  years: 2,
  paymentsPerAnnum: 12 // displays monthly interest balance
});
console.log("lumpSum", lumpSum);

// calculate a lump sum over 2 years with additional contributions of 500 per month
const additionalContributions = compoundInterestPerPeriod({
  principal: 500,
  rate: 3.4,
  years: 2,
  paymentsPerAnnum: 12,
  amountPerAnnum: 6_000,
  accrualOfPaymentsPerAnnum: true
});
console.log("additionalContributions", additionalContributions);

// example interest only payment
const valueOfHome = compoundInterestPerPeriod({
  principal: 250_000,
  rate: 7.8,
  years: 1,
  paymentsPerAnnum: 12,
  amountPerAnnum: 12_000,
  debtRepayment: true
});
console.log("valueOfHome", valueOfHome);
```
