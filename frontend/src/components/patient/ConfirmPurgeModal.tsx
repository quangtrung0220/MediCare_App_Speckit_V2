/*
 * Created: 2026-07-01
 * Purpose: Confirmation modal before hard-deleting a patient (GDPR purge).
 * Owner: Quang Trung
 */
'use client';

import { useState } from 'react';
import styles from './PrivacyPanel.module.css';

interface ConfirmPurgeModalProps {
  patientName: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

export default function ConfirmPurgeModal({
  patientName,
  onConfirm,
  onCancel,
}: ConfirmPurgeModalProps) {
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isConfirmed = inputValue.trim() === patientName.trim();

  async function handleConfirm() {
    if (!isConfirmed) return;
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra. Vui lòng thử lại.');
      setLoading(false);
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <div className={styles.modalIcon}>⚠️</div>
        <h2 className={styles.modalTitle}>Xác nhận xóa vĩnh viễn</h2>

        <div className={styles.modalWarning}>
          <p>Hành động này <strong>không thể hoàn tác</strong>. Toàn bộ dữ liệu sau sẽ bị xóa vĩnh viễn:</p>
          <ul className={styles.warningList}>
            <li>Hồ sơ bệnh nhân và thông tin cá nhân</li>
            <li>Toàn bộ lịch sử lịch hẹn</li>
            <li>Bệnh án điện tử (EMR) và chẩn đoán</li>
            <li>Đơn thuốc và lịch sử cấp phát</li>
            <li>Hóa đơn và lịch sử thanh toán</li>
          </ul>
        </div>

        <div className={styles.confirmField}>
          <label className={styles.confirmLabel}>
            Nhập tên bệnh nhân <strong>&ldquo;{patientName}&rdquo;</strong> để xác nhận:
          </label>
          <input
            type="text"
            className={styles.confirmInput}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Nhập: ${patientName}`}
            autoFocus
          />
        </div>

        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
            disabled={loading}
          >
            Hủy bỏ
          </button>
          <button
            className={`${styles.purgeBtn} ${!isConfirmed ? styles.purgeBtnDisabled : ''}`}
            onClick={handleConfirm}
            disabled={!isConfirmed || loading}
          >
            {loading ? 'Đang xóa...' : '🗑️ Xóa vĩnh viễn'}
          </button>
        </div>
      </div>
    </div>
  );
}
