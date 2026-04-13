'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from '@/lib/auth.client';
import { ToastProvider } from '@/components/Toast';

export interface SessionProviderWrapperProps {
  children: ReactNode;
}

export function SessionProviderWrapper({ children }: SessionProviderWrapperProps) {
  return (
    <SessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}
