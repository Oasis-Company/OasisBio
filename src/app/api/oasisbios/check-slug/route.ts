/**
 * Slug Availability Check API
 *
 * GET /api/oasisbios/check-slug?slug=xxx&excludeId=yyy
 *
 * Returns whether a slug is available for use.
 * Used for real-time validation before publishing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, handleApiError } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(); // Must be logged in (rate-limit / prevent enumeration)
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId'); // Current bio ID to exclude

    if (!slug || slug.length === 0) {
      return NextResponse.json({ available: false, reason: 'empty' });
    }

    // Basic format validation: lowercase alphanumeric + hyphens only
    const validSlugFormat = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
    if (!validSlugFormat) {
      return NextResponse.json({ available: false, reason: 'invalid_format' });
    }

    // Length limits
    if (slug.length < 3) {
      return NextResponse.json({ available: false, reason: 'too_short' });
    }
    if (slug.length > 60) {
      return NextResponse.json({ available: false, reason: 'too_long' });
    }

    // Check uniqueness (excluding current bio)
    const where: { slug: string; id?: { not: string } } = { slug };
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const existing = await prisma.oasisBio.findUnique({
      where: { slug },
      select: { id: true, title: true },
    });

    // Also check publications table for public_slug conflicts
    const pubConflict = excludeId
      ? await prisma.oasisBioPublication.findFirst({
          where: {
            publicSlug: slug,
            oasisBioId: { not: excludeId },
          },
          select: { id: true },
        })
      : await prisma.oasisBioPublication.findFirst({
          where: { publicSlug: slug },
          select: { id: true },
        });

    if (existing && existing.id !== excludeId) {
      return NextResponse.json({
        available: false,
        reason: 'taken',
        conflictTitle: existing.title,
      });
    }

    if (pubConflict) {
      return NextResponse.json({
        available: false,
        reason: 'publication_taken',
      });
    }

    return NextResponse.json({ available: true });
  } catch (error) {
    return handleApiError(error);
  }
}
