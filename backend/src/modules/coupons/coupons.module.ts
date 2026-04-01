import { Router } from 'express';

import { CouponsController } from './coupons.controller';
import { CouponsRepository } from './coupons.repository';
import { CouponsService } from './coupons.service';

export const createCouponsModuleRouter = (): Router => {
  const router = Router();
  const repository = new CouponsRepository();
  const service = new CouponsService(repository);
  const controller = new CouponsController(service);

  router.get('/', controller.getCoupons);
  router.post('/apply', controller.applyCoupon);

  return router;
};
