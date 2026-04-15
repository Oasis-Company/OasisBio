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

interface Era {
  id: string;
  name: string;
  eraType: string;
  description: string | null;
  startYear: number | null;
  endYear: number | null;
  sortOrder: number;
}

const ERA_TYPES = ['past', 'present', 'future', 'alternate', 'worldbound'];

const emptyForm = {
  name: '',
  eraType: 'present',
  description: '',
  startYear: '',
  endYear: '',
};

export default function ErasPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bioId = params.id as string;
  const { success, error: toastError } = useToast();

  const [eras, setEras] = useState<Era[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }
    fetchEras();
  }, [user, bioId]);

  const fetchEras = async () => {
    try {
      const res = await fetch(`/api/oasisbios/${bioId}/eras`);
      if (!res.ok) throw new Error();
      setEras(await res.json());
    } catch {
      toastError('Failed to load eras');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.eraType) {
      toastError('Name and type are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        eraType: form.eraType,
        description: form.description.trim() || null,
        startYear: form.startYear ? Number(form.startYear) : null,
        endYear: form.endYear ? Number(form.endYear) : null,
      };

      if (editingId) {
        const res = await fetch(`/api/eras/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setEras(prev => prev.map(e => e.id === editingId ? updated : e));
        success('Era updated');
      } else {
        const res = await fetch(`/api/oasisbios/${bioId}/eras`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setEras(prev => [...prev, created]);
        success('Era added');
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditingId(null);
    } catch {
      toastError('Failed to save era');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (era: Era) => {
    setForm({
      name: era.name,
      eraType: era.eraType,
      description: era.description ?? '',
      startYear: era.startYear?.toString() ?? '',
      endYear: era.endYear?.toString() ?? '',
    });
    setEditingId(era.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this era? This will also unlink any abilities and DCOS files.')) return;
    try {
      const res = await fetch(`/api/eras/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setEras(prev => prev.filter(e => e.id !== id));
      success('Era deleted');
    } catch {
      toastError('Failed to delete era');
    }
  };

  const cancelForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  if (!user) return null;

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
                  <Link href={`/dashboard/oasisbios/${bioId}`} className="hover:underline">Identity</Link>
                  {' / '}
                  <span>Eras</span>
                </div>
                <h1 className="text-3xl font-display font-bold">Era Timeline</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  Define the different time periods of this identity's existence.
                </p>
              </div>
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>+ Add Era</Button>
              )}
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
                    href === `/dashboard/oasisbios/${bioId}/eras`
                      ? 'bg-black text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Add / Edit Form */}
            {showForm && (
              <Card variant="outlined" className="mb-8">
                <CardHeader>
                  <CardTitle>{editingId ? 'Edit Era' : 'New Era'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name *</label>
                      <Input
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Childhood, Digital Awakening"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Type *</label>
                      <select
                        value={form.eraType}
                        onChange={e => setForm(p => ({ ...p, eraType: e.target.value }))}
                        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        {ERA_TYPES.map(t => (
                          <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Year</label>
                      <Input
                        type="number"
                        value={form.startYear}
                        onChange={e => setForm(p => ({ ...p, startYear: e.target.value }))}
                        placeholder="e.g. 2010"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">End Year</label>
                      <Input
                        type="number"
                        value={form.endYear}
                        onChange={e => setForm(p => ({ ...p, endYear: e.target.value }))}
                        placeholder="e.g. 2020 (leave blank if ongoing)"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                      value={form.description}
                      onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                      placeholder="What defines this era of your existence?"
                      rows={3}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button onClick={handleSubmit} disabled={saving}>
                      {saving ? 'Saving...' : editingId ? 'Update' : 'Add Era'}
                    </Button>
                    <Button variant="outline" onClick={cancelForm}>Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Era List */}
            {loading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-black" />
              </div>
            ) : eras.length === 0 ? (
              <Card variant="outlined">
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">No eras yet.</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Eras represent different chapters of this identity — past, present, future, or alternate timelines.
                  </p>
                  {!showForm && (
                    <Button onClick={() => setShowForm(true)}>Add First Era</Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

                <div className="space-y-6">
                  {eras.map((era, index) => (
                    <div key={era.id} className="flex gap-6 relative">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-mono z-10">
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      <Card variant="outlined" className="flex-1">
                        <CardContent className="p-5">
                          <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-lg">{era.name}</h3>
                                <span className="text-xs px-2 py-0.5 bg-muted rounded-full font-mono text-muted-foreground">
                                  {era.eraType}
                                </span>
                              </div>
                              {(era.startYear || era.endYear) && (
                                <p className="text-sm text-muted-foreground mb-2 font-mono">
                                  {era.startYear ?? '?'} — {era.endYear ?? 'present'}
                                </p>
                              )}
                              {era.description && (
                                <p className="text-sm text-muted-foreground">{era.description}</p>
                              )}
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button size="sm" variant="outline" onClick={() => handleEdit(era)}>
                                Edit
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDelete(era.id)}>
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
