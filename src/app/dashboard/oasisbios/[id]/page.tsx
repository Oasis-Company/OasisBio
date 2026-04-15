'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth.client';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import NavigationBar from '@/components/navigation/NavigationBar';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

interface OasisBio {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  summary: string | null;
  identityMode: string;
  birthDate: string | null;
  gender: string | null;
  pronouns: string | null;
  placeOfOrigin: string | null;
  currentEra: string | null;
  species: string | null;
  status: string;
  description: string | null;
  visibility: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function OasisBioEditPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bioId = params.id as string;
  const { success, error: toastError } = useToast();

  const [bio, setBio] = useState<OasisBio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    summary: '',
    identityMode: 'real',
    birthDate: '',
    gender: '',
    pronouns: '',
    placeOfOrigin: '',
    currentEra: '',
    species: '',
    status: '',
    description: '',
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }
    fetchBio();
  }, [user, bioId]);

  const fetchBio = async () => {
    try {
      const res = await fetch(`/api/oasisbios/${bioId}`);
      if (!res.ok) {
        if (res.status === 404) router.push('/dashboard/oasisbios');
        return;
      }
      const data = await res.json();
      setBio(data);
      setFormData({
        title: data.title ?? '',
        tagline: data.tagline ?? '',
        summary: data.summary ?? '',
        identityMode: data.identityMode ?? 'real',
        birthDate: data.birthDate ? data.birthDate.split('T')[0] : '',
        gender: data.gender ?? '',
        pronouns: data.pronouns ?? '',
        placeOfOrigin: data.placeOfOrigin ?? '',
        currentEra: data.currentEra ?? '',
        species: data.species ?? '',
        status: data.status ?? '',
        description: data.description ?? '',
      });
    } catch {
      toastError('Failed to load character');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/oasisbios/${bioId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Save failed');
      const updated = await res.json();
      setBio(updated);
      success('Saved');
    } catch {
      toastError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/oasisbios/${bioId}/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visibility: 'public' }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error?.message ?? 'Publish failed');
      setBio(prev => prev ? { ...prev, visibility: 'public', publishedAt: data.publishedAt } : prev);
      success('Published — your character is now public');
    } catch (e: any) {
      toastError(e.message ?? 'Publish failed');
    } finally {
      setPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    setPublishing(true);
    try {
      const res = await fetch(`/api/oasisbios/${bioId}/publish`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error('Unpublish failed');
      setBio(prev => prev ? { ...prev, visibility: 'private', publishedAt: null } : prev);
      success('Unpublished');
    } catch {
      toastError('Unpublish failed');
    } finally {
      setPublishing(false);
    }
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

  if (!bio) return null;

  const isPublished = bio.visibility === 'public';

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  <Link href="/dashboard/oasisbios" className="hover:underline">My OasisBios</Link>
                  {' / '}
                  <span>{bio.title}</span>
                </div>
                <h1 className="text-3xl font-display font-bold">{bio.title}</h1>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {isPublished ? 'PUBLIC' : 'PRIVATE'}
                  </span>
                  {isPublished && (
                    <a
                      href={`/bio/${bio.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline font-mono"
                    >
                      /bio/{bio.slug} ↗
                    </a>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {isPublished ? (
                  <Button variant="outline" onClick={handleUnpublish} disabled={publishing}>
                    {publishing ? 'Working...' : 'Unpublish'}
                  </Button>
                ) : (
                  <Button onClick={handlePublish} disabled={publishing}>
                    {publishing ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {/* Sub-navigation */}
            <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
              {[
                { label: 'Identity', href: `/dashboard/oasisbios/${bioId}` },
                { label: 'Eras', href: `/dashboard/oasisbios/${bioId}/eras` },
                { label: 'Abilities', href: `/dashboard/oasisbios/${bioId}/abilities` },
                { label: 'Worlds', href: `/dashboard/oasisbios/${bioId}/worlds` },
                { label: 'DCOS', href: `/dashboard/oasisbios/${bioId}/dcos` },
                { label: 'References', href: `/dashboard/oasisbios/${bioId}/references` },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    href === `/dashboard/oasisbios/${bioId}`
                      ? 'bg-black text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Form */}
            <div className="space-y-6">
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Basic Identity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Character Name *</label>
                      <Input
                        value={formData.title}
                        onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                        placeholder="Character name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Identity Mode</label>
                      <select
                        value={formData.identityMode}
                        onChange={e => setFormData(p => ({ ...p, identityMode: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {['real', 'fictional', 'hybrid', 'future', 'alternate'].map(m => (
                          <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Tagline</label>
                    <Input
                      value={formData.tagline}
                      onChange={e => setFormData(p => ({ ...p, tagline: e.target.value }))}
                      placeholder="One-line description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Summary</label>
                    <textarea
                      value={formData.summary}
                      onChange={e => setFormData(p => ({ ...p, summary: e.target.value }))}
                      placeholder="Brief summary of this identity"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                      placeholder="Full description"
                      rows={5}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Birth Date</label>
                      <Input
                        type="date"
                        value={formData.birthDate}
                        onChange={e => setFormData(p => ({ ...p, birthDate: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Gender</label>
                      <Input
                        value={formData.gender}
                        onChange={e => setFormData(p => ({ ...p, gender: e.target.value }))}
                        placeholder="Gender"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Pronouns</label>
                      <Input
                        value={formData.pronouns}
                        onChange={e => setFormData(p => ({ ...p, pronouns: e.target.value }))}
                        placeholder="they/them"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Place of Origin</label>
                      <Input
                        value={formData.placeOfOrigin}
                        onChange={e => setFormData(p => ({ ...p, placeOfOrigin: e.target.value }))}
                        placeholder="Origin"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Species</label>
                      <select
                        value={formData.species}
                        onChange={e => setFormData(p => ({ ...p, species: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select species</option>
                        {['human', 'synthetic', 'ai', 'unknown', 'hybrid'].map(s => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Era</label>
                      <Input
                        value={formData.currentEra}
                        onChange={e => setFormData(p => ({ ...p, currentEra: e.target.value }))}
                        placeholder="Current era name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3 pb-8">
                {isPublished ? (
                  <Button variant="outline" onClick={handleUnpublish} disabled={publishing}>
                    {publishing ? 'Working...' : 'Unpublish'}
                  </Button>
                ) : (
                  <Button onClick={handlePublish} disabled={publishing}>
                    {publishing ? 'Publishing...' : 'Publish'}
                  </Button>
                )}
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
