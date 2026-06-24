/*
 * Created: 2026-06-24
 * Purpose: Inventory manager stock list page (T030).
 * Owner: Quang Trung
 */
"use client";

import React, { useState, useEffect } from "react";
import { InventoryTable } from "@/components/pharmacist/InventoryTable";
import { fetchInventoryStock, type InventoryItem } from "@/services/pharmacist.service";
import styles from "./page.module.css";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await fetchInventoryStock();
      setInventory(data);
    }
    loadData();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Quản lý kho dược phẩm (Inventory)</h1>

      <div className={styles.card}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginTop: 0, marginBottom: "1.25rem" }}>
          Mức tồn kho hiện tại
        </h2>
        <InventoryTable items={inventory} />
      </div>
    </div>
  );
}
