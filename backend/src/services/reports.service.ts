/*
 * Created: 2026-06-27
 * Purpose: Business service layer for operational reports (T006).
 * Owner: Antigravity
 */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../models/appointment.entity';
import { Payment } from '../models/payment.entity';
import { InventoryItem } from '../models/inventory-item.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  async getDashboardStats() {
    const todayStr = new Date().toISOString().split('T')[0];

    const [appointmentsCount, revenueResult, lowStockCount] = await Promise.all([
      this.appointmentRepo.count({
        where: { appointmentDate: todayStr },
      }),
      this.paymentRepo
        .createQueryBuilder('p')
        .select('SUM(p.amount)', 'total')
        .where('p.status = :status', { status: 'COMPLETED' })
        .getRawOne(),
      this.inventoryRepo
        .createQueryBuilder('i')
        .where('i.quantity < i.minQuantity')
        .getCount(),
    ]);

    const totalRevenue = parseFloat(revenueResult?.total ?? '0');

    return {
      appointmentsCount,
      totalRevenue,
      lowStockCount,
      patientCount: appointmentsCount, // approximate patients seen by appointments today
    };
  }
}
