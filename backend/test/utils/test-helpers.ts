/*
 * Created: 2026-06-24
 * Purpose: Reusable NestJS testing helpers for module and controller tests.
 * Owner: Quang Trung
 */
import { Test, TestingModule } from '@nestjs/testing';

/**
 * Creates a NestJS testing module with the given providers and optional imports.
 * Use this to avoid boilerplate in every backend unit test.
 */
export async function createTestingModule(config: {
  controllers?: any[];
  providers?: any[];
  imports?: any[];
}): Promise<TestingModule> {
  const builder = Test.createTestingModule({
    controllers: config.controllers ?? [],
    providers: config.providers ?? [],
    imports: config.imports ?? [],
  });

  return builder.compile();
}

/**
 * Creates a mock repository object with common TypeORM methods stubbed.
 * Extend with additional methods as needed for specific tests.
 */
export function createMockRepository() {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
}
