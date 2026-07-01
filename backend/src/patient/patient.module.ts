/*
 * Created: 2026-06-24
 * Purpose: Patient feature module wiring controller, service, and repository.
 * Owner: Quang Trung
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../models/patient.entity';
import { Appointment } from '../models/appointment.entity';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';
import { Payment } from '../models/payment.entity';
import { AuditLog } from '../models/audit-log.entity';
import { PatientController } from '../controllers/patient.controller';
import { PatientService } from '../services/patient.service';
import { PatientRepository } from '../services/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../services/contracts';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Patient,
      Appointment,
      MedicalRecord,
      Prescription,
      Payment,
      AuditLog,
    ]),
  ],
  controllers: [PatientController],
  providers: [
    PatientService,
    { provide: PATIENT_REPOSITORY, useClass: PatientRepository },
  ],
  exports: [PatientService],
})
export class PatientModule {}
