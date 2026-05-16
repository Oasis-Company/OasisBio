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
          ? '授权链接无效，请重新尝试'
          : oauthError === 'exchange_failed' || oauthError === 'server_error'
            ? '登录失败，请重新尝试'
            : '登录失败：' + oauthError;
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
          message: '发生未知错误',
          category: 'unknown',
          canResend: true,
          code: 'AUTH_008',
        });
      }
    } else {
      setSuccess('验证码已发送，请查收您的邮箱');
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
          message: '发生未知错误',
          category: 'unknown',
          canResend: true,
          code: 'AUTH_008',
        });
      }
    } else {
      setSuccess('验证码已发送，请查收您的邮箱');
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
          message: '发生未知错误',
          category: 'unknown',
          canResend: true,
          code: 'AUTH_008',
        });
      }
    } else {
      // onAuthStateChange in SessionProvider will update context;
      // router.replace triggers after session state updates via useEffect above
      router.replace(callbackUrl);
    }
  };

  return (
    <AuthForm title="登录" error={classifiedError?.message ?? ''} success={success}>
      {step === 'email' ? (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <AuthInput
            id="email"
            type="email"
            label="邮箱"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setClassifiedError(null); }}
            required
          />
          <AuthButton type="submit" fullWidth isLoading={isSending}>
            发送验证码
          </AuthButton>
          
          {/* 可操作的错误处理按钮 */}
          {classifiedError && (
            <div className="flex flex-col gap-3 mt-2">
              {classifiedError.canResend && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                  onClick={handleSendOtp}
                  disabled={isSending}
                >
                  🔄 重新发送验证码
                </button>
              )}
              {classifiedError.category === 'not_found' && (
                <a
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-primary border border-primary rounded-md hover:bg-primary/5 transition-colors"
                >
                  ➕ 注册新账户
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
            label="邮箱"
            value={email}
            onChange={() => {}}
            disabled
            required
          />
          <AuthInput
            id="otp"
            type="text"
            label="验证码"
            placeholder="请输入6位验证码"
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
              更改邮箱
            </AuthButton>
            <AuthButton type="submit" isLoading={isVerifying}>
              验证验证码
            </AuthButton>
          </div>
          
          {/* 重新发送按钮 */}
          <div className="flex justify-center">
            {resendCountdown > 0 ? (
              <span className="text-sm text-muted-foreground">
                {resendCountdown} 秒后可重新发送
              </span>
            ) : canResend ? (
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={handleResendOtp}
                disabled={isSending}
              >
                {isSending ? '发送中...' : '重新发送验证码'}
              </button>
            ) : null}
          </div>
          
          {/* 可操作的错误处理按钮 */}
          {classifiedError && (
            <div className="flex flex-col gap-3">
              {classifiedError.canResend && canResend && (
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-red-600 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                  onClick={handleResendOtp}
                  disabled={isSending}
                >
                  🔄 重新发送验证码
                </button>
              )}
              <button
                type="button"
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => { setStep('email'); setClassifiedError(null); setSuccess(''); }}
              >
                ✏️ 更改邮箱地址
              </button>
            </div>
          )}
        </form>
      )}

      <OAuthButtons />

      <div className="mt-6 text-center">
        {suggestRegister ? (
          <p className="text-sm text-muted-foreground">
            还没有账户？{' '}
            <a href="/auth/register" className="text-primary hover:underline font-medium">
              免费创建一个
            </a>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            还没有账户？{' '}
            <a href="/auth/register" className="text-primary hover:underline">
              注册
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
