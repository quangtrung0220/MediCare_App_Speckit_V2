/*
 * Created: 2026-07-02
 * Purpose: @CurrentUser() param decorator — extracts authenticated user from request.
 * Owner: Quang Trung
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { UserRole } from '../../models/user.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
}

/**
 * Extract the currently authenticated user from the request object.
 * Usage: async myRoute(@CurrentUser() user: AuthenticatedUser)
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
