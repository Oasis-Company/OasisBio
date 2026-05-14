'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { SettingsPanel } from '@/components/assistant/SettingsPanel';

interface ProfileConfig {
  systemPrompt: string;
  apiEndpoint: string | null;
  apiKey: string | null;
  model: string;
  enabled: boolean;
  configured: boolean;
}

export default function SettingsPage() {
  const [deoProfile, setDeoProfile] = useState<ProfileConfig | null>(null);
  const [diaProfile, setDiaProfile] = useState<ProfileConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await fetch('/api/assistants/profiles');
        if (res.ok) {
          const data = await res.json();
          setDeoProfile(data.deo);
          setDiaProfile(data.dia);
        }
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfiles();
  }, []);
  
  const handleUpdate = async (agent: 'deo' | 'dia', data: Partial<ProfileConfig>) => {
    const res = await fetch('/api/assistants/profiles', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent, ...data }),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update profile');
    }
    
    const profilesRes = await fetch('/api/assistants/profiles');
    if (profilesRes.ok) {
      const data = await profilesRes.json();
      setDeoProfile(data.deo);
      setDiaProfile(data.dia);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <Link
            href="/dashboard/assistant"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            返回助手
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-6">AI 助手设置</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : deoProfile && diaProfile ? (
          <SettingsPanel
            deoProfile={deoProfile}
            diaProfile={diaProfile}
            onUpdate={handleUpdate}
          />
        ) : (
          <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
            无法加载配置
          </div>
        )}
      </div>
    </div>
  );
}
