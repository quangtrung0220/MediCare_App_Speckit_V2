/*
 * Created: 2026-07-03
 * Purpose: Hook managing SSE connection to backend notification stream.
 * Owner: Quang Trung
 */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { getToken, getUser } from '../services/auth.service';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export type NotificationSeverity = 'info' | 'warning' | 'critical';

export interface AppNotification {
  id: string;
  event: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  meta?: Record<string, unknown>;
}

interface UseNotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clear: () => void;
  connected: boolean;
}

const MAX_NOTIFICATIONS = 50;

export function useNotifications(): UseNotificationsResult {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getUser();

    // Only connect if authenticated
    if (!token || !user) return;

    const url = `${API_BASE}/notifications/stream?token=${encodeURIComponent(token)}`;
    const es = new EventSource(url);

    es.onopen = () => setConnected(true);

    es.onerror = () => {
      setConnected(false);
      // EventSource auto-reconnects, no need to explicitly retry
    };

    // Handle all custom event types
    const eventTypes = [
      'appointment.new',
      'appointment.checked_in',
      'prescription.ready',
      'inventory.low_stock',
      'user.pending_approval',
    ];

    const handler = (e: MessageEvent) => {
      try {
        const payload = JSON.parse(e.data);
        const notification: AppNotification = {
          ...payload,
          read: false,
        };
        setNotifications((prev) => {
          // Deduplicate by id, cap at MAX_NOTIFICATIONS
          const exists = prev.some((n) => n.id === notification.id);
          if (exists) return prev;
          return [notification, ...prev].slice(0, MAX_NOTIFICATIONS);
        });
      } catch {
        // Ignore malformed messages
      }
    };

    for (const type of eventTypes) {
      es.addEventListener(type, handler);
    }

    return () => {
      es.close();
      setConnected(false);
      for (const type of eventTypes) {
        es.removeEventListener(type, handler);
      }
    };
  }, []); // Only run once on mount

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }, []);

  const clear = useCallback(() => setNotifications([]), []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markAllRead, markRead, clear, connected };
}
