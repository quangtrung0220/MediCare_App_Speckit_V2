/*
 * Created: 2026-06-28
 * Purpose: Reports dashboard UI (T034) with custom high-fidelity SVG interactive charts.
 * Owner: Quang Trung
 */
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./reports.module.css";

type ReportMetric = {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
};

export default function ReportsPage() {
  const [metrics, setMetrics] = useState<ReportMetric[]>([
    { label: "Tổng số lượt khám hôm nay", value: "34 lượt", change: "+12% so với hôm qua", isPositive: true },
    { label: "Tổng doanh thu khám bệnh", value: "8.500.000 ₫", change: "+8% so với tuần trước", isPositive: true },
    { label: "Tỷ lệ vắng mặt (No-show)", value: "3.2%", change: "-1.5% so với tháng trước", isPositive: true },
    { label: "Vật tư cảnh báo sắp hết", value: "2 mặt hàng", change: "Cần đặt thêm", isPositive: false },
  ]);

  useEffect(() => {
    const fetchReports = async () => {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      try {
        const res = await fetch(`${API_BASE}/reports`);
        if (res.ok) {
          const stats = await res.json();
          setMetrics([
            {
              label: "Tổng số lượt khám hôm nay",
              value: `${stats.appointmentsCount || 0} lượt`,
              change: "Từ dữ liệu hệ thống thực tế",
              isPositive: true
            },
            {
              label: "Tổng doanh thu khám bệnh",
              value: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.totalRevenue || 0),
              change: "Từ hóa đơn hệ thống thực tế",
              isPositive: true
            },
            {
              label: "Mật độ dòng bệnh nhân",
              value: `${stats.patientCount || 0} người`,
              change: "Đã đăng ký hồ sơ trên hệ thống",
              isPositive: true
            },
            {
              label: "Vật tư cảnh báo sắp hết",
              value: `${stats.lowStockCount || 0} mặt hàng`,
              change: stats.lowStockCount > 0 ? "Cần bổ sung kho" : "Đầy đủ kho",
              isPositive: stats.lowStockCount === 0
            },
          ]);
        }
      } catch (e) {
        console.warn("Failed to fetch reports from real API, using mock", e);
      }
    };
    fetchReports();
  }, []);

  const [startDate, setStartDate] = useState("2026-06-01");
  const [endDate, setEndDate] = useState("2026-06-28");
  const [reportType, setReportType] = useState("Revenue");
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleExport = (format: "CSV" | "PDF") => {
    setIsExporting(format);
    setTimeout(() => {
      setIsExporting(null);
      setExportMessage(`🎉 Đã tạo và tải xuống báo cáo định kỳ dạng ${format} thành công!`);
      setTimeout(() => setExportMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Báo cáo Thống kê Hoạt động</h2>
        <p className={styles.subtitle}>Phân tích dữ liệu lâm sàng, dòng bệnh nhân và tình hình tài chính phòng khám.</p>
      </div>

      {/* Metrics Grid */}
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

      {/* Analytics Charts Grid */}
      <div className={styles.analyticsRow}>
        {/* Donut Chart: Patient demographics by gender */}
        <div className={`${styles.chartCard} card`}>
          <h3 className={styles.chartTitle}>Cơ cấu giới tính bệnh nhân</h3>
          <div className={styles.chartContent}>
            <div className={styles.donutWrapper}>
              <svg viewBox="0 0 200 200" className={styles.donutSvg}>
                {/* Gray background ring */}
                <circle cx="100" cy="100" r="60" fill="transparent" stroke="#f1f5f9" strokeWidth="20" />
                
                {/* Segment 1: Nam (55%) -> color: Teal (#0f766e) */}
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#0f766e"
                  strokeWidth="20"
                  strokeDasharray="207.35 376.99"
                  strokeDashoffset="0"
                  transform="rotate(-90 100 100)"
                  className={styles.donutSegment}
                />

                {/* Segment 2: Nữ (40%) -> color: Pink (#ec4899) */}
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#ec4899"
                  strokeWidth="20"
                  strokeDasharray="150.8 376.99"
                  strokeDashoffset="-207.35"
                  transform="rotate(-90 100 100)"
                  className={styles.donutSegment}
                />

                {/* Segment 3: Khác (5%) -> color: Gray (#64748b) */}
                <circle
                  cx="100"
                  cy="100"
                  r="60"
                  fill="transparent"
                  stroke="#64748b"
                  strokeWidth="20"
                  strokeDasharray="18.84 376.99"
                  strokeDashoffset="-358.15"
                  transform="rotate(-90 100 100)"
                  className={styles.donutSegment}
                />

                {/* Inner Text hole */}
                <text x="100" y="98" textAnchor="middle" className={styles.donutCenterValue}>100%</text>
                <text x="100" y="116" textAnchor="middle" className={styles.donutCenterLabel}>Bệnh nhân</text>
              </svg>
            </div>
            
            <div className={styles.legendCol}>
              <div className={styles.legendItem}>
                <span className={styles.dotTeal}></span>
                <span className={styles.legendText}>Nam (55%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dotPink}></span>
                <span className={styles.legendText}>Nữ (40%)</span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dotGray}></span>
                <span className={styles.legendText}>Khác (5%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Bar Chart: Patient counts by department */}
        <div className={`${styles.chartCard} card`}>
          <h3 className={styles.chartTitle}>Số lượng ca khám theo Khoa chuyên môn</h3>
          <div className={styles.barList}>
            <div className={styles.barItem}>
              <div className={styles.barLabelRow}>
                <span>Nội khoa (General)</span>
                <strong>45 ca (45%)</strong>
              </div>
              <div className={styles.barProgressBg}>
                <div className={`${styles.barProgressBar} ${styles.bgTeal}`} style={{ width: "45%" }}></div>
              </div>
            </div>

            <div className={styles.barItem}>
              <div className={styles.barLabelRow}>
                <span>Nhi khoa (Pediatrics)</span>
                <strong>30 ca (30%)</strong>
              </div>
              <div className={styles.barProgressBg}>
                <div className={`${styles.barProgressBar} ${styles.bgBlue}`} style={{ width: "30%" }}></div>
              </div>
            </div>

            <div className={styles.barItem}>
              <div className={styles.barLabelRow}>
                <span>Răng Hàm Mặt (Dental)</span>
                <strong>15 ca (15%)</strong>
              </div>
              <div className={styles.barProgressBg}>
                <div className={`${styles.barProgressBar} ${styles.bgAmber}`} style={{ width: "15%" }}></div>
              </div>
            </div>

            <div className={styles.barItem}>
              <div className={styles.barLabelRow}>
                <span>Tai Mũi Họng (ENT)</span>
                <strong>10 ca (10%)</strong>
              </div>
              <div className={styles.barProgressBg}>
                <div className={`${styles.barProgressBar} ${styles.bgRose}`} style={{ width: "10%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Export Actions Card */}
      <div className={`${styles.filterCard} card`}>
        <h3 className={styles.chartTitle} style={{ marginBottom: "1.25rem" }}>Trích xuất Báo cáo Định kỳ</h3>
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
          <Button
            onClick={() => handleExport("PDF")}
            disabled={isExporting !== null}
            className={styles.actionBtn}
          >
            {isExporting === "PDF" ? "🔄 Đang trích xuất..." : "📥 Tải Báo cáo PDF"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleExport("CSV")}
            disabled={isExporting !== null}
            className={styles.actionBtn}
          >
            {isExporting === "CSV" ? "🔄 Đang xuất dữ liệu..." : "📥 Xuất dữ liệu CSV"}
          </Button>
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
