/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Root Next.js layout that wraps pages with AppShell.
 * Owner: Quang Trung
 */
import "./globals.css";
import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { AuthGuard } from "@/components/auth/AuthGuard";

export const metadata: Metadata = {
  title: "MediCare App",
  description: "Clinic management frontend shell",
  referrer: "no-referrer",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <AppShell>{children}</AppShell>
        </AuthGuard>
      </body>
    </html>
  );
}

