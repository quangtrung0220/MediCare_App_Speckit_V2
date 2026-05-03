"use client";

/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared responsive shell with sidebar and workspace header.
 * Owner: Quang Trung
 */

import type { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "row" }}>
      <aside
        style={{
          flex: "0 0 280px",
          borderRight: "1px solid var(--border)",
          background: "var(--panel)",
          padding: "1rem",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 12,
        }}
      >
        <div style={{ fontWeight: 700, color: "var(--brand)", marginBottom: "1rem" }}>MediCare</div>
        <SidebarNav />
      </aside>
      <main style={{ flex: 1, padding: "1rem 1.2rem", overflow: "auto" }}>
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", justifyContent: "flex-start", marginBottom: "1rem" }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>Clinic Workspace</div>
            <div className="muted" style={{ fontSize: ".9rem" }}>
              Shared shell for Android, iOS, and Windows experiences
            </div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}
