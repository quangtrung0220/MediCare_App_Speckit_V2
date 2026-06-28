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
  { href: "/", label: "🏥 Overview" },
  { href: "/admin", label: "🔑 Admin Panel" },
  { href: "/doctor", label: "👨‍⚕️ Doctor Desk" },
  { href: "/nurse", label: "🩺 Nurse Desk" },
  { href: "/receptionist", label: "📅 Reception Desk" },
  { href: "/pharmacist", label: "💊 Pharmacy Desk" },
  { href: "/patient", label: "👤 Patient Portal" },
  { href: "/book-appointment", label: "✍️ Book Appointment" },
  { href: "/my-appointments", label: "🗓️ My Appointments" },
  { href: "/patients", label: "👥 Patients Directory" },
  { href: "/appointments", label: "🗒️ Appointments Master" },
  { href: "/medical-records", label: "📂 EMR Records" },
  { href: "/prescriptions", label: "📜 Prescriptions List" },
  { href: "/inventory", label: "📦 Medicine Inventory" },
  { href: "/billing", label: "💳 Billing & Invoices" },
  { href: "/reports", label: "📊 Reports & Stats" },
  { href: "/profile/privacy", label: "🔒 Data Privacy" },
  { href: "/audit", label: "🕵️ Audit Logs" },
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
