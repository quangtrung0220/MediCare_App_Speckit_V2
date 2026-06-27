/*
 * Created: 2026-06-27
 * Purpose: Doctor business service layer (T001).
 * Owner: Antigravity
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { DOCTOR_REPOSITORY } from './contracts';
import type { IDoctorRepository } from './contracts';
import { Doctor } from '../models/doctor.entity';

@Injectable()
export class DoctorService {
  constructor(
    @Inject(DOCTOR_REPOSITORY)
    private readonly doctorRepo: IDoctorRepository,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Doctor[]> {
    return this.doctorRepo.findAll(options);
  }

  async findAvailable(): Promise<Doctor[]> {
    return this.doctorRepo.findAvailable();
  }

  async findById(id: string): Promise<Doctor> {
    const doc = await this.doctorRepo.findById(id);
    if (!doc) throw new NotFoundException(`Doctor ${id} not found`);
    return doc;
  }
}
