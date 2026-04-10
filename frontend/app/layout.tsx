import "./globals.css";
import type { ReactNode } from "react";
import { AppShell } from "../src/components/layout/AppShell";

export const metadata = {
  title: "MediCare App",
  description: "Clinic management frontend shell",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}