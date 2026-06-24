/*
 * Created: 2026-06-24
 * Purpose: Appointment-specific repository interface.
 * Owner: Quang Trung
 */
import { Appointment } from '../../models/appointment.entity';
import { IBaseRepository } from './base-repository.interface';

export interface IAppointmentRepository extends IBaseRepository<Appointment> {
  findByPatientId(patientId: string): Promise<Appointment[]>;
  findByDoctorId(doctorId: string): Promise<Appointment[]>;
  findByDateRange(doctorId: string, startDate: string, endDate: string): Promise<Appointment[]>;
  findConflicting(
    doctorId: string,
    appointmentDate: string,
    appointmentTime: string,
    durationMinutes: number,
  ): Promise<Appointment | null>;
}

export const APPOINTMENT_REPOSITORY = Symbol('IAppointmentRepository');
