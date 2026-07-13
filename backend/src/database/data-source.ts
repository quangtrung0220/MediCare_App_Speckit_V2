/*
 * Created: 2026-06-24
 * Purpose: TypeORM data source configuration supporting SQLite (dev) and PostgreSQL (prod).
 * Owner: Quang Trung
 */
import { DataSource, DataSourceOptions } from 'typeorm';
import { join, resolve, dirname } from 'path';
import { homedir } from 'os';
import * as fs from 'fs';

/**
 * Builds a TypeORM DataSourceOptions based on environment variables.
 * Defaults to SQLite for zero-setup local development.
 * Switch to PostgreSQL by changing DB_TYPE in .env.
 */
export function buildDataSourceOptions(): DataSourceOptions {
  const dbType = process.env.DB_TYPE ?? 'sqlite';

  const commonOptions = {
    entities: [join(__dirname, '..', 'models', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, 'migrations', '**', '*.{ts,js}')],
    synchronize: process.env.DB_SYNC === 'true',
    logging: process.env.DB_LOGGING === 'true',
  };

  const isTest = process.env.NODE_ENV === 'test';

  if (dbType === 'postgres') {
    return {
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USERNAME ?? 'medicare',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'medicare_dev',
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
      ...commonOptions,
    };
  }

  // Default: SQLite for local development
  let dbDatabase = process.env.DB_DATABASE ?? join(process.cwd(), 'medicare.sqlite');
  if (!isTest) {
    if (dbDatabase.startsWith('~')) {
      dbDatabase = join(homedir(), dbDatabase.slice(1));
    } else {
      dbDatabase = resolve(dbDatabase);
    }
    const dbDir = dirname(dbDatabase);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
  }

  return {
    type: 'better-sqlite3',
    database: isTest ? ':memory:' : dbDatabase,
    ...commonOptions,
  };
}

/**
 * Standalone DataSource for CLI migration commands.
 * Usage: npx typeorm migration:run -d src/database/data-source.ts
 */
export const AppDataSource = new DataSource(buildDataSourceOptions());
