'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useSession, signOut } from '@/lib/auth.client';

export function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background text-foreground border-b border-border z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-bold tracking-tight">
          OasisBio
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/about" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide">
            About
          </Link>
          <Link href="/explore" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide">
            Explore
          </Link>
          <Link href="/templates" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide">
            Templates
          </Link>
          <Link href="/manifesto" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide">
            Manifesto
          </Link>
          {session ? (
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide">
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
        
        {/* Mobile Navigation Toggle */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? 'Close' : 'Menu'}
          </Button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link href="/about" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide py-2">
              About
            </Link>
            <Link href="/explore" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide py-2">
              Explore
            </Link>
            <Link href="/templates" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide py-2">
              Templates
            </Link>
            <Link href="/manifesto" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide py-2">
              Manifesto
            </Link>
            {session ? (
              <div className="flex flex-col space-y-2">
                <Link href="/dashboard" className="text-foreground hover:opacity-80 transition-colors text-sm font-medium tracking-wide py-2">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={() => signOut()}>Sign Out</Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
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
      )}
    </nav>
  );
}
