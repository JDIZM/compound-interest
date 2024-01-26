export type InvestmentType = "lumpSum" | "contribution" | "debtRepayment" | "mortgage";
export type MortgageType = "interestOnly" | "repayment";
export type MortgageOptions = {
  homeValue: number;
  deposit: number;
  interestRate: number;
  years: number;
};

export interface MortgageResult {
  homeValue: number;
  deposit: number;
  monthlyRepayment: number;
  interestRate: number;
  years: number;
  principal: number;
  threePercentHigherMonthlyRepayment: number;
}

export type InterestOnlyMortgageResult = Omit<MortgageResult, "monthlyRepayment"> & {
  interestPayments: {
    yearly: number;
    monthly: number;
    period: number;
  };
};

// TODO additional debt repayment types
export type DebtRepayment = {
  interestRate: number;
  type: "interestOnly" | "repayment";
};

export interface LumpSumOptions {
  principal: number;
  rate: number;
  years: number;
  paymentsPerAnnum?: number;
  currentPositionInYears?: number;
}

export interface ContributionOptions extends LumpSumOptions {
  paymentsPerAnnum?: number;
  amountPerAnnum?: number;
  accrualOfPaymentsPerAnnum?: boolean;
}

export interface DebtRepaymentOptions extends LumpSumOptions {
  currentPositionInYears?: number;
  debtRepayment: DebtRepayment;
}

export type IOptions = LumpSumOptions | ContributionOptions | DebtRepaymentOptions;

export interface InterestResult {
  principal: number;
  rate: number;
  years: number;
  // The amount of interest to compound per period
  ratePerPeriod: number;
  // Payments
  accrualOfPaymentsPerAnnum: boolean;
  currentPositionInYears: undefined | number;
  paymentsPerAnnum: number;
  totalPayments: number;
  // Compound interest multipliers
  multiplierPerPeriod: number;
  multiplierTotal: number;
  // Investment
  currentBalance: number; // current balance of the investment at the current position in years
  endBalance: number; // this is the total value of the investment at the end of the period
  totalInvestment: number; // the total amount invested
  investmentType: InvestmentType;
  // Compound interest accrued not the total interest paid
  interestMatrix: Map<string, number[]>;
  interestPerAnnum: number[];
  totalInterest: number;
}

export interface DebtRepaymentResult extends InterestResult {
  remainingDebt: number;
  totalEquity: number;
  interestPayments?: {
    yearly: number;
    monthly: number;
    period: number;
  };
  totalDebtPaid?: number;
  monthlyRepaymentAmount?: number;
  netInvestment?: number;
}

export type CompoundInterestResult = InterestResult | DebtRepaymentResult;
