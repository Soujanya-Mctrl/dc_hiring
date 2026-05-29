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
    primary: "bg-accent hover:bg-accent-hover text-white px-6 py-3 rounded-full shadow-lg shadow-accent/20",
    ghost: "bg-transparent hover:bg-input text-white px-4 py-2 rounded-full border border-transparent hover:border-border"
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
