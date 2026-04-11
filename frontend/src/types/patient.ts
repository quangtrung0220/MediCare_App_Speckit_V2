/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared patient data types and display helper.
 * Owner: Quang Trung
 */
export type PatientSummary = {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  phone?: string;
  bloodType?: string;
};

export function getPatientDisplayName(patient: PatientSummary) {
  return `${patient.lastName} ${patient.firstName}`.trim();
}
