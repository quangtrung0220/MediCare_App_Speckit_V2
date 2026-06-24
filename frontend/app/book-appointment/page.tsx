/*
 * Created: 2026-06-24
 * Purpose: Patient booking dashboard page — multi-step booking flow (T013).
 * Owner: Quang Trung
 */
"use client";

import { useEffect } from 'react';
import { useBookingStore } from '@/stores/appointmentStore';
import { DoctorCard } from '@/components/booking/DoctorCard';
import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker';
import { ConfirmPreview, BookingSuccess } from '@/components/booking/BookingConfirmation';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { getDoctorDisplayName } from '@/types/booking';
import styles from './page.module.css';

export default function BookAppointmentPage() {
  const store = useBookingStore();

  useEffect(() => {
    store.loadDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {/* Step indicator */}
      <div className={styles.steps}>
        <div className={`${styles.stepDot} ${store.step === 'SELECT_DOCTOR' ? styles.active : ''} ${['SELECT_SLOT', 'CONFIRM', 'DONE'].includes(store.step) ? styles.completed : ''}`}>
          1
        </div>
        <div className={styles.stepLine} />
        <div className={`${styles.stepDot} ${store.step === 'SELECT_SLOT' ? styles.active : ''} ${['CONFIRM', 'DONE'].includes(store.step) ? styles.completed : ''}`}>
          2
        </div>
        <div className={styles.stepLine} />
        <div className={`${styles.stepDot} ${store.step === 'CONFIRM' ? styles.active : ''} ${store.step === 'DONE' ? styles.completed : ''}`}>
          3
        </div>
      </div>

      <h1 className={styles.title}>Đặt lịch khám</h1>

      {store.error && (
        <div className={styles.errorBanner}>{store.error}</div>
      )}

      {/* Step 1: Select Doctor */}
      {store.step === 'SELECT_DOCTOR' && (
        <section>
          <h2 className={styles.sectionTitle}>Chọn bác sĩ</h2>
          {store.isLoading && <LoadingState label="Đang tải danh sách bác sĩ..." />}
          {!store.isLoading && store.doctors.length === 0 && (
            <EmptyState
              title="Không có bác sĩ"
              description="Hiện chưa có bác sĩ nào sẵn sàng khám."
            />
          )}
          {!store.isLoading && store.doctors.length > 0 && (
            <div className={styles.doctorGrid}>
              {store.doctors.map((doc) => (
                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  onSelect={(d) => store.selectDoctor(d)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Step 2: Select Time Slot */}
      {store.step === 'SELECT_SLOT' && (
        <section>
          <h2 className={styles.sectionTitle}>
            Chọn thời gian — {store.selectedDoctor ? getDoctorDisplayName(store.selectedDoctor) : ''}
          </h2>
          {store.isLoading ? (
            <LoadingState label="Đang tải lịch trống..." />
          ) : (
            <TimeSlotPicker
              slots={store.timeSlots}
              selectedTime={store.selectedTime}
              onSelect={store.selectTime}
              date={store.selectedDate}
              onDateChange={store.changeDate}
            />
          )}
          <button className={styles.backLink} onClick={store.goBack} type="button">
            ← Chọn bác sĩ khác
          </button>
        </section>
      )}

      {/* Step 3: Confirm */}
      {store.step === 'CONFIRM' && store.selectedDoctor && store.selectedTime && (
        <ConfirmPreview
          doctorName={getDoctorDisplayName(store.selectedDoctor)}
          date={store.selectedDate}
          time={store.selectedTime}
          onConfirm={store.confirmBooking}
          onBack={store.goBack}
          isLoading={store.isLoading}
        />
      )}

      {/* Step 4: Success */}
      {store.step === 'DONE' && store.confirmation && (
        <BookingSuccess
          confirmation={store.confirmation}
          onNewBooking={store.reset}
        />
      )}
    </div>
  );
}
