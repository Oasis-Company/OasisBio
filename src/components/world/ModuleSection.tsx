'use client';

import React, { useState } from 'react';
import type { WorldFormData, FieldConfig } from '@/types/world';

interface ModuleSectionProps {
  title: string;
  fields: FieldConfig[];
  data: Partial<WorldFormData>;
  filledCount: number;
  totalCount: number;
  onSave: (updates: Partial<WorldFormData>) => Promise<void>;
}

export function ModuleSection({
  title,
  fields,
  data,
  filledCount,
  totalCount,
  onSave,
}: ModuleSectionProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<WorldFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleEdit = () => {
    // Seed edit form with current values
    const seed: Partial<WorldFormData> = {};
    fields.forEach((f) => { (seed as Record<string, unknown>)[f.key] = data[f.key] ?? ''; });
    setEditData(seed);
    setIsEditing(true);
    setSaveError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSaveError('');
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      await onSave(editData);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const completionLabel = `${filledCount}/${totalCount} fields`;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      {/* Module header */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-900">{title}</span>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {completionLabel}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleEdit(); setIsOpen(true); }}
              className="text-xs text-gray-500 hover:text-black px-2 py-1 rounded hover:bg-gray-100 transition-colors"
            >
              Edit
            </button>
          )}
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-5 pb-5 bg-white border-t border-gray-50">
          {isEditing ? (
            <div className="pt-4 space-y-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={(editData[field.key] as string) ?? ''}
                      onChange={(e) => setEditData((d) => ({ ...d, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">{field.placeholder}</option>
                      {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={(editData[field.key] as string) ?? ''}
                      onChange={(e) => setEditData((d) => ({ ...d, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
                    />
                  ) : (
                    <input
                      type="text"
                      value={(editData[field.key] as string) ?? ''}
                      onChange={(e) => setEditData((d) => ({ ...d, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  )}
                </div>
              ))}

              {saveError && (
                <p className="text-sm text-red-500">{saveError}</p>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                  {isSaving ? 'Saving…' : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 space-y-3">
              {fields.map((field) => {
                const val = data[field.key] as string | undefined;
                return (
                  <div key={field.key}>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">
                      {field.label}
                    </p>
                    {val ? (
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{val}</p>
                    ) : (
                      <p className="text-sm text-gray-300 italic">Not set</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
