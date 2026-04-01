import { z } from 'zod';

import { ERROR_CODES, HTTP_STATUS } from '../../common/constants/app.constants';
import { AppError } from '../../common/errors/app-error';
import { ProductResponseDto } from './dto/product-response.dto';
import { parseProductsQuery } from './products-query.parser';
import { ProductsRepository } from './products.repository';

const uuidSchema = z.string().uuid();

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {}

  public async listByShop(shopId: string, query: unknown): Promise<ProductResponseDto[]> {
    const parsedShopId = uuidSchema.safeParse(shopId);

    if (!parsedShopId.success) {
      throw new AppError(HTTP_STATUS.notFound, 'Shop not found', ERROR_CODES.notFound, {
        shopId,
      });
    }

    const filters = parseProductsQuery(query);
    const shopExists = await this.productsRepository.shopExists(parsedShopId.data);

    if (!shopExists) {
      throw new AppError(HTTP_STATUS.notFound, 'Shop not found', ERROR_CODES.notFound, {
        shopId: parsedShopId.data,
      });
    }

    return this.productsRepository.findByShopId(parsedShopId.data, filters);
  }
}
