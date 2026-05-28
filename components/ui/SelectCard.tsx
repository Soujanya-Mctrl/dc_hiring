import React, { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface SelectCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
  type?: 'checkbox' | 'radio';
}

export function SelectCard({ 
  title, 
  description, 
  icon, 
  selected, 
  onClick, 
  type = 'checkbox' 
}: SelectCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`
        relative p-4 rounded-xl border cursor-pointer transition-all duration-200
        flex items-start gap-4 group
        ${selected 
          ? 'bg-[#00C652]/5 border-[#00C652]' 
          : 'bg-transparent border-[#262626] hover:border-[#00C652]/50 hover:bg-[#1A1A1A]'
        }
      `}
    >
      {/* Icon Container */}
      {icon && (
        <div className={`
          p-3 rounded-lg flex-shrink-0 transition-colors
          ${selected ? 'bg-[#00C652] text-white' : 'bg-[#1A1A1A] text-[#737373] group-hover:text-white'}
        `}>
          {icon}
        </div>
      )}

      {/* Text Content */}
      <div className="flex-1 min-w-0 pr-8">
        <h4 className="font-bold text-white text-base mb-1">{title}</h4>
        <p className="text-[#737373] text-sm leading-snug">{description}</p>
      </div>

      {/* Selection Indicator */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        {type === 'checkbox' ? (
          <div className={`
            w-5 h-5 rounded flex items-center justify-center border transition-colors
            ${selected ? 'bg-[#00C652] border-[#00C652] text-white' : 'border-[#737373] group-hover:border-[#00C652]/50 bg-transparent'}
          `}>
            {selected && <Check size={14} strokeWidth={3} />}
          </div>
        ) : (
          <div className={`
            w-5 h-5 rounded-full border flex items-center justify-center transition-colors
            ${selected ? 'border-[#00C652]' : 'border-[#737373] group-hover:border-[#00C652]/50'}
          `}>
            {selected && <div className="w-2.5 h-2.5 bg-[#00C652] rounded-full" />}
          </div>
        )}
      </div>
    </div>
  );
}
