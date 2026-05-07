'use client';

import React from 'react';
import type { WorldStepConfig, WorldFormData, FieldConfig } from '@/types/world';
import { FieldHint } from '@/components/Tooltip';

interface WizardStepProps {
  config: WorldStepConfig;
  data: WorldFormData;
  errors: Partial<Record<keyof WorldFormData, string>>;
  onChange: (key: keyof WorldFormData, value: string) => void;
}

export function WizardStep({ config, data, errors, onChange }: WizardStepProps) {
  return (
    <div className="space-y-6">
      {/* Module header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-1">{config.title}</h2>
        <p className="text-gray-500 text-sm">{config.description}</p>
      </div>

      {/* Fields */}
      <div className="space-y-5">
        {config.fields.map((field) => (
          <FieldInput
            key={field.key}
            field={field}
            value={data[field.key] as string}
            error={errors[field.key]}
            onChange={(val) => onChange(field.key, val)}
          />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Individual field renderer
// ─────────────────────────────────────────────

interface FieldInputProps {
  field: FieldConfig;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}

function FieldInput({ field, value, error, onChange }: FieldInputProps) {
  const baseInputClass = `w-full px-3 py-2 border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${
    error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
  }`;

  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Hint — interactive tooltip */}
      <FieldHint hint={field.hint} mode="tooltip" variant="info" side="top" />

      {/* Input */}
      {field.type === 'select' ? (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={baseInputClass}
        >
          <option value="">{field.placeholder}</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : field.type === 'textarea' ? (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          rows={4}
          className={`${baseInputClass} resize-none`}
        />
      ) : (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={baseInputClass}
        />
      )}

      {/* Error */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

      {/* Examples */}
      {field.examples.length > 0 && (
        <div className="mt-2">
          <p className="text-xs text-gray-400 mb-1">Examples:</p>
          <div className="flex flex-wrap gap-1">
            {field.examples.slice(0, 2).map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onChange(ex)}
                className="text-xs px-2 py-1 bg-gray-50 border border-gray-200 rounded text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors text-left max-w-xs truncate"
                title={ex}
              >
                {ex.length > 50 ? ex.slice(0, 50) + '…' : ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
