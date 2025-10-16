import React, { useState, useEffect, useMemo } from 'react';
import type { CalculatorInputs, CalculatedResults } from './types';
import { DEFAULT_INPUTS, BREAKDOWN_COLORS } from './constants';
import { calculateAll } from './utils/calculator';
import { SliderInput } from './components/SliderInput';
import { DisplayCard } from './components/DisplayCard';
import { BreakdownItem } from './components/BreakdownItem';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CalculatorInputs>(DEFAULT_INPUTS);
  const [results, setResults] = useState<CalculatedResults | null>(null);
  const [revenueView, setRevenueView] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const newResults = calculateAll(inputs);
    setResults(newResults);
  }, [inputs]);

  const handleInputChange = (field: keyof CalculatorInputs) => (value: number) => {
    setInputs((prev) => {
      // Start with the user's intended value.
      let finalInputs = { ...prev, [field]: value };

      // Iteratively adjust the changed input to ensure Operating Expenses do not go below zero.
      // This handles the complex interaction where changing an allocation also changes the tax.
      for (let i = 0; i < 5; i++) {
        // Loop a few times to converge to a stable value.
        const tempResults = calculateAll(finalInputs);
        if (tempResults.opExpensesPercent < 0) {
          // The allocation is over by the negative amount of opExpenses.
          const overflow = -tempResults.opExpensesPercent;
          // Reduce the input the user is currently changing by the overflow amount.
          finalInputs[field] -= overflow;
        } else {
          // The value is valid, no more correction needed.
          break;
        }
      }

      // Ensure the corrected value does not fall below its minimum limit.
      if (field === 'ownersPayPercent') {
        finalInputs[field] = Math.max(1, finalInputs[field]);
      } else if (field === 'profitPercent') {
        finalInputs[field] = Math.max(0, finalInputs[field]);
      }

      return finalInputs;
    });
  };

  const handleReset = () => {
    setInputs(DEFAULT_INPUTS);
  };

  const memoizedResults = useMemo(() => results, [results]);

  if (!memoizedResults) {
    return <div>Loading...</div>; // Should only flash briefly
  }

  const {
    monthlyGrossRevenue,
    annualGrossRevenue,
    isGstRegistered,
    gstAmount,
    realRevenue,
    profitAmount,
    ownersPayAmount,
    opExpensesAmount,
    taxAmount,
    taxableIncome,
    displayTaxPercent,
    displayOpExpensesPercent,
  } = memoizedResults;

  const displayProfitPercent = Math.ceil(inputs.profitPercent);
  const displayOwnersPayPercent = Math.ceil(inputs.ownersPayPercent);

  const breakdownDivisor = revenueView === 'annual' ? 1 : 12;
  const capitalizedRevenueView = revenueView.charAt(0).toUpperCase() + revenueView.slice(1);

  return (
    <div className='min-h-screen bg-[#F8F9FA] text-[#111111] p-4 md:p-8'>
      <div className='max-w-4xl mx-auto'>
        <header className='text-center mb-8'>
          <h1 className='text-[28px] font-bold text-[#111111]'>Profit first calculator for sole traders</h1>
          <p className='text-base text-[#111111] mt-2'>Plan your revenue to meet your financial goals.</p>
        </header>

        <main className='grid grid-cols-1 md:grid-cols-2 gap-8 items-start'>
          {/* Left Column: Inputs */}
          <div className='flex flex-col gap-6'>
            <DisplayCard>
              <h2 className='text-[22px] font-bold text-[#111111] mb-4'>Your income goal</h2>
              <SliderInput
                id='takeHome'
                label='Target take-home pay (annual)'
                note='After tax and expenses'
                min={0}
                max={500000}
                step={1000}
                value={inputs.desiredTakeHome}
                onChange={handleInputChange('desiredTakeHome')}
                format='currency'
              />
            </DisplayCard>

            <DisplayCard>
              <h2 className='text-[22px] font-bold text-[#111111] mb-4'>Additional costs</h2>
              <SliderInput
                id='contractorPay'
                label='Contractor pay (annual)'
                note='Added before GST calculation'
                min={0}
                max={200000}
                step={1000}
                value={inputs.contractorPay}
                onChange={handleInputChange('contractorPay')}
                format='currency'
              />
            </DisplayCard>

            <DisplayCard>
              <h2 className='text-[22px] font-bold text-[#111111] mb-1'>Target Allocation Percentages (TAPs)</h2>
              <p className='text-sm text-[#111111] mb-4'>How do you want to allocate your 'real revenue'?</p>

              <div className='space-y-4'>
                <SliderInput
                  id='profit'
                  label='Profit %'
                  min={0}
                  max={100}
                  step={1}
                  value={inputs.profitPercent}
                  onChange={handleInputChange('profitPercent')}
                  format='percent'
                />
                <SliderInput
                  id='ownersPay'
                  label="Owner's pay %"
                  min={1}
                  max={100}
                  step={1}
                  value={inputs.ownersPayPercent}
                  onChange={handleInputChange('ownersPayPercent')}
                  format='percent'
                />

                {/* Read-only displays */}
                <div className='bg-[#F4BC42]/20 p-3 rounded-lg'>
                  <div className='flex justify-between items-center text-base'>
                    <p className='font-normal text-[#111111]'>Tax %</p>
                    <span className='font-bold text-lg text-[#111111]'>{displayTaxPercent}%</span>
                  </div>
                  <p className='text-xs text-[#111111] mt-1'>Calculated based on tax brackets</p>
                </div>
                <div className='bg-[#F4BC42]/20 p-3 rounded-lg'>
                  <div className='flex justify-between items-center text-base'>
                    <p className='font-normal text-[#111111]'>Operating expenses %</p>
                    <span className='font-bold text-lg text-[#111111]'>{displayOpExpensesPercent}%</span>
                  </div>
                  <p className='text-xs text-[#111111] mt-1'>Calculated as remainder</p>
                </div>
              </div>
              <p className='mt-4 bg-[#00D373]/20 text-[#111111] font-bold text-center py-2 rounded-lg text-base'>
                ✓ Total allocations: 100%
              </p>
            </DisplayCard>
          </div>

          {/* Right Column: Outputs */}
          <div className='flex flex-col gap-6 sticky top-8'>
            <DisplayCard className='text-center'>
              <div className='flex justify-center mb-4'>
                <div className='flex p-1 bg-gray-200 rounded-lg'>
                  <button
                    onClick={() => setRevenueView('monthly')}
                    className={`px-4 py-1 text-sm font-bold rounded-md transition-colors ${
                      revenueView === 'monthly' ? 'bg-white shadow' : 'text-gray-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setRevenueView('annual')}
                    className={`px-4 py-1 text-sm font-bold rounded-md transition-colors ${
                      revenueView === 'annual' ? 'bg-white shadow' : 'text-gray-500'
                    }`}
                  >
                    Annual
                  </button>
                </div>
              </div>
              <h2 className='text-[22px] font-bold text-[#111111]'>{capitalizedRevenueView} gross revenue target</h2>
              <p className='text-[28px] font-bold text-[#111111] mt-2'>
                ${(revenueView === 'monthly' ? monthlyGrossRevenue : annualGrossRevenue).toLocaleString('en-AU')}
              </p>
              <p className='text-base text-[#111111] mt-1'>
                {revenueView === 'monthly'
                  ? `Annual: $${annualGrossRevenue.toLocaleString('en-AU')}`
                  : `Monthly: $${monthlyGrossRevenue.toLocaleString('en-AU')}`}
              </p>
              {isGstRegistered ? (
                <span className='mt-4 inline-block bg-[#00D373]/80 text-white text-xs font-bold px-3 py-1 rounded-full'>
                  GST registered
                </span>
              ) : (
                <span className='mt-4 inline-block bg-[#F4BC42] text-white text-xs font-bold px-3 py-1 rounded-full'>
                  No GST registration required
                </span>
              )}
            </DisplayCard>

            <DisplayCard>
              <h2 className='text-[22px] font-bold text-[#111111] mb-2'>{capitalizedRevenueView} breakdown</h2>
              <div>
                <BreakdownItem
                  label='Gross revenue'
                  value={annualGrossRevenue / breakdownDivisor}
                  color={BREAKDOWN_COLORS.figure}
                  isEmphasized={true}
                />
                {isGstRegistered && (
                  <BreakdownItem
                    label='GST'
                    value={gstAmount / breakdownDivisor}
                    color={BREAKDOWN_COLORS.obligation}
                    isGst={true}
                  />
                )}
                {inputs.contractorPay > 0 && (
                  <BreakdownItem
                    label='Contractor pay'
                    value={inputs.contractorPay / breakdownDivisor}
                    color={BREAKDOWN_COLORS.obligation}
                  />
                )}
                <BreakdownItem
                  label='Real revenue'
                  value={realRevenue / breakdownDivisor}
                  color={BREAKDOWN_COLORS.figure}
                  isEmphasized={true}
                />
                {/* FIX: The value prop for BreakdownItem expects a number, but was passed a string. Removed the quotes to fix the type error. */}
                <BreakdownItem
                  label='Profit'
                  value={profitAmount / breakdownDivisor}
                  percent={displayProfitPercent}
                  color={BREAKDOWN_COLORS.earning}
                />
                <BreakdownItem
                  label="Owner's pay"
                  value={ownersPayAmount / breakdownDivisor}
                  percent={displayOwnersPayPercent}
                  color={BREAKDOWN_COLORS.earning}
                />
                {/* FIX: Corrected a typo from `taxableAmount` to `taxableIncome` to match the destructured variable from the `memoizedResults`. */}
                <BreakdownItem
                  label='Taxable income'
                  value={taxableIncome / breakdownDivisor}
                  color={BREAKDOWN_COLORS.figure}
                />
                <BreakdownItem
                  label='Tax'
                  value={taxAmount / breakdownDivisor}
                  percent={displayTaxPercent}
                  color={BREAKDOWN_COLORS.obligation}
                />
                <BreakdownItem
                  label='Operating expenses'
                  value={opExpensesAmount / breakdownDivisor}
                  percent={displayOpExpensesPercent}
                  color={BREAKDOWN_COLORS.opEx}
                />
              </div>
            </DisplayCard>

            <button
              onClick={handleReset}
              className='w-full bg-[#00D373] text-white font-bold py-3 px-4 rounded-lg hover:bg-opacity-90 transition-transform active:scale-95 transform text-base'
            >
              Reset to defaults
            </button>
          </div>
        </main>

        <div className='mt-8'>
          <DisplayCard>
            <h2 className='text-[22px] font-bold text-[#111111] mb-4'>How it works</h2>
            <div className='space-y-4 text-base text-[#111111]'>
              <p>
                This calculator starts with your desired annual take-home pay and works backward to determine the gross
                revenue you need to generate.
              </p>
              <p>
                <strong className='font-bold'>Real revenue</strong> is the core of the calculation. It's the money left
                after paying any contractors and mandatory GST. This is the amount that you can actually allocate.
              </p>
              <p>
                The <strong className='font-bold'>Revenue allocations</strong> section shows how your real revenue is
                divided. You can set the percentage for 'Profit' and 'Owner's pay'.
              </p>
              <p>
                The calculator automatically determines your <strong className='font-bold'>Tax</strong> based on
                Australian tax brackets and allocates the remainder to{' '}
                <strong className='font-bold'>Operating expenses</strong>. If you increase one allocation, others will
                adjust to ensure the total is always 100%.
              </p>
              <p>
                <strong className='font-bold'>GST</strong> is automatically added if your gross revenue (before GST)
                exceeds the $75,000 threshold, ensuring your target is accurate.
              </p>
            </div>
          </DisplayCard>
        </div>
      </div>
    </div>
  );
};

export default App;
