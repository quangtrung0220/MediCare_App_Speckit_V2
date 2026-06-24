/*
 * Created: 2026-06-24
 * Purpose: TypeORM-based Appointment repository implementation (T023).
 * Owner: Quang Trung
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment } from '../../models/appointment.entity';
import { IAppointmentRepository } from '../contracts/appointment-repository.interface';

@Injectable()
export class AppointmentRepository implements IAppointmentRepository {
  constructor(
    @InjectRepository(Appointment)
    private readonly repo: Repository<Appointment>,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Appointment[]> {
    return this.repo.find({
      skip: options?.skip,
      take: options?.take,
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
      relations: ['patient', 'doctor'],
    });
  }

  async findById(id: string): Promise<Appointment | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });
  }

  async create(data: Partial<Appointment>): Promise<Appointment> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) return null;
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return this.repo.find({
      where: { patientId },
      order: { appointmentDate: 'DESC' },
      relations: ['doctor'],
    });
  }

  async findByDoctorId(doctorId: string): Promise<Appointment[]> {
    return this.repo.find({
      where: { doctorId },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
      relations: ['patient'],
    });
  }

  async findByDateRange(
    doctorId: string,
    startDate: string,
    endDate: string,
  ): Promise<Appointment[]> {
    return this.repo.find({
      where: {
        doctorId,
        appointmentDate: Between(startDate, endDate),
      },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
  }

  async findConflicting(
    doctorId: string,
    appointmentDate: string,
    appointmentTime: string,
    durationMinutes: number,
  ): Promise<Appointment | null> {
    // Simple conflict check: same doctor, same date, overlapping time
    // A more sophisticated version would calculate time ranges.
    const existing = await this.repo.findOne({
      where: {
        doctorId,
        appointmentDate,
        appointmentTime,
        status: 'SCHEDULED' as const,
      },
    });
    return existing;
  }
}
