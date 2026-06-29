/*
 * Created: 2026-06-24
 * Purpose: Patient business service layer (T029).
 * Owner: Quang Trung
 */
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { PATIENT_REPOSITORY } from './contracts';
import type { IPatientRepository } from './contracts';
import { Patient } from '../models/patient.entity';
import { CreatePatientDto } from '../patient/dto/create-patient.dto';
import { UpdatePatientDto } from '../patient/dto/update-patient.dto';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepo: IPatientRepository,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Patient[]> {
    return this.patientRepo.findAll(options);
  }

  async findById(id: string): Promise<Patient> {
    const patient = await this.patientRepo.findById(id);
    if (!patient) throw new NotFoundException(`Patient ${id} not found`);
    return patient;
  }

  async create(data: CreatePatientDto): Promise<Patient> {
    return this.patientRepo.create(data);
  }

  async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    const updated = await this.patientRepo.update(id, data);
    if (!updated) throw new NotFoundException(`Patient ${id} not found`);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.patientRepo.delete(id);
    if (!deleted) throw new NotFoundException(`Patient ${id} not found`);
  }

  async restore(id: string): Promise<void> {
    if (!this.patientRepo.restore) {
      throw new Error('Restore method not supported on Patient Repository');
    }
    const restored = await this.patientRepo.restore(id);
    if (!restored) throw new NotFoundException(`Patient ${id} not found`);
  }

  async search(query: string): Promise<Patient[]> {
    return this.patientRepo.search(query);
  }

  async count(): Promise<number> {
    return this.patientRepo.count();
  }
}
