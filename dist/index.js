"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compoundInterest_1 = require("./calc/compoundInterest");
const intitial = () => {
    const principal = 250000;
    const rate = 0.078;
    const time = 29;
    const result = (0, compoundInterest_1.compoundInterest)(principal, rate, time);
    console.log(result);
};
intitial();
const withInterest = () => {
    const principal = 250000;
    const rate = 0.078;
    const time = 29;
    const amountPerAnnum = 6000;
    const result = (0, compoundInterest_1.calcInvestmentWithInterest)(principal, rate, time, amountPerAnnum);
    console.log(result);
};
withInterest();
//# sourceMappingURL=index.js.map