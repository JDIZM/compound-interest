import { compoundInterestPerPeriod, mortgageCalculator } from "@jdizm/finance-calculator";
import type { CompoundInterestResult } from "@jdizm/finance-calculator/types/calculator";

// example interest only payment
const valueOfHome: CompoundInterestResult = compoundInterestPerPeriod({
  principal: 150_000,
  rate: 4,
  years: 5,
  paymentsPerAnnum: 12,
  amountPerAnnum: 12_000,
  debtRepayment: {
    interestRate: 6,
    type: "interestOnly"
  }
});

console.log("valueOfHome", valueOfHome);

const mortgage = mortgageCalculator({
  homeValue: 150_000,
  deposit: 10_000,
  interestRate: 4,
  years: 25,
}, "repayment")

console.log("mortgage", mortgage);