'use client';

import React from 'react';
import { useAuth } from '@/lib/auth.client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { CharacterTemplateCard } from '@/components/CharacterTemplateCard';
import { CHARACTER_TEMPLATES } from '@/lib/character-templates';
import NavigationBar from '@/components/navigation/NavigationBar';

export default function TemplatesPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return null;
  }

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
              <h1 className="text-3xl font-display font-bold mt-2">Choose a Template</h1>
              <p className="text-muted-foreground mt-1">
                Pick a template to get started quickly. You can customize everything after selecting.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {CHARACTER_TEMPLATES.map((template) => (
                <CharacterTemplateCard key={template.id} template={template} />
              ))}
            </div>

            <div className="text-center">
              <p className="text-muted-foreground mb-4">Or start from scratch</p>
              <Button asChild>
                <Link href="/dashboard/oasisbios/new">Create Blank Character</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
