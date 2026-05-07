import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string; // For react-router Link
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  to,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ariaLabel
}) => {
  const baseStyles = 'font-black rounded-[32px] shadow-xl focus:outline-none transition-all duration-1000 ease-in-out transform hover:-translate-y-1 disabled:opacity-30 disabled:cursor-not-allowed tracking-[0.6em] uppercase text-[11px]';

  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-white text-black hover:bg-brand-primary shadow-brand-primary/10 hover:shadow-brand-primary/40';
      break;
    case 'secondary':
      variantStyles = 'bg-brand-surface text-white hover:bg-white/5 border border-white/10';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/40';
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-6 py-3';
      break;
    case 'md':
      sizeStyles = 'px-10 py-4';
      break;
    case 'lg':
      sizeStyles = 'px-14 py-6';
      break;
  }

  const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClassName} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  );
};