import { Router } from "express";

import { ShopsController } from "./shops.controller";
import { ShopsRepository, ShopsService } from "./shops.service";

export const createShopsModuleRouter = (): Router => {
  const router = Router();
  const repository = new ShopsRepository();
  const service = new ShopsService(repository);
  const controller = new ShopsController(service);

  router.get("/", controller.getShops);

  return router;
};
