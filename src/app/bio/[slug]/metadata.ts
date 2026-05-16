import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const oasisBio = await prisma.oasisBio.findUnique({
    where: { slug, visibility: 'public' },
    select: {
      title: true,
      tagline: true,
      description: true,
      coverImageUrl: true,
    },
  });

  if (!oasisBio) {
    return {
      title: 'Not Found | OasisBio',
    };
  }

  const fullDescription = oasisBio.tagline 
    ? `${oasisBio.tagline}${oasisBio.description ? ' - ' + oasisBio.description : ''}`
    : oasisBio.description || 'A digital identity on OasisBio';
  
  const url = `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://oasisbio.oasiscompany.org'}/bio/${slug}`;

  return {
    title: `${oasisBio.title} – Character Profile | OasisBio`,
    description: fullDescription,
    keywords: [
      'OasisBio',
      'digital identity',
      'fictional character',
      'worldbuilding',
      '3D model',
      'GLB',
      'identity system',
      'character profile',
    ],
    authors: [{ name: 'Oasis Company' }],
    openGraph: {
      title: `${oasisBio.title} – Character Profile | OasisBio`,
      description: fullDescription,
      type: 'website',
      url: url,
      images: oasisBio.coverImageUrl ? [oasisBio.coverImageUrl] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${oasisBio.title} – Character Profile | OasisBio`,
      description: fullDescription,
      images: oasisBio.coverImageUrl ? [oasisBio.coverImageUrl] : [],
    },
  };
}
