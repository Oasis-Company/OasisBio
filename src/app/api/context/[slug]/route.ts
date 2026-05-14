import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/auth-utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const oasisBio = await prisma.oasisBio.findUnique({
      where: { slug, visibility: 'public' },
      include: {
        abilities: {
          select: {
            name: true,
            category: true,
            level: true,
            description: true,
            sourceType: true,
          },
        },
        dcosFiles: {
          where: { status: 'published' },
          select: {
            title: true,
            content: true,
            folderPath: true,
          },
        },
        references: {
          select: {
            title: true,
            sourceType: true,
            url: true,
            description: true,
          },
        },
        worlds: {
          select: {
            name: true,
            aestheticKeywords: true,
            summary: true,
          },
        },
        eras: {
          orderBy: { sortOrder: 'asc' },
          select: {
            name: true,
            eraType: true,
            startYear: true,
            endYear: true,
            description: true,
          },
        },
      },
    });

    if (!oasisBio) {
      return NextResponse.json(
        { error: 'Identity context not found' },
        { status: 404 }
      );
    }

    const context = {
      $schema: 'https://oasisbio.com/context/v1.json',
      id: oasisBio.id,
      slug: oasisBio.slug,
      title: oasisBio.title,
      tagline: oasisBio.tagline,
      summary: oasisBio.summary,
      identityMode: oasisBio.identityMode,
      currentEra: oasisBio.currentEra,
      species: oasisBio.species,
      gender: oasisBio.gender,
      pronouns: oasisBio.pronouns,
      placeOfOrigin: oasisBio.placeOfOrigin,
      description: oasisBio.description,
      coverImageUrl: oasisBio.coverImageUrl,
      defaultLanguage: oasisBio.defaultLanguage,
      createdAt: oasisBio.createdAt.toISOString(),
      updatedAt: oasisBio.updatedAt.toISOString(),
      publishedAt: oasisBio.publishedAt?.toISOString() ?? null,
      eras: oasisBio.eras.map((era): {
        name: string;
        type: string;
        startYear: number | null;
        endYear: number | null;
        description: string | null;
      } => ({
        name: era.name,
        type: era.eraType,
        startYear: era.startYear,
        endYear: era.endYear,
        description: era.description,
      })),
      abilities: oasisBio.abilities.map((ability): {
        name: string;
        category: string;
        level: number;
        description: string | null;
        sourceType: string;
      } => ({
        name: ability.name,
        category: ability.category,
        level: ability.level,
        description: ability.description,
        sourceType: ability.sourceType,
      })),
      repositories: {
        dcos: oasisBio.dcosFiles.map((dcos): {
          title: string;
          path: string;
          preview: string;
        } => ({
          title: dcos.title,
          path: dcos.folderPath,
          preview: dcos.content.substring(0, 500),
        })),
        references: oasisBio.references.map((ref): {
          title: string;
          type: string;
          url: string | null;
          description: string | null;
        } => ({
          title: ref.title,
          type: ref.sourceType,
          url: ref.url,
          description: ref.description,
        })),
        worlds: oasisBio.worlds.map((world): {
          name: string;
          genre: string | null;
          summary: string | null;
        } => ({
          name: world.name,
          genre: world.aestheticKeywords,
          summary: world.summary,
        })),
      },
      links: {
        self: `/api/context/${oasisBio.slug}`,
        profile: `/bio/${oasisBio.slug}`,
      },
    };

    return NextResponse.json(context, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}