'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/CopyButton';

interface OAuthApp {
  id: string;
  name: string;
  description?: string;
  homepageUrl: string;
  clientId: string;
  isActive: boolean;
  createdAt: string;
}

export default function DeveloperAppsPage() {
  const [apps, setApps] = useState<OAuthApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/developer/apps')
      .then((r) => r.json())
      .then((data) => { setApps(data); setLoading(false); })
      .catch(() => { setError('Failed to load apps'); setLoading(false); });
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will revoke all active tokens.`)) return;
    const res = await fetch(`/api/developer/apps/${id}`, { method: 'DELETE' });
    if (res.ok) setApps((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Apps</h1>
            <p className="text-gray-500 mt-1 text-sm">Manage your OAuth applications</p>
          </div>
          <div className="flex gap-3">
            <Link href="/developer/docs" className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Docs
            </Link>
            <Link href="/developer/apps/new" className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              New App
            </Link>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {apps.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No apps yet</h2>
            <p className="text-sm text-gray-400 mb-6">Create your first OAuth app to enable "Continue with Oasis".</p>
            <Link href="/developer/apps/new" className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
              Create App
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {apps.map((app) => (
              <div key={app.id} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{app.name}</h3>
                    {!app.isActive && (
                      <span className="px-2 py-0.5 text-xs bg-red-50 text-red-500 rounded-full">Inactive</span>
                    )}
                  </div>
                  {app.description && <p className="text-sm text-gray-500 mb-1 truncate">{app.description}</p>}
                  <p className="text-xs text-gray-400 font-mono flex items-center gap-1">
                    {app.clientId}
                    <CopyButton value={app.clientId} iconOnly successMessage="Client ID copied!" />
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link href={`/developer/apps/${app.id}`} className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDelete(app.id, app.name)}
                    className="px-3 py-1.5 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
