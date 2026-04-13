import { redirect } from 'next/navigation';
import { getServerUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { validateAuthorizationParams } from '@/lib/oauth/validate';
import { formatScopesForConsent } from '@/lib/oauth/scopes';
import { generateSecret } from '@/lib/oauth/crypto';
import ConsentForm from './ConsentForm';

interface SearchParams {
  client_id?: string;
  redirect_uri?: string;
  response_type?: string;
  scope?: string;
  state?: string;
  code_challenge?: string;
  code_challenge_method?: string;
}

export default async function AuthorizePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  // Validate parameters
  const validation = validateAuthorizationParams(params);
  if (!validation.valid) {
    // If redirect_uri is valid, redirect with error; otherwise show error page
    if (params.redirect_uri) {
      const url = new URL(params.redirect_uri);
      url.searchParams.set('error', validation.error!);
      url.searchParams.set('error_description', validation.errorDescription!);
      if (params.state) url.searchParams.set('state', params.state);
      redirect(url.toString());
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Request</h1>
          <p className="text-gray-500 text-sm">{validation.errorDescription}</p>
        </div>
      </div>
    );
  }

  // Look up the OAuth app
  const app = await prisma.oauthApp.findUnique({
    where: { clientId: params.client_id!, isActive: true },
    select: { id: true, name: true, homepageUrl: true, logoUrl: true, redirectUris: true },
  });

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Unknown Application</h1>
          <p className="text-gray-500 text-sm">The application requesting access is not registered.</p>
        </div>
      </div>
    );
  }

  // Verify redirect_uri is registered
  if (!app.redirectUris.includes(params.redirect_uri!)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Invalid Redirect URI</h1>
          <p className="text-gray-500 text-sm">The redirect URI is not registered for this application.</p>
        </div>
      </div>
    );
  }

  // Require user to be logged in
  const user = await getServerUser();
  if (!user) {
    const loginUrl = new URL('/auth/login', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'https://oasisbio.com' : 'http://localhost:3000');
    loginUrl.searchParams.set('callbackUrl', `/oauth/authorize?${new URLSearchParams(params as Record<string, string>).toString()}`);
    redirect(loginUrl.pathname + '?callbackUrl=' + encodeURIComponent('/oauth/authorize?' + new URLSearchParams(params as Record<string, string>).toString()));
  }

  // Get user profile for display
  const profile = await prisma.profile.findFirst({
    where: { userId: user.id },
    select: { username: true, displayName: true, avatarUrl: true },
  });

  const scopeDescriptions = formatScopesForConsent(params.scope!);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-xl p-8 max-w-md w-full">
        {/* App info */}
        <div className="flex items-center gap-3 mb-6">
          {app.logoUrl ? (
            <img src={app.logoUrl} alt={app.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">
              {app.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="font-bold text-gray-900">{app.name}</h1>
            <a href={app.homepageUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-gray-400 hover:text-gray-600">
              {new URL(app.homepageUrl).hostname}
            </a>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-5">
          <span className="font-medium">{app.name}</span> wants to access your OasisBio account.
        </p>

        {/* Requested permissions */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">This app will be able to:</p>
          <ul className="space-y-2">
            {scopeDescriptions.map((desc, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {desc}
              </li>
            ))}
          </ul>
        </div>

        {/* Authorizing as */}
        <div className="flex items-center gap-2 mb-6 p-3 border border-gray-100 rounded-lg">
          {profile?.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500">
              {(profile?.displayName ?? user.email ?? 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <span className="text-sm text-gray-600">
            Authorizing as <span className="font-medium">@{profile?.username ?? user.email}</span>
          </span>
        </div>

        {/* Consent form */}
        <ConsentForm
          clientId={params.client_id!}
          redirectUri={params.redirect_uri!}
          scope={params.scope!}
          state={params.state!}
          codeChallenge={params.code_challenge!}
          codeChallengeMethod={params.code_challenge_method ?? 'S256'}
          userId={user.id}
        />

        <p className="text-xs text-gray-400 text-center mt-4">
          By authorizing, you agree to share the listed data with {app.name}.
        </p>
      </div>
    </div>
  );
}
