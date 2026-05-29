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
        relative p-5 rounded-none border cursor-pointer transition-all duration-300
        flex items-start gap-4 group overflow-hidden
        ${selected 
          ? 'bg-accent/5 border-accent shadow-[0_0_15px_rgba(16,185,129,0.05)]' 
          : 'bg-transparent border-border hover:border-accent/40 hover:bg-input'
        }
      `}
    >
      {/* Bracket Corners (Cyberpunk Motif) */}
      <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/10 transition-all duration-300 group-hover:border-accent group-hover:w-4 group-hover:h-4" />

      {/* Icon Container */}
      {icon && (
        <div className={`
          p-3 rounded-lg flex-shrink-0 transition-colors
          ${selected ? 'bg-accent text-white' : 'bg-input text-text-muted group-hover:text-white'}
        `}>
          {icon}
        </div>
      )}

      {/* Text Content */}
      <div className="flex-1 min-w-0 pr-8">
        <h4 className="font-bold text-white text-base mb-1">{title}</h4>
        <p className="text-text-secondary text-sm leading-snug">{description}</p>
      </div>

      {/* Selection Indicator */}
      <div className="absolute top-5 right-5 flex items-center justify-center">
        {type === 'checkbox' ? (
          <div className={`
            w-5 h-5 rounded flex items-center justify-center border transition-colors
            ${selected ? 'bg-accent border-accent text-white' : 'border-text-muted group-hover:border-accent/50 bg-transparent'}
          `}>
            {selected && <Check size={14} strokeWidth={3} />}
          </div>
        ) : (
          <div className={`
            w-5 h-5 rounded-full border flex items-center justify-center transition-colors
            ${selected ? 'border-accent' : 'border-text-muted group-hover:border-accent/50'}
          `}>
            {selected && <div className="w-2.5 h-2.5 bg-accent rounded-full" />}
          </div>
        )}
      </div>
    </div>
  );
}
