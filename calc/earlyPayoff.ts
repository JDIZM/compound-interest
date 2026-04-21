import type { EarlyPayoffOptions, EarlyPayoffResult, PayoffScheduleEntry } from "../types/calculator";
import { PMT } from "./compoundInterest";
import { toDecimalRate } from "./helpers";

const MAX_MONTHS = 100 * 12;

/**
 * Simulate a repayment mortgage with optional extra monthly payments and one-off lump sums.
 * Returns months and interest saved versus the baseline schedule.
 *
 * @example
 * earlyMortgagePayoff({
 *   homeValue: 300_000,
 *   deposit: 30_000,
 *   interestRate: 5,
 *   years: 25,
 *   extraMonthly: 200,
 *   lumpSums: [{ month: 24, amount: 10_000 }]
 * });
 */
export const earlyMortgagePayoff = (options: EarlyPayoffOptions): EarlyPayoffResult => {
  const { homeValue, deposit, years, extraMonthly = 0, lumpSums = [] } = options;
  const rate = toDecimalRate(options.interestRate);

  if (homeValue <= 0) throw new Error("homeValue must be greater than 0");
  if (deposit < 0) throw new Error("deposit cannot be negative");
  if (deposit >= homeValue) throw new Error("deposit cannot exceed homeValue");
  if (years <= 0) throw new Error("years must be greater than 0");
  if (rate < 0) throw new Error("interestRate cannot be negative");
  if (extraMonthly < 0) throw new Error("extraMonthly cannot be negative");

  const principal = homeValue - deposit;
  const monthlyRate = rate / 12;
  const termMonths = years * 12;
  const baseMonthlyPayment = Number(PMT(monthlyRate, termMonths, principal, 0, 0).toFixed(2));
  const baselineTotalInterest = Number((baseMonthlyPayment * termMonths - principal).toFixed(2));

  const lumpByMonth = new Map<number, number>();
  for (const { month, amount } of lumpSums) {
    if (amount < 0) throw new Error("lump sum amount cannot be negative");
    if (month <= 0) throw new Error("lump sum month must be greater than 0");
    lumpByMonth.set(month, (lumpByMonth.get(month) ?? 0) + amount);
  }

  const schedule: PayoffScheduleEntry[] = [];
  let balance = principal;
  let totalInterestPaid = 0;
  let month = 0;

  while (balance > 0 && month < MAX_MONTHS) {
    month += 1;
    const interest = balance * monthlyRate;
    const principalPayment = Math.min(balance, baseMonthlyPayment - interest + extraMonthly);
    const lumpThisMonth = Math.min(lumpByMonth.get(month) ?? 0, balance - principalPayment);
    balance = Math.max(0, balance - principalPayment - lumpThisMonth);
    totalInterestPaid += interest;

    schedule.push({
      month,
      interest: Number(interest.toFixed(2)),
      principal: Number(principalPayment.toFixed(2)),
      lumpSum: Number(lumpThisMonth.toFixed(2)),
      balance: Number(balance.toFixed(2))
    });
  }

  const newTotalInterest = Number(totalInterestPaid.toFixed(2));

  return {
    principal,
    baselineMonths: termMonths,
    baselineTotalInterest,
    baseMonthlyPayment,
    newMonths: month,
    newTotalInterest,
    monthsSaved: Math.max(0, termMonths - month),
    interestSaved: Number((baselineTotalInterest - newTotalInterest).toFixed(2)),
    schedule
  };
};
