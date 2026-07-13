/*
 * Created: 2026-07-03
 * Purpose: SSE controller — streams real-time notifications to authenticated browser clients.
 * Owner: Quang Trung
 */
import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Sse, MessageEvent } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { NotificationService } from './notification.service';
import { Public } from '../auth/decorators/public.decorator';
import { randomUUID } from 'crypto';
import type { UserRole } from '../models/user.entity';
import type { JwtPayload } from '../auth/jwt.strategy';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * GET /api/v1/notifications/stream?token=<jwt>
   *
   * Server-Sent Events stream. Browser EventSource cannot send custom headers,
   * so JWT is passed as a query param and verified manually here.
   *
   * The stream stays open until the client disconnects (tab closes, page navigates).
   */
  @Public() // Bypass global JwtAuthGuard — we verify token manually below
  @Sse('stream')
  stream(
    @Query('token') token: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Observable<MessageEvent> {
    // --- Manual JWT verification (EventSource can't send Authorization header) ---
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Token SSE không hợp lệ hoặc đã hết hạn.');
    }

    const clientId = randomUUID();
    const role = payload.role as UserRole;

    this.logger.log(`SSE stream opened: user=${payload.email} role=${role}`);

    // Register client and get its notification stream
    const notifications$ = this.notificationService.addClient(clientId, role);

    // Cleanup when the client disconnects
    req.on('close', () => {
      this.notificationService.removeClient(clientId);
    });

    // Map NotificationPayload → SSE MessageEvent format
    return notifications$.pipe(
      map((payload) => ({
        type: payload.event,            // SSE `event:` field
        data: JSON.stringify(payload),  // SSE `data:` field
        id: payload.id,                 // SSE `id:` field (for reconnect)
      })),
    );
  }

  /**
   * GET /api/v1/notifications/health
   * Returns number of active SSE connections. Useful for debugging.
   */
  @Get('health')
  health() {
    return {
      activeConnections: this.notificationService.connectionCount,
      timestamp: new Date().toISOString(),
    };
  }
}
