"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcInvestmentWithInterest = exports.compoundInterest = void 0;
const compoundInterest = (principal, rate, time, paymentFrequency) => {
    console.log("calculating compound interest..");
    console.log("principal: ", principal);
    console.log("rate: ", rate);
    console.log("time: ", time);
    console.log("paymentFrequency: ", paymentFrequency);
    if (rate >= 1) {
        rate = rate / 100;
    }
    console.log("rate: ", rate);
    const totalPayments = time * paymentFrequency;
    console.log("totalPayments: ", totalPayments);
    const ratePerPeriod = rate / paymentFrequency;
    console.log("ratePerPeriod: ", ratePerPeriod);
    const multiplier = Math.pow(1 + ratePerPeriod, time * paymentFrequency);
    console.log("pow: ", multiplier);
    return principal * multiplier;
};
exports.compoundInterest = compoundInterest;
const calcInvestmentWithInterest = (principal, rate, time, paymentFrequency, amountPerAnnum) => {
    const balance = (0, exports.compoundInterest)(principal, rate, time, paymentFrequency);
    const totalInvestment = principal + amountPerAnnum * time;
    const totalPayments = time * paymentFrequency;
    return {
        principal,
        balance,
        totalPayments,
        totalInvestment,
        totalInterest: balance - totalInvestment
    };
};
exports.calcInvestmentWithInterest = calcInvestmentWithInterest;
//# sourceMappingURL=compoundInterest.js.map