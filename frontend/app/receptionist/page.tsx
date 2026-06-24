/*
 * Created: 2026-06-24
 * Purpose: Receptionist scheduling and check-in workspace dashboard (T028).
 * Owner: Quang Trung
 */
"use client";

import React, { useState, useEffect } from "react";
import { CheckInCard } from "@/components/receptionist/CheckInCard";
import {
  fetchReceptionistAppointments,
  checkInPatient,
  type ReceptionistAppointment,
} from "@/services/receptionist.service";
import styles from "./page.module.css";

export default function ReceptionistPage() {
  const [appointments, setAppointments] = useState<ReceptionistAppointment[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await fetchReceptionistAppointments();
      setAppointments(data);
    }
    loadData();
  }, []);

  const handleCheckIn = async (id: string) => {
    setLoadingId(id);
    const success = await checkInPatient(id);
    setLoadingId(null);
    if (success) {
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === id ? { ...apt, status: "CHECKED_IN" } : apt))
      );
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý lịch hẹn & Đón tiếp (Receptionist)</h1>
      
      <div className={styles.card}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0, marginBottom: "1rem" }}>
          Hàng đợi check-in hôm nay
        </h2>
        <div className={styles.list}>
          {appointments.map((apt) => (
            <CheckInCard
              key={apt.id}
              appointment={apt}
              onCheckIn={handleCheckIn}
              isLoading={loadingId === apt.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
