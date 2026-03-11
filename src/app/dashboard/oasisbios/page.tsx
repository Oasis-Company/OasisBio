'use client';

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useRouter } from 'next/navigation';

export default function OasisBiosPage() {
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

  // Mock data for now
  const oasisBios: any[] = [];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My OasisBios</h1>
          <Button asChild>
            <a href="/dashboard/oasisbios/new">Create New OasisBio</a>
          </Button>
        </div>

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
              <Card key={oasisBio.id}>
                <CardHeader>
                  <CardTitle>{oasisBio.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{oasisBio.tagline}</p>
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
      </div>
    </div>
  );
}
