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
    expect(result).toBe(2207415.4267796557);
  });
});

describe("compoundInterestPerPeriod", () => {
  describe("lumpSum", () => {
    it("should calculate an invested principal over a single year with no contributions", () => {
      const options: InterestOptions = {
        principal: 500,
        rate: 3.4,
        years: 1,
        paymentsPerAnnum: 12,
        amountPerAnnum: 0
      };

      const result = compoundInterestPerPeriod(options);

      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentBalance: 517,
          currentPositionInYears: undefined,
          endBalance: 517,
          paymentsPerAnnum: 12,
          totalPayments: 1,
          multiplierPerPeriod: 1.0028333333333332,
          multiplierTotal: 1.034,
          rate: 0.034,
          totalInvestment: 500,
          principal: 500,
          investmentType: "lumpSum",
          interestMatrix: new Map([
            ["1", [501.42, 502.83, 504.25, 505.67, 507.08, 508.5, 509.92, 511.33, 512.75, 514.17, 515.58, 517]]
          ]),
          interestPerAnnum: [17],
          totalInterest: 17
        })
      );
    });

    it("should calculate an invested principal over multiple years with no contributions", () => {
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
          multiplierPerPeriod: 1.0028333333333332,
          multiplierTotal: 1.069156,
          rate: 0.034,
          totalInvestment: 500,
          principal: 500,
          investmentType: "lumpSum",
          interestMatrix: new Map([
            ["1", [501.42, 502.83, 504.25, 505.67, 507.08, 508.5, 509.92, 511.33, 512.75, 514.17, 515.58, 517]],
            ["2", [518.46, 519.93, 521.39, 522.86, 524.32, 525.79, 527.25, 528.72, 530.18, 531.65, 533.11, 534.58]]
          ]),
          interestPerAnnum: [17, 17.578000000000003],
          totalInterest: 34.578
        })
      );
    });
  });

  describe("debtRepayment", () => {
    it("should calculate a borrowed principal over a single year with payments towards the principal", () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 1,
        paymentsPerAnnum: 12,
        amountPerAnnum: 12_000,
        debtRepayment: true
      };
      const result = compoundInterestPerPeriod(options);
      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentPositionInYears: undefined,
          currentBalance: 269_500,
          endBalance: 269_500,
          paymentsPerAnnum: 12,
          totalPayments: 12,
          multiplierPerPeriod: 1.0065,
          multiplierTotal: 1.078,
          rate: 0.078,
          totalInvestment: 12_000,
          principal: 250_000,
          investmentType: "debtRepayment",
          interestMatrix: new Map([
            ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]]
          ]),
          interestPerAnnum: [19500],
          totalInterest: 19500
        })
      );
    });
    it("should calculate a borrowed principal over multiple years with payments towards the principal", () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 2,
        paymentsPerAnnum: 12,
        amountPerAnnum: 12_000,
        debtRepayment: true
      };

      const result = compoundInterestPerPeriod(options);

      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentPositionInYears: undefined,
          currentBalance: 290_521,
          endBalance: 290_521.00000000006,
          paymentsPerAnnum: 12,
          totalPayments: 24,
          multiplierPerPeriod: 1.0065,
          multiplierTotal: 1.1620840000000001,
          rate: 0.078,
          totalInvestment: 24_000,
          principal: 250_000,
          investmentType: "debtRepayment",
          interestMatrix: new Map([
            ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]],
            ["2", [271251.75, 273003.5, 274755.25, 276507, 278258.75, 280010.5, 281762.25, 283514, 285265.75, 287017.5]]
          ]),
          interestPerAnnum: [19500, 21021],
          totalInterest: 40521
        })
      );
    });
  });

  describe("contribution", () => {
    it("should calculate an invested principal with monthly contributions over a single year", () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 1,
        paymentsPerAnnum: 12,
        amountPerAnnum: 12_000
      };

      const result = compoundInterestPerPeriod(options);

      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentPositionInYears: undefined,
          paymentsPerAnnum: 12,
          totalPayments: 12,
          principal: 250_000,
          rate: 0.078,
          totalInvestment: 262_000,
          currentBalance: 269_500,
          totalInterest: 19_500,
          endBalance: 269_500,
          investmentType: "contribution",
          interestMatrix: new Map([
            ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]]
          ]),
          interestPerAnnum: [19500]
        })
      );
    });
    it("should calculate an invested principal with monthly contributions over multiple years", () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 2,
        paymentsPerAnnum: 12,
        amountPerAnnum: 12_000
      };

      const result = compoundInterestPerPeriod(options);

      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentPositionInYears: undefined,
          paymentsPerAnnum: 12,
          totalPayments: 24,
          principal: 250_000,
          multiplierPerPeriod: 1.0065,
          multiplierTotal: 1.1620840000000001,
          rate: 0.078,
          totalInvestment: 274_000,
          currentBalance: 290_521,
          endBalance: 290_521.00000000006,
          totalInterest: 40_521,
          investmentType: "contribution",
          interestMatrix: new Map([
            ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]],
            [
              "2",
              [
                271251.75, 273003.5, 274755.25, 276507, 278258.75, 280010.5, 281762.25, 283514, 285265.75, 287017.5,
                288769.25, 290521
              ]
            ]
          ]),
          interestPerAnnum: [19500, 21021]
        })
      );
    });
  });

  it("when default options are supplied", () => {
    // const result = compoundInterestPerPeriod({
    //   principal: 250_000,
    //   rate: 7.8,
    //   years: 29
    // });
  });

  describe("accrualOfPaymentsPerAnnum", () => {
    it('when "accrualOfPaymentsPerAnnum" is true', () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 2,
        paymentsPerAnnum: 12,
        amountPerAnnum: 12_000,
        accrualOfPaymentsPerAnnum: true
      };
      const result = compoundInterestPerPeriod(options);
      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: true,
          currentPositionInYears: undefined,
          paymentsPerAnnum: 12,
          // totalPayments: 1,
          totalPayments: 24, // FIXME returning a single payment
          principal: 250_000,
          multiplierPerPeriod: 1.0065,
          multiplierTotal: 1.1620840000000001,
          rate: 0.078,
          totalInvestment: 274_000,
          currentBalance: 318_109.82,
          endBalance: 318_109.82,
          totalInterest: 44_109.82369477549,
          // investmentType: "lumpSum",
          investmentType: "contribution", // FIXME should be contribution
          ratePerPeriod: 0.0065,
          interestMatrix: new Map([
            [
              "1",
              [
                252631.5, 255280.1, 257945.93, 260629.07, 263329.66, 266047.81, 268783.62, 271537.21, 274308.7,
                277098.21, 279905.85, 282731.73
              ]
            ],
            [
              "2",
              [
                285575.99, 288438.73, 291320.08, 294220.16, 297139.09, 300077, 303034, 306010.22, 309005.79, 312020.82,
                315055.46, 318109.82
              ]
            ]
          ]),
          interestPerAnnum: [20731.73476567011, 23378.088929105386]
        })
      );
    });
  });

  describe("paymentsPerAnnum", () => {
    it("when paymentsPerAnnum is 1 it returns a breakdown of the balance for each year", () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 2,
        paymentsPerAnnum: 1,
        amountPerAnnum: 12_000
      };
      const result = compoundInterestPerPeriod(options);
      expect(result).toMatchObject(
        expect.objectContaining({
          paymentsPerAnnum: 1,
          totalPayments: 2,
          interestMatrix: new Map([
            ["1", [269500]],
            ["2", [290521]]
          ])
        })
      );
    });

    it("when there are more than one paymentsPerAnnum it returns a monthly breakdown of balance", () => {
      const options: InterestOptions = {
        principal: 250_000,
        rate: 7.8,
        years: 1,
        paymentsPerAnnum: 12,
        amountPerAnnum: 12_000
      };
      const result = compoundInterestPerPeriod(options);
      expect(result).toMatchObject(
        expect.objectContaining({
          paymentsPerAnnum: 12,
          totalPayments: 12,
          interestMatrix: new Map([
            ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]]
          ])
        })
      );
    });
  });

  it("when currentPositionInYears is supplied", () => {
    const options: InterestOptions = {
      principal: 250_000,
      rate: 7.8,
      years: 29,
      paymentsPerAnnum: 12,
      amountPerAnnum: 12_000,
      currentPositionInYears: 5
    };
    const result = compoundInterestPerPeriod(options);
  });
});