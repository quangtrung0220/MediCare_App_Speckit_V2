/*
 * Created: 2026-06-24
 * Purpose: Clinic-wide prescriptions master list and status management (T042).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

interface PrescriptionItem {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  status: "PENDING" | "DISPENSED" | "HOLD";
  items: string[];
}

const INITIAL_PRESCRIPTIONS: PrescriptionItem[] = [
  {
    id: "RX-501",
    patientName: "Nguyễn Văn A",
    doctorName: "Dr. Nguyễn Minh",
    date: "2026-06-24",
    status: "PENDING",
    items: ["Paracetamol 500mg x 10 viên", "Amoxicillin 500mg x 14 viên"],
  },
  {
    id: "RX-502",
    patientName: "Trần Thị B",
    doctorName: "Dr. Trần Hương",
    date: "2026-06-24",
    status: "DISPENSED",
    items: ["Vitamin C 500mg x 30 viên"],
  },
  {
    id: "RX-503",
    patientName: "Phạm Văn C",
    doctorName: "Dr. Phạm Tuấn",
    date: "2026-06-23",
    status: "HOLD",
    items: ["Ibuprofen 400mg x 20 viên"],
  },
];

export default function PrescriptionsPage() {
  const [prescriptions] = useState<PrescriptionItem[]>(INITIAL_PRESCRIPTIONS);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPrescriptions = prescriptions.filter((rx) =>
    rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rx.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <h1 className={styles.title}>Danh sách đơn thuốc phòng khám (Prescriptions)</h1>

      <div className={styles.card}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tìm kiếm đơn thuốc theo bệnh nhân hoặc mã đơn..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Ngày kê</th>
                <th>Danh mục thuốc</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrescriptions.map((rx) => (
                <tr key={rx.id} data-testid="prescription-row">
                  <td><strong>{rx.id}</strong></td>
                  <td>{rx.patientName}</td>
                  <td>{rx.doctorName}</td>
                  <td>{rx.date}</td>
                  <td>
                    <div style={{ display: "flex", gap: "0.25rem", flexDirection: "column" }}>
                      {rx.items.map((item, index) => (
                        <span key={index} style={{ fontSize: "0.85rem" }}>{item}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getStatusBadgeClass(rx.status)}`}>
                      {rx.status === "DISPENSED" ? "Đã phát" : rx.status === "HOLD" ? "Tạm hoãn" : "Chờ xử lý"}
                    </span>
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
