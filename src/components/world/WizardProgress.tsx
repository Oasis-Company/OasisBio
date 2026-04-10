'use client';

import React from 'react';
import { WORLD_STEPS } from '@/types/world';

interface WizardProgressProps {
  currentStep: number; // 1-based
}

export function WizardProgress({ currentStep }: WizardProgressProps) {
  return (
    <div className="w-full">
      {/* Step label */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          Step {currentStep} of {WORLD_STEPS.length}
        </span>
        <span className="text-xs text-gray-400">
          {WORLD_STEPS[currentStep - 1]?.title}
        </span>
      </div>

      {/* Segmented progress bar */}
      <div className="flex gap-1">
        {WORLD_STEPS.map((step) => (
          <div
            key={step.step}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              step.step <= currentStep ? 'bg-black' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
