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

export interface InterestOptions {
  principal: number;
  rate: number;
  years: number;
  paymentsPerAnnum?: number;
  amountPerAnnum?: number;
  accrualOfPaymentsPerAnnum?: boolean;
  currentPositionInYears?: number;
}

export const compoundInterestPerPeriod = (options: InterestOptions) => {
  let { rate } = options;
  const {
    principal,
    years,
    paymentsPerAnnum = 1,
    amountPerAnnum = 0,
    accrualOfPaymentsPerAnnum = false,
    currentPositionInYears
  } = options;
  // if rate is provided as a percentage, convert to decimal
  if (rate >= 1) {
    rate = rate / 100;
  }

  // 1. calculate compound interest of a lump sum over time
  // 2. calculate compound interest with additional contributions
  // 3. calculate compound interest with a decreasing principal

  const totalPayments = accrualOfPaymentsPerAnnum ? years * paymentsPerAnnum : 1;
  const ratePerPeriod = rate / paymentsPerAnnum;
  const multiplierTotal = Math.pow(1 + rate, years);
  const multiplierPerPeriod = 1 + ratePerPeriod;

  const totalInvestment = accrualOfPaymentsPerAnnum ? principal + amountPerAnnum * years : principal + amountPerAnnum;

  const interestPerAnnum: number[] = [];
  const interestMatrix = new Map<string, number[]>();

  let prevBalance = principal;
  let currentBalance = principal;

  for (let i = 0; i < years; i++) {
    const monthlyBalance: number[] = [];
    if (i > 0) {
      // prevBalance = interestMatrix.get(`${i}`)?.[paymentsPerAnnum - 1] ?? principal;
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
  if (currentPositionInYears) {
    // TODO a better way to check undefined map values
    // currentBalance = interestMatrix.get(`${currentPositionInYears}`)?.[paymentsPerAnnum - 1] ?? principal;
    currentBalance = interestMatrix.get(`${currentPositionInYears}`)![paymentsPerAnnum - 1];
  } else {
    currentBalance = interestMatrix.get(`${years}`)![paymentsPerAnnum - 1];
  }

  const totalInterest = interestPerAnnum.reduce((a, b) => a + b, 0);

  const endBalance = accrualOfPaymentsPerAnnum
    ? interestMatrix.get(`${years}`)![paymentsPerAnnum - 1]
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
    totalInvestment, // TODO refactor to totalInvestment
    interestMatrix,
    interestPerAnnum,
    currentBalance,
    totalInterest,
    endBalance,
    accrualOfPaymentsPerAnnum
  };
};
