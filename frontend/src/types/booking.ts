/*
 * Created: 2026-06-24
 * Purpose: Shared booking data types for frontend booking flow.
 * Owner: Quang Trung
 */

export type DoctorSummary = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  consultationFee: number;
  isAvailable: boolean;
};

export type TimeSlot = {
  time: string; // HH:mm
  available: boolean;
};

export type BookingConfirmation = {
  appointmentId: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'CONFIRMED' | 'PENDING';
  reminderStatus: 'SENT' | 'PENDING' | 'NONE';
};

export function getDoctorDisplayName(doctor: DoctorSummary): string {
  return `Dr. ${doctor.lastName} ${doctor.firstName}`.trim();
}
