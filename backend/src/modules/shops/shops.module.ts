import { Router } from 'express';

import { ShopsController } from './shops.controller';
import { ShopsRepository } from './shops.repository';
import { ShopsService } from './shops.service';
import { createProductsModuleRouter } from '../products/products.module';

export const createShopsModuleRouter = (): Router => {
  const router = Router();
  const repository = new ShopsRepository();
  const service = new ShopsService(repository);
  const controller = new ShopsController(service);

  router.get('/', controller.getShops);
  router.use('/:id/products', createProductsModuleRouter());

  return router;
};
