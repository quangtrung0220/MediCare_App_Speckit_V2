/*
 * Created: 2026-06-27
 * Purpose: Clinical REST controller exposing endpoints for EMR and Prescriptions (T002, T003).
 * Owner: Antigravity
 */
import { Controller, Get, Post, Patch, Param, Body, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../guards/roles.guard';
import { ClinicalService } from '../services/clinical.service';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Post('medical-records')
  @Roles('ADMIN', 'DOCTOR', 'NURSE')
  async createMedicalRecord(@Body() data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    return this.clinicalService.createMedicalRecord(data);
  }

  @Get('medical-records/patient/:patientId')
  @Roles('ADMIN', 'DOCTOR', 'NURSE')
  async getPatientHistory(@Param('patientId') patientId: string): Promise<MedicalRecord[]> {
    return this.clinicalService.getPatientHistory(patientId);
  }

  @Post('prescriptions')
  @Roles('ADMIN', 'DOCTOR')
  async createPrescription(
    @Body() body: {
      medicalRecordId: string;
      items: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        quantity?: number;
      }>;
      instructions?: string;
    },
  ): Promise<Prescription> {
    return this.clinicalService.createPrescription(
      body.medicalRecordId,
      body.items,
      body.instructions,
    );
  }

  @Get('prescriptions/pending')
  @Roles('ADMIN', 'DOCTOR', 'PHARMACIST')
  async getPendingPrescriptions(): Promise<Prescription[]> {
    return this.clinicalService.getPendingPrescriptions();
  }

  @Patch('prescriptions/:id/dispense')
  @Roles('ADMIN', 'PHARMACIST')
  async dispensePrescription(@Param('id') id: string): Promise<Prescription> {
    return this.clinicalService.dispensePrescription(id);
  }
}
