import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { DoctorCard } from "@/components/booking/DoctorCard";
import { TimeSlotPicker } from "@/components/booking/TimeSlotPicker";
import { ConfirmPreview, BookingSuccess } from "@/components/booking/BookingConfirmation";
import type { DoctorSummary, TimeSlot, BookingConfirmation } from "@/types/booking";

describe("Booking Components", () => {
  const mockDoctor: DoctorSummary = {
    id: "DOC-001",
    firstName: "Minh",
    lastName: "Nguyễn",
    specialization: "Nội khoa",
    consultationFee: 200000,
    isAvailable: true,
  };

  describe("DoctorCard", () => {
    it("renders doctor info and triggers select callback", () => {
      const handleSelect = jest.fn();
      render(<DoctorCard doctor={mockDoctor} onSelect={handleSelect} />);

      expect(screen.getByText("Dr. Nguyễn Minh")).toBeInTheDocument();
      expect(screen.getByText("Nội khoa")).toBeInTheDocument();
      expect(screen.getByText(/200.000/)).toBeInTheDocument();

      const card = screen.getByRole("button");
      fireEvent.click(card);
      expect(handleSelect).toHaveBeenCalledWith(mockDoctor);
    });
  });

  describe("TimeSlotPicker", () => {
    const slots: TimeSlot[] = [
      { time: "08:00", available: true },
      { time: "08:30", available: false },
    ];

    it("renders available and disabled slots", () => {
      const handleSelect = jest.fn();
      const handleDateChange = jest.fn();

      render(
        <TimeSlotPicker
          slots={slots}
          selectedTime={null}
          onSelect={handleSelect}
          date="2026-06-25"
          onDateChange={handleDateChange}
        />
      );

      const openSlot = screen.getByRole("button", { name: "08:00" });
      const closedSlot = screen.getByRole("button", { name: "08:30" });

      expect(openSlot).toBeEnabled();
      expect(closedSlot).toBeDisabled();

      fireEvent.click(openSlot);
      expect(handleSelect).toHaveBeenCalledWith("08:00");
    });
  });

  describe("ConfirmPreview & BookingSuccess", () => {
    it("renders confirmation preview and registers submit actions", () => {
      const handleConfirm = jest.fn();
      const handleBack = jest.fn();

      render(
        <ConfirmPreview
          doctorName="Bác sĩ Nguyễn Minh"
          date="2026-06-25"
          time="08:00"
          onConfirm={handleConfirm}
          onBack={handleBack}
          isLoading={false}
        />
      );

      expect(screen.getByText("Xác nhận lịch hẹn")).toBeInTheDocument();
      expect(screen.getByText("Bác sĩ Nguyễn Minh")).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "Xác nhận đặt lịch" });
      fireEvent.click(confirmBtn);
      expect(handleConfirm).toHaveBeenCalled();
    });

    it("renders booking success card with status information", () => {
      const confirmation: BookingConfirmation = {
        appointmentId: "APT-0001",
        doctorName: "Bác sĩ Nguyễn Minh",
        date: "2026-06-25",
        time: "08:00",
        status: "CONFIRMED",
        reminderStatus: "PENDING",
      };
      const handleNewBooking = jest.fn();

      render(
        <BookingSuccess
          confirmation={confirmation}
          onNewBooking={handleNewBooking}
        />
      );

      expect(screen.getByText("Đặt lịch thành công!")).toBeInTheDocument();
      expect(screen.getByText("APT-0001")).toBeInTheDocument();
      expect(screen.getByText("⏳ Sẽ gửi trước ngày khám")).toBeInTheDocument();
    });
  });
});
