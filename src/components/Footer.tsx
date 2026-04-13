import React from 'react';
import Link from 'next/link';

const YEAR = new Date().getFullYear();

const LINKS = {
  Product: [
    { label: 'Explore', href: '/explore' },
    { label: 'Create', href: '/create' },
    { label: 'Templates', href: '/templates' },
    { label: 'Manifesto', href: '/manifesto' },
  ],
  Developers: [
    { label: 'Developer Portal', href: '/developer' },
    { label: 'My Apps', href: '/developer/apps' },
    { label: 'API Docs', href: '/developer/docs' },
    { label: 'OAuth Integration', href: '/developer/docs#oauth' },
    { label: 'GitHub', href: 'https://github.com/Oasis-Company', external: true },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: 'mailto:oasisbiosupport@oermos.com', external: true },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/privacy#cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Top row: brand + links */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
              OasisBio
            </Link>
            <p className="text-gray-400 text-sm mt-3 leading-relaxed">
              Build expandable digital identities across eras.
            </p>
            {/* GitHub icon */}
            <a
              href="https://github.com/Oasis-Company"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 text-gray-400 hover:text-white transition-colors text-sm"
              aria-label="Oasis Company on GitHub"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              Oasis-Company
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    {'external' in item && item.external ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {YEAR} Oasis Company. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Built with care for creators.
          </p>
        </div>
      </div>
    </footer>
  );
}
