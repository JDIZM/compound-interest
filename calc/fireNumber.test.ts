import { describe, expect, it } from "vitest";
import { fireNumber, yearsToFire } from "./fireNumber";

describe("fireNumber", () => {
  it("applies the 4% rule by default", () => {
    const result = fireNumber({ annualSpend: 40_000 });
    expect(result.target).toBe(1_000_000);
    expect(result.withdrawalRate).toBeCloseTo(0.04, 5);
    expect(result.monthlyIncome).toBeCloseTo(40_000 / 12, 1);
  });

  it("treats a custom withdrawal rate as a percentage (3.5 = 3.5%)", () => {
    const result = fireNumber({ annualSpend: 30_000, withdrawalRate: 3.5 });
    expect(result.withdrawalRate).toBeCloseTo(0.035, 5);
    expect(result.target).toBeCloseTo(30_000 / 0.035, 2);
  });

  it("treats a sub-1% withdrawal rate correctly (0.5 = 0.5%, not 50%)", () => {
    const result = fireNumber({ annualSpend: 40_000, withdrawalRate: 0.5 });
    // 0.5% SWR → 40,000 / 0.005 = 8,000,000. The old heuristic misread 0.5 as 50% → 80,000.
    expect(result.target).toBeCloseTo(8_000_000, 2);
  });

  it("throws on invalid inputs", () => {
    expect(() => fireNumber({ annualSpend: 0 })).toThrow();
    expect(() => fireNumber({ annualSpend: 40_000, withdrawalRate: 0 })).toThrow();
    expect(() => fireNumber({ annualSpend: 40_000, withdrawalRate: 150 })).toThrow();
  });

  it("accepts a 100% withdrawal rate (one year of expenses saved)", () => {
    // toDecimalRate converts 100 -> 1.0 which now passes the guard (> 1 throws, == 1 allowed).
    const result = fireNumber({ annualSpend: 40_000, withdrawalRate: 100 });
    expect(result.target).toBe(40_000);
  });
});

describe("yearsToFire", () => {
  it("solves years to FIRE for a typical accumulator", () => {
    const years = yearsToFire({
      currentSavings: 50_000,
      annualContribution: 20_000,
      annualReturn: 7,
      target: 1_000_000
    });

    expect(years).toBeGreaterThan(18);
    expect(years).toBeLessThan(22);
  });

  it("returns 0 when current savings already hit the target", () => {
    const years = yearsToFire({
      currentSavings: 1_500_000,
      annualContribution: 20_000,
      annualReturn: 7,
      target: 1_000_000
    });
    expect(years).toBe(0);
  });

  it("falls back to plain division at zero return", () => {
    const years = yearsToFire({
      currentSavings: 0,
      annualContribution: 20_000,
      annualReturn: 0,
      target: 100_000
    });
    expect(years).toBe(5);
  });

  it("throws when FIRE is unreachable without a return and without contributions", () => {
    expect(() =>
      yearsToFire({
        currentSavings: 100_000,
        annualContribution: 0,
        annualReturn: 0,
        target: 500_000
      })
    ).toThrow("FIRE is unreachable with no return and no contribution");
  });

  it("throws on each invalid input branch", () => {
    const valid = { currentSavings: 50_000, annualContribution: 20_000, annualReturn: 7, target: 1_000_000 };
    expect(() => yearsToFire({ ...valid, target: 0 })).toThrow("target must be greater than 0");
    expect(() => yearsToFire({ ...valid, target: -10 })).toThrow("target must be greater than 0");
    expect(() => yearsToFire({ ...valid, currentSavings: -1 })).toThrow("currentSavings cannot be negative");
    expect(() => yearsToFire({ ...valid, annualContribution: -1 })).toThrow("annualContribution cannot be negative");
  });

  it("throws when the return is -100% or lower (would break the log solve)", () => {
    expect(() =>
      yearsToFire({ currentSavings: 50_000, annualContribution: 20_000, annualReturn: -150, target: 1_000_000 })
    ).toThrow("annualReturn must be greater than -100%");
  });

  it("throws when a negative return with no contribution makes FIRE unreachable", () => {
    expect(() =>
      yearsToFire({ currentSavings: 50_000, annualContribution: 0, annualReturn: -50, target: 1_000_000 })
    ).toThrow("FIRE is unreachable with these inputs");
  });
});
