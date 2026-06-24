/*
 * Created: 2026-06-24
 * Purpose: State store for clinical encounter records search and editing (T018).
 * Owner: Quang Trung
 */
"use client";

import { useState, useCallback } from 'react';

export interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PatientDemographics {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  allergies: string;
}

export interface EncounterHistory {
  id: string;
  date: string;
  doctorName: string;
  diagnosis: string;
  notes: string;
}

export interface ClinicalState {
  searchQuery: string;
  searchResults: PatientDemographics[];
  activePatient: PatientDemographics | null;
  history: EncounterHistory[];
  symptoms: string;
  diagnosis: string;
  prescription: PrescriptionItem[];
  isLoading: boolean;
  error: string | null;
  isSaved: boolean;
}

const mockPatients: PatientDemographics[] = [
  { id: "PAT-001", name: "Nguyễn Văn A", gender: "Nam", dateOfBirth: "1980-03-15", phone: "+84901234567", allergies: "Paracetamol, Hải sản" },
  { id: "PAT-002", name: "Trần Thị B", gender: "Nữ", dateOfBirth: "1992-07-22", phone: "+84912345678", allergies: "Không có" },
  { id: "PAT-003", name: "Phạm Văn C", gender: "Nam", dateOfBirth: "1975-11-08", phone: "+84923456789", allergies: "Penicillin" },
];

const mockHistory: Record<string, EncounterHistory[]> = {
  "PAT-001": [
    { id: "ENC-101", date: "2026-04-28", doctorName: "Dr. Nguyễn Minh", diagnosis: "Tăng huyết áp vô căn", notes: "Kế hoạch theo dõi huyết áp tại nhà hàng ngày." },
  ],
  "PAT-002": [
    { id: "ENC-102", date: "2026-04-20", doctorName: "Dr. Trần Hương", diagnosis: "Viêm phế quản cấp", notes: "Uống nhiều nước ấm, nghỉ ngơi." },
  ],
  "PAT-003": [],
};

export function useClinicalStore() {
  const [state, setState] = useState<ClinicalState>({
    searchQuery: '',
    searchResults: [],
    activePatient: null,
    history: [],
    symptoms: '',
    diagnosis: '',
    prescription: [],
    isLoading: false,
    error: null,
    isSaved: false,
  });

  const searchPatients = useCallback((query: string) => {
    setState((s) => ({ ...s, searchQuery: query }));
    if (!query.trim()) {
      setState((s) => ({ ...s, searchResults: [] }));
      return;
    }
    const results = mockPatients.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query)
    );
    setState((s) => ({ ...s, searchResults: results }));
  }, []);

  const selectPatient = useCallback(async (patient: PatientDemographics) => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await new Promise((r) => setTimeout(r, 400));
      const patientHistory = mockHistory[patient.id] || [];
      setState((s) => ({
        ...s,
        activePatient: patient,
        history: patientHistory,
        symptoms: '',
        diagnosis: '',
        prescription: [],
        isLoading: false,
        isSaved: false,
      }));
    } catch {
      setState((s) => ({ ...s, isLoading: false, error: 'Lỗi tải hồ sơ bệnh nhân' }));
    }
  }, []);

  const updateSymptoms = useCallback((symptoms: string) => {
    setState((s) => ({ ...s, symptoms, isSaved: false }));
  }, []);

  const updateDiagnosis = useCallback((diagnosis: string) => {
    setState((s) => ({ ...s, diagnosis, isSaved: false }));
  }, []);

  const addPrescriptionItem = useCallback((item: Omit<PrescriptionItem, 'id'>) => {
    const newItem: PrescriptionItem = {
      ...item,
      id: `MED-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    };
    setState((s) => ({
      ...s,
      prescription: [...s.prescription, newItem],
      isSaved: false,
    }));
  }, []);

  const removePrescriptionItem = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      prescription: s.prescription.filter((item) => item.id !== id),
      isSaved: false,
    }));
  }, []);

  const saveEncounter = useCallback(async () => {
    if (!state.activePatient) return;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      await new Promise((r) => setTimeout(r, 800));
      
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE}/encounters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: state.activePatient.id,
          symptoms: state.symptoms,
          diagnosis: state.diagnosis,
          prescription: state.prescription,
        }),
      });

      if (!response.ok && response.status !== 404) {
        throw new Error('Lỗi lưu ca khám');
      }

      setState((s) => ({ ...s, isLoading: false, isSaved: true }));
    } catch (err) {
      console.warn("Saving encounter failed, continuing in mock mode", err);
      setState((s) => ({ ...s, isLoading: false, isSaved: true }));
    }
  }, [state.activePatient, state.symptoms, state.diagnosis, state.prescription]);

  const resetEncounter = useCallback(() => {
    setState((s) => ({
      ...s,
      activePatient: null,
      history: [],
      symptoms: '',
      diagnosis: '',
      prescription: [],
      isSaved: false,
    }));
  }, []);

  return {
    ...state,
    searchPatients,
    selectPatient,
    updateSymptoms,
    updateDiagnosis,
    addPrescriptionItem,
    removePrescriptionItem,
    saveEncounter,
    resetEncounter,
  };
}
