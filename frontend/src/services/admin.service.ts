/*
 * Created: 2026-07-13
 * Purpose: Frontend service for administrative tools (Backup & Restore).
 * Owner: Quang Trung
 */
import { authHeaders, getToken } from './auth.service';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Triggers a download of the active SQLite database backup file.
 */
export async function downloadDatabaseBackup(): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/backup`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể tải bản sao lưu cơ sở dữ liệu.');
  }

  // Create file download anchor
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  
  // Extract filename or default
  const disposition = res.headers.get('content-disposition') ?? '';
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch ? filenameMatch[1] : `medicare_backup_${new Date().toISOString().split('T')[0]}.sqlite`;
  
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Uploads an SQLite database file to restore the backend database.
 */
export async function restoreDatabaseBackup(file: File): Promise<{ message: string }> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/admin/restore`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể khôi phục cơ sở dữ liệu.');
  }

  return res.json();
}
