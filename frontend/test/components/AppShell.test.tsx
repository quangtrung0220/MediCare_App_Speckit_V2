import React from "react";
import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/layout/AppShell";
import { SidebarNav } from "@/components/layout/SidebarNav";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/book-appointment",
}));

describe("AppShell and SidebarNav", () => {
  it("renders the sidebar and main workspace header with children", () => {
    render(
      <AppShell>
        <div data-testid="child-element">Hello Workspace</div>
      </AppShell>
    );

    // Verify brand title
    expect(screen.getByText("MediCare")).toBeInTheDocument();
    
    // Verify child content is rendered
    expect(screen.getByTestId("child-element")).toHaveTextContent("Hello Workspace");
  });

  it("highlights the active navigation link based on path", () => {
    render(<SidebarNav />);

    // Get the active navlink element (based on mocked usePathname returning "/book-appointment")
    const bookAppointmentLink = screen.getByRole("link", { name: "✍️ Book Appointment" });
    expect(bookAppointmentLink).toBeInTheDocument();
    expect(bookAppointmentLink).toHaveClass("active");

    const overviewLink = screen.getByRole("link", { name: "🏥 Overview" });
    expect(overviewLink).toBeInTheDocument();
    expect(overviewLink).not.toHaveClass("active");
  });
});
