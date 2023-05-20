"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcInvestmentWithInterest = exports.compoundInterest = void 0;
const compoundInterest = (principal, rate, time) => {
    console.log("calculating compound interest..");
    console.log("principal: ", principal);
    console.log("rate: ", rate);
    console.log("time: ", time);
    const multiplier = Math.pow(1 + rate, time);
    console.log("pow: ", multiplier);
    return principal * multiplier;
};
exports.compoundInterest = compoundInterest;
const calcInvestmentWithInterest = (principal, rate, time, amountPerAnnum) => {
    const balance = (0, exports.compoundInterest)(principal, rate, time);
    const totalInvestment = principal + amountPerAnnum * time;
    return {
        balance,
        totalInvestment,
        totalInterest: balance - totalInvestment
    };
};
exports.calcInvestmentWithInterest = calcInvestmentWithInterest;
//# sourceMappingURL=compoundInterest.js.map