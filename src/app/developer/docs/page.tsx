import Link from 'next/link';
import Image from 'next/image';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://oasisbio.oasiscompany.org';

const LOGO_URL = '/assets/oasis_logo.svg';

const HTML_BUTTON = `<!-- Download the Oasis logo: ${BASE_URL}/assets/oasis_logo.svg -->
<a href="${BASE_URL}/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&response_type=code&scope=profile+email&state=RANDOM_STATE&code_challenge=YOUR_CODE_CHALLENGE&code_challenge_method=S256"
   style="display:inline-flex;align-items:center;gap:10px;padding:10px 20px;
          background:#000;color:#fff;border-radius:8px;text-decoration:none;
          font-family:sans-serif;font-size:15px;font-weight:500;">
  <img src="${BASE_URL}/assets/oasis_logo.svg" width="20" height="17" alt="Oasis" />
  Continue with Oasis
</a>`;

const REACT_BUTTON = `import Image from 'next/image';

function ContinueWithOasis({ clientId, redirectUri }: { clientId: string; redirectUri: string }) {
  const handleClick = async () => {
    const verifier = generateRandomString(64);
    const challenge = base64url(await sha256(verifier));
    sessionStorage.setItem('pkce_verifier', verifier);

    const url = new URL('${BASE_URL}/oauth/authorize');
    url.searchParams.set('client_id', clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('response_type', 'code');
    url.searchParams.set('scope', 'profile email');
    url.searchParams.set('state', generateRandomString(16));
    url.searchParams.set('code_challenge', challenge);
    url.searchParams.set('code_challenge_method', 'S256');
    window.location.href = url.toString();
  };

  return (
    <button
      onClick={handleClick}
      style={{ display:'inline-flex', alignItems:'center', gap:10,
               padding:'10px 20px', background:'#000', color:'#fff',
               borderRadius:8, border:'none', cursor:'pointer',
               fontSize:15, fontWeight:500 }}
    >
      <Image src="${BASE_URL}/assets/oasis_logo.svg" width={20} height={17} alt="Oasis" />
      Continue with Oasis
    </button>
  );
}`;

export default function DeveloperDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/developer" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-6 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Developer Portal
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">OAuth Integration Guide</h1>
        <p className="text-gray-500 mb-10">Add "Continue with Oasis" to your application in minutes.</p>

        {/* Step 1 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">1. Register Your App</h2>
          <p className="text-gray-600 text-sm mb-3">
            Go to <Link href="/developer/apps/new" className="text-black underline">Developer Apps</Link> and create a new OAuth app.
            You&apos;ll receive a <code className="bg-gray-100 px-1 rounded">client_id</code> and <code className="bg-gray-100 px-1 rounded">client_secret</code>.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
            Save your <strong>client_secret</strong> immediately — it&apos;s only shown once.
          </div>
        </section>

        {/* The Button — logo + brand assets */}
        <section className="mb-10" id="button">
          <h2 className="text-xl font-bold text-gray-900 mb-3">2. The Button</h2>
          <p className="text-gray-600 text-sm mb-5">
            Use the official Oasis logo and button style so users immediately recognize the sign-in option.
          </p>

          {/* Preview */}
          <div className="bg-gray-900 rounded-xl p-8 flex items-center justify-center mb-5">
            <div className="inline-flex items-center gap-2.5 px-5 py-3 bg-black border border-white/20 text-white rounded-lg font-medium text-sm">
              <Image src={LOGO_URL} width={20} height={17} alt="Oasis logo" />
              Continue with Oasis
            </div>
          </div>

          {/* Logo download */}
          <div className="border border-gray-100 rounded-xl p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image src={LOGO_URL} width={32} height={27} alt="Oasis logo" />
              <div>
                <p className="text-sm font-medium text-gray-800">oasis_logo.svg</p>
                <p className="text-xs text-gray-400">Official Oasis OAuth logo · SVG · 61×51px</p>
              </div>
            </div>
            <a
              href={LOGO_URL}
              download="oasis_logo.svg"
              className="px-3 py-1.5 text-xs font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Download
            </a>
          </div>

          {/* Button guidelines */}
          <div className="bg-gray-50 rounded-xl p-4 mb-5 text-sm text-gray-600 space-y-1.5">
            <p className="font-medium text-gray-800 mb-2">Button guidelines</p>
            <p>• Use the exact text <strong>&quot;Continue with Oasis&quot;</strong> — do not alter the wording</p>
            <p>• Always include the Oasis logo to the left of the text</p>
            <p>• Minimum button height: 40px · Minimum logo size: 16×14px</p>
            <p>• Recommended style: black background (#000), white text (#fff), 8px border radius</p>
            <p>• Do not recolor, distort, or modify the logo</p>
          </div>

          {/* HTML snippet */}
          <p className="text-xs font-medium text-gray-500 mb-2">HTML</p>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto mb-4">{HTML_BUTTON}</pre>

          {/* React snippet */}
          <p className="text-xs font-medium text-gray-500 mb-2">React / Next.js</p>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto">{REACT_BUTTON}</pre>
        </section>

        {/* Step 3 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">3. Build the Authorization URL</h2>
          <p className="text-gray-600 text-sm mb-3">Redirect users to this URL to start the OAuth flow:</p>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto mb-3">{`const codeVerifier = generateRandomString(64); // store this
const codeChallenge = base64url(sha256(codeVerifier));

const authUrl = new URL('${BASE_URL}/oauth/authorize');
authUrl.searchParams.set('client_id', YOUR_CLIENT_ID);
authUrl.searchParams.set('redirect_uri', YOUR_REDIRECT_URI);
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('scope', 'profile email oasisbios:read');
authUrl.searchParams.set('state', generateRandomString(16));
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');

window.location.href = authUrl.toString();`}</pre>
          <p className="text-xs text-gray-400">PKCE is required. Store <code className="bg-gray-100 px-1 rounded">code_verifier</code> in session storage.</p>
        </section>

        {/* Step 4 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">4. Exchange Code for Tokens</h2>
          <p className="text-gray-600 text-sm mb-3">After the user authorizes, they&apos;re redirected to your <code className="bg-gray-100 px-1 rounded">redirect_uri</code> with a <code className="bg-gray-100 px-1 rounded">code</code> parameter. Exchange it:</p>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto">{`const response = await fetch('${BASE_URL}/api/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: YOUR_CLIENT_ID,
    client_secret: YOUR_CLIENT_SECRET,
    code: CODE_FROM_REDIRECT,
    redirect_uri: YOUR_REDIRECT_URI,
    code_verifier: STORED_CODE_VERIFIER,
  }),
});

const { access_token, refresh_token, expires_in } = await response.json();`}</pre>
        </section>

        {/* Step 5 */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">5. Access User Data</h2>
          <p className="text-gray-600 text-sm mb-3">Use the access token as a Bearer token:</p>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto">{`// Get user profile
const profile = await fetch('${BASE_URL}/api/oauth/userinfo', {
  headers: { Authorization: \`Bearer \${access_token}\` },
}).then(r => r.json());
// { sub, username, display_name, avatar_url, email }

// Get character list (requires oasisbios:read scope)
const characters = await fetch('${BASE_URL}/api/oauth/resources/oasisbios', {
  headers: { Authorization: \`Bearer \${access_token}\` },
}).then(r => r.json());

// Get DCOS documents (requires dcos:read scope)
const dcos = await fetch(\`${BASE_URL}/api/oauth/resources/oasisbios/\${bioId}/dcos\`, {
  headers: { Authorization: \`Bearer \${access_token}\` },
}).then(r => r.json());`}</pre>
        </section>

        {/* Scopes */}
        <section className="mb-10" id="oauth">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Available Scopes</h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {[
              { scope: 'profile', desc: 'username, display name, avatar URL' },
              { scope: 'email', desc: 'email address' },
              { scope: 'oasisbios:read', desc: 'character list (title, slug, cover image)' },
              { scope: 'oasisbios:full', desc: 'full character data (abilities, worlds, eras, references)' },
              { scope: 'dcos:read', desc: 'DCOS document content' },
            ].map(({ scope, desc }, i) => (
              <div key={scope} className={`flex items-start gap-4 px-4 py-3 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono flex-shrink-0">{scope}</code>
                <span className="text-sm text-gray-600">{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Token refresh */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Refreshing Tokens</h2>
          <p className="text-gray-600 text-sm mb-3">Access tokens expire after 1 hour. Use the refresh token to get a new one:</p>
          <pre className="bg-gray-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto">{`const response = await fetch('${BASE_URL}/api/oauth/token', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: YOUR_CLIENT_ID,
    client_secret: YOUR_CLIENT_SECRET,
    refresh_token: STORED_REFRESH_TOKEN,
  }),
});
// Returns new access_token and refresh_token (old one is invalidated)`}</pre>
        </section>

        {/* OIDC discovery */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">OIDC Discovery</h2>
          <p className="text-gray-600 text-sm">
            Machine-readable configuration available at:{' '}
            <a href={`${BASE_URL}/api/oauth/.well-known/openid-configuration`} target="_blank" rel="noopener noreferrer" className="text-black underline font-mono text-xs">
              /api/oauth/.well-known/openid-configuration
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
