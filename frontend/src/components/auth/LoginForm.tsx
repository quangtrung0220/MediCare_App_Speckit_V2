/*
 * Created: 2026-07-02
 * Purpose: Login form component with email/password input and error handling.
 * Owner: Quang Trung
 */
'use client';

import { useState } from 'react';
import { login } from '../../services/auth.service';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoMark}>
          <span className={styles.logoIcon}>⚕️</span>
        </div>
        <h1 className={styles.title}>MediCare</h1>
        <p className={styles.subtitle}>Hệ thống quản lý phòng khám</p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit} id="login-form">
        <div className={styles.fieldGroup}>
          <label htmlFor="login-email" className={styles.label}>
            Email
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>📧</span>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              placeholder="admin@medicare.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              autoComplete="email"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label htmlFor="login-password" className={styles.label}>
            Mật khẩu
          </label>
          <div className={styles.inputWrapper}>
            <span className={styles.inputIcon}>🔑</span>
            <input
              id="login-password"
              type={showPass ? 'text' : 'password'}
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className={styles.showPassBtn}
              onClick={() => setShowPass((v) => !v)}
              tabIndex={-1}
              aria-label={showPass ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPass ? '🙈' : '👁️'}
            </button>
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
          id="login-submit"
        >
          {loading ? (
            <span className={styles.spinner}>Đang đăng nhập...</span>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      {/* Demo hint */}
      <div className={styles.demoHint}>
        <p>Demo — Tài khoản mặc định:</p>
        <code>admin@medicare.vn / Medicare@2026</code>
      </div>
    </div>
  );
}
