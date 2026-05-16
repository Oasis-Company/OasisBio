import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper';
import { Playfair_Display, Inter, JetBrains_Mono } from 'next/font/google';

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OasisBio - Open Identity Context for the AI Era',
  description: 'Create one portable, AI-readable identity. Stop reintroducing yourself to every app and AI. OasisBio is the open identity context infrastructure for the AI era.',
  keywords: [
    'AI identity passport',
    'identity context infrastructure',
    'machine-readable identity',
    'AI-ready profile',
    'portable identity',
    'open identity protocol',
    'structured identity',
    'OAuth identity context',
    'AI context layer',
    'digital identity for AI'
  ],
  authors: [
    { name: 'Ceaserzhao', url: 'https://oasisbio.com' }
  ],
  publisher: 'Oasis Company',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'OasisBio - Your AI-Powered Identity Passport',
    description: 'Create one portable, AI-readable identity. Stop reintroducing yourself to every app and AI.',
    type: 'website',
    siteName: 'OasisBio',
    url: 'https://oasisbio.com',
  },
  twitter: {
    title: 'OasisBio - AI Identity Passport',
    description: 'Stop reintroducing yourself to every AI. Create your identity once, use it everywhere.',
    card: 'summary_large_image',
  },
  metadataBase: new URL('https://oasisbio.com'),
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
          <Footer />
        </SessionProviderWrapper>
      </body>
    </html>
  );
}