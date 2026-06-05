'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthForm } from '@/components/auth';
import { useAuth } from '@/lib/auth.client';

type ConfirmState = 'loading' | 'success' | 'error';

interface ErrorInfo {
  message: string;
  code?: string;
}

function ConfirmContent() {
  const { supabase } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [state, setState] = useState<ConfirmState>('loading');
  const [error, setError] = useState<ErrorInfo | null>(null);

  useEffect(() => {
    const handleConfirm = async () => {
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      if (errorParam) {
        setState('error');
        setError({
          message: errorDescription ? decodeURIComponent(errorDescription) : 'Invalid verification link. Please try again.',
          code: errorParam,
        });
        return;
      }

      // Supabase email confirmation uses token_hash + type query params
      // (not the older token + email combination)
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type') as
        | 'email'
        | 'signup'
        | 'recovery'
        | 'invite'
        | 'magiclink'
        | 'email_change'
        | null;

      // Legacy support: older Supabase versions may send ?token=xxx&type=xxx
      const legacyToken = searchParams.get('token');

      if (!type) {
        setState('error');
        setError({ message: 'Invalid verification link — missing type parameter.', code: 'MISSING_TYPE' });
        return;
      }

      if (!tokenHash && !legacyToken) {
        setState('error');
        setError({ message: 'Invalid verification link — missing token.', code: 'MISSING_TOKEN' });
        return;
      }

      try {
        let verifyError;

        if (tokenHash) {
          // Modern Supabase PKCE flow: token_hash
          ({ error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type,
          }));
        } else if (legacyToken) {
          // Legacy flow: token + type (requires email for 'email' type)
          // For legacy flows we redirect back with an error since we can't recover email
          setState('error');
          setError({
            message: 'This verification link format is outdated. Please request a new one.',
            code: 'LEGACY_TOKEN',
          });
          return;
        }

        if (verifyError) {
          setState('error');
          setError({
            message: verifyError.message || 'Verification failed. Please try again.',
            code: verifyError.code,
          });
          return;
        }

        setState('success');
        setTimeout(() => {
          router.replace('/dashboard');
        }, 1500);
      } catch {
        setState('error');
        setError({ message: 'An unexpected error occurred. Please try again.', code: 'UNKNOWN' });
      }
    };

    handleConfirm();
  }, [searchParams, supabase, router]);

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-lg text-muted-foreground animate-pulse">
              Verifying your link, please wait...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-lg text-green-600 font-medium mb-2">Verified!</p>
            <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
          </div>
        );

      case 'error':
        return (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-lg text-red-600 font-medium mb-2">Verification Failed</p>
            <p className="text-sm text-muted-foreground text-center mb-6">{error?.message}</p>
            <div className="flex flex-col gap-3 w-full">
              <Link
                href="/auth/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
              >
                Back to Sign In
              </Link>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium text-muted-foreground border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        );
    }
  };

  return <AuthForm title="Email Verification">{renderContent()}</AuthForm>;
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmContent />
    </Suspense>
  );
}
