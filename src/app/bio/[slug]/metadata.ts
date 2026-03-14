import type { Metadata } from 'next';

// Mock data for metadata generation
const oasisBioData = {
  title: 'Oasis Prime',
  tagline: 'A digital identity beyond time',
  description: 'Oasis Prime is a digital identity that exists across multiple time periods and dimensions. It serves as a bridge between different versions of self, connecting past, present, and future iterations.',
  gender: 'Non-binary',
};

export async function generateMetadata() {
  return {
    title: `${oasisBioData.title} – Fictional Character Profile | OasisBio`,
    description: oasisBioData.tagline + ' - ' + oasisBioData.description,
    keywords: [
      'character profile',
      'character identity',
      'fictional character biography',
      'digital identity',
      'fictional character',
      oasisBioData.title.toLowerCase().replace(' ', '-')
    ],
    openGraph: {
      title: `${oasisBioData.title} – Fictional Character Profile`,
      description: oasisBioData.tagline,
      type: 'profile',
      profile: {
        firstName: oasisBioData.title,
        gender: oasisBioData.gender.toLowerCase(),
      },
      siteName: 'OasisBio',
    },
    twitter: {
      title: `${oasisBioData.title} – Fictional Character Profile`,
      description: oasisBioData.tagline,
      card: 'summary_large_image',
    },
  };
}
