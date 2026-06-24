/*
 * Created: 2026-06-24
 * Purpose: Booking confirmation card and reminder status display (T015).
 * Owner: Quang Trung
 */
import type { BookingConfirmation } from '@/types/booking';
import { Button } from '@/components/ui/Button';
import styles from './BookingConfirmation.module.css';

type ConfirmPreviewProps = {
  doctorName: string;
  date: string;
  time: string;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
};

export function ConfirmPreview({ doctorName, date, time, onConfirm, onBack, isLoading }: ConfirmPreviewProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.heading}>Xác nhận lịch hẹn</h3>
      <div className={styles.details}>
        <div className={styles.row}>
          <span className={styles.label}>Bác sĩ:</span>
          <span className={styles.value}>{doctorName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Ngày:</span>
          <span className={styles.value}>{date}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Giờ:</span>
          <span className={styles.value}>{time}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={onBack} disabled={isLoading}>
          Quay lại
        </Button>
        <Button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Xác nhận đặt lịch'}
        </Button>
      </div>
    </div>
  );
}

type BookingSuccessProps = {
  confirmation: BookingConfirmation;
  onNewBooking: () => void;
};

export function BookingSuccess({ confirmation, onNewBooking }: BookingSuccessProps) {
  return (
    <div className={styles.successCard}>
      <div className={styles.successIcon}>✓</div>
      <h3 className={styles.successHeading}>Đặt lịch thành công!</h3>
      <div className={styles.details}>
        <div className={styles.row}>
          <span className={styles.label}>Mã lịch hẹn:</span>
          <span className={styles.value}>{confirmation.appointmentId}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Bác sĩ:</span>
          <span className={styles.value}>{confirmation.doctorName}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Ngày:</span>
          <span className={styles.value}>{confirmation.date}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Giờ:</span>
          <span className={styles.value}>{confirmation.time}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Trạng thái:</span>
          <span className={`${styles.value} ${styles.statusBadge}`}>
            {confirmation.status === 'CONFIRMED' ? '✓ Đã xác nhận' : '⏳ Đang chờ'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Nhắc nhở:</span>
          <span className={styles.value}>
            {confirmation.reminderStatus === 'SENT'
              ? '✓ Đã gửi'
              : confirmation.reminderStatus === 'PENDING'
              ? '⏳ Sẽ gửi trước ngày khám'
              : '—'}
          </span>
        </div>
      </div>
      <div className={styles.actions}>
        <Button onClick={onNewBooking}>Đặt lịch mới</Button>
      </div>
    </div>
  );
}
