/*
 * Created: 2026-06-24
 * Purpose: Clinic-wide appointments master list and filtering (T040).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

interface AppointmentItem {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  { id: "APT-0001", patientName: "Nguyễn Văn A", doctorName: "Dr. Nguyễn Minh", date: "2026-06-25", time: "08:00", status: "SCHEDULED" },
  { id: "APT-0002", patientName: "Trần Thị B", doctorName: "Dr. Trần Hương", date: "2026-06-24", time: "14:30", status: "COMPLETED" },
  { id: "APT-0003", patientName: "Phạm Văn C", doctorName: "Dr. Phạm Tuấn", date: "2026-06-27", time: "10:00", status: "SCHEDULED" },
  { id: "APT-0004", patientName: "Hoàng Thị D", doctorName: "Dr. Lê Lan", date: "2026-06-22", time: "09:00", status: "CANCELLED" },
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleCancel = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status: "CANCELLED" } : apt))
    );
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return styles.statusCompleted;
      case "CANCELLED":
        return styles.statusCancelled;
      default:
        return styles.statusScheduled;
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách lịch hẹn phòng khám (Appointments)</h1>

      <div className={styles.card}>
        <div className={styles.filterRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tìm theo bệnh nhân, bác sĩ hoặc mã hẹn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select
            className={styles.select}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="SCHEDULED">Đã hẹn (Scheduled)</option>
            <option value="COMPLETED">Đã khám (Completed)</option>
            <option value="CANCELLED">Đã hủy (Cancelled)</option>
          </select>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã lịch</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Ngày khám</th>
                <th>Giờ khám</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} data-testid="appointment-row">
                  <td><strong>{apt.id}</strong></td>
                  <td>{apt.patientName}</td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(apt.status)}`}>
                      {apt.status === "SCHEDULED" ? "Đã hẹn" : apt.status === "COMPLETED" ? "Đã khám" : "Đã hủy"}
                    </span>
                  </td>
                  <td>
                    {apt.status === "SCHEDULED" ? (
                      <Button variant="secondary" onClick={() => handleCancel(apt.id)}>
                        Hủy hẹn
                      </Button>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>Không có</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
