'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';

interface FetchCtaButtonProps {
  value: string;
  label?: string;
  variant?: 'light' | 'dark';
}

export default function FetchCtaButton({ value, label = 'Copy', variant = 'light' }: FetchCtaButtonProps) {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = value;
      el.style.position = 'fixed';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lightClasses = 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900';
  const darkClasses = 'bg-white/15 text-white border border-white/25 hover:bg-white/25 hover:text-white';
  const copiedClasses = 'bg-green-500/20 text-green-300 border border-green-500/30';

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? 'Copied' : label}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        copied ? copiedClasses : (variant === 'dark' ? darkClasses : lightClasses)
      } ${variant === 'dark' ? 'focus:ring-white/40 focus:ring-offset-transparent' : 'focus:ring-black/20 focus:ring-offset-white'}`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
