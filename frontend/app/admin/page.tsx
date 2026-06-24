/*
 * Created: 2026-06-24
 * Purpose: Admin dashboard to manage system users and roles (T031).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import styles from "./page.module.css";

interface UserAccount {
  id: string;
  email: string;
  name: string;
  role: string;
  status: "ACTIVE" | "PENDING";
  createdAt: string;
}

const INITIAL_USERS: UserAccount[] = [
  { id: "USR-001", email: "admin@medicare.com", name: "Nguyễn Admin", role: "Admin", status: "ACTIVE", createdAt: "2026-01-10" },
  { id: "USR-002", email: "minh.nguyen@medicare.com", name: "Nguyễn Minh", role: "Doctor", status: "ACTIVE", createdAt: "2026-02-15" },
  { id: "USR-003", email: "huong.tran@medicare.com", name: "Trần Hương", role: "Nurse", status: "ACTIVE", createdAt: "2026-03-01" },
  { id: "USR-004", email: "receptionist@medicare.com", name: "Phạm Receptionist", role: "Receptionist", status: "PENDING", createdAt: "2026-06-20" },
];

export default function AdminPage() {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);

  const handleApprove = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: "ACTIVE" } : u))
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản trị hệ thống (Admin Settings)</h1>

      <div className={styles.card}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0, marginBottom: "1.25rem" }}>
          Quản lý tài khoản người dùng
        </h2>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã ND</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} data-testid="user-row">
                  <td><strong>{u.id}</strong></td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <span className={`${styles.badge} ${u.status === "ACTIVE" ? styles.statusActive : styles.statusPending}`}>
                      {u.status === "ACTIVE" ? "Hoạt động" : "Chờ duyệt"}
                    </span>
                  </td>
                  <td>{u.createdAt}</td>
                  <td>
                    {u.status === "PENDING" ? (
                      <Button onClick={() => handleApprove(u.id)}>Kích hoạt</Button>
                    ) : (
                      <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>Không có</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
