/*
 * Created: 2026-06-24
 * Purpose: Admin dashboard to manage system users and roles (T031).
 * Owner: Quang Trung
 */
"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";
import AdminUserList from "@/components/admin/AdminUserList";
import { downloadDatabaseBackup, restoreDatabaseBackup } from "@/services/admin.service";

export default function AdminPage() {
  const [loadingBackup, setLoadingBackup] = useState(false);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [backupMessage, setBackupMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [restoreMessage, setRestoreMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = async () => {
    setLoadingBackup(true);
    setBackupMessage(null);
    try {
      await downloadDatabaseBackup();
      setBackupMessage({ type: "success", text: "Tải bản sao lưu cơ sở dữ liệu thành công!" });
    } catch (err: any) {
      setBackupMessage({ type: "error", text: err.message || "Lỗi khi tải bản sao lưu." });
    } finally {
      setLoadingBackup(false);
    }
  };

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileInputRef.current?.files?.[0]) {
      setRestoreMessage({ type: "error", text: "Vui lòng chọn tệp sao lưu (.sqlite) trước." });
      return;
    }

    const file = fileInputRef.current.files[0];
    if (!window.confirm("CẢNH BÁO: Khôi phục cơ sở dữ liệu sẽ ghi đè toàn bộ dữ liệu hiện tại. Bạn có chắc chắn muốn tiếp tục?")) {
      return;
    }

    setLoadingRestore(true);
    setRestoreMessage(null);
    try {
      await restoreDatabaseBackup(file);
      setRestoreMessage({
        type: "success",
        text: "Khôi phục dữ liệu thành công! Vui lòng tải lại trang sau 2 giây để cập nhật thông tin mới.",
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err: any) {
      setRestoreMessage({ type: "error", text: err.message || "Lỗi khi khôi phục dữ liệu." });
    } finally {
      setLoadingRestore(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản trị hệ thống (Admin Settings)</h1>

      {/* Real Admin User Accounts Management */}
      <div className={styles.card} style={{ marginBottom: "2rem" }}>
        <AdminUserList />
      </div>

      {/* Database Backup & Restore management section */}
      <div className={styles.card}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0, marginBottom: "0.5rem" }}>
          Sao lưu & Khôi phục dữ liệu (Database Backup & Restore)
        </h2>
        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
          Vì ứng dụng chạy trên máy cá nhân của bạn, tất cả dữ liệu lâm sàng và hồ sơ bệnh nhân đều được lưu trữ cục bộ. Hãy thực hiện sao lưu thường xuyên để tránh mất mát dữ liệu.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Backup Row */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", paddingBottom: "1.5rem", borderBottom: "1px solid var(--border-color, #e5e7eb)" }}>
            <div>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>1. Tải bản sao lưu hiện tại</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: "0.25rem 0 0 0" }}>
                Xuất tệp cơ sở dữ liệu SQLite hiện tại chứa toàn bộ hồ sơ phòng khám của bạn.
              </p>
            </div>
            <Button onClick={handleBackup} disabled={loadingBackup}>
              {loadingBackup ? "Đang xuất..." : "Tải bản sao lưu (.sqlite)"}
            </Button>
          </div>

          {backupMessage && (
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: backupMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: backupMessage.type === "success" ? "#047857" : "#b91c1c",
              border: `1px solid ${backupMessage.type === "success" ? "#a7f3d0" : "#fecaca"}`
            }}>
              {backupMessage.type === "success" ? "✅ " : "❌ "}
              {backupMessage.text}
            </div>
          )}

          {/* Restore Row */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", paddingTop: "0.5rem" }}>
            <div style={{ flex: 1, minWidth: "280px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>2. Khôi phục từ bản sao lưu</h3>
              <p style={{ color: "var(--muted-foreground)", fontSize: "0.85rem", margin: "0.25rem 0 1rem 0" }}>
                Chọn một tệp cơ sở dữ liệu `.sqlite` trước đó để ghi đè và khôi phục lại trạng thái dữ liệu.
              </p>
              <form onSubmit={handleRestore} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <input
                  type="file"
                  accept=".sqlite"
                  ref={fileInputRef}
                  style={{
                    fontSize: "0.875rem",
                    padding: "0.375rem 0.75rem",
                    border: "1px solid var(--border-color, #e5e7eb)",
                    borderRadius: "8px",
                    background: "var(--input-bg, #f9fafb)",
                    color: "var(--foreground, #374151)",
                    width: "100%",
                    maxWidth: "320px"
                  }}
                />
                <Button type="submit" variant="ghost" style={{ backgroundColor: "var(--destructive, #ef4444)", color: "white" }} disabled={loadingRestore}>
                  {loadingRestore ? "Đang khôi phục..." : "Khôi phục ngay"}
                </Button>
              </form>
            </div>
          </div>

          {restoreMessage && (
            <div style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              fontSize: "0.875rem",
              fontWeight: 500,
              backgroundColor: restoreMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
              color: restoreMessage.type === "success" ? "#047857" : "#b91c1c",
              border: `1px solid ${restoreMessage.type === "success" ? "#a7f3d0" : "#fecaca"}`
            }}>
              {restoreMessage.type === "success" ? "✅ " : "❌ "}
              {restoreMessage.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
