import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
}) => {
  const baseClasses = 'glass-dark rounded-[40px] p-10 md:p-14 transition-all duration-1000 ease-in-out border border-white/5 relative overflow-hidden';
  const hoverClasses = hoverEffect ? 'hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] hover:scale-[1.02] hover:border-white/10 hover:bg-white/[0.05]' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); } : undefined}
    >
      {children}
    </div>
  );
};