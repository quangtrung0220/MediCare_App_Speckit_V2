/*
 * Created: 2026-06-27
 * Purpose: Billing feature module wiring controller, service, and repository (T005).
 * Owner: Antigravity
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../models/payment.entity';
import { BillingController } from '../controllers/billing.controller';
import { BillingService } from '../services/billing.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService],
})
export class BillingModule {}
