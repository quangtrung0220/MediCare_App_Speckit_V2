/*
 * Created: 2026-06-27
 * Purpose: Clinical module configuration wiring controller, service, and typeorm repositories (T002, T003).
 * Owner: Antigravity
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';
import { PrescriptionItem } from '../models/prescription-item.entity';
import { InventoryItem } from '../models/inventory-item.entity';
import { Appointment } from '../models/appointment.entity';
import { ClinicalController } from '../controllers/clinical.controller';
import { ClinicalService } from '../services/clinical.service';
import { NotificationModule } from '../notifications/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MedicalRecord,
      Prescription,
      PrescriptionItem,
      InventoryItem,
      Appointment,
    ]),
    NotificationModule,
  ],
  controllers: [ClinicalController],
  providers: [ClinicalService],
  exports: [ClinicalService],
})
export class ClinicalModule {}
