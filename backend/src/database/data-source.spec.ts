import { buildDataSourceOptions } from './data-source';

describe('buildDataSourceOptions', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should default to better-sqlite3 with medicare.sqlite', () => {
    delete process.env.DB_TYPE;
    delete process.env.DB_DATABASE;
    delete process.env.NODE_ENV;

    const options = buildDataSourceOptions();
    expect(options.type).toBe('better-sqlite3');
    expect(options.database).toContain('medicare.sqlite');
  });

  it('should configure postgres options when DB_TYPE is postgres', () => {
    process.env.DB_TYPE = 'postgres';
    process.env.DB_HOST = 'test-host';
    process.env.DB_PORT = '5433';
    process.env.DB_USERNAME = 'test-user';
    process.env.DB_PASSWORD = 'test-password';
    process.env.DB_DATABASE = 'test-db';
    process.env.DB_SSL = 'true';

    const options = buildDataSourceOptions();
    expect(options.type).toBe('postgres');
    if (options.type === 'postgres') {
      expect(options.host).toBe('test-host');
      expect(options.port).toBe(5433);
      expect(options.username).toBe('test-user');
      expect(options.password).toBe('test-password');
      expect(options.database).toBe('test-db');
      expect(options.ssl).toEqual({ rejectUnauthorized: false });
    }
  });
});
