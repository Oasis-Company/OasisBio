'use client';

import { useState } from 'react';
import ExploreContent from '@/components/ExploreContent';
import ExploreFilters from '@/components/ExploreFilters';

export default function ExploreContentWrapper() {
  const [filters, setFilters] = useState({
    searchTerm: '',
    selectedEra: 'All',
    selectedType: 'All',
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <ExploreFilters onFilterChange={handleFilterChange} />
      <ExploreContent filters={filters} />
    </div>
  );
}
