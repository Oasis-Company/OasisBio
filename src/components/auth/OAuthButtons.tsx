'use client';

import React from 'react';
import { AuthButton } from './AuthButton';
import { createClient } from '@/lib/supabase/browser';

/** Google "G" color icon as inline SVG — no external CDN dependency */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z" />
      <path fill="#34A853" d="M24 48c6.5 0 12-2.1 16-5.8l-7.9-6c-2.2 1.5-5 2.4-8.1 2.4-6.2 0-11.5-4.2-13.4-9.9H2.5v6.2C6.5 42.6 14.7 48 24 48z" />
      <path fill="#FBBC05" d="M10.6 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7v-6.2H2.5C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.9l8.1-6.2z" />
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.7 0 6.5 5.4 2.5 13.1l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z" />
    </svg>
  );
}

/** GitHub Octocat icon as inline SVG */
function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export function OAuthButtons() {
  const handleOAuthSignIn = (provider: 'google' | 'github') => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <>
      <div className="my-6 flex items-center justify-center">
        <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
        <span className="mx-4 text-sm text-gray-500">or</span>
        <div className="flex-grow h-px bg-gray-200 dark:bg-gray-700"></div>
      </div>

      <div className="space-y-3">
        <AuthButton
          variant="outline"
          fullWidth
          onClick={() => handleOAuthSignIn('google')}
          className="flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <GoogleIcon />
          <span>Sign in with Google</span>
        </AuthButton>

        <AuthButton
          variant="outline"
          fullWidth
          onClick={() => handleOAuthSignIn('github')}
          className="flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-colors"
        >
          <GitHubIcon />
          <span>Sign in with GitHub</span>
        </AuthButton>
      </div>
    </>
  );
}
