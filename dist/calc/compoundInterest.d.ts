export declare const compoundInterest: (principal: number, rate: number, time: number) => number;
export declare const calcInvestmentWithInterest: (principal: number, rate: number, time: number, amountPerAnnum: number) => {
    balance: number;
    totalInvestment: number;
    totalInterest: number;
};
