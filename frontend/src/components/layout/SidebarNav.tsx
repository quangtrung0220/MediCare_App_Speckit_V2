"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarNavProps = {
  onNavigate?: () => void;
};

const NAV_ITEMS = [
  { href: "/", label: "Overview" },
  { href: "/admin", label: "Admin" },
  { href: "/doctor", label: "Doctor" },
  { href: "/nurse", label: "Nurse" },
  { href: "/receptionist", label: "Receptionist" },
  { href: "/pharmacist", label: "Pharmacist" },
  { href: "/patient", label: "Patient" },
  { href: "/book-appointment", label: "Book Appointment" },
  { href: "/my-appointments", label: "My Appointments" },
  { href: "/patients", label: "Patients" },
  { href: "/appointments", label: "Appointments" },
  { href: "/medical-records", label: "Medical Records" },
  { href: "/prescriptions", label: "Prescriptions" },
  { href: "/inventory", label: "Inventory" },
  { href: "/reports", label: "Reports" },
  { href: "/audit", label: "Audit" },
];

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav style={{ display: "grid", gap: ".35rem" }}>
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            style={{
              textDecoration: "none",
              border: "1px solid var(--border)",
              background: active ? "var(--brand-soft)" : "var(--panel)",
              color: active ? "#134e4a" : "inherit",
              borderRadius: 10,
              padding: ".55rem .75rem",
              fontWeight: active ? 600 : 500,
            }}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}