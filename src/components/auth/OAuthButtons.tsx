'use client';

import React from 'react';
import { AuthButton } from './AuthButton';
import { createClient } from '@/lib/supabase/client';

export function OAuthButtons() {
  const handleOAuthSignIn = (provider: string) => {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <>
      <div className="my-6 flex items-center justify-center">
        <div className="flex-grow h-px bg-gray-200 transform transition-all duration-300 group-hover:bg-gray-300"></div>
        <span className="mx-4 text-sm text-gray-500 transform transition-all duration-300">or</span>
        <div className="flex-grow h-px bg-gray-200 transform transition-all duration-300 group-hover:bg-gray-300"></div>
      </div>
      
      <div className="space-y-3 group">
        <AuthButton 
          variant="outline" 
          fullWidth
          onClick={() => handleOAuthSignIn('google')}
          className="flex items-center justify-center gap-3 transform transition-all duration-300 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
        >
          <div className="p-1 bg-white rounded-full">
            <img 
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
              alt="Google logo" 
              className="w-5 h-5 transform transition-all duration-300"
            />
          </div>
          <span className="transform transition-all duration-300">Sign in with Google</span>
        </AuthButton>
        <AuthButton 
          variant="outline" 
          fullWidth
          onClick={() => handleOAuthSignIn('github')}
          className="flex items-center justify-center gap-3 transform transition-all duration-300 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
        >
          <div className="p-1 bg-white rounded-full">
            <img 
              src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
              alt="GitHub logo" 
              className="w-5 h-5 transform transition-all duration-300"
            />
          </div>
          <span className="transform transition-all duration-300">Sign in with GitHub</span>
        </AuthButton>
      </div>
    </>
  );
}
