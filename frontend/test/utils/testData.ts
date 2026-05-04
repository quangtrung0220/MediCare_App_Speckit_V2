import type { PatientRecord } from "@/services/patient.mock";

export function buildPatient(overrides: Partial<PatientRecord> = {}): PatientRecord {
  return {
    id: "PAT-001",
    name: "Nguyễn Văn A",
    dateOfBirth: "1980-03-15",
    gender: "M",
    phone: "+84901234567",
    email: "nguyena@example.com",
    lastVisit: "2026-04-28",
    ...overrides,
  };
}

export function buildPatients(): PatientRecord[] {
  return [
    buildPatient(),
    buildPatient({
      id: "PAT-002",
      name: "Trần Thị B",
      dateOfBirth: "1992-07-22",
      gender: "F",
      phone: "+84912345678",
      email: "tranb@example.com",
      lastVisit: undefined,
    }),
  ];
}