/*
 * Created: 2026-07-02
 * Purpose: @Public() decorator — marks a route as exempt from JwtAuthGuard.
 * Owner: Quang Trung
 */
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Mark a route as publicly accessible (no JWT required).
 * Usage: @Public() before @Get() / @Post() etc.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
