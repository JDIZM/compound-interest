export type InvestmentType = "lumpSum" | "contribution" | "debtRepayment";
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
}

export type InterestOnlyMortgageResult = Omit<MortgageResult, "monthlyRepayment"> & {
  interestPayments: {
    yearly: number;
    monthly: number;
    period: number;
  };
};

export type DebtRepayment = {
  interestRate: number;
  type: "interestOnly" | "repayment";
};

export type IOptions = {
  type: InvestmentType;
  principal: number;
  rate: number;
  years: number;
  paymentsPerAnnum?: number;
  currentPositionInYears?: number;
} & (LumpSumOptions | ContributionOptions | DebtRepaymentOptions);

export type LumpSumOptions = {
  type: "lumpSum";
};

export type ContributionOptions = {
  type: "contribution";
  paymentsPerAnnum?: number;
  amountPerAnnum?: number;
  contributionPerAnnumChange?: number;
  accrualOfPaymentsPerAnnum?: boolean;
};

export type DebtRepaymentOptions = {
  type: "debtRepayment";
  paymentsPerAnnum?: number;
  currentPositionInYears?: number;
  debtRepayment: DebtRepayment;
};

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

export type SavingsGoalContributionOptions = {
  target: number;
  years: number;
  annualRate: number;
  startingBalance?: number;
  compoundingPerYear?: number;
};

export type SavingsGoalYearsOptions = {
  target: number;
  contributionPerMonth: number;
  annualRate: number;
  startingBalance?: number;
  compoundingPerYear?: number;
};

export interface SavingsGoalResult {
  target: number;
  years: number;
  annualRate: number;
  startingBalance: number;
  compoundingPerYear: number;
  contributionPerPeriod: number;
  contributionPerMonth: number;
  contributionPerYear: number;
  totalContributions: number;
  interestEarned: number;
  periods: number;
}

export type EarlyPayoffOptions = {
  homeValue: number;
  deposit: number;
  interestRate: number;
  years: number;
  extraMonthly?: number;
  lumpSums?: LumpSumPayment[];
};

export type LumpSumPayment = {
  month: number;
  amount: number;
};

export interface PayoffScheduleEntry {
  month: number;
  interest: number;
  principal: number;
  lumpSum: number;
  balance: number;
}

export interface EarlyPayoffResult {
  principal: number;
  baselineMonths: number;
  baselineTotalInterest: number;
  baseMonthlyPayment: number;
  newMonths: number;
  newTotalInterest: number;
  monthsSaved: number;
  interestSaved: number;
  schedule: PayoffScheduleEntry[];
}

export type FireNumberOptions = {
  annualSpend: number;
  withdrawalRate?: number;
};

export interface FireNumberResult {
  annualSpend: number;
  withdrawalRate: number;
  target: number;
  monthlyIncome: number;
}

export type YearsToFireOptions = {
  currentSavings: number;
  annualContribution: number;
  annualReturn: number;
  target: number;
};
