import { fireEvent, screen } from "@testing-library/react";
import PatientListRow from "@/components/patient/PatientListRow";
import { renderWithProviders } from "../utils/renderWithProviders";
import { buildPatient } from "../utils/testData";

describe("PatientListRow", () => {
  it("renders patient summary and calls click handler", () => {
    const onClick = jest.fn();

    renderWithProviders(<PatientListRow patient={buildPatient()} onClick={onClick} />);

    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("+84901234567 • nguyena@example.com")).toBeInTheDocument();
    expect(screen.getByText("Lần khám cuối: 2026-04-28")).toBeInTheDocument();
    expect(onClick).toHaveBeenCalledWith("PAT-001");
  });

  it("shows the fallback text when the patient has no last visit", () => {
    renderWithProviders(<PatientListRow patient={buildPatient({ id: "PAT-002", name: "Trần Thị B", dateOfBirth: "1992-07-22", gender: "F", phone: "+84912345678", email: "tranb@example.com", lastVisit: undefined })} />);

    expect(screen.getByText("Chưa khám")).toBeInTheDocument();
  });
});