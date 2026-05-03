/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared appointment data types.
 * Owner: Quang Trung
 */
import { APPOINTMENT_STATUSES } from "@/utils/statuses";

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

export type AppointmentSummary = {
  id: string;
  patientId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: AppointmentStatus;
};
