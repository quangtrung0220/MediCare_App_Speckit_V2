/*
 * Created: 2026-06-24
 * Purpose: Doctor-specific repository interface.
 * Owner: Quang Trung
 */
import { Doctor } from '../../models/doctor.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IDoctorRepository extends IBaseRepository<Doctor> {
  findByUserId(userId: string): Promise<Doctor | null>;
  findBySpecialization(specialization: string): Promise<Doctor[]>;
  findAvailable(): Promise<Doctor[]>;
}

export const DOCTOR_REPOSITORY = Symbol('IDoctorRepository');
