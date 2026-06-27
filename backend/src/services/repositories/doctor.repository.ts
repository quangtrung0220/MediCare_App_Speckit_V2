/*
 * Created: 2026-06-24
 * Purpose: TypeORM-based Doctor repository implementation (T023).
 * Owner: Quang Trung
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../../models/doctor.entity';
import { IDoctorRepository } from '../contracts/doctor-repository.interface';

@Injectable()
export class DoctorRepository implements IDoctorRepository {
  constructor(
    @InjectRepository(Doctor)
    private readonly repo: Repository<Doctor>,
  ) {}

  async findAll(options?: { skip?: number; take?: number }): Promise<Doctor[]> {
    return this.repo.find({
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Doctor | null> {
    return this.repo.findOne({
      where: { id },
      relations: { schedules: true },
    });
  }

  async create(data: Partial<Doctor>): Promise<Doctor> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<Doctor>): Promise<Doctor | null> {
    const existing = await this.repo.findOneBy({ id });
    if (!existing) return null;
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async findByUserId(userId: string): Promise<Doctor | null> {
    return this.repo.findOneBy({ userId });
  }

  async findBySpecialization(specialization: string): Promise<Doctor[]> {
    return this.repo.find({ where: { specialization } });
  }

  async findAvailable(): Promise<Doctor[]> {
    return this.repo.find({
      where: { isAvailable: true },
      relations: { schedules: true },
    });
  }
}
