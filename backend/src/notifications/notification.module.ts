/*
 * Created: 2026-07-03
 * Purpose: Notification module — SSE real-time push notification system.
 * Owner: Quang Trung
 */
import { Module, forwardRef } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    // forwardRef() resolves AuthModule <-> NotificationModule circular dependency
    forwardRef(() => AuthModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

