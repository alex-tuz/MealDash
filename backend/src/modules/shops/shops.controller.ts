import { Request, Response, NextFunction } from "express";

import { ShopsService } from "./shops.service";

export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  public getShops = async (_req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.shopsService.listShops();
      next();
    } catch (error) {
      next(error);
    }
  };
}
