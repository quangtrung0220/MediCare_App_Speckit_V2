/*
 * Created: 2026-07-01
 * Purpose: Frontend service for GDPR data privacy actions — export and purge.
 * Owner: Quang Trung
 */
import { authHeaders } from './auth.service';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

/**
 * Triggers a download of the patient's complete data bundle as a JSON file.
 * The browser will prompt a Save dialog via the Content-Disposition header.
 */
export async function exportPatientData(patientId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/patients/${patientId}/export`, {
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể xuất dữ liệu bệnh nhân.');
  }

  // Extract filename from Content-Disposition header
  const disposition = res.headers.get('content-disposition') ?? '';
  const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
  const filename = filenameMatch ? filenameMatch[1] : `patient_${patientId}_export.json`;

  // Create a Blob URL and trigger browser download
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/**
 * Permanently hard-deletes the patient and all associated data.
 * Will throw a ConflictException (409) if the patient has unpaid invoices.
 */
export async function purgePatient(patientId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/patients/${patientId}/purge`, {
    method: 'DELETE',
    headers: authHeaders(),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Không thể xóa vĩnh viễn bệnh nhân.');
  }
}
