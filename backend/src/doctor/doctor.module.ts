/*
 * Created: 2026-06-27
 * Purpose: Doctor feature module wiring controller, service, and repository.
 * Owner: Antigravity
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../models/doctor.entity';
import { DoctorController } from '../controllers/doctor.controller';
import { DoctorService } from '../services/doctor.service';
import { DoctorRepository } from '../services/repositories/doctor.repository';
import { DOCTOR_REPOSITORY } from '../services/contracts';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  controllers: [DoctorController],
  providers: [
    DoctorService,
    { provide: DOCTOR_REPOSITORY, useClass: DoctorRepository },
  ],
  exports: [DoctorService],
})
export class DoctorModule {}
