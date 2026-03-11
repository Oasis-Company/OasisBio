'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

// Mock data for templates
const identityTemplates = [
  {
    id: 1,
    name: 'The Athlete',
    description: 'A template for athletes and sports enthusiasts',
    abilities: ['Basketball', 'Running', 'Swimming', 'Strength Training', 'Teamwork'],
    image: 'https://via.placeholder.com/300x200?text=The+Athlete',
  },
  {
    id: 2,
    name: 'The Archivist',
    description: 'A template for knowledge keepers and researchers',
    abilities: ['Research', 'Organization', 'Writing', 'Languages', 'Critical Thinking'],
    image: 'https://via.placeholder.com/300x200?text=The+Archivist',
  },
  {
    id: 3,
    name: 'The Future Musician',
    description: 'A template for futuristic musicians and composers',
    abilities: ['Music Production', 'Songwriting', 'Digital Audio', 'Performance', 'Sound Design'],
    image: 'https://via.placeholder.com/300x200?text=The+Future+Musician',
  },
  {
    id: 4,
    name: 'The Parallel Diplomat',
    description: 'A template for negotiators and diplomats across dimensions',
    abilities: ['Diplomacy', 'Languages', 'Cultural Awareness', 'Public Speaking', 'Conflict Resolution'],
    image: 'https://via.placeholder.com/300x200?text=The+Parallel+Diplomat',
  },
  {
    id: 5,
    name: 'The Worldbuilder',
    description: 'A template for creators of fictional worlds',
    abilities: ['Worldbuilding', 'Storytelling', 'Creative Writing', 'Visual Design', 'Research'],
    image: 'https://via.placeholder.com/300x200?text=The+Worldbuilder',
  },
];

const worldTemplates = [
  {
    id: 1,
    name: 'Neon Cyberpunk',
    description: 'A futuristic world with neon lights and advanced technology',
    timeSetting: '2150 AD',
    keyFeatures: ['Neon-lit cities', 'Advanced AI', 'Cybernetics', 'Corporate control', 'Urban decay'],
    image: 'https://via.placeholder.com/300x200?text=Neon+Cyberpunk',
  },
  {
    id: 2,
    name: 'Medieval Fantasy',
    description: 'A classic fantasy world with magic and medieval technology',
    timeSetting: 'Medieval Era',
    keyFeatures: ['Magic systems', 'Fantasy races', 'Medieval politics', 'Quests', 'Mythical creatures'],
    image: 'https://via.placeholder.com/300x200?text=Medieval+Fantasy',
  },
  {
    id: 3,
    name: 'Post-Apocalyptic',
    description: 'A world recovering from a global cataclysm',
    timeSetting: '2070 AD',
    keyFeatures: ['Scarce resources', 'Survivalist societies', 'Ruined cities', 'Radiation', 'Faction conflicts'],
    image: 'https://via.placeholder.com/300x200?text=Post-Apocalyptic',
  },
];

const abilityTemplates = [
  {
    id: 1,
    category: 'Languages',
    abilities: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Russian', 'Arabic'],
  },
  {
    id: 2,
    category: 'Technology',
    abilities: ['Programming', 'Web Development', 'Data Analysis', 'AI', 'Cybersecurity', '3D Modeling', 'Game Design'],
  },
  {
    id: 3,
    category: 'Arts',
    abilities: ['Drawing', 'Painting', 'Photography', 'Sculpture', 'Digital Art', 'Animation', 'Film Making'],
  },
  {
    id: 4,
    category: 'Music',
    abilities: ['Guitar', 'Piano', 'Drums', 'Singing', 'Music Production', 'Songwriting', 'DJing'],
  },
  {
    id: 5,
    category: 'Sports',
    abilities: ['Basketball', 'Football', 'Soccer', 'Tennis', 'Swimming', 'Running', 'Weightlifting'],
  },
];

export default function TemplatesPage() {
  const [activeTab, setActiveTab] = useState('identity');

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Templates & Presets</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              Start with our pre-built templates to quickly create your OasisBio.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <Button 
              variant={activeTab === 'identity' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('identity')}
              className="px-4 py-4 border-b-2"
            >
              Identity Templates
            </Button>
            <Button 
              variant={activeTab === 'world' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('world')}
              className="px-4 py-4 border-b-2"
            >
              World Templates
            </Button>
            <Button 
              variant={activeTab === 'ability' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('ability')}
              className="px-4 py-4 border-b-2"
            >
              Ability Presets
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Identity Templates */}
            {activeTab === 'identity' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">Identity Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {identityTemplates.map(template => (
                    <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="aspect-video bg-gray-100 rounded-t-md overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Key Abilities:</h3>
                          <div className="flex flex-wrap gap-2">
                            {template.abilities.slice(0, 5).map((ability, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                {ability}
                              </span>
                            ))}
                            {template.abilities.length > 5 && (
                              <span className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                +{template.abilities.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <a href="/dashboard/oasisbios/new?template={template.id}">Use Template</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* World Templates */}
            {activeTab === 'world' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">World Templates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {worldTemplates.map(template => (
                    <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <div className="aspect-video bg-gray-100 rounded-t-md overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.timeSetting}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">
                          {template.description}
                        </p>
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Key Features:</h3>
                          <ul className="space-y-1 text-sm text-gray-600">
                            {template.keyFeatures.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <Button asChild className="w-full">
                          <a href="/dashboard/worlds/new?template={template.id}">Use Template</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Ability Presets */}
            {activeTab === 'ability' && (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold mb-8">Ability Presets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {abilityTemplates.map(template => (
                    <Card key={template.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader>
                        <CardTitle className="text-lg">{template.category}</CardTitle>
                        <CardDescription>{template.abilities.length} abilities</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {template.abilities.map((ability, index) => (
                              <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                                {ability}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Button asChild className="w-full">
                          <a href="/dashboard/oasisbios/new?abilities={template.id}">Add All Abilities</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Create Your OasisBio?</h2>
            <p className="text-xl mb-10 text-gray-600">
              Start with a template or build your identity from scratch.
            </p>
            <Button size="lg" asChild>
              <a href="/create">Get Started</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}