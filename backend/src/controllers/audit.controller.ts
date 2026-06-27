/*
 * Created: 2026-06-27
 * Purpose: Audit REST controller exposing endpoints for log logs (T007).
 * Owner: Antigravity
 */
import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { AuditLog } from '../models/audit-log.entity';
import type { Request } from 'express';

@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  async findAll(): Promise<AuditLog[]> {
    return this.auditService.findAll();
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() data: Partial<AuditLog>,
  ): Promise<AuditLog> {
    const ip = req.ip || req.socket.remoteAddress || null;
    const ua = req.headers['user-agent'] || null;
    return this.auditService.createLog({
      ...data,
      ipAddress: data.ipAddress || ip,
      userAgent: data.userAgent || ua,
    });
  }
}
