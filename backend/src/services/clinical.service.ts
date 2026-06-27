/*
 * Created: 2026-06-27
 * Purpose: Business service layer for clinical encounters, EMR records, and prescriptions (T002, T003).
 * Owner: Antigravity
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';
import { PrescriptionItem } from '../models/prescription-item.entity';
import { InventoryItem } from '../models/inventory-item.entity';
import { Appointment } from '../models/appointment.entity';

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
  ) {}

  async createMedicalRecord(data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    const record = this.medicalRecordRepo.create({
      ...data,
      visitDate: data.visitDate || new Date().toISOString().split('T')[0],
      version: 1,
    });
    const saved = await this.medicalRecordRepo.save(record);

    // If an appointment ID is associated, mark that appointment as COMPLETED
    if (data.appointmentId) {
      await this.appointmentRepo.update(data.appointmentId, { status: 'COMPLETED' });
    }

    return saved;
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
    const prescription = this.prescriptionRepo.create({
      medicalRecordId,
      prescribedDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      instructions: instructions || '',
    });
    const savedRx = await this.prescriptionRepo.save(prescription);

    for (const item of itemsData) {
      // Find matching inventory item by name to get inventoryItemId
      const invItem = await this.inventoryRepo.findOne({
        where: { name: item.name, isActive: true },
      });

      const rxItem = this.prescriptionItemRepo.create({
        prescriptionId: savedRx.id,
        inventoryItemId: invItem ? invItem.id : null,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity || 10, // Default to 10 tablets/units
        unit: invItem ? invItem.unit : 'tablet',
      });
      await this.prescriptionItemRepo.save(rxItem);
    }

    return this.prescriptionRepo.findOne({
      where: { id: savedRx.id },
      relations: { items: true },
    }) as Promise<Prescription>;
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
    const rx = await this.prescriptionRepo.findOne({
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
        await this.inventoryRepo.update(item.inventoryItemId, { quantity: newQty });
      }
    }

    rx.status = 'DISPENSED';
    return this.prescriptionRepo.save(rx);
  }
}
