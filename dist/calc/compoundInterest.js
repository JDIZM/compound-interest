"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compoundInterestPerPeriod = exports.calcTotalPayments = exports.calcInvestmentWithInterest = exports.compoundInterestOverYears = void 0;
const compoundInterestOverYears = (principal, rate, years) => {
    if (rate >= 1) {
        rate = rate / 100;
    }
    const multiplier = Math.pow(1 + rate, years);
    return principal * multiplier;
};
exports.compoundInterestOverYears = compoundInterestOverYears;
const calcInvestmentWithInterest = (principal, rate, years, paymentsPerAnnum, amountPerAnnum) => {
    const finalBalance = (0, exports.compoundInterestOverYears)(principal, rate, years);
    const totalInvestment = principal + amountPerAnnum * years;
    const totalPayments = years * paymentsPerAnnum;
    return {
        principal,
        finalBalance,
        totalPayments,
        totalInvestment,
        totalInterest: finalBalance - totalInvestment
    };
};
exports.calcInvestmentWithInterest = calcInvestmentWithInterest;
const calcTotalPayments = (years, paymentsPerAnnum, type) => {
    switch (type) {
        case "lumpSum":
            return 1;
        case "contribution":
        case "debtRepayment":
        default:
            return years * paymentsPerAnnum;
    }
};
exports.calcTotalPayments = calcTotalPayments;
const compoundInterestPerPeriod = (options) => {
    let { rate } = options;
    const { principal, years, paymentsPerAnnum = 1, amountPerAnnum = 0, accrualOfPaymentsPerAnnum = false, currentPositionInYears, debtRepayment = false } = options;
    if (rate >= 1) {
        rate = rate / 100;
    }
    let investmentType = "lumpSum";
    if (!accrualOfPaymentsPerAnnum) {
        if (amountPerAnnum > 0) {
            investmentType = "contribution";
        }
        if (debtRepayment) {
            investmentType = "debtRepayment";
        }
    }
    const totalPayments = (0, exports.calcTotalPayments)(years, paymentsPerAnnum, investmentType);
    const ratePerPeriod = rate / paymentsPerAnnum;
    const multiplierTotal = Math.pow(1 + rate, years);
    const multiplierPerPeriod = 1 + ratePerPeriod;
    let totalInvestment = accrualOfPaymentsPerAnnum ? principal + amountPerAnnum * years : principal + amountPerAnnum;
    if (investmentType === "contribution") {
        totalInvestment = principal + amountPerAnnum * years;
    }
    if (debtRepayment && !accrualOfPaymentsPerAnnum) {
        totalInvestment = amountPerAnnum * years;
    }
    const interestPerAnnum = [];
    const interestMatrix = new Map();
    let prevBalance = principal;
    let currentBalance = principal;
    for (let i = 0; i < years; i++) {
        const monthlyBalance = [];
        if (i > 0) {
            prevBalance = interestMatrix.get(`${i}`)[paymentsPerAnnum - 1];
        }
        const interestThisYear = prevBalance * rate;
        const interestParts = [];
        if (!accrualOfPaymentsPerAnnum)
            interestPerAnnum.push(interestThisYear);
        for (let p = 0; p < paymentsPerAnnum; p++) {
            if (accrualOfPaymentsPerAnnum) {
                const newBalanceWithAccrual = prevBalance + amountPerAnnum / paymentsPerAnnum;
                const interest = newBalanceWithAccrual * ratePerPeriod;
                prevBalance = prevBalance + interest + amountPerAnnum / paymentsPerAnnum;
                interestParts.push(interest);
            }
            else {
                const interest = interestThisYear / paymentsPerAnnum;
                prevBalance = prevBalance + interest;
            }
            monthlyBalance.push(Number(prevBalance.toFixed(2)));
        }
        if (accrualOfPaymentsPerAnnum) {
            const totalInterestForYear = interestParts.reduce((a, b) => a + b, 0);
            interestPerAnnum.push(totalInterestForYear);
        }
        interestMatrix.set(`${i + 1}`, monthlyBalance);
    }
    if (currentPositionInYears) {
        currentBalance = interestMatrix.get(`${currentPositionInYears}`)[paymentsPerAnnum - 1];
    }
    else {
        currentBalance = interestMatrix.get(`${years}`)[paymentsPerAnnum - 1];
    }
    const totalInterest = interestPerAnnum.reduce((a, b) => a + b, 0);
    const endBalance = accrualOfPaymentsPerAnnum
        ? interestMatrix.get(`${years}`)[paymentsPerAnnum - 1]
        : principal * multiplierTotal;
    return {
        principal,
        rate,
        years,
        currentPositionInYears,
        paymentsPerAnnum,
        totalPayments,
        ratePerPeriod,
        multiplierTotal,
        multiplierPerPeriod,
        totalInvestment,
        interestMatrix,
        interestPerAnnum,
        currentBalance,
        totalInterest,
        endBalance,
        accrualOfPaymentsPerAnnum,
        investmentType
    };
};
exports.compoundInterestPerPeriod = compoundInterestPerPeriod;
//# sourceMappingURL=compoundInterest.js.map