import { describe, expect, it } from "vitest";
import { solveContributionForGoal, solveYearsToGoal } from "./savingsGoal";

describe("solveContributionForGoal", () => {
  it("solves the monthly contribution to reach £100k in 10 years at 6% with no starting balance", () => {
    const result = solveContributionForGoal({
      target: 100_000,
      years: 10,
      annualRate: 6,
      compoundingPerYear: 12
    });

    expect(result.contributionPerMonth).toBeGreaterThan(600);
    expect(result.contributionPerMonth).toBeLessThan(620);
    expect(result.periods).toBe(120);
    // totalContributions is the unrounded product; contributionPerMonth is rounded to 2dp — allow small drift
    expect(Math.abs(result.totalContributions - result.contributionPerMonth * 120)).toBeLessThan(5);
    expect(result.interestEarned).toBeGreaterThan(0);
  });

  it("handles a zero-rate account as simple division", () => {
    const result = solveContributionForGoal({
      target: 12_000,
      years: 1,
      annualRate: 0,
      compoundingPerYear: 12
    });

    expect(result.contributionPerMonth).toBe(1_000);
    expect(result.interestEarned).toBe(0);
  });

  it("returns zero contribution when the starting balance already grows past the target", () => {
    const result = solveContributionForGoal({
      target: 10_000,
      years: 10,
      annualRate: 5,
      startingBalance: 20_000
    });

    expect(result.contributionPerMonth).toBe(0);
  });

  it("accepts decimal rates and percentage rates interchangeably", () => {
    const fromPct = solveContributionForGoal({ target: 50_000, years: 5, annualRate: 7 });
    const fromDec = solveContributionForGoal({ target: 50_000, years: 5, annualRate: 0.07 });
    expect(fromPct.contributionPerMonth).toBeCloseTo(fromDec.contributionPerMonth, 1);
  });

  it("throws on invalid inputs", () => {
    expect(() => solveContributionForGoal({ target: 0, years: 5, annualRate: 5 })).toThrow();
    expect(() => solveContributionForGoal({ target: 1000, years: 0, annualRate: 5 })).toThrow();
    expect(() => solveContributionForGoal({ target: 1000, years: 5, annualRate: 5, startingBalance: -1 })).toThrow();
  });
});

describe("solveYearsToGoal", () => {
  it("calculates the years needed to hit a goal at a given monthly contribution", () => {
    const years = solveYearsToGoal({
      target: 100_000,
      contributionPerMonth: 500,
      annualRate: 7,
      startingBalance: 5_000
    });

    expect(years).toBeGreaterThan(10);
    expect(years).toBeLessThan(14);
  });

  it("returns 0 when the starting balance already meets the goal", () => {
    const years = solveYearsToGoal({
      target: 50_000,
      contributionPerMonth: 500,
      annualRate: 5,
      startingBalance: 60_000
    });

    expect(years).toBe(0);
  });

  it("handles zero-rate case with plain division", () => {
    const years = solveYearsToGoal({
      target: 12_000,
      contributionPerMonth: 1000,
      annualRate: 0
    });

    expect(years).toBeCloseTo(1, 3);
  });

  it("throws when the goal is unreachable with no return and no contribution", () => {
    expect(() =>
      solveYearsToGoal({ target: 10_000, contributionPerMonth: 0, annualRate: 0, startingBalance: 100 })
    ).toThrow();
  });
});
