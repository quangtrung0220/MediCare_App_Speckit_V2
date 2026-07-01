/*
 * Created: 2026-05-03
 * Updated: 2026-07-01 — Added privacy drawer trigger button.
 * Purpose: Patient list row component (reusable across patient lists).
 * Owner: Quang Trung
 */
'use client';

import { useState } from 'react';
import { ListRow } from '@/components/ui/ListRow';
import type { PatientRecord } from '@/services/patient.mock';
import PatientPrivacyDrawer from './PatientPrivacyDrawer';
import styles from './PatientListRow.module.css';

type Props = {
  patient: PatientRecord;
  onClick?: (id: string) => void;
  /** Optional real backend UUID for Privacy actions (export/purge). */
  backendId?: string;
};

export function PatientListRow({ patient, onClick, backendId }: Props) {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
      <div className={styles.rowWrapper}>
        <div className={styles.rowContent}>
          <ListRow
            title={patient.name}
            description={`${patient.phone} • ${patient.email}`}
            meta={patient.lastVisit ? `Lần khám cuối: ${patient.lastVisit}` : 'Chưa khám'}
            onClick={onClick ? () => onClick(patient.id) : undefined}
          />
        </div>
        {backendId && (
          <button
            className={styles.privacyBtn}
            onClick={(e) => {
              e.stopPropagation();
              setPrivacyOpen(true);
            }}
            title="Quyền riêng tư dữ liệu"
            aria-label={`Quyền riêng tư - ${patient.name}`}
          >
            🔒
          </button>
        )}
      </div>

      {backendId && (
        <PatientPrivacyDrawer
          isOpen={privacyOpen}
          patientId={backendId}
          patientName={patient.name}
          onClose={() => setPrivacyOpen(false)}
        />
      )}
    </>
  );
}

export default PatientListRow;
