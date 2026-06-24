/*
 * Created: 2026-06-24
 * Purpose: Doctor card component for booking flow doctor selection (T014).
 * Owner: Quang Trung
 */
import type { DoctorSummary } from '@/types/booking';
import { getDoctorDisplayName } from '@/types/booking';
import styles from './DoctorCard.module.css';

type Props = {
  doctor: DoctorSummary;
  selected?: boolean;
  onSelect: (doctor: DoctorSummary) => void;
};

export function DoctorCard({ doctor, selected, onSelect }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect(doctor)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(doctor);
        }
      }}
    >
      <div className={styles.avatar}>
        {doctor.lastName.charAt(0)}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{getDoctorDisplayName(doctor)}</div>
        <div className={styles.spec}>{doctor.specialization}</div>
        <div className={styles.fee}>
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(doctor.consultationFee)}
        </div>
      </div>
    </div>
  );
}
