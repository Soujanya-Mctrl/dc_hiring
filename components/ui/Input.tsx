import React, { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: ReactNode;
  isRequired?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, isRequired, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-bold text-white">
          {label} {isRequired && <span className="text-[#00C652]">*</span>}
        </label>
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-[#1A1A1A] border border-[#262626] rounded-xl px-4 py-3.5 text-white placeholder:text-[#737373] focus:outline-none focus:border-[#00C652] transition-colors ${
              icon ? 'pl-11' : ''
            } ${className}`}
            {...props}
          />
        </div>
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
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, isRequired, minChars, currentChars, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full">
        {label && (
          <label className="text-sm font-bold text-white">
            {label} {isRequired && <span className="text-[#00C652]">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={`w-full bg-[#1A1A1A] border border-[#262626] rounded-xl px-4 py-3.5 text-white placeholder:text-[#737373] focus:outline-none focus:border-[#00C652] transition-colors resize-y min-h-[120px] ${className}`}
            {...props}
          />
          {minChars !== undefined && (
            <div className={`text-right text-xs mt-1 font-semibold ${
              currentChars && currentChars >= minChars ? 'text-[#00C652]' : 'text-[#737373]'
            }`}>
              {currentChars || 0} / {minChars} characters min
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
