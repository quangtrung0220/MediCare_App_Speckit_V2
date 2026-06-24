/*
 * Created: 2026-06-24
 * Purpose: Appointment entity — reservable clinical encounter slot.
 * Owner: Quang Trung
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

export type AppointmentStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
export type AppointmentType = 'CONSULTATION' | 'FOLLOW_UP' | 'EMERGENCY' | 'ROUTINE';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  patientId: string;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient: Patient;

  @Column({ type: 'varchar' })
  doctorId: string;

  @ManyToOne(() => Doctor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  /** ISO date string, e.g. "2026-07-01" */
  @Column({ type: 'varchar', length: 10 })
  appointmentDate: string;

  /** HH:mm format, e.g. "09:00" */
  @Column({ type: 'varchar', length: 5 })
  appointmentTime: string;

  @Column({ type: 'integer', default: 30 })
  durationMinutes: number;

  @Column({ type: 'varchar', length: 20, default: 'CONSULTATION' })
  type: AppointmentType;

  @Column({ type: 'varchar', length: 20, default: 'SCHEDULED' })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'boolean', default: false })
  reminderSent: boolean;

  @Column({ type: 'varchar', nullable: true })
  reminderSentAt: string | null;

  @Column({ type: 'varchar', nullable: true })
  cancelledAt: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
