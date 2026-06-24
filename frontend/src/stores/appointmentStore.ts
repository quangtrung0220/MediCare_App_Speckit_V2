/*
 * Created: 2026-06-24
 * Purpose: Booking state store for selected doctor, slot, and confirmation (T017).
 * Owner: Quang Trung
 */
"use client";

import { useState, useCallback } from 'react';
import type { DoctorSummary, TimeSlot, BookingConfirmation } from '@/types/booking';
import {
  fetchDoctors,
  fetchTimeSlots,
  createBooking,
} from '@/services/appointment.service';

export type BookingStep = 'SELECT_DOCTOR' | 'SELECT_SLOT' | 'CONFIRM' | 'DONE';

export interface BookingState {
  step: BookingStep;
  doctors: DoctorSummary[];
  selectedDoctor: DoctorSummary | null;
  selectedDate: string;
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  confirmation: BookingConfirmation | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  step: 'SELECT_DOCTOR',
  doctors: [],
  selectedDoctor: null,
  selectedDate: new Date().toISOString().slice(0, 10),
  timeSlots: [],
  selectedTime: null,
  confirmation: null,
  isLoading: false,
  error: null,
};

export function useBookingStore() {
  const [state, setState] = useState<BookingState>(initialState);

  const loadDoctors = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const doctors = await fetchDoctors();
      setState((s) => ({ ...s, doctors, isLoading: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Lỗi tải danh sách bác sĩ',
      }));
    }
  }, []);

  const selectDoctor = useCallback(async (doctor: DoctorSummary, date?: string) => {
    const targetDate = date ?? state.selectedDate;
    setState((s) => ({
      ...s,
      selectedDoctor: doctor,
      selectedDate: targetDate,
      step: 'SELECT_SLOT',
      isLoading: true,
      error: null,
    }));
    try {
      const timeSlots = await fetchTimeSlots(doctor.id, targetDate);
      setState((s) => ({ ...s, timeSlots, isLoading: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Lỗi tải lịch khám',
      }));
    }
  }, [state.selectedDate]);

  const changeDate = useCallback(async (date: string) => {
    if (!state.selectedDoctor) return;
    setState((s) => ({ ...s, selectedDate: date, isLoading: true, error: null }));
    try {
      const timeSlots = await fetchTimeSlots(state.selectedDoctor.id, date);
      setState((s) => ({ ...s, timeSlots, isLoading: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Lỗi tải lịch khám',
      }));
    }
  }, [state.selectedDoctor]);

  const selectTime = useCallback((time: string) => {
    setState((s) => ({ ...s, selectedTime: time, step: 'CONFIRM' }));
  }, []);

  const confirmBooking = useCallback(async () => {
    if (!state.selectedDoctor || !state.selectedTime) return;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const confirmation = await createBooking(
        state.selectedDoctor.id,
        state.selectedDate,
        state.selectedTime,
      );
      setState((s) => ({ ...s, confirmation, step: 'DONE', isLoading: false }));
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Lỗi đặt lịch',
      }));
    }
  }, [state.selectedDoctor, state.selectedDate, state.selectedTime]);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const goBack = useCallback(() => {
    setState((s) => {
      switch (s.step) {
        case 'SELECT_SLOT':
          return { ...s, step: 'SELECT_DOCTOR', selectedDoctor: null, timeSlots: [] };
        case 'CONFIRM':
          return { ...s, step: 'SELECT_SLOT', selectedTime: null };
        default:
          return s;
      }
    });
  }, []);

  return {
    ...state,
    loadDoctors,
    selectDoctor,
    changeDate,
    selectTime,
    confirmBooking,
    reset,
    goBack,
  };
}
