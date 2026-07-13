/*
 * Created: 2026-07-03
 * Purpose: Notification bell with dropdown — shows real-time clinic alerts.
 * Owner: Quang Trung
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications, type AppNotification } from '../../hooks/useNotifications';
import styles from './NotificationBell.module.css';

const SEVERITY_ICON: Record<string, string> = {
  info: '📅',
  warning: '⚠️',
  critical: '🔴',
};

const EVENT_ICON: Record<string, string> = {
  'appointment.new': '📅',
  'appointment.checked_in': '🚶',
  'prescription.ready': '💊',
  'inventory.low_stock': '📦',
  'user.pending_approval': '👤',
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return d.toLocaleDateString('vi-VN');
}

export function NotificationBell() {
  const { notifications, unreadCount, markAllRead, markRead, connected } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleOpen() {
    setOpen((v) => !v);
  }

  function handleMarkAllRead() {
    markAllRead();
  }

  return (
    <div className={styles.wrapper} ref={panelRef}>
      {/* Bell button */}
      <button
        id="notification-bell"
        className={styles.bell}
        onClick={handleOpen}
        aria-label={`Thông báo (${unreadCount} chưa đọc)`}
        title={`${unreadCount} thông báo chưa đọc`}
      >
        <span className={styles.bellIcon}>🔔</span>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className={`${styles.badge} ${styles.badgePulse}`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}

        {/* Connection dot */}
        <span
          className={`${styles.connDot} ${connected ? styles.connDotOnline : styles.connDotOffline}`}
          title={connected ? 'Đang kết nối real-time' : 'Mất kết nối'}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className={styles.panel}>
          {/* Header */}
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>Thông báo</span>
            {notifications.length > 0 && (
              <button className={styles.markAllBtn} onClick={handleMarkAllRead}>
                Đánh dấu đã đọc
              </button>
            )}
          </div>

          {/* List */}
          <div className={styles.list}>
            {notifications.length === 0 ? (
              <div className={styles.empty}>
                <span>🔕</span>
                <p>Chưa có thông báo nào</p>
              </div>
            ) : (
              notifications.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  onRead={() => markRead(n.id)}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationItem({
  notification: n,
  onRead,
}: {
  notification: AppNotification;
  onRead: () => void;
}) {
  const icon = EVENT_ICON[n.event] ?? SEVERITY_ICON[n.severity] ?? '🔔';

  return (
    <button
      className={`${styles.item} ${!n.read ? styles.itemUnread : ''} ${styles[`sev_${n.severity}`]}`}
      onClick={onRead}
    >
      <span className={styles.itemIcon}>{icon}</span>
      <div className={styles.itemBody}>
        <p className={styles.itemTitle}>{n.title}</p>
        <p className={styles.itemMsg}>{n.message}</p>
        <span className={styles.itemTime}>{formatTime(n.timestamp)}</span>
      </div>
      {!n.read && <span className={styles.unreadDot} />}
    </button>
  );
}
