/*
 * Created: 2026-06-27
 * Purpose: Reports REST controller exposing endpoint for dashboard stats (T006).
 * Owner: Antigravity
 */
import { Controller, Get } from '@nestjs/common';
import { ReportsService } from '../services/reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  async getStats() {
    return this.reportsService.getDashboardStats();
  }
}
