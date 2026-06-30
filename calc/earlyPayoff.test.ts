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

  it("treats the interest rate as a percentage (6 = 6%, matching the mortgage calculator)", () => {
    const result = earlyMortgagePayoff({
      homeValue: 150_000,
      deposit: 15_000,
      interestRate: 6,
      years: 25
    });
    // 135k principal at 6% over 25y → ~£869.81/mo, the same PMT the mortgage calculator quotes.
    expect(result.baseMonthlyPayment).toBeCloseTo(869.81, 1);
  });

  it("treats a sub-1% rate as a sub-1% percentage, not a decimal (0.5 = 0.5%)", () => {
    const half = earlyMortgagePayoff({ homeValue: 150_000, deposit: 15_000, interestRate: 0.5, years: 25 });
    const six = earlyMortgagePayoff({ homeValue: 150_000, deposit: 15_000, interestRate: 6, years: 25 });
    // 0.5% is a real, tiny rate — its payment sits just above the interest-free baseline and
    // well below the 6% payment. (Under the old heuristic 0.5 was misread as 50%.)
    const interestFree = 135_000 / 300;
    expect(half.baseMonthlyPayment).toBeGreaterThan(interestFree);
    expect(half.baseMonthlyPayment).toBeLessThan(six.baseMonthlyPayment);
  });

  it("handles a 0% interest rate as straight-line repayment (no NaN)", () => {
    const result = earlyMortgagePayoff({
      homeValue: 300_000,
      deposit: 30_000,
      interestRate: 0,
      years: 25
    });

    expect(Number.isNaN(result.baseMonthlyPayment)).toBe(false);
    expect(result.baseMonthlyPayment).toBeCloseTo(900, 2); // 270,000 / 300 months
    expect(result.baselineTotalInterest).toBe(0);
    expect(result.newTotalInterest).toBe(0);
    expect(result.newMonths).toBe(300);
    expect(result.monthsSaved).toBe(0);
  });

  it("saves months at 0% with extra payments and still reports no interest", () => {
    const result = earlyMortgagePayoff({
      homeValue: 300_000,
      deposit: 30_000,
      interestRate: 0,
      years: 25,
      extraMonthly: 100
    });
    // 900 + 100 = 1,000/mo on 270k → 270 months
    expect(result.newMonths).toBe(270);
    expect(result.monthsSaved).toBe(30);
    expect(result.interestSaved).toBe(0);
  });

  it("accumulates multiple lump sums falling in the same month", () => {
    const result = earlyMortgagePayoff({
      homeValue: 200_000,
      deposit: 20_000,
      interestRate: 4,
      years: 20,
      lumpSums: [
        { month: 12, amount: 5_000 },
        { month: 12, amount: 3_000 }
      ]
    });
    expect(result.schedule[11]!.lumpSum).toBe(8_000);
  });

  it("clamps a lump sum that exceeds the outstanding balance and clears the loan", () => {
    const result = earlyMortgagePayoff({
      homeValue: 110_000,
      deposit: 10_000,
      interestRate: 3,
      years: 25,
      lumpSums: [{ month: 2, amount: 500_000 }]
    });
    const last = result.schedule[result.schedule.length - 1]!;
    expect(last.balance).toBeCloseTo(0, 1);
    // The applied lump is clamped to the remaining balance, never more than was owed.
    expect(last.lumpSum).toBeLessThan(110_000);
    expect(result.newMonths).toBeLessThanOrEqual(3);
  });
});
