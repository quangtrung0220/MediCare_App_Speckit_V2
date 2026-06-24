/*
 * Created: 2026-06-24
 * Purpose: Reusable render wrapper that provides common test context (router, etc.).
 * Owner: Quang Trung
 */
import React, { type ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";

/**
 * Custom render function that wraps components in common providers.
 * Extend with additional providers (theme, auth context, etc.) as needed.
 */
function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export { renderWithProviders };
export { screen, waitFor, act, fireEvent } from "@testing-library/react";
