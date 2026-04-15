'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth.client';
import { AuthForm, AuthButton, AuthInput, OAuthButtons } from '@/components/auth';

type Step = 'form' | 'otp';

export default function RegisterPage() {
  const { supabase, user } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<Step>('form');
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace('/dashboard');
  }, [user, router]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
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
      // Supabase OTP doesn't distinguish "user exists" at send time —
      // both new and existing users receive a code. Guide them to login if needed.
      if (
        sendError.message.toLowerCase().includes('already registered') ||
        sendError.message.toLowerCase().includes('already exists')
      ) {
        setError('This email is already registered. Please sign in instead.');
      } else {
        setError(sendError.message || 'Failed to send verification code');
      }
    } else {
      setSuccess('Verification code sent — check your inbox');
      setStep('otp');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    setIsVerifying(false);

    if (verifyError) {
      setError('Invalid or expired verification code');
    } else {
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
              onClick={() => { setStep('form'); setError(''); setSuccess(''); }}
            >
              Go Back
            </AuthButton>
            <AuthButton type="submit" isLoading={isVerifying}>
              Verify & Create Account
            </AuthButton>
          </div>
        </form>
      )}

      <OAuthButtons />

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="/auth/login" className="text-primary hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </AuthForm>
  );
}
