import React from 'react';
import Link from 'next/link';
import { Button } from './Button';

export function Navbar() {
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
          <Button>Sign In</Button>
          <Button variant="secondary">Sign Up</Button>
        </div>
      </div>
    </nav>
  );
}
