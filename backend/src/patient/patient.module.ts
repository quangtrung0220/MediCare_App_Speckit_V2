/*
 * Created: 2026-06-24
 * Purpose: Patient feature module wiring controller, service, and repository.
 * Owner: Quang Trung
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../models/patient.entity';
import { PatientController } from '../controllers/patient.controller';
import { PatientService } from '../services/patient.service';
import { PatientRepository } from '../services/repositories/patient.repository';
import { PATIENT_REPOSITORY } from '../services/contracts';

@Module({
  imports: [TypeOrmModule.forFeature([Patient])],
  controllers: [PatientController],
  providers: [
    PatientService,
    { provide: PATIENT_REPOSITORY, useClass: PatientRepository },
  ],
  exports: [PatientService],
})
export class PatientModule {}
