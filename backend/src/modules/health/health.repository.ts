import { DATABASE } from '../../common/constants/app.constants';
import { pool } from '../../common/db/postgres';

export class HealthRepository {
  public async checkDatabaseConnection(): Promise<void> {
    await pool.query(DATABASE.healthcheckQuery);
  }
}
