import { Pool } from 'pg';

import { DATABASE } from '../constants/app.constants';
import { env } from '../config/env';
import { logger } from '../logger/logger';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export const connectDatabase = async (): Promise<void> => {
  await pool.query(DATABASE.healthcheckQuery);
  logger.info('Database connection established');
};
