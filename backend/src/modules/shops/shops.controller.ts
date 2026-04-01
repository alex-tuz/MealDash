import { Request, Response, NextFunction } from 'express';

import { HTTP_STATUS } from '../../common/constants/app.constants';
import { toResponseEnvelope } from '../../common/interceptors/response.interceptor';
import { ShopsService } from './shops.service';

export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  public getShops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const response = await this.shopsService.listShops(req.query);

      res.status(HTTP_STATUS.ok).json(toResponseEnvelope(response));
    } catch (error) {
      next(error);
    }
  };
}
