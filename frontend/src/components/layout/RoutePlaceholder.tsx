type RoutePlaceholderProps = {
  title: string;
  description: string;
};

export function RoutePlaceholder({ title, description }: RoutePlaceholderProps) {
  return (
    <section className="card">
      <h1 style={{ marginTop: 0 }}>{title}</h1>
      <p className="muted" style={{ marginBottom: 0 }}>
        {description}
      </p>
    </section>
  );
}