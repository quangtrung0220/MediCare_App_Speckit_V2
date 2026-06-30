/*
 * Created: 2026-06-24
 * Purpose: Patient entity — clinical subject and billing recipient.
 * Owner: Quang Trung
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EncryptionTransformer } from '../database/transformers/encryption.transformer';

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  userId: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 10 })
  dateOfBirth: string;

  @Column({ type: 'varchar', length: 10 })
  gender: string;

  @Column({ type: 'text', nullable: true, transformer: new EncryptionTransformer() })
  phone: string | null;

  @Column({ type: 'text', nullable: true, transformer: new EncryptionTransformer() })
  address: string | null;

  @Column({ type: 'varchar', length: 5, nullable: true })
  bloodType: string | null;

  @Column({ type: 'text', nullable: true })
  allergies: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContact: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insuranceNumber: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;
}
