/*
 * Created: 2026-06-28
 * Purpose: Clinic workspace hub and summary dashboard landing (T044) with high-fidelity native SVG charts.
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"PATIENTS" | "REVENUE">("PATIENTS");

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

  // 7-day data trends
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ Bảy", "Chủ Nhật"];
  const patientData = [8, 12, 10, 15, 18, 14, 12];
  const revenueData = [4.5, 6.0, 5.0, 7.5, 9.0, 7.0, 8.5]; // unit: million VND

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
        {/* Left column: Quick navigations, Analytics charts and Queue list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Quick Nav Workspaces */}
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Bàn làm việc phân hệ nhanh</h2>
            <div className={styles.workspaceLinkGrid}>
              <Link href="/doctor" className={styles.workspaceCard}>
                <span className={styles.workspaceEmoji}>👨‍⚕️</span>
                <span className={styles.workspaceName}>Bác sĩ</span>
                <span className={styles.workspaceDesc}>Chẩn đoán lâm sàng & Kê đơn thuốc</span>
              </Link>
              
              <Link href="/nurse" className={styles.workspaceCard}>
                <span className={styles.workspaceEmoji}>🩺</span>
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

          {/* Interactive SVG Charts section */}
          <div className={styles.card}>
            <div className={styles.chartHeader}>
              <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Biểu đồ phân tích hiệu suất tuần</h2>
              <div className={styles.chartToggle}>
                <button
                  className={`${styles.toggleBtn} ${activeTab === "PATIENTS" ? styles.activeToggle : ""}`}
                  onClick={() => setActiveTab("PATIENTS")}
                >
                  Lượt khám
                </button>
                <button
                  className={`${styles.toggleBtn} ${activeTab === "REVENUE" ? styles.activeToggle : ""}`}
                  onClick={() => setActiveTab("REVENUE")}
                >
                  Doanh thu
                </button>
              </div>
            </div>

            {activeTab === "PATIENTS" ? (
              <div>
                <div className={styles.chartLegend}>
                  <span className={styles.legendDotBlue}></span> Số lượt bệnh nhân đến khám (ca)
                </div>
                <div className={styles.svgWrapper}>
                  <svg viewBox="0 0 500 200" className={styles.svgChart}>
                    {/* Gridlines */}
                    <line x1="30" y1="30" x2="470" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="75" x2="470" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="120" x2="470" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="165" x2="470" y2="165" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Left Y Axis Labels */}
                    <text x="10" y="34" className={styles.chartText}>20</text>
                    <text x="10" y="79" className={styles.chartText}>15</text>
                    <text x="10" y="124" className={styles.chartText}>10</text>
                    <text x="15" y="169" className={styles.chartText}>0</text>

                    {/* Gradient fill */}
                    <defs>
                      <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Line Area */}
                    <path
                      d="M 40,165 L 40,111 L 110,84 L 180,98 L 250,64 L 320,43 L 390,71 L 460,84 L 460,165 Z"
                      fill="url(#blueGrad)"
                    />

                    {/* Chart Line path */}
                    <path
                      d="M 40,111 L 110,84 L 180,98 L 250,64 L 320,43 L 390,71 L 460,84"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Chart Dots & Tooltips */}
                    {patientData.map((val, idx) => {
                      const x = 40 + idx * 70;
                      const y = 165 - (val / 20) * 135;
                      return (
                        <g key={idx} className={styles.chartPointGroup}>
                          <circle cx={x} cy={y} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" className={styles.chartCircle} />
                          <circle cx={x} cy={y} r="10" fill="transparent" className={styles.chartHoverCircle} />
                          <g className={styles.chartTooltip}>
                            <rect x={x - 18} y={y - 28} width="36" height="20" rx="4" fill="#1e293b" />
                            <text x={x} y={y - 14} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">{val}</text>
                          </g>
                        </g>
                      );
                    })}

                    {/* X Axis labels */}
                    {days.map((day, idx) => (
                      <text key={idx} x={40 + idx * 70} y="188" textAnchor="middle" className={styles.chartText}>
                        {day}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            ) : (
              <div>
                <div className={styles.chartLegend}>
                  <span className={styles.legendDotTeal}></span> Doanh thu phòng khám hàng ngày (triệu ₫)
                </div>
                <div className={styles.svgWrapper}>
                  <svg viewBox="0 0 500 200" className={styles.svgChart}>
                    {/* Gridlines */}
                    <line x1="30" y1="30" x2="470" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="75" x2="470" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="120" x2="470" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                    <line x1="30" y1="165" x2="470" y2="165" stroke="#e2e8f0" strokeWidth="1.5" />

                    {/* Left Y Axis Labels */}
                    <text x="10" y="34" className={styles.chartText}>10M</text>
                    <text x="10" y="79" className={styles.chartText}>7.5M</text>
                    <text x="10" y="124" className={styles.chartText}>5M</text>
                    <text x="15" y="169" className={styles.chartText}>0</text>

                    {/* Bars */}
                    {revenueData.map((val, idx) => {
                      const barWidth = 32;
                      const x = 40 + idx * 70 - barWidth / 2;
                      const barHeight = (val / 10) * 135;
                      const y = 165 - barHeight;
                      
                      return (
                        <g key={idx} className={styles.chartPointGroup}>
                          <rect
                            x={x}
                            y={y}
                            width={barWidth}
                            height={barHeight}
                            rx="4"
                            fill="#0f766e"
                            className={styles.chartBar}
                          />
                          <g className={styles.chartTooltip}>
                            <rect x={x - 12} y={y - 28} width="56" height="20" rx="4" fill="#1e293b" />
                            <text x={x + barWidth / 2} y={y - 14} textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                              {val}M
                            </text>
                          </g>
                        </g>
                      );
                    })}

                    {/* X Axis labels */}
                    {days.map((day, idx) => (
                      <text key={idx} x={40 + idx * 70} y="188" textAnchor="middle" className={styles.chartText}>
                        {day}
                      </text>
                    ))}
                  </svg>
                </div>
              </div>
            )}
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
