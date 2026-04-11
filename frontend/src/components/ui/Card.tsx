/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared card container for sectioned content.
 * Owner: Quang Trung
 */
import type { ReactNode } from "react";

type CardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function Card({ title, description, children }: CardProps) {
  return (
    <section className="card">
      {title ? <h2 style={{ marginTop: 0, marginBottom: ".25rem" }}>{title}</h2> : null}
      {description ? <p className="muted" style={{ marginTop: 0 }}>{description}</p> : null}
      {children}
    </section>
  );
}
