import { z } from 'zod';

import { ERROR_CODES, HTTP_STATUS } from '../../common/constants/app.constants';
import { AppError } from '../../common/errors/app-error';
import { ProductQueryDto, ProductSortOrder } from './dto/product-query.dto';

const productsQuerySchema = z.object({
  category: z.union([z.string(), z.array(z.string())]).optional(),
  sort: z.nativeEnum(ProductSortOrder).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const parseProductsQuery = (query: unknown): ProductQueryDto => {
  const parsed = productsQuerySchema.safeParse(query);

  if (!parsed.success) {
    throw new AppError(
      HTTP_STATUS.badRequest,
      'Invalid products query params',
      ERROR_CODES.appError,
      parsed.error.flatten(),
    );
  }

  const rawCategory = parsed.data.category;
  const categoriesSource = Array.isArray(rawCategory)
    ? rawCategory
    : rawCategory
      ? rawCategory.split(',')
      : [];

  const categories = Array.from(
    new Set(categoriesSource.map((value) => value.trim()).filter((value) => value.length > 0)),
  );

  return {
    ...parsed.data,
    categories: categories.length > 0 ? categories : undefined,
  };
};
