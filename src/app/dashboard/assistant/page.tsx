'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Settings, Shield, History, MessageSquare, Loader2, Bot } from 'lucide-react';
import { ChatInterface } from '@/components/assistant/ChatInterface';
import { AgentSelector } from '@/components/assistant/AgentSelector';
import type { AgentType } from '@/lib/assistants/types';

interface Session {
  id: string;
  agent: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export default function AssistantPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('deo');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch('/api/assistants/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleCreateSession = async () => {
    setIsCreating(true);
    try {
      const res = await fetch('/api/assistants/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent: selectedAgent }),
      });
      if (res.ok) {
        const session = await res.json();
        setCurrentSessionId(session.id);
        setSessions((prev) => [session, ...prev]);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSendMessage = async (message: string, sessionId?: string) => {
    const res = await fetch('/api/assistants/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId || currentSessionId,
        agent: selectedAgent,
        message,
      }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Failed to send message');
    }

    return res.json();
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find((s) => s.id === sessionId);
    if (session) {
      setSelectedAgent(session.agent as AgentType);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-slate-50">
      {/* Sidebar */}
      <div className="w-72 border-r border-slate-200 bg-white flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-pink-500 rounded-xl shadow-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Deo & Dia</h1>
            </div>
            <div className="flex items-center gap-1">
              <Link
                href="/dashboard/assistant/settings"
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                title="Settings"
              >
                <Settings className="w-4.5 h-4.5 text-slate-500" />
              </Link>
              <Link
                href="/dashboard/assistant/permissions"
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                title="Permissions"
              >
                <Shield className="w-4.5 h-4.5 text-slate-500" />
              </Link>
              <Link
                href="/dashboard/assistant/history"
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
                title="History"
              >
                <History className="w-4.5 h-4.5 text-slate-500" />
              </Link>
            </div>
          </div>

          <button
            onClick={handleCreateSession}
            disabled={isCreating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-emerald-500 disabled:hover:to-emerald-600"
          >
            {isCreating ? (
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
            ) : (
              <Plus className="w-4.5 h-4.5" />
            )}
            <span className="font-semibold">New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-slate-300" />
              </div>
              <p className="text-sm text-slate-500 font-medium">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">Start your first chat!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 group ${
                    currentSessionId === session.id
                      ? 'bg-gradient-to-r from-emerald-50 to-pink-50 border border-emerald-100 shadow-sm'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      session.agent === 'deo' ? 'bg-emerald-100' : 'bg-rose-100'
                    }`}>
                      <img
                        src={
                          session.agent === 'deo'
                            ? '/assets/deo/deo.png'
                            : '/assets/deo/dia.png'
                        }
                        alt={session.agent}
                        className="w-6 h-6 rounded-lg object-cover"
                      />
                    </div>
                    <span className={`text-sm font-semibold truncate flex-1 ${
                      currentSessionId === session.id ? 'text-slate-800' : 'text-slate-600'
                    }`}>
                      {session.title || 'New Chat'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 ml-11">
                    <span>{formatDate(session.updatedAt)}</span>
                    <span className="font-medium">{session.messageCount} msgs</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 pr-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            {currentSessionId ? 'Continue Conversation' : 'Start New Chat'}
          </h2>
          <AgentSelector
            selectedAgent={selectedAgent}
            onAgentChange={setSelectedAgent}
          />
        </div>

        <div className="flex-1">
          <ChatInterface
            sessionId={currentSessionId || undefined}
            onSendMessage={handleSendMessage}
            selectedAgent={selectedAgent}
            onAgentChange={setSelectedAgent}
          />
        </div>
      </div>
    </div>
  );
}
