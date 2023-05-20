export const compoundInterestOverYears = (principal: number, rate: number, years: number): number => {
  console.log("calculating compound interest..");
  console.log("principal: ", principal);
  console.log("rate: ", rate);
  console.log("years: ", years);

  if (rate >= 1) {
    rate = rate / 100;
    console.log("updated rate: ", rate);
  }

  const multiplier = Math.pow(1 + rate, years);
  console.log("pow: ", multiplier);

  return principal * multiplier;
};

export const calcInvestmentWithInterest = (
  principal: number,
  rate: number,
  time: number,
  paymentFrequency: number,
  amountPerAnnum: number
) => {
  const balance = compoundInterestOverYears(principal, rate, time);
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
  const multiplierPerAnnum = Math.pow(1 + rate, years);
  const multiplierPerPeriod = Math.pow(1 + ratePerPeriod, totalPayments / years);

  const totalInvestment = principal + amountPerAnnum * years;

  const paymentsMatrix = [];
  for (let i = 0; i < years; i++) {
    const payments = [];
    for (let j = 0; j < paymentsPerAnnum; j++) {
      payments.push(principal * Math.pow(1 + ratePerPeriod, j));
    }
    paymentsMatrix.push(payments);
  }

  return {
    principal,
    rate,
    years,
    paymentsPerAnnum,
    totalPayments,
    ratePerPeriod,
    multiplierPerAnnum,
    multiplierPerPeriod,
    totalInvestment,
    // paymentsMatrix,
    endBalance: principal * multiplierPerAnnum
  };
};
