/*
 * Created: 2026-06-24
 * Purpose: Inventory levels display table with low stock warnings (T027).
 * Owner: Quang Trung
 */
"use client";

import React from "react";
import type { InventoryItem } from "@/services/pharmacist.service";
import styles from "./InventoryTable.module.css";

interface InventoryTableProps {
  items: InventoryItem[];
}

export function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã thuốc</th>
            <th>Tên dược phẩm</th>
            <th>Số lượng tồn</th>
            <th>Tối thiểu</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isLow = item.quantity < item.minQuantity;
            return (
              <tr key={item.code} className={isLow ? styles.rowAlert : ""} data-testid="inventory-row">
                <td><strong>{item.code}</strong></td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.minQuantity}</td>
                <td>
                  {isLow ? (
                    <span className={styles.alertBadge}>Sắp hết hàng</span>
                  ) : (
                    <span style={{ color: "#059669", fontSize: "0.85rem", fontWeight: 600 }}>Đủ hàng</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
