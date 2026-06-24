/*
 * Created: 2026-06-24
 * Purpose: Patient portal dashboard overview and profile settings (T039).
 * Owner: Quang Trung
 */
"use client";

import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function PatientPage() {
  const profile = {
    id: "PAT-001",
    name: "Nguyễn Văn A",
    gender: "Nam",
    dateOfBirth: "1980-03-15",
    phone: "+84901234567",
    bloodType: "O+",
    allergies: "Paracetamol, Hải sản",
  };

  const nextAppointment = {
    id: "APT-0001",
    doctorName: "Dr. Nguyễn Minh",
    specialty: "Nội khoa",
    date: "2026-06-25",
    time: "08:00",
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Cổng thông tin bệnh nhân (Patient Portal)</h1>

      <div className={styles.dashboardGrid}>
        {/* Left Panel: Profile Summary */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>Thông tin cá nhân</h2>
          <div className={styles.detailRow}>
            <span className={styles.label}>Họ tên:</span>
            <span className={styles.value}>{profile.name}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Mã bệnh nhân:</span>
            <span className={styles.value}>{profile.id}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Giới tính:</span>
            <span className={styles.value}>{profile.gender}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Ngày sinh:</span>
            <span className={styles.value}>{profile.dateOfBirth}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Số điện thoại:</span>
            <span className={styles.value}>{profile.phone}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Nhóm máu:</span>
            <span className={styles.value}>{profile.bloodType}</span>
          </div>
          <div className={styles.detailRow}>
            <span className={styles.label}>Tiền sử dị ứng:</span>
            <span className={styles.value} style={{ color: "#ef4444" }}>{profile.allergies}</span>
          </div>
        </div>

        {/* Right Panel: Highlights and Actions */}
        <div>
          {nextAppointment && (
            <div className={styles.appointmentCard}>
              <h3 className={styles.appointmentTitle}>Lịch hẹn sắp tới của bạn</h3>
              <div className={styles.appointmentDetails}>
                <strong>{nextAppointment.doctorName}</strong> ({nextAppointment.specialty})<br />
                Thời gian: <strong>{nextAppointment.time}</strong> ngày <strong>{nextAppointment.date}</strong><br />
                Mã lịch hẹn: {nextAppointment.id}
              </div>
            </div>
          )}

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Thao tác nhanh</h2>
            <div className={styles.actionsGrid}>
              <Link href="/book-appointment" className={styles.actionCard}>
                <span className={styles.actionTitle}>Đặt lịch khám</span>
                <span className={styles.actionDesc}>Chọn bác sĩ, giờ khám và đăng ký lịch khám mới.</span>
              </Link>
              
              <Link href="/my-appointments" className={styles.actionCard}>
                <span className={styles.actionTitle}>Lịch hẹn của tôi</span>
                <span className={styles.actionDesc}>Xem danh sách lịch hẹn sắp diễn ra và lịch sử khám.</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
