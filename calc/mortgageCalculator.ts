import type { MortgageType, MortgageResult, MortgageOptions, InterestOnlyMortgageResult } from "../types/calculator";
import { calcInterestPayments, PMT } from "./compoundInterest";

const calcMortgageRepayment = (mortgage: MortgageOptions, principal: number): MortgageResult => {
  const { homeValue, deposit, interestRate: rate, years } = mortgage;

  // The monthly repayment on the principal
  const monthlyRepayment = Math.round(PMT(rate / 100 / 12, years * 12, principal, 0, 0) * 100) / 100;

  return {
    homeValue,
    deposit,
    years,
    interestRate: rate,
    monthlyRepayment,
    principal
  };
};

const calcInterestOnly = (mortgage: MortgageOptions, principal: number): InterestOnlyMortgageResult => {
  const { homeValue, deposit, interestRate: rate, years } = mortgage;

  // calculate the interest only payments
  const interestPayments = calcInterestPayments(principal, rate, 12);

  return {
    interestPayments,
    homeValue,
    deposit,
    principal,
    years,
    interestRate: rate
  };
};

export const mortgageCalculator = (
  mortgage: MortgageOptions,
  type: MortgageType
): MortgageResult | InterestOnlyMortgageResult => {
  // The amount borrowed
  const principal = mortgage.homeValue - mortgage.deposit;

  if (principal < 0) {
    throw new Error("Principal cannot be negative");
  }

  if (mortgage.years < 0) {
    throw new Error("Years cannot be negative");
  }

  if (mortgage.interestRate < 0) {
    throw new Error("Interest rate cannot be negative");
  }

  if (mortgage.homeValue < 0) {
    throw new Error("Home value cannot be negative");
  }

  if (mortgage.deposit < 0) {
    throw new Error("Deposit cannot be negative");
  }

  if (mortgage.deposit > mortgage.homeValue) {
    throw new Error("Deposit cannot be greater than home value");
  }

  if (mortgage.years === 0) {
    throw new Error("Years cannot be 0");
  }

  if (!type || (type !== "interestOnly" && type !== "repayment")) {
    throw new Error("Invalid mortgage type");
  }

  const responses = {
    repayment: () => calcMortgageRepayment(mortgage, principal),
    interestOnly: () => calcInterestOnly(mortgage, principal)
  };

  const result = responses[type]();

  return result;
};
