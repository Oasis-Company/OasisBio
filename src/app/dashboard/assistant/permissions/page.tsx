'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PermissionManager } from '@/components/assistant/PermissionManager';
import type { PermissionLevel, AssistantPermissions } from '@/lib/assistants/types';

export default function PermissionsPage() {
  const [level, setLevel] = useState<PermissionLevel>('read');
  const [permissions, setPermissions] = useState<AssistantPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const res = await fetch('/api/assistants/permissions');
        if (res.ok) {
          const data = await res.json();
          setLevel(data.level);
          setPermissions(data.permissions);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPermissions();
  }, []);
  
  const handleUpdate = async (newLevel: PermissionLevel, newPermissions: Partial<AssistantPermissions>) => {
    const res = await fetch('/api/assistants/permissions', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level: newLevel, permissions: newPermissions }),
    });
    
    if (!res.ok) {
      throw new Error('Failed to update permissions');
    }
    
    const permsRes = await fetch('/api/assistants/permissions');
    if (permsRes.ok) {
      const data = await permsRes.json();
      setLevel(data.level);
      setPermissions(data.permissions);
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
        
        <h1 className="text-2xl font-bold mb-6">权限管理</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : permissions ? (
          <PermissionManager
            currentLevel={level}
            permissions={permissions}
            onUpdate={handleUpdate}
          />
        ) : (
          <div className="bg-white rounded-lg border p-6 text-center text-gray-500">
            无法加载权限配置
          </div>
        )}
      </div>
    </div>
  );
}
