'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';
import { CopyButton } from '@/components/CopyButton';

interface OAuthApp {
  id: string;
  name: string;
  description?: string;
  homepageUrl: string;
  logoUrl?: string;
  redirectUris: string[];
  clientId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appId = params.id as string;

  const [app, setApp] = useState<OAuthApp | null>(null);
  const [loading, setLoading] = useState(true);
  const { success: toastSuccess, error: toastError } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [newSecret, setNewSecret] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    homepageUrl: '',
    redirectUris: '',
    logoUrl: '',
  });

  useEffect(() => {
    fetch(`/api/developer/apps/${appId}`)
      .then((r) => r.json())
      .then((data) => {
        setApp(data);
        setForm({
          name: data.name,
          description: data.description ?? '',
          homepageUrl: data.homepageUrl,
          redirectUris: data.redirectUris.join('\n'),
          logoUrl: data.logoUrl ?? '',
        });
        setLoading(false);
      })
      .catch(() => { setError('Failed to load app'); setLoading(false); });
  }, [appId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    const redirectUris = form.redirectUris.split('\n').map((u) => u.trim()).filter(Boolean);

    const res = await fetch(`/api/developer/apps/${appId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, redirectUris }),
    });

    const data = await res.json();
    setIsSaving(false);

    if (!res.ok) { setError(data.error?.message ?? 'Failed to save'); return; }
    setApp(data);
    toastSuccess('Saved successfully');
    setIsSaving(false);
  };

  const handleRotateSecret = async () => {
    if (!confirm('Rotate client secret? All existing tokens will be revoked.')) return;
    setIsRotating(true);
    const res = await fetch(`/api/developer/apps/${appId}/secret`, { method: 'POST' });
    const data = await res.json();
    setIsRotating(false);
    if (res.ok) setNewSecret(data.clientSecret);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black" />
    </div>
  );

  if (!app) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error || 'App not found'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/developer/apps" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Apps
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{app.name}</h1>
        <p className="text-xs text-gray-400 font-mono mb-8 flex items-center gap-1">
          Client ID: {app.clientId}
          <CopyButton value={app.clientId} iconOnly successMessage="Client ID copied!" />
        </p>

        {/* Edit form */}
        <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5 mb-6">
          <h2 className="font-semibold text-gray-900">App Settings</h2>

          {[
            { id: 'name', label: 'App Name', required: true },
            { id: 'homepageUrl', label: 'Homepage URL', required: true },
            { id: 'logoUrl', label: 'Logo URL', required: false },
            { id: 'description', label: 'Description', required: false },
          ].map(({ id, label, required }) => (
            <div key={id}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="text"
                value={(form as Record<string, string>)[id]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                required={required}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URIs</label>
            <textarea
              value={form.redirectUris}
              onChange={(e) => setForm((f) => ({ ...f, redirectUris: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none font-mono"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={isSaving} className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors">
            {isSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>

        {/* Secret rotation */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-1">Client Secret</h2>
          <p className="text-sm text-gray-500 mb-4">Rotating the secret will revoke all existing tokens.</p>

          {newSecret && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs font-medium text-yellow-700 mb-1">New secret (save now — won't be shown again):</p>
              <div className="flex items-center gap-2">
                <p className="font-mono text-sm break-all flex-1">{newSecret}</p>
                <CopyButton value={newSecret} iconOnly successMessage="Secret copied!" />
              </div>
            </div>
          )}

          <button onClick={handleRotateSecret} disabled={isRotating} className="px-4 py-2 text-sm text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 disabled:opacity-50 transition-colors">
            {isRotating ? 'Rotating…' : 'Rotate Secret'}
          </button>
        </div>
      </div>
    </div>
  );
}
