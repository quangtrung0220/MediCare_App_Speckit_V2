/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared button primitive with variant styles.
 * Owner: Quang Trung
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

const VARIANT_STYLES: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: {
    background: "var(--brand)",
    color: "white",
    border: "1px solid var(--brand)",
  },
  secondary: {
    background: "white",
    color: "var(--text)",
    border: "1px solid var(--border)",
  },
  ghost: {
    background: "transparent",
    color: "var(--text)",
    border: "1px solid transparent",
  },
};

export function Button({ variant = "primary", children, style, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      style={{
        borderRadius: 10,
        padding: ".6rem .9rem",
        fontWeight: 600,
        cursor: "pointer",
        ...VARIANT_STYLES[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}
