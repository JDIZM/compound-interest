import { compoundInterestPerPeriod, mortgageCalculator } from "@jdizm/finance-calculator";
import type { CompoundInterestResult, IOptions } from "@jdizm/finance-calculator/types/calculator";

// example interest only payment
const options: IOptions  = {
  type: "debtRepayment",
  principal: 150_000,
  rate: 4,
  years: 5,
  paymentsPerAnnum: 12,
  debtRepayment: {
    interestRate: 6,
    type: "interestOnly"
  }
}
const valueOfHome: CompoundInterestResult = compoundInterestPerPeriod(options);

console.log("valueOfHome", valueOfHome);

const mortgage = mortgageCalculator({
  homeValue: 150_000,
  deposit: 10_000,
  interestRate: 4,
  years: 25,
}, "repayment")

console.log("mortgage", mortgage);