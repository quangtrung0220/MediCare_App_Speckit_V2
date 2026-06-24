/*
 * Created: 2026-06-24
 * Purpose: Pharmacist prescription dispensing queue dashboard (T029).
 * Owner: Quang Trung
 */
"use client";

import React, { useState, useEffect } from "react";
import {
  fetchPendingPrescriptions,
  dispensePrescription,
  type PharmacistPrescription,
} from "@/services/pharmacist.service";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function PharmacistPage() {
  const [prescriptions, setPrescriptions] = useState<PharmacistPrescription[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchPendingPrescriptions();
      setPrescriptions(data);
    }
    loadData();
  }, []);

  const handleDispense = async (id: string) => {
    setLoadingId(id);
    const success = await dispensePrescription(id);
    setLoadingId(null);
    if (success) {
      setPrescriptions((prev) =>
        prev.map((rx) => (rx.id === id ? { ...rx, status: "DISPENSED" } : rx))
      );
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "DISPENSED":
        return styles.statusDispensed;
      case "HOLD":
        return styles.statusHold;
      default:
        return styles.statusPending;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quầy cấp phát thuốc (Pharmacist Queue)</h1>

      <div className={styles.card}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0, marginBottom: "1.25rem" }}>
          Đơn thuốc chờ xử lý
        </h2>
        
        <div className={styles.list}>
          {prescriptions.map((rx) => (
            <div key={rx.id} className={styles.rxItem} data-testid="prescription-row">
              <div className={styles.rxInfo}>
                <div className={styles.rxHeader}>
                  <span className={styles.rxId}>{rx.id}</span>
                  <span className={styles.rxPatient}>{rx.patientName}</span>
                  <span className={`${styles.badge} ${getStatusBadgeClass(rx.status)}`}>
                    {rx.status === "DISPENSED" ? "Đã phát" : rx.status === "HOLD" ? "Tạm hoãn" : "Chờ xử lý"}
                  </span>
                </div>
                <div className={styles.rxDetails}>
                  Bác sĩ kê: {rx.doctorName} | Ngày: {rx.date}
                </div>
                <div className={styles.rxMedList}>
                  {rx.items.map((med, index) => (
                    <span key={index} className={styles.rxMedBadge}>{med}</span>
                  ))}
                </div>
              </div>

              {rx.status === "PENDING" && (
                <Button
                  onClick={() => handleDispense(rx.id)}
                  disabled={loadingId === rx.id}
                >
                  {loadingId === rx.id ? "Đang xử lý..." : "Cấp phát"}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
