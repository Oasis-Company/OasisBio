'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';

// Mock data for ability categories and presets
const abilityCategories = [
  { id: 'languages', name: 'Languages' },
  { id: 'sports', name: 'Sports' },
  { id: 'arts', name: 'Arts' },
  { id: 'music', name: 'Music' },
  { id: 'technology', name: 'Technology' },
  { id: 'science', name: 'Science' },
  { id: 'social', name: 'Social Skills' },
  { id: 'survival', name: 'Survival Skills' },
  { id: 'worldbuilding', name: 'Worldbuilding Skills' },
  { id: 'combat', name: 'Combat / Fantasy Skills' },
  { id: 'spiritual', name: 'Spiritual / Abstract Traits' },
  { id: 'profession', name: 'Profession Tags' },
];

const presetAbilities = {
  languages: ['English', 'Spanish', 'Japanese', 'French', 'Mandarin'],
  sports: ['Basketball', 'Football', 'Running', 'Swimming', 'Skateboarding'],
  arts: ['Drawing', 'Photography', 'Filmmaking', 'Fashion Styling', 'Calligraphy'],
  music: ['Rap', 'Singing', 'Beatmaking', 'Guitar', 'Piano'],
  technology: ['Frontend Development', 'AI Prompting', 'Game Design', '3D Modeling', 'Data Analysis'],
  combat: ['Telepathy', 'Alchemy', 'World Mapping', 'Beast Taming', 'Portal Hacking'],
};

// Mock data for user abilities
const initialAbilities = [
  {
    id: 1,
    name: 'JavaScript',
    category: 'technology',
    type: 'custom',
    level: 4,
    description: 'Proficient in modern JavaScript and ES6+ features',
  },
  {
    id: 2,
    name: 'English',
    category: 'languages',
    type: 'official',
    level: 5,
    description: 'Native speaker',
  },
  {
    id: 3,
    name: 'Drawing',
    category: 'arts',
    type: 'official',
    level: 3,
    description: 'Hobbyist drawer with basic skills',
  },
];

export default function AbilitiesPage() {
  const [abilities, setAbilities] = useState(initialAbilities);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAbility, setNewAbility] = useState({
    name: '',
    category: 'technology',
    type: 'custom' as 'custom' | 'official',
    level: 1,
    description: '',
  });
  const [filterCategory, setFilterCategory] = useState('all');

  const handleAddAbility = () => {
    if (newAbility.name.trim()) {
      const ability = {
        id: abilities.length + 1,
        ...newAbility,
      };
      setAbilities([...abilities, ability]);
      setNewAbility({
        name: '',
        category: 'technology',
        type: 'custom',
        level: 1,
        description: '',
      });
      setShowAddForm(false);
    }
  };

  const handleAddPresetAbility = (category: string, abilityName: string) => {
    const existingAbility = abilities.find(a => a.name === abilityName);
    if (!existingAbility) {
      const ability = {
        id: abilities.length + 1,
        name: abilityName,
        category,
        type: 'official',
        level: 1,
        description: '',
      };
      setAbilities([...abilities, ability]);
    }
  };

  const handleUpdateLevel = (id: number, level: number) => {
    setAbilities(abilities.map(ability => 
      ability.id === id ? { ...ability, level } : ability
    ));
  };

  const handleDeleteAbility = (id: number) => {
    setAbilities(abilities.filter(ability => ability.id !== id));
  };

  const filteredAbilities = filterCategory === 'all' 
    ? abilities 
    : abilities.filter(ability => ability.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Ability Pool</h1>
            <p className="text-gray-600">Manage your skills and abilities</p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : 'Add New Ability'}
          </Button>
        </div>

        {/* Add Ability Form */}
        {showAddForm && (
          <Card className="mb-8 border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Add New Ability</CardTitle>
              <CardDescription>Create a custom ability or select from presets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Ability Name</label>
                  <Input 
                    value={newAbility.name} 
                    onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })} 
                    placeholder="e.g., JavaScript"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.category}
                    onChange={(e) => setNewAbility({ ...newAbility, category: e.target.value })}
                  >
                    {abilityCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.type}
                    onChange={(e) => setNewAbility({ ...newAbility, type: e.target.value as 'custom' | 'official' })}
                  >
                    <option value="custom">Custom</option>
                    <option value="official">Official</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Level (1-5)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    value={newAbility.level}
                    onChange={(e) => setNewAbility({ ...newAbility, level: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(level => (
                      <option key={level} value={level}>
                        {level} - {level === 1 ? 'Beginner' : level === 2 ? 'Novice' : level === 3 ? 'Intermediate' : level === 4 ? 'Advanced' : 'Expert'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={newAbility.description}
                  onChange={(e) => setNewAbility({ ...newAbility, description: e.target.value })}
                  placeholder="Add a description for this ability"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddAbility} className="mt-2">
                Add Ability
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button 
            variant={filterCategory === 'all' ? 'primary' : 'secondary'}
            onClick={() => setFilterCategory('all')}
            size="sm"
          >
            All
          </Button>
          {abilityCategories.map(category => (
            <Button 
              key={category.id}
              variant={filterCategory === category.id ? 'primary' : 'secondary'}
              onClick={() => setFilterCategory(category.id)}
              size="sm"
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Ability List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAbilities.map(ability => (
            <Card key={ability.id} className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{ability.name}</CardTitle>
                    <CardDescription>{abilityCategories.find(c => c.id === ability.category)?.name}</CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => handleDeleteAbility(ability.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Level</span>
                    <span className="text-sm font-medium">{ability.level}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-black h-2 rounded-full" 
                      style={{ width: `${(ability.level / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                    {ability.type === 'official' ? 'Official' : 'Custom'}
                  </span>
                </div>
                {ability.description && (
                  <p className="text-sm text-gray-600 mb-4">
                    {ability.description}
                  </p>
                )}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(level => (
                    <Button 
                      key={level}
                      size="sm"
                      variant={ability.level === level ? 'primary' : 'secondary'}
                      onClick={() => handleUpdateLevel(ability.id, level)}
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preset Abilities */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Official Presets</CardTitle>
            <CardDescription>Add pre-defined abilities to your pool</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Object.entries(presetAbilities).map(([categoryId, abilityList]) => {
                const category = abilityCategories.find(c => c.id === categoryId);
                return (
                  <div key={categoryId}>
                    <h3 className="text-lg font-medium mb-3">{category?.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {abilityList.map(abilityName => (
                        <Button 
                          key={abilityName}
                          size="sm"
                          variant="secondary"
                          onClick={() => handleAddPresetAbility(categoryId, abilityName)}
                        >
                          {abilityName}
                        </Button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}