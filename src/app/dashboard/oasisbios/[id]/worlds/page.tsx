'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';

// Mock data for worlds
const initialWorlds = [
  {
    id: 1,
    name: 'Neon Desert',
    summary: 'A post-apocalyptic world where civilization survives in neon-lit oases amid vast desert wastelands',
    timeSetting: '2150 AD',
    geography: 'Endless deserts with scattered oases and neon cities',
    rules: 'Water is the most valuable resource, and solar power is the primary energy source',
    factions: 'Desert Nomads, Neon City Dwellers, Water Barons',
    aesthetic: 'Neon lights, sand dunes, cyberpunk architecture',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 2,
    name: 'Archive City',
    summary: 'A massive underground city built to preserve knowledge after a global cataclysm',
    timeSetting: '2200 AD',
    geography: 'Underground tunnels and caverns, with artificial daylight systems',
    rules: 'Knowledge is power, and archivists are the most respected class',
    factions: 'Archivists, Technicians, Security Forces',
    aesthetic: 'Clean, minimalist design with extensive libraries and data centers',
    createdAt: '2024-01-16T14:00:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
];

export default function WorldsPage() {
  const [worlds, setWorlds] = useState(initialWorlds);
  const [selectedWorld, setSelectedWorld] = useState(initialWorlds[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editWorld, setEditWorld] = useState(initialWorlds[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWorld, setNewWorld] = useState({
    name: '',
    summary: '',
    timeSetting: '',
    geography: '',
    rules: '',
    factions: '',
    aesthetic: '',
  });

  const handleSaveWorld = () => {
    if (selectedWorld) {
      const updatedWorlds = worlds.map(world => 
        world.id === selectedWorld.id ? { ...editWorld, updatedAt: new Date().toISOString() } : world
      );
      setWorlds(updatedWorlds);
      setSelectedWorld({ ...editWorld, updatedAt: new Date().toISOString() });
      setIsEditing(false);
    }
  };

  const handleAddWorld = () => {
    if (newWorld.name.trim()) {
      const world = {
        id: worlds.length + 1,
        ...newWorld,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedWorlds = [...worlds, world];
      setWorlds(updatedWorlds);
      setSelectedWorld(world);
      setEditWorld(world);
      setNewWorld({
        name: '',
        summary: '',
        timeSetting: '',
        geography: '',
        rules: '',
        factions: '',
        aesthetic: '',
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteWorld = (id: number) => {
    const updatedWorlds = worlds.filter(world => world.id !== id);
    setWorlds(updatedWorlds);
    if (selectedWorld && selectedWorld.id === id) {
      setSelectedWorld(updatedWorlds[0]);
      setEditWorld(updatedWorlds[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">World Repository</h1>
            <p className="text-gray-600">Create and manage your fictional worlds</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New World'}
          </Button>
        </div>

        {/* Add World Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New World</CardTitle>
              <CardDescription>Create a new fictional world</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">World Name</label>
                  <Input 
                    value={newWorld.name} 
                    onChange={(e) => setNewWorld({ ...newWorld, name: e.target.value })} 
                    placeholder="e.g., Neon Desert"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Time Setting</label>
                  <Input 
                    value={newWorld.timeSetting} 
                    onChange={(e) => setNewWorld({ ...newWorld, timeSetting: e.target.value })} 
                    placeholder="e.g., 2150 AD"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Summary</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={newWorld.summary}
                  onChange={(e) => setNewWorld({ ...newWorld, summary: e.target.value })}
                  placeholder="Brief description of your world"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Geography</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.geography}
                    onChange={(e) => setNewWorld({ ...newWorld, geography: e.target.value })}
                    placeholder="Describe the physical landscape"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rules of Physics</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.rules}
                    onChange={(e) => setNewWorld({ ...newWorld, rules: e.target.value })}
                    placeholder="Describe the world's rules and systems"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Factions</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.factions}
                    onChange={(e) => setNewWorld({ ...newWorld, factions: e.target.value })}
                    placeholder="List major factions or groups"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Aesthetic Keywords</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newWorld.aesthetic}
                    onChange={(e) => setNewWorld({ ...newWorld, aesthetic: e.target.value })}
                    placeholder="Describe the visual style"
                    rows={3}
                  />
                </div>
              </div>
              <Button onClick={handleAddWorld} className="mt-2">
                Add World
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* World List */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader>
                <CardTitle>Worlds</CardTitle>
                <CardDescription>Your worldbuilding repository</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {worlds.map(world => (
                    <div 
                      key={world.id}
                      className={`p-3 rounded-md cursor-pointer transition-colors ${selectedWorld?.id === world.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setSelectedWorld(world);
                        setEditWorld(world);
                        setIsEditing(false);
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{world.name}</h3>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleDeleteWorld(world.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">{world.timeSetting}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Updated: {new Date(world.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* World Details */}
          <div className="lg:col-span-3">
            <Card className="border-0 shadow-sm h-full">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <CardTitle>{selectedWorld?.name}</CardTitle>
                  <CardDescription>{selectedWorld?.timeSetting} • Last updated: {selectedWorld ? new Date(selectedWorld.updatedAt).toLocaleDateString() : ''}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <Button size="sm" onClick={handleSaveWorld}>
                        Save
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => {
                        setIsEditing(false);
                        setEditWorld(selectedWorld);
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
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Summary</h3>
                    {isEditing ? (
                      <textarea 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                        value={editWorld.summary}
                        onChange={(e) => setEditWorld({ ...editWorld, summary: e.target.value })}
                        placeholder="Brief description of your world"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-700">{selectedWorld?.summary}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Geography</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={editWorld.geography}
                          onChange={(e) => setEditWorld({ ...editWorld, geography: e.target.value })}
                          placeholder="Describe the physical landscape"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorld?.geography}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Rules of Physics</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={editWorld.rules}
                          onChange={(e) => setEditWorld({ ...editWorld, rules: e.target.value })}
                          placeholder="Describe the world's rules and systems"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorld?.rules}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Factions</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={editWorld.factions}
                          onChange={(e) => setEditWorld({ ...editWorld, factions: e.target.value })}
                          placeholder="List major factions or groups"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorld?.factions}</p>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Aesthetic</h3>
                      {isEditing ? (
                        <textarea 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                          value={editWorld.aesthetic}
                          onChange={(e) => setEditWorld({ ...editWorld, aesthetic: e.target.value })}
                          placeholder="Describe the visual style"
                          rows={3}
                        />
                      ) : (
                        <p className="text-gray-700">{selectedWorld?.aesthetic}</p>
                      )}
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