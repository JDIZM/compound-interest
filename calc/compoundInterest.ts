export const compoundInterest = (principal: number, rate: number, time: number): number => {
  console.log("calculating compound interest..");
  console.log("principal: ", principal);
  console.log("rate: ", rate);
  console.log("time: ", time);

  const multiplier = Math.pow(1 + rate, time);
  console.log("pow: ", multiplier);

  return principal * multiplier;
};
