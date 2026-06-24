import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PatientPage from "../../app/patient/page";
import AppointmentsPage from "../../app/appointments/page";
import MedicalRecordsPage from "../../app/medical-records/page";
import PrescriptionsPage from "../../app/prescriptions/page";
import HomePage from "../../app/page";

describe("New GUI Pages Tests", () => {
  describe("HomePage (Overview)", () => {
    it("renders clinic metrics, appointments queue and activity logs", () => {
      render(<HomePage />);
      expect(screen.getByText(/Chào mừng quay trở lại/)).toBeInTheDocument();
      
      const metrics = screen.getAllByTestId("overview-metric");
      expect(metrics.length).toBe(4);

      const appointments = screen.getAllByTestId("overview-apt");
      expect(appointments.length).toBe(2);

      const logs = screen.getAllByTestId("overview-log");
      expect(logs.length).toBe(3);
    });
  });

  describe("PatientPage", () => {
    it("renders profile summary and actions correctly", () => {
      render(<PatientPage />);
      expect(screen.getByText("Cổng thông tin bệnh nhân (Patient Portal)")).toBeInTheDocument();
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Nhóm máu:")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Đặt lịch khám Chọn bác sĩ, giờ khám và đăng ký lịch khám mới." })).toBeInTheDocument();
    });
  });

  describe("AppointmentsPage", () => {
    it("renders appointments list and allows cancelling an appointment", () => {
      render(<AppointmentsPage />);
      expect(screen.getByText("Danh sách lịch hẹn phòng khám (Appointments)")).toBeInTheDocument();
      
      const rows = screen.getAllByTestId("appointment-row");
      expect(rows.length).toBe(4);

      // Trigger cancel action on first row
      const cancelBtns = screen.getAllByRole("button", { name: "Hủy hẹn" });
      fireEvent.click(cancelBtns[0]);

      // Expect status to become Cancelled ("Đã hủy")
      expect(screen.getAllByText("Đã hủy")[1]).toBeInTheDocument();
    });
  });

  describe("MedicalRecordsPage", () => {
    it("renders medical records data rows and supports search filtering", () => {
      render(<MedicalRecordsPage />);
      expect(screen.getByText("Hồ sơ bệnh án điện tử (Medical Records)")).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText("Tìm theo bệnh nhân, chẩn đoán hoặc mã hồ sơ...");
      fireEvent.change(searchInput, { target: { value: "Viêm họng cấp" } });

      const filteredRows = screen.getAllByTestId("record-row");
      expect(filteredRows.length).toBe(1);
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
    });
  });

  describe("PrescriptionsPage", () => {
    it("renders prescriptions table data rows and supports search filtering", () => {
      render(<PrescriptionsPage />);
      expect(screen.getByText("Danh sách đơn thuốc phòng khám (Prescriptions)")).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText("Tìm kiếm đơn thuốc theo bệnh nhân hoặc mã đơn...");
      fireEvent.change(searchInput, { target: { value: "RX-503" } });

      const filteredRows = screen.getAllByTestId("prescription-row");
      expect(filteredRows.length).toBe(1);
      expect(screen.getByText("Phạm Văn C")).toBeInTheDocument();
    });
  });
});
