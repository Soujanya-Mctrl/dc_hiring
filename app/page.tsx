"use client";

import React, { useState, useEffect } from 'react';
import { SplitLayout } from '../components/layout/SplitLayout';
import { StepIndicator } from '../components/ui/StepIndicator';
import { Button } from '../components/ui/Button';
import { Step1About } from '../components/steps/Step1About';
import { Step2Interests } from '../components/steps/Step2Interests';
import { Step3Experience } from '../components/steps/Step3Experience';
import { Step4Contribution } from '../components/steps/Step4Contribution';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle form submission
      const submitPromise = fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Add your form state here later
          email: 'test@example.com',
          about: 'Test About',
          interests: ['coding'],
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Submission failed');
        return data;
      });

      toast.promise(submitPromise, {
        loading: 'Submitting application...',
        success: 'Application submitted successfully! Check your email.',
        error: (err) => `Error: ${err.message}`,
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <SplitLayout>
      <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
        {/* Top Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Current Step Content */}
        <div className="flex-1">
          {currentStep === 1 && <Step1About />}
          {currentStep === 2 && <Step2Interests />}
          {currentStep === 3 && <Step3Experience />}
          {currentStep === 4 && <Step4Contribution />}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#262626]">
          {currentStep > 1 ? (
            <Button 
              variant="ghost" 
              onClick={handleBack} 
              icon={<ArrowLeft size={18} />} 
              iconPosition="left"
            >
              Back
            </Button>
          ) : (
            <div></div> // Empty div for spacing if no back button
          )}

          <Button 
            variant="primary" 
            onClick={handleNext} 
            icon={currentStep < totalSteps ? <ArrowRight size={18} /> : undefined}
          >
            {currentStep === totalSteps ? 'Submit Application' : 'Continue'}
          </Button>
        </div>
      </div>
    </SplitLayout>
  );
}
