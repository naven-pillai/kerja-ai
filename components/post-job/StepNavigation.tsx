'use client';

import { Check } from 'lucide-react';

type Props = {
  currentStep: number;
  goToStep?: (step: number) => void;
};

const steps = [
  { number: 1, label: 'Company' },
  { number: 2, label: 'Job' },
  { number: 3, label: 'Description' },
  { number: 4, label: 'Review' },
];

export default function StepNavigation({ currentStep, goToStep }: Props) {
  return (
    <div className="mb-10 px-2 sm:px-0">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isClickable = isCompleted && !!goToStep;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step circle + label */}
              <div className="flex flex-col items-center flex-shrink-0">
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && goToStep(step.number)}
                  className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1D4ED8] text-white shadow-md shadow-[#1D4ED8]/30'
                      : isCompleted
                      ? 'bg-[#1D4ED8] text-white cursor-pointer hover:opacity-80'
                      : 'bg-gray-100 text-gray-400 cursor-default'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.number}
                </button>
                <span
                  className={`mt-1.5 text-[11px] sm:text-xs font-medium whitespace-nowrap ${
                    isActive
                      ? 'text-[#1D4ED8]'
                      : isCompleted
                      ? 'text-[#1D4ED8]/80'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line (not after last step) */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 sm:mx-3 mb-5 rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-[#1D4ED8]' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
