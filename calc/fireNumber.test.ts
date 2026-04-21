import { describe, expect, it } from "vitest";
import { fireNumber, yearsToFire } from "./fireNumber";

describe("fireNumber", () => {
  it("applies the 4% rule by default", () => {
    const result = fireNumber({ annualSpend: 40_000 });
    expect(result.target).toBe(1_000_000);
    expect(result.withdrawalRate).toBeCloseTo(0.04, 5);
    expect(result.monthlyIncome).toBeCloseTo(40_000 / 12, 1);
  });

  it("accepts a custom withdrawal rate as percentage or decimal", () => {
    const pct = fireNumber({ annualSpend: 30_000, withdrawalRate: 3.5 });
    const dec = fireNumber({ annualSpend: 30_000, withdrawalRate: 0.035 });
    expect(pct.target).toBeCloseTo(dec.target, 2);
    expect(pct.target).toBeCloseTo(30_000 / 0.035, 2);
  });

  it("throws on invalid inputs", () => {
    expect(() => fireNumber({ annualSpend: 0 })).toThrow();
    expect(() => fireNumber({ annualSpend: 40_000, withdrawalRate: 0 })).toThrow();
    expect(() => fireNumber({ annualSpend: 40_000, withdrawalRate: 150 })).toThrow();
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
    ).toThrow();
  });
});
