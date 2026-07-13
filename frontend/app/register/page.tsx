"use client";

/*
 * Created: 2026-07-04
 * Purpose: Dedicated Registration Page for new clinic staff accounts.
 * Owner: Quang Trung
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth.service";
import Link from "next/link";
import styles from "./page.module.css";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("DOCTOR");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 8) {
      setError("Mật khẩu phải chứa ít nhất 8 ký tự.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Đăng ký thành công!</h1>
          <p className={styles.successMessage}>
            Tài khoản <strong>{email}</strong> ({role}) đã được gửi yêu cầu phê duyệt.
          </p>
          <div className={styles.approvalNote}>
            ⚠️ Để đăng nhập vào hệ thống, tài khoản của bạn cần được phê duyệt bởi Quản trị viên (Admin).
          </div>
          <Link href="/login" className={styles.loginBtn}>
            Quay lại trang Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.card}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.logoMark}>
            <span className={styles.logoIcon}>⚕️</span>
          </div>
          <h1 className={styles.title}>MediCare</h1>
          <p className={styles.subtitle}>Đăng ký tài khoản nhân viên mới</p>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="reg-email" className={styles.label}>
              Email công việc
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>📧</span>
              <input
                id="reg-email"
                type="email"
                className={styles.input}
                placeholder="bacsi@medicare.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-role" className={styles.label}>
              Vai trò / Vị trí làm việc
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🩺</span>
              <select
                id="reg-role"
                className={styles.select}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="DOCTOR">Bác sĩ (Doctor)</option>
                <option value="NURSE">Điều dưỡng (Nurse)</option>
                <option value="RECEPTIONIST">Lễ tân (Receptionist)</option>
                <option value="PHARMACIST">Dược sĩ (Pharmacist)</option>
                <option value="PATIENT">Bệnh nhân (Patient Portal)</option>
              </select>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-password" className={styles.label}>
              Mật khẩu
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔑</span>
              <input
                id="reg-password"
                type="password"
                className={styles.input}
                placeholder="Tối thiểu 8 ký tự"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="reg-confirm-password" className={styles.label}>
              Xác nhận mật khẩu
            </label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}>🔒</span>
              <input
                id="reg-confirm-password"
                type="password"
                className={styles.input}
                placeholder="Nhập lại mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div className={styles.errorBox} role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner}>Đang gửi yêu cầu...</span>
            ) : (
              "Đăng ký tài khoản"
            )}
          </button>
        </form>

        <div className={styles.loginPrompt}>
          Đã có tài khoản?{" "}
          <Link href="/login" className={styles.link}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
