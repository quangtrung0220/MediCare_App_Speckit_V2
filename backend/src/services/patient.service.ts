/*
 * Created: 2026-06-24
 * Purpose: Patient business service layer (T029).
 * Owner: Quang Trung
 */
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PATIENT_REPOSITORY } from './contracts';
import type { IPatientRepository } from './contracts';
import { Patient } from '../models/patient.entity';
import { Appointment } from '../models/appointment.entity';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';
import { Payment } from '../models/payment.entity';
import { AuditLog } from '../models/audit-log.entity';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { UpdatePatientDto } from '../patient/dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepo: IPatientRepository,

    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,

    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepo: Repository<MedicalRecord>,

    @InjectRepository(Prescription)
    private readonly prescriptionRepo: Repository<Prescription>,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Patient[]> {
    return this.patientRepo.findAll(options);
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findById(id);
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);
    return patient;
  }

  async create(data: CreatePatientDto): Promise<Patient> {
    return this.patientRepo.create(data);
  }

  async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    const updated = await this.patientRepo.update(id, data);
    if (!updated) throw new NotFoundException(`Patient ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.patientRepo.delete(id);
    if (!deleted) throw new NotFoundException(`Patient ${id} not found`);
  }

  async restore(id: string): Promise<void> {
    if (!this.patientRepo.restore) {
      throw new Error('Restore method not supported on Patient Repository');
    }
    const restored = await this.patientRepo.restore(id);
    if (!restored) throw new NotFoundException(`Patient ${id} not found`);
  }

  async search(query: string): Promise<Patient[]> {
    return this.patientRepo.search(query);
  }

  async count(): Promise<number> {
    return this.patientRepo.count();
  }

  /**
   * Aggregates all patient-related data into a single JSON export bundle.
   * Writes an EXPORT audit log entry for compliance tracking.
   */
  async exportPatientData(id: string): Promise<Record<string, unknown>> {
    const patient = await this.patientRepo.findById(id);
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);

    // Fetch all related data in parallel
    const [appointments, medicalRecords, payments] = await Promise.all([
      this.appointmentRepo.find({
        where: { patientId: id },
        order: { appointmentDate: 'DESC' },
      }),
      this.medicalRecordRepo.find({
        where: { patientId: id },
        order: { visitDate: 'DESC' },
      }),
      this.paymentRepo.find({
        where: { patientId: id },
        order: { createdAt: 'DESC' },
      }),
    ]);

    // Fetch prescriptions linked to those medical records
    const recordIds = medicalRecords.map((r) => r.id);
    const prescriptions =
      recordIds.length > 0
        ? await this.prescriptionRepo
            .createQueryBuilder('p')
            .leftJoinAndSelect('p.items', 'items')
            .where('p.medicalRecordId IN (:...ids)', { ids: recordIds })
            .getMany()
        : [];

    // Write audit log
    await this.auditRepo.save(
      this.auditRepo.create({
        entity: 'Patient',
        entityId: id,
        action: 'EXPORT',
        changes: JSON.stringify({ exportedAt: new Date().toISOString() }),
        timestamp: new Date().toISOString(),
      }),
    );

    return {
      exportedAt: new Date().toISOString(),
      patient,
      appointments,
      medicalRecords,
      prescriptions,
      payments,
    };
  }

  /**
   * Hard-deletes all patient data permanently (GDPR right-to-erasure).
   * Guards against pending unpaid invoices before deletion.
   * Writes a DELETE audit log entry prior to the physical deletion.
   */
  async purgePatient(id: string): Promise<void> {
    const patient = await this.patientRepo.findById(id);
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);

    // Guard: block purge if any PENDING invoice exists
    const pendingPayments = await this.paymentRepo.find({
      where: { patientId: id, status: 'PENDING' },
    });
    if (pendingPayments.length > 0) {
      throw new ConflictException(
        `Không thể xóa bệnh nhân: còn ${pendingPayments.length} hóa đơn chưa thanh toán. ` +
          `Vui lòng hoàn tất thanh toán trước khi xóa vĩnh viễn.`,
      );
    }

    // Write audit log BEFORE deletion (so entityId is still meaningful)
    await this.auditRepo.save(
      this.auditRepo.create({
        entity: 'Patient',
        entityId: id,
        action: 'DELETE',
        changes: JSON.stringify({
          purgedAt: new Date().toISOString(),
          patientName: `${patient.firstName} ${patient.lastName}`,
          note: 'Hard delete — GDPR erasure request',
        }),
        timestamp: new Date().toISOString(),
      }),
    );

    // Hard delete — CASCADE in DB removes appointments, records, prescriptions, payments
    await this.patientRepo.hardDelete!(id);
  }
}
