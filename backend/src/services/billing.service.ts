/*
 * Created: 2026-06-27
 * Purpose: Business service layer for billing and payments (T005).
 * Owner: Antigravity
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus, PaymentMethod } from '../models/payment.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
  ) {}

  async createPayment(data: Partial<Payment>): Promise<Payment> {
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const payment = this.paymentRepo.create({
      ...data,
      invoiceNumber,
      status: 'PENDING',
      currency: 'VND',
    });
    return this.paymentRepo.save(payment);
  }

  async getPendingPayments(): Promise<Payment[]> {
    return this.paymentRepo.find({
      where: { status: 'PENDING' },
      relations: { patient: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepo.find({
      relations: { patient: true },
      order: { createdAt: 'DESC' },
    });
  }

  async payInvoice(id: string, method: PaymentMethod): Promise<Payment> {
    const payment = await this.paymentRepo.findOneBy({ id });
    if (!payment) throw new NotFoundException(`Invoice ${id} not found`);
    if (payment.status === 'COMPLETED') throw new ConflictException(`Invoice already paid`);

    payment.status = 'COMPLETED';
    payment.paymentMethod = method;
    payment.completedAt = new Date().toISOString();

    return this.paymentRepo.save(payment);
  }
}
