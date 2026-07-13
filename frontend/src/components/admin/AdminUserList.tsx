/*
 * Created: 2026-07-02
 * Purpose: Admin panel — list all users with role/status badges and block/unblock actions.
 * Owner: Quang Trung
 */
'use client';

import { useEffect, useState, useCallback } from 'react';
import { authHeaders } from '../../services/auth.service';
import styles from './AdminUserList.module.css';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface UserRecord {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  isPendingApproval: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#f59e0b',
  DOCTOR: '#10b981',
  NURSE: '#06b6d4',
  RECEPTIONIST: '#8b5cf6',
  PHARMACIST: '#f97316',
  PATIENT: '#6366f1',
};

export default function AdminUserList() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
      if (!res.ok) throw new Error('Không thể tải danh sách người dùng.');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleAction(userId: string, action: 'approve' | 'block' | 'unblock' | 'reject') {
    setActionLoading(userId + action);
    try {
      const method = action === 'reject' ? 'DELETE' : 'PATCH';
      const res = await fetch(`${API_BASE}/admin/users/${userId}/${action}`, {
        method,
        headers: authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Thao tác thất bại.');
      }
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Thao tác thất bại.');
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) return <div className={styles.loading}>⏳ Đang tải danh sách người dùng...</div>;
  if (error) return <div className={styles.error}>❌ {error}</div>;

  const pending = users.filter(u => u.isPendingApproval);
  const active  = users.filter(u => !u.isPendingApproval && u.isActive);
  const blocked = users.filter(u => !u.isPendingApproval && !u.isActive);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Quản lý Tài khoản</h2>

      {/* Pending accounts */}
      {pending.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.badge} style={{ background: '#f59e0b' }}>
              {pending.length}
            </span>
            Đang chờ phê duyệt
          </h3>
          {pending.map(user => (
            <div key={user.id} className={`${styles.row} ${styles.rowPending}`}>
              <UserInfo user={user} />
              <div className={styles.actions}>
                <button
                  className={styles.approveBtn}
                  disabled={!!actionLoading}
                  onClick={() => handleAction(user.id, 'approve')}
                >
                  ✅ Duyệt
                </button>
                <button
                  className={styles.rejectBtn}
                  disabled={!!actionLoading}
                  onClick={() => handleAction(user.id, 'reject')}
                >
                  ❌ Từ chối
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Active accounts */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <span className={styles.badge} style={{ background: '#10b981' }}>{active.length}</span>
          Đang hoạt động
        </h3>
        {active.map(user => (
          <div key={user.id} className={styles.row}>
            <UserInfo user={user} />
            <div className={styles.actions}>
              <button
                className={styles.blockBtn}
                disabled={!!actionLoading}
                onClick={() => handleAction(user.id, 'block')}
              >
                🔒 Khóa
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* Blocked accounts */}
      {blocked.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <span className={styles.badge} style={{ background: '#ef4444' }}>{blocked.length}</span>
            Đã bị khóa
          </h3>
          {blocked.map(user => (
            <div key={user.id} className={`${styles.row} ${styles.rowBlocked}`}>
              <UserInfo user={user} />
              <div className={styles.actions}>
                <button
                  className={styles.unblockBtn}
                  disabled={!!actionLoading}
                  onClick={() => handleAction(user.id, 'unblock')}
                >
                  🔓 Mở khóa
                </button>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

function UserInfo({ user }: { user: UserRecord }) {
  const color = ROLE_COLORS[user.role] ?? '#94a3b8';
  return (
    <div className={styles.userInfo}>
      <div className={styles.avatar} style={{ background: `${color}22`, borderColor: `${color}44` }}>
        <span style={{ color }}>{user.email[0].toUpperCase()}</span>
      </div>
      <div>
        <p className={styles.email}>{user.email}</p>
        <div className={styles.meta}>
          <span className={styles.roleChip} style={{ background: `${color}22`, color }}>
            {user.role}
          </span>
          <span className={styles.metaText}>
            Tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
          </span>
          {user.lastLoginAt && (
            <span className={styles.metaText}>
              Lần đăng nhập cuối: {new Date(user.lastLoginAt).toLocaleDateString('vi-VN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
