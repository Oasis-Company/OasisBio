'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { HintIcon } from '@/components/Tooltip';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

type Step = 1 | 2 | 3;

export default function CreateOasisBioPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: toastError } = useToast();

  // Check for "from" parameter (template/fork source)
  const fromSlug = searchParams.get('from') ?? null;
  const [sourceTitle, setSourceTitle] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldError, setFieldError] = useState('');

  // Step 1 — Identity
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [identityMode, setIdentityMode] = useState('real');

  // Step 2 — One Era (optional)
  const [eraName, setEraName] = useState('');
  const [eraType, setEraType] = useState('present');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }
    // Fetch the source bio title if coming from a template link
    if (fromSlug) {
      fetch(`/api/oasisbios/public?search=${encodeURIComponent(fromSlug)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data.data?.[0]) setSourceTitle(data.data[0].title);
        })
        .catch(() => {});
    }
  }, [user, router, fromSlug]);

  if (!user) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFieldError('');
    try {
      const payload: Record<string, unknown> = {
        title,
        tagline,
        identityMode,
      };
      if (eraName) {
        payload.eras = [{ name: eraName, eraType, startYear: null, endYear: null }];
      }

      const res = await fetch('/api/oasisbios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create');
      success('Identity created!');
      router.push(`/dashboard/oasisbios/${data.id}`);
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <Link href="/dashboard/oasisbios" className="text-sm text-muted-foreground hover:underline">
                ← Back to My OasisBios
              </Link>
              <h1 className="text-3xl font-display font-bold mt-2">Create New Identity</h1>
              <p className="text-muted-foreground mt-1">
                Start with the essentials. You can add eras, abilities, and worlds after saving.
              </p>
              {sourceTitle && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm dark:bg-purple-950/30 dark:border-purple-800">
                  <span className="text-purple-600">🍂</span>
                  <span>Inspired by <strong>{sourceTitle}</strong> — use it as a starting point</span>
                </div>
              )}
            </div>

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3].map(s => (
                  <div key={s} className="flex-1">
                    <div
                      className={`h-1.5 rounded-full transition-colors duration-300 ${
                        s <= step ? 'bg-black' : 'bg-muted'
                      }`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Identity</span>
                <span>Era (optional)</span>
                <span>Review</span>
              </div>
            </div>

            {/* Step 1: Identity */}
            {step === 1 && (
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Step 1: Basic Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">
                      Character Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="title"
                      placeholder="e.g. Ada Lovelace, Kaelen Voss"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium mb-1">
                      Tagline
                    </label>
                    <Input
                      id="tagline"
                      placeholder="One-line description"
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="identityMode" className="block text-sm font-medium mb-1">
                      Identity Mode
                      <HintIcon
                        hint={`Real: Your actual self in the real world\nFictional: Completely fictional characters\nHybrid: Mix of real and fictional elements\nFuture: Your future self\nAlternate: Parallel universe versions\nWorldbound: Characters bound to specific fictional worlds`}
                        variant="info"
                        side="top"
                      />
                    </label>
                    <select
                      id="identityMode"
                      value={identityMode}
                      onChange={e => setIdentityMode(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="real">Real</option>
                      <option value="fictional">Fictional</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="future">Future</option>
                      <option value="alternate">Alternate</option>
                      <option value="worldbound">Worldbound</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => {
                        if (!title.trim()) {
                          setFieldError('Character name is required');
                          return;
                        }
                        setFieldError('');
                        setStep(2);
                      }}
                    >
                      Next →
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: One Era (optional) */}
            {step === 2 && (
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Step 2: Add an Era (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Give your character a temporal anchor. You can add more eras later.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="eraName" className="block text-sm font-medium mb-1">
                        Era Name
                      </label>
                      <Input
                        id="eraName"
                        placeholder="e.g. The Gilded Age, Year 2145"
                        value={eraName}
                        onChange={e => setEraName(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="eraType" className="block text-sm font-medium mb-1">
                        Era Type
                      </label>
                      <select
                        id="eraType"
                        value={eraType}
                        onChange={e => setEraType(e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="past">Past</option>
                        <option value="present">Present</option>
                        <option value="future">Future</option>
                        <option value="alternate">Alternate</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      ← Back
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => { setEraName(''); setStep(3); }}>
                        Skip
                      </Button>
                      <Button onClick={() => setStep(3)}>
                        Next →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Review & Save */}
            {step === 3 && (
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Step 3: Review & Save</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Here's what will be created. You can edit everything later.
                  </p>

                  {/* Preview */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">NAME</span>
                      <p className="font-semibold text-lg">{title || '(untitled)'}</p>
                    </div>
                    {tagline && (
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">TAGLINE</span>
                        <p className="text-muted-foreground">{tagline}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">MODE</span>
                      <p className="capitalize">{identityMode}</p>
                    </div>
                    {eraName && (
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">ERA</span>
                        <p>{eraName} <span className="text-muted-foreground">({eraType})</span></p>
                      </div>
                    )}
                  </div>

                  {fieldError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                      {fieldError}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>
                      ← Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save & Continue →'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
