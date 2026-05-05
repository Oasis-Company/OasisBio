/**
 * @jest-environment node
 *
 * Rate Limiting Tests
 *
 * Tests:
 * - rateLimit allows requests within window
 * - rateLimit blocks requests exceeding limit
 * - Window resets after expiry
 * - Different identifiers are tracked independently
 * - Remaining count decrements correctly
 * - withRateLimit returns null (pass) or NextResponse (block)
 * - getClientIP extracts IP from various header formats
 */

import { NextRequest } from 'next/server';
import { rateLimit, withRateLimit, getClientIP } from '@/lib/rate-limit';

// Note: We need to reset the in-memory store between tests.
// Since the store is module-level, we manipulate time via jest fake timers.

describe('rateLimit — basic functionality', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    // Reset module to clear the in-memory store
    jest.resetModules();
  });

  it('allows first request', () => {
    const result = rateLimit('test-id-1', 60_000, 5);
    expect(result.success).toBe(true);
    expect(result.limit).toBe(5);
    expect(result.remaining).toBe(4);
  });

  it('allows requests up to the limit', () => {
    const id = 'test-limit-exact';
    for (let i = 0; i < 5; i++) {
      const result = rateLimit(id, 60_000, 5);
      expect(result.success).toBe(true);
    }
  });

  it('blocks the request that exceeds the limit', () => {
    const id = 'test-block-on-exceed';
    for (let i = 0; i < 5; i++) {
      rateLimit(id, 60_000, 5);
    }
    // 6th request should be blocked
    const result = rateLimit(id, 60_000, 5);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('remaining decrements with each request', () => {
    const id = 'test-decrement';
    const r1 = rateLimit(id, 60_000, 10);
    expect(r1.remaining).toBe(9);
    const r2 = rateLimit(id, 60_000, 10);
    expect(r2.remaining).toBe(8);
    const r3 = rateLimit(id, 60_000, 10);
    expect(r3.remaining).toBe(7);
  });

  it('different identifiers are tracked independently', () => {
    const limit = 3;
    for (let i = 0; i < 3; i++) {
      rateLimit('id-A', 60_000, limit);
    }
    // id-A is exhausted, id-B should still be free
    expect(rateLimit('id-A', 60_000, limit).success).toBe(false);
    expect(rateLimit('id-B', 60_000, limit).success).toBe(true);
  });

  it('resets after window expires', () => {
    const id = 'test-reset';
    // Exhaust limit
    for (let i = 0; i < 5; i++) {
      rateLimit(id, 1_000, 5); // 1 second window
    }
    expect(rateLimit(id, 1_000, 5).success).toBe(false);

    // Advance time past the window
    jest.advanceTimersByTime(1_100);

    // Should be allowed again
    expect(rateLimit(id, 1_000, 5).success).toBe(true);
  });

  it('returns correct resetAt timestamp', () => {
    const windowMs = 60_000;
    const now = Date.now();
    const result = rateLimit('test-reset-at', windowMs, 10);
    expect(result.resetAt).toBeGreaterThanOrEqual(now + windowMs - 100);
    expect(result.resetAt).toBeLessThanOrEqual(now + windowMs + 100);
  });
});

describe('withRateLimit — middleware helper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetModules();
  });

  function buildRequest(ip = '1.2.3.4'): NextRequest {
    return new NextRequest('http://localhost/api/test', {
      headers: { 'x-real-ip': ip },
    });
  }

  it('returns null when request is within limit', () => {
    const req = buildRequest('10.0.0.1');
    const result = withRateLimit(req, 60_000, 100, '10.0.0.1');
    expect(result).toBeNull();
  });

  it('returns 429 NextResponse when limit is exceeded', () => {
    const id = 'throttled-client';
    // Exhaust limit
    for (let i = 0; i < 3; i++) {
      withRateLimit(buildRequest(), 60_000, 3, id);
    }
    const response = withRateLimit(buildRequest(), 60_000, 3, id);
    expect(response).not.toBeNull();
    expect(response!.status).toBe(429);
  });

  it('includes RateLimit headers in 429 response', async () => {
    const id = 'headers-check';
    for (let i = 0; i < 3; i++) {
      withRateLimit(buildRequest(), 60_000, 3, id);
    }
    const response = withRateLimit(buildRequest(), 60_000, 3, id);

    expect(response!.headers.get('Retry-After')).toBeDefined();
    expect(response!.headers.get('X-RateLimit-Limit')).toBe('3');
    expect(response!.headers.get('X-RateLimit-Remaining')).toBe('0');
    expect(response!.headers.get('X-RateLimit-Reset')).toBeDefined();
  });

  it('429 response body contains error code', async () => {
    const id = 'error-body-check';
    for (let i = 0; i < 2; i++) {
      withRateLimit(buildRequest(), 60_000, 2, id);
    }
    const response = withRateLimit(buildRequest(), 60_000, 2, id);
    const body = await response!.json();
    expect(body.error).toBe('rate_limit_exceeded');
  });
});

describe('getClientIP — IP extraction', () => {
  function buildReqWithHeaders(headers: Record<string, string>): NextRequest {
    return new NextRequest('http://localhost/', { headers });
  }

  it('prefers cf-connecting-ip header', () => {
    const req = buildReqWithHeaders({
      'cf-connecting-ip': '1.1.1.1',
      'x-forwarded-for': '2.2.2.2',
    });
    expect(getClientIP(req)).toBe('1.1.1.1');
  });

  it('falls back to x-forwarded-for header', () => {
    const req = buildReqWithHeaders({
      'x-forwarded-for': '3.3.3.3, 4.4.4.4',
    });
    expect(getClientIP(req)).toBe('3.3.3.3');
  });

  it('extracts first IP from x-forwarded-for chain', () => {
    const req = buildReqWithHeaders({
      'x-forwarded-for': '10.0.0.1, 172.16.0.1, 192.168.1.1',
    });
    expect(getClientIP(req)).toBe('10.0.0.1');
  });

  it('falls back to x-real-ip header', () => {
    const req = buildReqWithHeaders({ 'x-real-ip': '5.5.5.5' });
    expect(getClientIP(req)).toBe('5.5.5.5');
  });

  it('falls back to user-agent hash when no IP headers are present', () => {
    const req = buildReqWithHeaders({ 'user-agent': 'test-browser/1.0' });
    const ip = getClientIP(req);
    expect(ip).toMatch(/^[a-f0-9]{16}$/);
  });

  it('returns same hash for same user-agent', () => {
    const req1 = buildReqWithHeaders({ 'user-agent': 'SameUA/1.0' });
    const req2 = buildReqWithHeaders({ 'user-agent': 'SameUA/1.0' });
    expect(getClientIP(req1)).toBe(getClientIP(req2));
  });

  it('returns different hash for different user-agents', () => {
    const req1 = buildReqWithHeaders({ 'user-agent': 'UA-One/1.0' });
    const req2 = buildReqWithHeaders({ 'user-agent': 'UA-Two/2.0' });
    expect(getClientIP(req1)).not.toBe(getClientIP(req2));
  });
});
