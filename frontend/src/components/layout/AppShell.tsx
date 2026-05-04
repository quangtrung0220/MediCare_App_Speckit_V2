"use client";

/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared responsive shell with sidebar and workspace header.
 * Owner: Quang Trung
 */

import type { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import styles from "./AppShell.module.css";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>MediCare</div>
        <SidebarNav />
      </aside>
      <main className={styles.main}>
        <div className={`card ${styles.workspaceHeader}`}>
          <div>
            <div className={styles.workspaceTitle}>Clinic Workspace</div>
            <div className={`muted ${styles.workspaceSubtitle}`}>
              Shared shell for Android, iOS, and Windows experiences
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
