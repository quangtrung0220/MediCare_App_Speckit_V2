/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared appointment data types.
 * Owner: Quang Trung
 */
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export type AppointmentSummary = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
};
