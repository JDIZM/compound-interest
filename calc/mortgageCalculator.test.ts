import { describe, expect, it } from "vitest";
import { mortgageCalculator } from "./mortgageCalculator";
import type { MortgageType, MortgageResult } from "../types/calculator";

describe("mortgageCalculator", () => {
  it("should calculate an interest only mortgage with the correct payments and principal", () => {
    const result = mortgageCalculator(
      {
        homeValue: 150_000,
        deposit: 15_000,
        interestRate: 6,
        years: 25
      },
      "interestOnly"
    );

    expect(result).toMatchObject({
      homeValue: 150000,
      deposit: 15000,
      interestPayments: {
        yearly: 8100,
        monthly: 675,
        period: 675
      },
      principal: 135000,
      years: 25,
      interestRate: 6
    });
  });

  it("should calculate a repayment mortgage with the correct monthly payment and remaining principal rounded to two decimal places", () => {
    const result = mortgageCalculator(
      {
        homeValue: 150_000,
        deposit: 15_000,
        interestRate: 6,
        years: 25
      },
      "repayment"
    );

    expect(result).toMatchObject({
      deposit: 15000,
      homeValue: 150000,
      interestRate: 6,
      monthlyRepayment: 869.81,
      principal: 135000,
      years: 25
    });
  });

  it("calculates a 0% repayment mortgage as straight-line principal division (no NaN)", () => {
    const result = mortgageCalculator(
      {
        homeValue: 150_000,
        deposit: 15_000,
        interestRate: 0,
        years: 25
      },
      "repayment"
    ) as MortgageResult;

    // 135,000 principal over 300 months with no interest → £450/mo exactly.
    expect(Number.isNaN(result.monthlyRepayment)).toBe(false);
    expect(result.monthlyRepayment).toBe(450);
  });

  describe("input validation", () => {
    const valid = { homeValue: 150_000, deposit: 15_000, interestRate: 6, years: 25 };

    it("throws when years is negative", () => {
      expect(() => mortgageCalculator({ ...valid, years: -1 }, "repayment")).toThrow("Years cannot be negative");
    });

    it("throws when interestRate is negative", () => {
      expect(() => mortgageCalculator({ ...valid, interestRate: -1 }, "repayment")).toThrow(
        "Interest rate cannot be negative"
      );
    });

    it("throws when homeValue is negative", () => {
      expect(() => mortgageCalculator({ ...valid, homeValue: -1 }, "repayment")).toThrow(
        "Home value cannot be negative"
      );
    });

    it("throws when deposit is negative", () => {
      expect(() => mortgageCalculator({ ...valid, deposit: -1 }, "repayment")).toThrow("Deposit cannot be negative");
    });

    it("throws when deposit exceeds homeValue", () => {
      expect(() => mortgageCalculator({ ...valid, deposit: 200_000 }, "repayment")).toThrow(
        "Deposit cannot be greater than home value"
      );
    });

    it("throws when years is 0", () => {
      expect(() => mortgageCalculator({ ...valid, years: 0 }, "repayment")).toThrow("Years cannot be 0");
    });

    it("throws when type is missing, empty, null, or invalid", () => {
      expect(() => mortgageCalculator(valid, "" as MortgageType)).toThrow("Invalid mortgage type");
      expect(() => mortgageCalculator(valid, undefined as unknown as MortgageType)).toThrow("Invalid mortgage type");
      expect(() => mortgageCalculator(valid, null as unknown as MortgageType)).toThrow("Invalid mortgage type");
      expect(() => mortgageCalculator(valid, "banana" as MortgageType)).toThrow("Invalid mortgage type");
    });
  });
});
