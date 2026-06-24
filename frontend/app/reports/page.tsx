/*
 * Created: 2026-06-24
 * Purpose: Reports dashboard UI (T034).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./reports.module.css";

type ReportMetric = {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
};

export default function ReportsPage() {
  const metrics: ReportMetric[] = [
    { label: "Tổng số lượt khám hôm nay", value: "34 lượt", change: "+12% so với hôm qua", isPositive: true },
    { label: "Tổng doanh thu khám bệnh", value: "8.500.000 ₫", change: "+8% so với tuần trước", isPositive: true },
    { label: "Tỷ lệ vắng mặt (No-show)", value: "3.2%", change: "-1.5% so với tháng trước", isPositive: true },
    { label: "Vật tư cảnh báo sắp hết", value: "2 mặt hàng", change: "Cần đặt thêm", isPositive: false },
  ];

  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-24");
  const [reportType, setReportType] = useState("Revenue");
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  const handleExport = (format: "CSV" | "PDF") => {
    setExportMessage(`Đang trích xuất báo cáo dạng ${format}... Đã tải xuống báo cáo dạng ${format} thành công!`);
    setTimeout(() => setExportMessage(null), 5000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Báo cáo Thống kê Hoạt động</h2>

      <div className={styles.metricsGrid}>
        {metrics.map((metric, idx) => (
          <div key={idx} className={`${styles.metricCard} card`}>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValue}>{metric.value}</div>
            <div className={`${styles.metricChange} ${metric.isPositive ? styles.positive : styles.negative}`}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div className={`${styles.filterCard} card`}>
        <h3>Trích xuất Báo cáo Định kỳ</h3>
        <div className={styles.filterRow}>
          <div className={styles.field}>
            <label htmlFor="report-start">Từ ngày:</label>
            <input
              id="report-start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="report-end">Đến ngày:</label>
            <input
              id="report-end"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="report-type">Loại báo cáo:</label>
            <select
              id="report-type"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="Revenue">Doanh thu khám bệnh</option>
              <option value="PatientFlow">Mật độ dòng bệnh nhân</option>
              <option value="InventoryUsage">Báo cáo kho dược</option>
            </select>
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => handleExport("PDF")}>Tải Báo cáo PDF</Button>
          <Button variant="secondary" onClick={() => handleExport("CSV")}>Tải dữ liệu CSV</Button>
        </div>

        {exportMessage && (
          <div className={styles.notification}>
            <p>{exportMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
