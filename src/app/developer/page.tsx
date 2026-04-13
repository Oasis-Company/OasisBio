import React from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/CopyButton';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oasisbio.com';

const SCOPES = [
  { name: 'profile', desc: 'username, display name, avatar URL' },
  { name: 'email', desc: 'email address' },
  { name: 'oasisbios:read', desc: 'character list (title, slug, cover image)' },
  { name: 'oasisbios:full', desc: 'full character data (abilities, worlds, eras, references)' },
  { name: 'dcos:read', desc: 'DCOS document content' },
];

const HTML_SNIPPET = `<a href="${BASE_URL}/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=profile+email&state=RANDOM_STATE&code_challenge=YOUR_CODE_CHALLENGE&code_challenge_method=S256"
   style="display:inline-flex;align-items:center;gap:10px;padding:10px 20px;background:#000;color:#fff;border-radius:8px;text-decoration:none;font-family:sans-serif;font-size:15px;font-weight:500;">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="white" fill-opacity="0.15"/>
    <circle cx="12" cy="12" r="4" fill="white"/>
  </svg>
  Continue with Oasis
</a>`;

const REACT_SNIPPET = `import { useRouter } from 'next/navigation';

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
      <OasisIcon />
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
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-black text-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs text-white/70 mb-6">
            OAuth 2.0 + PKCE · OpenID Connect
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-5 leading-tight">
            Let your users sign in<br />with their Oasis identity
          </h1>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            One button. Full access to character profiles, worlds, and DCOS documents — with user consent.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/developer/apps/new"
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
          </div>
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
                <OasisIcon />
                Continue with Oasis
              </button>
              <p className="text-xs text-gray-600">Preview only</p>
            </div>
            {/* Code snippet */}
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-mono">HTML</span>
                <CopyButton value={HTML_SNIPPET} successMessage="Copied!" />
              </div>
              <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed">
                {`<a href="${BASE_URL}/oauth/authorize?..."
   style="display:inline-flex;align-items:center;
          gap:10px;padding:10px 20px;background:#000;
          color:#fff;border-radius:8px;...">
  <svg .../>
  Continue with Oasis
</a>`}
              </pre>
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
                href: '/developer/apps/new',
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

      {/* Code Snippets */}
      <section id="snippets" className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Code Snippets</h2>
            <p className="text-gray-500">Pick your stack and copy.</p>
          </div>
          <div className="space-y-6">
            <CodeBlock label="React / Next.js" code={REACT_SNIPPET} />
            <CodeBlock label="JavaScript (Full PKCE)" code={JS_SNIPPET} />
            <CodeBlock label="HTML (Static)" code={HTML_SNIPPET} />
          </div>
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
            href="/developer/apps/new"
            className="inline-block px-8 py-3.5 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start Building
          </Link>
        </div>
      </section>
    </div>
  );
}

function OasisIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.15" />
      <circle cx="12" cy="12" r="4" fill="white" />
    </svg>
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
