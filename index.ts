import { compoundInterest } from "./calc/compoundInterest";

const intitial = () => {
  const principal = 250_000;
  const rate = 0.078;
  const time = 29;

  const result = compoundInterest(principal, rate, time);
  console.log(result);
};

intitial();
