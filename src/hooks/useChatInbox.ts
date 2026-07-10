'use client';

import { useState, useCallback, useEffect } from 'react';
import { request } from '@/lib/api-client';
import type { Conversation, ChatMessage, ConversationStatus } from '@/types/chat';

export function useChatInbox() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await request<{
        success: boolean;
        data: Conversation[];
        unreadCount: number;
      }>('/admin/chat/conversations');
      setConversations(res.data);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (activeConvId) {
      request<{ success: boolean; data: ChatMessage[] }>(
        `/admin/chat/conversations/${activeConvId}/messages`
      ).then((res) => setMessages(res.data)).catch(() => setMessages([]));
    } else {
      setMessages([]);
    }
  }, [activeConvId]);

  const selectConversation = useCallback(async (id: string) => {
    setActiveConvId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isUnread: false } : c)),
    );
    try {
      await request(`/admin/chat/conversations/${id}/read`, { method: 'PUT' });
    } catch {
      // silent
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: ConversationStatus) => {
    try {
      await request(`/admin/chat/conversations/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c)),
      );
    } catch {
      // silent
    }
  }, []);

  const sendAdminMessage = useCallback(async (text: string) => {
    if (!activeConvId) return;
    try {
      const res = await request<{ success: boolean; data: ChatMessage }>(
        `/admin/chat/conversations/${activeConvId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({ text }),
        },
      );
      setMessages((prev) => [...prev, res.data]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? { ...c, lastMessage: text, lastMessageAt: res.data.createdAt, messageCount: c.messageCount + 1 }
            : c,
        ),
      );
    } catch {
      // silent
    }
  }, [activeConvId]);

  const unreadCount = conversations.filter((c) => c.isUnread).length;

  return {
    conversations,
    activeConvId,
    messages,
    loading,
    unreadCount,
    selectConversation,
    updateStatus,
    sendAdminMessage,
    refresh,
  };
}
