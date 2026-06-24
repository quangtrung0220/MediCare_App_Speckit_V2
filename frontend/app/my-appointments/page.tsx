/*
 * Created: 2026-06-24
 * Purpose: Patient appointments list dashboard (T014).
 * Owner: Quang Trung
 */
"use client";

import React from "react";
import { useAppointments } from "@/hooks/useAppointments";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

export default function MyAppointmentsPage() {
  const { appointments, isLoading, error, refresh } = useAppointments();

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

  const getReminderBadgeClass = (reminder: string) => {
    switch (reminder) {
      case "SENT":
        return styles.reminderSent;
      default:
        return styles.reminderPending;
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Lịch hẹn của tôi</h1>

      {error && (
        <div className="card" style={{ borderLeft: "4px solid #ef4444", marginBottom: "1.5rem" }}>
          <p style={{ color: "#ef4444", margin: 0 }}>Lỗi: {error}</p>
          <Button variant="secondary" className={styles.refreshBtn} onClick={refresh}>Thử lại</Button>
        </div>
      )}

      {isLoading ? (
        <LoadingState label="Đang tải danh sách lịch hẹn..." />
      ) : appointments.length === 0 ? (
        <EmptyState
          title="Không có lịch hẹn"
          description="Bạn chưa đặt lịch hẹn nào. Hãy click vào mục 'Đặt lịch khám' để đăng ký lịch khám mới."
        />
      ) : (
        <div className={styles.card}>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Mã lịch</th>
                  <th>Bác sĩ</th>
                  <th>Ngày khám</th>
                  <th>Giờ khám</th>
                  <th>Chi phí</th>
                  <th>Trạng thái</th>
                  <th>Nhắc nhở</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt) => (
                  <tr key={apt.id}>
                    <td><strong>{apt.id}</strong></td>
                    <td>{apt.doctorName}</td>
                    <td>{apt.date}</td>
                    <td>{apt.time}</td>
                    <td>{formatCurrency(apt.fee)}</td>
                    <td>
                      <span className={`${styles.badge} ${getStatusBadgeClass(apt.status)}`}>
                        {apt.status === "SCHEDULED" ? "Đã hẹn" : apt.status === "COMPLETED" ? "Đã khám" : "Đã hủy"}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getReminderBadgeClass(apt.reminderStatus)}`}>
                        {apt.reminderStatus === "SENT" ? "Đã gửi" : "Chờ gửi"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
