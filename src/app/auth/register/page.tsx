'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth.client';
import { AuthForm, AuthButton, AuthInput, OAuthButtons } from '@/components/auth';
import { classifyOtpError } from '@/lib/auth/otp-errors';
import { useToast } from '@/components/Toast';

type Step = 'form' | 'otp';

export default function RegisterPage() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const { success: toastSuccess } = useToast();

  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [suggestLogin, setSuggestLogin] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSuggestLogin(false);
    setIsSubmitting(true);

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
        data: { display_name: displayName.trim() || email.split('@')[0] },
      },
    });

    setIsSubmitting(false);

    if (sendError) {
      const classified = classifyOtpError(sendError, 'send');
      // Override for "already registered" — classifyOtpError may not catch this
      // since Supabase OTP doesn't always distinguish it at send time
      const msgLower = sendError.message.toLowerCase();
      if (
        msgLower.includes('already registered') ||
        msgLower.includes('already exists')
      ) {
        setError('This email is already registered. Please sign in instead.');
        setSuggestLogin(true);
      } else if (classified) {
        setError(classified.message);
        if (classified.canResend) setCanResend(true);
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
    setSuggestLogin(false);
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
      toastSuccess(`Welcome to OasisBio, ${displayName || 'there'}! 👋 Your identity universe starts here.`);
      router.replace('/dashboard');
    }
  };

  return (
    <AuthForm title="Create Account" error={error} success={success}>
      {step === 'form' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <AuthInput
            id="displayName"
            type="text"
            label="Display Name"
            placeholder="How should we call you?"
            value={displayName}
            onChange={(e) => { setDisplayName(e.target.value); setError(''); }}
          />
          <AuthInput
            id="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
            required
          />
          <AuthButton type="submit" fullWidth isLoading={isSubmitting}>
            Continue with Email
          </AuthButton>
            <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="underline hover:text-foreground transition-colors">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
          </p>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">Email</label>
            <button
              type="button"
              className="text-xs text-primary hover:underline"
              onClick={() => { setStep('form'); setError(''); setSuccess(''); }}
            >
              Change email
            </button>
          </div>
          <input
            type="email"
            value={email}
            disabled
            className="w-full px-3 py-2 border border-input rounded-md bg-muted text-muted-foreground text-sm cursor-not-allowed"
            readOnly
          />
          <p className="text-xs text-muted-foreground">
            Check your inbox (and spam folder) for a 6-digit code from OasisBio.
          </p>
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
              onClick={() => { setStep('form'); setError(''); setSuccess(''); }}
            >
              ← Back
            </AuthButton>
            <AuthButton type="submit" isLoading={isVerifying}>
              Verify & Create Account
            </AuthButton>
          </div>
          {canResend ? (
            <button
              type="button"
              className="text-sm text-primary hover:underline w-text-center mx-auto block"
              onClick={handleSendOtp}
            >
              Didn't get the code? Resend verification code
            </button>
          ) : (
            <p className="text-xs text-center text-muted-foreground">
              Didn't get the code? You can resend in 30 seconds.
            </p>
          )}
        </form>
      )}

      <OAuthButtons />

      <div className="mt-6 text-center">
        {suggestLogin ? (
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary hover:underline font-medium">
              Sign In
            </a>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary hover:underline">
              Sign In
            </a>
          </p>
        )}
      </div>
    </AuthForm>
  );
}
