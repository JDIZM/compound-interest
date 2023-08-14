export type InvestmentType = "lumpSum" | "contribution" | "debtRepayment" | "mortgage";

export type MortgageOptions = {
  deposit: number;
  monthlyRepayment: number;
  interestRate: number;
  years: number;
  debtRepayment?: boolean;
};

// export type InvestmentOptions = {
//   principal: number;
// };

export interface InterestOptions {
  principal: number;
  rate: number;
  years: number;
  paymentsPerAnnum?: number;
  amountPerAnnum?: number;
  accrualOfPaymentsPerAnnum?: boolean;
  currentPositionInYears?: number;
  debtRepayment?: boolean;
  mortgage?: MortgageOptions; // TODO mortgage options
}
