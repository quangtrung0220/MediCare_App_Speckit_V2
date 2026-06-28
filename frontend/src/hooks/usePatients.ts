/*
 * Created: 2026-05-03
 * Updated: 2026-05-03
 * Purpose: Hook for managing patient list state, loading, and error handling.
 * Owner: Quang Trung
 */
"use client";

import { useEffect, useState } from "react";
import type { PatientRecord } from "@/services/patient.mock";
import { fetchPatients } from "@/services/patient.mock";

export interface UsePatientsState {
  patients: PatientRecord[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

export function usePatients() {
  const [state, setState] = useState<UsePatientsState>({
    patients: [],
    isLoading: true,
    error: null,
    total: 0,
  });

  const loadPatients = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const { patients, total } = await fetchPatients();

      setState({
        patients,
        total,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định",
      }));
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  return {
    ...state,
    refetch: loadPatients,
  };
}
