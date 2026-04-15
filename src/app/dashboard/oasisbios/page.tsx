'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { ExportModal } from '@/components/ExportModal';
import { ImportModal } from '@/components/ImportModal';
import { useRouter } from 'next/navigation';

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
              <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
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
          <Card>
            <CardHeader>
              <CardTitle>No OasisBios Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You haven't created any OasisBios yet. Start by creating your first one.
              </p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/oasisbios/new">Create First OasisBio</a>
              </Button>
            </CardContent>
          </Card>
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
