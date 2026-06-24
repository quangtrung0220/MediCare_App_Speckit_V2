import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /health', () => {
    it('should return status "ok"', () => {
      const result = controller.check();
      expect(result.status).toBe('ok');
    });

    it('should return a valid ISO timestamp', () => {
      const result = controller.check();
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return a non-negative uptime', () => {
      const result = controller.check();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GET /health/ready', () => {
    it('should return status "ok"', () => {
      const result = controller.ready();
      expect(result.status).toBe('ok');
    });

    it('should return a valid ISO timestamp', () => {
      const result = controller.ready();
      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });

    it('should return a non-negative uptime', () => {
      const result = controller.ready();
      expect(result.uptime).toBeGreaterThanOrEqual(0);
    });
  });

  describe('HealthService delegation', () => {
    it('check() should delegate to HealthService.check()', () => {
      const spy = jest.spyOn(service, 'check');
      controller.check();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('ready() should delegate to HealthService.ready()', () => {
      const spy = jest.spyOn(service, 'ready');
      controller.ready();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
