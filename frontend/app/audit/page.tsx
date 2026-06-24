/*
 * Created: 2026-06-24
 * Purpose: Security auditor logs viewer table (T032).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  ipAddress: string;
  userAgent: string;
}

const MOCK_LOGS: AuditLog[] = [
  { id: "LOG-001", timestamp: "2026-06-24 14:15:32", actor: "minh.nguyen@medicare.com", action: "READ_MEDICAL_RECORD", ipAddress: "192.168.1.15", userAgent: "Chrome/Windows" },
  { id: "LOG-002", timestamp: "2026-06-24 13:45:10", actor: "admin@medicare.com", action: "UPDATE_USER_ROLE", ipAddress: "10.0.2.1", userAgent: "Safari/macOS" },
  { id: "LOG-003", timestamp: "2026-06-24 11:20:05", actor: "huong.tran@medicare.com", action: "WRITE_VITALS", ipAddress: "192.168.1.22", userAgent: "Firefox/Linux" },
  { id: "LOG-004", timestamp: "2026-06-24 09:05:00", actor: "receptionist@medicare.com", action: "CHECKIN_PATIENT", ipAddress: "192.168.1.100", userAgent: "Chrome/Android" },
];

export default function AuditPage() {
  const [logs] = useState<AuditLog[]>(MOCK_LOGS);

  const getActionBadgeClass = (action: string) => {
    if (action.startsWith("READ")) return styles.actionRead;
    if (action.startsWith("UPDATE") || action.startsWith("WRITE")) return styles.actionWrite;
    if (action.startsWith("DELETE")) return styles.actionDelete;
    return "";
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Nhật ký bảo mật & Kiểm toán (Audit Logs)</h1>

      <div className={styles.card}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0, marginBottom: "1.25rem" }}>
          Nhật ký hoạt động hệ thống
        </h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã Log</th>
                <th>Thời gian</th>
                <th>Người thực hiện</th>
                <th>Hành động</th>
                <th>Địa chỉ IP</th>
                <th>Thiết bị/Trình duyệt</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} data-testid="audit-row">
                  <td><strong>{log.id}</strong></td>
                  <td>{log.timestamp}</td>
                  <td>{log.actor}</td>
                  <td>
                    <span className={`${styles.actionBadge} ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td>{log.ipAddress}</td>
                  <td>{log.userAgent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
