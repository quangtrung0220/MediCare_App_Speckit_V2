/*
 * Created: 2026-07-03
 * Purpose: Notification fan-out service — manages SSE client connections and broadcasts events.
 * Owner: Quang Trung
 */
import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { randomUUID } from 'crypto';
import type { NotificationPayload, NotificationEvent } from './notification.types';
import type { UserRole } from '../models/user.entity';

/** A connected SSE client */
interface SseClient {
  id: string;
  role: UserRole;
  subject$: Subject<NotificationPayload>;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  /** In-memory map of active SSE connections */
  private readonly clients = new Map<string, SseClient>();

  /**
   * Register a new SSE client.
   * Returns an Observable that the SSE controller subscribes to.
   */
  addClient(clientId: string, role: UserRole): Observable<NotificationPayload> {
    const subject$ = new Subject<NotificationPayload>();
    this.clients.set(clientId, { id: clientId, role, subject$ });
    this.logger.log(`SSE client connected: ${clientId} (${role}) — total: ${this.clients.size}`);

    return subject$.asObservable();
  }

  /**
   * Remove a client when it disconnects (browser tab closed, etc.)
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      client.subject$.complete();
      this.clients.delete(clientId);
      this.logger.log(`SSE client disconnected: ${clientId} — total: ${this.clients.size}`);
    }
  }

  /**
   * Emit a notification to all connected clients whose role is in targetRoles.
   * Shorthand factory — callers pass partial, service fills id + timestamp.
   */
  emit(
    partial: Omit<NotificationPayload, 'id' | 'timestamp'>,
  ): void {
    const payload: NotificationPayload = {
      ...partial,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    let sent = 0;
    for (const client of this.clients.values()) {
      if (payload.targetRoles.includes(client.role)) {
        client.subject$.next(payload);
        sent++;
      }
    }

    this.logger.debug(
      `Emitted [${payload.event}] → ${sent}/${this.clients.size} clients`,
    );
  }

  /**
   * Helper: build a role-filtered Observable for a single client.
   * Used internally by the controller after addClient().
   */
  streamFor(clientId: string, role: UserRole): Observable<NotificationPayload> {
    return this.addClient(clientId, role);
  }

  /** How many clients are currently connected (useful for health checks) */
  get connectionCount(): number {
    return this.clients.size;
  }
}
