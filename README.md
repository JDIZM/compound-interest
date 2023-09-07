# compound interest

A finance calculator to calculate compound interest over a period of time with different investment types.

### Features

This calculator can be used to calculate the future value of a present lump sum with contributions, debt repayment or mortgage. The calculator compounds interest per period and can be used to calculate the value of investments or debt over a period of time.

For example, if you invest $1,000 today at a 7% annual interest rate, how much will $1,000 be worth if invested for 10 years?

#### Compound Interest

- [x] 1. calculate compound interest of a lump sum over time
- [x] 2. calculate compound interest with additional contributions
- [x] 3. calculate compound interest with interest only payments towards the principal borrowed
- [x] 4. calculate compound interest with repayments towards the principal

#### Mortgage

<!-- TODO this is essentially done the only difference is we dont have a deposit option -->

- [ ] 1. calculate mortgage repayments

#### Casfhlow

- [ ] 1. calculate cashflow

### Options

- `principal: number` The initial amount invested or borrowed
- `rate: number` The interest rate (or growth rate) per annum
- `years: number` The number of years invested
- `paymentsPerAnnum: number` The number of contribution payments per annum (eg 12 for monthly) will be used to show the interest balance per period. So if you want the interest to show monthly for each year then make sure you define the paymentsPerAnnum as 12.
- `currentPositionInYears: number` The current position in years (eg 2 for the second year of the investment)

#### Contribution Options

- `amountPerAnnum: number` The amount of contributions per annum (eg 6_000 for 500 per month)
- `accrualOfPaymentsPerAnnum: number` If provided payments accrue interest per annum; Otherwise interest is only accrued on the principal payment.

#### Debt Repayment Options

- `debtRepayment: object` if provided this denotes that the principal is borrowed.

It will calculate the monthly interest payments for a given interest rate and principal borrowed.

- `interestRate: number` - the interest rate of borrowing
- `type: "interestOnly"` // this is the default

### Investment Types

What are investment types? These are used to calculate the final results:

1. lumpSum - a single investment calculated over a period of time
2. debtRepayment - a borrowed investment calculated over a period of time with a decreasing principal or interest only payments
3. contribution - a single investment calculated over a period of time with additional contributions
4. mortgage `not yet implemented`

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

// example interest only payment with an interest rate of 6% on a principal of 250,000
const valueOfHome = compoundInterestPerPeriod({
  principal: 250_000,
  rate: 4,
  years: 25,
  paymentsPerAnnum: 12,
  debtRepayment: {
    interestRate: 6,
    type: "interestOnly"
  }
});
console.log("valueOfHome", valueOfHome);
```
