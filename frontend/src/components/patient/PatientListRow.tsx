/*
 * Created: 2026-05-03
 * Updated: 2026-05-03
 * Purpose: Patient list row component (reusable across patient lists).
 * Owner: Quang Trung
 */
import { ListRow } from "@/components/ui/ListRow";
import type { PatientRecord } from "@/services/patient.mock";

type Props = {
  patient: PatientRecord;
  onClick?: (id: string) => void;
};

export function PatientListRow({ patient, onClick }: Props) {
  return (
    <ListRow
      title={patient.name}
      description={`${patient.phone} • ${patient.email}`}
      meta={patient.lastVisit ? `Lần khám cuối: ${patient.lastVisit}` : "Chưa khám"}
      onClick={onClick ? () => onClick(patient.id) : undefined}
    />
  );
}

export default PatientListRow;
