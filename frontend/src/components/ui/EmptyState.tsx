/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared empty-state display component.
 * Owner: Quang Trung
 */
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="card" style={{ textAlign: "center", padding: "1.5rem" }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      <p className="muted">{description}</p>
      {action ? <div style={{ marginTop: "1rem" }}>{action}</div> : null}
    </div>
  );
}
