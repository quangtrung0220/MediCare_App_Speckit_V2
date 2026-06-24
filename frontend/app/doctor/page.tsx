/*
 * Created: 2026-06-24
 * Purpose: Doctor queue dashboard to search patients and start ca khám (T022).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

interface QueuePatient {
  id: string;
  name: string;
  phone: string;
  vitalsChecked: boolean;
  status: "WAITING" | "COMPLETED";
}

const INITIAL_QUEUE: QueuePatient[] = [
  { id: "PAT-001", name: "Nguyễn Văn A", phone: "+84901234567", vitalsChecked: true, status: "WAITING" },
  { id: "PAT-002", name: "Trần Thị B", phone: "+84912345678", vitalsChecked: true, status: "COMPLETED" },
  { id: "PAT-003", name: "Phạm Văn C", phone: "+84923456789", vitalsChecked: false, status: "WAITING" },
];

export default function DoctorPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [queue] = useState<QueuePatient[]>(INITIAL_QUEUE);

  const filteredQueue = queue.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Danh sách khám bệnh (Doctor Queue)</h1>

      <div className={styles.card}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tìm kiếm bệnh nhân theo tên hoặc mã..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.list}>
          {filteredQueue.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--muted-foreground)" }}>
              Không tìm thấy bệnh nhân nào trong hàng đợi.
            </div>
          ) : (
            filteredQueue.map((p) => (
              <div key={p.id} className={styles.row}>
                <div>
                  <div className={styles.patientName}>{p.name}</div>
                  <div className={styles.patientMeta}>
                    Mã BN: {p.id} | SĐT: {p.phone}
                  </div>
                </div>

                <div className={styles.indicators}>
                  <span className={`${styles.indicator} ${p.vitalsChecked ? "" : styles.indicatorWarning}`}>
                    {p.vitalsChecked ? "✓ Đã đo sinh hiệu" : "⏳ Chưa đo sinh hiệu"}
                  </span>
                  
                  {p.status === "COMPLETED" ? (
                    <span style={{ fontSize: "0.9rem", color: "#059669", fontWeight: 500, marginLeft: "1rem" }}>
                      ✓ Đã hoàn tất
                    </span>
                  ) : (
                    <Link
                      href={`/doctor/encounter/${p.id}`}
                      className="link-button"
                      style={{
                        padding: "0.5rem 1rem",
                        background: "#3b82f6",
                        color: "#ffffff",
                        borderRadius: "6px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        marginLeft: "1rem",
                        textDecoration: "none"
                      }}
                    >
                      Bắt đầu khám
                    </Link>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
