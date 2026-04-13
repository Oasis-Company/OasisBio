'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ConsentFormProps {
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
  codeChallengeMethod: string;
  userId: string;
}

export default function ConsentForm({
  clientId,
  redirectUri,
  scope,
  state,
  codeChallenge,
  codeChallengeMethod,
  userId,
}: ConsentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthorize = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/oauth/authorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId,
          redirectUri,
          scope,
          state,
          codeChallenge,
          codeChallengeMethod,
          decision: 'allow',
        }),
      });

      const data = await res.json();

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        setIsLoading(false);
      }
    } catch {
      setIsLoading(false);
    }
  };

  const handleDeny = () => {
    const url = new URL(redirectUri);
    url.searchParams.set('error', 'access_denied');
    url.searchParams.set('error_description', 'The user denied access');
    url.searchParams.set('state', state);
    window.location.href = url.toString();
  };

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={handleDeny}
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
      >
        Deny
      </button>
      <button
        type="button"
        onClick={handleAuthorize}
        disabled={isLoading}
        className="flex-1 px-4 py-2.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {isLoading ? 'Authorizing…' : 'Authorize'}
      </button>
    </div>
  );
}
