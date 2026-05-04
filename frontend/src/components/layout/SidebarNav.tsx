"use client";

/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Sidebar navigation for top-level module routes.
 * Owner: Quang Trung
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./SidebarNav.module.css";

type SidebarNavProps = {
  onNavigateAction?: () => void;
};

const NAV_ITEMS = [
  // Central route registry for shell navigation to avoid hard-coded links across pages.
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

export function SidebarNav({ onNavigateAction }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      {NAV_ITEMS.map((item) => {
        // Highlight current route to preserve orientation across role modules.
        const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigateAction}
            className={`${styles.navLink} ${active ? styles.active : ""}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
