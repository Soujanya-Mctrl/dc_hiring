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
  const activeStep = steps.find(step => step.id === currentStep);

  return (
    <div className="w-full mb-12">
      <div className="flex items-center justify-between w-full">
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
                      ? 'bg-accent text-white border-2 border-accent' 
                      : 'bg-transparent text-text-muted border-2 border-border'
                    }
                  `}
                >
                  {isCompleted ? <Check size={16} strokeWidth={3} /> : `0${step.id}`}
                </div>
                <span 
                  className={`text-sm font-semibold hidden sm:block
                    ${(isActive || isCompleted) ? 'text-white' : 'text-text-muted'}
                  `}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 h-px bg-border">
                  <div 
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: step.id < currentStep ? '100%' : '0%' }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="mt-6 pl-1 text-left sm:hidden">
        <p className="text-sm font-medium text-text-secondary">
          Step {currentStep} of {steps.length}: {activeStep?.label}
        </p>
      </div>
    </div>
  );
}
