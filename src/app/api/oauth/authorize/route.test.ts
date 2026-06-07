/**
 * @jest-environment node
 *
 * OAuth Authorization Code Flow Integration Tests
 *
 * Tests:
 * - Full authorization code grant flow (with PKCE)
 * - CSRF protection enforcement
 * - Session authentication enforcement
 * - Decision=deny flow
 * - Code generation uniqueness
 */

import { NextRequest } from 'next/server';
import { POST } from './route';
import { generateCodeChallenge, generateSecret } from '@/lib/oauth/crypto';

// ─── Module Mocks ─────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    oauthAuthorizationCode: {
      create: jest.fn(),
    },
    oauthApp: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/csrf', () => ({
  withCSRF: jest.fn(),
}));

// ─── Import Mocked Modules ────────────────────────────────────────────────────

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { withCSRF } from '@/lib/csrf';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockWithCSRF = withCSRF as jest.MockedFunction<typeof withCSRF>;

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function buildRequest(body: Record<string, unknown>, csrfCookie?: string): NextRequest {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (csrfCookie) {
    headers['cookie'] = `csrf-token=${csrfCookie}`;
    headers['x-csrf-token'] = csrfCookie;
  }
  return new NextRequest('http://localhost/api/oauth/authorize', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

function mockAuthenticatedUser(userId = 'user-abc-123') {
  const supabaseClient = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: { id: userId } },
        error: null,
      }),
    },
  };
  mockCreateClient.mockResolvedValue(supabaseClient as unknown as Awaited<ReturnType<typeof createClient>>);
}

function mockUnauthenticatedUser() {
  const supabaseClient = {
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      }),
    },
  };
  mockCreateClient.mockResolvedValue(supabaseClient as unknown as Awaited<ReturnType<typeof createClient>>);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/oauth/authorize — Authorization Code Flow', () => {
  const CLIENT_ID = 'client-test-123';
  const REDIRECT_URI = 'https://app.example.com/callback';
  const SCOPE = 'profile oasisbios:read';
  const STATE = 'random-state-value';

  beforeEach(() => {
    jest.clearAllMocks();
    // Default: CSRF passes
    mockWithCSRF.mockReturnValue(null);
    // Default: DB create succeeds
    (mockPrisma.oauthAuthorizationCode.create as jest.Mock).mockResolvedValue({});
    // Default: OAuth app exists
    (mockPrisma.oauthApp.findUnique as jest.Mock).mockResolvedValue({
      id: CLIENT_ID,
      clientId: CLIENT_ID,
      name: 'Test App',
      redirectUris: [REDIRECT_URI],
      scopes: ['profile', 'oasisbios:read', 'oasisbios:write'],
    });
  });

  // ── 1. CSRF Protection ────────────────────────────────────────────────────

  describe('CSRF protection', () => {
    it('rejects request when CSRF validation fails', async () => {
      const { NextResponse } = jest.requireActual('next/server');
      mockWithCSRF.mockReturnValue(
        NextResponse.json({ error: 'invalid_csrf_token' }, { status: 403 })
      );

      const req = buildRequest({ decision: 'allow' });
      const res = await POST(req);

      expect(res.status).toBe(403);
      expect(mockCreateClient).not.toHaveBeenCalled();
    });

    it('proceeds when CSRF validation passes', async () => {
      mockWithCSRF.mockReturnValue(null); // CSRF OK
      mockAuthenticatedUser();

      const codeVerifier = generateSecret(32);
      const codeChallenge = generateCodeChallenge(codeVerifier);

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        codeChallenge,
        codeChallengeMethod: 'S256',
        decision: 'allow',
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      expect(body.redirectUrl).toContain(REDIRECT_URI);
    });
  });

  // ── 2. Authentication Enforcement ────────────────────────────────────────

  describe('session authentication', () => {
    it('returns 401 when user is not authenticated', async () => {
      mockUnauthenticatedUser();

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        codeChallenge: 'challenge',
        decision: 'allow',
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(401);
      expect(body.error).toBe('unauthenticated');
    });

    it('uses server-side userId, not client-provided userId', async () => {
      const SERVER_USER_ID = 'server-user-999';
      mockAuthenticatedUser(SERVER_USER_ID);

      const codeVerifier = generateSecret(32);
      const codeChallenge = generateCodeChallenge(codeVerifier);

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        codeChallenge,
        codeChallengeMethod: 'S256',
        decision: 'allow',
        // Attacker tries to inject a different userId — must be ignored
        userId: 'attacker-user-000',
      });

      await POST(req);

      const createCall = (mockPrisma.oauthAuthorizationCode.create as jest.Mock).mock.calls[0][0];
      expect(createCall.data.userId).toBe(SERVER_USER_ID);
      expect(createCall.data.userId).not.toBe('attacker-user-000');
    });
  });

  // ── 3. Decision = deny ────────────────────────────────────────────────────

  describe('user denies authorization', () => {
    it('redirects with access_denied error when decision is deny', async () => {
      mockAuthenticatedUser();

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        decision: 'deny',
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);
      const url = new URL(body.redirectUrl);
      expect(url.searchParams.get('error')).toBe('access_denied');
      expect(url.searchParams.get('state')).toBe(STATE);
      expect(mockPrisma.oauthAuthorizationCode.create).not.toHaveBeenCalled();
    });

    it('does not create authorization code when decision is denied', async () => {
      mockAuthenticatedUser();

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        decision: 'reject',
      });

      await POST(req);

      expect(mockPrisma.oauthAuthorizationCode.create).not.toHaveBeenCalled();
    });
  });

  // ── 4. Successful Authorization Code Generation ───────────────────────────

  describe('authorization code generation', () => {
    it('creates authorization code with correct fields', async () => {
      const USER_ID = 'user-xyz-789';
      mockAuthenticatedUser(USER_ID);

      const codeVerifier = generateSecret(32);
      const codeChallenge = generateCodeChallenge(codeVerifier);

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        codeChallenge,
        codeChallengeMethod: 'S256',
        decision: 'allow',
      });

      const res = await POST(req);
      const body = await res.json();

      expect(res.status).toBe(200);

      // Verify the code was saved with correct data
      const createArgs = (mockPrisma.oauthAuthorizationCode.create as jest.Mock).mock.calls[0][0];
      expect(createArgs.data.clientId).toBe(CLIENT_ID);
      expect(createArgs.data.userId).toBe(USER_ID);
      expect(createArgs.data.redirectUri).toBe(REDIRECT_URI);
      expect(createArgs.data.scope).toBe(SCOPE);
      expect(createArgs.data.codeChallenge).toBe(codeChallenge);
      expect(createArgs.data.code).toHaveLength(64); // generateSecret(32) → 64 hex chars
      expect(createArgs.data.expiresAt).toBeInstanceOf(Date);

      // Verify code expires in ~10 minutes
      const expiresAt = createArgs.data.expiresAt as Date;
      const ttlMs = expiresAt.getTime() - Date.now();
      expect(ttlMs).toBeGreaterThan(9 * 60 * 1000);  // > 9 min
      expect(ttlMs).toBeLessThan(11 * 60 * 1000);    // < 11 min
    });

    it('returns redirect URL with code and state params', async () => {
      mockAuthenticatedUser();

      const codeVerifier = generateSecret(32);
      const codeChallenge = generateCodeChallenge(codeVerifier);

      const req = buildRequest({
        clientId: CLIENT_ID,
        redirectUri: REDIRECT_URI,
        scope: SCOPE,
        state: STATE,
        codeChallenge,
        codeChallengeMethod: 'S256',
        decision: 'allow',
      });

      const res = await POST(req);
      const body = await res.json();

      const redirectUrl = new URL(body.redirectUrl);
      expect(redirectUrl.searchParams.has('code')).toBe(true);
      expect(redirectUrl.searchParams.get('state')).toBe(STATE);
      expect(redirectUrl.searchParams.get('code')).toHaveLength(64);
    });

    it('generates unique authorization codes on each request', async () => {
      mockAuthenticatedUser();
      (mockPrisma.oauthAuthorizationCode.create as jest.Mock).mockResolvedValue({});

      const codes = new Set<string>();

      for (let i = 0; i < 20; i++) {
        const codeVerifier = generateSecret(32);
        const codeChallenge = generateCodeChallenge(codeVerifier);

        const req = buildRequest({
          clientId: CLIENT_ID,
          redirectUri: REDIRECT_URI,
          scope: SCOPE,
          state: STATE,
          codeChallenge,
          decision: 'allow',
        });

        const res = await POST(req);
        const body = await res.json();
        const url = new URL(body.redirectUrl);
        codes.add(url.searchParams.get('code')!);
      }

      // All 20 codes must be unique
      expect(codes.size).toBe(20);
    });
  });
});
