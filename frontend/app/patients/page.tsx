/*
 * Created: 2026-06-28
 * Purpose: Premium Patient Portal directory with statistics, search/filters, data tables, and modal registration form.
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import { usePatients } from "@/hooks/usePatients";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { createPatient } from "@/services/patient.mock";
import Link from "next/link";
import styles from "./page.module.css";

interface PatientFormData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: "M" | "F" | "Other";
  phone: string;
  email: string;
}

const INITIAL_FORM_DATA: PatientFormData = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "M",
  phone: "",
  email: "",
};

export default function PatientsPage() {
  const { patients, isLoading, error, total, refetch } = usePatients();

  // Search and Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("ALL");
  const [visitFilter, setVisitFilter] = useState("ALL");

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<PatientFormData>(INITIAL_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Stats computation
  const totalCount = patients.length;
  const maleCount = patients.filter((p) => p.gender === "M").length;
  const femaleCount = patients.filter((p) => p.gender === "F").length;
  const visitedCount = patients.filter((p) => p.lastVisit).length;

  // Filtered Patients List
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "ALL" || p.gender === genderFilter;
    
    const matchesVisit =
      visitFilter === "ALL" ||
      (visitFilter === "VISITED" && p.lastVisit) ||
      (visitFilter === "NEVER" && !p.lastVisit);

    return matchesSearch && matchesGender && matchesVisit;
  });

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const validateField = (name: string, value: string): string => {
    let error = "";
    if (name === "lastName") {
      if (!value.trim()) {
        error = "Họ không được để trống";
      } else if (value.trim().length < 2) {
        error = "Họ phải chứa ít nhất 2 ký tự";
      } else if (/[0-9]/.test(value)) {
        error = "Họ không được chứa chữ số";
      }
    } else if (name === "firstName") {
      if (!value.trim()) {
        error = "Tên không được để trống";
      } else if (value.trim().length < 2) {
        error = "Tên phải chứa ít nhất 2 ký tự";
      } else if (/[0-9]/.test(value)) {
        error = "Tên không được chứa chữ số";
      }
    } else if (name === "phone") {
      const phoneRegex = /^(0|\+84)[35789][0-9]{8}$/;
      if (!value.trim()) {
        error = "Số điện thoại không được để trống";
      } else if (!phoneRegex.test(value.trim())) {
        error = "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 0 hoặc +84)";
      }
    } else if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value.trim() && !emailRegex.test(value.trim())) {
        error = "Địa chỉ email không đúng định dạng (ví dụ: ten@domain.com)";
      }
    } else if (name === "dateOfBirth") {
      if (!value) {
        error = "Vui lòng chọn ngày sinh";
      } else {
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) {
          error = "Ngày sinh phải là một ngày trong quá khứ";
        }
      }
    }
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    // Validate all fields
    const errors: Record<string, string> = {
      lastName: validateField("lastName", formData.lastName),
      firstName: validateField("firstName", formData.firstName),
      dateOfBirth: validateField("dateOfBirth", formData.dateOfBirth),
      phone: validateField("phone", formData.phone),
      email: validateField("email", formData.email),
    };

    const hasError = Object.values(errors).some((err) => err !== "");
    if (hasError) {
      setFormError("Vui lòng kiểm tra và sửa lại các lỗi dữ liệu bên dưới.");
      return;
    }

    try {
      setIsSaving(true);
      await createPatient({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      });

      setSuccessMessage("Đăng ký bệnh nhân thành công!");
      setFormData(INITIAL_FORM_DATA);
      setFieldErrors({});
      await refetch();

      setTimeout(() => {
        setSuccessMessage(null);
        setIsModalOpen(false);
      }, 1500);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Đã xảy ra lỗi khi tạo bệnh nhân");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý Bệnh nhân</h1>
          <p className={styles.subtitle}>
            <span>{total > 0 ? `Tổng cộng: ${total} bệnh nhân` : "Không có bệnh nhân"}</span>
            <span> • Xem danh sách hồ sơ bệnh nhân, thực hiện đặt lịch khám và tra cứu lịch sử bệnh án.</span>
          </p>
        </div>
        <button
          onClick={() => {
            setFormData(INITIAL_FORM_DATA);
            setFormError(null);
            setIsModalOpen(true);
          }}
          className={styles.addBtn}
        >
          <span className={styles.addBtnIcon}>+</span> Đăng ký bệnh nhân
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statsCard}>
          <div className={`${styles.statsIcon} ${styles.iconTeal}`}>👥</div>
          <div>
            <div className={styles.statsValue}>{totalCount}</div>
            <div className={styles.statsLabel}>Tổng bệnh nhân</div>
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={`${styles.statsIcon} ${styles.iconBlue}`}>♂</div>
          <div>
            <div className={styles.statsValue}>{maleCount}</div>
            <div className={styles.statsLabel}>Bệnh nhân Nam</div>
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={`${styles.statsIcon} ${styles.iconPink}`}>♀</div>
          <div>
            <div className={styles.statsValue}>{femaleCount}</div>
            <div className={styles.statsLabel}>Bệnh nhân Nữ</div>
          </div>
        </div>
        <div className={styles.statsCard}>
          <div className={`${styles.statsIcon} ${styles.iconPurple}`}>📅</div>
          <div>
            <div className={styles.statsValue}>{visitedCount}</div>
            <div className={styles.statsLabel}>Đã từng khám</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className={styles.filterSection}>
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm theo tên bệnh nhân, số điện thoại, email hoặc mã hồ sơ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filtersGroup}>
          <select
            className={styles.filterSelect}
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="ALL">Tất cả giới tính</option>
            <option value="M">Nam</option>
            <option value="F">Nữ</option>
            <option value="Other">Khác</option>
          </select>

          <select
            className={styles.filterSelect}
            value={visitFilter}
            onChange={(e) => setVisitFilter(e.target.value)}
          >
            <option value="ALL">Tất cả lịch sử khám</option>
            <option value="VISITED">Đã từng khám</option>
            <option value="NEVER">Chưa từng khám</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && <LoadingState label="Đang tải danh sách bệnh nhân..." />}

      {/* Error State */}
      {error && !isLoading && (
        <div className={styles.errorState}>
          <p className={styles.errorTitle}>Lỗi tải dữ liệu</p>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {/* Empty / Zero States */}
      {!isLoading && !error && patients.length === 0 && (
        <EmptyState
          title="Không có bệnh nhân"
          description="Hiện chưa có bệnh nhân nào trong hệ thống."
        />
      )}

      {!isLoading && !error && patients.length > 0 && filteredPatients.length === 0 && (
        <EmptyState
          title="Không tìm thấy bệnh nhân"
          description="Không tìm thấy kết quả phù hợp với từ khóa tìm kiếm hoặc bộ lọc được chọn."
        />
      )}

      {/* Patients Data Table */}
      {!isLoading && !error && filteredPatients.length > 0 && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: "90px" }}>Mã BN</th>
                <th>Bệnh nhân</th>
                <th>Thông tin liên hệ</th>
                <th>Ngày sinh</th>
                <th style={{ width: "160px" }}>Khám gần đây</th>
                <th style={{ width: "220px", textAlign: "right" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => {
                const initials = getInitials(patient.name);
                const isMale = patient.gender === "M";
                const isFemale = patient.gender === "F";
                
                return (
                  <tr key={patient.id}>
                    <td data-label="Mã BN">
                      <span className={styles.patientIdBadge}>{patient.id}</span>
                    </td>
                    <td data-label="Bệnh nhân">
                      <div className={styles.patientCell}>
                        <div
                          className={`${styles.avatar} ${
                            isMale ? styles.avatarM : isFemale ? styles.avatarF : styles.avatarO
                          }`}
                        >
                          {initials}
                        </div>
                        <div>
                          <div className={styles.patientName}>{patient.name}</div>
                          <span
                            className={`${styles.genderBadge} ${
                              isMale ? styles.badgeBlue : isFemale ? styles.badgePink : styles.badgeGray
                            }`}
                          >
                            {patient.gender === "M" ? "Nam" : patient.gender === "F" ? "Nữ" : "Khác"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td data-label="Liên hệ">
                      <div className={styles.contactCell}>
                        <div className={styles.contactItem}>
                          <span className={styles.contactIcon}>📞</span> {patient.phone}
                        </div>
                        {patient.email && (
                          <div className={styles.contactItem}>
                            <span className={styles.contactIcon}>✉️</span> {patient.email}
                          </div>
                        )}
                      </div>
                    </td>
                    <td data-label="Ngày sinh" className={styles.dobCell}>{patient.dateOfBirth}</td>
                    <td data-label="Lần khám cuối">
                      {patient.lastVisit ? (
                        <span className={`${styles.statusBadge} ${styles.statusActive}`}>
                          Lần khám cuối: {patient.lastVisit}
                        </span>
                      ) : (
                        <span className={`${styles.statusBadge} ${styles.statusInactive}`}>
                          Chưa khám
                        </span>
                      )}
                    </td>
                    <td data-label="Thao tác">
                      <div className={styles.actionsCell}>
                        <Link
                          href={`/medical-records?patientId=${patient.id}`}
                          className={`${styles.actionBtn} ${styles.recordBtn}`}
                          title="Xem bệnh án bệnh nhân"
                        >
                          📋 Bệnh án
                        </Link>
                        <Link
                          href={`/book-appointment?patientId=${patient.id}`}
                          className={`${styles.actionBtn} ${styles.bookBtn}`}
                          title="Đặt lịch hẹn khám mới"
                        >
                          📅 Đặt lịch
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Patient Modal overlay */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Đăng ký bệnh nhân mới</h2>
              <button
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              {formError && <div className={styles.formError}>{formError}</div>}
              {successMessage && (
                <div className={styles.formSuccess}>{successMessage}</div>
              )}

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Họ <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    className={`${styles.formInput} ${fieldErrors.lastName ? styles.inputError : ""}`}
                    placeholder="Ví dụ: Nguyễn"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                  {fieldErrors.lastName ? (
                    <span className={styles.fieldError}>{fieldErrors.lastName}</span>
                  ) : (
                    <span className={styles.fieldHelper}>Tối thiểu 2 ký tự, không chứa số</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tên <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    className={`${styles.formInput} ${fieldErrors.firstName ? styles.inputError : ""}`}
                    placeholder="Ví dụ: Văn A"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                  {fieldErrors.firstName ? (
                    <span className={styles.fieldError}>{fieldErrors.firstName}</span>
                  ) : (
                    <span className={styles.fieldHelper}>Tối thiểu 2 ký tự, không chứa số</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Ngày sinh <span className={styles.required}>*</span></label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    className={`${styles.formInput} ${fieldErrors.dateOfBirth ? styles.inputError : ""}`}
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                  {fieldErrors.dateOfBirth ? (
                    <span className={styles.fieldError}>{fieldErrors.dateOfBirth}</span>
                  ) : (
                    <span className={styles.fieldHelper}>Ngày sinh trong quá khứ</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Giới tính <span className={styles.required}>*</span></label>
                  <select
                    name="gender"
                    className={styles.formSelect}
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  >
                    <option value="M">Nam</option>
                    <option value="F">Nữ</option>
                    <option value="Other">Khác</option>
                  </select>
                  <span className={styles.fieldHelper}>Chọn giới tính sinh học</span>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Số điện thoại <span className={styles.required}>*</span></label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className={`${styles.formInput} ${fieldErrors.phone ? styles.inputError : ""}`}
                    placeholder="Ví dụ: 0901234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                  {fieldErrors.phone ? (
                    <span className={styles.fieldError}>{fieldErrors.phone}</span>
                  ) : (
                    <span className={styles.fieldHelper}>Định dạng 10 số (03/05/07/08/09...) hoặc +84</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`${styles.formInput} ${fieldErrors.email ? styles.inputError : ""}`}
                    placeholder="Ví dụ: email@gmail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSaving}
                  />
                  {fieldErrors.email ? (
                    <span className={styles.fieldError}>{fieldErrors.email}</span>
                  ) : (
                    <span className={styles.fieldHelper}>Địa chỉ email hợp lệ (tùy chọn)</span>
                  )}
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelBtn}
                  disabled={isSaving}
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isSaving}
                >
                  {isSaving ? "Đang xử lý..." : "Lưu bệnh nhân"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
