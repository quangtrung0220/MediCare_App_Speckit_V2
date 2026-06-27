/*
 * Created: 2026-06-27
 * Purpose: Inventory REST controller exposing endpoints for stock management (T004).
 * Owner: Antigravity
 */
import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { InventoryItem } from '../models/inventory-item.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  async findAll(): Promise<InventoryItem[]> {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<InventoryItem> {
    return this.inventoryService.findById(id);
  }

  @Put(':id/quantity')
  async updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<InventoryItem> {
    return this.inventoryService.updateQuantity(id, quantity);
  }
}
