/*
 * Created: 2026-06-24
 * Purpose: Patient-specific repository interface.
 * Owner: Quang Trung
 */
import { Patient } from '../../models/patient.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IPatientRepository extends IBaseRepository<Patient> {
  findByUserId(userId: string): Promise<Patient | null>;
  findByPhone(phone: string): Promise<Patient | null>;
  search(query: string): Promise<Patient[]>;
}

export const PATIENT_REPOSITORY = Symbol('IPatientRepository');
