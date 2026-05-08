'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';

interface OasisBio {
  id: string;
  title: string;
  slug: string;
  tagline: string | null;
  identityMode: string;
  currentEra: string | null;
  coverImageUrl: string | null;
  _count: {
    abilities: number;
    worlds: number;
    models: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface Filters {
  searchTerm: string;
  selectedEra: string;
  selectedType: string;
}

interface ExploreContentProps {
  filters: Filters;
}

export default function ExploreContent({ filters }: ExploreContentProps) {
  const [oasisBios, setOasisBios] = useState<OasisBio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const fetchOasisBios = async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (filters.searchTerm) {
        params.set('search', filters.searchTerm);
      }
      if (filters.selectedEra && filters.selectedEra !== 'All') {
        params.set('era', filters.selectedEra);
      }
      if (filters.selectedType && filters.selectedType !== 'All') {
        params.set('type', filters.selectedType);
      }

      const response = await fetch(`/api/oasisbios/public?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch OasisBios');
      }
      const { data, pagination: newPagination } = await response.json();
      setOasisBios(data);
      setPagination(newPagination);
    } catch (err) {
      setError('Failed to load OasisBios');
      console.error('Error fetching OasisBios:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchOasisBios(1);
  }, [filters]);

  useEffect(() => {
    fetchOasisBios(pagination.page);
  }, [pagination.page]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => fetchOasisBios(pagination.page)}>Try Again</Button>
      </div>
    );
  }

  if (oasisBios.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground mb-4">No OasisBios found.</p>
        <Button asChild>
          <a href="/auth/login">Create Your First OasisBio</a>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oasisBios.map(oasisBio => (
          <Card key={oasisBio.id} className="border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{oasisBio.title}</CardTitle>
                  {oasisBio.tagline && (
                    <CardDescription>{oasisBio.tagline}</CardDescription>
                  )}
                </div>
                <span className="px-2 py-1 bg-muted text-xs font-mono rounded">
                  {oasisBio.identityMode.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                  {oasisBio.coverImageUrl ? (
                    <img 
                      src={oasisBio.coverImageUrl} 
                      alt={oasisBio.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground">No preview</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground mb-4">
                <span>{oasisBio._count.abilities} Abilities</span>
                <span>{oasisBio._count.worlds} Worlds</span>
                <span>{oasisBio._count.models} Models</span>
              </div>
              {oasisBio.currentEra && (
                <div className="text-sm text-muted-foreground mb-4">
                  Current Era: {oasisBio.currentEra}
                </div>
              )}
              <Button asChild size="sm" className="w-full">
                <a href={`/bio/${oasisBio.slug}`}>View Profile</a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="w-full mt-2"
              >
                <a href={`/dashboard/oasisbios/new?from=${oasisBio.slug}`}>
                  🍂 Use as Template
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="px-4 text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground mt-4">
        Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
      </div>
    </div>
  );
}
