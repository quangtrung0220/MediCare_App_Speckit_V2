/*
 * Created: 2026-04-11
 * Updated: 2026-04-11
 * Purpose: Status constants and labels used in UI modules.
 * Owner: Quang Trung
 */
export const APPOINTMENT_STATUSES = [
  "SCHEDULED",
  "COMPLETED",
  "CANCELLED",
  "NO_SHOW",
] as const;

export const PAYMENT_STATUSES = [
  "PENDING",
  "COMPLETED",
  "FAILED",
  "REFUNDED",
] as const;

export const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No show",
  PENDING: "Pending",
  FAILED: "Failed",
  REFUNDED: "Refunded",
};
