import { ZodTypeAny } from "zod";

import { AppError } from "../errors/app-error";
import { ERROR_CODES, HTTP_STATUS } from "../constants/app.constants";

export const validateWithSchema = <TSchema extends ZodTypeAny>(schema: TSchema, payload: unknown) => {
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError(
      HTTP_STATUS.badRequest,
      "Validation failed",
      ERROR_CODES.appError,
      parsed.error.flatten(),
    );
  }

  return parsed.data;
};
