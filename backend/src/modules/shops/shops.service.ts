import { ShopResponseDto } from './dto/shop-response.dto';
import { parseShopsFilters } from './shops-query.parser';
import { ShopsRepository } from './shops.repository';

export class ShopsService {
  constructor(private readonly shopsRepository: ShopsRepository) {}

  public async listShops(query: unknown): Promise<ShopResponseDto[]> {
    const filters = parseShopsFilters(query);
    return this.shopsRepository.findAll(filters);
  }
}
