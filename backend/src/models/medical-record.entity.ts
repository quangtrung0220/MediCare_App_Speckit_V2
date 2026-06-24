/*
 * Created: 2026-06-24
 * Purpose: MedicalRecord entity — versioned clinical documentation for a visit.
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

@Entity('medical_records')
export class MedicalRecord {
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

  @Column({ type: 'varchar', nullable: true })
  appointmentId: string | null;

  @Column({ type: 'varchar', length: 10 })
  visitDate: string;

  @Column({ type: 'text', nullable: true })
  symptoms: string | null;

  @Column({ type: 'text', nullable: true })
  diagnosis: string | null;

  @Column({ type: 'text', nullable: true })
  treatment: string | null;

  @Column({ type: 'text', nullable: true })
  vitalSigns: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  followUpDate: string | null;

  @Column({ type: 'text', nullable: true })
  attachments: string | null;

  @Column({ type: 'boolean', default: false })
  isConfidential: boolean;

  @Column({ type: 'integer', default: 1 })
  version: number;

  @Column({ type: 'varchar', nullable: true })
  previousVersion: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
