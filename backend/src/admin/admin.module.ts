/*
 * Created: 2026-07-02
 * Purpose: Admin feature module — user account management for ADMIN role.
 * Owner: Quang Trung
 */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../models/user.entity';
import { AdminController } from './admin.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,   // Provides JwtAuthGuard
  ],
  controllers: [AdminController],
})
export class AdminModule {}
