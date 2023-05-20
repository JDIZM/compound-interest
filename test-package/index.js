// import { compoundInterest } from "compound-interest/dist/calc/compoundInterest.js";
import { compoundInterest, calcInvestmentWithInterest } from "compound-interest";

// const test = compoundInterest(100, 0.1, 1, 1);
// console.log(test);

// const test2 = calcInvestmentWithInterest(250_000, 7.8, 29, 1, 6_000);
// console.log(test2);

const investmentPie = calcInvestmentWithInterest(500, 8, 30, 12, 6_000);
console.log(investmentPie);
