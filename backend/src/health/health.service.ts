import { Injectable } from '@nestjs/common';
import { HealthResponseDto } from './dto/health-response.dto';

/**
 * HealthService
 *
 * Provides liveness and readiness status for the application.
 * Readiness checks will expand to include DB connectivity once
 * the database module (Issue #8) is wired in.
 */
@Injectable()
export class HealthService {
  /**
   * Liveness check — confirms the process is running.
   * Never throws; if this fails, the process is dead.
   */
  check(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  /**
   * Readiness check — confirms the app can serve requests.
   * Will be extended in Issue #8 to probe DB connectivity.
   */
  ready(): HealthResponseDto {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
