'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ModuleSection } from '@/components/world/ModuleSection';
import { CharacterSection } from '@/components/world/CharacterSection';
import { calculateCompletionScore, getModuleCompletion, deserializeGenreTone } from '@/lib/world-utils';
import { WORLD_STEPS } from '@/types/world';
import type { WorldFormData } from '@/types/world';

interface WorldData extends Omit<Partial<WorldFormData>, 'visibility'> {
  id: string;
  name: string;
  summary: string;
  aestheticKeywords?: string | null;
  visibility: string;
  updatedAt?: string;
  oasisBio?: {
    id: string;
    userId: string;
    title: string;
    coverImageUrl?: string | null;
    slug: string;
  };
}

export default function WorldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const oasisBioId = params.id as string;
  const worldId = params.wid as string;

  const [world, setWorld] = useState<WorldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchWorld = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/worlds/${worldId}`);
      if (!res.ok) throw new Error('Failed to fetch world');
      const data = await res.json();
      // Deserialize genre/tone from aestheticKeywords
      const { genre, tone } = deserializeGenreTone(data.aestheticKeywords);
      setWorld({ ...data, genre, tone });
    } catch {
      setError('Failed to load world.');
    } finally {
      setLoading(false);
    }
  }, [worldId]);

  useEffect(() => { fetchWorld(); }, [fetchWorld]);

  const handleSaveModule = async (updates: Partial<WorldFormData>) => {
    // Optimistic update
    setWorld((prev) => prev ? { ...prev, ...updates } : prev);

    const res = await fetch(`/api/worlds/${worldId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      // Rollback
      await fetchWorld();
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message ?? 'Failed to save');
    }

    const updated = await res.json();
    const { genre, tone } = deserializeGenreTone(updated.aestheticKeywords);
    setWorld({ ...updated, genre, tone });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/worlds/${worldId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.push(`/dashboard/oasisbios/${oasisBioId}/worlds`);
    } catch {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setError('Failed to delete world. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black" />
      </div>
    );
  }

  if (error || !world) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error ?? 'World not found'}</p>
          <Link href={`/dashboard/oasisbios/${oasisBioId}/worlds`} className="text-sm text-gray-500 hover:text-black">
            ← Back to Worlds
          </Link>
        </div>
      </div>
    );
  }

  const score = calculateCompletionScore(world as Partial<WorldFormData>);
  const { genre, tone } = deserializeGenreTone(world.aestheticKeywords);

  // Build linked characters list from oasisBio (the world belongs to one OasisBio)
  const linkedCharacters = world.oasisBio
    ? [{ id: world.oasisBio.id, title: world.oasisBio.title, coverImageUrl: world.oasisBio.coverImageUrl, slug: world.oasisBio.slug }]
    : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link
          href={`/dashboard/oasisbios/${oasisBioId}/worlds`}
          className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Worlds
        </Link>

        {/* Header */}
        <div className="bg-white border border-gray-100 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-2 mb-2">
                {genre && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-black text-white rounded-full">{genre}</span>
                )}
                {tone && (
                  <span className="px-2 py-0.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-full">{tone}</span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1 truncate">{world.name}</h1>
              {world.summary && (
                <p className="text-sm text-gray-500 line-clamp-2">{world.summary}</p>
              )}
            </div>

            {/* Completion score */}
            <div className="flex-shrink-0 text-center">
              <div className="text-3xl font-bold text-gray-900">{score}%</div>
              <div className="text-xs text-gray-400">complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-black h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Module sections */}
        <div className="space-y-3 mb-6">
          {WORLD_STEPS.map((step) => {
            const fieldKeys = step.fields.map((f) => f.key);
            const { filled, total } = getModuleCompletion(world as Partial<WorldFormData>, fieldKeys);
            return (
              <ModuleSection
                key={step.module}
                title={step.title}
                fields={step.fields}
                data={world as Partial<WorldFormData>}
                filledCount={filled}
                totalCount={total}
                onSave={handleSaveModule}
              />
            );
          })}
        </div>

        {/* Characters section */}
        <div className="mb-6">
          <CharacterSection characters={linkedCharacters} oasisBioId={oasisBioId} />
        </div>

        {/* Danger zone */}
        <div className="border border-red-100 rounded-xl p-5 bg-white">
          <h3 className="text-sm font-semibold text-red-600 mb-1">Danger Zone</h3>
          <p className="text-xs text-gray-400 mb-3">Deleting a world is permanent and cannot be undone.</p>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-1.5 text-sm text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete World
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Are you sure?</span>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                {isDeleting ? 'Deleting…' : 'Yes, delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
