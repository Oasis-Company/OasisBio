/**
 * @jest-environment node
 *
 * User Sync Integration Tests — Prisma-level behavior
 *
 * Supplements the existing pure-function tests in user-sync.test.ts with
 * tests that exercise generateUniqueUsername and syncUserToPrisma against
 * a mocked Prisma client, focusing on:
 *
 * - P2002 race condition retry logic
 * - User upsert creates new records correctly
 * - Existing profile fields are never overwritten
 * - Non-P2002 Prisma errors are re-thrown
 * - Maximum retry limit is respected
 */

import { generateUniqueUsername, syncUserToPrisma, SyncResult } from '@/lib/user-sync';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// ─── Mock Prisma ──────────────────────────────────────────────────────────────

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    profile: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { prisma } from '@/lib/prisma';

const mockUser = prisma.user as jest.Mocked<typeof prisma.user>;
const mockProfile = prisma.profile as jest.Mocked<typeof prisma.profile>;

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function makeSupabaseUser(overrides: Partial<SupabaseUser> = {}): SupabaseUser {
  return {
    id: 'test-user-id-' + Math.random().toString(36).slice(2, 8),
    email: 'user@example.com',
    user_metadata: { name: 'Test User' },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    ...overrides,
  } as SupabaseUser;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('generateUniqueUsername — Prisma integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns the base username when no collision exists', async () => {
    (mockProfile.findUnique as jest.Mock).mockResolvedValue(null); // not taken

    const result = await generateUniqueUsername('alice');
    expect(result).toBe('alice');
    expect(mockProfile.findUnique).toHaveBeenCalledWith({ where: { username: 'alice' } });
  });

  it('appends suffix when base username is taken', async () => {
    (mockProfile.findUnique as jest.Mock)
      .mockResolvedValueOnce({ id: 'existing' })  // 'alice' is taken
      .mockResolvedValueOnce(null);               // 'alice1' is free

    const result = await generateUniqueUsername('alice');
    expect(result).toBe('alice1');
    expect(mockProfile.findUnique).toHaveBeenCalledTimes(2);
  });

  it('increments suffix until a free username is found', async () => {
    (mockProfile.findUnique as jest.Mock)
      .mockResolvedValueOnce({ id: '1' })   // 'bob' taken
      .mockResolvedValueOnce({ id: '2' })   // 'bob1' taken
      .mockResolvedValueOnce({ id: '3' })   // 'bob2' taken
      .mockResolvedValueOnce(null);          // 'bob3' free

    const result = await generateUniqueUsername('bob');
    expect(result).toBe('bob3');
    expect(mockProfile.findUnique).toHaveBeenCalledTimes(4);
  });

  it('strips special characters from base', async () => {
    (mockProfile.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await generateUniqueUsername('Hello World!@#');
    expect(result).toBe('helloworld');
  });

  it('falls back to user_<random> for empty/all-special base', async () => {
    (mockProfile.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await generateUniqueUsername('!@#$%^');
    expect(result).toMatch(/^user_[a-f0-9]{6}$/);
  });

  it('throws after exceeding maxAttempts limit', async () => {
    // Always return a taken profile
    (mockProfile.findUnique as jest.Mock).mockResolvedValue({ id: 'taken' });

    await expect(generateUniqueUsername('spam')).rejects.toThrow(
      'Failed to generate unique username'
    );
  });
});

describe('syncUserToPrisma — New user creation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockUser.upsert as jest.Mock).mockImplementation(({ create }) =>
      Promise.resolve({ id: create.id, email: create.email, name: create.name })
    );
    (mockProfile.findFirst as jest.Mock).mockResolvedValue(null);
    (mockProfile.create as jest.Mock).mockImplementation(({ data }) =>
      Promise.resolve({
        id: 'profile-new-id',
        userId: data.userId,
        username: data.username,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl ?? null,
      })
    );
    (mockProfile.findUnique as jest.Mock).mockResolvedValue(null); // username free
    (mockUser.findUnique as jest.Mock).mockResolvedValue(null); // shouldUpdateName check
  });

  it('creates a new user and profile for first-time login', async () => {
    const user = makeSupabaseUser({
      id: 'new-user-123',
      email: 'new@example.com',
      user_metadata: { name: 'New Person' },
    });

    const result = await syncUserToPrisma(user);

    expect(result.userId).toBe('new-user-123');
    expect(result.isNewUser).toBe(true);
    expect(result.username).toBe('newperson');

    // User upsert should have been called
    expect(mockUser.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'new-user-123' },
        create: expect.objectContaining({
          id: 'new-user-123',
          email: 'new@example.com',
          name: 'New Person',
        }),
      })
    );
  });

  it('uses email prefix as display name when user_metadata.name is absent', async () => {
    const user = makeSupabaseUser({
      id: 'user-no-name',
      email: 'someone@domain.com',
      user_metadata: {},
    });

    await syncUserToPrisma(user);

    // Profile should be created with username derived from email prefix
    const createCall = (mockProfile.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.username).toBe('someone');
  });

  it('falls back to "User" when email is also absent', async () => {
    const user = makeSupabaseUser({
      id: 'user-no-email',
      email: undefined,
      user_metadata: {},
    });

    await syncUserToPrisma(user);

    const createCall = (mockProfile.create as jest.Mock).mock.calls[0][0];
    // displayName should be 'User', username derived from 'User' → 'user'
    expect(createCall.data.displayName).toBe('User');
  });

  it('includes avatarUrl from user_metadata when creating profile', async () => {
    const user = makeSupabaseUser({
      user_metadata: {
        name: 'Jane',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    });

    await syncUserToPrisma(user);

    const createCall = (mockProfile.create as jest.Mock).mock.calls[0][0];
    expect(createCall.data.avatarUrl).toBe('https://example.com/avatar.jpg');
  });
});

describe('syncUserToPrisma — Existing user update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockUser.upsert as jest.Mock).mockResolvedValue({
      id: 'existing-user-id',
      email: 'old@example.com',
      name: 'Old Name',
    });
    (mockUser.findUnique as jest.Mock).mockResolvedValue({
      name: 'Old Name', // name exists → shouldUpdateName = false
    });
  });

  it('updates existing profile only for empty fields', async () => {
    (mockProfile.findFirst as jest.Mock).mockResolvedValue({
      id: 'profile-existing',
      userId: 'existing-user-id',
      username: 'existinguser',
      displayName: 'My Custom Name', // User-edited — must NOT be overwritten
      avatarUrl: null,               // Empty — can be filled
    });
    (mockProfile.update as jest.Mock).mockResolvedValue({
      id: 'profile-existing',
      username: 'existinguser',
      displayName: 'My Custom Name',
      avatarUrl: 'https://example.com/new.jpg',
    });

    const user = makeSupabaseUser({
      id: 'existing-user-id',
      email: 'old@example.com',
      user_metadata: {
        name: 'New OAuth Name', // Should NOT overwrite 'My Custom Name'
        avatar_url: 'https://example.com/new.jpg',
      },
    });

    const result = await syncUserToPrisma(user);

    expect(result.isNewUser).toBe(false);

    // Profile.update should only include avatarUrl, not displayName
    const updateCall = (mockProfile.update as jest.Mock).mock.calls[0][0];
    expect(updateCall.data.avatarUrl).toBe('https://example.com/new.jpg');
    expect(updateCall.data.displayName).toBeUndefined();
  });

  it('does not call profile.update when all fields are already populated', async () => {
    (mockProfile.findFirst as jest.Mock).mockResolvedValue({
      id: 'profile-full',
      userId: 'existing-user-id',
      username: 'fulluser',
      displayName: 'Full Name',    // Already populated
      avatarUrl: 'https://existing-avatar.com/img.jpg',  // Already populated
    });

    const user = makeSupabaseUser({
      id: 'existing-user-id',
      user_metadata: {
        name: 'New Name',
        avatar_url: 'https://new-avatar.com/img.jpg',
      },
    });

    await syncUserToPrisma(user);

    // No updates needed — profile is already fully populated
    expect(mockProfile.update).not.toHaveBeenCalled();
  });
});

describe('syncUserToPrisma — Race condition: P2002 retry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockUser.upsert as jest.Mock).mockResolvedValue({
      id: 'race-user-id',
      email: 'race@example.com',
      name: 'Race User',
    });
    (mockProfile.findFirst as jest.Mock).mockResolvedValue(null);
    (mockUser.findUnique as jest.Mock).mockResolvedValue(null);
    (mockProfile.findUnique as jest.Mock).mockResolvedValue(null); // username generation
  });

  it('retries profile creation on username P2002 conflict', async () => {
    const p2002Error = Object.assign(new Error('Unique constraint violation'), {
      code: 'P2002',
      meta: { target: ['username'] },
    });

    (mockProfile.create as jest.Mock)
      .mockRejectedValueOnce(p2002Error)  // first attempt fails
      .mockResolvedValueOnce({             // second attempt succeeds
        id: 'profile-retry-id',
        userId: 'race-user-id',
        username: 'raceuser_1a2b',
        displayName: 'Race User',
        avatarUrl: null,
      });

    const user = makeSupabaseUser({
      id: 'race-user-id',
      email: 'race@example.com',
      user_metadata: { name: 'Race User' },
    });

    const result = await syncUserToPrisma(user);

    expect(result.isNewUser).toBe(true);
    expect(mockProfile.create).toHaveBeenCalledTimes(2);
  });

  it('throws immediately on non-P2002 Prisma errors', async () => {
    const otherError = Object.assign(new Error('Connection timeout'), { code: 'P1001' });
    (mockProfile.create as jest.Mock).mockRejectedValue(otherError);

    const user = makeSupabaseUser({ id: 'err-user-id' });

    await expect(syncUserToPrisma(user)).rejects.toThrow('Connection timeout');
  });

  it('throws after maxRetries P2002 conflicts are exhausted', async () => {
    const p2002Error = Object.assign(new Error('Unique constraint'), {
      code: 'P2002',
      meta: { target: ['username'] },
    });

    // Always fail with P2002
    (mockProfile.create as jest.Mock).mockRejectedValue(p2002Error);

    const user = makeSupabaseUser({ id: 'max-retry-user' });

    await expect(syncUserToPrisma(user)).rejects.toThrow();
    // maxRetries = 3, so create should be called at most 3 times
    expect(mockProfile.create).toHaveBeenCalledTimes(3);
  });
});
