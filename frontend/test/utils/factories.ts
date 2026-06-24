/*
 * Created: 2026-06-24
 * Purpose: Reusable mock data factories for frontend tests.
 * Owner: Quang Trung
 */
import type { PatientRecord } from "@/services/patient.mock";
import type { AppointmentSummary } from "@/types/appointment";

let idCounter = 1;

/**
 * Creates a mock PatientRecord with sensible defaults.
 * Override any field via the `overrides` parameter.
 */
export function createMockPatient(overrides?: Partial<PatientRecord>): PatientRecord {
  const id = `PAT-TEST-${String(idCounter++).padStart(3, "0")}`;
  return {
    id,
    name: `Test Patient ${id}`,
    dateOfBirth: "1990-01-01",
    gender: "M",
    phone: "+84900000000",
    email: `${id.toLowerCase()}@test.com`,
    ...overrides,
  };
}

/**
 * Creates a mock AppointmentSummary with sensible defaults.
 */
export function createMockAppointment(
  overrides?: Partial<AppointmentSummary>
): AppointmentSummary {
  const id = `APT-TEST-${String(idCounter++).padStart(3, "0")}`;
  return {
    id,
    patientId: "PAT-001",
    doctorId: "DOC-001",
    appointmentDate: "2026-07-01",
    appointmentTime: "09:00",
    status: "SCHEDULED",
    ...overrides,
  };
}

/**
 * Resets the ID counter between tests to avoid flaky assertions.
 */
export function resetMockIdCounter() {
  idCounter = 1;
}
