import type { FireNumberOptions, FireNumberResult, YearsToFireOptions } from "../types/calculator";
import { toDecimalRate } from "./helpers";

/**
 * Calculate the FIRE number (savings needed for financial independence)
 * based on annual spend and a safe withdrawal rate.
 *
 * @example
 * fireNumber({ annualSpend: 40_000, withdrawalRate: 4 }); // -> 1_000_000
 */
export const fireNumber = (options: FireNumberOptions): FireNumberResult => {
  const { annualSpend } = options;
  const withdrawalRate = toDecimalRate(options.withdrawalRate ?? 4);

  if (annualSpend <= 0) throw new Error("annualSpend must be greater than 0");
  if (withdrawalRate <= 0) throw new Error("withdrawalRate must be greater than 0");
  if (withdrawalRate > 1) throw new Error("withdrawalRate must be less than or equal to 100%");

  const target = annualSpend / withdrawalRate;

  return {
    annualSpend,
    withdrawalRate,
    target: Number(target.toFixed(2)),
    monthlyIncome: Number((annualSpend / 12).toFixed(2))
  };
};

/**
 * Calculate the years needed to reach a FIRE number given current savings, annual contribution, and expected return.
 *
 * Solves the future value of an annuity for n:
 *   n = ln((FV + PMT/r) / (PV + PMT/r)) / ln(1 + r)
 *
 * @example
 * yearsToFire({
 *   currentSavings: 50_000,
 *   annualContribution: 20_000,
 *   annualReturn: 7,
 *   target: 1_000_000,
 * });
 */
export const yearsToFire = (options: YearsToFireOptions): number => {
  const { currentSavings, annualContribution, target } = options;
  const annualReturn = toDecimalRate(options.annualReturn);

  if (target <= 0) throw new Error("target must be greater than 0");
  if (currentSavings < 0) throw new Error("currentSavings cannot be negative");
  if (annualContribution < 0) throw new Error("annualContribution cannot be negative");
  if (currentSavings >= target) return 0;

  if (annualReturn === 0) {
    if (annualContribution <= 0) throw new Error("FIRE is unreachable with no return and no contribution");
    return Number(((target - currentSavings) / annualContribution).toFixed(2));
  }

  // A return of -100% or lower breaks the log() solve (Math.log of a non-positive number is NaN).
  if (1 + annualReturn <= 0) throw new Error("annualReturn must be greater than -100%");

  const numerator = target * annualReturn + annualContribution;
  const denominator = currentSavings * annualReturn + annualContribution;
  if (denominator <= 0 || numerator <= 0) throw new Error("FIRE is unreachable with these inputs");

  const years = Math.log(numerator / denominator) / Math.log(1 + annualReturn);
  return Number(years.toFixed(2));
};
