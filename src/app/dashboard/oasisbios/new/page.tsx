'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { HintIcon } from '@/components/Tooltip';
import { SuccessModal } from '@/components/SuccessModal';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

type Step = 1 | 2 | 3;
type SlugStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'forbidden' | 'error';

interface DraftData {
  title: string;
  tagline: string;
  identityMode: string;
  eraName: string;
  eraType: string;
  abilityName: string;
  abilityDescription: string;
  slug?: string;
}

const getDraftKey = (userId: string) => `oasisbio-draft-${userId}`;

const saveDraft = (userId: string, data: DraftData): void => {
  try {
    localStorage.setItem(getDraftKey(userId), JSON.stringify({
      ...data,
      savedAt: new Date().toISOString(),
    }));
  } catch {
  }
};

const loadDraft = (userId: string): DraftData | null => {
  try {
    const stored = localStorage.getItem(getDraftKey(userId));
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        title: parsed.title ?? '',
        tagline: parsed.tagline ?? '',
        identityMode: parsed.identityMode ?? 'real',
        eraName: parsed.eraName ?? '',
        eraType: parsed.eraType ?? 'present',
        abilityName: parsed.abilityName ?? '',
        abilityDescription: parsed.abilityDescription ?? '',
        slug: parsed.slug ?? '',
      };
    }
  } catch {
  }
  return null;
};

const generateSlugFromTitle = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .trim();
};

const clearDraft = (userId: string): void => {
  try {
    localStorage.removeItem(getDraftKey(userId));
  } catch {
  }
};

export default function CreateOasisBioPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { success, error: toastError } = useToast();

  const fromSlug = searchParams.get('from') ?? null;
  const [sourceTitle, setSourceTitle] = useState<string | null>(null);

  const [step, setStep] = useState<Step>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasDraft, setHasDraft] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [fieldError, setFieldError] = useState('');

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [identityMode, setIdentityMode] = useState('real');

  const [eraName, setEraName] = useState('');
  const [eraType, setEraType] = useState('present');

  const [abilityName, setAbilityName] = useState('');
  const [abilityDescription, setAbilityDescription] = useState('');

  const [slug, setSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<SlugStatus>('idle');
  const [slugMessage, setSlugMessage] = useState('');
  const slugCheckTimer = useRef<NodeJS.Timeout | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdBioSlug, setCreatedBioSlug] = useState('');
  const [createdBioId, setCreatedBioId] = useState('');

  const currentDraftData: DraftData = { title, tagline, identityMode, eraName, eraType, abilityName, abilityDescription, slug };

  const checkSlugAvailability = useCallback(async (slugValue: string) => {
    if (!slugValue || slugValue.length < 3) {
      setSlugStatus(slugValue ? 'invalid' : 'idle');
      setSlugMessage(slugValue && slugValue.length > 0 && slugValue.length < 3 ? 'At least 3 characters required' : '');
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue)) {
      setSlugStatus('invalid');
      setSlugMessage('Only lowercase letters, numbers, and hyphens allowed');
      return;
    }

    setSlugStatus('checking');
    setSlugMessage('Checking availability...');

    try {
      const res = await fetch(`/api/oasisbios/check-slug?slug=${encodeURIComponent(slugValue)}`);
      const data = await res.json();

      if (data.available) {
        setSlugStatus('available');
        setSlugMessage(`/bio/${slugValue} is available ✓`);
      } else {
        if (data.reason === 'taken') {
          setSlugStatus('taken');
          setSlugMessage(`Already used by "${data.conflictTitle ?? 'another identity'}`);
        } else if (data.reason === 'publication_taken') {
          setSlugStatus('taken');
          setSlugMessage('This URL is already taken');
        } else if (data.reason === 'forbidden') {
          setSlugStatus('forbidden');
          setSlugMessage('This URL contains forbidden words ⚠');
        } else if (data.reason === 'too_short') {
          setSlugStatus('invalid');
          setSlugMessage('At least 3 characters required');
        } else if (data.reason === 'too_long') {
          setSlugStatus('invalid');
          setSlugMessage('Maximum 60 characters');
        } else {
          setSlugStatus('invalid');
          setSlugMessage('Invalid URL format');
        }
      }
    } catch {
      setSlugStatus('error');
      setSlugMessage('Could not verify URL');
    }
  }, []);

  const handleSlugChange = (value: string) => {
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(sanitized);

    if (slugCheckTimer.current) clearTimeout(slugCheckTimer.current);
    slugCheckTimer.current = setTimeout(() => {
      checkSlugAvailability(sanitized);
    }, 400);
  };

  const performSave = useCallback(() => {
    if (!user) return;
    setIsSaving(true);
    saveDraft(user.id, currentDraftData);
    setLastSaved(new Date());
    setHasDraft(true);
    setIsSaving(false);
  }, [user, currentDraftData]);

  const handleRestoreDraft = () => {
    if (!user) return;
    const draft = loadDraft(user.id);
    if (draft) {
      setTitle(draft.title);
      setTagline(draft.tagline);
      setIdentityMode(draft.identityMode);
      setEraName(draft.eraName);
      setEraType(draft.eraType);
      setAbilityName(draft.abilityName);
      setAbilityDescription(draft.abilityDescription);
      setSlug(draft.slug || '');
      setHasDraft(true);
      setLastSaved(new Date());
    }
    setShowRestoreModal(false);
  };

  const handleStartFresh = () => {
    if (user) {
      clearDraft(user.id);
    }
    setHasDraft(false);
    setShowRestoreModal(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }

    const starterEraType = searchParams.get('eraType');
    const starterTitle = searchParams.get('title');
    if (starterEraType) {
      setEraType(starterEraType);
      if (starterTitle) {
        setSourceTitle(starterTitle);
      }
    }

    if (fromSlug) {
      fetch(`/api/oasisbios/public?search=${encodeURIComponent(fromSlug)}&limit=1`)
        .then(res => res.json())
        .then(data => {
          if (data.data?.[0]) setSourceTitle(data.data[0].title);
        })
        .catch(() => {});
    } else if (user) {
      const draft = loadDraft(user.id);
      if (draft && (draft.title || draft.tagline || draft.eraName)) {
        setShowRestoreModal(true);
      }
    }
  }, [user, router, fromSlug, searchParams]);

  useEffect(() => {
    if (step === 3 && !slug && title) {
      const generatedSlug = generateSlugFromTitle(title);
      setSlug(generatedSlug);
      if (generatedSlug) {
        checkSlugAvailability(generatedSlug);
      }
    }
  }, [step, title, slug, checkSlugAvailability]);

  if (!user) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setFieldError('');
    try {
      if (!slug) {
        throw new Error('URL is required');
      }
      if (slugStatus !== 'available') {
        throw new Error('Please use an available URL');
      }

      const payload: Record<string, unknown> = {
        title,
        tagline,
        identityMode,
        slug,
      };
      if (eraName) {
        payload.eras = [{ name: eraName, eraType, startYear: null, endYear: null }];
      }
      if (abilityName) {
        payload.abilities = [{ name: abilityName, description: abilityDescription }];
      }

      const res = await fetch('/api/oasisbios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Creation failed');
      if (user) {
        clearDraft(user.id);
      }
      setCreatedBioSlug(data.slug || data.id);
      setCreatedBioId(data.id);
      setShowSuccessModal(true);
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : 'Creation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishNow = () => {
    setShowSuccessModal(false);
    success('Your identity archive is ready!');
    router.push(`/dashboard/oasisbios/${createdBioId}`);
  };

  const handleContinueEditing = () => {
    setShowSuccessModal(false);
    router.push('/dashboard/oasisbios');
  };

  const handleNext = (targetStep: Step) => {
    performSave();
    setStep(targetStep);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago';
    return lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-8">
              <Link href="/dashboard/oasisbios" className="text-sm text-muted-foreground hover:underline">
                ← Back to My OasisBios
              </Link>
              <h1 className="text-3xl font-display font-bold mt-2">Create Identity Archive</h1>
              <p className="text-muted-foreground mt-1">
                OasisBio is your digital immortality archive - document the real you
              </p>
              {sourceTitle && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm dark:bg-purple-950/30 dark:border-purple-800">
                  <span className="text-purple-600">🍂</span>
                  <span>Starting point: <strong>{sourceTitle}</strong></span>
                </div>
              )}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full text-xs text-muted-foreground">
                <span>✨</span>
                <span>Need inspiration? Ask Deo and Dia</span>
              </div>
            </div>

            {/* Restore Draft Modal */}
            {showRestoreModal && (
              <div className="mb-6 p-4 bg-muted/50 border border-border rounded-lg">
                <p className="text-sm font-medium mb-3">You have an unsaved draft</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Would you like to continue where you left off?
                </p>
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleRestoreDraft}>
                    Restore Draft
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleStartFresh}>
                    Start Fresh
                  </Button>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
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
                {lastSaved && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    {isSaving ? (
                      <span className="inline-block w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                    ) : (
                      <span className="text-green-600">✓</span>
                    )}
                    {isSaving ? 'Saving...' : `Saved ${formatLastSaved()}`}
                  </span>
                )}
              </div>
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Basic Info</span>
                <span>Era (optional)</span>
                <span>Review & Save</span>
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
                      Identity Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="title"
                      placeholder="e.g., Current Me, 20-Year-Old Me, Future Me"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Which period of your life does this identity represent?
                    </p>
                  </div>
                  <div>
                    <label htmlFor="tagline" className="block text-sm font-medium mb-1">
                      One-Line Description
                    </label>
                    <Input
                      id="tagline"
                      placeholder="Summarize this version of you in one sentence"
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Leave a marker for your future self
                    </p>
                  </div>
                  <div>
                    <label htmlFor="identityMode" className="block text-sm font-medium mb-1">
                      Identity Type
                      <HintIcon
                        hint={`Real: The real you, documenting your current self
Future: The you that you want to become
Alternate: You in a parallel universe
Hybrid: A mix of real and imagined`}
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
                      <option value="real">Real - The real you</option>
                      <option value="future">Future - The you want to become</option>
                      <option value="alternate">Alternate - Parallel universe</option>
                      <option value="hybrid">Hybrid - Mix of real and imagined</option>
                    </select>
                  </div>
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => {
                        if (!title.trim()) {
                          setFieldError('Identity name is required');
                          return;
                        }
                        setFieldError('');
                        handleNext(2);
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
                  <CardTitle>Step 2: Add Era and Trait (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Give this identity a temporal anchor and document a trait you're proud of. You can add more later.
                  </p>

                  {/* Era Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Era</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="eraName" className="block text-sm font-medium mb-1">
                          Era Name
                        </label>
                        <Input
                          id="eraName"
                          placeholder="e.g., College Years, Early Career, 2030"
                          value={eraName}
                          onChange={e => setEraName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Which period of your life does this identity belong to?
                        </p>
                      </div>
                      <div>
                        <label htmlFor="eraType" className="block text-sm font-medium mb-1">
                          Time Type
                        </label>
                        <select
                          id="eraType"
                          value={eraType}
                          onChange={e => setEraType(e.target.value)}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="past">Past - The past</option>
                          <option value="present">Present - Right now</option>
                          <option value="future">Future - The future</option>
                          <option value="alternate">Alternate - Parallel</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Ability Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Trait</h3>
                    <div>
                      <label htmlFor="abilityName" className="block text-sm font-medium mb-1">
                        Trait Name
                      </label>
                      <Input
                        id="abilityName"
                        placeholder="e.g., Empathy, Fast Learner, Persistence"
                        value={abilityName}
                        onChange={e => setAbilityName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        What trait do you value most about yourself in this period?
                      </p>
                    </div>
                    <div>
                      <label htmlFor="abilityDescription" className="block text-sm font-medium mb-1">
                        Detailed Description
                      </label>
                      <textarea
                        id="abilityDescription"
                        placeholder="Document what this trait means to you..."
                        value={abilityDescription}
                        onChange={e => setAbilityDescription(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button variant="outline" onClick={() => handleNext(1)}>
                      ← Back
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" onClick={() => { setEraName(''); setAbilityName(''); setAbilityDescription(''); handleNext(3); }}>
                        Skip
                      </Button>
                      <Button onClick={() => handleNext(3)}>
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
                    This is what will be created. You can edit everything later.
                  </p>

                  {/* Slug Input */}
                  <div className="space-y-2">
                    <label htmlFor="slug" className="block text-sm font-medium">
                      URL Slug
                      <HintIcon
                        hint="This will be your public identity URL, e.g., /bio/2024-me"
                        variant="info"
                        side="top"
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground whitespace-nowrap">/bio/</span>
                      <Input
                        id="slug"
                        value={slug}
                        onChange={(e) => handleSlugChange(e.target.value)}
                        placeholder="2024-me"
                        className={
                          slugStatus === 'available'
                            ? 'border-green-500 focus:ring-green-500'
                            : slugStatus === 'taken' || slugStatus === 'invalid' || slugStatus === 'forbidden'
                            ? 'border-red-500 focus:ring-red-500'
                            : ''
                        }
                      />
                    </div>
                    <p
                      className={`text-sm ${
                        slugStatus === 'available'
                          ? 'text-green-600'
                          : slugStatus === 'checking'
                          ? 'text-muted-foreground'
                          : 'text-red-600'
                      }`}
                    >
                      {slugMessage}
                    </p>
                  </div>

                  {/* Preview */}
                  <div className="border border-border rounded-lg p-4 bg-muted/30 space-y-3">
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">Identity Name</span>
                      <p className="font-semibold text-lg">{title || '(not set)'}</p>
                    </div>
                    {tagline && (
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">One-Line Description</span>
                        <p className="text-muted-foreground">{tagline}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">URL</span>
                      <p className="font-mono text-sm">/bio/{slug || '(not set)'}</p>
                    </div>
                    <div>
                      <span className="text-xs font-mono text-muted-foreground">Type</span>
                      <p className="capitalize">{identityMode}</p>
                    </div>
                    {eraName && (
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">Era</span>
                        <p>{eraName} <span className="text-muted-foreground">({eraType})</span></p>
                      </div>
                    )}
                    {abilityName && (
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">Trait</span>
                        <p>{abilityName}</p>
                        {abilityDescription && (
                          <p className="text-sm text-muted-foreground mt-1">{abilityDescription}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {fieldError && (
                    <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
                      {fieldError}
                    </div>
                  )}

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => handleNext(2)}>
                      ← Back
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                      {isSubmitting ? 'Saving...' : 'Save Archive →'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccessModal}
        bioName={title}
        bioSlug={createdBioSlug}
        onPublishNow={handlePublishNow}
        onContinueEditing={handleContinueEditing}
      />
    </div>
  );
}
