import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  isRequired?: boolean;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, isRequired, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-bold text-white">
          {label} {isRequired && <span className="text-accent">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-input border rounded-lg px-4 py-3.5 text-white placeholder:text-text-muted focus:outline-none transition-colors ${icon ? 'pl-11' : ''
              } ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent'} ${className}`}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  isRequired?: boolean;
  minChars?: number;
  currentChars?: number;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, isRequired, minChars, currentChars, error, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-bold text-white">
            {label} {isRequired && <span className="text-accent">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={`w-full bg-input border rounded-lg px-4 py-3.5 text-white placeholder:text-text-muted focus:outline-none transition-colors resize-y min-h-[120px] ${error ? 'border-red-500 focus:border-red-500' : 'border-border focus:border-accent'} ${className}`}
            {...props}
          />
          {minChars !== undefined && (
            <div className={`text-right text-xs mt-1 font-semibold ${currentChars && currentChars >= minChars ? 'text-accent' : 'text-text-muted'
              }`}>
              {currentChars || 0} / {minChars} characters min
            </div>
          )}
          {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
