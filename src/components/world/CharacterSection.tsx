'use client';

import React from 'react';
import Link from 'next/link';

interface LinkedCharacter {
  id: string;
  title: string;
  coverImageUrl?: string | null;
  slug: string;
}

interface CharacterSectionProps {
  characters: LinkedCharacter[];
  oasisBioId: string;
}

export function CharacterSection({ characters, oasisBioId }: CharacterSectionProps) {
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="px-5 py-4 bg-white border-b border-gray-50">
        <h3 className="font-semibold text-gray-900">Characters in this World</h3>
      </div>

      <div className="px-5 py-4 bg-white">
        {characters.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400">No characters in this world yet.</p>
            <p className="text-xs text-gray-300 mt-1">
              Link a character by selecting this world in the character&apos;s settings.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {characters.map((char) => (
              <Link
                key={char.id}
                href={`/dashboard/oasisbios/${char.id}`}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 transition-all"
              >
                {char.coverImageUrl ? (
                  <img
                    src={char.coverImageUrl}
                    alt={char.title}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-400 font-medium">
                    {char.title.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{char.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
