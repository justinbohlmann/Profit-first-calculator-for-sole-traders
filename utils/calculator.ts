
import type { CalculatorInputs, CalculatedResults } from '../types';
import { GST_THRESHOLD } from '../constants';

function calculateTax(taxableIncome: number): number {
  if (taxableIncome <= 18200) {
    return 0;
  }
  if (taxableIncome <= 45000) {
    return (taxableIncome - 18200) * 0.16;
  }
  if (taxableIncome <= 135000) {
    return 4288 + (taxableIncome - 45000) * 0.3;
  }
  if (taxableIncome <= 190000) {
    return 31288 + (taxableIncome - 135000) * 0.37;
  }
  return 51638 + (taxableIncome - 190000) * 0.45;
}

export const calculateAll = (inputs: CalculatorInputs): CalculatedResults => {
  const { desiredTakeHome, profitPercent, ownersPayPercent, contractorPay } = inputs;

  // STEP 1: Calculate Real Revenue
  // Handle division by zero edge case
  const realRevenue = ownersPayPercent > 0 ? desiredTakeHome / (ownersPayPercent / 100) : 0;

  // STEP 2: Calculate Allocations from Real Revenue
  const profitAmount = realRevenue * (profitPercent / 100);
  const ownersPayAmount = realRevenue * (ownersPayPercent / 100);
  
  // STEP 3: Calculate Tax
  const taxableIncome = profitAmount + ownersPayAmount;
  const taxAmount = calculateTax(taxableIncome);
  const taxPercent = realRevenue > 0 ? (taxAmount / realRevenue) * 100 : 0;
  
  // STEP 4: Calculate Operating Expenses
  const opExpensesPercent = 100 - profitPercent - ownersPayPercent - taxPercent;
  const opExpensesAmount = realRevenue * (opExpensesPercent / 100);

  // STEP 5: Calculate Gross Revenue and GST
  const preGstAmount = realRevenue + contractorPay;
  const isGstRegistered = preGstAmount >= GST_THRESHOLD;
  const gstAmount = isGstRegistered ? preGstAmount * 0.10 : 0;
  const annualGrossRevenue = preGstAmount + gstAmount;
  
  // STEP 6: Calculate Monthly Revenue
  const monthlyGrossRevenue = annualGrossRevenue / 12;

  // Calculate display percentages, ensuring they sum to 100
  const displayProfitPercent = Math.ceil(profitPercent);
  const displayOwnersPayPercent = Math.ceil(ownersPayPercent);
  const displayTaxPercent = Math.ceil(taxPercent);
  const displayOpExpensesPercent = 100 - displayProfitPercent - displayOwnersPayPercent - displayTaxPercent;

  return {
    monthlyGrossRevenue: Math.round(monthlyGrossRevenue),
    annualGrossRevenue: Math.round(annualGrossRevenue),
    isGstRegistered,
    gstAmount: Math.round(gstAmount),
    contractorPay: Math.round(contractorPay),
    realRevenue: Math.round(realRevenue),
    profitAmount: Math.round(profitAmount),
    profitPercent,
    ownersPayAmount: Math.round(ownersPayAmount),
    ownersPayPercent,
    opExpensesAmount: Math.round(opExpensesAmount),
    opExpensesPercent,
    displayOpExpensesPercent,
    taxAmount: Math.round(taxAmount),
    taxPercent,
    displayTaxPercent,
    taxableIncome: Math.round(taxableIncome),
    takeHome: Math.round(desiredTakeHome),
  };
};
