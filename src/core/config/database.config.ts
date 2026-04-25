import { registerAs } from '@nestjs/config';

/**
 * Resolves database connection parameters from either:
 *   1. DATABASE_URL (connection string) — takes priority if defined and non-empty.
 *   2. Individual DATABASE_* variables — used as fallback.
 *
 * Connection string format:
 *   postgresql://username:password@host:port/database[?sslmode=require]
 *
 * SSL is activated when:
 *   - Using DATABASE_URL and it contains `?sslmode=require`
 *   - Using individual vars and DATABASE_SSL=true
 *
 * Characters in username/password that require URL-encoding:
 *   @  →  %40
 *   #  →  %23
 *   %  →  %25
 *   :  →  %3A
 *   /  →  %2F
 *   ?  →  %3F
 *   &  →  %26
 *   =  →  %3D
 *   +  →  %2B
 *   (space) → %20
 */
function resolveDbConfig() {
  const url = process.env.DATABASE_URL;

  if (url && url.trim() !== '') {
    try {
      const parsed = new URL(url);
      const sslRequired =
        parsed.searchParams.get('sslmode') === 'require' ||
        parsed.searchParams.get('sslmode') === 'verify-full' ||
        parsed.searchParams.get('sslmode') === 'verify-ca';

      return {
        host: parsed.hostname,
        port: parseInt(parsed.port, 10) || 5432,
        username: decodeURIComponent(parsed.username),
        password: decodeURIComponent(parsed.password),
        database: parsed.pathname.replace(/^\//, ''),
        ssl: sslRequired ? { rejectUnauthorized: false } : false,
      };
    } catch {
      throw new Error(
        `[database.config] DATABASE_URL is invalid: "${url}".\n` +
          `Expected format: postgresql://username:password@host:port/database[?sslmode=require]\n` +
          `If your password contains special characters, URL-encode them (e.g. @ → %40, # → %23).`,
      );
    }
  }

  // Fallback: individual environment variables
  return {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl:
      process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
  };
}

export default registerAs('database', () => ({
  type: 'postgres',
  ...resolveDbConfig(),
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
}));
