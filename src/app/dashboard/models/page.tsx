'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';
import { useAuth } from '@/lib/auth.client';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/navigation/NavigationBar';
import { ModelUpload, ModelPreviewUpload } from '@/components/FileUpload';

interface Model {
  id: string;
  name: string;
  filePath: string;
  previewImage: string | null;
  relatedWorldId: string | null;
  relatedEraId: string | null;
  createdAt: string;
}

export default function ModelsPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    modelUrl: '',
    previewUrl: '',
    relatedWorldId: '',
    relatedEraId: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchModels = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/models');
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError('Failed to load models');
        console.error('Error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [user, router]);

  if (!user) {
    return null;
  }

  const handleModelUpload = (url: string) => {
    setNewModel({ ...newModel, modelUrl: url });
  };

  const handlePreviewUpload = (url: string) => {
    setNewModel({ ...newModel, previewUrl: url });
  };

  const handleUploadModel = async () => {
    if (newModel.name && newModel.modelUrl) {
      try {
        const response = await fetch('/api/models', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newModel.name,
            filePath: newModel.modelUrl,
            previewImage: newModel.previewUrl || null,
            relatedWorldId: newModel.relatedWorldId || null,
            relatedEraId: newModel.relatedEraId || null,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to upload model');
        }

        const uploadedModel = await response.json();
        setModels([...models, uploadedModel]);
        setNewModel({
          name: '',
          modelUrl: '',
          previewUrl: '',
          relatedWorldId: '',
          relatedEraId: '',
        });
        setShowUploadForm(false);
      } catch (err) {
        setError('Failed to upload model');
        console.error('Error uploading model:', err);
      }
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      const response = await fetch(`/api/models/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete model');
      }

      setModels(models.filter(model => model.id !== id));
    } catch (err) {
      setError('Failed to delete model');
      console.error('Error deleting model:', err);
    }
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <NavigationBar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-6 md:p-8">
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-display font-bold mb-2">Model Manager</h1>
                <p className="text-muted-foreground">Upload and manage your 3D models</p>
              </div>
              <Button onClick={() => setShowUploadForm(!showUploadForm)}>
                {showUploadForm ? 'Cancel' : 'Upload New Model'}
              </Button>
            </div>

            {showUploadForm && (
              <Card className="mb-8 border-0 shadow-sm">
                <CardHeader>
                  <CardTitle>Upload New Model</CardTitle>
                  <CardDescription>Upload GLB files and preview images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Model Name</label>
                    <Input 
                      value={newModel.name} 
                      onChange={(e) => setNewModel({ ...newModel, name: e.target.value })} 
                      placeholder="e.g., Oasis Prime"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">3D Model (GLB)</label>
                    <ModelUpload 
                        userId={user.id}
                        characterId="models"
                        onSuccess={handleModelUpload}
                        onError={(error) => console.error('Model upload error:', error)}
                      />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Model Preview (Image)</label>
                    <ModelPreviewUpload 
                      userId={user.id}
                      characterId="models"
                      onSuccess={handlePreviewUpload}
                      onError={(error) => console.error('Preview upload error:', error)}
                    />
                  </div>
                  <Button onClick={handleUploadModel} className="mt-2">
                    Upload Model
                  </Button>
                </CardContent>
              </Card>
            )}

            {models.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Models Yet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    You haven't uploaded any models yet. Start by uploading your first one.
                  </p>
                  <Button className="mt-4" onClick={() => setShowUploadForm(true)}>
                    Upload First Model
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map(model => (
                  <Card key={model.id} className="border-0 shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{model.name}</CardTitle>
                          <CardDescription>Uploaded: {new Date(model.createdAt).toLocaleDateString()}</CardDescription>
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteModel(model.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                          {model.previewImage ? (
                            <img 
                              src={model.previewImage} 
                              alt={model.name} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-muted-foreground">No preview</span>
                          )}
                        </div>
                      </div>
                      <Button asChild size="sm" className="w-full">
                        <a href={`/dashboard/models/${model.id}/preview`}>
                          Preview Model
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
