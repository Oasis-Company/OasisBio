'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/CopyButton';
import { useToast } from '@/components/Toast';

export default function NewAppPage() {
  const { success: toastSuccess } = useToast();
  const [form, setForm] = useState({
    name: '',
    description: '',
    homepageUrl: '',
    redirectUris: '',
    logoUrl: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdApp, setCreatedApp] = useState<{ clientId: string; clientSecret: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const redirectUris = form.redirectUris
      .split('\n')
      .map((u) => u.trim())
      .filter(Boolean);

    const res = await fetch('/api/developer/apps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description || undefined,
        homepageUrl: form.homepageUrl,
        redirectUris,
        logoUrl: form.logoUrl || undefined,
      }),
    });

    const data = await res.json();
    setIsSubmitting(false);

    if (!res.ok) {
      setError(data.error?.message ?? 'Failed to create app');
      return;
    }

    setCreatedApp({ clientId: data.clientId, clientSecret: data.clientSecret });
    toastSuccess('App created successfully!');
  };

  if (createdApp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-lg w-full">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">App Created</h2>
          <p className="text-sm text-red-600 mb-5 font-medium">
            Save your client secret now — it will not be shown again.
          </p>

          <div className="space-y-3 mb-6">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client ID</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex-1 break-all">{createdApp.clientId}</p>
                <CopyButton value={createdApp.clientId} iconOnly successMessage="Client ID copied!" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Client Secret</label>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono text-sm bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 flex-1 break-all">{createdApp.clientSecret}</p>
                <CopyButton value={createdApp.clientSecret} iconOnly successMessage="Secret copied!" />
              </div>
            </div>
          </div>

          <Link href="/developer/apps" className="block w-full text-center px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            Go to My Apps
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link href="/developer/apps" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Apps
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create OAuth App</h1>

        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
          {[
            { id: 'name', label: 'App Name', placeholder: 'My Awesome App', required: true },
            { id: 'homepageUrl', label: 'Homepage URL', placeholder: 'https://myapp.com', required: true },
            { id: 'logoUrl', label: 'Logo URL', placeholder: 'https://myapp.com/logo.png', required: false },
            { id: 'description', label: 'Description', placeholder: 'What does your app do?', required: false },
          ].map(({ id, label, placeholder, required }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
              </label>
              <input
                id={id}
                type="text"
                value={(form as Record<string, string>)[id]}
                onChange={(e) => setForm((f) => ({ ...f, [id]: e.target.value }))}
                placeholder={placeholder}
                required={required}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          ))}

          <div>
            <label htmlFor="redirectUris" className="block text-sm font-medium text-gray-700 mb-1">
              Redirect URIs <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-400 mb-1">One per line. Must be HTTPS or http://localhost.</p>
            <textarea
              id="redirectUris"
              value={form.redirectUris}
              onChange={(e) => setForm((f) => ({ ...f, redirectUris: e.target.value }))}
              placeholder="https://myapp.com/auth/callback&#10;http://localhost:3000/auth/callback"
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none font-mono"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? 'Creating…' : 'Create App'}
          </button>
        </form>
      </div>
    </div>
  );
}
