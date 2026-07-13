"use client";

/*
 * Created: 2026-07-04
 * Purpose: Route guard component checking authentication and Role-Based Access Control (RBAC).
 * Owner: Quang Trung
 */

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isAuthenticated, getUser } from "../../services/auth.service";
import Link from "next/link";
import styles from "./AuthGuard.module.css";

// Public pages that do not require authentication
const PUBLIC_PATHS = ["/login", "/register"];

// Role-based route access mappings
const ROLE_ROUTE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: ["/", "/admin", "/audit", "/reports", "/patients", "/appointments", "/medical-records", "/prescriptions", "/inventory", "/billing", "/profile/privacy"],
  DOCTOR: ["/", "/doctor", "/patients", "/medical-records", "/prescriptions", "/profile/privacy"],
  NURSE: ["/", "/nurse", "/patients", "/profile/privacy"],
  RECEPTIONIST: ["/", "/receptionist", "/appointments", "/patients", "/profile/privacy"],
  PHARMACIST: ["/", "/pharmacist", "/inventory", "/profile/privacy"],
  PATIENT: ["/", "/patient", "/book-appointment", "/my-appointments", "/profile/privacy"],
};

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [deniedReason, setDeniedReason] = useState<"UNAUTHENTICATED" | "UNAUTHORIZED" | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const isPublic = PUBLIC_PATHS.includes(pathname);
    const loggedIn = isAuthenticated();
    const currentUser = getUser();

    if (!loggedIn) {
      if (isPublic) {
        setAuthorized(true);
        setDeniedReason(null);
      } else {
        setAuthorized(false);
        setDeniedReason("UNAUTHENTICATED");
        router.push("/login");
      }
    } else {
      // User is logged in
      if (isPublic) {
        // Redirect to homepage if they try to access login/register while authenticated
        router.push("/");
      } else {
        // Check Role-Based Access Control (RBAC)
        const userRole = currentUser?.role?.toUpperCase();
        const permittedRoutes = userRole ? ROLE_ROUTE_PERMISSIONS[userRole] : [];
        
        // Exact or prefix check for child pages (e.g. /doctor/encounter/[id])
        const hasAccess = permittedRoutes?.some(route => 
          route === "/" ? pathname === "/" : pathname === route || pathname.startsWith(`${route}/`)
        );

        if (hasAccess) {
          setAuthorized(true);
          setDeniedReason(null);
        } else {
          setAuthorized(false);
          setDeniedReason("UNAUTHORIZED");
        }
      }
    }
  }, [isMounted, pathname, router]);

  // Prevent hydration mismatch by showing nothing until client-mounted
  if (!isMounted) {
    return null;
  }

  if (deniedReason === "UNAUTHORIZED") {
    const currentUser = getUser();
    return (
      <div className={styles.deniedContainer}>
        <div className={styles.deniedCard}>
          <div className={styles.iconWrapper}>
            <span className={styles.icon}>🔒</span>
          </div>
          <h1 className={styles.title}>Truy cập bị từ chối</h1>
          <p className={styles.message}>
            Tài khoản của bạn ({currentUser?.email}) với vai trò <strong>{currentUser?.role}</strong> không có quyền truy cập vào đường dẫn <code>{pathname}</code>.
          </p>
          <div className={styles.actions}>
            <Link href="/" className={styles.homeBtn}>
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!authorized) {
    // Return empty placeholder while redirecting
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Đang xác thực thông tin...</p>
      </div>
    );
  }

  return <>{children}</>;
}
