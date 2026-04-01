import { SERVICE_NAME } from '../../common/constants/app.constants';
import { HealthResponseDto } from './dto/health-response.dto';
import { HealthRepository } from './health.repository';

export class HealthService {
  constructor(private readonly healthRepository: HealthRepository) {}

  public async getHealthStatus(): Promise<HealthResponseDto> {
    await this.healthRepository.checkDatabaseConnection();

    return {
      status: 'ok',
      service: SERVICE_NAME,
      database: 'up',
      timestamp: new Date().toISOString(),
    };
  }
}
