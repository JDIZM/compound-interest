import { describe, expect, it } from "vitest";
import { compoundInterestOverYears, compoundInterestPerPeriod } from "./compoundInterest";

describe("compoundInterestOverYears", () => {
  it("should calc interest with a decimal rate over 1 year", () => {
    const result = compoundInterestOverYears(100, 0.1, 1);
    expect(result).toBe(110.00000000000001);
  });
  it("should calc interest with a decimal rate over multiple years", () => {
    const result = compoundInterestOverYears(100, 0.1, 2);
    expect(result).toBe(121.00000000000001);
  });
  it("should calc interest with a percentage over multiple years", () => {
    const result = compoundInterestOverYears(250_000, 7.8, 29);
    expect(result).toMatchInlineSnapshot(`2207415.4267796557`);
  });
});

describe("compoundInterestPerPeriod", () => {
  it("should calc compound interest over multiple years", () => {
    const result = compoundInterestPerPeriod(250_000, 7.8, 29, 12, 12_000);
    expect(result).toMatchObject(
      expect.objectContaining({
        accrualOfPaymentsPerAnnum: false,
        currentBalance: 2207415.47,
        currentPositionInYears: undefined,
        // currentBalance: 2207415.46872,
        endBalance: 2207415.4267796557,
        paymentsPerAnnum: 12,
        totalPayments: 348,
        rate: 0.078,
        totalInvestment: 598000
      })
    );
  });
});
