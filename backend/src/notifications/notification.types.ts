/*
 * Created: 2026-07-03
 * Purpose: Type definitions for the real-time notification system.
 * Owner: Quang Trung
 */
import type { UserRole } from '../models/user.entity';

/** All possible notification event types in the clinic system. */
export type NotificationEvent =
  | 'appointment.new'        // New appointment booked
  | 'appointment.checked_in' // Patient has arrived
  | 'prescription.ready'     // Doctor has written a prescription (pharmacist to dispense)
  | 'inventory.low_stock'    // Item fell below minQuantity
  | 'user.pending_approval'; // New user registration awaiting admin approval

/** Severity determines the visual styling and urgency in the UI. */
export type NotificationSeverity = 'info' | 'warning' | 'critical';

/** A single notification payload broadcast to connected clients. */
export interface NotificationPayload {
  /** UUID — unique per notification instance */
  id: string;

  /** The event type identifier */
  event: NotificationEvent;

  /** Short human-readable title (shown in bell dropdown) */
  title: string;

  /** Longer description of what happened */
  message: string;

  /** Visual urgency level */
  severity: NotificationSeverity;

  /**
   * Roles that should receive this notification.
   * Clients with a different role will not receive it.
   */
  targetRoles: UserRole[];

  /** ISO timestamp when the notification was emitted */
  timestamp: string;

  /** Optional extra data for deep-linking or additional context */
  meta?: Record<string, unknown>;
}
