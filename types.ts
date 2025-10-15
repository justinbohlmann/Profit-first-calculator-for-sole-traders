
export interface CalculatorInputs {
  desiredTakeHome: number;
  profitPercent: number;
  ownersPayPercent: number;
  contractorPay: number;
}

export interface CalculatedResults {
  monthlyGrossRevenue: number;
  annualGrossRevenue: number;
  isGstRegistered: boolean;
  gstAmount: number;
  contractorPay: number;
  realRevenue: number;
  profitAmount: number;
  profitPercent: number;
  ownersPayAmount: number;
  ownersPayPercent: number;
  opExpensesAmount: number;
  opExpensesPercent: number;
  displayOpExpensesPercent: number;
  taxAmount: number;
  taxPercent: number;
  displayTaxPercent: number;
  taxableIncome: number;
  takeHome: number;
}
