'use client';

import React, { useState } from 'react';
import { Save, Loader2, Shield, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { PermissionLevel, AssistantPermissions } from '@/lib/assistants/types';

interface PermissionManagerProps {
  currentLevel: PermissionLevel;
  permissions: AssistantPermissions;
  onUpdate: (level: PermissionLevel, permissions: Partial<AssistantPermissions>) => Promise<void>;
}

const PERMISSION_ITEMS: { key: keyof AssistantPermissions; label: string; description: string }[] = [
  { key: 'canRead', label: '读取数据', description: '查看和搜索你的数据' },
  { key: 'canWrite', label: '写入数据', description: '创建和修改数据' },
  { key: 'canDelete', label: '删除数据', description: '删除你的数据和内容' },
  { key: 'canManageAssistant', label: '管理助手', description: '配置 Deo & Dia 助手设置' },
  { key: 'canManageUsers', label: '用户管理', description: '邀请和管理其他用户' },
  { key: 'canExportData', label: '导出数据', description: '导出和下载你的数据' },
];

export function PermissionManager({ currentLevel, permissions, onUpdate }: PermissionManagerProps) {
  const [level, setLevel] = useState<PermissionLevel>(currentLevel);
  const [perms, setPerms] = useState<AssistantPermissions>(permissions);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const levelIcons = {
    read: Shield,
    write: ShieldAlert,
    admin: ShieldCheck,
  };

  const levelDescriptions = {
    read: '只读权限 - 只能查看数据，不能修改',
    write: '读写权限 - 可以读取和修改数据',
    admin: '完全控制 - 可以执行所有操作，包括删除',
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      await onUpdate(level, perms);
      setMessage({ type: 'success', text: '权限设置已保存' });
    } catch (error) {
      setMessage({ type: 'error', text: '保存失败' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-xl font-bold mb-4">Deo & Dia 权限设置</h2>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">权限级别</h3>
        <div className="space-y-2">
          {(Object.keys(levelIcons) as PermissionLevel[]).map((lvl) => {
            const Icon = levelIcons[lvl];
            return (
              <label
                key={lvl}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  level === lvl ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="level"
                  value={lvl}
                  checked={level === lvl}
                  onChange={() => setLevel(lvl)}
                  className="sr-only"
                />
                <Icon className={`w-5 h-5 ${level === lvl ? 'text-purple-600' : 'text-gray-400'}`} />
                <div>
                  <div className="font-medium">{levelDescriptions[lvl]}</div>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {level !== 'admin' && (
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">具体权限</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PERMISSION_ITEMS.map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={!!perms[item.key]}
                  onChange={(e) => setPerms({ ...perms, [item.key]: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
      >
        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        保存权限设置
      </button>
    </div>
  );
}
