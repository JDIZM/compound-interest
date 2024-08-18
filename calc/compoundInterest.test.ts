import { describe, expect, it } from "vitest";
import { PMT, calcInterestPayments, compoundInterestOverYears, compoundInterestPerPeriod } from "./compoundInterest";
import type { IOptions } from "../types/calculator";

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

describe("PMT", () => {
  const years = 30;
  const rate = 0.05;
  const principal = 240_000;

  it("should calculate the monthly payment for a loan", () => {
    const result = PMT(rate / 12, years * 12, principal, 0, 0);

    expect(result).toBe(1288.3718952291354);
  });
});

describe("calcInterestPayments", () => {
  it("should calculate the monthly interest payments for a given interest rate", () => {
    const result = calcInterestPayments(250_000, 6, 12);

    expect(result).toMatchObject({
      monthly: 1250,
      period: 1250,
      yearly: 15000
    });
  });
});

describe("compoundInterestPerPeriod", () => {
  describe("lumpSum", () => {
    it("should calculate a lump sum over a single year with no contributions", () => {
      const options: IOptions = {
        type: "lumpSum",
        principal: 500,
        rate: 3.4,
        years: 1,
        paymentsPerAnnum: 12
      };

      const result = compoundInterestPerPeriod(options);

      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentBalance: 500,
          currentPositionInYears: 0,
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

    it("should calculate a lump sum over multiple years with no contributions", () => {
      const options: IOptions = {
        type: "lumpSum",
        principal: 500,
        rate: 3.4,
        years: 2,
        paymentsPerAnnum: 12
      };
      const result = compoundInterestPerPeriod(options);

      expect(result).toMatchObject(
        expect.objectContaining({
          accrualOfPaymentsPerAnnum: false,
          currentBalance: 500,
          currentPositionInYears: 0,
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
    const options: IOptions = {
      type: "debtRepayment",
      principal: 250_000,
      rate: 7.8,
      years: 1,
      paymentsPerAnnum: 12,
      debtRepayment: {
        interestRate: 6,
        type: "interestOnly"
      }
    };

    describe("interestOnly", () => {
      it("should calculate compound interest with a borrowed principal over a single year with interest only payments towards the principal", () => {
        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            accrualOfPaymentsPerAnnum: false,
            currentPositionInYears: 0,
            currentBalance: 250_000,
            endBalance: 269_500,
            paymentsPerAnnum: 12,
            totalPayments: 12,
            multiplierPerPeriod: 1.0065,
            multiplierTotal: 1.078,
            rate: 0.078,
            totalInvestment: 15_000,
            principal: 250_000,
            investmentType: "debtRepayment",
            interestMatrix: new Map([
              ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]]
            ]),
            interestPerAnnum: [19500],
            totalInterest: 19500,
            remainingDebt: 250_000,
            totalEquity: 19_500,
            interestPayments: {
              monthly: 1250,
              period: 1250,
              yearly: 15000
            }
          })
        );
      });

      it("should calculate compound interest with a borrowed principal over multiple years with interest only payments towards the principal", () => {
        options.years = 2;

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            accrualOfPaymentsPerAnnum: false,
            currentPositionInYears: 0,
            currentBalance: 250_000,
            endBalance: 290_521.00000000006,
            paymentsPerAnnum: 12,
            totalPayments: 24,
            multiplierPerPeriod: 1.0065,
            multiplierTotal: 1.1620840000000001,
            rate: 0.078,
            totalInvestment: 30_000,
            principal: 250_000,
            investmentType: "debtRepayment",
            interestMatrix: new Map([
              ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]],
              [
                "2",
                [271251.75, 273003.5, 274755.25, 276507, 278258.75, 280010.5, 281762.25, 283514, 285265.75, 287017.5]
              ]
            ]),
            interestPerAnnum: [19500, 21021],
            totalInterest: 40521,
            remainingDebt: 250000,
            totalEquity: 40521.00000000006,
            interestPayments: {
              yearly: 15000,
              monthly: 1250,
              period: 1250
            }
          })
        );
      });

      it("should calculate the correct totalInvestment, netInvestment and remainingDebt", () => {
        const result = compoundInterestPerPeriod({
          type: "debtRepayment",
          principal: 150_000,
          rate: 4,
          years: 5,
          paymentsPerAnnum: 12,
          debtRepayment: {
            interestRate: 6,
            type: "interestOnly"
          }
        });

        expect(result).toMatchObject(
          expect.objectContaining({
            endBalance: 182_497.93536000003,
            remainingDebt: 150_000,
            totalInvestment: 45_000,
            totalEquity: 32_497.935360000032,
            netInvestment: -12_502.064639999968
          })
        );
      });
    });

    describe("repayment", () => {
      const options: IOptions = {
        type: "debtRepayment",
        principal: 240_000,
        rate: 4,
        years: 30,
        paymentsPerAnnum: 12,
        debtRepayment: {
          interestRate: 6,
          type: "repayment"
        }
      };
      it("should calculate compound interest with a borrowed principal over a single year with repayments towards the principal", () => {
        options.years = 1;

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            investmentType: "debtRepayment",
            endBalance: 249600,
            totalDebtPaid: 7871.317556397233,
            totalEquity: 249600,
            totalInterest: 9600,
            totalInvestment: 247871.31755639723,
            currentBalance: 240000,
            remainingDebt: 0,
            monthlyRepaymentAmount: 20655.943129699768
          })
        );
      });

      it("should calculate compound interest with a borrowed principal over multiple years with repayments towards the principal", () => {
        options.years = 30;

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            investmentType: "debtRepayment",
            endBalance: 778415.40240661,
            totalDebtPaid: 278011.65373198205,
            totalEquity: 778415.40240661,
            totalInterest: 538415.3744000001,
            totalInvestment: 518011.65373198205,
            currentBalance: 240000,
            remainingDebt: 0,
            monthlyRepaymentAmount: 1438.9212603666167,
            netInvestment: 260403.74867462792
          })
        );
      });
      it("should calculate a borrowed principal over multiple years with repayments towards the principal with no compound interest", () => {
        const options: IOptions = {
          type: "debtRepayment",
          principal: 240_000,
          rate: 0,
          years: 30,
          paymentsPerAnnum: 12,
          debtRepayment: {
            interestRate: 6,
            type: "repayment"
          }
        };

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            investmentType: "debtRepayment",
            endBalance: 240000,
            totalDebtPaid: 278011.65373198205,
            totalEquity: 240000,
            totalInterest: 0,
            totalInvestment: 518011.65373198205,
            currentBalance: 240000,
            remainingDebt: 0,
            monthlyRepaymentAmount: 1438.9212603666167,
            netInvestment: -278011.65373198205
          })
        );
      });
    });
  });

  describe("contribution", () => {
    describe('when "accrualOfPaymentsPerAnnum" is false', () => {
      it("should calculate an invested principal with monthly contributions over a single year", () => {
        const options: IOptions = {
          type: "contribution",
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
            currentPositionInYears: 0,
            paymentsPerAnnum: 12,
            totalPayments: 12,
            principal: 250_000,
            rate: 0.078,
            totalInvestment: 262_000,
            currentBalance: 250_000,
            totalInterest: 19_500,
            endBalance: 281_500,
            investmentType: "contribution",
            interestMatrix: new Map([
              ["1", [251625, 253250, 254875, 256500, 258125, 259750, 261375, 263000, 264625, 266250, 267875, 269500]]
            ]),
            interestPerAnnum: [19500]
          })
        );
      });

      it("should calculate an invested principal with monthly contributions over multiple years", () => {
        const options: IOptions = {
          type: "contribution",
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
            currentPositionInYears: 0,
            paymentsPerAnnum: 12,
            totalPayments: 24,
            principal: 250_000,
            multiplierPerPeriod: 1.0065,
            multiplierTotal: 1.1620840000000001,
            rate: 0.078,
            totalInvestment: 274_000,
            currentBalance: 250_000,
            endBalance: 314_521.00000000006,
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

      it("should not increment the interest on a contribution but still add the contribution to the endBalance", () => {
        const options: IOptions = {
          type: "contribution",
          principal: 250_000,
          rate: 1,
          years: 1,
          paymentsPerAnnum: 1,
          amountPerAnnum: 1_000
        };

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            accrualOfPaymentsPerAnnum: false,
            totalPayments: 1,
            principal: 250_000,
            totalInvestment: 251_000,
            currentBalance: 250_000,
            totalInterest: 2_500,
            endBalance: 253_500
          })
        );
      });
    });

    describe('when "accrualOfPaymentsPerAnnum" is true', () => {
      it("should increment the interest on the contribution", () => {
        const options: IOptions = {
          type: "contribution",
          principal: 250_000,
          rate: 7.8,
          years: 1,
          paymentsPerAnnum: 12,
          amountPerAnnum: 12_000,
          accrualOfPaymentsPerAnnum: true
        };

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            accrualOfPaymentsPerAnnum: true,
            currentPositionInYears: 0,
            paymentsPerAnnum: 12,
            years: 1,
            totalPayments: 12,
            principal: 250_000,
            multiplierPerPeriod: 1.0065,
            multiplierTotal: 1.078,
            rate: 0.078,
            totalInvestment: 262_000,
            currentBalance: 250_000,
            endBalance: 282_731.73,
            totalInterest: 20_731.73476567011,
            investmentType: "contribution",
            ratePerPeriod: 0.0065,
            interestMatrix: new Map([
              [
                "1",
                [
                  252631.5, 255280.1, 257945.93, 260629.07, 263329.66, 266047.81, 268783.62, 271537.21, 274308.7,
                  277098.21, 279905.85, 282731.73
                ]
              ]
            ]),
            interestPerAnnum: [20731.73476567011]
          })
        );
      });

      it("should increment the interest on the contribution over 1 year with a single payment", () => {
        const options: IOptions = {
          type: "contribution",
          principal: 250_000,
          rate: 1,
          years: 1,
          paymentsPerAnnum: 1,
          amountPerAnnum: 1_000,
          accrualOfPaymentsPerAnnum: true
        };

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            paymentsPerAnnum: 1,
            years: 1,
            totalPayments: 1,
            principal: 250_000,
            totalInvestment: 251_000,
            currentBalance: 250_000,
            endBalance: 253_510,
            totalInterest: 2_510,
            interestMatrix: new Map([["1", [253_510]]]),
            interestPerAnnum: [2_510]
          })
        );
      });
    });

    describe("paymentsPerAnnum", () => {
      it("when paymentsPerAnnum is 1 it returns a single balance for each year", () => {
        const options: IOptions = {
          type: "contribution",
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

      it("when there are more than one paymentsPerAnnum it returns a monthly breakdown of balance for each year", () => {
        const options: IOptions = {
          type: "contribution",
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

    describe("when currentPositionInYears is supplied", () => {
      it("should return the correct currentBalance for the end of the first of year of the investment", () => {
        const options: IOptions = {
          type: "contribution",
          principal: 250_000,
          rate: 7.8,
          years: 25,
          paymentsPerAnnum: 12,
          amountPerAnnum: 12_000,
          currentPositionInYears: 1
        };

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            currentBalance: 269_500,
            totalInterest: 1_384_590.74754,
            endBalance: 1_934_590.7235901707,
            totalInvestment: 550_000,
            totalPayments: 300,
            accrualOfPaymentsPerAnnum: false,
            investmentType: "contribution"
          })
        );
      });

      it("should return the correct currentBalance for end of the 5th year of investment", () => {
        const options: IOptions = {
          type: "contribution",
          principal: 250_000,
          rate: 7.8,
          years: 25,
          paymentsPerAnnum: 12,
          amountPerAnnum: 12_000,
          currentPositionInYears: 5
        };

        const result = compoundInterestPerPeriod(options);

        expect(result).toMatchObject(
          expect.objectContaining({
            currentBalance: 363_943.38,
            totalInterest: 1_384_590.74754,
            endBalance: 1_934_590.7235901707,
            totalInvestment: 550_000,
            totalPayments: 300,
            accrualOfPaymentsPerAnnum: false,
            investmentType: "contribution"
          })
        );
      });
    });
  });
});
