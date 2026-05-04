/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Reusable placeholder content block for scaffolded routes.
 * Owner: Quang Trung
 */
import styles from "./RoutePlaceholder.module.css";

type RoutePlaceholderProps = {
  title: string;
  description: string;
};

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <section className="card">
      <h1 className={styles.heading}>{title}</h1>
      <p className={`muted ${styles.description}`}>
        {description}
      </p>
    </section>
  );
}
