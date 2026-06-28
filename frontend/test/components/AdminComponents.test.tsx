import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import BillingPage from "../../app/billing/page";
import ReportsPage from "../../app/reports/page";
import PrivacyPage from "../../app/profile/privacy/page";
import ReceptionistPage from "../../app/receptionist/page";
import PharmacistPage from "../../app/pharmacist/page";
import InventoryPage from "../../app/inventory/page";
import AdminPage from "../../app/admin/page";
import AuditPage from "../../app/audit/page";

describe("Admin & Utility Screens Tests", () => {
  describe("BillingPage", () => {
    it("renders invoice list and allows selecting an invoice to pay", () => {
      render(<BillingPage />);
      expect(screen.getByText("Hóa đơn & Thanh toán")).toBeInTheDocument();
      expect(screen.getAllByText("Nguyễn Văn An")[0]).toBeInTheDocument();

      // Click second invoice
      const bthItem = screen.getByText("Trần Thị Bình");
      fireEvent.click(bthItem);

      // Verify second invoice details loaded
      expect(screen.getByText("Chi tiết hóa đơn: INV-002")).toBeInTheDocument();
    });

    it("performs payment confirmation action", () => {
      render(<BillingPage />);
      const selectPayBtn = screen.getByRole("button", { name: "Xác nhận thanh toán" });
      fireEvent.click(selectPayBtn);

      expect(screen.getByText(/Hóa đơn này đã được thanh toán/)).toBeInTheDocument();
    });
  });

  describe("ReportsPage", () => {
    it("renders operational metric cards and date parameters", async () => {
      render(<ReportsPage />);
      expect(screen.getByText("Tổng số lượt khám hôm nay")).toBeInTheDocument();
      expect(screen.getByText("Trích xuất Báo cáo Định kỳ")).toBeInTheDocument();

      const selectBtn = screen.getByRole("button", { name: "📥 Tải Báo cáo PDF" });
      fireEvent.click(selectBtn);

      await waitFor(() => {
        expect(screen.getByText(/báo cáo định kỳ dạng PDF thành công/i)).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe("PrivacyPage", () => {
    it("allows exporting data download package and requesting deletion", () => {
      const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

      render(<PrivacyPage />);
      expect(screen.getByText(/Xuất dữ liệu cá nhân/)).toBeInTheDocument();

      const exportBtn = screen.getByRole("button", { name: "Xuất & Tải xuống (.JSON)" });
      fireEvent.click(exportBtn);

      expect(screen.getByText(/Gói tải xuống đã sẵn sàng/)).toBeInTheDocument();
      expect(clickSpy).toHaveBeenCalled();

      // Click delete button
      const deleteBtn = screen.getByRole("button", { name: "Gửi yêu cầu xóa tài khoản" });
      fireEvent.click(deleteBtn);

      expect(screen.getByText(/Yêu cầu xóa tài khoản đã được tiếp nhận/)).toBeInTheDocument();

      clickSpy.mockRestore();
    });
  });

  describe("ReceptionistPage", () => {
    it("renders receptionist check-in queue and triggers check-in button", async () => {
      render(<ReceptionistPage />);

      expect(screen.getByText("Quản lý lịch hẹn & Đón tiếp (Receptionist)")).toBeInTheDocument();
      
      // Wait for mock load
      const checkInBtn = await screen.findAllByRole("button", { name: "Check-in" });
      expect(checkInBtn[0]).toBeInTheDocument();
      fireEvent.click(checkInBtn[0]);
    });
  });

  describe("PharmacistPage", () => {
    it("renders pharmacist queue and triggers dispense button", async () => {
      render(<PharmacistPage />);

      expect(screen.getByText("Quầy cấp phát thuốc (Pharmacist Queue)")).toBeInTheDocument();
      
      const dispenseBtn = await screen.findAllByRole("button", { name: "Cấp phát" });
      expect(dispenseBtn[0]).toBeInTheDocument();
      fireEvent.click(dispenseBtn[0]);
    });
  });

  describe("InventoryPage", () => {
    it("renders stock levels grid table", async () => {
      render(<InventoryPage />);

      expect(screen.getByText("Quản lý kho dược phẩm (Inventory)")).toBeInTheDocument();
      
      const rows = await screen.findAllByTestId("inventory-row");
      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe("AdminPage", () => {
    it("renders users list and handles status activation", async () => {
      render(<AdminPage />);

      expect(screen.getByText("Quản trị hệ thống (Admin Settings)")).toBeInTheDocument();
      
      const activateBtn = await screen.findByRole("button", { name: "Kích hoạt" });
      fireEvent.click(activateBtn);
    });
  });

  describe("AuditPage", () => {
    it("renders security logs audit rows", () => {
      render(<AuditPage />);

      expect(screen.getByText("Nhật ký bảo mật & Kiểm toán (Audit Logs)")).toBeInTheDocument();
      expect(screen.getByText("READ_MEDICAL_RECORD")).toBeInTheDocument();
    });
  });
});

