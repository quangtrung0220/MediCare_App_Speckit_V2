import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { HealthResponseDto } from './dto/health-response.dto';

/**
 * HealthController
 *
 * Lightweight liveness/readiness probe endpoint.
 * Used by load balancers, CI smoke checks, and monitoring tools.
 *
 * Routes:
 *   GET /health        → overall app liveness
 *   GET /health/ready  → readiness (db connectivity, etc.)
 */
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /** GET /health — liveness probe */
  @Get()
  check(): HealthResponseDto {
    return this.healthService.check();
  }

  /** GET /health/ready — readiness probe */
  @Get('ready')
  ready(): HealthResponseDto {
    return this.healthService.ready();
  }
}
