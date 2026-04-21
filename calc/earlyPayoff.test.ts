import { describe, expect, it } from "vitest";
import { earlyMortgagePayoff } from "./earlyPayoff";

describe("earlyMortgagePayoff", () => {
  it("matches the baseline schedule when no extras are provided", () => {
    const result = earlyMortgagePayoff({
      homeValue: 300_000,
      deposit: 30_000,
      interestRate: 5,
      years: 25
    });

    expect(result.principal).toBe(270_000);
    expect(result.baselineMonths).toBe(300);
    // Rounding PMT to 2dp can leave a trailing tiny balance; allow one extra month
    expect(result.newMonths).toBeGreaterThanOrEqual(300);
    expect(result.newMonths).toBeLessThanOrEqual(301);
    expect(result.monthsSaved).toBe(0);
    expect(Math.abs(result.interestSaved)).toBeLessThan(5);
    expect(result.schedule.length).toBe(result.newMonths);
    expect(result.schedule[result.schedule.length - 1]!.balance).toBeCloseTo(0, 1);
  });

  it("saves months and interest with an extra monthly payment", () => {
    const result = earlyMortgagePayoff({
      homeValue: 300_000,
      deposit: 30_000,
      interestRate: 5,
      years: 25,
      extraMonthly: 200
    });

    expect(result.newMonths).toBeLessThan(300);
    expect(result.monthsSaved).toBeGreaterThan(24);
    expect(result.interestSaved).toBeGreaterThan(20_000);
    expect(result.schedule[result.schedule.length - 1]!.balance).toBeCloseTo(0, 1);
  });

  it("applies lump sum payments in the correct month and clears the balance", () => {
    const result = earlyMortgagePayoff({
      homeValue: 200_000,
      deposit: 20_000,
      interestRate: 4,
      years: 20,
      lumpSums: [
        { month: 12, amount: 5_000 },
        { month: 60, amount: 15_000 }
      ]
    });

    expect(result.schedule[11]!.lumpSum).toBe(5_000);
    expect(result.schedule[59]!.lumpSum).toBe(15_000);
    expect(result.schedule[result.schedule.length - 1]!.balance).toBeCloseTo(0, 1);
    expect(result.monthsSaved).toBeGreaterThan(0);
  });

  it("throws when inputs are invalid", () => {
    expect(() => earlyMortgagePayoff({ homeValue: 0, deposit: 0, interestRate: 5, years: 25 })).toThrow();
    expect(() =>
      earlyMortgagePayoff({ homeValue: 200_000, deposit: 250_000, interestRate: 5, years: 25 })
    ).toThrow();
    expect(() => earlyMortgagePayoff({ homeValue: 200_000, deposit: 20_000, interestRate: -1, years: 25 })).toThrow();
    expect(() =>
      earlyMortgagePayoff({
        homeValue: 200_000,
        deposit: 20_000,
        interestRate: 5,
        years: 25,
        lumpSums: [{ month: 0, amount: 1_000 }]
      })
    ).toThrow();
  });
});
