/*
 * Created: 2026-06-27
 * Purpose: Audit REST controller exposing endpoints for log logs (T007).
 * Owner: Antigravity
 */
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../guards/roles.guard';
import { AuditService } from '../services/audit.service';
import { AuditLog } from '../models/audit-log.entity';
import type { Request } from 'express';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
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
