'use client';

import React from 'react';
import Link from 'next/link';

interface CreateWorldCardProps {
  oasisBioId: string;
}

export function CreateWorldCard({ oasisBioId }: CreateWorldCardProps) {
  return (
    <Link
      href={`/dashboard/oasisbios/${oasisBioId}/worlds/new`}
      className="group flex flex-col items-center justify-center bg-white border-2 border-dashed border-gray-200 rounded-xl p-5 min-h-[180px] hover:border-black hover:bg-gray-50 transition-all duration-200"
    >
      <div className="w-10 h-10 rounded-full border-2 border-gray-300 group-hover:border-black flex items-center justify-center mb-3 transition-colors">
        <svg className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-sm font-medium text-gray-500 group-hover:text-black transition-colors">
        Create New World
      </span>
    </Link>
  );
}
