/*
 * Created: 2026-06-27
 * Purpose: Reports feature module wiring controller, service, and repositories (T006).
 * Owner: Antigravity
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../models/appointment.entity';
import { Payment } from '../models/payment.entity';
import { InventoryItem } from '../models/inventory-item.entity';
import { ReportsController } from '../controllers/reports.controller';
import { ReportsService } from '../services/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, Payment, InventoryItem])],
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
