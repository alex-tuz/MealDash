import { NextFunction, Request, Response } from "express";

import { ERROR_CODES, HTTP_STATUS } from "../constants/app.constants";
import { AppError } from "../errors/app-error";
import { logger } from "../logger/logger";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const timestamp = new Date().toISOString();

  if (error instanceof AppError) {
    logger.warn("Handled application error", {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
    });

    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
        details: error.details ?? null,
        timestamp,
      },
    });
    return;
  }

  logger.error("Unhandled server error", { error });

  res.status(HTTP_STATUS.internalServerError).json({
    error: {
      code: ERROR_CODES.internalServerError,
      message: "Internal server error",
      details: null,
      timestamp,
    },
  });
};
