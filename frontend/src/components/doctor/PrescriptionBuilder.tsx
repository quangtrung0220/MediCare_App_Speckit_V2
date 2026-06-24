/*
 * Created: 2026-06-24
 * Purpose: Interactive drug selection and dosing prescription builder (T020).
 * Owner: Quang Trung
 */
"use client";

import React, { useState } from "react";
import type { PrescriptionItem } from "@/stores/clinicalStore";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import styles from "./PrescriptionBuilder.module.css";

interface PrescriptionBuilderProps {
  items: PrescriptionItem[];
  onAddItem: (item: Omit<PrescriptionItem, "id">) => void;
  onRemoveItem: (id: string) => void;
}

const COMMON_DRUGS = [
  "Paracetamol 500mg",
  "Amoxicillin 500mg",
  "Ibuprofen 400mg",
  "Vitamin C 500mg",
  "Metformin 850mg",
  "Amlodipine 5mg",
  "Salbutamol Inhaler 100mcg",
];

export function PrescriptionBuilder({ items, onAddItem, onRemoveItem }: PrescriptionBuilderProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("1 viên / ngày");
  const [duration, setDuration] = useState("5 ngày");

  const filteredSuggestions = COMMON_DRUGS.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    if (!searchTerm.trim()) return;
    onAddItem({
      name: searchTerm.trim(),
      dosage: dosage.trim() || "Tiêu chuẩn",
      frequency,
      duration,
    });
    setSearchTerm("");
    setDosage("");
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Đơn thuốc & Kê đơn</h3>

      <div className={styles.formGrid}>
        <div style={{ position: "relative" }}>
          <Field label="Tìm thuốc / Dược phẩm">
            <TextInput
              type="text"
              placeholder="Nhập tên thuốc..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
          </Field>
          {showSuggestions && searchTerm && filteredSuggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "var(--card-bg, #ffffff)",
                border: "1px solid var(--border-color, #e5e7eb)",
                borderRadius: "6px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                zIndex: 10,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {filteredSuggestions.map((s) => (
                <div
                  key={s}
                  role="button"
                  tabIndex={0}
                  style={{ padding: "0.5rem 0.75rem", cursor: "pointer" }}
                  onMouseDown={() => {
                    setSearchTerm(s);
                    setShowSuggestions(false);
                  }}
                  className="suggestion-item"
                >
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <Field label="Liều lượng (ví dụ: 1 viên)">
          <TextInput
            type="text"
            placeholder="Liều lượng..."
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
          />
        </Field>

        <Field label="Tần suất">
          <select
            style={{
              width: "100%",
              height: "38px",
              borderRadius: "6px",
              border: "1px solid var(--border-color, #e5e7eb)",
              padding: "0 0.5rem",
              fontSize: "0.95rem",
            }}
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="1 viên / ngày">1 viên / ngày</option>
            <option value="2 viên / ngày, chia 2 lần">2 viên / ngày, chia 2 lần</option>
            <option value="3 viên / ngày, chia 3 lần">3 viên / ngày, chia 3 lần</option>
            <option value="1 viên / ngày, uống sau ăn">1 viên / ngày, uống sau ăn</option>
            <option value="Xịt 2 nhát / lần khi khó thở">Xịt 2 nhát / lần khi khó thở</option>
          </select>
        </Field>

        <Field label="Số ngày uống">
          <TextInput
            type="text"
            placeholder="Ví dụ: 7 ngày..."
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </Field>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type="button" onClick={handleAdd}>Thêm vào đơn</Button>
      </div>

      <h4 style={{ marginTop: "1.5rem", marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 600 }}>
        Danh sách thuốc đã kê:
      </h4>

      <div className={styles.list}>
        {items.length === 0 ? (
          <div className={styles.empty}>Chưa có thuốc nào được chọn.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className={styles.item} data-testid="prescription-item">
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemInstructions}>
                  {item.dosage} — {item.frequency} — {item.duration}
                </span>
              </div>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => onRemoveItem(item.id)}
              >
                Xóa
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
