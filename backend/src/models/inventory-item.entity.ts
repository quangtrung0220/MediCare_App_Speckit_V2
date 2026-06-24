/*
 * Created: 2026-06-24
 * Purpose: InventoryItem entity — managed stock unit for medicine/supplies.
 * Owner: Quang Trung
 */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 50, default: 'GENERAL' })
  category: string;

  @Column({ type: 'integer', default: 0 })
  quantity: number;

  @Column({ type: 'varchar', length: 20, default: 'unit' })
  unit: string;

  @Column({ type: 'integer', default: 0 })
  minQuantity: number;

  @Column({ type: 'integer', default: 1000 })
  maxQuantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  unitPrice: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  supplier: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  batchNumber: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  expiryDate: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  manufacturingDate: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
