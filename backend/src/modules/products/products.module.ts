import { Router } from 'express';

import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { ProductsService } from './products.service';

export const createProductsModuleRouter = (): Router => {
  const router = Router({ mergeParams: true });
  const repository = new ProductsRepository();
  const service = new ProductsService(repository);
  const controller = new ProductsController(service);

  router.get('/', controller.getProductsByShop);

  return router;
};
