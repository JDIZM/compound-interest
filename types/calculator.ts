export type InvestmentType = "lumpSum" | "contribution" | "debtRepayment" | "mortgage";

export type Mortgage = {
  deposit: number;
  monthlyRepayment: number;
  interestRate: number;
  years: number;
  debtRepayment?: boolean;
};

// TODO additional debt repayment types
export type DebtRepayment = {
  interestRate: number;
  type: "interestOnly";
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
  debtRepayment?: DebtRepayment;
}

export type IOptions = LumpSumOptions | ContributionOptions | DebtRepaymentOptions;

export interface InterestResult {
  principal: number;
  rate: number;
  years: number;
  ratePerPeriod: number;
  accrualOfPaymentsPerAnnum: boolean;
  currentPositionInYears: undefined | number;
  currentBalance: number;
  endBalance: number;
  paymentsPerAnnum: number;
  totalPayments: number;
  multiplierPerPeriod: number;
  multiplierTotal: number;
  totalInvestment: number;
  investmentType: InvestmentType;
  interestMatrix: Map<string, number[]>;
  interestPerAnnum: number[];
  totalInterest: number;
}

export interface DebtRepaymentResult extends InterestResult {
  remainingDebt: number;
  totalEquity: number;
  interestPayments: {
    yearly: number;
    monthly: number;
    period: number;
  };
}

export type CompoundInterestResult = InterestResult | DebtRepaymentResult;
