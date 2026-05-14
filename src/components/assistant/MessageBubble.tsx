'use client';

import React from 'react';
import type { AgentType } from '@/lib/assistants/types';

interface MessageBubbleProps {
  role: 'user' | AgentType;
  content: string;
  timestamp?: Date;
}

// Premium color system
const agentColors = {
  deo: {
    primary: 'from-emerald-400 to-green-600',
    secondary: 'from-emerald-50 to-green-100',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
    glow: 'shadow-emerald-500/20',
  },
  dia: {
    primary: 'from-rose-400 to-pink-600',
    secondary: 'from-rose-50 to-pink-100',
    text: 'text-rose-900',
    border: 'border-rose-200',
    glow: 'shadow-rose-500/20',
  },
};

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === 'user';
  const colors = agentColors[role as keyof typeof agentColors] || agentColors.deo;

  const getAvatar = () => {
    if (role === 'deo') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-200 flex items-center justify-center shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20 overflow-hidden">
          <img 
            src="/assets/deo/deo.png" 
            alt="Deo" 
            className="w-8 h-8 object-cover"
            width={32}
            height={32}
          />
        </div>
      );
    }
    if (role === 'dia') {
      return (
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 flex items-center justify-center shadow-lg shadow-rose-500/10 ring-2 ring-rose-500/20 overflow-hidden">
          <img 
            src="/assets/deo/dia.png" 
            alt="Dia" 
            className="w-8 h-8 object-cover"
            width={32}
            height={32}
          />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center shadow-lg shadow-slate-500/10 ring-2 ring-slate-500/20">
        <span className="text-sm font-medium text-slate-600">U</span>
      </div>
    );
  };

  const getName = () => {
    if (role === 'deo') return 'Deo';
    if (role === 'dia') return 'Dia';
    return 'You';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={`flex gap-4 items-end ${isUser ? 'flex-row-reverse' : ''}`}>
      {getAvatar()}
      <div className={`max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm border ${
          isUser 
            ? 'bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-slate-900/20 border-slate-700' 
            : `bg-gradient-to-br ${colors.secondary} ${colors.text} shadow-white/50 ${colors.border}`
        }`}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </p>
        </div>
        {timestamp && (
          <span className={`text-xs mt-2 px-3 ${isUser ? 'text-slate-400' : 'text-slate-500'}`}>
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}
