import 'server-only';

// ─────────────────────────────────────────────
// Required environment variables
// ─────────────────────────────────────────────

const requiredVars = {
  OAUTH_JWT_SECRET: process.env.OAUTH_JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;

type RequiredKey = keyof typeof requiredVars;

// ─────────────────────────────────────────────
// Cloudflare R2 config
// ─────────────────────────────────────────────

const r2Vars = {
  CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  CLOUDFLARE_R2_ENDPOINT: process.env.CLOUDFLARE_R2_ENDPOINT,
  CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
} as const;

type R2Key = keyof typeof r2Vars;

// ─────────────────────────────────────────────
// Public getters (throw if missing)
// ─────────────────────────────────────────────

export function getEnv(key: RequiredKey): string {
  const value = requiredVars[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getR2Env(key: R2Key): string {
  const value = r2Vars[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// ─────────────────────────────────────────────
// Validated config objects (lazy, throws on access if missing)
// ─────────────────────────────────────────────

export const oauthConfig = {
  get jwtSecret(): string {
    return getEnv('OAUTH_JWT_SECRET');
  },
};

export const supabaseConfig = {
  get url(): string {
    return getEnv('NEXT_PUBLIC_SUPABASE_URL');
  },
  get anonKey(): string {
    return getEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  },
  get serviceRoleKey(): string {
    return getEnv('SUPABASE_SERVICE_ROLE_KEY');
  },
  get webhookSecret(): string | undefined {
    return process.env.SUPABASE_WEBHOOK_SECRET; // Optional - only validated at runtime
  },
};

export const r2Config = {
  get accessKeyId(): string {
    return getR2Env('CLOUDFLARE_R2_ACCESS_KEY_ID');
  },
  get secretAccessKey(): string {
    return getR2Env('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
  },
  get endpoint(): string {
    return getR2Env('CLOUDFLARE_R2_ENDPOINT');
  },
  get bucketName(): string {
    return getR2Env('CLOUDFLARE_R2_BUCKET_NAME');
  },
  get accountId(): string {
    return getR2Env('CLOUDFLARE_R2_ACCOUNT_ID');
  },
};

// ─────────────────────────────────────────────
// Startup validation
// ─────────────────────────────────────────────

let validated = false;

export function validateConfig(): void {
  if (validated) return;
  validated = true;

  const missing: string[] = [];

  for (const [key, value] of Object.entries(requiredVars)) {
    if (value === undefined || value === '') {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Configuration validation failed. Missing environment variables:\n  - ${missing.join('\n  - ')}\n\n` +
      'Please set these variables before starting the server.'
    );
  }
}

// Auto-validate in non-production or when explicitly enabled
if (process.env.NODE_ENV !== 'production' || process.env.VALIDATE_CONFIG === 'true') {
  try {
    validateConfig();
  } catch (err) {
    console.error('[config]', (err as Error).message);
  }
}
