export const compoundInterest = (principal: number, rate: number, time: number): number => {
  console.log("calculating compound interest..");
  console.log("principal: ", principal);
  console.log("rate: ", rate);
  console.log("time: ", time);

  const multiplier = Math.pow(1 + rate, time);
  console.log("pow: ", multiplier);

  return principal * multiplier;
};

export const calcInvestmentWithInterest = (principal: number, rate: number, time: number, amountPerAnnum: number) => {
  const balance = compoundInterest(principal, rate, time);
  const totalInvestment = principal + amountPerAnnum * time;
  return {
    balance,
    totalInvestment,
    totalInterest: balance - totalInvestment
  };
};
