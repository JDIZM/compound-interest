import { describe, expect, it } from "vitest";
import { mortgageCalculator } from "./mortgageCalculator";

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
});
