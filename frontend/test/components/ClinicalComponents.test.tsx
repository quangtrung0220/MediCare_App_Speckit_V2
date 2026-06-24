import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { IntakeForm } from "@/components/nurse/IntakeForm";
import { PrescriptionBuilder } from "@/components/doctor/PrescriptionBuilder";
import { useIntakeStore } from "@/stores/intakeStore";
import type { PrescriptionItem } from "@/stores/clinicalStore";

jest.mock("@/stores/intakeStore");

describe("Clinical Components", () => {
  describe("IntakeForm", () => {
    const mockUpdateVital = jest.fn();
    const mockSubmitVitals = jest.fn();
    const mockOnSuccess = jest.fn();
    const mockOnCancel = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
      (useIntakeStore as unknown as jest.Mock).mockReturnValue({
        vitals: {
          systolicBP: "120",
          diastolicBP: "80",
          heartRate: "70",
          temperature: "36.5",
          weight: "60",
          respiratoryRate: "16",
          allergies: "None",
        },
        updateVital: mockUpdateVital,
        submitVitals: mockSubmitVitals,
        isLoading: false,
        error: null,
        success: false,
      });
    });

    it("renders input fields with pre-filled vital data", () => {
      render(
        <IntakeForm
          patientId="PAT-001"
          patientName="Nguyễn Văn A"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText("Nhập thông số sinh tồn: Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByDisplayValue("120")).toBeInTheDocument();
      expect(screen.getByDisplayValue("80")).toBeInTheDocument();
      expect(screen.getByDisplayValue("70")).toBeInTheDocument();
      expect(screen.getByDisplayValue("36.5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("60")).toBeInTheDocument();
      expect(screen.getByDisplayValue("16")).toBeInTheDocument();
      expect(screen.getByDisplayValue("None")).toBeInTheDocument();
    });

    it("triggers store update handlers on input change", () => {
      render(
        <IntakeForm
          patientId="PAT-001"
          patientName="Nguyễn Văn A"
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      );

      const sysInput = screen.getByPlaceholderText("Ví dụ: 120");
      fireEvent.change(sysInput, { target: { value: "130" } });
      expect(mockUpdateVital).toHaveBeenCalledWith("systolicBP", "130");
    });
  });

  describe("PrescriptionBuilder", () => {
    const items: PrescriptionItem[] = [
      { id: "MED-1", name: "Paracetamol 500mg", dosage: "1 viên", frequency: "1 viên / ngày", duration: "5 ngày" },
    ];
    const mockOnAddItem = jest.fn();
    const mockOnRemoveItem = jest.fn();

    it("renders lists of added medications and triggers add/delete actions", () => {
      render(
        <PrescriptionBuilder
          items={items}
          onAddItem={mockOnAddItem}
          onRemoveItem={mockOnRemoveItem}
        />
      );

      // Verify item list displays
      expect(screen.getByText("Paracetamol 500mg")).toBeInTheDocument();
      expect(screen.getByText(/1 viên — 1 viên \/ ngày — 5 ngày/)).toBeInTheDocument();

      // Trigger add
      const input = screen.getByPlaceholderText("Nhập tên thuốc...");
      fireEvent.change(input, { target: { value: "Amoxicillin 500mg" } });

      const addBtn = screen.getByRole("button", { name: "Thêm vào đơn" });
      fireEvent.click(addBtn);

      expect(mockOnAddItem).toHaveBeenCalledWith({
        name: "Amoxicillin 500mg",
        dosage: "Tiêu chuẩn",
        frequency: "1 viên / ngày",
        duration: "5 ngày",
      });

      // Trigger delete
      const removeBtn = screen.getByRole("button", { name: "Xóa" });
      fireEvent.click(removeBtn);
      expect(mockOnRemoveItem).toHaveBeenCalledWith("MED-1");
    });
  });
});
