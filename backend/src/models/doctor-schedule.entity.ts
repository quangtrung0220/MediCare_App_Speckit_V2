/*
 * Created: 2026-06-24
 * Purpose: DoctorSchedule entity — defines available booking windows per doctor.
 * Owner: Quang Trung
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Doctor } from './doctor.entity';

@Entity('doctor_schedules')
export class DoctorSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.schedules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctor;

  /** 0 = Sunday, 1 = Monday, ..., 6 = Saturday */
  @Column({ type: 'integer' })
  dayOfWeek: number;

  /** HH:mm format, e.g. "08:00" */
  @Column({ type: 'varchar', length: 5 })
  startTime: string;

  /** HH:mm format, e.g. "17:00" */
  @Column({ type: 'varchar', length: 5 })
  endTime: string;

  /** Slot duration in minutes, e.g. 30 */
  @Column({ type: 'integer', default: 30 })
  durationMinutes: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
