import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * HealthModule
 *
 * Self-contained module providing /health liveness and readiness endpoints.
 * Imported by AppModule — no external dependencies required.
 */
@Module({
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
