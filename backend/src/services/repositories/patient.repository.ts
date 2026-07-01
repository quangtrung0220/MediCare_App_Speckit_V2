/*
 * Created: 2026-06-24
 * Purpose: TypeORM-based Patient repository implementation (T023).
 * Owner: Quang Trung
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Patient } from '../../models/patient.entity';
import { IPatientRepository } from '../contracts/patient-repository.interface';

@Injectable()
export class PatientRepository implements IPatientRepository {
  constructor(
    @InjectRepository(Patient)
    private readonly repo: Repository<Patient>,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Patient[]> {
    return this.repo.find({
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Patient | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<Patient>): Promise<Patient> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<Patient>): Promise<Patient | null> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) return null;
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repo.restore(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async findByUserId(userId: string): Promise<Patient | null> {
    return this.repo.findOneBy({ userId });
  }

  async findByPhone(phone: string): Promise<Patient | null> {
    return this.repo.findOneBy({ phone });
  }

  async search(query: string): Promise<Patient[]> {
    return this.repo.find({
      where: [
        { firstName: Like(`%${query}%`) },
        { lastName: Like(`%${query}%`) },
        { phone: Like(`%${query}%`) },
      ],
      take: 20,
    });
  }

  /**
   * Physical (hard) delete — permanently removes the record from the database.
   * TypeORM withDeleted() is not needed here; the entity CASCADE handles children.
   */
  async hardDelete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

