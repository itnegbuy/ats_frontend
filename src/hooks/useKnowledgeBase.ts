'use client';

import { useState, useCallback, useEffect } from 'react';
import { request } from '@/lib/api-client';
import type { KnowledgeBaseItem, KBCategory } from '@/types/chat';

export function useKnowledgeBase() {
  const [items, setItems] = useState<KnowledgeBaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await request<{ success: boolean; data: KnowledgeBaseItem[] }>('/admin/knowledge-base');
        setItems(res.data);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const addItem = useCallback(async (item: Omit<KnowledgeBaseItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const res = await request<{ success: boolean; data: KnowledgeBaseItem }>('/admin/knowledge-base', {
        method: 'POST',
        body: JSON.stringify(item),
      });
      setItems((prev) => [...prev, res.data]);
      return res.data;
    } catch {
      return null;
    }
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<KnowledgeBaseItem>) => {
    try {
      await request(`/admin/knowledge-base/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item,
        ),
      );
    } catch {
      // silent
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      await request(`/admin/knowledge-base/${id}`, { method: 'DELETE' });
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch {
      // silent
    }
  }, []);

  const getItem = useCallback((id: string) => {
    return items.find((item) => item.id === id) || null;
  }, [items]);

  const searchItems = useCallback((query: string, category?: KBCategory) => {
    let filtered = items;
    if (category) filtered = filtered.filter((i) => i.category === category);
    if (query) {
      const lower = query.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.question.toLowerCase().includes(lower) ||
          i.answer.toLowerCase().includes(lower) ||
          i.keywords.some((k) => k.toLowerCase().includes(lower)),
      );
    }
    return filtered.sort((a, b) => b.priority - a.priority);
  }, [items]);

  return {
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    getItem,
    searchItems,
  };
}
