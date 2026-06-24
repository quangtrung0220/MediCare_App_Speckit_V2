/*
 * Created: 2026-06-24
 * Purpose: Time slot picker for booking flow (T014).
 * Owner: Quang Trung
 */
import type { TimeSlot } from '@/types/booking';
import styles from './TimeSlotPicker.module.css';

type Props = {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
  date: string;
  onDateChange: (date: string) => void;
};

export function TimeSlotPicker({ slots, selectedTime, onSelect, date, onDateChange }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.dateRow}>
        <label className={styles.dateLabel} htmlFor="booking-date">
          Chọn ngày khám:
        </label>
        <input
          id="booking-date"
          type="date"
          className={styles.dateInput}
          value={date}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {slots.map((slot) => (
          <button
            key={slot.time}
            type="button"
            disabled={!slot.available}
            className={`${styles.slot} ${
              selectedTime === slot.time ? styles.selected : ''
            } ${!slot.available ? styles.disabled : ''}`}
            onClick={() => slot.available && onSelect(slot.time)}
          >
            {slot.time}
          </button>
        ))}
      </div>

      {slots.length === 0 && (
        <p className={styles.empty}>Không có lịch trống cho ngày này.</p>
      )}
    </div>
  );
}
