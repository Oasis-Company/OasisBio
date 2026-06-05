'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth.client';
import { AuthForm, AuthButton, AuthInput, OAuthButtons } from '@/components/auth';
import { classifyOtpError, type ClassifiedOtpError } from '@/lib/auth/otp-errors';

type Step = 'email' | 'otp';

function LoginContent() {
  const { supabase, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/dashboard';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [classifiedError, setClassifiedError] = useState<ClassifiedOtpError | null>(null);
  const [success, setSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [suggestRegister, setSuggestRegister] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) router.replace(callbackUrl);
  }, [user, router, callbackUrl]);

  // Show OAuth error if redirected back from /auth/callback with an error
  useEffect(() => {
    const oauthError = searchParams.get('error');
    const oauthErrorDescription = searchParams.get('error_description');
    if (oauthError) {
      const msg = oauthErrorDescription
        ? decodeURIComponent(oauthErrorDescription)
        : oauthError === 'missing_code'
          ? 'Invalid authorization link. Please try again.'
          : oauthError === 'exchange_failed' || oauthError === 'server_error'
            ? 'Sign in failed. Please try again.'
            : 'Sign in failed: ' + oauthError;
      setClassifiedError({ message: msg, category: 'unknown', canResend: false, code: 'AUTH_008' });
    }
  }, [searchParams]);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0 && step === 'otp') {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [resendCountdown, step]);

  const handleResendOtp = async () => {
    setClassifiedError(null);
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
        setClassifiedError(classified);
        if (classified.canResend) setCanResend(true);
        if (classified.category === 'not_found') setSuggestRegister(true);
      } else {
        setClassifiedError({
          message: 'An unexpected error occurred.',
          category: 'unknown',
          canResend: true,
          code: 'AUTH_008',
        });
      }
    } else {
      setSuccess('Code sent — please check your inbox.');
      setResendCountdown(30);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setClassifiedError(null);
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
        setClassifiedError(classified);
        if (classified.canResend) setCanResend(true);
        if (classified.category === 'not_found') setSuggestRegister(true);
      } else {
        setClassifiedError({
          message: 'An unexpected error occurred.',
          category: 'unknown',
          canResend: true,
          code: 'AUTH_008',
        });
      }
    } else {
      setSuccess('Code sent — please check your inbox.');
      setStep('otp');
      setResendCountdown(30);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setClassifiedError(null);
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
        setClassifiedError(classified);
        if (classified.canResend) setCanResend(true);
      } else {
        setClassifiedError({
          message: 'An unexpected error occurred.',
          category: 'unknown',
          canResend: true,
          code: 'AUTH_008',
        });
      }
    } else {
      router.replace(callbackUrl);
    }
  };

  return (
    <AuthForm title="Sign In" error={classifiedError?.message ?? ''} success={success}>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <AuthInput
            id="email"
            type="email"
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setClassifiedError(null); }}
            required
          />
          <AuthButton type="submit" fullWidth isLoading={isSending}>
            Send Code
          </AuthButton>
          
          {classifiedError && (
            <div className="flex flex-col gap-3 mt-2">
              {classifiedError.canResend && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                  onClick={handleSendOtp}
                  disabled={isSending}
                >
                  🔄 Resend Code
                </button>
              )}
              {classifiedError.category === 'not_found' && (
                <a
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                >
                  ➕ Create an Account
                </a>
              )}
            </div>
          )}
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
            placeholder="Enter the 6-digit code"
            value={otp}
            onChange={(e) => { setOtp(e.target.value); setClassifiedError(null); }}
            required
          />
          
          <div className="flex gap-3">
            <AuthButton
              type="button"
              variant="outline"
              onClick={() => { setStep('email'); setClassifiedError(null); setSuccess(''); }}
            >
              Change Email
            </AuthButton>
            <AuthButton type="submit" isLoading={isVerifying}>
              Verify Code
            </AuthButton>
          </div>
          
          <div className="flex justify-center">
            {resendCountdown > 0 ? (
              <span className="text-sm text-muted-foreground">
                Resend in {resendCountdown}s
              </span>
            ) : canResend ? (
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={handleResendOtp}
                disabled={isSending}
              >
                {isSending ? 'Sending...' : 'Resend Code'}
              </button>
            ) : null}
          </div>
          
          {classifiedError && (
            <div className="flex flex-col gap-3">
              {classifiedError.canResend && canResend && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                  onClick={handleResendOtp}
                  disabled={isSending}
                >
                  🔄 Resend Code
                </button>
              )}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => { setStep('email'); setClassifiedError(null); setSuccess(''); }}
              >
                ✏️ Change Email Address
              </button>
            </div>
          )}
        </form>
      )}

      <OAuthButtons />

      <div className="mt-6 text-center">
        {suggestRegister ? (
          <p className="text-sm text-muted-foreground">
            No account yet?{' '}
            <a href="/auth/register" className="text-primary hover:underline font-medium">
              Create one for free
            </a>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No account yet?{' '}
            <a href="/auth/register" className="text-primary hover:underline">
              Sign up
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
