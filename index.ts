import {
  // compoundInterestOverYears,
  // calcInvestmentWithInterest,
  compoundInterestPerPeriod
} from "./calc/compoundInterest";

// const test = compoundInterestOverYears(100, 0.1, 2);
// console.log("compoundInterestOverYears", test);

// const test2 = calcInvestmentWithInterest(250_000, 7.8, 29, 1, 12_000);
// console.log(test2);

// const cpi2 = compoundInterestPerPeriod(250_000, 7.8, 29, 12, 12_000, false, 1);
// console.log("cpi2", cpi2);

// TODO it should calc money invested over time. only calcs principal + interest.
const investmentPie = compoundInterestPerPeriod(500, 3.4, 1, 12, 6_000, undefined, false);
console.log(investmentPie);

export * from "./calc/compoundInterest";
