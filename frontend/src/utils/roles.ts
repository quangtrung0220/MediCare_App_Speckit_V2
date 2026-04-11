/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Role keys and labels used across frontend routes.
 * Owner: Quang Trung
 */
export const ROLE_KEYS = [
  "ADMIN",
  "DOCTOR",
  "NURSE",
  "RECEPTIONIST",
  "PHARMACIST",
  "PATIENT",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export const ROLE_LABELS: Record<RoleKey, string> = {
  ADMIN: "Admin",
  DOCTOR: "Doctor",
  NURSE: "Nurse",
  RECEPTIONIST: "Receptionist",
  PHARMACIST: "Pharmacist",
  PATIENT: "Patient",
};
