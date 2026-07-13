"use client";

/*
 * Created: 2026-07-04
 * Purpose: Dedicated Login Page that renders the glassmorphism LoginForm.
 * Owner: Quang Trung
 */

import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // Force clean state refresh and push to home dashboard
    router.push("/");
    router.refresh();
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginCardWrapper}>
        <LoginForm onSuccess={handleLoginSuccess} />
        
        <div className={styles.signupPrompt}>
          Chưa có tài khoản đăng ký nhân viên?{" "}
          <Link href="/register" className={styles.link}>
            Đăng ký tại đây
          </Link>
        </div>
      </div>
    </div>
  );
}
