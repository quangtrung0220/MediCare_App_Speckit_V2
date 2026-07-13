"use client";

/*
 * Created: 2026-04-11
 * Updated: 2026-07-04 — Added dynamic role-based filtering (RBAC navigation).
 * Purpose: Sidebar navigation for top-level module routes.
 * Owner: Quang Trung
 */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getUser, isAuthenticated } from "../../services/auth.service";
import styles from "./SidebarNav.module.css";

type SidebarNavProps = {
  onNavigateAction?: () => void;
};

const ALL_NAV_ITEMS = [
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

const ROLE_PERMITTED_LINKS: Record<string, string[]> = {
  ADMIN: ["/", "/admin", "/audit", "/reports", "/patients", "/appointments", "/medical-records", "/prescriptions", "/inventory", "/billing", "/profile/privacy"],
  DOCTOR: ["/", "/doctor", "/patients", "/medical-records", "/prescriptions", "/profile/privacy"],
  NURSE: ["/", "/nurse", "/patients", "/profile/privacy"],
  RECEPTIONIST: ["/", "/receptionist", "/appointments", "/patients", "/profile/privacy"],
  PHARMACIST: ["/", "/pharmacist", "/inventory", "/profile/privacy"],
  PATIENT: ["/", "/patient", "/book-appointment", "/my-appointments", "/profile/privacy"],
};

export function SidebarNav({ onNavigateAction }: SidebarNavProps) {
  const pathname = usePathname();
  const currentUser = getUser();
  const loggedIn = isAuthenticated();

  // If not logged in, show no navigation links
  if (!loggedIn || !currentUser) {
    return null;
  }

  const userRole = currentUser.role?.toUpperCase();
  const allowedLinks = ROLE_PERMITTED_LINKS[userRole] || ["/"];

  const filteredItems = ALL_NAV_ITEMS.filter((item) => allowedLinks.includes(item.href));

  return (
    <nav aria-label="Primary navigation" className={styles.nav}>
      {filteredItems.map((item) => {
        // Highlight current route
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

