/*
 * Created: 2026-06-24
 * Purpose: Generic repository interface for database-agnostic data access.
 * Owner: Quang Trung
 */

/**
 * Base repository contract. All entity-specific repositories extend this
 * so the service layer never depends on TypeORM directly.
 */
export interface IBaseRepository<T> {
  findAll(options?: { skip?: number; take?: number }): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
  count(): Promise<number>;
}
