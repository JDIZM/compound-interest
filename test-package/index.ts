import { compoundInterestPerPeriod } from "compound-interest/index";

const sevenYears = compoundInterestPerPeriod({
  principal: 5_000,
  rate: 7.8,
  years: 30,
  paymentsPerAnnum: 1,
  amountPerAnnum: 18_000,
  accrualOfPaymentsPerAnnum: true
});
console.log("sevenYears", sevenYears);
