/*
 * Created: 2026-06-27
 * Purpose: Clinical REST controller exposing endpoints for EMR and Prescriptions (T002, T003).
 * Owner: Antigravity
 */
import { Controller, Get, Post, Patch, Param, Body, NotFoundException } from '@nestjs/common';
import { ClinicalService } from '../services/clinical.service';
import { MedicalRecord } from '../models/medical-record.entity';
import { Prescription } from '../models/prescription.entity';

@Controller()
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  @Post('medical-records')
  async createMedicalRecord(@Body() data: Partial<MedicalRecord>): Promise<MedicalRecord> {
    return this.clinicalService.createMedicalRecord(data);
  }

  @Get('medical-records/patient/:patientId')
  async getPatientHistory(@Param('patientId') patientId: string): Promise<MedicalRecord[]> {
    return this.clinicalService.getPatientHistory(patientId);
  }

  @Post('prescriptions')
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
  async getPendingPrescriptions(): Promise<Prescription[]> {
    return this.clinicalService.getPendingPrescriptions();
  }

  @Patch('prescriptions/:id/dispense')
  async dispensePrescription(@Param('id') id: string): Promise<Prescription> {
    return this.clinicalService.dispensePrescription(id);
  }
}
