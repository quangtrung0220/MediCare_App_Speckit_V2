import { screen } from "@testing-library/react";
import PatientsPage from "../../app/patients/page";
import { usePatients } from "@/hooks/usePatients";
import { renderWithProviders } from "../utils/renderWithProviders";
import { buildPatients } from "../utils/testData";

jest.mock("@/hooks/usePatients", () => ({
  usePatients: jest.fn(),
}));

const mockedUsePatients = jest.mocked(usePatients);

describe("PatientsPage", () => {
  beforeEach(() => {
    mockedUsePatients.mockReset();
  });

  it("shows the loading state", () => {
    mockedUsePatients.mockReturnValue({
      patients: [],
      isLoading: true,
      error: null,
      total: 0,
    });

    renderWithProviders(<PatientsPage />);

    expect(screen.getByText("Đang tải danh sách bệnh nhân...")).toBeInTheDocument();
  });

  it("shows the empty state", () => {
    mockedUsePatients.mockReturnValue({
      patients: [],
      isLoading: false,
      error: null,
      total: 0,
    });

    renderWithProviders(<PatientsPage />);

    expect(screen.getByRole("heading", { level: 3, name: "Không có bệnh nhân" })).toBeInTheDocument();
    expect(screen.getByText("Hiện chưa có bệnh nhân nào trong hệ thống.")).toBeInTheDocument();
  });

  it("renders patient rows", () => {
    const patients = buildPatients();

    mockedUsePatients.mockReturnValue({
      patients,
      isLoading: false,
      error: null,
      total: patients.length,
    });

    renderWithProviders(<PatientsPage />);

    expect(screen.getByText("Tổng cộng: 2 bệnh nhân")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
    expect(screen.getByText("Lần khám cuối: 2026-04-28")).toBeInTheDocument();
    expect(screen.getByText("Chưa khám")).toBeInTheDocument();
  });
});