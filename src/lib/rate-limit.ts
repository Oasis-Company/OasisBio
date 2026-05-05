import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ─────────────────────────────────────────────
// In-memory rate limit store.
//
// NOTE: This is a single-process in-memory store. It works correctly for:
//   - Local development (single instance)
//   - Single-instance Vercel/Node.js deployment
//
// For multi-instance or serverless (Cloudflare Workers) deployments,
// replace with an external store:
//   - Vercel Edge → use @upstash/redis or KV namespace
//   - Cloudflare Workers → use Durable Objects or KV binding
//   - Self-hosted multi-node → use Redis (ioredis)
//
// The interface (rateLimit / withRateLimit) stays the same — only the
// store implementation needs swapping.
// ─────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}

// ─────────────────────────────────────────────
// Rate limit function
// ─────────────────────────────────────────────

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Sliding window rate limiter.
 *
 * @param identifier - Unique identifier for the client (e.g., IP address, user ID)
 * @param windowMs - Time window in milliseconds
 * @param maxRequests - Maximum number of requests allowed within the window
 * @returns RateLimitResult indicating whether the request is allowed
 */
export function rateLimit(
  identifier: string,
  windowMs: number = 60_000,
  maxRequests: number = 30
): RateLimitResult {
  cleanupStore();

  const now = Date.now();
  const resetAt = now + windowMs;
  const key = `rate-limit:${identifier}`;

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    // First request or window expired — create new entry
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      limit: maxRequests,
      remaining: maxRequests - 1,
      resetAt,
    };
  }

  // Within window — increment count
  entry.count++;
  store.set(key, entry);

  const allowed = entry.count <= maxRequests;
  return {
    success: allowed,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - entry.count),
    resetAt: entry.resetAt,
  };
}

// ─────────────────────────────────────────────
// Helper: Get client IP from NextRequest
// ─────────────────────────────────────────────

export function getClientIP(request: NextRequest): string {
  // Check common IP headers (proxies, Cloudflare, etc.)
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  const xForwardedFor = request.headers.get('x-forwarded-for');
  if (xForwardedFor) {
    // x-forwarded-for may contain multiple IPs: "client, proxy1, proxy2"
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = request.headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  // Fallback: use a hash of the user agent + other headers as identifier
  const ua = request.headers.get('user-agent') ?? '';
  return crypto.createHash('sha256').update(ua).digest('hex').slice(0, 16);
}

// ─────────────────────────────────────────────
// Rate limit middleware helper
// ─────────────────────────────────────────────

export function withRateLimit(
  request: NextRequest,
  windowMs: number,
  maxRequests: number,
  identifier?: string
): NextResponse | null {
  const id = identifier ?? getClientIP(request);
  const result = rateLimit(id, windowMs, maxRequests);

  if (!result.success) {
    return NextResponse.json(
      {
        error: 'rate_limit_exceeded',
        error_description: `Too many requests. Limit: ${result.limit} per ${windowMs / 1000}s.`,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
        },
      }
    );
  }

  return null;
}
