'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white text-black border-b border-gray-100 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          OasisBio
        </Link>
        <div className="flex items-center space-x-8">
          <Link href="/about" className="text-gray-800 hover:text-black transition-colors text-sm font-medium tracking-wide">
            About
          </Link>
          <Link href="/explore" className="text-gray-800 hover:text-black transition-colors text-sm font-medium tracking-wide">
            Explore
          </Link>
          <Link href="/templates" className="text-gray-800 hover:text-black transition-colors text-sm font-medium tracking-wide">
            Templates
          </Link>
          <Link href="/manifesto" className="text-gray-800 hover:text-black transition-colors text-sm font-medium tracking-wide">
            Manifesto
          </Link>
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-gray-800 hover:text-black transition-colors text-sm font-medium tracking-wide">
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Button asChild size="sm">
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="secondary" asChild size="sm">
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
