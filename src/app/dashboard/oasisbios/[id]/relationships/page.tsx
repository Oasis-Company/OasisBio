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

interface Relationship {
  id: string;
  characterAId: string;
  characterBId: string;
  relationType: string;
  description: string | null;
  targetCharacter: {
    id: string;
    title: string;
    slug: string;
    visibility: string;
  };
  createdAt: string;
}

interface AvailableCharacter {
  id: string;
  title: string;
  slug: string;
  visibility: string;
}

const RELATION_TYPES = [
  'ally',
  'rival',
  'family',
  'friend',
  'mentor',
  'student',
  'colleague',
  'enemy',
  'partner',
  'acquaintance',
];

export default function RelationshipsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const bioId = params.id as string;
  const { success, error: toastError } = useToast();

  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [availableCharacters, setAvailableCharacters] = useState<AvailableCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRelationship, setNewRelationship] = useState({
    characterBId: '',
    relationType: 'friend',
    description: '',
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const fetchRelationships = async () => {
    try {
      const res = await fetch(`/api/oasisbios/${bioId}/relationships`);
      if (!res.ok) {
        if (res.status === 404) router.push('/dashboard/oasisbios');
        return;
      }
      const data = await res.json();
      setRelationships(data);
    } catch (err) {
      toastError('Failed to load relationships');
    }
  };

  const fetchAvailableCharacters = async () => {
    try {
      const res = await fetch('/api/oasisbios/public');
      if (!res.ok) return;
      const { data } = await res.json();
      setAvailableCharacters(data.filter((c: AvailableCharacter) => c.id !== bioId));
    } catch (err) {
      console.error('Failed to load available characters');
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    Promise.all([fetchRelationships(), fetchAvailableCharacters()]).finally(() => {
      setLoading(false);
    });
  }, [user, bioId]);

  const handleAddRelationship = async () => {
    if (!newRelationship.characterBId) {
      toastError('Please select a character');
      return;
    }

    try {
      const res = await fetch(`/api/oasisbios/${bioId}/relationships`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRelationship),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message ?? 'Failed to create relationship');
      }

      const data = await res.json();
      setRelationships(prev => [data, ...prev]);
      setNewRelationship({ characterBId: '', relationType: 'friend', description: '' });
      setShowAddModal(false);
      success('Relationship created');
    } catch (e: any) {
      toastError(e.message ?? 'Failed to create relationship');
    }
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    if (!confirm('Are you sure you want to delete this relationship?')) return;

    try {
      const res = await fetch(`/api/oasisbios/${bioId}/relationships?relationshipId=${relationshipId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message ?? 'Failed to delete relationship');
      }

      setRelationships(prev => prev.filter(r => r.id !== relationshipId));
      success('Relationship deleted');
    } catch (e: any) {
      toastError(e.message ?? 'Failed to delete relationship');
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

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <NavigationBar user={user} onLogout={handleLogout} />

        <div className="flex-1 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">
                  <Link href="/dashboard/oasisbios" className="hover:underline">My OasisBios</Link>
                  {' / '}
                  <Link href={`/dashboard/oasisbios/${bioId}`} className="hover:underline">Character</Link>
                  {' / Relationships'}
                </div>
                <h1 className="text-3xl font-display font-bold">Relationships</h1>
              </div>
              <Button onClick={() => setShowAddModal(true)}>Add Relationship</Button>
            </div>

            <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
              {[
                { label: 'Identity', href: `/dashboard/oasisbios/${bioId}` },
                { label: 'Eras', href: `/dashboard/oasisbios/${bioId}/eras` },
                { label: 'Abilities', href: `/dashboard/oasisbios/${bioId}/abilities` },
                { label: 'Worlds', href: `/dashboard/oasisbios/${bioId}/worlds` },
                { label: 'DCOS', href: `/dashboard/oasisbios/${bioId}/dcos` },
                { label: 'References', href: `/dashboard/oasisbios/${bioId}/references` },
                { label: 'Relationships', href: `/dashboard/oasisbios/${bioId}/relationships` },
              ].map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                    href === `/dashboard/oasisbios/${bioId}/relationships`
                      ? 'bg-black text-white'
                      : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {relationships.length === 0 ? (
              <Card variant="outlined" className="text-center py-16">
                <CardContent>
                  <p className="text-muted-foreground mb-4">No relationships yet.</p>
                  <Button onClick={() => setShowAddModal(true)}>Add Your First Relationship</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {relationships.map(relationship => (
                  <Card key={relationship.id} variant="outlined">
                    <CardContent className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <span className={`text-xs px-2 py-1 rounded-full font-mono ${
                            relationship.targetCharacter.visibility === 'public'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {relationship.targetCharacter.visibility.toUpperCase()}
                          </span>
                          <h3 className="text-lg font-bold">{relationship.targetCharacter.title}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {relationship.relationType}
                            {relationship.description && `: ${relationship.description}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                        >
                          <a
                            href={`/bio/${relationship.targetCharacter.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Profile
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteRelationship(relationship.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add Relationship</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Select Character</label>
                  <select
                    value={newRelationship.characterBId}
                    onChange={e => setNewRelationship(p => ({ ...p, characterBId: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a character</option>
                    {availableCharacters.map(char => (
                      <option key={char.id} value={char.id}>
                        {char.title} ({char.visibility})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Relationship Type</label>
                  <select
                    value={newRelationship.relationType}
                    onChange={e => setNewRelationship(p => ({ ...p, relationType: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {RELATION_TYPES.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description (optional)</label>
                  <Input
                    value={newRelationship.description}
                    onChange={e => setNewRelationship(p => ({ ...p, description: e.target.value }))}
                    placeholder="Describe this relationship"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddRelationship}>
                    Add Relationship
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}