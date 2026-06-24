/*
 * Created: 2026-06-24
 * Purpose: Check-in desk card component for Receptionist page (T026).
 * Owner: Quang Trung
 */
"use client";

import React from "react";
import type { ReceptionistAppointment } from "@/services/receptionist.service";
import { Button } from "@/components/ui/Button";
import styles from "./CheckInCard.module.css";

interface CheckInCardProps {
  appointment: ReceptionistAppointment;
  onCheckIn: (id: string) => void;
  isLoading?: boolean;
}

export function CheckInCard({ appointment, onCheckIn, isLoading }: CheckInCardProps) {
  const isScheduled = appointment.status === "SCHEDULED";

  return (
    <div className={styles.card} data-testid="checkin-card">
      <div className={styles.info}>
        <span className={styles.patientName}>{appointment.patientName}</span>
        <span className={styles.details}>
          Bác sĩ: {appointment.doctorName} | Giờ: {appointment.time}
        </span>
        <span className={`${styles.badge} ${isScheduled ? styles.statusScheduled : styles.statusCheckedIn}`}>
          {isScheduled ? "Chờ check-in" : "Đã vào khám"}
        </span>
      </div>

      {isScheduled && (
        <Button
          onClick={() => onCheckIn(appointment.id)}
          disabled={isLoading}
        >
          {isLoading ? "Đang xử lý..." : "Check-in"}
        </Button>
      )}
    </div>
  );
}
