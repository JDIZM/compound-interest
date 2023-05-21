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

interface IOptions {
  accrualOfPaymentsPerAnnum?: boolean;
}
// TODO accrual of paymentsPerAnnum
export const compoundInterestPerPeriod = (
  principal: number,
  rate: number,
  years: number,
  paymentsPerAnnum: number,
  amountPerAnnum: number,
  currentPositionInYears?: number,
  accrualOfPaymentsPerAnnum = false,
  options?: IOptions // TODO refactor to use options
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
      // prevBalance = interestMatrix.get(`${i}`)?.[paymentsPerAnnum - 1] ?? principal;
      prevBalance = interestMatrix.get(`${i}`)![paymentsPerAnnum - 1];
    }
    const interestThisYear = prevBalance * rate;
    const interestparts: number[] = [];

    if (!accrualOfPaymentsPerAnnum) interestPerAnnum.push(interestThisYear);

    for (let p = 0; p < paymentsPerAnnum; p++) {
      // TODO dont calculate first month and principal
      if (accrualOfPaymentsPerAnnum) {
        const newBalanceWithAccrual = prevBalance + amountPerAnnum / paymentsPerAnnum;
        const interest = newBalanceWithAccrual * ratePerPeriod;
        console.log("interest", interest);
        prevBalance = prevBalance + interest + amountPerAnnum / paymentsPerAnnum;
        interestparts.push(interest);
      } else {
        const interest = interestThisYear / paymentsPerAnnum;
        prevBalance = prevBalance + interest;
      }
      payments.push(Number(prevBalance.toFixed(2)));
    }

    if (accrualOfPaymentsPerAnnum) {
      const totalInterestForYear = interestparts.reduce((a, b) => a + b, 0);
      console.log("totalInterestForYear", totalInterestForYear);
      interestPerAnnum.push(totalInterestForYear);
    }

    interestMatrix.set(`${i + 1}`, payments);
  }
  if (currentPositionInYears) {
    // TODO a better way to check undefined map values
    // currentBalance = interestMatrix.get(`${currentPositionInYears}`)?.[paymentsPerAnnum - 1] ?? principal;
    currentBalance = interestMatrix.get(`${currentPositionInYears}`)![paymentsPerAnnum - 1];
  } else {
    currentBalance = interestMatrix.get(`${years}`)![paymentsPerAnnum - 1];
  }

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
    totalInvestment,
    interestMatrix,
    interestPerAnnum,
    currentBalance,
    endBalance,
    accrualOfPaymentsPerAnnum
  };
};
