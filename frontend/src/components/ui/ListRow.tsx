/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared row primitive for list/table-like summaries.
 * Owner: Quang Trung
 */
import type { ReactNode } from "react";
import styles from "./ListRow.module.css";

type ListRowProps = {
  title: string;
  description?: string;
  meta?: ReactNode;
  onClick?: () => void;
  className?: string;
};

export function ListRow({ title, description, meta, onClick, className }: ListRowProps) {
  const interactive = typeof onClick === "function";

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!interactive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick?.();
    }
  };

  if (interactive) {
    return (
      <div
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={onClick}
        className={`${styles.row} ${styles.interactive} ${className || ""}`}
      >
        <div className={styles.rowContent}>
          <div className={styles.title}>{title}</div>
          {description ? <div className={`muted ${styles.description}`}>{description}</div> : null}
        </div>
        {meta ? <div className={styles.meta}>{meta}</div> : null}
      </div>
    );
  }

  return (
    <div className={`${styles.row} ${className || ""}`}>
      <div className={styles.rowContent}>
        <div className={styles.title}>{title}</div>
        {description ? <div className={`muted ${styles.description}`}>{description}</div> : null}
      </div>
      {meta ? <div className={styles.meta}>{meta}</div> : null}
    </div>
  );
}
