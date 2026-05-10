'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth.client';
import { AuthForm, AuthButton, AuthInput, OAuthButtons } from '@/components/auth';
import { classifyOtpError } from '@/lib/auth/otp-errors';

type Step = 'email' | 'otp';

function LoginContent() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [suggestRegister, setSuggestRegister] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace(callbackUrl);
  }, [user, router, callbackUrl]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSuggestRegister(false);
    setIsSending(true);
    setCanResend(false);

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    setIsSending(false);

    if (sendError) {
      const classified = classifyOtpError(sendError, 'send');
      if (classified) {
        setError(classified.message);
        if (classified.canResend) setCanResend(true);
        if (classified.category === 'not_found') setSuggestRegister(true);
      } else {
        setError('An unknown error occurred');
      }
    } else {
      setSuccess('Verification code sent — check your inbox');
      setStep('otp');
      // Allow resend after 30 seconds
      setTimeout(() => setCanResend(true), 30_000);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuggestRegister(false);
    setIsVerifying(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    setIsVerifying(false);

    if (verifyError) {
      const classified = classifyOtpError(verifyError, 'verify');
      if (classified) {
        setError(classified.message);
        if (classified.canResend) setCanResend(true);
      } else {
        setError('An unknown error occurred');
      }
    } else {
      // onAuthStateChange in SessionProvider will update context;
      // router.replace triggers after session state updates via useEffect above
      router.replace(callbackUrl);
    }
  };

  return (
    <AuthForm title="Sign In" error={error} success={success}>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <AuthInput
            id="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            required
          />
          <AuthButton type="submit" fullWidth isLoading={isSending}>
            Send Verification Code
          </AuthButton>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <AuthInput
            id="email"
            type="email"
            label="Email"
            value={email}
            onChange={() => {}}
            disabled
            required
          />
          <AuthInput
            id="otp"
            type="text"
            label="Verification Code"
            placeholder="Enter 6-digit code"
            value={otp}
            onChange={(e) => { setOtp(e.target.value); setError(''); }}
            required
          />
          <div className="flex gap-3">
            <AuthButton
              type="button"
              variant="outline"
              onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
            >
              Change Email
            </AuthButton>
            <AuthButton type="submit" isLoading={isVerifying}>
              Verify Code
            </AuthButton>
          </div>
          {canResend && (
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => { setStep('email'); setError(''); setSuccess(''); }}
            >
              Resend verification code
            </button>
          )}
        </form>
      )}

      <OAuthButtons />

      <div className="mt-6 text-center">
        {suggestRegister ? (
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href="/auth/register" className="text-primary hover:underline font-medium">
              Create one — it&apos;s free
            </a>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <a href="/auth/register" className="text-primary hover:underline">
              Sign Up
            </a>
          </p>
        )}
      </div>
    </AuthForm>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
