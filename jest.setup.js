// jest.setup.js
import '@testing-library/jest-dom';

// Set required environment variables for tests
process.env.OAUTH_JWT_SECRET = 'test-jwt-secret-for-unit-tests-only';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.SUPABASE_WEBHOOK_SECRET = 'test-webhook-secret-32chars-minimum';

// Mock server-only to allow testing server-only modules
jest.mock('server-only', () => ({}));

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  }),
}));

// Mock Supabase auth client (browser-side)
jest.mock('@/lib/supabase/browser', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: jest.fn(() => ({ data: { subscription: { unsubscribe: jest.fn() } } })),
      signOut: jest.fn().mockResolvedValue({ error: null }),
    },
  })),
}));

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  })),
}));
