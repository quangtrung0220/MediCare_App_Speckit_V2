/*
 * Created: 2026-05-03
 * Updated: 2026-05-03
 * Purpose: Mock patient data for Issue 3 patient list screen development.
 * Owner: Quang Trung
 */
import type { AppointmentSummary } from "@/types/appointment";

export interface PatientRecord {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: "M" | "F" | "Other";
  phone: string;
  email: string;
  lastVisit?: string;
  lastAppointment?: AppointmentSummary;
}

// Mock patient data for demo and testing
export const MOCK_PATIENTS: PatientRecord[] = [
  {
    id: "PAT-001",
    name: "Nguyễn Văn A",
    dateOfBirth: "1980-03-15",
    gender: "M",
    phone: "+84901234567",
    email: "nguyena@example.com",
    lastVisit: "2026-04-28",
  },
  {
    id: "PAT-002",
    name: "Trần Thị B",
    dateOfBirth: "1992-07-22",
    gender: "F",
    phone: "+84912345678",
    email: "tranb@example.com",
    lastVisit: "2026-04-20",
  },
  {
    id: "PAT-003",
    name: "Phạm Văn C",
    dateOfBirth: "1975-11-08",
    gender: "M",
    phone: "+84923456789",
    email: "phamc@example.com",
    lastVisit: "2026-04-10",
  },
  {
    id: "PAT-004",
    name: "Hoàng Thị D",
    dateOfBirth: "1988-05-30",
    gender: "F",
    phone: "+84934567890",
    email: "hoangd@example.com",
  },
  {
    id: "PAT-005",
    name: "Võ Văn E",
    dateOfBirth: "1995-09-12",
    gender: "M",
    phone: "+84945678901",
    email: "voe@example.com",
    lastVisit: "2026-02-15",
  },
];

/**
 * Simulates fetching patient list from backend with delay.
 * Used for frontend-first development before backend API integration.
 */
export async function fetchPatientsMock(
  options?: {
    delay?: number;
    limit?: number;
    offset?: number;
  }
): Promise<{ patients: PatientRecord[]; total: number }> {
  const delay = options?.delay ?? 800;
  const limit = options?.limit ?? 10;
  const offset = options?.offset ?? 0;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, delay));

  const sliced = MOCK_PATIENTS.slice(offset, offset + limit);
  return {
    patients: sliced,
    total: MOCK_PATIENTS.length,
  };
}

/**
 * Simulates fetching a single patient by ID.
 */
export async function fetchPatientByIdMock(
  id: string,
  options?: { delay?: number }
): Promise<PatientRecord | null> {
  const delay = options?.delay ?? 500;
  await new Promise((resolve) => setTimeout(resolve, delay));

  return MOCK_PATIENTS.find((p) => p.id === id) ?? null;
}
