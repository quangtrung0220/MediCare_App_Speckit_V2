/*
 * Created: 2026-06-27
 * Purpose: Business service layer for inventory management (T004).
 * Updated: 2026-07-03 — Added low-stock notification hook (T070).
 * Owner: Antigravity
 */
import { Injectable, NotFoundException, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../models/inventory-item.entity';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
    @Optional()
    private readonly notificationService?: NotificationService,
  ) {}

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryRepo.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Inventory item ${id} not found`);
    return item;
  }

  /**
   * Update stock quantity for an item.
   * Emits inventory.low_stock if new quantity drops below minQuantity.
   */
  async updateQuantity(id: string, quantity: number): Promise<InventoryItem> {
    const item = await this.findById(id);
    const previousQty = item.quantity;
    item.quantity = quantity;
    const saved = await this.inventoryRepo.save(item);

    // 🔔 Emit low-stock alert when quantity drops below threshold
    if (quantity <= item.minQuantity && previousQty > item.minQuantity) {
      this.notificationService?.emit({
        event: 'inventory.low_stock',
        title: '⚠️ Tồn kho thấp',
        message: `${item.name} còn ${quantity} ${item.unit} (ngưỡng tối thiểu: ${item.minQuantity}).`,
        severity: 'critical',
        targetRoles: ['PHARMACIST', 'ADMIN'],
        meta: { inventoryItemId: id, currentQty: quantity, minQty: item.minQuantity },
      });
    }

    return saved;
  }
}
