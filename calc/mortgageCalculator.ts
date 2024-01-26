import { InterestOnlyMortgageResult, MortgageOptions, MortgageResult, MortgageType } from "../types/calculator";
import { calcInterestPayments, PMT } from "./compoundInterest";

const calcMortgageRepayment = (mortgage: MortgageOptions, principal: number): MortgageResult => {
  const { homeValue, deposit, interestRate: rate, years } = mortgage;

  // The monthly repayment on the principal
  const monthlyRepayment = Math.round(PMT(rate / 100 / 12, years * 12, principal, 0, 0) * 100) / 100;

  // if interest rate was 3% higher
  const threePercentHigherMonthlyRepayment =
    Math.round(PMT((rate + 3) / 100 / 12, years * 12, principal, 0, 0) * 100) / 100;

  return {
    homeValue,
    deposit,
    years,
    interestRate: rate,
    monthlyRepayment,
    threePercentHigherMonthlyRepayment,
    principal
  };
};

const calcInterestOnly = (mortgage: MortgageOptions, principal: number): InterestOnlyMortgageResult => {
  const { homeValue, deposit, interestRate: rate, years } = mortgage;
  // calculate the interest only payments
  const interestPayments = calcInterestPayments(principal, rate, 12);
  const threePercentHigherMonthlyRepayment = calcInterestPayments(principal, rate + 3, 12);

  return {
    interestPayments,
    homeValue,
    deposit,
    principal,
    years,
    interestRate: rate,
    threePercentHigherMonthlyRepayment: threePercentHigherMonthlyRepayment.monthly
  };
};

export function mortgageCalculator(mortgage: MortgageOptions, type: MortgageType) {
  // The amount borrowed
  const principal = mortgage.homeValue - mortgage.deposit;

  const responses = {
    repayment: () => calcMortgageRepayment(mortgage, principal),
    interestOnly: () => calcInterestOnly(mortgage, principal)
  };

  return responses[type]();
}
