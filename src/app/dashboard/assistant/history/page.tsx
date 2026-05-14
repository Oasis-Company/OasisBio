'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Loader2, Search, Trash2, MessageSquare } from 'lucide-react';

interface Session {
  id: string;
  agent: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/assistants/sessions');
        if (res.ok) {
          const data = await res.json();
          setSessions(data.sessions);
          setFilteredSessions(data.sessions);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSessions();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      setFilteredSessions(
        sessions.filter(
          (s) =>
            s.title?.toLowerCase().includes(query) ||
            s.agent.toLowerCase().includes(query)
        )
      );
    } else {
      setFilteredSessions(sessions);
    }
  }, [searchQuery, sessions]);
  
  const handleDelete = async (sessionId: string) => {
    if (!confirm('确定要删除这个对话吗？')) return;
    
    setDeletingId(sessionId);
    try {
      const res = await fetch(`/api/assistants/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId));
        setFilteredSessions((prev) => prev.filter((s) => s.id !== sessionId));
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    } finally {
      setDeletingId(null);
    }
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
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
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">对话历史</h1>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索对话..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white rounded-lg border p-12 text-center text-gray-500">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{searchQuery ? '没有找到匹配的对话' : '暂无对话历史'}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border overflow-hidden">
            <div className="divide-y">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/dashboard/assistant?session=${session.id}`}
                      className="flex items-center gap-3 flex-1"
                    >
                      <img
                        src={session.agent === 'deo' ? '/assets/deo/deo.png' : '/assets/deo/dia.png'}
                        alt={session.agent}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {session.title || '未命名对话'}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatDate(session.updatedAt)}</span>
                          <span>{session.messageCount} 条消息</span>
                        </div>
                      </div>
                    </Link>
                    
                    <button
                      onClick={() => handleDelete(session.id)}
                      disabled={deletingId === session.id}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      title="删除对话"
                    >
                      {deletingId === session.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
