/*
 * Created: 2026-06-24
 * Purpose: Vitals form entry for patient check-in intake workflow (T019).
 * Owner: Quang Trung
 */
"use client";

import React from "react";
import { useIntakeStore } from "@/stores/intakeStore";
import { Field, TextInput } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import styles from "./IntakeForm.module.css";

interface IntakeFormProps {
  patientId: string;
  patientName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function IntakeForm({ patientId, patientName, onSuccess, onCancel }: IntakeFormProps) {
  const { vitals, updateVital, submitVitals, isLoading, error, success } = useIntakeStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitVitals(patientId);
    onSuccess();
  };

  return (
    <form className={styles.vitalsCard} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Nhập thông số sinh tồn: {patientName}</h3>

      {error && <div style={{ color: "#ef4444", marginBottom: "1rem" }}>{error}</div>}

      <div className={styles.formGrid}>
        <Field label="Huyết áp tâm thu (mmHg)">
          <TextInput
            type="number"
            required
            placeholder="Ví dụ: 120"
            value={vitals.systolicBP}
            onChange={(e) => updateVital("systolicBP", e.target.value)}
          />
        </Field>

        <Field label="Huyết áp tâm trương (mmHg)">
          <TextInput
            type="number"
            required
            placeholder="Ví dụ: 80"
            value={vitals.diastolicBP}
            onChange={(e) => updateVital("diastolicBP", e.target.value)}
          />
        </Field>

        <Field label="Nhịp tim (lần/phút)">
          <TextInput
            type="number"
            required
            placeholder="Ví dụ: 75"
            value={vitals.heartRate}
            onChange={(e) => updateVital("heartRate", e.target.value)}
          />
        </Field>

        <Field label="Nhiệt độ cơ thể (°C)">
          <TextInput
            type="number"
            step="0.1"
            required
            placeholder="Ví dụ: 36.5"
            value={vitals.temperature}
            onChange={(e) => updateVital("temperature", e.target.value)}
          />
        </Field>

        <Field label="Cân nặng (kg)">
          <TextInput
            type="number"
            step="0.1"
            required
            placeholder="Ví dụ: 62"
            value={vitals.weight}
            onChange={(e) => updateVital("weight", e.target.value)}
          />
        </Field>

        <Field label="Nhịp thở (lần/phút)">
          <TextInput
            type="number"
            required
            placeholder="Ví dụ: 16"
            value={vitals.respiratoryRate}
            onChange={(e) => updateVital("respiratoryRate", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Dị ứng / Chú ý đặc biệt">
        <textarea
          style={{
            width: "100%",
            borderRadius: "6px",
            border: "1px solid var(--border-color, #e5e7eb)",
            padding: "0.5rem",
            fontSize: "0.95rem",
            minHeight: "80px",
            resize: "vertical",
          }}
          placeholder="Ghi chú về tiền sử dị ứng..."
          value={vitals.allergies}
          onChange={(e) => updateVital("allergies", e.target.value)}
        />
      </Field>

      {success && <div className={styles.successMsg}>✓ Thông số sinh tồn đã được lưu thành công.</div>}

      <div className={styles.submitSection}>
        <Button type="button" variant="secondary" onClick={onCancel}>Hủy bỏ</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Đang lưu..." : "Lưu thông số"}
        </Button>
      </div>
    </form>
  );
}
