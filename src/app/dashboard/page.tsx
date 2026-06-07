'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/navigation/NavigationBar';

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    profile: any;
  };
  stats: {
    oasisBios: number;
    worlds: number;
    models: number;
  };
  recentActivities: {
    id: number;
    title: string;
    description: string;
    timestamp: string;
    type: string;
  }[];
  accountStatus: {
    subscription: string;
    oasisBiosLimit: number;
    oasisBiosUsed: number;
    storageUsed: number;
    storageLimit: number;
  };
  systemStatus: {
    api: string;
    database: string;
    storage: string;
  };
}

export default function DashboardPage() {
  const { user, supabase } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  useEffect(() => {
    if (user === null) {
      router.push('/auth/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/dashboard');
        
        // Try to parse error response for better debugging
        let errorMessage = 'Failed to load dashboard data';
        if (!response.ok) {
          try {
            const errorData = await response.json();
            if (errorData?.error?.message) {
              errorMessage = errorData.error.message;
            } else if (errorData?.error?.code) {
              errorMessage = `Error ${errorData.error.code}: ${errorData.error.message || 'Unknown error'}`;
            }
          } catch {
            // If we can't parse JSON, use status text
            errorMessage = `${response.status} ${response.statusText}`;
          }
        }
        
        if (!response.ok) {
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, router]);

  // Show loading while checking session
  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <NavigationBar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
              </div>
              <div className="h-10 w-40 bg-muted animate-pulse rounded"></div>
            </div>

            {/* Stats Overview Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border rounded-lg p-6">
                  <div className="mb-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-24 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-12 w-24 bg-muted animate-pulse rounded mb-4"></div>
                  <div className="h-8 w-40 bg-muted animate-pulse rounded"></div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - OasisBios Status */}
              <div className="lg:col-span-2 space-y-8">
                {/* OasisBios Status Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-border rounded-lg p-6">
                      <div className="mb-4">
                        <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                      </div>
                      <div className="h-24 bg-muted animate-pulse rounded mb-4"></div>
                      <div className="h-8 w-32 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>

                {/* Recent Updates Skeleton */}
                <div className="border border-border rounded-lg p-6">
                  <div className="mb-6">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                      <div className="w-10 h-10 bg-muted rounded-full animate-pulse flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-4 w-48 bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-3 w-64 bg-muted animate-pulse rounded mb-2"></div>
                        <div className="h-2 w-24 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                  ))}
                </div>
              </div>

              {/* Right Column - Status Information */}
              <div className="space-y-6">
                {/* Account Status Skeleton */}
                <div className="border border-border rounded-lg p-6">
                  <div className="mb-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center mb-4">
                      <div className="h-3 w-32 bg-muted animate-pulse rounded"></div>
                      <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                  <div className="h-10 w-full bg-muted animate-pulse rounded"></div>
                </div>

                {/* System Status Skeleton */}
                <div className="border border-border rounded-lg p-6">
                  <div className="mb-4">
                    <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-3 w-40 bg-muted animate-pulse rounded"></div>
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex justify-between items-center mb-4">
                      <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-muted rounded-full animate-pulse"></div>
                        <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex flex-col lg:flex-row">
          <NavigationBar user={user} onLogout={handleLogout} />
          <div className="flex-1 p-6 md:p-8">
            <div className="max-w-3xl mx-auto">
              <div className="p-4 bg-red-50 text-red-600 rounded-md mb-6">
                {error}
              </div>
              <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <NavigationBar user={user} onLogout={handleLogout} />

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {dashboardData?.user?.name || user?.email || 'User'}</p>
            </div>
            <Button asChild size="lg">
              <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card variant="outlined">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Your OasisBios</CardTitle>
                <CardDescription>Total identities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{dashboardData?.stats?.oasisBios || 0}</div>
                <Button asChild>
                  <a href="/dashboard/oasisbios">Manage OasisBios</a>
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Worlds</CardTitle>
                <CardDescription>Created worlds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{dashboardData?.stats?.worlds || 0}</div>
                <Button asChild>
                  <a href="/dashboard/worlds">Manage Worlds</a>
                </Button>
              </CardContent>
            </Card>

            <Card variant="outlined">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Models</CardTitle>
                <CardDescription>Uploaded models</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">{dashboardData?.stats?.models || 0}</div>
                <Button asChild>
                  <a href="/dashboard/models">Manage Models</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - OasisBios Status */}
            <div className="lg:col-span-2 space-y-8">
              {/* OasisBios Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Drafts</CardTitle>
                    <CardDescription>In-progress OasisBios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <p>You have no draft OasisBios</p>
                        <Button className="mt-4" asChild>
                          <a href="/dashboard/oasisbios/new">Create New Draft</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="outlined">
                  <CardHeader>
                    <CardTitle>Published Bios</CardTitle>
                    <CardDescription>Publicly available OasisBios</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center py-8 text-muted-foreground">
                        <p>You have no published OasisBios</p>
                        <Button className="mt-4" asChild>
                          <a href="/dashboard/oasisbios">Manage Bios</a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Updates */}
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Recent Updates</CardTitle>
                  <CardDescription>Your recent activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData?.recentActivities?.map((update) => (
                      <div key={update.id} className="flex items-start gap-4 p-4 border-b border-border last:border-b-0">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium">{update.title}</h3>
                          <p className="text-muted-foreground text-sm mb-1">{update.description}</p>
                          <p className="text-muted-foreground text-xs">{update.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild className="justify-start sm:justify-center text-center sm:text-left">
                  <a href="/dashboard/oasisbios/new">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 sm:mr-2 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="hidden sm:inline">Create</span> OasisBio
                  </a>
                </Button>
                <Button asChild className="justify-start sm:justify-center text-center sm:text-left">
                  <a href="/dashboard/worlds">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 sm:mr-2 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="hidden sm:inline">Create</span> World
                  </a>
                </Button>
                <Button asChild className="justify-start sm:justify-center text-center sm:text-left">
                  <a href="/dashboard/models">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 sm:mr-2 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">Upload</span> Model
                  </a>
                </Button>
                <Button asChild className="justify-start sm:justify-center text-center sm:text-left">
                  <a href="/dashboard/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 sm:mr-2 mx-auto sm:mx-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </a>
                </Button>
              </div>
            </div>

            {/* Right Column - Status Information */}
            <div className="space-y-6">
              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>Your subscription and usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Subscription</span>
                      <span className="font-medium">{dashboardData?.accountStatus?.subscription || 'Free'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">OasisBios Limit</span>
                      <span className="font-medium">{dashboardData?.accountStatus?.oasisBiosUsed || 0} / {dashboardData?.accountStatus?.oasisBiosLimit || 3}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Storage Used</span>
                      <span className="font-medium">{dashboardData?.accountStatus?.storageUsed || 0} MB</span>
                    </div>
                    <Button className="w-full">Upgrade Plan</Button>
                  </div>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>Service availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">API</span>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dashboardData?.systemStatus?.api === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="font-medium">{dashboardData?.systemStatus?.api || 'Online'}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Database</span>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dashboardData?.systemStatus?.database === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="font-medium">{dashboardData?.systemStatus?.database || 'Online'}</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${dashboardData?.systemStatus?.storage === 'Online' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        <span className="font-medium">{dashboardData?.systemStatus?.storage || 'Online'}</span>
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}