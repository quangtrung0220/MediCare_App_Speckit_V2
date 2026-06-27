/*
 * Created: 2026-06-27
 * Purpose: Billing REST controller exposing endpoints for payment and invoicing (T005).
 * Owner: Antigravity
 */
import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { BillingService } from '../services/billing.service';
import { Payment } from '../models/payment.entity';
import type { PaymentMethod } from '../models/payment.entity';

@Controller('payments')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  async createPayment(@Body() data: Partial<Payment>): Promise<Payment> {
    return this.billingService.createPayment(data);
  }

  @Get()
  async getAllPayments(): Promise<Payment[]> {
    return this.billingService.getAllPayments();
  }

  @Get('pending')
  async getPendingPayments(): Promise<Payment[]> {
    return this.billingService.getPendingPayments();
  }

  @Patch(':id/pay')
  async payInvoice(
    @Param('id') id: string,
    @Body('paymentMethod') method: PaymentMethod,
  ): Promise<Payment> {
    return this.billingService.payInvoice(id, method);
  }
}
