/*
 * Created: 2026-06-27
 * Purpose: Audit feature module wiring controller, service, and repository (T007).
 * Owner: Antigravity
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from '../models/audit-log.entity';
import { AuditController } from '../controllers/audit.controller';
import { AuditService } from '../services/audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
