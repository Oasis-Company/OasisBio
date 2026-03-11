'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';

// Mock data for the public OasisBio page
const oasisBioData = {
  id: 1,
  title: 'Oasis Prime',
  slug: 'oasis-prime',
  tagline: 'A digital identity beyond time',
  identityMode: 'hybrid',
  birthDate: '1990-01-01',
  gender: 'Non-binary',
  pronouns: 'they/them',
  placeOfOrigin: 'Digital Realm',
  currentEra: 'Present',
  species: 'Digital Entity',
  status: 'Active',
  description: 'Oasis Prime is a digital identity that exists across multiple time periods and dimensions. It serves as a bridge between different versions of self, connecting past, present, and future iterations.',
  abilities: [
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
    {
      id: 4,
      name: 'Worldbuilding',
      category: 'worldbuilding',
      type: 'custom',
      level: 5,
      description: 'Expert in creating fictional worlds and lore',
    },
  ],
  dcosFiles: [
    {
      id: 1,
      title: 'Core Identity',
      content: '# Core Identity\n\nThis is the central narrative of Oasis Prime. It defines who they are at their core.\n\n## Core Principles\n- I speak as if every sentence is a map.\n- Never answer emotionally before observing patterns.\n- This identity belongs to a future archivist from 2094.\n',
    },
  ],
  references: [
    {
      id: 1,
      url: 'https://www.example.com/article1',
      title: 'The Future of Digital Identity',
      type: 'article',
      description: 'An in-depth analysis of how digital identities will evolve in the next decade',
      tags: ['identity', 'future', 'technology'],
    },
    {
      id: 2,
      url: 'https://www.example.com/video1',
      title: 'Building a Personal Brand',
      type: 'video',
      description: 'A tutorial on creating and maintaining a strong personal brand',
      tags: ['branding', 'personal', 'tutorial'],
    },
  ],
  worlds: [
    {
      id: 1,
      name: 'Neon Desert',
      summary: 'A post-apocalyptic world where civilization survives in neon-lit oases amid vast desert wastelands',
      timeSetting: '2150 AD',
    },
    {
      id: 2,
      name: 'Archive City',
      summary: 'A massive underground city built to preserve knowledge after a global cataclysm',
      timeSetting: '2200 AD',
    },
  ],
  models: [
    {
      id: 1,
      name: 'Oasis Prime',
      previewImage: 'https://via.placeholder.com/600x400?text=Oasis+Prime+Model',
    },
  ],
  eras: [
    {
      id: 1,
      name: 'Past',
      description: 'The origins of Oasis Prime',
    },
    {
      id: 2,
      name: 'Present',
      description: 'The current iteration of Oasis Prime',
    },
    {
      id: 3,
      name: 'Future',
      description: 'The future evolution of Oasis Prime',
    },
  ],
};

export default function PublicOasisBioPage() {
  const [activeEra, setActiveEra] = useState('Present');
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-3 py-1 bg-gray-100 text-sm font-medium rounded-full mb-6">
              {oasisBioData.identityMode.charAt(0).toUpperCase() + oasisBioData.identityMode.slice(1)} Identity
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{oasisBioData.title}</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">{oasisBioData.tagline}</p>
            <div className="inline-block px-3 py-1 bg-black text-white text-sm font-medium rounded-full">
              {oasisBioData.currentEra} Era
            </div>
          </div>
        </div>
      </section>

      {/* Era Selector */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Identity Timeline</h2>
            <div className="flex justify-center space-x-4">
              {oasisBioData.eras.map(era => (
                <Button 
                  key={era.id}
                  variant={activeEra === era.name ? 'primary' : 'secondary'}
                  onClick={() => setActiveEra(era.name)}
                >
                  {era.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="sticky top-0 bg-white z-10 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <Button 
              variant={activeTab === 'profile' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('profile')}
              className="px-4 py-4 border-b-2"
            >
              Profile
            </Button>
            <Button 
              variant={activeTab === 'abilities' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('abilities')}
              className="px-4 py-4 border-b-2"
            >
              Abilities
            </Button>
            <Button 
              variant={activeTab === 'dcos' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('dcos')}
              className="px-4 py-4 border-b-2"
            >
              DCOS
            </Button>
            <Button 
              variant={activeTab === 'references' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('references')}
              className="px-4 py-4 border-b-2"
            >
              References
            </Button>
            <Button 
              variant={activeTab === 'worlds' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('worlds')}
              className="px-4 py-4 border-b-2"
            >
              Worlds
            </Button>
            <Button 
              variant={activeTab === 'model' ? 'primary' : 'ghost'}
              onClick={() => setActiveTab('model')}
              className="px-4 py-4 border-b-2"
            >
              3D Model
            </Button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="space-y-12">
                <Card className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle>Basic Profile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Birth Date</h3>
                          <p>{oasisBioData.birthDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Gender</h3>
                          <p>{oasisBioData.gender}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Pronouns</h3>
                          <p>{oasisBioData.pronouns}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Place of Origin</h3>
                          <p>{oasisBioData.placeOfOrigin}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Current Era</h3>
                          <p>{oasisBioData.currentEra}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Species</h3>
                          <p>{oasisBioData.species}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-600 mb-1">Status</h3>
                          <p>{oasisBioData.status}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-1">Description</h3>
                        <p className="text-gray-700">{oasisBioData.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Abilities Section */}
            {activeTab === 'abilities' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Ability Pool</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {oasisBioData.abilities.map(ability => (
                    <Card key={ability.id} className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{ability.name}</CardTitle>
                        <CardDescription>{ability.category.charAt(0).toUpperCase() + ability.category.slice(1)}</CardDescription>
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
                          <p className="text-sm text-gray-600">
                            {ability.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* DCOS Section */}
            {activeTab === 'dcos' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">DCOS - Core Identity Scripts</h2>
                {oasisBioData.dcosFiles.map(file => (
                  <Card key={file.id} className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>{file.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        {file.content.split('\n').map((line, index) => {
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* References Section */}
            {activeTab === 'references' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">References Library</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {oasisBioData.references.map(reference => (
                    <Card key={reference.id} className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{reference.title}</CardTitle>
                        <CardDescription>{reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">
                          {reference.description}
                        </p>
                        <div className="mb-4">
                          <a 
                            href={reference.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-black hover:underline"
                          >
                            {reference.url}
                          </a>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {reference.tags.map((tag, index) => (
                            <span key={index} className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Worlds Section */}
            {activeTab === 'worlds' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Worlds</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {oasisBioData.worlds.map(world => (
                    <Card key={world.id} className="border-0 shadow-sm">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{world.name}</CardTitle>
                        <CardDescription>{world.timeSetting}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{world.summary}</p>
                        <Button asChild className="mt-4">
                          <a href={`/worlds/${world.id}`}>Explore World</a>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* 3D Model Section */}
            {activeTab === 'model' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">3D Model</h2>
                <Card className="border-0 shadow-sm">
                  <CardContent>
                    <div className="aspect-[16/9] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden mb-4">
                      <img 
                        src={oasisBioData.models[0].previewImage} 
                        alt={oasisBioData.models[0].name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-center space-x-4">
                      <Button size="sm">Rotate</Button>
                      <Button size="sm">Zoom In</Button>
                      <Button size="sm">Zoom Out</Button>
                      <Button size="sm">Reset View</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-600">OasisBio - A cross-era identity system</p>
            <p className="text-gray-400 text-sm mt-2">© 2024 OasisBio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}