'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WORLD_STEPS, EMPTY_WORLD_FORM, type WorldFormData } from '@/types/world';
import { validateWorldForm, hasValidationErrors, serializeGenreTone } from '@/lib/world-utils';
import { WizardProgress } from './WizardProgress';
import { WizardStep } from './WizardStep';

interface StepWizardProps {
  oasisBioId: string;
}

export function StepWizard({ oasisBioId }: StepWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WorldFormData>({ ...EMPTY_WORLD_FORM });
  const [errors, setErrors] = useState<Partial<Record<keyof WorldFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const stepConfig = WORLD_STEPS[currentStep - 1];
  const isLastStep = currentStep === WORLD_STEPS.length;
  const isFirstStep = currentStep === 1;

  const handleChange = (key: keyof WorldFormData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const handleNext = () => {
    // Only validate on step 1
    if (currentStep === 1) {
      const validationErrors = validateWorldForm(data);
      if (hasValidationErrors(validationErrors)) {
        setErrors(validationErrors);
        return;
      }
    }
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, WORLD_STEPS.length));
  };

  const handleBack = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(s - 1, 1));
  };

  const handleSkip = () => {
    setErrors({});
    setCurrentStep((s) => Math.min(s + 1, WORLD_STEPS.length));
  };

  const handleCancel = () => {
    router.push(`/dashboard/oasisbios/${oasisBioId}/worlds`);
  };

  const handleSubmit = async () => {
    // Final validation
    const validationErrors = validateWorldForm(data);
    if (hasValidationErrors(validationErrors)) {
      setErrors(validationErrors);
      setCurrentStep(1); // Go back to step 1 where required fields are
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    const payload = {
      ...data,
      // Serialize genre + tone
      aestheticKeywords: serializeGenreTone(data.genre, data.tone),
    };

    try {
      const res = await fetch(`/api/oasisbios/${oasisBioId}/worlds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message ?? 'Failed to create world');
      }

      const world = await res.json();
      router.push(`/dashboard/oasisbios/${oasisBioId}/worlds/${world.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handleCancel}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
            <span className="text-sm font-medium text-gray-900">New World</span>
            <div className="w-16" /> {/* spacer */}
          </div>
          <WizardProgress currentStep={currentStep} />
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-2xl">
          <WizardStep
            config={stepConfig}
            data={data}
            errors={errors}
            onChange={handleChange}
          />

          {/* Submit error */}
          {submitError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {submitError}
            </div>
          )}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          {/* Back */}
          <button
            onClick={handleBack}
            disabled={isFirstStep}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            ← Back
          </button>

          {/* Skip + Next/Create */}
          <div className="flex items-center gap-3">
            {!isFirstStep && !isLastStep && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Skip for now
              </button>
            )}

            {isLastStep ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? 'Creating…' : 'Create World'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
