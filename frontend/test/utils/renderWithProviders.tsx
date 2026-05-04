import type { ReactElement, ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

type ProviderWrapperProps = {
  children: ReactNode;
};

function ProviderWrapper({ children }: ProviderWrapperProps) {
  return <>{children}</>;
}

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: ProviderWrapper, ...options });
}