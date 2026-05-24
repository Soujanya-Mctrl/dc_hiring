import React, { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export function Button({ 
  children, 
  variant = 'primary', 
  icon, 
  iconPosition = 'right',
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200";
  
  const variants = {
    primary: "bg-[#00C652] hover:bg-[#00993B] text-white px-6 py-3 rounded-full shadow-lg shadow-[#00C652]/20",
    ghost: "bg-transparent hover:bg-[#1A1A1A] text-white px-4 py-2 rounded-full border border-transparent hover:border-[#262626]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
}
