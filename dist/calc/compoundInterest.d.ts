export declare const compoundInterest: (principal: number, rate: number, time: number, paymentFrequency: number) => number;
export declare const calcInvestmentWithInterest: (principal: number, rate: number, time: number, paymentFrequency: number, amountPerAnnum: number) => {
    principal: number;
    balance: number;
    totalPayments: number;
    totalInvestment: number;
    totalInterest: number;
};
