import { calcInvestmentWithInterest } from "compound-interest";

const investmentPie = calcInvestmentWithInterest(500, 8, 30, 12, 6_000);
console.log(investmentPie);
