/*
 * Created: 2026-07-01
 * Purpose: Privacy panel component — allows patients/admins to export data or request purge.
 * Owner: Quang Trung
 */
'use client';

import { useState } from 'react';
import { exportPatientData, purgePatient } from '../../services/privacy.service';
import ConfirmPurgeModal from './ConfirmPurgeModal';
import styles from './PrivacyPanel.module.css';

interface PrivacyPanelProps {
  patientId: string;
  patientName: string;
  onPurgeSuccess?: () => void;
}

export default function PrivacyPanel({
  patientId,
  patientName,
  onPurgeSuccess,
}: PrivacyPanelProps) {
  const [showModal, setShowModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportSuccess, setExportSuccess] = useState(false);

  async function handleExport() {
    setExporting(true);
    setExportError(null);
    setExportSuccess(false);
    try {
      await exportPatientData(patientId);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (err: unknown) {
      setExportError(err instanceof Error ? err.message : 'Xuất dữ liệu thất bại.');
    } finally {
      setExporting(false);
    }
  }

  async function handlePurgeConfirm() {
    await purgePatient(patientId);
    onPurgeSuccess?.();
  }

  return (
    <>
      <div className={styles.privacyPanel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelIcon}>🔒</span>
          <div>
            <h3 className={styles.panelTitle}>Quyền riêng tư dữ liệu</h3>
            <p className={styles.panelSubtitle}>
              Quản lý và kiểm soát thông tin cá nhân của bệnh nhân theo tiêu chuẩn GDPR/HIPAA
            </p>
          </div>
        </div>

        <div className={styles.actionGrid}>
          {/* Export Action */}
          <div className={styles.actionCard}>
            <div className={styles.actionCardIcon}>📥</div>
            <div className={styles.actionCardContent}>
              <h4 className={styles.actionCardTitle}>Xuất toàn bộ hồ sơ</h4>
              <p className={styles.actionCardDesc}>
                Tải xuống tất cả dữ liệu bệnh nhân dưới dạng file <code>.json</code>,
                bao gồm hồ sơ cá nhân, lịch hẹn, bệnh án, đơn thuốc và hóa đơn.
              </p>
              {exportError && <p className={styles.errorText}>{exportError}</p>}
              {exportSuccess && (
                <p className={styles.successText}>✅ File đã được tải xuống thành công!</p>
              )}
            </div>
            <button
              className={styles.exportBtn}
              onClick={handleExport}
              disabled={exporting}
            >
              {exporting ? (
                <span className={styles.spinner}>⏳ Đang xuất...</span>
              ) : (
                '📥 Tải xuống (.json)'
              )}
            </button>
          </div>

          {/* Purge Action */}
          <div className={`${styles.actionCard} ${styles.dangerCard}`}>
            <div className={styles.actionCardIcon}>🗑️</div>
            <div className={styles.actionCardContent}>
              <h4 className={styles.actionCardTitle}>Xóa vĩnh viễn dữ liệu</h4>
              <p className={styles.actionCardDesc}>
                Xóa toàn bộ thông tin bệnh nhân khỏi hệ thống vĩnh viễn. Hành động này
                không thể hoàn tác. Bệnh nhân không được có hóa đơn chưa thanh toán.
              </p>
            </div>
            <button
              className={styles.purgeBtn}
              onClick={() => setShowModal(true)}
            >
              🗑️ Yêu cầu xóa vĩnh viễn
            </button>
          </div>
        </div>

        <p className={styles.footerNote}>
          Mọi hành động xuất và xóa dữ liệu đều được ghi nhận vào nhật ký kiểm toán bảo mật hệ thống.
        </p>
      </div>

      {showModal && (
        <ConfirmPurgeModal
          patientName={patientName}
          onConfirm={handlePurgeConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}
    </>
  );
}
