/*
 * Created: 2026-06-24
 * Purpose: Prescription entity — medication order generated from clinical care.
 * Owner: Quang Trung
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { MedicalRecord } from './medical-record.entity';
import { PrescriptionItem } from './prescription-item.entity';

export type PrescriptionStatus = 'PENDING' | 'DISPENSED' | 'COMPLETED' | 'CANCELLED';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  medicalRecordId: string;

  @ManyToOne(() => MedicalRecord, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'medicalRecordId' })
  medicalRecord: MedicalRecord;

  @Column({ type: 'varchar', length: 10 })
  prescribedDate: string;

  @Column({ type: 'varchar', length: 20, default: 'PENDING' })
  status: PrescriptionStatus;

  @Column({ type: 'text', nullable: true })
  instructions: string | null;

  @Column({ type: 'boolean', default: false })
  refillable: boolean;

  @Column({ type: 'integer', default: 0 })
  refillsRemaining: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  expiryDate: string | null;

  @OneToMany(() => PrescriptionItem, (item) => item.prescription)
  items: PrescriptionItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
