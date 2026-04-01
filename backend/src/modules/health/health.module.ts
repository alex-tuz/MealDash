import { Router } from "express";

import { HealthController } from "./health.controller";
import { HealthRepository } from "./health.repository";
import { HealthService } from "./health.service";

export const createHealthModuleRouter = (): Router => {
  const router = Router();

  const repository = new HealthRepository();
  const service = new HealthService(repository);
  const controller = new HealthController(service);

  router.get("/", controller.getHealth);

  return router;
};
