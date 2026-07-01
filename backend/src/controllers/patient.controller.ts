/*
 * Created: 2026-06-24
 * Purpose: Patient REST controller exposing CRUD and Privacy endpoints.
 * Owner: Quang Trung
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  Query,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { PatientService } from '../services/patient.service';
import { Patient } from '../models/patient.entity';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { UpdatePatientDto } from '../patient/dto/update-patient.dto';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<{ data: Patient[]; total: number }> {
    const [data, total] = await Promise.all([
      this.patientService.findAll({
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
      }),
      this.patientService.count(),
    ]);
    return { data, total };
  }

  @Get('search')
  async search(@Query('q') query: string): Promise<Patient[]> {
    return this.patientService.search(query ?? '');
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.patientService.delete(id);
  }

  @Patch(':id/restore')
  async restore(@Param('id') id: string): Promise<void> {
    return this.patientService.restore(id);
  }

  /**
   * Export all patient data as a downloadable JSON file.
   * GET /api/v1/patients/:id/export
   */
  @Get(':id/export')
  async exportData(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const data = await this.patientService.exportPatientData(id);
    const filename = `patient_${id}_export_${new Date().toISOString().split('T')[0]}.json`;
    const json = JSON.stringify(data, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(json));
    res.status(HttpStatus.OK).send(json);
  }

  /**
   * Permanently hard-delete all patient data (GDPR right-to-erasure).
   * DELETE /api/v1/patients/:id/purge
   * Returns 409 Conflict if patient has unpaid invoices.
   */
  @Delete(':id/purge')
  @HttpCode(HttpStatus.NO_CONTENT)
  async purge(@Param('id') id: string): Promise<void> {
    return this.patientService.purgePatient(id);
  }
}
