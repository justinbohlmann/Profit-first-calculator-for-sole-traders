import type { CalculatorInputs } from './types';

export const GST_THRESHOLD = 75000;

export const DEFAULT_INPUTS: CalculatorInputs = {
  desiredTakeHome: 150000,
  profitPercent: 5,
  ownersPayPercent: 45,
  contractorPay: 15000,
};

export const BREAKDOWN_COLORS = {
  obligation: 'bg-[#CC0000]', // Red for money owed
  earning: 'bg-[#00D373]',    // Green for money kept
  figure: 'bg-[#183D33]',     // Dark Green/Grey for key totals
  opEx: 'bg-[#FF8133]',       // Orange for Operating Expenses
};