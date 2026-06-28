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
    // interestEarned must not go negative when the starting balance already outgrows the target.
    expect(result.interestEarned).toBeGreaterThanOrEqual(0);
  });

  it("treats the rate as a percentage (a higher rate needs a smaller contribution)", () => {
    const low = solveContributionForGoal({ target: 50_000, years: 5, annualRate: 2 });
    const high = solveContributionForGoal({ target: 50_000, years: 5, annualRate: 8 });
    // Compounding does more of the work at 8% than at 2%, so less needs to be contributed.
    expect(high.contributionPerMonth).toBeLessThan(low.contributionPerMonth);
    expect(high.interestEarned).toBeGreaterThan(low.interestEarned);
  });

  it("treats a sub-1% rate as a sub-1% percentage, not a decimal", () => {
    // 0.5 means 0.5%, which is barely above zero-rate (straight division). Under the old
    // heuristic 0.5 was misread as 50% and produced a wildly smaller contribution.
    const halfPct = solveContributionForGoal({ target: 12_000, years: 1, annualRate: 0.5 });
    const zero = solveContributionForGoal({ target: 12_000, years: 1, annualRate: 0 });
    expect(halfPct.contributionPerMonth).toBeLessThan(zero.contributionPerMonth);
    expect(halfPct.contributionPerMonth).toBeGreaterThan(995); // just under the £1,000 zero-rate figure
  });

  it("handles non-monthly compounding (quarterly)", () => {
    const result = solveContributionForGoal({ target: 100_000, years: 10, annualRate: 6, compoundingPerYear: 4 });
    expect(result.periods).toBe(40);
    expect(result.contributionPerYear).toBeCloseTo(result.contributionPerPeriod * 4, 1);
    expect(result.contributionPerMonth).toBeCloseTo((result.contributionPerPeriod * 4) / 12, 1);
  });

  it("throws on invalid inputs", () => {
    expect(() => solveContributionForGoal({ target: 0, years: 5, annualRate: 5 })).toThrow(
      "target must be greater than 0"
    );
    expect(() => solveContributionForGoal({ target: 1000, years: 0, annualRate: 5 })).toThrow(
      "years must be greater than 0"
    );
    expect(() => solveContributionForGoal({ target: 1000, years: 5, annualRate: 5, startingBalance: -1 })).toThrow(
      "startingBalance cannot be negative"
    );
    expect(() => solveContributionForGoal({ target: 1000, years: 5, annualRate: 5, compoundingPerYear: 0 })).toThrow(
      "compoundingPerYear must be greater than 0"
    );
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
    ).toThrow("Goal is unreachable with no contribution and no return");
  });

  it("throws on each invalid input branch", () => {
    expect(() => solveYearsToGoal({ target: 0, contributionPerMonth: 500, annualRate: 5 })).toThrow(
      "target must be greater than 0"
    );
    expect(() => solveYearsToGoal({ target: 10_000, contributionPerMonth: -10, annualRate: 5 })).toThrow(
      "contributionPerMonth cannot be negative"
    );
    expect(() =>
      solveYearsToGoal({ target: 10_000, contributionPerMonth: 500, annualRate: 5, compoundingPerYear: 0 })
    ).toThrow("compoundingPerYear must be greater than 0");
  });

  it("throws when the non-zero-rate path produces a zero denominator (no seed, no contribution)", () => {
    expect(() =>
      solveYearsToGoal({ target: 10_000, contributionPerMonth: 0, annualRate: 5, startingBalance: 0 })
    ).toThrow("Goal is unreachable with these inputs");
  });

  it("throws when startingBalance is negative", () => {
    expect(() =>
      solveYearsToGoal({ target: 10_000, contributionPerMonth: 500, annualRate: 5, startingBalance: -1 })
    ).toThrow("startingBalance cannot be negative");
  });

  it("validates inputs before the already-met early return", () => {
    // startingBalance >= target, but a zero compounding frequency must still throw rather than
    // short-circuit to 0.
    expect(() =>
      solveYearsToGoal({
        target: 10_000,
        contributionPerMonth: 500,
        annualRate: 5,
        startingBalance: 20_000,
        compoundingPerYear: 0
      })
    ).toThrow("compoundingPerYear must be greater than 0");
  });

  it("throws when the rate is -100% or lower (would break the log solve)", () => {
    expect(() =>
      solveYearsToGoal({ target: 100_000, contributionPerMonth: 500, annualRate: -100, compoundingPerYear: 1 })
    ).toThrow("annualRate must be greater than -100%");
  });
});
