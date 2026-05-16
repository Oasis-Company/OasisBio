'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { ExportModal } from '@/components/ExportModal';
import { ImportModal } from '@/components/ImportModal';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OasisBiosPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [oasisBios, setOasisBios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }

    const fetchOasisBios = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/oasisbios');
        if (!response.ok) {
          throw new Error('Failed to fetch OasisBios');
        }
        const data = await response.json();
        setOasisBios(data);
      } catch (err) {
        setError('Failed to load OasisBios');
        console.error('Error fetching OasisBios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOasisBios();
  }, [user, router]);

  const handleSelect = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === oasisBios.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(oasisBios.map(oasisBio => oasisBio.id));
    }
  };

  const handleExport = async (type: 'single' | 'batch', characterIds: string[], include: any) => {
    setExportLoading(true);
    setExportError(null);
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, characterIds, include }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const result = await response.json();
      window.open(result.downloadUrl, '_blank');
    } catch (err) {
      setExportError('Export failed. Please try again.');
      console.error('Export error:', err);
    } finally {
      setExportLoading(false);
    }
  };

  const handleImport = async (file: File) => {
    setImportLoading(true);
    setImportError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Import failed');
      }

      const result = await response.json();
      
      // Refresh character list
      const fetchOasisBios = async () => {
        try {
          const response = await fetch('/api/oasisbios');
          if (!response.ok) {
            throw new Error('Failed to fetch OasisBios');
          }
          const data = await response.json();
          setOasisBios(data);
        } catch (err) {
          console.error('Error fetching OasisBios:', err);
        }
      };

      await fetchOasisBios();

      return result;
    } catch (err) {
      setImportError('Import failed. Please try again.');
      console.error('Import error:', err);
      throw err;
    } finally {
      setImportLoading(false);
    }
  };

  // Show loading while checking session
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-40 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg p-6">
                <div className="h-6 w-48 bg-muted animate-pulse rounded mb-4"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">My OasisBios</h1>
            <Button asChild>
              <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{error}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My OasisBios</h1>
          <div className="flex space-x-3">
            <Button
              onClick={() => setIsImportModalOpen(true)}
              disabled={importLoading}
            >
              {importLoading ? 'Importing...' : 'Import'}
            </Button>
            {selectedIds.length > 0 && (
              <Button
                onClick={() => setIsExportModalOpen(true)}
                disabled={exportLoading}
              >
                {exportLoading ? 'Exporting...' : 'Export'}
              </Button>
            )}
            <Button asChild>
              <Link href="/dashboard/oasisbios/new">Create New OasisBio</Link>
            </Button>
          </div>
        </div>

        {oasisBios.length > 0 && (
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={selectedIds.length === oasisBios.length && oasisBios.length > 0}
              onChange={handleSelectAll}
              className="mr-2"
            />
            <span>Select All</span>
          </div>
        )}

        {oasisBios.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-center max-w-2xl mx-auto">
              {/* Icon */}
              <div className="mx-auto w-24 h-24 mb-8 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              
              {/* Title */}
              <h2 className="text-2xl font-bold mb-3">开始创建你的身份故事</h2>
              <p className="text-muted-foreground mb-8">
                在这里，你可以思考"你是谁"——记录真实的你，或者探索你想成为的样子。没有标准答案，只有你的故事。
              </p>
              
              {/* Actions */}
              <div className="flex justify-center">
                <Button asChild size="lg" className="min-w-[200px]">
                  <Link href="/dashboard/oasisbios/new">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    创建新身份
                  </Link>
                </Button>
              </div>
              
              {/* Question prompts */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">• 你最珍视的价值观是什么？</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">• 什么让你感到真正的快乐？</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">• 你希望别人如何记住你？</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-muted-foreground">• 你想探索自己的哪些方面？</p>
                </div>
              </div>
              
              {/* Tip */}
              <div className="mt-10 pt-8 border-t border-border">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div className="text-left">
                    <p className="font-medium text-foreground mb-1">需要帮助？</p>
                    <p>Deo/Dia 助手和 Nuwa 可以陪伴你一起探索，让你的表达更自然。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oasisBios.map((oasisBio) => (
              <Card key={oasisBio.id} className="relative">
                <div className="absolute top-4 left-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(oasisBio.id)}
                    onChange={() => handleSelect(oasisBio.id)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                </div>
                <CardHeader className="pl-12">
                  <CardTitle>{oasisBio.title}</CardTitle>
                </CardHeader>
                <CardContent className="pl-12">
                  <p className="text-muted-foreground mb-4">{oasisBio.tagline || 'No tagline'}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" asChild>
                      <a href={`/dashboard/oasisbios/${oasisBio.id}`}>Edit</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`/bio/${oasisBio.slug}`}>View</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ExportModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          characterIds={selectedIds}
          onExport={handleExport}
        />

        <ImportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />
      </div>
    </div>
  );
}
