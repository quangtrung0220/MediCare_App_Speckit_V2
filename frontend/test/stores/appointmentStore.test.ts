import { renderHook, act } from "@testing-library/react";
import { useBookingStore } from "@/stores/appointmentStore";
import * as service from "@/services/appointment.service";

jest.mock("@/services/appointment.service", () => ({
  fetchDoctors: jest.fn(),
  fetchTimeSlots: jest.fn(),
  createBooking: jest.fn(),
}));

describe("useBookingStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes with correct defaults", () => {
    const { result } = renderHook(() => useBookingStore());
    expect(result.current.step).toBe("SELECT_DOCTOR");
    expect(result.current.doctors).toEqual([]);
    expect(result.current.selectedDoctor).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("handles loading doctors successfully", async () => {
    const mockDoctors = [
      { id: "DOC-001", firstName: "Minh", lastName: "Nguyễn", specialization: "Nội khoa", consultationFee: 200000, isAvailable: true }
    ];
    (service.fetchDoctors as jest.Mock).mockResolvedValue(mockDoctors);

    const { result } = renderHook(() => useBookingStore());

    await act(async () => {
      await result.current.loadDoctors();
    });

    expect(result.current.doctors).toEqual(mockDoctors);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("supports selecting doctor and fetching slots", async () => {
    const mockDoctor = { id: "DOC-001", firstName: "Minh", lastName: "Nguyễn", specialization: "Nội khoa", consultationFee: 200000, isAvailable: true };
    const mockSlots = [{ time: "09:00", available: true }];
    (service.fetchTimeSlots as jest.Mock).mockResolvedValue(mockSlots);

    const { result } = renderHook(() => useBookingStore());

    await act(async () => {
      await result.current.selectDoctor(mockDoctor);
    });

    expect(result.current.selectedDoctor).toEqual(mockDoctor);
    expect(result.current.timeSlots).toEqual(mockSlots);
    expect(result.current.step).toBe("SELECT_SLOT");
  });

  it("handles selecting slot, confirming booking, and resetting", async () => {
    const mockDoctor = { id: "DOC-001", firstName: "Minh", lastName: "Nguyễn", specialization: "Nội khoa", consultationFee: 200000, isAvailable: true };
    const mockConfirmation = {
      appointmentId: "APT-0001",
      doctorName: "Dr. Nguyễn Minh",
      date: "2026-06-25",
      time: "09:00",
      status: "CONFIRMED",
      reminderStatus: "PENDING",
    };
    (service.createBooking as jest.Mock).mockResolvedValue(mockConfirmation);

    const { result } = renderHook(() => useBookingStore());

    // Prepare doctor and date in store state manually/by trigger
    await act(async () => {
      result.current.selectTime("09:00");
    });
    expect(result.current.selectedTime).toBe("09:00");
    expect(result.current.step).toBe("CONFIRM");

    // Stub selectedDoctor in result
    act(() => {
      // simulate selection
      result.current.selectDoctor(mockDoctor);
    });

    await act(async () => {
      await result.current.confirmBooking();
    });

    expect(result.current.confirmation).toEqual(mockConfirmation);
    expect(result.current.step).toBe("DONE");

    // Reset store
    act(() => {
      result.current.reset();
    });
    expect(result.current.step).toBe("SELECT_DOCTOR");
  });
});
