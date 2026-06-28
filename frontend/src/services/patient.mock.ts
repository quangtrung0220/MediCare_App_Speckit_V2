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
 * Real API call for fetching patients with dynamic environment fallback.
 */
export async function fetchPatients(options?: { limit?: number; offset?: number }) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const skip = options?.offset ?? 0;
    const take = options?.limit ?? 10;
    const res = await fetch(`${API_BASE}/patients?skip=${skip}&take=${take}`);
    if (res.ok) {
      const result = await res.json();
      return {
        patients: result.data.map((p: {
          id: string;
          firstName: string;
          lastName: string;
          dateOfBirth: string;
          gender: "M" | "F" | "Other";
          phone: string;
          email?: string;
          updatedAt?: string;
        }) => ({
          id: p.id,
          name: `${p.lastName} ${p.firstName}`,
          dateOfBirth: p.dateOfBirth,
          gender: p.gender,
          phone: p.phone,
          email: p.email || '',
          lastVisit: p.updatedAt ? p.updatedAt.slice(0, 10) : undefined,
        })),
        total: result.total,
      };
    }
  } catch (e) {
    console.warn("Failed to fetch patients from real API, falling back to mock", e);
  }
  return fetchPatientsMock(options);
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

/**
 * Real API call for getting patient by ID with mock fallback.
 */
export async function fetchPatientById(id: string) {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/patients/${id}`);
    if (res.ok) {
      const p = await res.json() as {
        id: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        gender: "M" | "F" | "Other";
        phone: string;
        email?: string;
        updatedAt?: string;
      };
      return {
        id: p.id,
        name: `${p.lastName} ${p.firstName}`,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        phone: p.phone,
        email: p.email || '',
        lastVisit: p.updatedAt ? p.updatedAt.slice(0, 10) : undefined,
      };
    }
  } catch (e) {
    console.warn(`Failed to fetch patient ${id} from real API, falling back to mock`, e);
  }
  return fetchPatientByIdMock(id);
}

/**
 * Creates a new patient on the backend, falling back to local memory mock state if unreachable.
 */
export async function createPatient(patientData: {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F" | "Other";
  phone: string;
  email?: string;
}): Promise<PatientRecord> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    });
    if (res.ok) {
      const p = await res.json();
      const createdRecord: PatientRecord = {
        id: p.id,
        name: `${p.lastName} ${p.firstName}`,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender as "M" | "F" | "Other",
        phone: p.phone || "",
        email: patientData.email || "",
        lastVisit: undefined,
      };
      // Synchronize in-memory list so local fallbacks are in sync
      MOCK_PATIENTS.unshift(createdRecord);
      return createdRecord;
    }
  } catch (e) {
    console.warn("Failed to create patient on NestJS backend, creating locally", e);
  }

  // Local memory fallback
  const createdRecord: PatientRecord = {
    id: `PAT-00${MOCK_PATIENTS.length + 1}`,
    name: `${patientData.lastName} ${patientData.firstName}`,
    dateOfBirth: patientData.dateOfBirth,
    gender: patientData.gender,
    phone: patientData.phone,
    email: patientData.email || "",
    lastVisit: undefined,
  };
  MOCK_PATIENTS.unshift(createdRecord);
  return createdRecord;
}

