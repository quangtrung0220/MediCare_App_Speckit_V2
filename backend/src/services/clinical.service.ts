/*
 * Created: 2026-06-27
 * Purpose: Business service layer for clinical encounters, EMR records, and prescriptions (T002, T003).
 * Owner: Antigravity
 */
import { Injectable, NotFoundException, ConflictException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';
import { PrescriptionItem } from '../models/prescription-item.entity';
import { InventoryItem } from '../models/inventory-item.entity';
import { Appointment } from '../models/appointment.entity';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class ClinicalService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepo: Repository<MedicalRecord>,
    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,
    @InjectRepository(PrescriptionItem)
    private readonly prescriptionItemRepo: Repository<PrescriptionItem>,
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    private readonly dataSource: DataSource,
    @Optional()
    private readonly notificationService?: NotificationService,
  ) {}

  async createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    return this.dataSource.transaction(async (manager) => {
      const record = manager.create(MedicalRecord, {
        ...data,
        visitDate: data.visitDate || new Date().toISOString().split('T')[0],
        version: 1,
      });
      const saved = await manager.save(MedicalRecord, record);

      // If an appointment ID is associated, mark that appointment as COMPLETED
      if (data.appointmentId) {
        await manager.update(Appointment, data.appointmentId, { status: 'COMPLETED' });
      }

      return saved;
    });
  }

  async getPatientHistory(patientId: string): Promise<MedicalRecord[]> {
    return this.medicalRecordRepo.find({
      where: { patientId },
      order: { visitDate: 'DESC' },
      relations: { doctor: true },
    });
  }

  async createPrescription(
    medicalRecordId: string,
    itemsData: Array<{
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      quantity?: number;
    }>,
    instructions?: string,
  ): Promise<Prescription> {
    return this.dataSource.transaction(async (manager) => {
      const prescription = manager.create(Prescription, {
        medicalRecordId,
        prescribedDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        instructions: instructions || '',
      });
      const savedRx = await manager.save(Prescription, prescription);

      for (const item of itemsData) {
        // Find matching inventory item by name to get inventoryItemId
        const invItem = await manager.findOne(InventoryItem, {
          where: { name: item.name, isActive: true },
        });

        const rxItem = manager.create(PrescriptionItem, {
          prescriptionId: savedRx.id,
          inventoryItemId: invItem ? invItem.id : null,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
          quantity: item.quantity || 10, // Default to 10 tablets/units
          unit: invItem ? invItem.unit : 'tablet',
        });
        await manager.save(PrescriptionItem, rxItem);
      }

      const rx = await manager.findOne(Prescription, {
        where: { id: savedRx.id },
        relations: { items: true },
      });

      // 🔔 Notify pharmacist a new prescription needs dispensing
      this.notificationService?.emit({
        event: 'prescription.ready',
        title: 'Đơn thuốc mới cần cấp phát',
        message: `Đơn thuốc #${savedRx.id.slice(0, 8)} vừa được tạo, ${itemsData.length} loại thuốc cần chuẩn bị.`,
        severity: 'warning',
        targetRoles: ['PHARMACIST'],
        meta: { prescriptionId: savedRx.id },
      });

      return rx as Prescription;
    });
  }

  async getPendingPrescriptions(): Promise<Prescription[]> {
    return this.prescriptionRepo.find({
      where: { status: 'PENDING' },
      relations: {
        items: { inventoryItem: true },
        medicalRecord: { patient: true, doctor: true },
      },
      order: { createdAt: 'DESC' },
    });
  }

  async dispensePrescription(id: string): Promise<Prescription> {
    return this.dataSource.transaction(async (manager) => {
      const rx = await manager.findOne(Prescription, {
        where: { id },
        relations: { items: { inventoryItem: true } },
      });
      if (!rx) throw new NotFoundException(`Prescription ${id} not found`);
      if (rx.status === 'DISPENSED') throw new ConflictException(`Prescription already dispensed`);

      // Reduce stock quantities
      for (const item of rx.items) {
        if (item.inventoryItemId && item.inventoryItem) {
          const currentQty = item.inventoryItem.quantity;
          const newQty = Math.max(0, currentQty - item.quantity);
          await manager.update(InventoryItem, item.inventoryItemId, { quantity: newQty });

          // 🔔 Alert if new quantity dropped below minimum threshold
          const minQty = item.inventoryItem.minQuantity ?? 0;
          if (newQty <= minQty && currentQty > minQty) {
            this.notificationService?.emit({
              event: 'inventory.low_stock',
              title: '⚠️ Tồn kho thấp',
              message: `${item.inventoryItem.name} còn ${newQty} ${item.inventoryItem.unit} (ngưỡng tối thiểu: ${minQty}).`,
              severity: 'critical',
              targetRoles: ['PHARMACIST', 'ADMIN'],
              meta: { inventoryItemId: item.inventoryItemId, currentQty: newQty, minQty },
            });
          }
        }
      }

      rx.status = 'DISPENSED';
      return manager.save(Prescription, rx);
    });
  }
}
