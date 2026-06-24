/*
 * Created: 2026-06-24
 * Purpose: Clinic workspace hub and summary dashboard landing (T044).
 * Owner: Quang Trung
 */
"use client";

import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  const metrics = [
    { label: "Lịch hẹn hôm nay", value: "12 ca", icon: "📅", iconClass: styles.iconTeal },
    { label: "Bác sĩ làm việc", value: "3 người", icon: "🩺", iconClass: styles.iconBlue },
    { label: "Đợi đo sinh hiệu", value: "2 ca", icon: "⏳", iconClass: styles.iconAmber },
    { label: "Đơn thuốc chờ cấp", value: "1 đơn", icon: "💊", iconClass: styles.iconRose },
  ];

  const waitingQueue = [
    { id: "PAT-001", name: "Nguyễn Văn An", time: "08:00", doctor: "Dr. Nguyễn Minh", status: "Đợi đo sinh hiệu" },
    { id: "PAT-003", name: "Phạm Cường", time: "11:00", doctor: "Dr. Phạm Tuấn", status: "Chờ khám" },
  ];

  const recentLogs = [
    { id: "LOG-001", time: "14:15", user: "minh.nguyen@medicare.com", action: "Đọc hồ sơ bệnh án", detail: "Xem bệnh án mã REC-201" },
    { id: "LOG-002", time: "11:20", user: "huong.tran@medicare.com", action: "Đo sinh hiệu thành công", detail: "Bệnh nhân Nguyễn Văn An" },
    { id: "LOG-003", time: "09:05", user: "receptionist@medicare.com", action: "Check-in bệnh nhân", detail: "Check-in mã hẹn APT-1001" },
  ];

  return (
    <div className={styles.container}>
      {/* Welcome Hero Banner */}
      <div className={styles.welcomeBanner}>
        <h1 className={styles.welcomeTitle}>Chào mừng quay trở lại, Bác sĩ! 🏥</h1>
        <p className={styles.welcomeSubtitle}>
          Hệ thống quản lý phòng khám MediCare đã sẵn sàng. Bạn có 12 ca hẹn đang xếp lịch khám trong ngày hôm nay.
        </p>
      </div>

      {/* Metrics Row */}
      <div className={styles.metricsGrid}>
        {metrics.map((m, idx) => (
          <div key={idx} className={styles.metricCard} data-testid="overview-metric">
            <div>
              <div className={styles.metricLabel}>{m.label}</div>
              <div className={styles.metricValue}>{m.value}</div>
            </div>
            <div className={`${styles.metricIcon} ${m.iconClass}`}>
              {m.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className={styles.mainGrid}>
        {/* Left column: Quick navigations and Queue list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Quick Nav Workspaces */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Bàn làm việc phân hệ nhanh</h2>
            <div className={styles.workspaceLinkGrid}>
              <Link href="/doctor" className={styles.workspaceCard}>
                <span className={styles.workspaceEmoji}>🩺</span>
                <span className={styles.workspaceName}>Bác sĩ</span>
                <span className={styles.workspaceDesc}>Chẩn đoán lâm sàng & Kê đơn thuốc</span>
              </Link>
              
              <Link href="/nurse" className={styles.workspaceCard}>
                <span className={styles.workspaceEmoji}>📋</span>
                <span className={styles.workspaceName}>Điều dưỡng</span>
                <span className={styles.workspaceDesc}>Tiếp nhận & Đo chỉ số sinh hiệu</span>
              </Link>
              
              <Link href="/receptionist" className={styles.workspaceCard}>
                <span className={styles.workspaceEmoji}>📅</span>
                <span className={styles.workspaceName}>Lễ tân</span>
                <span className={styles.workspaceDesc}>Đặt lịch khám & Xử lý Check-in</span>
              </Link>
            </div>
          </div>

          {/* Today's Queue list */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Hàng đợi bệnh nhân hôm nay</h2>
            <div className={styles.queueList}>
              {waitingQueue.map((p) => (
                <div key={p.id} className={styles.queueItem} data-testid="overview-apt">
                  <div className={styles.patientMeta}>
                    <span className={styles.patientName}>{p.name}</span>
                    <span className={styles.patientTime}>
                      {p.doctor} | Ca khám lúc <strong>{p.time}</strong>
                    </span>
                  </div>
                  <span className={styles.statusIndicator}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column: Audit Event Timeline */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Nhật ký hoạt động mới nhất</h2>
          <div className={styles.timeline}>
            {recentLogs.map((log) => (
              <div key={log.id} className={styles.timelineItem} data-testid="overview-log">
                <div className={styles.timelineDot} />
                <div className={styles.timelineContent}>
                  <div className={styles.timelineHeader}>
                    <span className={styles.timelineTitle}>{log.action}</span>
                    <span className={styles.timelineTime}>{log.time}</span>
                  </div>
                  <span className={styles.timelineDesc}>{log.detail}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--brand)", marginTop: "0.15rem" }}>
                    {log.user}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
