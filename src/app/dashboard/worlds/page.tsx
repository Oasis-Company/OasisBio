'use client';

import React, { useEffect } from 'react';
import { useSession } from '@/lib/auth.client';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

export default function WorldsPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  // Mock data for now
  const worlds: any[] = [];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Worlds</h1>
          <Button asChild>
            <a href="/dashboard/worlds/new">Create New World</a>
          </Button>
        </div>

        {worlds.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>No Worlds Yet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You haven't created any worlds yet. Start by creating your first one.
              </p>
              <Button className="mt-4" asChild>
                <a href="/dashboard/worlds/new">Create First World</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worlds.map((world) => (
              <Card key={world.id}>
                <CardHeader>
                  <CardTitle>{world.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{world.summary}</p>
                  <div className="flex justify-between">
                    <Button variant="outline" asChild>
                      <a href={`/dashboard/worlds/${world.id}`}>Edit</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`/world/${world.slug}`}>View</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
