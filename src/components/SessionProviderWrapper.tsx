'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from '@/lib/auth.client';

export interface SessionProviderWrapperProps {
  children: ReactNode;
}

export function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
