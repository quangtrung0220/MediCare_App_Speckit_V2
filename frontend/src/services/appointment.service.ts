/*
 * Created: 2026-06-24
 * Purpose: Mock booking API adapter for frontend-first development (T016).
 * Owner: Quang Trung
 */
import type { DoctorSummary, TimeSlot, BookingConfirmation } from '@/types/booking';

const MOCK_DOCTORS: DoctorSummary[] = [
  { id: 'DOC-001', firstName: 'Minh', lastName: 'Nguyễn', specialization: 'Nội khoa', consultationFee: 200000, isAvailable: true },
  { id: 'DOC-002', firstName: 'Hương', lastName: 'Trần', specialization: 'Nhi khoa', consultationFee: 250000, isAvailable: true },
  { id: 'DOC-003', firstName: 'Tuấn', lastName: 'Phạm', specialization: 'Da liễu', consultationFee: 300000, isAvailable: true },
  { id: 'DOC-004', firstName: 'Lan', lastName: 'Lê', specialization: 'Mắt', consultationFee: 350000, isAvailable: false },
];

function generateTimeSlots(date: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  for (let h = 8; h < 17; h++) {
    for (const m of [0, 30]) {
      const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      // Random availability for mock data — seed based on date+time for consistency
      const seed = date.length + h * 60 + m;
      slots.push({ time, available: seed % 3 !== 0 });
    }
  }
  return slots;
}

export async function fetchDoctorsMock(
  options?: { delay?: number }
): Promise<DoctorSummary[]> {
  await new Promise((r) => setTimeout(r, options?.delay ?? 600));
  return MOCK_DOCTORS.filter((d) => d.isAvailable);
}

export async function fetchDoctors(options?: { delay?: number }): Promise<DoctorSummary[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/doctors`); // Doctor API list endpoint
    if (res.ok) {
      const data = await res.json();
      return data.map((d: {
        id: string;
        firstName: string;
        lastName: string;
        specialization: string;
        consultationFee: number;
        isAvailable: boolean;
      }) => ({
        id: d.id,
        firstName: d.firstName,
        lastName: d.lastName,
        specialization: d.specialization,
        consultationFee: d.consultationFee,
        isAvailable: d.isAvailable,
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch doctors from real API, falling back to mock", e);
  }
  return fetchDoctorsMock(options);
}

export async function fetchTimeSlotsMock(
  doctorId: string,
  date: string,
  options?: { delay?: number }
): Promise<TimeSlot[]> {
  await new Promise((r) => setTimeout(r, options?.delay ?? 400));
  return generateTimeSlots(date);
}

export async function fetchTimeSlots(
  doctorId: string,
  date: string,
  options?: { delay?: number }
): Promise<TimeSlot[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/appointments/slots?doctorId=${doctorId}&date=${date}`);
    if (res.ok) {
      return res.json();
    }
  } catch (e) {
    console.warn(`Failed to fetch slots for doctor ${doctorId} from real API, falling back to mock`, e);
  }
  return fetchTimeSlotsMock(doctorId, date, options);
}

let bookingCounter = 1;

export async function createBookingMock(
  doctorId: string,
  date: string,
  time: string,
  options?: { delay?: number }
): Promise<BookingConfirmation> {
  await new Promise((r) => setTimeout(r, options?.delay ?? 800));

  const doctor = MOCK_DOCTORS.find((d) => d.id === doctorId);
  if (!doctor) throw new Error('Bác sĩ không tồn tại');

  return {
    appointmentId: `APT-${String(bookingCounter++).padStart(4, '0')}`,
    doctorName: `Dr. ${doctor.lastName} ${doctor.firstName}`,
    date,
    time,
    status: 'CONFIRMED',
    reminderStatus: 'PENDING',
  };
}

export async function createBooking(
  doctorId: string,
  date: string,
  time: string,
  options?: { delay?: number }
): Promise<BookingConfirmation> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorId,
        appointmentDate: date,
        appointmentTime: time,
        durationMinutes: 30,
        status: 'SCHEDULED',
      }),
    });
    if (res.ok) {
      const apt = await res.json();
      return {
        appointmentId: apt.id,
        doctorName: apt.doctor ? `Dr. ${apt.doctor.lastName} ${apt.doctor.firstName}` : 'Doctor',
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        status: apt.status,
        reminderStatus: apt.reminderSent ? 'SENT' : 'PENDING',
      };
    }
  } catch (e) {
    console.warn("Failed to create appointment via real API, falling back to mock", e);
  }
  return createBookingMock(doctorId, date, time, options);
}

const MOCK_APPOINTMENTS: PatientAppointment[] = [
  {
    id: 'APT-0001',
    doctorName: 'Dr. Nguyễn Minh',
    date: '2026-06-25',
    time: '08:00',
    fee: 200000,
    status: 'SCHEDULED',
    reminderStatus: 'PENDING',
  },
  {
    id: 'APT-0002',
    doctorName: 'Dr. Trần Hương',
    date: '2026-06-20',
    time: '14:30',
    fee: 250000,
    status: 'COMPLETED',
    reminderStatus: 'SENT',
  },
];

export type PatientAppointment = {
  id: string;
  doctorName: string;
  date: string;
  time: string;
  fee: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  reminderStatus: 'SENT' | 'PENDING' | 'NONE';
};

export async function fetchAppointmentsMock(
  options?: { delay?: number }
): Promise<PatientAppointment[]> {
  await new Promise((r) => setTimeout(r, options?.delay ?? 500));
  return MOCK_APPOINTMENTS;
}

export async function fetchAppointments(
  options?: { delay?: number }
): Promise<PatientAppointment[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/appointments`);
    if (res.ok) {
      const data = await res.json();
      return data.map((apt: {
        id: string;
        appointmentDate: string;
        appointmentTime: string;
        status: string;
        reminderSent?: boolean;
        doctor?: {
          firstName: string;
          lastName: string;
          consultationFee: number;
        };
      }) => ({
        id: apt.id,
        doctorName: apt.doctor ? `Dr. ${apt.doctor.lastName} ${apt.doctor.firstName}` : 'Doctor',
        date: apt.appointmentDate,
        time: apt.appointmentTime,
        fee: apt.doctor?.consultationFee ?? 200000,
        status: apt.status === 'SCHEDULED' ? 'SCHEDULED' : apt.status === 'COMPLETED' ? 'COMPLETED' : 'CANCELLED',
        reminderStatus: apt.reminderSent ? 'SENT' : 'PENDING',
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch appointments from real API, falling back to mock", e);
  }
  return fetchAppointmentsMock(options);
}

