import fs from 'node:fs/promises';
import path from 'node:path';

import { pool } from '../postgres';
import { logger } from '../../logger/logger';

const MIGRATIONS_DIR = path.resolve(process.cwd(), 'migrations');

const ensureMigrationsTable = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name TEXT PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

const getMigrationFiles = async (): Promise<string[]> => {
  try {
    const entries = await fs.readdir(MIGRATIONS_DIR, { withFileTypes: true });

    return entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.sql'))
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  } catch (error) {
    const typedError = error as NodeJS.ErrnoException;

    if (typedError.code === 'ENOENT') {
      logger.warn('Migrations directory does not exist, skipping', {
        migrationsDir: MIGRATIONS_DIR,
      });
      return [];
    }

    throw error;
  }
};

const getAppliedMigrations = async (): Promise<Set<string>> => {
  const result = await pool.query<{ name: string }>('SELECT name FROM schema_migrations');
  return new Set(result.rows.map((row) => row.name));
};

const applyMigration = async (fileName: string): Promise<void> => {
  const fullPath = path.join(MIGRATIONS_DIR, fileName);
  const sql = await fs.readFile(fullPath, 'utf8');

  if (!sql.trim()) {
    logger.warn('Skipping empty migration file', { fileName });
    return;
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [fileName]);
    await client.query('COMMIT');
    logger.info('Applied migration', { fileName });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Failed to apply migration', { fileName, error });
    throw error;
  } finally {
    client.release();
  }
};

const runMigrations = async (): Promise<void> => {
  await ensureMigrationsTable();

  const files = await getMigrationFiles();
  const applied = await getAppliedMigrations();
  const pending = files.filter((fileName) => !applied.has(fileName));

  if (pending.length === 0) {
    logger.info('No pending migrations');
    return;
  }

  logger.info('Pending migrations detected', { count: pending.length, pending });

  for (const fileName of pending) {
    await applyMigration(fileName);
  }
};

void runMigrations()
  .then(() => {
    logger.info('Migration run completed');
    return pool.end();
  })
  .catch(async (error) => {
    logger.error('Migration run failed', { error });
    await pool.end();
    process.exit(1);
  });
