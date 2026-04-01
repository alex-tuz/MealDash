import { ProductsRepository } from './products.repository';

export class ProductsService {
  constructor(private readonly productsRepository: ProductsRepository) {
    void this.productsRepository;
  }
}
