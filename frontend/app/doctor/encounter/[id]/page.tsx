/*
 * Created: 2026-06-24
 * Purpose: Doctor split-panel clinical encounter workspace (T022).
 * Owner: Quang Trung
 */
"use client";

import React, { useState, useEffect, use } from "react";
import { useClinicalStore } from "@/stores/clinicalStore";
import { PrescriptionBuilder } from "@/components/doctor/PrescriptionBuilder";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import styles from "./page.module.css";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function DoctorEncounterPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const store = useClinicalStore();
  const [activeTab, setActiveTab] = useState<"clinical" | "prescribe" | "billing">("clinical");

  useEffect(() => {
    // Map parameter id to mock demographics
    const patients = [
      { id: "PAT-001", name: "Nguyễn Văn A", gender: "Nam", dateOfBirth: "1980-03-15", phone: "+84901234567", allergies: "Paracetamol, Hải sản" },
      { id: "PAT-002", name: "Trần Thị B", gender: "Nữ", dateOfBirth: "1992-07-22", phone: "+84912345678", allergies: "Không có" },
      { id: "PAT-003", name: "Phạm Văn C", gender: "Nam", dateOfBirth: "1975-11-08", phone: "+84923456789", allergies: "Penicillin" },
    ];
    const match = patients.find((p) => p.id === id) || patients[0];
    store.selectPatient(match);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!store.activePatient) {
    return <div className={styles.container}>Đang tải hồ sơ bệnh nhân...</div>;
  }

  const patient = store.activePatient;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Ca khám lâm nghiệp (Encounter Workspace)</h1>
        <Link href="/doctor" className="link-button">
          ← Quay lại danh sách
        </Link>
      </div>

      <div className={styles.workspaceGrid}>
        {/* Left Panel: Demographics & Clinical History */}
        <div>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Thông tin bệnh nhân</h2>
            <div className={styles.detailRow}>
              <span className={styles.label}>Họ tên:</span>
              <span className={styles.value} data-testid="patient-name">{patient.name}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Mã hồ sơ:</span>
              <span className={styles.value}>{patient.id}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Giới tính:</span>
              <span className={styles.value}>{patient.gender}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Ngày sinh:</span>
              <span className={styles.value}>{patient.dateOfBirth}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Số điện thoại:</span>
              <span className={styles.value}>{patient.phone}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.label}>Dị ứng:</span>
              <span className={styles.value} style={{ color: "#ef4444" }}>{patient.allergies}</span>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Lịch sử khám bệnh</h2>
            {store.history.length === 0 ? (
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem" }}>Chưa ghi nhận ca khám cũ.</p>
            ) : (
              store.history.map((h) => (
                <div key={h.id} className={styles.historyItem}>
                  <div className={styles.historyMeta}>
                    <span>{h.date}</span>
                    <span>{h.doctorName}</span>
                  </div>
                  <div className={styles.historyDiagnosis}>{h.diagnosis}</div>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "#4b5563" }}>
                    {h.notes}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Interactive Editor Tabs */}
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "clinical" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("clinical")}
            >
              Triệu chứng & Chẩn đoán
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "prescribe" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("prescribe")}
            >
              Kê đơn thuốc
            </button>
            <button
              type="button"
              className={`${styles.tab} ${activeTab === "billing" ? styles.tabActive : ""}`}
              onClick={() => setActiveTab("billing")}
            >
              Thanh toán & Hoàn tất
            </button>
          </div>

          {activeTab === "clinical" && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>Ghi chép lâm sàng</h3>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                  Triệu chứng / Lý do khám:
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Ghi nhận triệu chứng, tiền sử cơ năng..."
                  value={store.symptoms}
                  onChange={(e) => store.updateSymptoms(e.target.value)}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500 }}>
                  Chẩn đoán xác định:
                </label>
                <textarea
                  className={styles.textarea}
                  placeholder="Nhập chẩn đoán lâm sàng..."
                  value={store.diagnosis}
                  onChange={(e) => store.updateDiagnosis(e.target.value)}
                />
              </div>
            </div>
          )}

          {activeTab === "prescribe" && (
            <PrescriptionBuilder
              items={store.prescription}
              onAddItem={store.addPrescriptionItem}
              onRemoveItem={store.removePrescriptionItem}
            />
          )}

          {activeTab === "billing" && (
            <div>
              <h3 style={{ marginTop: 0, fontSize: "1.1rem" }}>Tổng hợp ca khám</h3>
              <div className={styles.detailRow}>
                <span className={styles.label}>Chi phí khám:</span>
                <span className={styles.value}>200.000 ₫</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.label}>Chi phí thuốc đã kê ({store.prescription.length} khoản):</span>
                <span className={styles.value}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    store.prescription.length * 75000
                  )}
                </span>
              </div>
              <div style={{ borderTop: "1px solid var(--border-color, #e5e7eb)", margin: "1rem 0" }}></div>
              <div className={styles.detailRow} style={{ fontWeight: 600, fontSize: "1.1rem" }}>
                <span>Tổng tiền:</span>
                <span style={{ color: "#3b82f6" }}>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                    200000 + store.prescription.length * 75000
                  )}
                </span>
              </div>

              {store.isSaved ? (
                <div style={{ color: "#047857", fontWeight: 500, margin: "1rem 0" }}>
                  ✓ Ca khám đã được lưu và gửi yêu cầu hóa đơn thành công!
                </div>
              ) : (
                <div className={styles.actions}>
                  <Button variant="secondary" onClick={store.resetEncounter}>
                    Hủy ca khám
                  </Button>
                  <Button onClick={store.saveEncounter} disabled={store.isLoading}>
                    {store.isLoading ? "Đang xử lý..." : "Lưu & Hoàn tất ca khám"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
