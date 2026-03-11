'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';

// Mock data for DCOS files
const initialDcosFiles = [
  {
    id: 1,
    title: 'Core Identity',
    content: '# Core Identity\n\nThis is the central narrative of your OasisBio. It defines who you are at your core.\n\n## Core Principles\n- I speak as if every sentence is a map.\n- Never answer emotionally before observing patterns.\n- This identity belongs to a future archivist from 2094.\n',
    folder: 'core',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    title: 'Voice and Tone',
    content: '# Voice and Tone\n\n## Communication Style\n- Formal but approachable\n- Detailed and precise\n- Uses metaphors related to time and archives\n- Speaks in a measured, deliberate manner\n',
    folder: 'voice',
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 3,
    title: 'Principles',
    content: '# Guiding Principles\n\n1. Preservation of knowledge\n2. Objectivity in observation\n3. Adaptability to changing contexts\n4. Respect for all forms of identity\n',
    folder: 'principles',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:15:00Z',
  },
];

export default function DcosPage() {
  const [dcosFiles, setDcosFiles] = useState(initialDcosFiles);
  const [selectedFile, setSelectedFile] = useState(initialDcosFiles[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(selectedFile.content);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFile, setNewFile] = useState({
    title: '',
    content: '',
    folder: 'core',
  });

  const handleSaveFile = () => {
    if (selectedFile) {
      const updatedFiles = dcosFiles.map(file => 
        file.id === selectedFile.id ? { ...file, content: editContent, updatedAt: new Date().toISOString() } : file
      );
      setDcosFiles(updatedFiles);
      setSelectedFile({ ...selectedFile, content: editContent, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    }
  };

  const handleAddFile = () => {
    if (newFile.title.trim()) {
      const file = {
        id: dcosFiles.length + 1,
        ...newFile,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedFiles = [...dcosFiles, file];
      setDcosFiles(updatedFiles);
      setSelectedFile(file);
      setEditContent(file.content);
      setNewFile({ title: '', content: '', folder: 'core' });
      setShowAddForm(false);
    }
  };

  const handleDeleteFile = (id: number) => {
    const updatedFiles = dcosFiles.filter(file => file.id !== id);
    setDcosFiles(updatedFiles);
    if (selectedFile && selectedFile.id === id) {
      setSelectedFile(updatedFiles[0]);
      setEditContent(updatedFiles[0]?.content || '');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">DCOS Repository</h1>
            <p className="text-gray-600">Dynamic Core Operating Scripts</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New File'}
          </Button>
        </div>

        {/* Add File Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New DCOS File</CardTitle>
              <CardDescription>Create a new core narrative file</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">File Title</label>
                  <Input 
                    value={newFile.title} 
                    onChange={(e) => setNewFile({ ...newFile, title: e.target.value })} 
                    placeholder="e.g., Core Identity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Folder</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newFile.folder}
                    onChange={(e) => setNewFile({ ...newFile, folder: e.target.value })}
                  >
                    <option value="core">Core</option>
                    <option value="voice">Voice</option>
                    <option value="principles">Principles</option>
                    <option value="manifesto">Manifesto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={newFile.content}
                  onChange={(e) => setNewFile({ ...newFile, content: e.target.value })}
                  placeholder="Write your core narrative here..."
                  rows={8}
                />
              </div>
              <Button onClick={handleAddFile} className="mt-2">
                Add File
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* File List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader>
                <CardTitle>Files</CardTitle>
                <CardDescription>Your DCOS repository</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dcosFiles.map(file => (
                    <div 
                      key={file.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedFile?.id === file.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setSelectedFile(file);
                        setEditContent(file.content);
                        setIsEditing(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{file.title}</h3>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteFile(file.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">{file.folder}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Updated: {new Date(file.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Editor */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedFile?.title}</CardTitle>
                  <CardDescription>{selectedFile?.folder} • Last updated: {selectedFile ? new Date(selectedFile.updatedAt).toLocaleDateString() : ''}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSaveFile}>
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => {
                        setIsEditing(false);
                        setEditContent(selectedFile?.content || '');
                      }}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    placeholder="Write your core narrative here..."
                    rows={16}
                  />
                ) : (
                  <div className="prose max-w-none">
                    {selectedFile?.content.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={index}>{line.replace('# ', '')}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index}>{line.replace('## ', '')}</h2>;
                      } else if (line.startsWith('- ')) {
                        return <li key={index}>{line.replace('- ', '')}</li>;
                      } else if (line.trim() === '') {
                        return <br key={index} />;
                      } else {
                        return <p key={index}>{line}</p>;
                      }
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}