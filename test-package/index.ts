import { compoundInterestPerPeriod } from "compound-interest";
import type { CompoundInterestResult } from "compound-interest/types/calculator";

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
