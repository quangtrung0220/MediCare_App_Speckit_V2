"use client";

/*
 * Created: 2026-04-11
 * Updated: 2026-07-04 — Added conditional layout for auth and user profile with logout.
 * Purpose: Shared responsive shell with sidebar, workspace header, and auth display.
 * Owner: Quang Trung
 */

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { SidebarNav } from "./SidebarNav";
import { NotificationBell } from "../notifications/NotificationBell";
import { getUser, logout, isAuthenticated } from "../../services/auth.service";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<ReturnType<typeof getUser>>(null);

  // Sync user details on route changes
  useEffect(() => {
    if (isAuthenticated()) {
      setUser(getUser());
    } else {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  // If we are on login or register page, render without Sidebar/Topbar
  const isAuthPage = ["/login", "/register"].includes(pathname);

  if (isAuthPage) {
    return <div className={styles.authContainer}>{children}</div>;
  }

  // Format display role text
  const getRoleLabel = (role?: string) => {
    switch (role?.toUpperCase()) {
      case "ADMIN":
        return "Quản trị viên";
      case "DOCTOR":
        return "Bác sĩ";
      case "NURSE":
        return "Điều dưỡng";
      case "RECEPTIONIST":
        return "Lễ tân";
      case "PHARMACIST":
        return "Dược sĩ";
      case "PATIENT":
        return "Bệnh nhân";
      default:
        return role || "Thành viên";
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⚕️</span>
          MediCare
        </div>
        
        <div className={styles.navContainer}>
          <SidebarNav />
        </div>

        {/* User Profile Info Footer in Sidebar */}
        {user && (
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user.email.substring(0, 2).toUpperCase()}
              </div>
              <div className={styles.userDetails}>
                <div className={styles.userEmail} title={user.email}>
                  {user.email}
                </div>
                <div className={styles.userRoleBadge}>
                  {getRoleLabel(user.role)}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={styles.logoutBtn}
              title="Đăng xuất khỏi hệ thống"
            >
              🚪 Đăng xuất
            </button>
          </div>
        )}
      </aside>

      <div className={styles.content}>
        {/* Top header bar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <span className={styles.topbarTitle}>Hệ thống quản lý phòng khám MediCare</span>
          </div>
          <div className={styles.topbarRight}>
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  );
}

