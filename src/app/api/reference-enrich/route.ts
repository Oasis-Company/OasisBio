/**
 * POST /api/reference-enrich
 *
 * Fetches metadata (title, description, cover image, provider) for a given URL.
 * Used when a user adds a reference link — enriches it before saving to the DB.
 *
 * This is the Next.js API route equivalent of the planned `reference-enrich`
 * Supabase Edge Function. See docs/edge-functions.md for the migration guide.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import crypto from 'crypto';

// ─────────────────────────────────────────────
// Provider detection
// ─────────────────────────────────────────────

function detectProvider(url: string): { provider: string; sourceType: string } {
  try {
    const { hostname } = new URL(url);
    const host = hostname.replace(/^www\./, '');

    if (host.includes('youtube.com') || host.includes('youtu.be')) return { provider: 'YouTube', sourceType: 'video' };
    if (host.includes('twitter.com') || host.includes('x.com')) return { provider: 'X (Twitter)', sourceType: 'social' };
    if (host.includes('github.com')) return { provider: 'GitHub', sourceType: 'code' };
    if (host.includes('wikipedia.org')) return { provider: 'Wikipedia', sourceType: 'article' };
    if (host.includes('reddit.com')) return { provider: 'Reddit', sourceType: 'social' };
    if (host.includes('medium.com') || host.includes('substack.com')) return { provider: host, sourceType: 'article' };
    if (host.includes('bilibili.com')) return { provider: 'Bilibili', sourceType: 'video' };
    if (host.includes('pixiv.net')) return { provider: 'Pixiv', sourceType: 'artwork' };
    if (host.includes('artstation.com')) return { provider: 'ArtStation', sourceType: 'artwork' };
    if (host.includes('deviantart.com')) return { provider: 'DeviantArt', sourceType: 'artwork' };

    return { provider: host, sourceType: 'website' };
  } catch {
    return { provider: 'unknown', sourceType: 'website' };
  }
}

// ─────────────────────────────────────────────
// Metadata extraction from HTML
// ─────────────────────────────────────────────

function extractMeta(html: string, baseUrl: string): {
  title: string;
  description: string;
  coverImage: string | null;
  siteName: string | null;
  author: string | null;
} {
  const getTag = (pattern: RegExp): string | null => {
    const match = html.match(pattern);
    return match?.[1]?.trim() ?? null;
  };

  // Title: og:title > twitter:title > <title>
  const title =
    getTag(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ??
    getTag(/<meta[^>]+name=["']twitter:title["'][^>]+content=["']([^"']+)["']/i) ??
    getTag(/<title[^>]*>([^<]+)<\/title>/i) ??
    new URL(baseUrl).hostname;

  // Description: og:description > twitter:description > meta description
  const description =
    getTag(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ??
    getTag(/<meta[^>]+name=["']twitter:description["'][^>]+content=["']([^"']+)["']/i) ??
    getTag(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ??
    '';

  // Cover image: og:image > twitter:image
  const coverImage =
    getTag(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ??
    getTag(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ??
    null;

  const siteName = getTag(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i);
  const author =
    getTag(/<meta[^>]+name=["']author["'][^>]+content=["']([^"']+)["']/i) ??
    getTag(/<meta[^>]+property=["']article:author["'][^>]+content=["']([^"']+)["']/i) ??
    null;

  return { title, description, coverImage, siteName, author };
}

// ─────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const requestId = request.headers.get('x-request-id') ?? crypto.randomUUID();

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'url is required' } },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();
    } catch {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid URL — must be http or https' } },
        { status: 400 }
      );
    }

    const { provider, sourceType } = detectProvider(url);

    // Fetch the page HTML with a 5-second timeout
    let html = '';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'OasisBio/1.0 (reference enrichment bot)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        const contentType = res.headers.get('content-type') ?? '';
        if (contentType.includes('text/html')) {
          // Read only first 100KB to avoid memory issues
          const reader = res.body?.getReader();
          if (reader) {
            const chunks: Uint8Array[] = [];
            let totalBytes = 0;
            while (totalBytes < 100_000) {
              const { done, value } = await reader.read();
              if (done || !value) break;
              chunks.push(value);
              totalBytes += value.length;
            }
            reader.cancel();
            html = new TextDecoder().decode(
              chunks.reduce((acc, chunk) => {
                const merged = new Uint8Array(acc.length + chunk.length);
                merged.set(acc);
                merged.set(chunk, acc.length);
                return merged;
              }, new Uint8Array(0))
            );
          }
        }
      }
    } catch {
      // Fetch failed — return minimal metadata from URL
    }

    const meta = html
      ? extractMeta(html, url)
      : { title: parsedUrl.hostname, description: '', coverImage: null, siteName: null, author: null };

    return NextResponse.json({
      url,
      title: meta.title,
      description: meta.description,
      coverImage: meta.coverImage,
      provider,
      sourceType,
      metadata: {
        siteName: meta.siteName,
        author: meta.author,
      },
      requestId,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
