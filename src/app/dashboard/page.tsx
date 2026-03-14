'use client';

import React, { useEffect } from 'react';
import { useSession } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  // Show loading while checking session
  if (!session) {
    return null;
  }

  // Mock data for demonstration
  const recentUpdates = [
    {
      id: 1,
      title: 'OasisBio Prime Updated',
      description: 'Added new abilities and updated profile',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      title: 'World: Neon Desert Created',
      description: 'New world added to your collection',
      timestamp: '1 day ago'
    },
    {
      id: 3,
      title: 'Model: Future Self Uploaded',
      description: '3D model uploaded successfully',
      timestamp: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Left Navigation Bar */}
        <div className="lg:w-64 bg-muted/50 border-r border-border p-6 sticky top-0 h-screen">
          <div className="mb-12">
            <h1 className="text-2xl font-display font-bold">OasisBio</h1>
            <p className="text-muted-foreground text-sm">Dashboard</p>
          </div>
          
          <nav className="space-y-1">
            <Button asChild className="w-full justify-start">
              <a href="/dashboard">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Overview
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/identity">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Identity
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/eras">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Eras
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/abilities">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Abilities
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/dcos">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DCOS
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/references">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                References
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/worlds">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Worlds
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/models">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Models
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full justify-start">
              <a href="/dashboard/publish">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Publish
              </a>
            </Button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {session.user?.name || 'User'}</p>
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
                <div className="text-3xl font-bold mb-4">0</div>
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
                <div className="text-3xl font-bold mb-4">0</div>
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
                <div className="text-3xl font-bold mb-4">0</div>
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
                    {recentUpdates.map((update) => (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button asChild className="justify-start">
                  <a href="/dashboard/oasisbios/new">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create OasisBio
                  </a>
                </Button>
                <Button asChild className="justify-start">
                  <a href="/dashboard/worlds">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Create World
                  </a>
                </Button>
                <Button asChild className="justify-start">
                  <a href="/dashboard/models">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Upload Model
                  </a>
                </Button>
                <Button asChild className="justify-start">
                  <a href="/dashboard/settings">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">OasisBios Limit</span>
                      <span className="font-medium">3 / 3</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Storage Used</span>
                      <span className="font-medium">0 MB</span>
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
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">Online</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Database</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">Online</span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Storage</span>
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium">Online</span>
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
