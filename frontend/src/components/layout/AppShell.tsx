"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { SidebarNav } from "./SidebarNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "280px 1fr" }}>
      <aside
        style={{
          borderRight: "1px solid var(--border)",
          background: "var(--panel)",
          padding: "1rem",
          position: mobileOpen ? "fixed" : "sticky",
          top: 0,
          height: "100vh",
          width: 280,
          zIndex: 12,
          transform: mobileOpen ? "translateX(0)" : "translateX(0)",
        }}
      >
        <div style={{ fontWeight: 700, color: "var(--brand)", marginBottom: "1rem" }}>MediCare</div>
        <SidebarNav onNavigate={() => setMobileOpen(false)} />
      </aside>
      <main style={{ padding: "1rem 1.2rem" }}>
        <div
          className="card"
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}
        >
          <div>
            <div style={{ fontWeight: 600 }}>Clinic Workspace</div>
            <div className="muted" style={{ fontSize: ".9rem" }}>
              Shared shell for Android, iOS, and Windows experiences
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              border: "1px solid var(--border)",
              background: "var(--panel)",
              borderRadius: 10,
              padding: ".45rem .75rem",
              cursor: "pointer",
            }}
          >
            Toggle Menu
          </button>
        </div>
        {children}
      </main>
    </div>
  );
}