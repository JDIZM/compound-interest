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

  it("throws on each invalid input branch", () => {
    const valid = { homeValue: 200_000, deposit: 20_000, interestRate: 5, years: 25 };
    expect(() => earlyMortgagePayoff({ ...valid, homeValue: 0 })).toThrow("homeValue must be greater than 0");
    expect(() => earlyMortgagePayoff({ ...valid, deposit: -1 })).toThrow("deposit cannot be negative");
    expect(() => earlyMortgagePayoff({ ...valid, deposit: 250_000 })).toThrow("deposit cannot exceed homeValue");
    expect(() => earlyMortgagePayoff({ ...valid, years: 0 })).toThrow("years must be greater than 0");
    expect(() => earlyMortgagePayoff({ ...valid, interestRate: -1 })).toThrow("interestRate cannot be negative");
    expect(() => earlyMortgagePayoff({ ...valid, extraMonthly: -10 })).toThrow("extraMonthly cannot be negative");
    expect(() => earlyMortgagePayoff({ ...valid, lumpSums: [{ month: 12, amount: -1 }] })).toThrow(
      "lump sum amount cannot be negative"
    );
    expect(() =>
      earlyMortgagePayoff({
        ...valid,
        lumpSums: [{ month: 0, amount: 1_000 }]
      })
    ).toThrow("lump sum month must be a positive integer");
  });

  it("rejects non-integer lump sum months (would never match the whole-month schedule)", () => {
    expect(() =>
      earlyMortgagePayoff({
        homeValue: 200_000,
        deposit: 20_000,
        interestRate: 5,
        years: 25,
        lumpSums: [{ month: 1.5, amount: 1_000 }]
      })
    ).toThrow("lump sum month must be a positive integer");
  });

  it("rejects terms longer than the 100-year simulation cap", () => {
    expect(() => earlyMortgagePayoff({ homeValue: 200_000, deposit: 20_000, interestRate: 5, years: 101 })).toThrow(
      "years cannot exceed 100"
    );
  });

  it("treats decimal rate input (0.05) the same as percentage (5)", () => {
    const fromPct = earlyMortgagePayoff({
      homeValue: 300_000,
      deposit: 30_000,
      interestRate: 5,
      years: 25
    });
    const fromDec = earlyMortgagePayoff({
      homeValue: 300_000,
      deposit: 30_000,
      interestRate: 0.05,
      years: 25
    });
    expect(fromPct.baseMonthlyPayment).toBeCloseTo(fromDec.baseMonthlyPayment, 1);
  });
});
