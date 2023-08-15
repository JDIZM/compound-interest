# compound interest

There are some libraries to take inspiration from

https://www.npmjs.com/package/react-compound-interest

https://www.npmjs.com/package/compound-interest-calc

- https://github.com/BrooksPoltl/compound-interest/blob/master/index.js

https://cameronnokes.com/blog/the-30-second-guide-to-publishing-a-typescript-package-to-npm/

### Features

Compound Interest

- [x] 1. calculate compound interest of a lump sum over time
- [x] 2. calculate compound interest with additional contributions
- [x] 3. calculate compound interest with interest only payments towards the principal borrowed -- it doesn't do this! it just doesn't include the principal in the total investment cost.
- [ ] 4. calculate compound interest with a decreasing principal

Mortgage

- [ ] 1. calculate mortgage repayments

Casfhlow

- [ ] 1. calculate cashflow

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

- `principal: number` The initial amount invested or borrowed
- `rate: number` The interest rate (or growth rate) per annum
- `years: number` The number of years invested
- `paymentsPerAnnum: number` The number of contribution payments per annum (eg 12 for monthly) -- also used to show the interest balance per period?? so if you want the interest to show monthly for each year.
- `amountPerAnnum: number` The amount of contributions per annum (eg 6_000 for 500 per month)
- `accrualOfPaymentsPerAnnum: number` If provided payments accrue interest per annum; Otherwise interest is only accrued on the principal payment.
- `currentPositionInYears: number` The current position in years (eg 2 for the second year of the investment)
- `debtRepayment: object` if provided this denotes that the principal is borrowed. `amountPerAnnum` will become the cost of paying off the principal over the duration and principal will be excluded from the `totalInvestment`. This is essentially an interest only payment and will be the only investment cost over the duration.

// TODO document the return type and new options for debt repayment.

### debtRepayment options

It will calculate the monthly interest payments for a given interest rate and principal borrowed.

- `interestRate: number` - the interest rate of borrowing
- `type: "interestOnly"` // this is the default

### Investment Types

What are investment types? These are used to calculate the final results

1. lumpSum
2. debtRepayment
3. contribution
4. mortgage `not yet implemented`

debtRepayment option is confusing to say the least; all this appears to do is not calculate the principal in the total investment cost.

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
  debtRepayment: {
    type: "interestOnly"
  }
});
console.log("valueOfHome", valueOfHome);
```
