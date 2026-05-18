/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared form field wrapper and text input primitive.
 * Owner: Quang Trung
 */
import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./Field.module.css";

type FieldProps = {
  label: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, helperText, error, children }: FieldProps) {
  return (
    // Wrap input and messages in one label block so click/focus behavior stays predictable.
    <label className={styles.label}>
      <span className={styles.labelText}>{label}</span>
      {children}
      {/* Helper text shows guidance; error text shows validation feedback when present. */}
      {helperText ? <span className={`muted ${styles.helperText}`}>{helperText}</span> : null}
      {error ? <span className={styles.errorText}>{error}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={styles.textInput}
    />
  );
}
