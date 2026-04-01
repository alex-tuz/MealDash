import { z } from 'zod';

import { ERROR_CODES, HTTP_STATUS } from '../../common/constants/app.constants';
import { AppError } from '../../common/errors/app-error';
import { ShopFilterDto, ShopSortOrder } from './dto/shop-filter.dto';

const getShopsQuerySchema = z
  .object({
    sort: z.nativeEnum(ShopSortOrder).optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    maxRating: z.coerce.number().min(0).max(5).optional(),
  })
  .refine(
    (value) =>
      value.minRating === undefined ||
      value.maxRating === undefined ||
      value.minRating <= value.maxRating,
    {
      message: 'minRating must be less than or equal to maxRating',
      path: ['minRating'],
    },
  );

export const parseShopsFilters = (query: unknown): ShopFilterDto => {
  const parseResult = getShopsQuerySchema.safeParse(query);

  if (!parseResult.success) {
    throw new AppError(
      HTTP_STATUS.badRequest,
      'Invalid shops query params',
      ERROR_CODES.appError,
      parseResult.error.flatten(),
    );
  }

  return parseResult.data;
};
