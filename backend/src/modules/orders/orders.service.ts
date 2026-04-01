import { OrdersRepository } from './orders.repository';

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {
    void this.ordersRepository;
  }
}
