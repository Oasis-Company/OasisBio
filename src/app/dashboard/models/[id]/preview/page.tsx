'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';
import { useAuth } from '@/lib/auth.client';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import NavigationBar from '@/components/navigation/NavigationBar';

const ModelViewer = dynamic(() => import('@/components/ModelViewer').then(mod => mod.ModelViewer), { ssr: false });

interface Model {
  id: string;
  name: string;
  filePath: string;
  previewImage: string | null;
  relatedWorldId: string | null;
  relatedEraId: string | null;
  createdAt: string;
}

export default function ModelPreviewPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const params = useParams();
  const modelId = params.id as string;
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }

    const fetchModel = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/models/${modelId}`);
        if (!response.ok) {
          if (response.status === 404) {
            setError('Model not found');
          } else {
            throw new Error('Failed to fetch model');
          }
          return;
        }
        const data = await response.json();
        setModel(data);
      } catch (err) {
        setError('Failed to load model');
        console.error('Error fetching model:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModel();
  }, [user, router, modelId]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <NavigationBar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-6 md:p-8">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !model) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <NavigationBar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-6 md:p-8">
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error || 'Model not found'}</p>
              <Button onClick={() => router.push('/dashboard/models')}>
                Back to Models
              </Button>
            </div>
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
            <div className="mb-8">
              <Button 
                variant="ghost" 
                onClick={() => router.push('/dashboard/models')}
                className="mb-4"
              >
                ← Back to Models
              </Button>
              <h1 className="text-3xl font-display font-bold mb-2">{model.name}</h1>
              <p className="text-muted-foreground">
                Uploaded: {new Date(model.createdAt).toLocaleDateString()}
              </p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-2/3">
                    <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                      <ModelViewer
                        modelPath={model.filePath}
                        mtlPath=""
                        texturePath=""
                        width={800}
                        height={600}
                      />
                    </div>
                  </div>
                  <div className="lg:w-1/3 space-y-6">
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">MODEL</div>
                      <p className="font-medium">{model.name}</p>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">FILE</div>
                      <p className="font-medium">{model.filePath.split('.').pop()?.toUpperCase() || 'GLB'}</p>
                    </div>
                    {model.relatedWorldId && (
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">WORLD</div>
                        <p className="font-medium">{model.relatedWorldId}</p>
                      </div>
                    )}
                    {model.relatedEraId && (
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">ERA</div>
                        <p className="font-medium">{model.relatedEraId}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm">Rotate</Button>
                      <Button size="sm">Zoom</Button>
                      <Button size="sm">Reset</Button>
                    </div>
                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={async () => {
                          if (confirm('Are you sure you want to delete this model?')) {
                            try {
                              const response = await fetch(`/api/models/${model.id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                router.push('/dashboard/models');
                              }
                            } catch (err) {
                              console.error('Error deleting model:', err);
                            }
                          }
                        }}
                      >
                        Delete Model
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
