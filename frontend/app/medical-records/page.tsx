/*
 * Created: 2026-06-24
 * Purpose: Clinic medical records folder list page (T041).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import styles from "./page.module.css";

interface RecordItem {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  symptoms: string;
  diagnosis: string;
  prescription: string[];
}

const MOCK_RECORDS: RecordItem[] = [
  {
    id: "REC-201",
    patientName: "Nguyễn Văn A",
    doctorName: "Dr. Nguyễn Minh",
    date: "2026-06-24",
    symptoms: "Đau đầu nhẹ, sốt nhẹ về chiều.",
    diagnosis: "Sốt virus siêu vi",
    prescription: ["Paracetamol 500mg (10 viên)", "Vitamin C 500mg (10 viên)"],
  },
  {
    id: "REC-202",
    patientName: "Trần Thị B",
    doctorName: "Dr. Trần Hương",
    date: "2026-06-24",
    symptoms: "Ho khan kéo dài, đau rát họng.",
    diagnosis: "Viêm họng cấp",
    prescription: ["Amoxicillin 500mg (14 viên)"],
  },
  {
    id: "REC-203",
    patientName: "Phạm Văn C",
    doctorName: "Dr. Phạm Tuấn",
    date: "2026-06-23",
    symptoms: "Mẩn ngứa da cánh tay sau khi ăn hải sản.",
    diagnosis: "Dị ứng thực phẩm cấp độ nhẹ",
    prescription: ["Ibuprofen 400mg (10 viên)"],
  },
];

export default function MedicalRecordsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRecords = MOCK_RECORDS.filter((rec) =>
    rec.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rec.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Hồ sơ bệnh án điện tử (Medical Records)</h1>

      <div className={styles.card}>
        <div className={styles.searchBar}>
          <input
            type="text"
            className={styles.input}
            placeholder="Tìm theo bệnh nhân, chẩn đoán hoặc mã hồ sơ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Bệnh nhân</th>
                <th>Bác sĩ</th>
                <th>Ngày khám</th>
                <th>Triệu chứng</th>
                <th>Chẩn đoán</th>
                <th>Đơn thuốc kê</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec.id} data-testid="record-row">
                  <td><strong>{rec.id}</strong></td>
                  <td>{rec.patientName}</td>
                  <td>{rec.doctorName}</td>
                  <td>{rec.date}</td>
                  <td>{rec.symptoms}</td>
                  <td><strong>{rec.diagnosis}</strong></td>
                  <td>
                    <div className={styles.drugsList}>
                      {rec.prescription.map((med, index) => (
                        <span key={index} className={styles.drugItem}>{med}</span>
                      ))}
                    </div>
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
