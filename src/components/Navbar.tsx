import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          OasisBio
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/features" className="text-foreground hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="/docs" className="text-foreground hover:text-primary transition-colors">
            Docs
          </Link>
          {session ? (
            <div className="flex items-center space-x-2">
              <span className="text-foreground">{session.user?.name}</span>
              <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
            </div>
          ) : (
            <>
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
