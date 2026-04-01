import { ERROR_CODES, HTTP_STATUS } from '../../common/constants/app.constants';
import { AppError } from '../../common/errors/app-error';
import { OrderItemDto, OrderItemSnapshotDto } from './dto/order-item.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { parseCreateOrderPayload } from './orders-create-parser';
import { OrdersRepository } from './orders.repository';

const toMoney = (value: number): number => Math.round(value * 100) / 100;

export class OrdersService {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  public async createOrder(payload: unknown): Promise<OrderResponseDto> {
    const dto = parseCreateOrderPayload(payload);
    const products = await this.ordersRepository.findProductsByIds(
      dto.items.map((item: OrderItemDto) => item.productId),
    );

    const productsById = new Map(products.map((product) => [product.id, product]));
    const missingProductIds = dto.items
      .map((item: OrderItemDto) => item.productId)
      .filter((productId: string) => !productsById.has(productId));

    if (missingProductIds.length > 0) {
      throw new AppError(
        HTTP_STATUS.badRequest,
        'Some products do not exist',
        ERROR_CODES.appError,
        {
          missingProductIds,
        },
      );
    }

    const snapshotItems: OrderItemSnapshotDto[] = dto.items.map((item: OrderItemDto) => {
      const product = productsById.get(item.productId);

      if (!product) {
        throw new AppError(
          HTTP_STATUS.badRequest,
          'Some products do not exist',
          ERROR_CODES.appError,
          {
            missingProductIds: [item.productId],
          },
        );
      }

      return {
        productId: product.id,
        name: product.name,
        image: product.image,
        unitPrice: product.price,
        quantity: item.quantity,
      };
    });

    const totalPrice = toMoney(
      snapshotItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    );

    const createdOrder = await this.ordersRepository.createOrder(dto, snapshotItems, totalPrice);

    return {
      id: createdOrder.id,
      name: createdOrder.name,
      email: createdOrder.email,
      phone: createdOrder.phone,
      address: createdOrder.address,
      totalPrice: createdOrder.totalPrice,
      items: createdOrder.items,
      createdAt: createdOrder.createdAt,
    };
  }

  public async searchOrders(
    email?: string,
    phone?: string,
    orderId?: string,
  ): Promise<OrderResponseDto[]> {
    if (!email && !phone && !orderId) {
      return [];
    }

    const orders = await this.ordersRepository.findBySearchCriteria(email, phone, orderId);

    return orders.map((order) => ({
      id: order.id,
      name: order.name,
      email: order.email,
      phone: order.phone,
      address: order.address,
      totalPrice: order.totalPrice,
      items: order.items,
      createdAt: order.createdAt,
    }));
  }
}
