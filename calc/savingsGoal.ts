import type { SavingsGoalContributionOptions, SavingsGoalYearsOptions, SavingsGoalResult } from "../types/calculator";
import { toDecimalRate } from "./helpers";

/**
 * Solve for the periodic contribution needed to reach a savings target.
 *
 * Uses the future value of an annuity formula, solving for PMT:
 *   FV = PV * (1 + r/n)^(n*t) + PMT * (((1 + r/n)^(n*t) - 1) / (r/n))
 *
 * @example
 * // How much per month to reach £100k in 10 years at 6% with £5k seed?
 * solveContributionForGoal({
 *   target: 100_000,
 *   years: 10,
 *   annualRate: 6,
 *   startingBalance: 5_000,
 *   compoundingPerYear: 12,
 * });
 */
export const solveContributionForGoal = (options: SavingsGoalContributionOptions): SavingsGoalResult => {
  const { target, years, startingBalance = 0, compoundingPerYear = 12 } = options;
  const annualRate = toDecimalRate(options.annualRate);

  if (target <= 0) throw new Error("target must be greater than 0");
  if (years <= 0) throw new Error("years must be greater than 0");
  if (startingBalance < 0) throw new Error("startingBalance cannot be negative");
  if (compoundingPerYear <= 0) throw new Error("compoundingPerYear must be greater than 0");

  const periods = years * compoundingPerYear;
  const ratePerPeriod = annualRate / compoundingPerYear;
  const growthOfStartingBalance = startingBalance * Math.pow(1 + ratePerPeriod, periods);
  const shortfall = target - growthOfStartingBalance;

  let contributionPerPeriod: number;
  if (shortfall <= 0) {
    contributionPerPeriod = 0;
  } else if (ratePerPeriod === 0) {
    contributionPerPeriod = shortfall / periods;
  } else {
    const annuityFactor = (Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod;
    contributionPerPeriod = shortfall / annuityFactor;
  }

  const totalContributions = contributionPerPeriod * periods;
  const interestEarned = target - startingBalance - totalContributions;

  return {
    target,
    years,
    annualRate,
    startingBalance,
    compoundingPerYear,
    contributionPerPeriod: Number(contributionPerPeriod.toFixed(2)),
    contributionPerMonth: Number((contributionPerPeriod * (compoundingPerYear / 12)).toFixed(2)),
    contributionPerYear: Number((contributionPerPeriod * compoundingPerYear).toFixed(2)),
    totalContributions: Number(totalContributions.toFixed(2)),
    interestEarned: Number(interestEarned.toFixed(2)),
    periods
  };
};

/**
 * Solve for the number of years needed to reach a savings target given a contribution.
 *
 * Solves the future value of an annuity for n:
 *   n = ln((FV + PMT/r) / (PV + PMT/r)) / ln(1 + r)
 *
 * @example
 * // How long to reach £100k contributing £500/mo at 6% with £5k seed?
 * solveYearsToGoal({
 *   target: 100_000,
 *   contributionPerMonth: 500,
 *   annualRate: 6,
 *   startingBalance: 5_000,
 * });
 */
export const solveYearsToGoal = (options: SavingsGoalYearsOptions): number => {
  const { target, contributionPerMonth, startingBalance = 0, compoundingPerYear = 12 } = options;
  const annualRate = toDecimalRate(options.annualRate);

  if (target <= 0) throw new Error("target must be greater than 0");
  if (startingBalance >= target) return 0;
  if (contributionPerMonth < 0) throw new Error("contributionPerMonth cannot be negative");
  if (compoundingPerYear <= 0) throw new Error("compoundingPerYear must be greater than 0");

  const ratePerPeriod = annualRate / compoundingPerYear;
  const contributionPerPeriod = contributionPerMonth * (12 / compoundingPerYear);

  if (ratePerPeriod === 0) {
    if (contributionPerPeriod <= 0) throw new Error("Goal is unreachable with no contribution and no return");
    const periods = (target - startingBalance) / contributionPerPeriod;
    return periods / compoundingPerYear;
  }

  const numerator = target * ratePerPeriod + contributionPerPeriod;
  const denominator = startingBalance * ratePerPeriod + contributionPerPeriod;
  if (denominator <= 0) throw new Error("Goal is unreachable with these inputs");

  const periods = Math.log(numerator / denominator) / Math.log(1 + ratePerPeriod);
  return Number((periods / compoundingPerYear).toFixed(2));
};
