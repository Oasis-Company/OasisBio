'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';

// Mock data for models
const initialModels = [
  {
    id: 1,
    name: 'Oasis Prime',
    objUrl: '/models/oasis-prime.obj',
    mtlUrl: '/models/oasis-prime.mtl' as string | null,
    previewImage: 'https://via.placeholder.com/300x300?text=Oasis+Prime',
    relatedWorldId: null as number | null,
    relatedEraId: null as number | null,
    uploadedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 2,
    name: 'Future Self',
    objUrl: '/models/future-self.obj',
    mtlUrl: '/models/future-self.mtl' as string | null,
    previewImage: 'https://via.placeholder.com/300x300?text=Future+Self',
    relatedWorldId: 1 as number | null,
    relatedEraId: 2 as number | null,
    uploadedAt: '2024-01-16T14:00:00Z',
  },
];

export default function ModelsPage() {
  const [models, setModels] = useState(initialModels);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    file: null as File | null,
    mtlFile: null as File | null,
    relatedWorldId: null as number | null,
    relatedEraId: null as number | null,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mtlFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewModel({ ...newModel, file: e.target.files[0] });
    }
  };

  const handleMtlFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewModel({ ...newModel, mtlFile: e.target.files[0] });
    }
  };

  const handleUploadModel = () => {
    if (newModel.name && newModel.file) {
      // In a real implementation, this would upload the files to a server
      // For now, we'll just add a mock model
      const model = {
        id: models.length + 1,
        name: newModel.name,
        objUrl: `/models/${newModel.name.toLowerCase().replace(/\s+/g, '-')}.obj`,
        mtlUrl: newModel.mtlFile ? `/models/${newModel.name.toLowerCase().replace(/\s+/g, '-')}.mtl` : null,
        previewImage: 'https://via.placeholder.com/300x300?text=' + newModel.name.replace(/\s+/g, '+'),
        relatedWorldId: newModel.relatedWorldId,
        relatedEraId: newModel.relatedEraId,
        uploadedAt: new Date().toISOString(),
      };
      setModels([...models, model]);
      setNewModel({
        name: '',
        file: null,
        mtlFile: null,
        relatedWorldId: null,
        relatedEraId: null,
      });
      setShowUploadForm(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (mtlFileInputRef.current) mtlFileInputRef.current.value = '';
    }
  };

  const handleDeleteModel = (id: number) => {
    setModels(models.filter(model => model.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Model Manager</h1>
            <p className="text-gray-600">Upload and manage your 3D models</p>
          </div>
          <Button onClick={() => setShowUploadForm(!showUploadForm)}>
            {showUploadForm ? 'Cancel' : 'Upload New Model'}
          </Button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Upload New Model</CardTitle>
              <CardDescription>Upload OBJ files and associated materials</CardDescription>
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
                <label className="block text-sm font-medium mb-1">OBJ File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input 
                    type="file" 
                    accept=".obj" 
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    id="obj-file"
                  />
                  <label htmlFor="obj-file" className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-black">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      OBJ files only
                    </p>
                  </label>
                  {newModel.file && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {newModel.file.name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">MTL File (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <input 
                    type="file" 
                    accept=".mtl" 
                    onChange={handleMtlFileChange}
                    ref={mtlFileInputRef}
                    className="hidden"
                    id="mtl-file"
                  />
                  <label htmlFor="mtl-file" className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-medium text-black">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      MTL files only (optional)
                    </p>
                  </label>
                  {newModel.mtlFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      Selected: {newModel.mtlFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Related World</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newModel.relatedWorldId || ''}
                    onChange={(e) => setNewModel({ ...newModel, relatedWorldId: e.target.value ? parseInt(e.target.value) : null })}
                  >
                    <option value="">None</option>
                    <option value="1">Neon Desert</option>
                    <option value="2">Archive City</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Related Era</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newModel.relatedEraId || ''}
                    onChange={(e) => setNewModel({ ...newModel, relatedEraId: e.target.value ? parseInt(e.target.value) : null })}
                  >
                    <option value="">None</option>
                    <option value="1">Past</option>
                    <option value="2">Present</option>
                    <option value="3">Future</option>
                  </select>
                </div>
              </div>
              <Button onClick={handleUploadModel} className="mt-2">
                Upload Model
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Model Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map(model => (
            <Card key={model.id} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <CardDescription>Uploaded: {new Date(model.uploadedAt).toLocaleDateString()}</CardDescription>
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
                    <img 
                      src={model.previewImage} 
                      alt={model.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">OBJ File</span>
                    <span className="text-sm text-gray-600">{model.objUrl.split('/').pop()}</span>
                  </div>
                  {model.mtlUrl && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">MTL File</span>
                      <span className="text-sm text-gray-600">{model.mtlUrl.split('/').pop()}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 mb-4">
                  {model.relatedWorldId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Related World</span>
                      <span className="text-sm text-gray-600">
                        {model.relatedWorldId === 1 ? 'Neon Desert' : 'Archive City'}
                      </span>
                    </div>
                  )}
                  {model.relatedEraId && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Related Era</span>
                      <span className="text-sm text-gray-600">
                        {model.relatedEraId === 1 ? 'Past' : model.relatedEraId === 2 ? 'Present' : 'Future'}
                      </span>
                    </div>
                  )}
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
      </div>
    </div>
  );
}