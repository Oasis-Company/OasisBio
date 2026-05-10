'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth.client';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

// ==================== Types ====================

interface NuwaRun {
  runId: string;
  status: string;
  mode: string;
  sourcePolicy: string;
  scopes: string[];
  snapshotHash?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  suggestionCount: number;
}

interface NuwaSuggestionItem {
  id: string;
  scope: string;
  operation: string;
  targetId?: string;
  title?: string;
  payload: Record<string, unknown>;
  rationale?: string;
  confidence?: number;
  evidence?: Array<{ kind: string; label: string; snippet: string; confidence: string }>;
  decision: string;
  createdEntityId?: string;
  appliedAt?: string;
}

interface NuwaRunDetail extends NuwaRun {
  items: NuwaSuggestionItem[];
  summary?: Record<string, number>;
}

const SCOPE_OPTIONS = [
  { value: 'description', label: 'Description' },
  { value: 'abilities', label: 'Abilities' },
  { value: 'eras', label: 'Eras' },
  { value: 'worlds', label: 'Worlds' },
  { value: 'references', label: 'References' },
  { value: 'dcos', label: 'DCOS Analysis' },
];

const STATUS_COLORS: Record<string, string> = {
  queued: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700 animate-pulse',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  canceled: 'bg-gray-100 text-gray-600',
};

const SCOPE_BADGE_COLORS: Record<string, string> = {
  description: 'bg-purple-100 text-purple-700',
  ability: 'bg-blue-100 text-blue-700',
  era: 'bg-emerald-100 text-emerald-700',
  world: 'bg-orange-100 text-orange-700',
  reference: 'bg-pink-100 text-pink-700',
  dcos: 'bg-cyan-100 text-cyan-700',
};

// Dcos sub-type icons for cognitive framework suggestions
const DCOS_TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  mental_model: { icon: '🧠', label: 'Mental Model', color: 'text-violet-600' },
  decision_heuristic: { icon: '⚡', label: 'Decision Heuristic', color: 'text-amber-600' },
  anti_pattern: { icon: '🚫', label: 'Anti-Pattern', color: 'text-red-500' },
  tension: { icon: '⚖️', label: 'Tension', color: 'text-blue-600' },
  honest_limit: { icon: '❓', label: 'Knowledge Boundary', color: 'text-gray-500' },
  expression_dna: { icon: '🎭', label: 'Expression DNA', color: 'text-fuchsia-600' },
};

// ==================== Sub Navigation ====================

function SubNav({ bioId, active }: { bioId: string; active: boolean }) {
  const tabs = [
    { label: 'Identity', href: `/dashboard/oasisbios/${bioId}` },
    { label: 'Eras', href: `/dashboard/oasisbios/${bioId}/eras` },
    { label: 'Abilities', href: `/dashboard/oasisbios/${bioId}/abilities` },
    { label: 'Worlds', href: `/dashboard/oasisbios/${bioId}/worlds` },
    { label: 'DCOS', href: `/dashboard/oasisbios/${bioId}/dcos` },
    { label: 'References', href: `/dashboard/oasisbios/${bioId}/references` },
    { label: 'Nuwa', href: `/dashboard/oasisbios/${bioId}/nuwa` },
  ];

  return (
    <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
      {tabs.map(({ label, href }) => (
        <Link
          key={label}
          href={href}
          className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
            (href === `/dashboard/oasisbios/${bioId}` && label === 'Identity' && !active)
              ? 'bg-black text-white'
              : label === 'Nuwa' && active
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          {label === 'Nuwa' ? 'Nuwa' : label}
        </Link>
      ))}
    </div>
  );
}

// ==================== Main Component ====================

export default function NuwaWorkspacePage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bioId = params.id as string;
  const { success, error: toastError } = useToast();

  // State
  const [runs, setRuns] = useState<NuwaRun[]>([]);
  const [activeRun, setActiveRun] = useState<NuwaRunDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [applying, setApplying] = useState(false);

  // New run form state
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['description']);
  const [mode, setMode] = useState<'quick' | 'deep'>('quick');
  const [forceRefresh, setForceRefresh] = useState(false);

  // Polling ref
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  // Fetch runs list
  const fetchRuns = useCallback(async () => {
    try {
      const res = await fetch(`/api/oasisbios/${bioId}/nuwa/runs`);
      if (!res.ok) {
        if (res.status === 404) router.push('/dashboard/oasisbios');
        return;
      }
      const data = await res.json();
      setRuns(data.runs ?? []);
    } catch {
      toastError('Failed to load Nuwa runs');
    }
  }, [bioId, router, toastError]);

  // Fetch single run detail
  const fetchRunDetail = useCallback(async (runId: string) => {
    try {
      const res = await fetch(`/api/nuwa/runs/${runId}`);
      if (!res.ok) return;
      const data: NuwaRunDetail = await res.json();
      setActiveRun(data);

      // If still processing, keep polling
      if (data.status === 'processing' || data.status === 'queued') {
        pollRef.current = setTimeout(() => fetchRunDetail(runId), 3000);
      }

      return data;
    } catch {
      toastError('Failed to load run details');
      return null;
    }
  }, [toastError]);

  // Initial load
  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }
    fetchRuns().finally(() => setLoading(false));
  }, [user, bioId, fetchRuns, router]);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearTimeout(pollRef.current);
    };
  }, []);

  // Start a new distillation run
  const handleStartRun = async () => {
    if (selectedScopes.length === 0) {
      toastError('Select at least one scope');
      return;
    }

    setRunning(true);
    try {
      const res = await fetch(`/api/oasisbios/${bioId}/nuwa/runs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          scopes: selectedScopes,
          forceRefresh,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to start distillation');
      }

      if (data.cacheHit) {
        success('Loaded cached result');
        await fetchRunDetail(data.runId);
      } else {
        success('Distillation started — this may take 30-60 seconds');
        // Start polling for the new run
        setTimeout(() => fetchRunDetail(data.runId), 2000);
      }

      await fetchRuns();
    } catch (e: any) {
      toastError(e.message || 'Failed to start distillation');
    } finally {
      setRunning(false);
    }
  };

  // Select a run and load its details
  const handleSelectRun = async (run: NuwaRun) => {
    if (pollRef.current) clearTimeout(pollRef.current);
    setActiveRun(null); // Clear previous while loading
    await fetchRunDetail(run.runId);
  };

  // Apply suggestions
  const handleApplySuggestions = async (itemIds: string[]) => {
    setApplying(true);
    try {
      const res = await fetch(`/api/nuwa/runs/${activeRun!.runId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds }),
      });

      if (!res.ok) throw new Error('Apply failed');

      const result = await res.json();
      const appliedCount = result.applied?.length ?? 0;
      success(`${appliedCount} suggestion(s) applied`);

      // Refresh the run detail
      await fetchRunDetail(activeRun!.runId);
    } catch {
      toastError('Failed to apply suggestions');
    } finally {
      setApplying(false);
    }
  };

  // Reject suggestions
  const handleRejectSuggestions = async (itemIds: string[]) => {
    try {
      const res = await fetch(`/api/nuwa/runs/${activeRun!.runId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIds }),
      });

      if (!res.ok) throw new Error('Reject failed');

      success('Suggestions rejected');
      await fetchRunDetail(activeRun!.runId);
    } catch {
      toastError('Failed to reject suggestions');
    }
  };

  // Toggle scope selection
  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <NavigationBar user={user} onLogout={handleLogout} />
          <div className="flex-1 flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-6xl mx-auto">

            {/* Header */}
            <div className="mb-6">
              <div className="text-sm text-muted-foreground mb-1">
                <Link href="/dashboard/oasisbios" className="hover:underline">My OasisBios</Link>
                {' / '}
                <span>Nuwa Workspace</span>
              </div>
              <h1 className="text-3xl font-display font-bold flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </span>
                Nuwa Workspace
              </h1>
              <p className="text-muted-foreground mt-1">AI-powered character deepening via cognitive framework distillation</p>
            </div>

            <SubNav bioId={bioId} active />

            {/* New Run Form */}
            <Card variant="outlined" className="mb-8">
              <CardHeader>
                <CardTitle>Start New Distillation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Scope Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Target Scopes</label>
                    <div className="flex flex-wrap gap-2">
                      {SCOPE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => toggleScope(opt.value)}
                          className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                            selectedScopes.includes(opt.value)
                              ? 'border-purple-500 bg-purple-50 text-purple-700'
                              : 'border-border text-muted-foreground hover:border-gray-400'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mode Selection */}
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Mode:</label>
                      <div className="flex gap-1 bg-muted rounded-md p-0.5">
                        {(['quick', 'deep'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`px-3 py-1 text-sm rounded-md transition-all capitalize ${
                              mode === m
                                ? 'bg-background shadow-sm font-medium'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer ml-auto">
                      <input
                        type="checkbox"
                        checked={forceRefresh}
                        onChange={(e) => setForceRefresh(e.target.checked)}
                        className="rounded border-border"
                      />
                      Force refresh (ignore cache)
                    </label>
                  </div>

                  {/* Start Button */}
                  <Button
                    onClick={handleStartRun}
                    disabled={running || selectedScopes.length === 0}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {running ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Starting Distillation...
                      </>
                    ) : (
                      <>
                        Run Distillation ({mode})
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Two-column layout: Runs List + Active Detail */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left: Runs History */}
              <div className="lg:col-span-1">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="text-lg">History</CardTitle>
                    <p className="text-xs text-muted-foreground">{runs.length} run(s)</p>
                  </CardHeader>
                  <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                    {runs.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No distillations yet. Start your first run above.
                      </p>
                    ) : (
                      runs.map((run) => (
                        <button
                          key={run.runId}
                          onClick={() => handleSelectRun(run)}
                          className={`w-full text-left p-3 rounded-lg border transition-all ${
                            activeRun?.runId === run.runId
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-border hover:border-gray-300 hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${STATUS_COLORS[run.status] ?? 'bg-gray-100'}`}>
                              {run.status}
                            </span>
                            <span className="text-xs text-muted-foreground">{run.mode}</span>
                          </div>
                          <div className="text-sm font-medium truncate">{run.scopes.join(', ')}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(run.createdAt).toLocaleString()}
                            {run.suggestionCount > 0 && ` · ${run.suggestionCount} suggestions`}
                          </div>
                        </button>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Active Run Detail */}
              <div className="lg:col-span-2">
                {!activeRun ? (
                  <Card variant="outlined">
                    <CardContent className="py-16 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <p className="text-muted-foreground font-medium mb-1">No Run Selected</p>
                      <p className="text-sm text-muted-foreground">Select a run from history or start a new distillation</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">

                    {/* Run Summary Bar */}
                    <Card variant="outlined">
                      <CardContent className="py-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${STATUS_COLORS[activeRun.status] ?? ''}`}>
                              {activeRun.status.toUpperCase()}
                            </span>
                            <span className="text-sm text-muted-foreground">{activeRun.mode} mode</span>
                          </div>
                          {activeRun.summary && (
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {Object.entries(activeRun.summary).map(([key, val]) => (
                                val > 0 && (
                                  <span key={key} className="px-2 py-0.5 bg-muted rounded-full">
                                    {key}: {val}
                                  </span>
                                )
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {(activeRun.status === 'processing' || activeRun.status === 'queued') ? (
                      /* Processing State */
                      <Card variant="outlined">
                        <CardContent className="py-16 text-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
                          <p className="font-medium mb-1">Distilling Character Framework...</p>
                          <p className="text-sm text-muted-foreground">
                            Analyzing mental models, decision heuristics, expression DNA — this typically takes 30-60s
                          </p>
                        </CardContent>
                      </Card>
                    ) : activeRun.status === 'failed' ? (
                      /* Failed State */
                      <Card variant="outlined" className="border-red-200">
                        <CardContent className="py-8 text-center">
                          <p className="text-red-600 font-medium">Distillation Failed</p>
                          <p className="text-sm text-muted-foreground mt-1">Check server logs or try again with different settings</p>
                        </CardContent>
                      </Card>
                    ) : (
                      /* Completed: Suggestions List */
                      <div className="space-y-3">
                        {/* Bulk Actions */}
                        {activeRun.items.some((i) => i.decision === 'pending') && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={applying}
                              onClick={() =>
                                handleApplySuggestions(
                                  activeRun.items.filter((i) => i.decision === 'pending').map((i) => i.id)
                                )
                              }
                            >
                              Accept All
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleRejectSuggestions(
                                  activeRun.items.filter((i) => i.decision === 'pending').map((i) => i.id)
                                )
                              }
                            >
                              Reject All
                            </Button>
                          </div>
                        )}

                        {activeRun.items.length === 0 ? (
                          <Card variant="outlined">
                            <CardContent className="py-8 text-center text-muted-foreground">
                              No suggestions generated for this run.
                            </CardContent>
                          </Card>
                        ) : (
                          activeRun.items.map((item) => (
                            <SuggestionCard
                              key={item.id}
                              item={item}
                              onApply={() => handleApplySuggestions([item.id])}
                              onReject={() => handleRejectSuggestions([item.id])}
                              applying={applying}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== Dcos Sub-type Renderers ====================

/** Collapsed preview for dcos suggestions — shows key info without JSON dump */
function DcosPreview({ type, payload }: { type: string; payload: Record<string, unknown> }) {
  switch (type) {
    case 'mental_model':
      return (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-violet-600">{(payload.name as string) || 'Unnamed'}</span>
          {' — '}{(payload.oneLiner as string) || ''}
        </p>
      );
    case 'decision_heuristic':
      return (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-amber-600">{(payload.name as string) || 'Unnamed'}</span>
          {' — '}{(payload.rule as string) || ''}
        </p>
      );
    case 'anti_pattern':
      return (
        <p className="text-sm text-red-500">
          Would never: {(payload.statement as string) || '(unspecified)'}
        </p>
      );
    case 'tension':
      return (
        <p className="text-sm text-blue-600">
          <span className="font-medium">{(payload.left as string) || ''}</span>
          {' vs '}
          <span className="font-medium">{(payload.right as string) || ''}</span>
        </p>
      );
    case 'honest_limit':
      return (
        <p className="text-sm text-gray-500 italic">
          Unknown: {(payload.statement as string) || '(unspecified boundary)'}
        </p>
      );
    case 'expression_dna': {
      const dna = payload as Record<string, unknown>;
      const vocab = (dna.vocabulary as string[]) ?? [];
      const sentenceStyle = typeof dna.sentenceStyle === 'string' ? dna.sentenceStyle : undefined;
      return (
        <div className="flex flex-wrap gap-1.5 items-center">
          {sentenceStyle && (
            <span className="text-xs bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 rounded-full">
              Style: {sentenceStyle}
            </span>
          )}
          {vocab.slice(0, 5).map((v: string, i: number) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {v}
            </span>
          ))}
          {vocab.length > 5 && (
            <span className="text-xs text-muted-foreground">+{vocab.length - 5} more</span>
          )}
        </div>
      );
    }
    default:
      return null;
  }
}

/** Expanded view for dcos suggestions — structured display instead of raw JSON */
function DcosExpandedView({ type, payload }: { type: string; payload: Record<string, unknown> }) {
  switch (type) {
    case 'mental_model': {
      const m = payload;
      const oneLiner = typeof m.oneLiner === 'string' ? m.oneLiner : undefined;
      const application = typeof m.application === 'string' ? m.application : undefined;
      const limitation = typeof m.limitation === 'string' ? m.limitation : undefined;
      return (
        <div className="space-y-2">
          <div><span className="font-medium text-violet-600">One-Liner:</span> {oneLiner}</div>
          {application && <div><span className="font-medium">Application:</span> {application}</div>}
          {limitation && <div><span className="font-medium text-red-400">Limitation:</span> {limitation}</div>}
        </div>
      );
    }
    case 'decision_heuristic': {
      const h = payload;
      const rule = typeof h.rule === 'string' ? h.rule : undefined;
      const scenario = typeof h.scenario === 'string' ? h.scenario : undefined;
      const example = typeof h.example === 'string' ? h.example : undefined;
      return (
        <div className="space-y-2">
          <div className="bg-amber-50 border border-amber-200 rounded p-2 font-medium text-amber-800">
            Rule: {rule}
          </div>
          {scenario && <div><span className="font-medium">Scenario:</span> {scenario}</div>}
          {example && <div><span className="font-medium">Example:</span> {example}</div>}
        </div>
      );
    }
    case 'anti_pattern':
      return (
        <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700">
          <span className="font-bold">Would NEVER:</span> {' '}{(payload.statement as string)}
        </div>
      );
    case 'tension': {
      const t = payload;
      const left = typeof t.left === 'string' ? t.left : undefined;
      const right = typeof t.right === 'string' ? t.right : undefined;
      const explanation = typeof t.explanation === 'string' ? t.explanation : undefined;
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-blue-50 rounded p-2 text-center font-medium text-blue-700">{left}</div>
            <div className="bg-indigo-50 rounded p-2 text-center font-medium text-indigo-700">{right}</div>
          </div>
          {explanation && <div><span className="font-medium">Why it creates depth:</span> {explanation}</div>}
        </div>
      );
    }
    case 'honest_limit':
      const statement = typeof payload.statement === 'string' ? payload.statement : undefined;
      return (
        <div className="bg-gray-100 rounded p-3 text-gray-600 italic">
          What we cannot know from available data: {statement}
        </div>
      );
    case 'expression_dna': {
      const d = payload;
      const vocab = (d.vocabulary as string[]) ?? [];
      const sentenceStyle = typeof d.sentenceStyle === 'string' ? d.sentenceStyle : undefined;
      const rhythm = typeof d.rhythm === 'string' ? d.rhythm : undefined;
      const humor = typeof d.humor === 'string' ? d.humor : undefined;
      const certaintyStyle = typeof d.certaintyStyle === 'string' ? d.certaintyStyle : undefined;
      const citationHabit = typeof d.citationHabit === 'string' ? d.citationHabit : undefined;
      return (
        <div className="space-y-1.5">
          {sentenceStyle && (
            <div className="flex justify-between"><span className="font-medium">Sentence Style</span><span>{sentenceStyle}</span></div>
          )}
          {rhythm && (
            <div className="flex justify-between"><span className="font-medium">Rhythm</span><span>{rhythm}</span></div>
          )}
          {humor && (
            <div className="flex justify-between"><span className="font-medium">Humor</span><span>{humor}</span></div>
          )}
          {certaintyStyle && (
            <div className="flex justify-between"><span className="font-medium">Certainty</span><span>{certaintyStyle}</span></div>
          )}
          {citationHabit && (
            <div className="flex justify-between"><span className="font-medium">Citation Habit</span><span>{citationHabit}</span></div>
          )}
          {vocab.length > 0 && (
            <div>
              <span className="font-medium">Vocabulary ({vocab.length}):</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {vocab.map((v: string, i: number) => (
                  <span key={i} className="bg-fuchsia-50 text-fuchsia-700 px-2 py-0.5 rounded text-xs">{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
    default:
      return (
        <pre className="whitespace-pre-wrap break-all text-muted-foreground">
          {JSON.stringify(payload, null, 2)}
        </pre>
      );
  }
}

function SuggestionCard({
  item,
  onApply,
  onReject,
  applying,
}: {
  item: NuwaSuggestionItem;
  onApply: () => void;
  onReject: () => void;
  applying: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const isAccepted = item.decision === 'accepted' || item.decision === 'applied';
  const isRejected = item.decision === 'rejected';
  const isPending = item.decision === 'pending';
  const isDcos = item.scope === 'dcos';
  const dcosType = isDcos ? (item.payload?.type as string) ?? null : null;
  const dcosConfig = dcosType ? DCOS_TYPE_CONFIG[dcosType] : null;

  return (
    <Card
      variant={isAccepted ? 'default' : isRejected ? undefined : 'outlined'}
      className={`${isAccepted ? 'border-green-200 bg-green-50/30' : isRejected ? 'opacity-60' : ''}`}
    >
      <CardContent className="py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${SCOPE_BADGE_COLORS[item.scope] ?? 'bg-gray-100'}`}>
                {item.scope}
              </span>
              {/* Dcos sub-type badge */}
              {dcosConfig && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${dcosConfig.color} bg-opacity-10 font-medium`}>
                  {dcosConfig.icon} {dcosConfig.label}
                </span>
              )}
              <span className="text-xs text-muted-foreground font-mono">{item.operation}</span>
              {item.confidence && (
                <span className="text-xs text-muted-foreground">
                  {Math.round(item.confidence * 100)}% confidence
                </span>
              )}
              {item.decision !== 'pending' && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                  isAccepted ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {item.decision}
                </span>
              )}
            </div>

            {/* Title */}
            {item.title && <h4 className="font-medium text-sm mb-1">{item.title}</h4>}

            {/* Dcos-specific rich rendering */}
            {isDcos && dcosType && !expanded && (
              <DcosPreview type={dcosType} payload={item.payload} />
            )}

            {/* Rationale (for non-dcos or when collapsed) */}
            {item.rationale && (!isDcos || !dcosConfig) && (
              <p className="text-sm text-muted-foreground line-clamp-2">{item.rationale}</p>
            )}

            {/* Expanded Payload */}
            {expanded && (
              <div className="mt-3 p-3 bg-muted/50 rounded-md text-xs space-y-3 max-h-72 overflow-y-auto">
                {isDcos && dcosType ? (
                  <DcosExpandedView type={dcosType} payload={item.payload} />
                ) : (
                  <>
                    <div>
                      <span className="font-medium text-foreground">Payload:</span>
                      <pre className="mt-1 whitespace-pre-wrap break-all text-muted-foreground">
                        {JSON.stringify(item.payload, null, 2)}
                      </pre>
                    </div>
                  </>
                )}
                {item.evidence && item.evidence.length > 0 && (
                  <div>
                    <span className="font-medium text-foreground">Evidence:</span>
                    <ul className="mt-1 space-y-1">
                      {item.evidence.slice(0, 3).map((ev, idx) => (
                        <li key={idx} className="text-muted-foreground">
                          [{ev.confidence}] {ev.label}: &ldquo;{ev.snippet.slice(0, 120)}...&rdquo;
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              title={expanded ? 'Collapse' : 'Expand'}
            >
              <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isPending && (
              <>
                <Button size="sm" variant="ghost" onClick={onApply} disabled={applying} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                  <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </Button>
                <Button size="sm" variant="ghost" onClick={onReject} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                  <svg className="w-4 h-4 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
