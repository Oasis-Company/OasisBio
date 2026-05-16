/**
 * OTP Error Classification Utility
 *
 * Maps raw Supabase Auth error objects into user-friendly, actionable messages.
 * Used by both login and registration pages to ensure consistent error UX.
 *
 * Error categories:
 *  - network:     Connectivity / timeout issues (retryable)
 *  - invalid:     Wrong code / expired code (resendable)
 *  - not_found:   Email doesn't exist (guide to register)
 *  - rate_limit:  Too many requests (cooldown guidance)
 *  - quota:       Email provider quota exceeded
 *  - unknown:     Fallback for unclassified errors
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OtpErrorCategory =
  | 'network'
  | 'invalid'
  | 'not_found'
  | 'rate_limit'
  | 'quota'
  | 'unknown';

export type OtpPhase = 'send' | 'verify';

export type AuthErrorCode =
  | 'AUTH_001'
  | 'AUTH_002'
  | 'AUTH_003'
  | 'AUTH_004'
  | 'AUTH_005'
  | 'AUTH_006'
  | 'AUTH_007'
  | 'AUTH_008';

export interface ClassifiedOtpError {
  /** User-facing message (safe to render) */
  message: string;
  /** Machine-readable category for UI decisions */
  category: OtpErrorCategory;
  /** Whether the user should be offered a "resend" option */
  canResend: boolean;
  /** Error code for tracking and documentation */
  code: AuthErrorCode;
}

// ---------------------------------------------------------------------------
// AUTH_001-AUTH_008 Error Code Definitions
// ---------------------------------------------------------------------------

const ERROR_MESSAGES: Record<AuthErrorCode, { zh: string; en: string }> = {
  AUTH_001: {
    zh: '网络连接失败，请检查您的网络连接后重试。',
    en: 'Unable to reach our server. Please check your internet connection and try again.',
  },
  AUTH_002: {
    zh: '验证码无效或已过期，请重新发送验证码。',
    en: 'This verification code is invalid or has expired.',
  },
  AUTH_003: {
    zh: '未找到该邮箱对应的账户，您是否需要注册一个新账户？',
    en: 'No account found with this email. Want to create one?',
  },
  AUTH_004: {
    zh: '操作次数过多，请稍后再试。',
    en: 'Too many attempts. Please wait a moment before trying again.',
  },
  AUTH_005: {
    zh: '邮件发送额度已用完，请使用 Google/GitHub 登录，或几小时后再试。',
    en: "We've hit our daily email limit. Please try again in a few hours, or use Google/GitHub sign-in instead.",
  },
  AUTH_006: {
    zh: '账户不存在，请重新登录。',
    en: 'Account not found. Please try signing in again.',
  },
  AUTH_007: {
    zh: '发送验证码时出错，请重试。',
    en: 'Something went wrong. Please try again.',
  },
  AUTH_008: {
    zh: '发生未知错误，请检查您的输入后重试。',
    en: 'Something went wrong. Please check your input and try again.',
  },
};

// ---------------------------------------------------------------------------
// Supabase error classification rules
// ---------------------------------------------------------------------------

/** Patterns that indicate a network/connectivity issue */
const NETWORK_PATTERNS = [
  'network',
  'fetch',
  'timeout',
  'failed to fetch',
  'net::err',
  'socket hang up',
  'econnrefused',
  'econnreset',
  'internet',
  'offline',
  'unable to connect',
];

/** Patterns that indicate an invalid/expired OTP token */
const INVALID_PATTERNS = [
  'invalid',
  'expired',
  'wrong',
  'incorrect',
  'token',
  'otp',
  'verification code',
  'code_expired',
  'code_invalid',
];

/** Patterns that indicate the email doesn't exist in the system */
const NOT_FOUND_PATTERNS = [
  'not found',
  'does not exist',
  'no user',
  'user_not_found',
  'record not found',
  'signup_disabled',
];

/** Patterns that indicate rate limiting */
const RATE_LIMIT_PATTERNS = [
  'rate limit',
  'too many requests',
  'throttl',
  'over_request_limit',
  'request_limit',
  'cooldown',
  'slow_down',
  'try again later',
  'frequency',
];

/** Patterns that indicate email provider quota exceeded */
const QUOTA_PATTERNS = [
  'quota',
  'exceeded',
  'limit reached',
  'email limit',
  'sending limit',
  'daily limit',
  'over_email_send_rate_limit',
  'forbidden', // Supabase returns this when email provider blocks send
];

// ---------------------------------------------------------------------------
// Classification logic
// ---------------------------------------------------------------------------

function classifyPattern(rawMessage: string): OtpErrorCategory {
  const msg = rawMessage.toLowerCase();

  if (NETWORK_PATTERNS.some((p) => msg.includes(p))) return 'network';
  if (NOT_FOUND_PATTERNS.some((p) => msg.includes(p))) return 'not_found';
  if (RATE_LIMIT_PATTERNS.some((p) => msg.includes(p))) return 'rate_limit';
  if (QUOTA_PATTERNS.some((p) => msg.includes(p))) return 'quota';
  if (INVALID_PATTERNS.some((p) => msg.includes(p))) return 'invalid';

  return 'unknown';
}

/**
 * Classifies a Supabase Auth error from the OTP flow into a user-friendly message.
 *
 * @param error - The Supabase error object (may be null)
 * @param phase - Which phase the error occurred in ('send' or 'verify')
 * @returns A classified error with message, category, and resend hint
 */
export function classifyOtpError(
  error: { message?: string } | null,
  phase: OtpPhase,
): ClassifiedOtpError | null {
  if (!error) return null;

  const rawMessage = error.message ?? '';
  const category = classifyPattern(rawMessage);

  const result: ClassifiedOtpError = {
    message: '',
    category,
    canResend: false,
    code: 'AUTH_008',
  };

  switch (category) {
    case 'network':
      result.message = ERROR_MESSAGES.AUTH_001.zh;
      result.code = 'AUTH_001';
      result.canResend = true;
      break;

    case 'invalid':
      if (phase === 'verify') {
        result.message = ERROR_MESSAGES.AUTH_002.zh;
        result.code = 'AUTH_002';
        result.canResend = true;
      } else {
        result.message = ERROR_MESSAGES.AUTH_007.zh;
        result.code = 'AUTH_007';
        result.canResend = true;
      }
      break;

    case 'not_found':
      if (phase === 'send') {
        // During login — user doesn't exist, suggest registering
        result.message = ERROR_MESSAGES.AUTH_003.zh;
        result.code = 'AUTH_003';
      } else {
        // During verify — shouldn't happen normally
        result.message = ERROR_MESSAGES.AUTH_006.zh;
        result.code = 'AUTH_006';
      }
      result.canResend = false; // Resending won't help if email doesn't exist
      break;

    case 'rate_limit':
      result.message = ERROR_MESSAGES.AUTH_004.zh;
      result.code = 'AUTH_004';
      result.canResend = false;
      break;

    case 'quota':
      result.message = ERROR_MESSAGES.AUTH_005.zh;
      result.code = 'AUTH_005';
      result.canResend = false;
      break;

    case 'unknown':
    default:
      // Don't expose raw Supabase messages — they may contain internal details
      result.message = ERROR_MESSAGES.AUTH_008.zh;
      result.code = 'AUTH_008';
      result.canResend = phase === 'send'; // Allow retry on send, be cautious on verify
      break;
  }

  return result;
}
