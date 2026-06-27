/*
 * Created: 2026-06-24
 * Purpose: Pharmacist prescriptions queue and inventory service adapter (T025).
 * Owner: Quang Trung
 */
export interface PharmacistPrescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: "PENDING" | "DISPENSED" | "HOLD";
  items: string[];
}

export interface InventoryItem {
  code: string;
  name: string;
  quantity: number;
  minQuantity: number;
}

const MOCK_PRESCRIPTIONS: PharmacistPrescription[] = [
  {
    id: "RX-501",
    patientName: "Nguyễn Văn A",
    doctorName: "Dr. Nguyễn Minh",
    date: "2026-06-24",
    status: "PENDING",
    items: ["Paracetamol 500mg x 10 viên", "Amoxicillin 500mg x 14 viên"],
  },
  {
    id: "RX-502",
    patientName: "Trần Thị B",
    doctorName: "Dr. Trần Hương",
    date: "2026-06-24",
    status: "DISPENSED",
    items: ["Vitamin C 500mg x 30 viên"],
  },
  {
    id: "RX-503",
    patientName: "Phạm Văn C",
    doctorName: "Dr. Phạm Tuấn",
    date: "2026-06-23",
    status: "HOLD",
    items: ["Ibuprofen 400mg x 20 viên"],
  },
];

const MOCK_INVENTORY: InventoryItem[] = [
  { code: "MED-PAR", name: "Paracetamol 500mg", quantity: 1500, minQuantity: 200 },
  { code: "MED-AMO", name: "Amoxicillin 500mg", quantity: 80, minQuantity: 100 }, // Low stock!
  { code: "MED-IBU", name: "Ibuprofen 400mg", quantity: 450, minQuantity: 100 },
  { code: "MED-VIT", name: "Vitamin C 500mg", quantity: 15, minQuantity: 50 }, // Low stock!
  { code: "MED-MET", name: "Metformin 850mg", quantity: 800, minQuantity: 150 },
];

export async function fetchPendingPrescriptions(): Promise<PharmacistPrescription[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/prescriptions/pending`);
    if (res.ok) {
      const data = await res.json();
      return data.map((rx: any) => ({
        id: rx.id,
        patientName: rx.medicalRecord?.patient ? `${rx.medicalRecord.patient.lastName} ${rx.medicalRecord.patient.firstName}` : 'Bệnh nhân',
        doctorName: rx.medicalRecord?.doctor ? `Dr. ${rx.medicalRecord.doctor.lastName} ${rx.medicalRecord.doctor.firstName}` : 'Bác sĩ',
        date: rx.prescribedDate,
        status: rx.status,
        items: rx.items ? rx.items.map((item: any) => `${item.inventoryItem?.name || 'Thuốc'} x ${item.quantity} ${item.unit}`) : [],
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch pending prescriptions from real API, falling back to mock", e);
  }
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PRESCRIPTIONS;
}

export async function dispensePrescription(id: string): Promise<boolean> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/prescriptions/${id}/dispense`, {
      method: 'PATCH',
    });
    if (res.ok) {
      return true;
    }
  } catch (e) {
    console.warn("Failed to dispense prescription via real API, falling back to mock", e);
  }
  await new Promise((r) => setTimeout(r, 600));
  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id);
  if (rx) {
    rx.status = "DISPENSED";
    return true;
  }
  return false;
}

export async function fetchInventoryStock(): Promise<InventoryItem[]> {
  const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
  try {
    const res = await fetch(`${API_BASE}/inventory`);
    if (res.ok) {
      const data = await res.json();
      return data.map((item: any) => ({
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        minQuantity: item.minQuantity,
      }));
    }
  } catch (e) {
    console.warn("Failed to fetch inventory from real API, falling back to mock", e);
  }
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_INVENTORY;
}
