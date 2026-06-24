/**
 * HealthResponseDto
 *
 * Shape returned by all /health endpoints.
 * Kept intentionally minimal for liveness/readiness probes.
 */
export class HealthResponseDto {
  /** 'ok' | 'degraded' | 'error' */
  status: 'ok' | 'degraded' | 'error';

  /** ISO-8601 timestamp of the check */
  timestamp: string;

  /** Process uptime in seconds */
  uptime: number;
}
