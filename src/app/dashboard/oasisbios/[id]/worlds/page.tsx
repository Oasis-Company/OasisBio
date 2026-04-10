'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { WorldCard } from '@/components/world/WorldCard';
import { CreateWorldCard } from '@/components/world/CreateWorldCard';

interface WorldItem {
  id: string;
  name: string;
  summary: string;
  aestheticKeywords?: string | null;
  timeSetting?: string | null;
  timeline?: string | null;
  physicsRules?: string | null;
  rules?: string | null;
  socialStructure?: string | null;
  factions?: string | null;
  geography?: string | null;
  majorConflict?: string | null;
  visibility: string;
  updatedAt: string;
}

export default function WorldsPage() {
  const params = useParams();
  const oasisBioId = params.id as string;

  const [worlds, setWorlds] = useState<WorldItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorlds = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/oasisbios/${oasisBioId}/worlds`);
        if (!res.ok) throw new Error('Failed to fetch worlds');
        setWorlds(await res.json());
      } catch {
        setError('Failed to load worlds. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorlds();
  }, [oasisBioId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading worlds…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-black text-white text-sm rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href={`/dashboard/oasisbios/${oasisBioId}`}
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-2 inline-flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Character
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">World Repository</h1>
            <p className="text-gray-500 mt-1 text-sm">
              {worlds.length === 0
                ? 'Build the worlds your characters inhabit.'
                : `${worlds.length} world${worlds.length !== 1 ? 's' : ''}`}
            </p>
          </div>
        </div>

        {/* Empty state */}
        {worlds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">No worlds yet</h2>
            <p className="text-sm text-gray-400 mb-6 max-w-xs">
              Every great character needs a world. Create yours to give your characters context and depth.
            </p>
            <Link
              href={`/dashboard/oasisbios/${oasisBioId}/worlds/new`}
              className="px-6 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create Your First World
            </Link>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <CreateWorldCard oasisBioId={oasisBioId} />
            {worlds.map((world) => (
              <WorldCard key={world.id} world={world} oasisBioId={oasisBioId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
