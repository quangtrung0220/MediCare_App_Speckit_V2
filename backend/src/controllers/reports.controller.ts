/*
 * Created: 2026-06-27
 * Purpose: Reports REST controller exposing endpoint for dashboard stats (T006).
 * Owner: Antigravity
 */
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../guards/roles.guard';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getStats() {
    return this.reportsService.getDashboardStats();
  }
}
