/*
 * Created: 2026-06-24
 * Purpose: Nurse workspace intake queue dashboard (T021).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import { IntakeForm } from "@/components/nurse/IntakeForm";
import styles from "./page.module.css";

interface QueuePatient {
  id: string;
  name: string;
  phone: string;
  status: "WAITING_VITALS" | "VITALS_COMPLETED";
}

const MOCK_QUEUE: QueuePatient[] = [
  { id: "PAT-001", name: "Nguyễn Văn A", phone: "+84901234567", status: "WAITING_VITALS" },
  { id: "PAT-002", name: "Trần Thị B", phone: "+84912345678", status: "VITALS_COMPLETED" },
  { id: "PAT-003", name: "Phạm Văn C", phone: "+84923456789", status: "WAITING_VITALS" },
];

export default function NursePage() {
  const [queue, setQueue] = useState<QueuePatient[]>(MOCK_QUEUE);
  const [selectedPatient, setSelectedPatient] = useState<QueuePatient | null>(null);

  const handleIntakeSuccess = () => {
    if (selectedPatient) {
      setQueue((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? { ...p, status: "VITALS_COMPLETED" } : p))
      );
      // Wait a moment and close selection
      setTimeout(() => setSelectedPatient(null), 1000);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Bàn đón tiếp & Đo sinh hiệu (Nurse)</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Hàng đợi đo sinh hiệu</h2>
          <div className={styles.queueList}>
            {queue.map((p) => (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                className={`${styles.queueItem} ${selectedPatient?.id === p.id ? styles.queueItemSelected : ""}`}
                onClick={() => setSelectedPatient(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPatient(p);
                  }
                }}
              >
                <div>
                  <div className={styles.patientName}>{p.name}</div>
                  <div className={styles.patientInfo}>
                    Mã BN: {p.id} | SĐT: {p.phone}
                  </div>
                </div>
                <div>
                  <span className={`${styles.statusBadge} ${p.status === "VITALS_COMPLETED" ? styles.statusBadgeCompleted : ""}`}>
                    {p.status === "VITALS_COMPLETED" ? "Đã đo sinh hiệu" : "Chờ sinh hiệu"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedPatient ? (
            <IntakeForm
              patientId={selectedPatient.id}
              patientName={selectedPatient.name}
              onSuccess={handleIntakeSuccess}
              onCancel={() => setSelectedPatient(null)}
            />
          ) : (
            <div className={styles.card}>
              <div className={styles.empty}>
                Vui lòng chọn một bệnh nhân từ danh sách bên trái để nhập thông số sinh tồn.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
