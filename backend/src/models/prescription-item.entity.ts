/*
 * Created: 2026-06-24
 * Purpose: PrescriptionItem entity — line item for medication and dosage.
 * Owner: Quang Trung
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Prescription } from './prescription.entity';
import { InventoryItem } from './inventory-item.entity';

@Entity('prescription_items')
export class PrescriptionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  prescriptionId: string;

  @ManyToOne(() => Prescription, (rx) => rx.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'prescriptionId' })
  prescription: Prescription;

  @Column({ type: 'varchar', nullable: true })
  inventoryItemId: string | null;

  @ManyToOne(() => InventoryItem, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'inventoryItemId' })
  inventoryItem: InventoryItem | null;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'varchar', length: 20, default: 'tablet' })
  unit: string;

  @Column({ type: 'varchar', length: 100 })
  dosage: string;

  @Column({ type: 'varchar', length: 100 })
  frequency: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  duration: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;
}
