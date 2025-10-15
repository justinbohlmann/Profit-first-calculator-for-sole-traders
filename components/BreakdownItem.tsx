import React from 'react';

interface BreakdownItemProps {
  label: string;
  value: number;
  percent?: number;
  color: string;
  isEmphasized?: boolean;
  isGst?: boolean;
}

export const BreakdownItem: React.FC<BreakdownItemProps> = ({ label, value, percent, color, isEmphasized = false, isGst = false }) => {
  const formattedValue = `$${Math.round(value).toLocaleString('en-AU')}`;

  return (
    <div className={`flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0 text-[#111111] ${isEmphasized ? 'font-bold' : ''}`}>
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${color}`}></span>
        <p>{label}</p>
      </div>
      <div className="flex items-center">
        <span className="w-24 text-right">{formattedValue}</span>
        <span className="w-16 pl-2 text-left text-sm">
          {percent !== undefined && `(${isGst ? '10%' : `${percent}%`})`}
        </span>
      </div>
    </div>
  );
};