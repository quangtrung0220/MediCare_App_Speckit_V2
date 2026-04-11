/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared row primitive for list/table-like summaries.
 * Owner: Quang Trung
 */
import type { ReactNode } from "react";

type ListRowProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
};

export function ListRow({ title, description, meta }: ListRowProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        alignItems: "center",
        borderBottom: "1px solid var(--border)",
        padding: ".8rem 0",
      }}
    >
      <div>
        <div style={{ fontWeight: 600 }}>{title}</div>
        {description ? <div className="muted" style={{ fontSize: ".9rem" }}>{description}</div> : null}
      </div>
      {meta ? <div>{meta}</div> : null}
    </div>
  );
}
