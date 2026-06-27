/*
 * Created: 2026-06-27
 * Purpose: Business service layer for security auditing (T007).
 * Owner: Antigravity
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../models/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepo: Repository<AuditLog>,
  ) {}

  async createLog(data: Partial<AuditLog>): Promise<AuditLog> {
    const log = this.auditRepo.create({
      ...data,
      timestamp: data.timestamp || new Date().toISOString(),
    });
    return this.auditRepo.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      relations: { user: true },
    });
  }
}
