import React from "react";
import { render, screen } from "@testing-library/react";
import MyAppointmentsPage from "../../app/my-appointments/page";
import { useAppointments } from "@/hooks/useAppointments";

jest.mock("@/hooks/useAppointments");

describe("MyAppointmentsPage", () => {
  const mockUseAppointments = useAppointments as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseAppointments.mockReturnValue({
      appointments: [],
      isLoading: true,
      error: null,
      refresh: jest.fn(),
    });

    render(<MyAppointmentsPage />);
    expect(screen.getByText("Đang tải danh sách lịch hẹn...")).toBeInTheDocument();
  });

  it("renders empty state when no appointments exist", () => {
    mockUseAppointments.mockReturnValue({
      appointments: [],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<MyAppointmentsPage />);
    expect(screen.getByText("Không có lịch hẹn")).toBeInTheDocument();
  });

  it("renders appointments table correctly", () => {
    mockUseAppointments.mockReturnValue({
      appointments: [
        {
          id: "APT-1111",
          doctorName: "Dr. Lê Hoàng",
          date: "2026-06-25",
          time: "09:30",
          fee: 300000,
          status: "SCHEDULED",
          reminderStatus: "PENDING",
        },
      ],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });

    render(<MyAppointmentsPage />);
    expect(screen.getByText("APT-1111")).toBeInTheDocument();
    expect(screen.getByText("Dr. Lê Hoàng")).toBeInTheDocument();
    expect(screen.getByText("2026-06-25")).toBeInTheDocument();
    expect(screen.getByText("09:30")).toBeInTheDocument();
    expect(screen.getByText("Đã hẹn")).toBeInTheDocument();
    expect(screen.getByText("Chờ gửi")).toBeInTheDocument();
  });
});
