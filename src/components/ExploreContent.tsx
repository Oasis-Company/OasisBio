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

function OasisBioCardSkeleton() {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="h-6 w-3/4 bg-muted animate-pulse rounded mb-2"></div>
            <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
          </div>
          <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="aspect-video bg-muted animate-pulse rounded-md"></div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
          <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="h-4 w-32 bg-muted animate-pulse rounded mb-4"></div>
        <div className="h-10 w-full bg-muted animate-pulse rounded mb-2"></div>
        <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
      </CardContent>
    </Card>
  );
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
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <OasisBioCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="mx-auto w-16 h-16 mb-6 flex items-center justify-center rounded-full bg-red-50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">Oops, something went wrong</h3>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button onClick={() => fetchOasisBios(pagination.page)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Try Again
        </Button>
      </div>
    );
  }

  if (oasisBios.length === 0) {
    const hasFilters = filters.searchTerm || (filters.selectedEra && filters.selectedEra !== 'All') || (filters.selectedType && filters.selectedType !== 'All');
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="mx-auto w-24 h-24 mb-8 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
            {hasFilters ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold mb-3">
            {hasFilters ? '没有找到匹配的身份' : '还没有公开身份'}
          </h2>
          <p className="text-muted-foreground mb-8">
            {hasFilters 
              ? '尝试调整你的筛选条件或搜索词，看看有没有其他发现' 
              : '成为第一个创建并分享身份的人！让你的故事被世界看见'}
          </p>
          
          {/* Actions */}
          {hasFilters ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                清除筛选
              </Button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="min-w-[220px]">
                <a href="/auth/login">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  创建第一个身份
                </a>
              </Button>
            </div>
          )}
          
          {/* Extra tip for empty community */}
          {!hasFilters && (
            <div className="mt-10 pt-8 border-t border-border">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <div className="text-left">
                  <p className="font-medium text-foreground mb-1">为什么创建第一个？</p>
                  <p>你将成为 OasisBio 社区的开拓者，你的身份会成为其他人的灵感来源！</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {oasisBios.map(oasisBio => (
          <Card key={oasisBio.id} className="border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
            <div className="aspect-video bg-muted overflow-hidden">
              {oasisBio.coverImageUrl ? (
                <img 
                  src={oasisBio.coverImageUrl} 
                  alt={oasisBio.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{oasisBio.title}</CardTitle>
                  {oasisBio.tagline && (
                    <CardDescription className="line-clamp-2 mt-1">{oasisBio.tagline}</CardDescription>
                  )}
                </div>
                <span className="px-2.5 py-1 bg-background border border-border text-xs font-medium rounded-full shrink-0">
                  {oasisBio.identityMode.toUpperCase()}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>{oasisBio._count.abilities}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{oasisBio._count.worlds}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{oasisBio._count.models}</span>
                </div>
              </div>
              {oasisBio.currentEra && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
                  <span className="font-medium">Current Era:</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-medium">
                    {oasisBio.currentEra}
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button asChild size="sm" className="w-full">
                  <a href={`/bio/${oasisBio.slug}`}>View Profile</a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="w-full"
                >
                  <a href={`/dashboard/oasisbios/new?from=${oasisBio.slug}`}>
                    <span className="mr-1.5">🍂</span>
                    Use as Template
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="h-10 px-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`h-10 w-10 rounded-md text-sm font-medium transition-colors ${
                    pageNum === pagination.page
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="h-10 px-4"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground mt-6">
        Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
      </div>
    </div>
  );
}
