/*
 * Created: 2026-06-27
 * Purpose: Business service layer for inventory management (T004).
 * Owner: Antigravity
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../models/inventory-item.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepo: Repository<InventoryItem>,
  ) {}

  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryRepo.find({ order: { name: 'ASC' } });
  }

  async findById(id: string): Promise<InventoryItem> {
    const item = await this.inventoryRepo.findOneBy({ id });
    if (!item) throw new NotFoundException(`Inventory item ${id} not found`);
    return item;
  }

  async updateQuantity(id: string, quantity: number): Promise<InventoryItem> {
    const item = await this.findById(id);
    item.quantity = quantity;
    return this.inventoryRepo.save(item);
  }
}
