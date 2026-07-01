/*
 * Created: 2026-07-01
 * Purpose: Side drawer wrapper for PrivacyPanel — slides in from the right.
 * Usage: Include in any patient detail view. Pass a real patientId from backend.
 * Owner: Quang Trung
 */
'use client';

import { useEffect } from 'react';
import PrivacyPanel from './PrivacyPanel';
import styles from './PatientPrivacyDrawer.module.css';

interface PatientPrivacyDrawerProps {
  isOpen: boolean;
  patientId: string;
  patientName: string;
  onClose: () => void;
  onPurgeSuccess?: () => void;
}

export default function PatientPrivacyDrawer({
  isOpen,
  patientId,
  patientName,
  onClose,
  onPurgeSuccess,
}: PatientPrivacyDrawerProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handlePurgeSuccess() {
    onClose();
    onPurgeSuccess?.();
  }

  return (
    <div className={styles.drawerRoot}>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />

      {/* Drawer panel */}
      <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Quyền riêng tư dữ liệu">
        <div className={styles.drawerHeader}>
          <span className={styles.drawerTitle}>Quyền riêng tư — {patientName}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className={styles.drawerBody}>
          <PrivacyPanel
            patientId={patientId}
            patientName={patientName}
            onPurgeSuccess={handlePurgeSuccess}
          />
        </div>
      </div>
    </div>
  );
}
