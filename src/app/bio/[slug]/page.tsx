'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import ModelViewer from '@/components/ModelViewer';

// Client components need to be in separate files
// Metadata should be exported from server components


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
      title: 'Core Script',
      content: '# Core Identity\n\nThis is the central narrative of Oasis Prime. It defines who they are at their core.\n\n## Core Principles\n- I speak as if every sentence is a map.\n- Never answer emotionally before observing patterns.\n- This identity belongs to a future archivist from 2094.\n',
    },
    {
      id: 2,
      title: 'Principles',
      content: '# Principles\n\nGuiding principles that shape Oasis Prime\'s identity and actions.\n',
    },
    {
      id: 3,
      title: 'Voice',
      content: '# Voice\n\nThe communication style and tone of Oasis Prime.\n',
    },
    {
      id: 4,
      title: 'Memory Fragments',
      content: '# Memory Fragments\n\nKey memories that have shaped Oasis Prime\'s identity.\n',
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
      aestheticKeywords: 'neon, desert, post-apocalyptic, cyberpunk',
      majorConflict: 'Water scarcity and corporate control',
    },
    {
      id: 2,
      name: 'Archive City',
      summary: 'A massive underground city built to preserve knowledge after a global cataclysm',
      timeSetting: '2200 AD',
      aestheticKeywords: 'underground, archives, knowledge, survival',
      majorConflict: 'Memory decay and information overload',
    },
  ],
  models: [
    {
      id: 1,
      name: 'Oasis Prime V1',
      previewImage: 'https://via.placeholder.com/800x600?text=Oasis+Prime+Model',
      era: 'Archive Era',
      world: 'Archive City',
      fileType: 'GLB',
    },
  ],
  relationships: [
    {
      id: 1,
      name: 'Neon Shadow',
      slug: 'neon-shadow',
      relationType: 'Ally',
      description: 'A fellow digital entity from the Neon Desert world',
      image: 'https://via.placeholder.com/100x100?text=Neon+Shadow',
    },
    {
      id: 2,
      name: 'Chronos Keeper',
      slug: 'chronos-keeper',
      relationType: 'Mentor',
      description: 'A time-traveling entity who guides Oasis Prime through different eras',
      image: 'https://via.placeholder.com/100x100?text=Chronos+Keeper',
    },
    {
      id: 3,
      name: 'Void Entity',
      slug: 'void-entity',
      relationType: 'Antagonist',
      description: 'A mysterious entity that seeks to erase digital identities',
      image: 'https://via.placeholder.com/100x100?text=Void+Entity',
    },
  ],
  eras: [
    {
      id: 1,
      name: 'Student Era',
      startYear: 2010,
      endYear: 2015,
      description: 'The origins of Oasis Prime',
      abilities: ['Basic Programming', 'English', 'Drawing'],
    },
    {
      id: 2,
      name: 'Prime Era',
      startYear: 2016,
      endYear: 2025,
      description: 'The current iteration of Oasis Prime',
      abilities: ['JavaScript', 'English', 'Drawing', 'Worldbuilding'],
    },
    {
      id: 3,
      name: 'Archive Era',
      startYear: 2026,
      endYear: 2094,
      description: 'The future evolution of Oasis Prime',
      abilities: ['Advanced JavaScript', 'English', 'Digital Art', 'Worldbuilding'],
    },
  ],
};



export default function PublicOasisBioPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black text-white">
        {/* Background Grid */}
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-r border-white"></div>
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="border-b border-white col-span-12"></div>
          ))}
        </div>
        
        {/* System Lines */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-white opacity-10"></div>
        </div>
        <div className="absolute inset-0 flex justify-center">
          <div className="h-full w-px bg-white opacity-10"></div>
        </div>
        
        {/* Section Number */}
        <div className="absolute top-8 left-8 text-white opacity-20 font-mono text-9xl">01</div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* System Tags */}
            <div className="flex flex-wrap gap-4 mb-12">
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">MODE / {oasisBioData.identityMode.toUpperCase()}</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">ERA / {oasisBioData.currentEra.toUpperCase()}</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">STATUS / {oasisBioData.status.toUpperCase()}</span>
              <span className="px-3 py-1 border border-white/20 text-white/70 text-sm font-mono">SPECIES / {oasisBioData.species.toUpperCase()}</span>
            </div>
            
            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display font-bold mb-8 leading-tight tracking-tighter text-white">
              <span className="block">{oasisBioData.title}</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl mb-16 max-w-3xl text-white/70 leading-relaxed">
              {oasisBioData.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Identity Panel */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">02</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Identity
              </h2>
            </div>
            
            {/* Identity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Identity Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">BIRTH</div>
                    <p className="font-medium">{oasisBioData.birthDate}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">GENDER</div>
                    <p className="font-medium">{oasisBioData.gender}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">PRONOUNS</div>
                    <p className="font-medium">{oasisBioData.pronouns}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">ORIGIN</div>
                    <p className="font-medium">{oasisBioData.placeOfOrigin}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">SPECIES</div>
                    <p className="font-medium">{oasisBioData.species}</p>
                  </div>
                  <div>
                    <div className="text-xs font-mono text-muted-foreground mb-2">STATUS</div>
                    <p className="font-medium">{oasisBioData.status}</p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div>
                <div className="text-xs font-mono text-muted-foreground mb-2">DESCRIPTION</div>
                <p className="text-lg leading-relaxed text-foreground">
                  {oasisBioData.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ability Matrix */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">03</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Ability Matrix
              </h2>
            </div>
            
            {/* Featured Abilities */}
            <div className="mb-12">
              <h3 className="text-lg font-bold mb-4">Featured Abilities</h3>
              <div className="flex flex-wrap gap-4">
                {oasisBioData.abilities.slice(0, 3).map(ability => (
                  <span key={ability.id} className="px-6 py-3 border border-border rounded-sm text-lg font-medium">
                    {ability.name}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Ability Categories */}
            <div className="space-y-8">
              {/* Technology */}
              <div>
                <h3 className="text-lg font-bold mb-4">Technology</h3>
                <div className="flex flex-wrap gap-3">
                  {oasisBioData.abilities.filter(a => a.category === 'technology').map(ability => (
                    <span key={ability.id} className="px-3 py-1 border border-border rounded-sm text-sm">
                      {ability.name} (Level {ability.level})
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Languages */}
              <div>
                <h3 className="text-lg font-bold mb-4">Languages</h3>
                <div className="flex flex-wrap gap-3">
                  {oasisBioData.abilities.filter(a => a.category === 'languages').map(ability => (
                    <span key={ability.id} className="px-3 py-1 border border-border rounded-sm text-sm">
                      {ability.name} (Level {ability.level})
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Arts */}
              <div>
                <h3 className="text-lg font-bold mb-4">Arts</h3>
                <div className="flex flex-wrap gap-3">
                  {oasisBioData.abilities.filter(a => a.category === 'arts').map(ability => (
                    <span key={ability.id} className="px-3 py-1 border border-border rounded-sm text-sm">
                      {ability.name} (Level {ability.level})
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Worldbuilding */}
              <div>
                <h3 className="text-lg font-bold mb-4">Worldbuilding</h3>
                <div className="flex flex-wrap gap-3">
                  {oasisBioData.abilities.filter(a => a.category === 'worldbuilding').map(ability => (
                    <span key={ability.id} className="px-3 py-1 border border-border rounded-sm text-sm">
                      {ability.name} (Level {ability.level})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DCOS Archive */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">04</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                DCOS Archive
              </h2>
            </div>
            
            {/* DCOS Files */}
            <div className="space-y-8">
              {oasisBioData.dcosFiles.map(file => (
                <Card key={file.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl">{file.title}</CardTitle>
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
          </div>
        </div>
      </section>

      {/* World Gallery */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">05</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                World Gallery
              </h2>
            </div>
            
            {/* World Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {oasisBioData.worlds.map(world => (
                <Card key={world.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="text-xs font-mono text-muted-foreground mb-2">WORLD</div>
                    <h3 className="text-2xl font-bold mb-4">{world.name}</h3>
                    <p className="text-muted-foreground mb-6">
                      {world.summary}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">TIME</span>
                        <span>{world.timeSetting}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">CONFLICT</span>
                        <span>{world.majorConflict}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">TYPE</span>
                        <span>{world.aestheticKeywords}</span>
                      </div>
                    </div>
                    <Button asChild className="mt-6">
                      <a href={`/worlds/${world.id}`}>Explore World</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* References Library */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">06</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                References Library
              </h2>
            </div>
            
            {/* Reference Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {oasisBioData.references.map(reference => (
                <Card key={reference.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{reference.title}</CardTitle>
                    <CardDescription>{reference.type.charAt(0).toUpperCase() + reference.type.slice(1)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {reference.description}
                    </p>
                    <div className="mb-4">
                      <a 
                        href={reference.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-foreground hover:underline"
                      >
                        {reference.url}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {reference.tags.map((tag, index) => (
                        <span key={index} className="inline-block px-2 py-1 bg-muted text-xs font-mono rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3D Presence */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">07</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                3D Presence
              </h2>
            </div>
            
            {/* 3D Model Viewer */}
            <Card variant="outlined">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-2/3 h-96 bg-background">
                    <ModelViewer 
                      modelUrl="/models/oasis-prime.obj" 
                      width={800} 
                      height={600} 
                    />
                  </div>
                  <div className="md:w-1/3 space-y-4">
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">MODEL</div>
                      <p className="font-medium">{oasisBioData.models[0].name}</p>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">FILE</div>
                      <p className="font-medium">{oasisBioData.models[0].fileType}</p>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">ERA</div>
                      <p className="font-medium">{oasisBioData.models[0].era}</p>
                    </div>
                    <div>
                      <div className="text-xs font-mono text-muted-foreground mb-1">WORLD</div>
                      <p className="font-medium">{oasisBioData.models[0].world}</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm">Rotate</Button>
                      <Button size="sm">Zoom</Button>
                      <Button size="sm">Reset</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Era Timeline */}
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">08</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Era Timeline
              </h2>
            </div>
            
            {/* Timeline */}
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-0 md:left-1/4 top-0 bottom-0 w-px bg-border ml-0 md:ml-6"></div>
              
              <div className="space-y-16">
                {oasisBioData.eras.map((era, index) => (
                  <div key={era.id} className="flex flex-col md:flex-row gap-8 relative">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 md:left-1/4 w-4 h-4 bg-foreground rounded-full -ml-2 md:-ml-2 mt-2 md:mt-4"></div>
                    
                    <div className="md:w-1/4 pt-6 md:pt-0">
                      <div className="text-xs font-mono text-muted-foreground mb-2">ERA {index + 1}</div>
                      <h3 className="text-2xl font-bold mb-2">{era.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {era.startYear} - {era.endYear}
                      </p>
                    </div>
                    <div className="md:w-3/4 bg-muted/30 p-8 rounded-sm border border-border">
                      <p className="mb-6 text-lg">{era.description}</p>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-3">ABILITIES</div>
                        <div className="flex flex-wrap gap-3">
                          {era.abilities.map((ability, idx) => (
                            <span key={idx} className="inline-block px-3 py-1.5 bg-background text-sm font-medium rounded-sm border border-border">
                              {ability}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Relationships */}
      <section className="py-32 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-mono text-muted-foreground">09</span>
                <div className="h-px flex-grow bg-border"></div>
              </div>
              <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
                Relationships
              </h2>
            </div>
            
            {/* Relationship Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {oasisBioData.relationships.map((relationship) => (
                <Card key={relationship.id} variant="outlined" className="hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-border">
                        <img 
                          src={relationship.image} 
                          alt={relationship.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-mono text-muted-foreground mb-1">{relationship.relationType.toUpperCase()}</div>
                        <h3 className="text-xl font-bold">{relationship.name}</h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {relationship.description}
                    </p>
                    <Button asChild size="sm">
                      <a href={`/bio/${relationship.slug}`}>View Profile</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold mb-2">OasisBio</h2>
                <p className="text-white/70">Identity Archive System</p>
              </div>
              <div className="mt-8 md:mt-0 text-center md:text-right">
                <p className="text-white/70 mb-2">Character Created: 2026</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-end">
                  <span className="text-white/70">Abilities / {oasisBioData.abilities.length}</span>
                  <span className="text-white/70">Worlds / {oasisBioData.worlds.length}</span>
                  <span className="text-white/70">Documents / {oasisBioData.dcosFiles.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}