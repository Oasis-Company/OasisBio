'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

interface ExploreFiltersProps {
  onFilterChange: (filters: {
    searchTerm: string;
    selectedEra: string;
    selectedType: string;
  }) => void;
}

const eras = ['All', 'Past', 'Present', 'Future', 'Alternate', 'Fictional'];
const identityTypes = ['All', 'Real', 'Fictional', 'Hybrid', 'Future', 'Alternate'];

export default function ExploreFilters({ onFilterChange }: ExploreFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEra, setSelectedEra] = useState('All');
  const [selectedType, setSelectedType] = useState('All');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onFilterChange({ searchTerm: newSearchTerm, selectedEra, selectedType });
  };

  const handleEraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEra = e.target.value;
    setSelectedEra(newEra);
    onFilterChange({ searchTerm, selectedEra: newEra, selectedType });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setSelectedType(newType);
    onFilterChange({ searchTerm, selectedEra, selectedType: newType });
  };

  const handleReset = () => {
    setSearchTerm('');
    setSelectedEra('All');
    setSelectedType('All');
    onFilterChange({ searchTerm: '', selectedEra: 'All', selectedType: 'All' });
  };

  return (
    <>
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
                onChange={handleSearchChange} 
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
                  onChange={handleEraChange}
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
                  onChange={handleTypeChange}
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

      {/* Reset Button */}
      {(searchTerm !== '' || selectedEra !== 'All' || selectedType !== 'All') && (
        <section className="py-8 border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Button onClick={handleReset}>
                Reset Filters
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}