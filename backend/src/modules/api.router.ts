import { Router } from 'express';

import { API_ROUTES } from '../common/constants/app.constants';
import { createCouponsModuleRouter } from './coupons/coupons.module';
import { createHealthModuleRouter } from './health/health.module';
import { createOrdersModuleRouter } from './orders/orders.module';
import { createShopsModuleRouter } from './shops/shops.module';

const moduleRoutes = [
  [API_ROUTES.health, createHealthModuleRouter()],
  [API_ROUTES.shops, createShopsModuleRouter()],
  [API_ROUTES.orders, createOrdersModuleRouter()],
  [API_ROUTES.coupons, createCouponsModuleRouter()],
] as const;

export const createApiModuleRouter = (): Router => {
  const router = Router();

  for (const [path, moduleRouter] of moduleRoutes) {
    router.use(path, moduleRouter);
  }

  return router;
};
