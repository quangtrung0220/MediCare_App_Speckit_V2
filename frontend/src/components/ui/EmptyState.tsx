/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared empty-state display component.
 * Owner: Quang Trung
 */
import type { ReactNode } from "react";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={`card ${styles.container}`}>
      <h3 className={styles.title}>{title}</h3>
      <p className="muted">{description}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
