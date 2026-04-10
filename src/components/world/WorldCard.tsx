'use client';

import React from 'react';
import Link from 'next/link';
import { calculateCompletionScore, truncateSummary, deserializeGenreTone } from '@/lib/world-utils';
import type { WorldFormData } from '@/types/world';

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
  updatedAt?: string | Date;
}

interface WorldCardProps {
  world: WorldItem;
  oasisBioId: string;
}

export function WorldCard({ world, oasisBioId }: WorldCardProps) {
  const { genre, tone } = deserializeGenreTone(world.aestheticKeywords);
  const score = calculateCompletionScore(world as Partial<WorldFormData>);
  const excerpt = truncateSummary(world.summary, 80);
  const updatedAt = world.updatedAt
    ? new Date(world.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <Link
      href={`/dashboard/oasisbios/${oasisBioId}/worlds/${world.id}`}
      className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-black hover:shadow-md transition-all duration-200"
    >
      {/* Tags */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {genre && (
          <span className="px-2 py-0.5 text-xs font-medium bg-black text-white rounded-full">
            {genre}
          </span>
        )}
        {tone && (
          <span className="px-2 py-0.5 text-xs font-medium border border-gray-300 text-gray-600 rounded-full">
            {tone}
          </span>
        )}
        {!genre && !tone && (
          <span className="px-2 py-0.5 text-xs text-gray-400 border border-dashed border-gray-200 rounded-full">
            No genre set
          </span>
        )}
      </div>

      {/* Name */}
      <h3 className="font-semibold text-gray-900 text-base mb-1 group-hover:text-black line-clamp-1">
        {world.name}
      </h3>

      {/* Summary excerpt */}
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[2.5rem]">
        {excerpt || <span className="italic text-gray-300">No summary yet</span>}
      </p>

      {/* Completion bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Completion</span>
          <span className="text-xs font-medium text-gray-700">{score}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-black h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>

      {/* Updated at */}
      {updatedAt && (
        <p className="text-xs text-gray-300 mt-3">Updated {updatedAt}</p>
      )}
    </Link>
  );
}
