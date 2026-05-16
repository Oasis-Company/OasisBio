'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth.client';
import { CopyButton } from '@/components/CopyButton';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oasisbio.oasiscompany.org';

const SCOPES = [
  { name: 'profile', desc: 'username, display name, avatar URL' },
  { name: 'email', desc: 'email address' },
  { name: 'oasisbios:read', desc: 'character list (title, slug, cover image)' },
  { name: 'oasisbios:full', desc: 'full character data (abilities, worlds, eras, references)' },
  { name: 'dcos:read', desc: 'DCOS document content' },
];

const HTML_SNIPPET = `<!-- Download the Oasis logo: ${BASE_URL}/assets/oasis_logo.svg -->
<a href="${BASE_URL}/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=profile+email&state=RANDOM_STATE&code_challenge=YOUR_CODE_CHALLENGE&code_challenge_method=S256"
   style="display:inline-flex;align-items:center;gap:10px;padding:10px 20px;background:#000;color:#fff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-size:15px;font-weight:500;">
  <img src="${BASE_URL}/assets/oasis_logo.svg" width="20" height="17" alt="Oasis" />
  Continue with Oasis
</a>`;

const REACT_SNIPPET = `import Image from 'next/image';

function ContinueWithOasis({ clientId, redirectUri }: { clientId: string; redirectUri: string }) {
  const handleClick = async () => {
    const codeVerifier = generateRandomString(64);
    const codeChallenge = await base64url(sha256(codeVerifier));
    sessionStorage.setItem('pkce_verifier', codeVerifier);

    const url = new URL('${BASE_URL}/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'profile email');
    url.searchParams.set('state', generateRandomString(16));
    url.searchParams.set('code_challenge', codeChallenge);
    url.searchParams.set('code_challenge_method', 'S256');
    window.location.href = url.toString();
  };

  return (
    <button onClick={handleClick} style={{ display:'inline-flex', alignItems:'center', gap:10,
      padding:'10px 20px', background:'#000', color:'#fff', borderRadius:8,
      border:'none', cursor:'pointer', fontSize:15, fontWeight:500 }}>
      <Image src="${BASE_URL}/assets/oasis_logo.svg" width={20} height={17} alt="Oasis" />
      Continue with Oasis
    </button>
  );
}`;

const JS_SNIPPET = `// Full PKCE flow
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return hash;
}

function base64url(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
}

function generateRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map(b => chars[b % chars.length]).join('');
}

async function loginWithOasis(clientId, redirectUri) {
  const verifier = generateRandomString(64);
  const challenge = base64url(await sha256(verifier));
  sessionStorage.setItem('pkce_verifier', verifier);

  const url = new URL('${BASE_URL}/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('scope', 'profile email oasisbios:read');
  url.searchParams.set('state', generateRandomString(16));
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');
  window.location.href = url.toString();
}`;

export default function DeveloperLandingPage() {
  const { user } = useAuth();
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 mb-6">
            OAuth 2.0 + PKCE · OpenID Connect · RFC 7636
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 leading-tight">
            Let your users sign in<br />with their Oasis identity
          </h1>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            One button. Full access to character profiles, worlds, and DCOS documents — with user consent.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {isLoggedIn ? (
              <>
                <Link
                  href="/developer/apps/new"
                  className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Create an App
                </Link>
                <Link
                  href="/developer/apps"
                  className="px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  My Apps
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login?callbackUrl=/developer/apps/new"
                  className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  href="/developer/docs"
                  className="px-6 py-3 border border-white/30 text-white font-medium rounded-lg hover:bg-white/10 transition-colors"
                >
                  Read the Docs
                </Link>
              </>
            )}
          </div>

          {/* Return path for existing developers */}
          {!isLoggedIn && (
            <p className="mt-6 text-sm text-white/40">
              Already have an app?{' '}
              <Link
                href="/auth/login?callbackUrl=/developer/apps"
                className="text-white/70 hover:text-white underline underline-offset-2 transition-colors"
              >
                Sign in to manage it
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* Button Preview */}
      <section className="py-20 px-6 bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">The Button</h2>
            <p className="text-gray-400 text-sm">Familiar. Trustworthy. One copy-paste away.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Button demo */}
            <div className="flex flex-col items-center justify-center bg-gray-900 rounded-2xl p-12 gap-4">
              <button
                className="inline-flex items-center gap-3 px-5 py-3 bg-black border border-white/20 text-white rounded-lg font-medium text-sm hover:bg-gray-900 transition-colors"
                disabled
              >
                <Image src="/assets/oasis_logo.svg" width={20} height={17} alt="Oasis" />
                Continue with Oasis
              </button>
              <p className="text-xs text-gray-600">Preview only</p>
            </div>
            {/* Logo download + code snippet */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-800 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <Image src="/assets/oasis_logo.svg" width={24} height={20} alt="Oasis logo" />
                  <div>
                    <p className="text-xs font-medium text-white">oasis_logo.svg</p>
                    <p className="text-xs text-gray-500">Official OAuth logo · SVG</p>
                  </div>
                </div>
                <a
                  href="/assets/oasis_logo.svg"
                  download="oasis_logo.svg"
                  className="px-3 py-1.5 text-xs font-medium bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Download
                </a>
              </div>
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-mono">HTML</span>
                  <CopyButton value={HTML_SNIPPET} successMessage="Copied!" />
                </div>
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed">
                  {`<img src="${BASE_URL}/assets/oasis_logo.svg" ... />
Continue with Oasis`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Three steps to integrate</h2>
            <p className="text-gray-500">From zero to working OAuth in under 30 minutes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register your app',
                desc: 'Create an OAuth app in the developer portal. Get your client_id instantly.',
                href: isLoggedIn ? '/developer/apps/new' : '/auth/login?callbackUrl=/developer/apps/new',
                cta: 'Create App →',
              },
              {
                step: '02',
                title: 'Add the button',
                desc: 'Copy the HTML, React, or JavaScript snippet and drop it into your login page.',
                href: '#snippets',
                cta: 'View Snippets →',
              },
              {
                step: '03',
                title: 'Access user data',
                desc: 'Use the access token to fetch profile, characters, worlds, and DCOS documents.',
                href: '/developer/docs',
                cta: 'See API Docs →',
              },
            ].map(({ step, title, desc, href, cta }) => (
              <div key={step} className="relative">
                <div className="text-6xl font-bold text-gray-100 mb-4 leading-none">{step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{desc}</p>
                <Link href={href} className="text-sm font-medium text-black hover:opacity-70 transition-opacity">
                  {cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Snippets — tabbed */}
      <section id="snippets" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Code Snippets</h2>
            <p className="text-gray-500">Pick your stack and copy.</p>
          </div>
          <CodeSnippetTabs />
        </div>
      </section>

      {/* Scopes */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Available Scopes</h2>
            <p className="text-gray-500">Request only what you need. Users see exactly what they're granting.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCOPES.map(({ name, desc }) => (
              <div key={name} className="border border-gray-100 rounded-xl p-5 hover:border-gray-200 transition-colors">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 block mb-3">{name}</code>
                <p className="text-sm text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-black text-white text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to build?</h2>
          <p className="text-white/60 mb-8">Register your app and start integrating Oasis identity in minutes.</p>
          <Link
            href={isLoggedIn ? '/developer/apps/new' : '/auth/login?callbackUrl=/developer/apps/new'}
            className="inline-block px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Building
          </Link>
          {isLoggedIn && (
            <p className="mt-4 text-sm text-white/40">
              or{' '}
              <Link href="/developer/apps" className="text-white/60 hover:text-white underline underline-offset-2 transition-colors">
                view your existing apps
              </Link>
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

const TABS = [
  { id: 'react', label: 'React / Next.js', lang: 'tsx', code: REACT_SNIPPET },
  { id: 'js', label: 'JavaScript', lang: 'js', code: JS_SNIPPET },
  { id: 'html', label: 'HTML', lang: 'html', code: HTML_SNIPPET },
] as const;

type TabId = typeof TABS[number]['id'];

function CodeSnippetTabs() {
  const [active, setActive] = useState<TabId>('react');
  const tab = TABS.find(t => t.id === active)!;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
      {/* Tab bar */}
      <div className="flex items-center border-b border-gray-100 px-2 pt-2 gap-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              active === t.id
                ? 'bg-gray-950 text-white'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            {t.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="pb-2 pr-1">
          <CopyButton value={tab.code} successMessage="Copied!" />
        </div>
      </div>

      {/* Code panel */}
      <pre className="bg-gray-950 text-green-400 p-6 text-xs overflow-x-auto leading-relaxed min-h-[280px]">
        {tab.code}
      </pre>

      {/* Footer hint */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {active === 'react' && 'Requires PKCE helper functions — see JavaScript tab for implementation.'}
          {active === 'js' && 'Full PKCE implementation. Works in any modern browser.'}
          {active === 'html' && 'Static link — generate code_challenge server-side or use the JS snippet.'}
        </span>
        <span className="text-xs text-gray-300 font-mono">.{tab.lang}</span>
      </div>
    </div>
  );
}

function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <CopyButton value={code} successMessage="Copied!" />
      </div>
      <pre className="bg-gray-950 text-green-400 p-5 text-xs overflow-x-auto leading-relaxed">
        {code}
      </pre>
    </div>
  );
}
