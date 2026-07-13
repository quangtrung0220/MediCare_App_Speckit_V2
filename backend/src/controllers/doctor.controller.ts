/*
 * Created: 2026-06-27
 * Purpose: Doctor REST controller exposing query endpoints (T001).
 * Owner: Antigravity
 */
import { Controller, Get, Param, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../guards/roles.guard';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../models/doctor.entity';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST', 'PATIENT')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ): Promise<Doctor[]> {
    return this.doctorService.findAll({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    });
  }

  @Get('available')
  async findAvailable(): Promise<Doctor[]> {
    return this.doctorService.findAvailable();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Doctor> {
    return this.doctorService.findById(id);
  }
}
