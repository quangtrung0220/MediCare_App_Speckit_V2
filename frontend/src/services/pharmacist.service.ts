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
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_PRESCRIPTIONS;
}

export async function dispensePrescription(id: string): Promise<boolean> {
  await new Promise((r) => setTimeout(r, 600));
  const rx = MOCK_PRESCRIPTIONS.find((p) => p.id === id);
  if (rx) {
    rx.status = "DISPENSED";
    return true;
  }
  return false;
}

export async function fetchInventoryStock(): Promise<InventoryItem[]> {
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_INVENTORY;
}
