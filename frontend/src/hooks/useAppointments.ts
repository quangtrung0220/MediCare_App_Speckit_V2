/*
 * Created: 2026-06-24
 * Purpose: Custom hook for retrieving patient appointments list (T009).
 * Owner: Quang Trung
 */
"use client";

import { useState, useCallback, useEffect } from 'react';
import { fetchAppointments } from '@/services/appointment.service';
import type { PatientAppointment } from '@/services/appointment.service';

export function useAppointments() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAppointments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi tải danh sách lịch hẹn');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  return {
    appointments,
    isLoading,
    error,
    refresh: loadAppointments,
  };
}
