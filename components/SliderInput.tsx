import React from 'react';

interface SliderInputProps {
  id: string;
  label: string;
  note?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  format: 'currency' | 'percent';
}

export const SliderInput: React.FC<SliderInputProps> = ({
  id,
  label,
  note,
  min,
  max,
  step,
  value,
  onChange,
  format,
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value.replace(/[^0-9.]/g, ''));
    if (isNaN(newValue)) newValue = min;
    if (newValue > max) newValue = max;
    if (newValue < min) newValue = min;
    onChange(newValue);
  };

  const displayValue =
    format === 'currency'
      ? value.toLocaleString('en-AU', {
          style: 'currency',
          currency: 'AUD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : `${Math.round(value)}`;

  return (
    <div className='w-full'>
      <div className='flex justify-between items-center mb-1'>
        <label htmlFor={id} className='text-base font-normal text-[#111111]'>
          {label}
        </label>
        {note && <p className='text-xs text-[#111111]'>{note}</p>}
      </div>
      <div className='flex items-center gap-4'>
        <input
          type='range'
          id={`${id}-slider`}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className='w-full accent-[#00D373]'
        />
        <div className='relative w-40'>
          {format === 'currency' && <span className='absolute left-3 top-1/2 -translate-y-1/2 text-[#111111]'>$</span>}
          <input
            type='text'
            id={`${id}-input`}
            value={displayValue.replace(/\$/g, '')}
            onChange={handleInputChange}
            className={`w-full rounded-md border-gray-300 shadow-sm focus:border-[#00D373] focus:ring focus:ring-[#00D373] focus:ring-opacity-50 text-right font-bold text-lg text-[#111111] ${format === 'currency' ? 'pl-7 pr-3' : 'pl-3 pr-7'}`}
          />
          {format === 'percent' && <span className='absolute right-3 top-1/2 -translate-y-1/2 text-[#111111]'>%</span>}
        </div>
      </div>
    </div>
  );
};
