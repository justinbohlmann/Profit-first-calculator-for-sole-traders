
import React from 'react';

interface DisplayCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DisplayCard: React.FC<DisplayCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-6 ${className}`}>
      {children}
    </div>
  );
};
