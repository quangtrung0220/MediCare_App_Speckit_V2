import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('check()', () => {
    it('should return status "ok"', () => {
      const result = service.check();
      expect(result.status).toBe('ok');
    });

    it('should return a valid ISO-8601 timestamp', () => {
      const result = service.check();
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return non-negative uptime', () => {
      const result = service.check();
      expect(typeof result.uptime).toBe('number');
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('ready()', () => {
    it('should return status "ok"', () => {
      const result = service.ready();
      expect(result.status).toBe('ok');
    });

    it('should return a valid ISO-8601 timestamp', () => {
      const result = service.ready();
      expect(typeof result.timestamp).toBe('string');
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return non-negative uptime', () => {
      const result = service.ready();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });
});
