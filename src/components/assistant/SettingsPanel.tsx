'use client';

import React, { useState } from 'react';
import { Save, Loader2 } from 'lucide-react';

interface ProfileConfig {
  systemPrompt: string;
  apiEndpoint: string | null;
  apiKey: string | null;
  model: string;
  enabled: boolean;
  configured: boolean;
}

interface SettingsPanelProps {
  deoProfile: ProfileConfig;
  diaProfile: ProfileConfig;
  onUpdate: (agent: 'deo' | 'dia', data: Partial<ProfileConfig>) => Promise<void>;
}

export function SettingsPanel({ deoProfile, diaProfile, onUpdate }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'deo' | 'dia'>('deo');
  const [deoForm, setDeoForm] = useState(deoProfile);
  const [diaForm, setDiaForm] = useState(diaProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentForm = activeTab === 'deo' ? deoForm : diaForm;
  const setCurrentForm = activeTab === 'deo' ? setDeoForm : setDiaForm;

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await onUpdate(activeTab, currentForm);
      setMessage({ type: 'success', text: '设置已保存' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-bold mb-4">AI 助手设置</h2>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('deo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'deo'
              ? 'bg-green-100 text-green-700 border-2 border-green-500'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <img src="/assets/deo/deo.png" alt="Deo" className="w-6 h-6 rounded-full" />
          Deo - 技术向导
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('dia')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            activeTab === 'dia'
              ? 'bg-pink-100 text-pink-700 border-2 border-pink-500'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <img src="/assets/deo/dia.png" alt="Dia" className="w-6 h-6 rounded-full" />
          Dia - 创意伙伴
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">API Endpoint</label>
          <input
            type="text"
            value={currentForm.apiEndpoint || ''}
            onChange={(e) => setCurrentForm({ ...currentForm, apiEndpoint: e.target.value || null })}
            placeholder="https://api.openai.com/v1/chat/completions"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">API Key</label>
          <input
            type="password"
            value={currentForm.apiKey || ''}
            onChange={(e) => setCurrentForm({ ...currentForm, apiKey: e.target.value || null })}
            placeholder={currentForm.configured ? '已设置 (输入新值以更改)' : 'sk-...'}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Model</label>
          <input
            type="text"
            value={currentForm.model}
            onChange={(e) => setCurrentForm({ ...currentForm, model: e.target.value })}
            placeholder="gpt-4o"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">System Prompt</label>
          <textarea
            value={currentForm.systemPrompt}
            onChange={(e) => setCurrentForm({ ...currentForm, systemPrompt: e.target.value })}
            rows={6}
            className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id={`${activeTab}-enabled`}
            checked={currentForm.enabled}
            onChange={(e) => setCurrentForm({ ...currentForm, enabled: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor={`${activeTab}-enabled`}>启用此助手</label>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          保存设置
        </button>
      </div>
    </div>
  );
}
