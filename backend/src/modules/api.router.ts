import { Router } from 'express';

import { API_ROUTES } from '../common/constants/app.constants';
import { createHealthModuleRouter } from './health/health.module';
import { createShopsModuleRouter } from './shops/shops.module';

const moduleRoutes = [
  [API_ROUTES.health, createHealthModuleRouter()],
  [API_ROUTES.shops, createShopsModuleRouter()],
] as const;

export const createApiModuleRouter = (): Router => {
  const router = Router();

  for (const [path, moduleRouter] of moduleRoutes) {
    router.use(path, moduleRouter);
  }

  return router;
};
