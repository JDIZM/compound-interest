import { describe, expect, it } from "vitest";
import { compoundInterestOverYears, compoundInterestPerPeriod, InterestOptions } from "./compoundInterest";

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
  it("should calculate a lump sum with no contributions", () => {
    const options: InterestOptions = {
      principal: 500,
      rate: 3.4,
      years: 2,
      paymentsPerAnnum: 12,
      amountPerAnnum: 0
    };
    const result = compoundInterestPerPeriod(options);
    expect(result).toMatchObject(
      expect.objectContaining({
        accrualOfPaymentsPerAnnum: false,
        currentBalance: 534.58,
        currentPositionInYears: undefined,
        endBalance: 534.578,
        paymentsPerAnnum: 12,
        totalPayments: 1,
        rate: 0.034,
        totalInvestment: 500,
        investmentType: "lumpSum"
      })
    );
  });

  it("should calculate monthly contributions", () => {
    //
  });

  it("should calc compound interest over multiple years with debtRepayment option", () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 12,
      amountPerAnnum: 12_000,
      debtRepayment: true
    };
    const result = compoundInterestPerPeriod(options);
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
        totalInvestment: 348000,
        investmentType: "debtRepayment"
      })
    );
  });

  it("should calc compound interest over multiple years with contributions", () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 12,
      amountPerAnnum: 12_000
    };
    const result = compoundInterestPerPeriod(options);
    expect(result).toMatchObject(
      expect.objectContaining({
        accrualOfPaymentsPerAnnum: false,
        currentBalance: 2207415.47,
        currentPositionInYears: undefined,
        endBalance: 2207415.4267796557,
        paymentsPerAnnum: 12,
        totalPayments: 348,
        rate: 0.078,
        totalInvestment: 598000,
        investmentType: "contribution"
      })
    );
  });

  it("when default options are supplied", () => {
    // const result = compoundInterestPerPeriod({
    //   principal: 250_000,
    //   rate: 7.8,
    //   years: 29
    // });
  });

  it('when "accrualOfPaymentsPerAnnum" is true', () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 12,
      amountPerAnnum: 12_000,
      accrualOfPaymentsPerAnnum: true
    };
    const result = compoundInterestPerPeriod(options);
  });

  it("when currentPositionInYears is supplied", () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 12,
      amountPerAnnum: 12_000,
      currentPositionInYears: 5,
      accrualOfPaymentsPerAnnum: false
    };
    const result = compoundInterestPerPeriod(options);
  });

  it("when paymentsPerAnnum is 1", () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 1,
      amountPerAnnum: 12_000,
      currentPositionInYears: 5,
      accrualOfPaymentsPerAnnum: false
    };
    const result = compoundInterestPerPeriod(options);
  });

  it("when there are more than one paymentsPerAnnum", () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 12,
      amountPerAnnum: 12_000,
      currentPositionInYears: 5,
      accrualOfPaymentsPerAnnum: false
    };
    const result = compoundInterestPerPeriod(options);
  });

  it("when amount per annum is 0", () => {
    const options: InterestOptions = {
      principal: 500,
      rate: 3.4,
      years: 1,
      paymentsPerAnnum: 12,
      amountPerAnnum: 0,
      accrualOfPaymentsPerAnnum: false
    };
    const result = compoundInterestPerPeriod(options);
  });
  it("when amount per annum is not 0 total investment should accrue correctly", () => {
    const options: InterestOptions = {
      principal: 500,
      rate: 3.4,
      years: 1,
      paymentsPerAnnum: 12,
      amountPerAnnum: 6_000,
      accrualOfPaymentsPerAnnum: false
    };
    const result = compoundInterestPerPeriod(options);
  });
});
