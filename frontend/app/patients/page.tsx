/*
 * Created: 2026-04-11
 * Updated: 2026-05-03
 * Purpose: Patient list page displaying loading, error, empty, and list states.
 * Owner: Quang Trung
 */
"use client";

import { usePatients } from "@/hooks/usePatients";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import PatientListRow from "@/components/patient/PatientListRow";
import PATIENTS_PAGE from "@/constants/patients";
import styles from "./page.module.css";

export default function PatientsPage() {
  const { patients, isLoading, error, total } = usePatients();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {PATIENTS_PAGE.TITLE}
        </h1>
        <p className={styles.subtitle}>
          {total > 0 ? PATIENTS_PAGE.TOTAL(total) : PATIENTS_PAGE.NO_PATIENTS}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingState label={PATIENTS_PAGE.LOADING} />}

      {/* Error State */}
      {error && !isLoading && (
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>Lỗi tải dữ liệu</p>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && patients.length === 0 && (
        <EmptyState title={PATIENTS_PAGE.EMPTY_TITLE} description={PATIENTS_PAGE.EMPTY_DESC} />
      )}

      {/* Patient List */}
      {!isLoading && !error && patients.length > 0 && (
        <div className={styles.patientList}>
          {patients.map((patient) => (
            <PatientListRow key={patient.id} patient={patient} />
          ))}
        </div>
      )}
    </div>
  );
}
// PatientListItem extracted to `PatientListRow` component for reuse.
