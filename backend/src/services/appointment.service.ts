/*
 * Created: 2026-06-24
 * Purpose: Appointment business service layer with conflict detection (T029).
 * Owner: Quang Trung
 */
import { Injectable, Inject, NotFoundException, ConflictException } from '@nestjs/common';
import { APPOINTMENT_REPOSITORY } from './contracts';
import type { IAppointmentRepository } from './contracts';
import { Appointment } from '../models/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Appointment[]> {
    return this.appointmentRepo.findAll(options);
  }

  async findById(id: string): Promise<Appointment> {
    const apt = await this.appointmentRepo.findById(id);
    if (!apt) throw new NotFoundException(`Appointment ${id} not found`);
    return apt;
  }

  async create(data: Partial<Appointment>): Promise<Appointment> {
    // Check for conflicting appointments
    if (data.doctorId && data.appointmentDate && data.appointmentTime) {
      const conflict = await this.appointmentRepo.findConflicting(
        data.doctorId,
        data.appointmentDate,
        data.appointmentTime,
        data.durationMinutes ?? 30,
      );
      if (conflict) {
        throw new ConflictException('Time slot is already booked');
      }
    }
    return this.appointmentRepo.create(data);
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const updated = await this.appointmentRepo.update(id, data);
    if (!updated) throw new NotFoundException(`Appointment ${id} not found`);
    return updated;
  }

  async cancel(id: string): Promise<Appointment> {
    const apt = await this.findById(id);
    if (apt.status === 'CANCELLED') {
      throw new ConflictException('Appointment is already cancelled');
    }
    return this.appointmentRepo.update(id, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    }) as Promise<Appointment>;
  }

  async complete(id: string): Promise<Appointment> {
    const apt = await this.findById(id);
    if (apt.status !== 'SCHEDULED') {
      throw new ConflictException(`Cannot complete appointment with status ${apt.status}`);
    }
    return this.appointmentRepo.update(id, {
      status: 'COMPLETED',
    }) as Promise<Appointment>;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.appointmentRepo.delete(id);
    if (!deleted) throw new NotFoundException(`Appointment ${id} not found`);
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return this.appointmentRepo.findByPatientId(patientId);
  }

  async findByDoctor(doctorId: string): Promise<Appointment[]> {
    return this.appointmentRepo.findByDoctorId(doctorId);
  }

  async count(): Promise<number> {
    return this.appointmentRepo.count();
  }
}
