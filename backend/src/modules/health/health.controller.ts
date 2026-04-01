import { NextFunction, Request, Response } from "express";

import { HTTP_STATUS } from "../../common/constants/app.constants";
import { toResponseEnvelope } from "../../common/interceptors/response.interceptor";
import { HealthService } from "./health.service";

export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  public getHealth = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.healthService.getHealthStatus();
      res.status(HTTP_STATUS.ok).json(toResponseEnvelope(response));
    } catch (error) {
      next(error);
    }
  };
}
