import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { SessionProviderWrapper } from '@/components/SessionProviderWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'OasisBio',
  description: 'A cross-era identity system for building expandable digital identities',
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