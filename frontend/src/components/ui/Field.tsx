/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared form field wrapper and text input primitive.
 * Owner: Quang Trung
 */
import type { InputHTMLAttributes, ReactNode } from "react";

type FieldProps = {
  label: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
};

export function Field({ label, helperText, error, children }: FieldProps) {
  return (
    // Wrap input and messages in one label block so click/focus behavior stays predictable.
    <label style={{ display: "grid", gap: ".35rem" }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
      {children}
      {/* Helper text shows guidance; error text shows validation feedback when present. */}
      {helperText ? <span className="muted" style={{ fontSize: ".85rem" }}>{helperText}</span> : null}
      {error ? <span style={{ fontSize: ".85rem", color: "#b42318" }}>{error}</span> : null}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        borderRadius: 10,
        border: "1px solid var(--border)",
        padding: ".65rem .8rem",
        font: "inherit",
        background: "white",
      }}
    />
  );
}
