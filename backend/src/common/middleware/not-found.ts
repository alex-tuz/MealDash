import { NextFunction, Request, Response } from "express";

import { ERROR_CODES, HTTP_STATUS } from "../constants/app.constants";
import { AppError } from "../errors/app-error";

export const notFoundHandler = (_req: Request, _res: Response, next: NextFunction): void => {
  next(new AppError(HTTP_STATUS.notFound, "Route not found", ERROR_CODES.notFound));
};
