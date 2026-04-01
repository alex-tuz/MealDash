import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../../common/constants/app.constants';
import { toResponseEnvelope } from '../../common/interceptors/response.interceptor';
import { OrdersService } from './orders.service';

export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  public createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.ordersService.createOrder(req.body);
      res.status(HTTP_STATUS.ok).json(toResponseEnvelope(response));
    } catch (error) {
      next(error);
    }
  };

  public searchOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const email = req.query.email as string | undefined;
      const phone = req.query.phone as string | undefined;
      const orderId = req.query.id as string | undefined;

      const response = await this.ordersService.searchOrders(email, phone, orderId);
      res.status(HTTP_STATUS.ok).json(toResponseEnvelope(response));
    } catch (error) {
      next(error);
    }
  };
}
