import { IOptions, CompoundInterestResult, InvestmentType, DebtRepaymentResult } from "../types/calculator";

export const compoundInterestOverYears = (principal: number, rate: number, years: number): number => {
  if (rate >= 1) {
    rate = rate / 100;
  }

  const multiplier = Math.pow(1 + rate, years);

  return principal * multiplier;
};

export const calcInvestmentType = (options: IOptions): InvestmentType => {
  if ("debtRepayment" in options && options.debtRepayment) {
    return "debtRepayment";
  }
  if ("amountPerAnnum" in options && options.amountPerAnnum && options.amountPerAnnum > 0) {
    return "contribution";
  }
  return "lumpSum";
};

export const calcTotalPayments = (years: number, paymentsPerAnnum: number, type: InvestmentType) => {
  switch (type) {
    case "lumpSum":
      return 1;
    case "contribution":
    case "debtRepayment":
    default:
      return years * paymentsPerAnnum;
  }
};

/**
 * The PMT function calculates the periodic payment
 * for an annuity investment based on constant-amount periodic payments
 * and a constant interest rate.
 */
export const PMT = (mir: number, nper: number, pv: number, fv = 0, type: 0 | 1) => {
  // mir - monthly interest rate in decimal form
  // nper - number of periods (months)
  // pv   - present value
  // fv   - future value
  // type - when the payments are due:
  //    0: end of the period, e.g. end of month (default)
  //    1: beginning of period
  return (mir * (pv * Math.pow(1 + mir, nper) + fv)) / ((1 + mir * type) * (Math.pow(1 + mir, nper) - 1));
};

export const calcTotalInvestment = (options: IOptions, investmentType: InvestmentType) => {
  const { principal, years, paymentsPerAnnum = 1 } = options;

  if (investmentType === "contribution" && "amountPerAnnum" in options) {
    const { amountPerAnnum = 0 } = options;
    return principal + amountPerAnnum * years;
  }

  if ("debtRepayment" in options) {
    if (options.debtRepayment.type === "interestOnly") {
      const interestPayments = calcInterestPayments(principal, options.debtRepayment.interestRate, paymentsPerAnnum);
      return interestPayments.yearly * years;
    }

    if (options.debtRepayment.type === "repayment") {
      return PMT(options.debtRepayment.interestRate / 100 / 12, years * 12, principal, 0, 0) * 12 * years;
    }
  }

  return principal;
};

export const calcInterestPayments = (principal: number, interestRate: number, paymentsPerAnnum: number) => {
  let rateOfBorrowing = interestRate;
  // if rate is provided as a percentage, convert to decimal
  if (rateOfBorrowing >= 1) {
    rateOfBorrowing = rateOfBorrowing / 100;
  }
  return {
    yearly: principal * rateOfBorrowing,
    monthly: (principal * rateOfBorrowing) / 12,
    period: (principal * rateOfBorrowing) / paymentsPerAnnum
  };
};

export const compoundInterestPerPeriod = (options: IOptions): CompoundInterestResult => {
  let { rate } = options;
  const { principal, years, paymentsPerAnnum = 1, currentPositionInYears } = options;

  let amountPerAnnum = 0;
  let accrualOfPaymentsPerAnnum = false;

  if ("amountPerAnnum" in options && options.amountPerAnnum && options.amountPerAnnum > 0) {
    amountPerAnnum = options.amountPerAnnum;
  }

  if ("accrualOfPaymentsPerAnnum" in options && options.accrualOfPaymentsPerAnnum) {
    accrualOfPaymentsPerAnnum = options.accrualOfPaymentsPerAnnum;
  }

  // if rate is provided as a percentage, convert to decimal
  if (rate >= 1) {
    rate = rate / 100;
  }

  if ("debtRepayment" in options) {
    if (options.debtRepayment && accrualOfPaymentsPerAnnum) {
      throw new Error("Invalid option combination: debtRepayment and accrualOfPaymentsPerAnnum");
    }
  }

  const investmentType = calcInvestmentType(options);
  const totalPayments = calcTotalPayments(years, paymentsPerAnnum, investmentType);

  const ratePerPeriod = rate / paymentsPerAnnum;
  const multiplierTotal = Math.pow(1 + rate, years);
  const multiplierPerPeriod = 1 + ratePerPeriod;

  const totalInvestment = calcTotalInvestment(options, investmentType);

  const interestPerAnnum: number[] = [];
  const interestMatrix = new Map<string, number[]>();

  let prevBalance = principal;
  let currentBalance = principal;

  for (let i = 0; i < years; i++) {
    const monthlyBalance: number[] = [];

    if (i > 0) {
      const currentMonthsInterest = interestMatrix.get(`${i}`);
      if (!currentMonthsInterest) throw new Error("Invalid interestMatrix");
      prevBalance = currentMonthsInterest[paymentsPerAnnum - 1];
    }

    const interestThisYear = prevBalance * rate;
    const interestParts: number[] = [];

    if (!accrualOfPaymentsPerAnnum) interestPerAnnum.push(interestThisYear);

    for (let p = 0; p < paymentsPerAnnum; p++) {
      if (accrualOfPaymentsPerAnnum) {
        const newBalanceWithAccrual = prevBalance + amountPerAnnum / paymentsPerAnnum;
        const interest = newBalanceWithAccrual * ratePerPeriod;
        prevBalance = prevBalance + interest + amountPerAnnum / paymentsPerAnnum;
        interestParts.push(interest);
      } else {
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
    const newBalance = interestMatrix.get(`${currentPositionInYears}`);
    if (!newBalance) throw new Error("Invalid currentPositionInYears");
    currentBalance = newBalance[paymentsPerAnnum - 1];
  }

  const totalInterest = interestPerAnnum.reduce((a, b) => a + b, 0);

  function getEndBalance() {
    if (accrualOfPaymentsPerAnnum) {
      const balance = interestMatrix.get(`${years}`);
      if (!balance) throw new Error("Invalid endBalance");
      return balance[paymentsPerAnnum - 1];
    } else {
      return principal * multiplierTotal;
    }
  }

  const endBalance = getEndBalance();

  const result: CompoundInterestResult = {
    principal,
    rate,
    years,
    currentPositionInYears: currentPositionInYears || 0,
    paymentsPerAnnum,
    totalPayments,
    ratePerPeriod,
    multiplierTotal,
    multiplierPerPeriod,
    totalInvestment,
    currentBalance,
    endBalance,
    accrualOfPaymentsPerAnnum,
    // this is the interest accrued not the total interest paid
    interestMatrix,
    interestPerAnnum,
    totalInterest,
    investmentType
  };

  if ("debtRepayment" in options) {
    if (options.debtRepayment.type === "interestOnly") {
      const resultWithDebt: DebtRepaymentResult = {
        ...result,
        totalEquity: endBalance - principal,
        remainingDebt: principal,
        interestPayments: calcInterestPayments(principal, options.debtRepayment.interestRate, paymentsPerAnnum)
      };
      return resultWithDebt;
    }

    if (options.debtRepayment.type === "repayment") {
      const resultWithDebt: DebtRepaymentResult = {
        ...result,
        totalEquity: endBalance,
        remainingDebt: 0,
        totalDebtPaid: totalInvestment - principal,
        monthlyRepaymentAmount: PMT(options.debtRepayment.interestRate / 100 / 12, totalPayments, principal, 0, 0),
        netInvestment: endBalance - totalInvestment
      };
      return resultWithDebt;
    }
  }

  return result;
};
