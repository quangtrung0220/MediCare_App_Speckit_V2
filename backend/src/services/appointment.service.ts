/*
 * Created: 2026-06-24
 * Purpose: Appointment business service layer with conflict detection (T029).
 * Updated: 2026-07-03 — Added real-time SSE notification hooks (T068).
 * Owner: Quang Trung
 */
import { Injectable, Inject, NotFoundException, ConflictException, Optional } from '@nestjs/common';
import { APPOINTMENT_REPOSITORY } from './contracts';
import type { IAppointmentRepository } from './contracts';
import { Appointment } from '../models/appointment.entity';
import { CreateAppointmentDto } from '../appointment/dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../appointment/dto/update-appointment.dto';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class AppointmentService {
  constructor(
    @Inject(APPOINTMENT_REPOSITORY)
    private readonly appointmentRepo: IAppointmentRepository,
    @Optional()
    private readonly notificationService?: NotificationService,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Appointment[]> {
    return this.appointmentRepo.findAll(options);
  }

  async findById(id: string): Promise<Appointment> {
    const apt = await this.appointmentRepo.findById(id);
    if (!apt) throw new NotFoundException(`Appointment ${id} not found`);
    return apt;
  }

  async create(data: CreateAppointmentDto): Promise<Appointment> {
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
    const created = await this.appointmentRepo.create(data);

    // 🔔 Notify receptionist and doctors of a new booking
    this.notificationService?.emit({
      event: 'appointment.new',
      title: 'Lịch hẹn mới',
      message: `Lịch hẹn ngày ${data.appointmentDate} lúc ${data.appointmentTime ?? '?'} vừa được đặt.`,
      severity: 'info',
      targetRoles: ['DOCTOR', 'RECEPTIONIST'],
      meta: { appointmentId: created.id, doctorId: data.doctorId },
    });

    return created;
  }

  async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    const updated = await this.appointmentRepo.update(id, data);
    if (!updated) throw new NotFoundException(`Appointment ${id} not found`);

    // 🔔 Notify doctor when patient checks in
    if (data.status === 'CHECKED_IN') {
      this.notificationService?.emit({
        event: 'appointment.checked_in',
        title: 'Bệnh nhân đã đến',
        message: `Bệnh nhân của lịch hẹn #${id.slice(0, 8)} đã check-in, sẵn sàng khám.`,
        severity: 'warning',
        targetRoles: ['DOCTOR', 'NURSE'],
        meta: { appointmentId: id },
      });
    }

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

  async restore(id: string): Promise<void> {
    if (!this.appointmentRepo.restore) {
      throw new Error('Restore method not supported on Appointment Repository');
    }
    const restored = await this.appointmentRepo.restore(id);
    if (!restored) throw new NotFoundException(`Appointment ${id} not found`);
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
