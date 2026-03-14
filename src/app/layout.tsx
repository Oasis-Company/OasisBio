import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper';

// 使用系统字体而不是从 Google Fonts 加载
const inter = { className: '' };

export const metadata: Metadata = {
  title: 'OasisBio - Digital Identity Builder & Character Creator Platform',
  description: 'OasisBio is a comprehensive digital identity builder and character creator platform for building expandable fictional character identities across eras.',
  keywords: [
    'digital identity builder',
    'character creator platform',
    'fictional character builder',
    'character archive',
    'character identity system',
    'persona builder',
    'worldbuilding character creator',
    'character profile creator',
    'digital persona platform',
    'character database'
  ],
  authors: [
    { name: 'Ceaserzhao', url: 'https://oasisbio.com' }
  ],
  publisher: 'Oasis Company',
  openGraph: {
    title: 'OasisBio - Digital Identity Builder',
    description: 'Build and manage expandable digital identities across eras',
    type: 'website',
    siteName: 'OasisBio',
  },
  twitter: {
    title: 'OasisBio - Digital Identity Builder',
    description: 'Build and manage expandable digital identities across eras',
    card: 'summary_large_image',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>
          <Navbar />
          <main className="pt-20">
            {children}
          </main>
          <footer className="py-10 bg-black text-white text-center">
            <p>Oasis Company，2026</p>
          </footer>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}