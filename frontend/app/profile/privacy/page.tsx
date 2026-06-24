/*
 * Created: 2026-06-24
 * Purpose: Data privacy and settings page (T035).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./privacy.module.css";

type PrivacyLog = {
  action: string;
  timestamp: string;
  status: string;
};

export default function PrivacyPage() {
  const [logs, setLogs] = useState<PrivacyLog[]>([
    { action: "Xuất dữ liệu hồ sơ cá nhân", timestamp: "2026-04-20 14:32", status: "Hoàn tất" },
  ]);
  const [message, setMessage] = useState<string | null>(null);

  const handleExport = () => {
    setMessage("Đang chuẩn bị gói dữ liệu xuất... Gói tải xuống đã sẵn sàng!");
    // Simulate logging
    setLogs((prev) => [
      { action: "Yêu cầu tải dữ liệu (GDPR Art. 20)", timestamp: new Date().toLocaleString(), status: "Hoàn tất" },
      ...prev,
    ]);

    // Download mock JSON patient data
    const mockData = {
      patientId: "PAT-001",
      name: "Nguyễn Văn An",
      dob: "1990-05-15",
      phone: "+84901111111",
      bloodType: "A+",
      allergies: ["Penicillin"],
      encounters: [
        { date: "2026-04-28", symptoms: "Sốt nhẹ, ho khan", diagnosis: "Cảm cúm thông thường" }
      ]
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(mockData, null, 2))}`;
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", jsonString);
    downloadAnchor.setAttribute("download", "medicare_patient_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDeleteRequest = () => {
    setMessage("Yêu cầu xóa tài khoản đã được tiếp nhận. Ban quản trị phòng khám sẽ duyệt trong vòng 24 giờ. Bản sao hồ sơ lâm sàng sẽ được lưu trữ ẩn danh để đảm bảo tính pháp lý.");
    setLogs((prev) => [
      { action: "Yêu cầu xóa tài khoản (Quyền được quên - GDPR Art. 17)", timestamp: new Date().toLocaleString(), status: "Đang chờ duyệt" },
      ...prev,
    ]);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Quyền riêng tư & Bảo vệ dữ liệu cá nhân</h2>
      
      <div className="card">
        <h3>Quản lý dữ liệu (GDPR Compliance)</h3>
        <p className="muted">
          Theo quy định về quyền bảo mật dữ liệu, bạn có quyền xuất dữ liệu hồ sơ bệnh án hoặc yêu cầu khóa/xóa tài khoản của mình khỏi hệ thống phòng khám.
        </p>

        <div className={styles.section}>
          <h4>1. Xuất dữ liệu cá nhân (Data Portability)</h4>
          <p className="muted">Tải xuống toàn bộ hồ sơ bệnh lý, lịch sử khám bệnh và thông tin cá nhân dưới dạng tệp tin máy tính đọc được (JSON).</p>
          <Button onClick={handleExport}>Xuất & Tải xuống (.JSON)</Button>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.section}>
          <h4>2. Yêu cầu xóa hồ sơ (Right to be Forgotten)</h4>
          <p className="muted">
            Yêu cầu xóa vĩnh viễn tài khoản. Thông tin hành chính sẽ bị ẩn đi, trong khi bệnh án y khoa gốc sẽ được lưu trữ dưới dạng ẩn danh (De-identified) theo yêu cầu lưu trữ hồ sơ bệnh án pháp luật quy định.
          </p>
          <Button variant="ghost" className={styles.deleteBtn} onClick={handleDeleteRequest}>
            Gửi yêu cầu xóa tài khoản
          </Button>
        </div>

        {message && (
          <div className={styles.notification}>
            <p>{message}</p>
          </div>
        )}
      </div>

      <div className={`${styles.logsTable} card`}>
        <h3>Nhật ký yêu cầu quyền dữ liệu</h3>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Hành động yêu cầu</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.action}</td>
                <td>{log.timestamp}</td>
                <td>
                  <span className={log.status === "Hoàn tất" ? styles.statusSuccess : styles.statusPending}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
