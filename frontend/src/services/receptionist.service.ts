/*
 * Created: 2026-06-24
 * Purpose: Receptionist patient check-in and scheduling service adapter (T024).
 * Owner: Quang Trung
 */
export interface ReceptionistAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: "SCHEDULED" | "CHECKED_IN" | "CANCELLED";
}

const MOCK_APPOINTMENTS: ReceptionistAppointment[] = [
  { id: "APT-1001", patientName: "Nguyễn Văn A", doctorName: "Dr. Nguyễn Minh", time: "08:00", status: "SCHEDULED" },
  { id: "APT-1002", patientName: "Trần Thị B", doctorName: "Dr. Trần Hương", time: "09:30", status: "CHECKED_IN" },
  { id: "APT-1003", patientName: "Phạm Văn C", doctorName: "Dr. Phạm Tuấn", time: "11:00", status: "SCHEDULED" },
];

export async function fetchReceptionistAppointments(): Promise<ReceptionistAppointment[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/appointments`);
    if (res.ok) {
      const result = await res.json();
      const items = Array.isArray(result) ? result : result.data || [];
      return items.map((apt: any) => ({
        id: apt.id,
        patientName: apt.patient ? `${apt.patient.lastName} ${apt.patient.firstName}` : 'Bệnh nhân',
        doctorName: apt.doctor ? `Dr. ${apt.doctor.lastName} ${apt.doctor.firstName}` : 'Bác sĩ',
        time: apt.appointmentTime,
        status: apt.status,
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch receptionist appointments from real API, falling back to mock", e);
  }
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_APPOINTMENTS;
}

export async function checkInPatient(appointmentId: string): Promise<boolean> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'CHECKED_IN' }),
    });
    if (res.ok) {
      return true;
    }
  } catch (e) {
    console.warn("Failed to check in patient via real API, falling back to mock", e);
  }
  await new Promise((r) => setTimeout(r, 500));
  const apt = MOCK_APPOINTMENTS.find((a) => a.id === appointmentId);
  if (apt) {
    apt.status = "CHECKED_IN";
    return true;
  }
  return false;
}
