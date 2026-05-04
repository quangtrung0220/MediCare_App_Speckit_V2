/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared button primitive with variant styles.
 * Owner: Quang Trung
 */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({ variant = "primary", children, className, ...props }: ButtonProps) {
  const variantClass = variant === "primary" ? styles.primary : variant === "secondary" ? styles.secondary : styles.ghost;
  return (
    <button
      {...props}
      className={`${styles.button} ${variantClass} ${className || ""}`}
    >
      {children}
    </button>
  );
}
