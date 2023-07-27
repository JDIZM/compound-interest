export declare const compoundInterestOverYears: (principal: number, rate: number, years: number) => number;
export declare const calcInvestmentWithInterest: (principal: number, rate: number, years: number, paymentsPerAnnum: number, amountPerAnnum: number) => {
    principal: number;
    finalBalance: number;
    totalPayments: number;
    totalInvestment: number;
    totalInterest: number;
};
export type InvestmentType = "lumpSum" | "contribution" | "debtRepayment" | "mortgage";
export type MortgageOptions = {
    deposit: number;
    monthlyRepayment: number;
    interestRate: number;
    years: number;
    debtRepayment?: boolean;
};
export type InvestmentOptions = {
    principal: number;
};
export interface InterestOptions {
    principal: number;
    rate: number;
    years: number;
    paymentsPerAnnum?: number;
    amountPerAnnum?: number;
    accrualOfPaymentsPerAnnum?: boolean;
    currentPositionInYears?: number;
    debtRepayment?: boolean;
    mortgage?: MortgageOptions;
}
export declare const calcTotalPayments: (years: number, paymentsPerAnnum: number, type: InvestmentType) => number;
export declare const compoundInterestPerPeriod: (options: InterestOptions) => {
    principal: number;
    rate: number;
    years: number;
    currentPositionInYears: number | undefined;
    paymentsPerAnnum: number;
    totalPayments: number;
    ratePerPeriod: number;
    multiplierTotal: number;
    multiplierPerPeriod: number;
    totalInvestment: number;
    interestMatrix: Map<string, number[]>;
    interestPerAnnum: number[];
    currentBalance: number;
    totalInterest: number;
    endBalance: number;
    accrualOfPaymentsPerAnnum: boolean;
    investmentType: "lumpSum" | "contribution" | "debtRepayment";
};
export declare const calcMortgage: (options: MortgageOptions) => void;
