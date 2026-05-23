'use client';

import React from 'react';
import { useAuth } from '@/lib/auth.client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import NavigationBar from '@/components/navigation/NavigationBar';

const LIFE_STAGE_STARTERS = [
  {
    id: 'current-self',
    title: 'Your Current Self',
    description: 'Start from who you are right now, documenting your current thoughts, skills, and worldview',
    icon: '🧘',
    eraType: 'present',
    hint: 'Best for new users'
  },
  {
    id: 'past-self',
    title: 'Your Past Self',
    description: 'Document a specific period of your life - college years, early career, etc.',
    icon: '📸',
    eraType: 'past',
    hint: 'Create a time capsule'
  },
  {
    id: 'future-vision',
    title: 'Your Future Self',
    description: 'Define who you want to become, documenting your vision and goals',
    icon: '🔮',
    eraType: 'future',
    hint: 'Set your direction'
  },
  {
    id: 'parallel-self',
    title: 'Your Parallel Self',
    description: 'Explore who you might have been with different life choices',
    icon: '🌌',
    eraType: 'alternate',
    hint: 'For creative exploration'
  }
];

export default function LifeStageStartersPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

  const handleSelect = (starter: typeof LIFE_STAGE_STARTERS[0]) => {
    const params = new URLSearchParams({
      eraType: starter.eraType,
      title: starter.title
    });
    router.push(`/dashboard/oasisbios/new?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <NavigationBar user={user} onLogout={() => {}} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Link href="/dashboard/oasisbios" className="text-sm text-muted-foreground hover:underline">
                ← Back to My OasisBios
              </Link>
              <h1 className="text-3xl font-display font-bold mt-2">Choose Your Starting Point</h1>
              <p className="text-muted-foreground mt-1">
                OasisBio is your identity archive - which version of you will you document?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {LIFE_STAGE_STARTERS.map((starter) => (
                <div
                  key={starter.id}
                  onClick={() => handleSelect(starter)}
                  className="p-6 border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-all hover:border-purple-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-4xl">{starter.icon}</div>
                    <span className="text-xs px-2 py-1 bg-muted rounded-full">
                      {starter.hint}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{starter.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {starter.description}
                  </p>
                  <div className="mt-4 text-sm text-purple-600 font-medium">
                    Start documenting →
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-border">
              <p className="text-muted-foreground mb-4">Or start completely from scratch</p>
              <Button asChild>
                <Link href="/dashboard/oasisbios/new">Start from Blank</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
