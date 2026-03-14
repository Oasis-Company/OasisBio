'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Input } from '@/components/Input';

// Client components need to be in separate files
// Metadata should be exported from server components


// Mock data for public OasisBios
const publicOasisBios = [
  {
    id: 1,
    title: 'Oasis Prime',
    slug: 'oasis-prime',
    tagline: 'A digital identity beyond time',
    identityMode: 'hybrid',
    currentEra: 'Present',
    abilities: 12,
    worlds: 2,
    models: 1,
    previewImage: 'https://via.placeholder.com/300x200?text=Oasis+Prime',
  },
  {
    id: 2,
    title: 'Cyber Nomad',
    slug: 'cyber-nomad',
    tagline: 'Wandering the digital frontier',
    identityMode: 'fictional',
    currentEra: 'Future',
    abilities: 8,
    worlds: 1,
    models: 1,
    previewImage: 'https://via.placeholder.com/300x200?text=Cyber+Nomad',
  },
  {
    id: 3,
    title: 'Ancient Archivist',
    slug: 'ancient-archivist',
    tagline: 'Guardian of forgotten knowledge',
    identityMode: 'fictional',
    currentEra: 'Past',
    abilities: 15,
    worlds: 3,
    models: 0,
    previewImage: 'https://via.placeholder.com/300x200?text=Ancient+Archivist',
  },
  {
    id: 4,
    title: 'Parallel Entrepreneur',
    slug: 'parallel-entrepreneur',
    tagline: 'Building businesses across dimensions',
    identityMode: 'alternate',
    currentEra: 'Present',
    abilities: 10,
    worlds: 2,
    models: 1,
    previewImage: 'https://via.placeholder.com/300x200?text=Parallel+Entrepreneur',
  },
  {
    id: 5,
    title: 'Future Musician',
    slug: 'future-musician',
    tagline: 'Composing the soundtrack of tomorrow',
    identityMode: 'future',
    currentEra: 'Future',
    abilities: 7,
    worlds: 1,
    models: 1,
    previewImage: 'https://via.placeholder.com/300x200?text=Future+Musician',
  },
  {
    id: 6,
    title: 'World Builder',
    slug: 'world-builder',
    tagline: 'Creating universes from imagination',
    identityMode: 'hybrid',
    currentEra: 'Present',
    abilities: 14,
    worlds: 5,
    models: 0,
    previewImage: 'https://via.placeholder.com/300x200?text=World+Builder',
  },
];

const eras = ['All', 'Past', 'Present', 'Future', 'Alternate', 'Fictional'];
const identityTypes = ['All', 'Real', 'Fictional', 'Hybrid', 'Future', 'Alternate'];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const filteredBios = publicOasisBios.filter(bio => {
    const matchesSearch = searchTerm === '' || 
      bio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bio.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEra = selectedEra === 'All' || bio.currentEra === selectedEra;
    const matchesType = selectedType === 'All' || bio.identityMode === selectedType.toLowerCase();
    return matchesSearch && matchesEra && matchesType;
  });

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Hero Section */}
      <section className="py-20 md:py-32 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Explore OasisBios</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-600">
              Discover the diverse identities and worlds created by our community.
            </p>
            <div className="max-w-md mx-auto">
              <Input 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                placeholder="Search OasisBios..."
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Era</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={selectedEra}
                  onChange={(e) => setSelectedEra(e.target.value)}
                >
                  {eras.map(era => (
                    <option key={era} value={era}>
                      {era}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Identity Type</label>
                <select 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {identityTypes.map(type => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OasisBios Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBios.map(bio => (
                <Card key={bio.id} className="border-0 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="aspect-video bg-gray-100 rounded-t-md overflow-hidden">
                    <img 
                      src={bio.previewImage} 
                      alt={bio.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{bio.title}</CardTitle>
                        <CardDescription>{bio.tagline}</CardDescription>
                      </div>
                      <div className="inline-block px-2 py-1 bg-gray-100 text-xs font-medium rounded">
                        {bio.currentEra}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Abilities:</span> {bio.abilities}
                      </div>
                      <div>
                        <span className="font-medium">Worlds:</span> {bio.worlds}
                      </div>
                      <div>
                        <span className="font-medium">Models:</span> {bio.models}
                      </div>
                    </div>
                    <Button asChild className="w-full">
                      <a href={`/bio/${bio.slug}`}>View OasisBio</a>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {filteredBios.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-600 mb-4">No OasisBios found matching your criteria.</p>
                <Button onClick={() => {
                  setSearchTerm('');
                  setSelectedEra('All');
                  setSelectedType('All');
                }}>
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Create Your Own OasisBio</h2>
            <p className="text-xl mb-10 text-gray-600">
              Join our community and start building your own cross-era identity system today.
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