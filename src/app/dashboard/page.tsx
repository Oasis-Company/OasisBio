'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {session.user?.name || 'User'}</p>
          </div>
          <Button asChild size="lg">
            <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-sm">
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

          <Card className="border-0 shadow-sm">
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

          <Card className="border-0 shadow-sm">
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

        {/* OasisBios Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Drafts</CardTitle>
              <CardDescription>In-progress OasisBios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p>You have no draft OasisBios</p>
                  <Button className="mt-4" asChild>
                    <a href="/dashboard/oasisbios/new">Create New Draft</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Published Bios</CardTitle>
              <CardDescription>Publicly available OasisBios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
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
        <Card className="border-0 shadow-sm mb-12">
          <CardHeader>
            <CardTitle>Recent Updates</CardTitle>
            <CardDescription>Your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.map((update) => (
                <div key={update.id} className="flex items-start gap-4 p-4 border-b border-gray-100 last:border-b-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">{update.title}</h3>
                    <p className="text-gray-600 text-sm mb-1">{update.description}</p>
                    <p className="text-gray-400 text-xs">{update.timestamp}</p>
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
    </div>
  );
}
