import { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '../../common/constants/app.constants';
import { toResponseEnvelope } from '../../common/interceptors/response.interceptor';
import { ProductsService } from './products.service';

export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  public getProductsByShop = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const shopId = req.params.id;
      const response = await this.productsService.listByShop(shopId, req.query);

      res.status(HTTP_STATUS.ok).json(toResponseEnvelope(response));
    } catch (error) {
      next(error);
    }
  };
}
