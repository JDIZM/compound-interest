import {
  IOptions,
  CompoundInterestResult,
  InvestmentType,
  DebtRepaymentResult,
  DebtRepayment
} from "../types/calculator";

export const compoundInterestOverYears = (principal: number, rate: number, years: number): number => {
  if (rate >= 1) {
    rate = rate / 100;
  }

  const multiplier = Math.pow(1 + rate, years);

  return principal * multiplier;
};

export const calcInvestmentWithInterest = (
  principal: number,
  rate: number,
  years: number,
  paymentsPerAnnum: number,
  amountPerAnnum: number
) => {
  const finalBalance = compoundInterestOverYears(principal, rate, years);
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

export const calcInvestmentType = (options: IOptions): InvestmentType => {
  if ("debtRepayment" in options && options.debtRepayment) {
    return "debtRepayment";
  }
  if ("amountPerAnnum" in options && options.amountPerAnnum && options.amountPerAnnum > 0) {
    return "contribution";
  }
  if ("mortgage" in options && options.mortgage) {
    return "mortgage";
  }
  return "lumpSum";
};

export const calcTotalPayments = (years: number, paymentsPerAnnum: number, type: InvestmentType) => {
  // TODO set single payment for a no contributions option
  switch (type) {
    case "lumpSum":
      return 1;
    case "mortgage":
      throw new Error("Not implemented");
    case "contribution":
    case "debtRepayment":
    default:
      return years * paymentsPerAnnum;
  }
};

export const calcTotalInvestment = (options: IOptions, investmentType: InvestmentType) => {
  const { principal, years, paymentsPerAnnum = 1 } = options;

  if (investmentType === "contribution" && "amountPerAnnum" in options) {
    const { amountPerAnnum = 0 } = options;
    return principal + amountPerAnnum * years;
  }

  if ("debtRepayment" in options && options.debtRepayment) {
    if (options.debtRepayment.type === "interestOnly") {
      const interestPayments = calcInterestPayments(principal, options.debtRepayment, paymentsPerAnnum);
      return interestPayments.yearly * years;
    }
  }

  return principal;
};

export const calcInterestPayments = (principal: number, debtRepayment: DebtRepayment, paymentsPerAnnum: number) => {
  let rateOfBorrowing = debtRepayment.interestRate;
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

    if (options.debtRepayment && options.debtRepayment.type === "interestOnly") {
      amountPerAnnum = 0;
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
      prevBalance = interestMatrix.get(`${i}`)![paymentsPerAnnum - 1];
    }
    const interestThisYear = prevBalance * rate;
    const interestParts: number[] = [];

    if (!accrualOfPaymentsPerAnnum) interestPerAnnum.push(interestThisYear);

    for (let p = 0; p < paymentsPerAnnum; p++) {
      // TODO dont calculate first month and principal
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

  if (!currentPositionInYears) {
    const newBalance = interestMatrix.get(`${years}`);
    if (!newBalance) throw new Error("Invalid currentBalance");
    currentBalance = newBalance[paymentsPerAnnum - 1];
  }

  if (currentPositionInYears) {
    const newBalance = interestMatrix.get(`${currentPositionInYears}`);
    if (!newBalance) throw new Error("Invalid currentPositionInYears");
    currentBalance = newBalance[paymentsPerAnnum - 1];
  }

  const totalInterest = interestPerAnnum.reduce((a, b) => a + b, 0);

  const endBalance = accrualOfPaymentsPerAnnum
    ? interestMatrix.get(`${years}`)![paymentsPerAnnum - 1]
    : principal * multiplierTotal;

  const result: CompoundInterestResult = {
    principal,
    rate,
    years,
    currentPositionInYears,
    paymentsPerAnnum,
    totalPayments,
    ratePerPeriod,
    multiplierTotal,
    multiplierPerPeriod,
    totalInvestment, // TODO refactor to totalInvestment
    interestMatrix,
    interestPerAnnum,
    currentBalance,
    totalInterest,
    endBalance,
    accrualOfPaymentsPerAnnum,
    investmentType
  };

  if ("debtRepayment" in options) {
    if (options.debtRepayment && options.debtRepayment.type === "interestOnly") {
      const resultWithDebt: DebtRepaymentResult = {
        ...result,
        totalEquity: endBalance - principal,
        remainingDebt: principal,
        interestPayments: calcInterestPayments(principal, options.debtRepayment, paymentsPerAnnum)
      };
      return resultWithDebt;
    }
  }

  return result;
};
