import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

const steps: Step[] = [
  { id: 1, label: 'About' },
  { id: 2, label: 'Interests' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Contribution' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full mb-12">
      {steps.map((step, index) => {
        const isCompleted = step.id < currentStep;
        const isActive = step.id === currentStep;
        
        return (
          <React.Fragment key={step.id}>
            {/* Step Item */}
            <div className="flex items-center gap-3">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${(isActive || isCompleted) 
                    ? 'bg-[#00C652] text-white border-2 border-[#00C652]' 
                    : 'bg-transparent text-[#737373] border-2 border-[#262626]'
                  }
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : `0${step.id}`}
              </div>
              <span 
                className={`text-sm font-semibold hidden sm:block
                  ${(isActive || isCompleted) ? 'text-white' : 'text-[#737373]'}
                `}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line (except for last item) */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-px bg-[#262626]">
                <div 
                  className="h-full bg-[#00C652] transition-all duration-300"
                  style={{ width: step.id < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
