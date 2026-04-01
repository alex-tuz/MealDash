import { Router } from 'express';

import { OrdersController } from './orders.controller';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';

export const createOrdersModuleRouter = (): Router => {
  const router = Router();
  const repository = new OrdersRepository();
  const service = new OrdersService(repository);
  const controller = new OrdersController(service);

  router.get('/', controller.searchOrders);
  router.post('/', controller.createOrder);

  return router;
};
