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

export const compoundInterestPerPeriod = (
  principal: number,
  rate: number,
  years: number,
  paymentsPerAnnum: number,
  amountPerAnnum: number
) => {
  // if rate is provided as a percentage, convert to decimal
  if (rate >= 1) {
    rate = rate / 100;
  }

  const totalPayments = years * paymentsPerAnnum;
  const ratePerPeriod = rate / paymentsPerAnnum;
  const multiplierTotal = Math.pow(1 + rate, years);
  const multiplierPerPeriod = 1 + ratePerPeriod;

  const totalInvestment = principal + amountPerAnnum * years;
  const interestPerAnnum: number[] = [];

  const interestMatrix = new Map<string, number[]>();
  let prevBalance = principal;
  let currentBalance = principal;
  for (let i = 0; i < years; i++) {
    const payments: number[] = [];
    if (i > 0) {
      prevBalance = interestMatrix.get(`${i}`)![paymentsPerAnnum - 1];
    }
    const interestThisYear = prevBalance * rate;
    currentBalance = prevBalance + interestThisYear;
    interestPerAnnum.push(interestThisYear);

    for (let p = 0; p < paymentsPerAnnum; p++) {
      const interest = interestThisYear / paymentsPerAnnum;
      prevBalance = prevBalance + interest;
      payments.push(Number(prevBalance.toFixed(2)));
    }
    interestMatrix.set(`${i + 1}`, payments);
  }

  return {
    principal,
    rate,
    years,
    paymentsPerAnnum,
    totalPayments,
    ratePerPeriod,
    multiplierTotal,
    multiplierPerPeriod,
    totalInvestment,
    interestMatrix,
    currentBalance,
    endBalance: principal * multiplierTotal
  };
};
