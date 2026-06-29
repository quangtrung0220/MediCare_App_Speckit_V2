/*
 * Created: 2026-06-24
 * Purpose: Patient REST controller exposing CRUD endpoints (T030).
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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
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
}
