/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Shared loading-state display component.
 * Owner: Quang Trung
 */
type LoadingStateProps = {
  label?: string;
};

export function LoadingState({ label = "Loading..." }: LoadingStateProps) {
  return (
    <div className="card" aria-busy="true">
      <p style={{ margin: 0, fontWeight: 600 }}>{label}</p>
    </div>
  );
}
