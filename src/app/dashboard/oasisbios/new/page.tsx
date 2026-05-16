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
// import { decodeTemplateData, CHARACTER_TEMPLATES, encodeTemplateData } from '@/lib/character-templates';

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
  const [showQuickStart, setShowQuickStart] = useState(true);

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
      setSlugMessage(slugValue && slugValue.length > 0 && slugValue.length < 3 ? '至少需要3个字符' : '');
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slugValue)) {
      setSlugStatus('invalid');
      setSlugMessage('只允许小写字母、数字和连字符');
      return;
    }

    setSlugStatus('checking');
    setSlugMessage('正在检查...');

    try {
      const res = await fetch(`/api/oasisbios/check-slug?slug=${encodeURIComponent(slugValue)}`);
      const data = await res.json();

      if (data.available) {
        setSlugStatus('available');
        setSlugMessage(`/bio/${slugValue} 可用 ✓`);
      } else {
        if (data.reason === 'taken') {
          setSlugStatus('taken');
          setSlugMessage(`已被 "${data.conflictTitle ?? '其他角色'}" 使用`);
        } else if (data.reason === 'publication_taken') {
          setSlugStatus('taken');
          setSlugMessage('该 URL 已被占用');
        } else if (data.reason === 'forbidden') {
          setSlugStatus('forbidden');
          setSlugMessage('该 URL 包含禁用词 ⚠');
        } else if (data.reason === 'too_short') {
          setSlugStatus('invalid');
          setSlugMessage('至少需要3个字符');
        } else if (data.reason === 'too_long') {
          setSlugStatus('invalid');
          setSlugMessage('最多60个字符');
        } else {
          setSlugStatus('invalid');
          setSlugMessage('无效的 URL 格式');
        }
      }
    } catch {
      setSlugStatus('error');
      setSlugMessage('无法验证 URL');
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

    // const templateParam = searchParams.get('template');
    // if (templateParam) {
    //   const templateData = decodeTemplateData(templateParam);
    //   if (templateData) {
    //     setTitle(templateData.title);
    //     setTagline(templateData.tagline);
    //     setIdentityMode(templateData.identityMode);
    //     if (templateData.eraName) setEraName(templateData.eraName);
    //     if (templateData.eraType) setEraType(templateData.eraType);
    //     if (templateData.abilityName) setAbilityName(templateData.abilityName);
    //     if (templateData.abilityDescription) setAbilityDescription(templateData.abilityDescription);
    //     setSourceTitle(templateData.title);
    //     return;
    //   }
    // }

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
        throw new Error('URL 是必填项');
      }
      if (slugStatus !== 'available') {
        throw new Error('请使用一个可用的 URL');
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
      if (!res.ok) throw new Error(data.error || '创建失败');
      if (user) {
        clearDraft(user.id);
      }
      setCreatedBioSlug(data.slug || data.id);
      setCreatedBioId(data.id);
      setShowSuccessModal(true);
    } catch (err) {
      setFieldError(err instanceof Error ? err.message : '创建失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePublishNow = () => {
    setShowSuccessModal(false);
    success('Your character is ready to be published!');
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
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
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
              <h1 className="text-3xl font-display font-bold mt-2">创建新身份</h1>
              <p className="text-muted-foreground mt-1">
                创造你自己
              </p>
              {sourceTitle && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-sm dark:bg-purple-950/30 dark:border-purple-800">
                  <span className="text-purple-600">🍂</span>
                  <span>Inspired by <strong>{sourceTitle}</strong> — use it as a starting point</span>
                </div>
              )}
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-muted/50 border border-border rounded-full text-xs text-muted-foreground">
                <span>✨</span>
                <span>需要灵感？可以问问 Deo 和 Dia</span>
              </div>
            </div>

            {/* Quick Start Templates */}
            {/* {showQuickStart && step === 1 && !sourceTitle && !searchParams.get('template') && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">快速开始</h2>
                  <button 
                    onClick={() => setShowQuickStart(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    跳过 →
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {CHARACTER_TEMPLATES.map((template) => (
                    <Card 
                      key={template.id} 
                      className="cursor-pointer hover:shadow-md transition-all group border-2 border-transparent hover:border-purple-200"
                      onClick={() => {
                        const encoded = encodeTemplateData(template.data);
                        router.push(`/dashboard/oasisbios/new?template=${encoded}`);
                      }}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{template.icon}</span>
                            <div>
                              <CardTitle className="text-base">{template.name}</CardTitle>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                            {template.category}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="font-medium text-sm">{template.preview.title}</p>
                          <p className="text-xs text-muted-foreground">{template.preview.tagline}</p>
                        </div>
                        <div className="mt-3 text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          点击使用此模板 →
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="flex flex-col items-center justify-center p-8 border-dashed cursor-pointer hover:bg-muted/30 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-foreground">从零开始</p>
                    <p className="text-xs text-muted-foreground mt-1">完全自定义</p>
                  </Card>
                </div>
              </div>
            )}*/}

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
                    <p className="text-xs text-muted-foreground mt-1">
                      别人怎么称呼你？你希望怎么介绍自己？
                    </p>
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
                    <p className="text-xs text-muted-foreground mt-1">
                      用一句话总结你最特别的地方
                    </p>
                  </div>
                  <div>
                    <label htmlFor="identityMode" className="block text-sm font-medium mb-1">
                      Identity Mode
                      <HintIcon
                        hint={`Real: 真实的你，记录现在的自己\nFictional: 你想探索的一个想象中的你\nHybrid: 混合真实和想象的你\nFuture: 未来的你，你想成为的样子\nAlternate: 平行宇宙中的你\nWorldbound: 在某个世界观中的你`}
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
                  <CardTitle>Step 2: Add an Era & Ability (Optional)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground">
                    Give your character a temporal anchor and a special ability. You can add more later.
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
                          placeholder="e.g. The Gilded Age, Year 2145"
                          value={eraName}
                          onChange={e => setEraName(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          你生活在什么时空？现在、未来还是理想中的世界？
                        </p>
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
                  </div>

                  {/* Ability Section */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold">Ability</h3>
                    <div>
                      <label htmlFor="abilityName" className="block text-sm font-medium mb-1">
                        Ability Name
                      </label>
                      <Input
                        id="abilityName"
                        placeholder="e.g. Time Manipulation, Healing Factor"
                        value={abilityName}
                        onChange={e => setAbilityName(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        你最引以为傲的特质或能力是什么？
                      </p>
                    </div>
                    <div>
                      <label htmlFor="abilityDescription" className="block text-sm font-medium mb-1">
                        Ability Description
                      </label>
                      <textarea
                        id="abilityDescription"
                        placeholder="Describe the ability..."
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
                    这是将要创建的内容。您以后可以编辑所有内容。
                  </p>

                  {/* Slug Input */}
                  <div className="space-y-2">
                    <label htmlFor="slug" className="block text-sm font-medium">
                      URL 别名 (Slug)
                      <HintIcon
                        hint="这将是您角色页面的公开 URL，例如 /bio/ada-lovelace"
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
                        placeholder="ada-lovelace"
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
                      <span className="text-xs font-mono text-muted-foreground">URL</span>
                      <p className="font-mono text-sm">/bio/{slug || '(待设置)'}</p>
                    </div>
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
                    {abilityName && (
                      <div>
                        <span className="text-xs font-mono text-muted-foreground">ABILITY</span>
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
                      {isSubmitting ? 'Saving...' : 'Save & Preview →'}
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
