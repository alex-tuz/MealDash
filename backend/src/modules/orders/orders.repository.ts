import { pool } from '../../common/db/postgres';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemSnapshotDto } from './dto/order-item.dto';

interface ProductPriceRow {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  total_price: string | number;
  items: OrderItemSnapshotDto[];
  created_at: string;
}

interface CreateOrderResult {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalPrice: number;
  items: OrderItemSnapshotDto[];
  createdAt: string;
}

export class OrdersRepository {
  public async findProductsByIds(productIds: string[]): Promise<ProductPriceRow[]> {
    if (productIds.length === 0) {
      return [];
    }

    const result = await pool.query<
      Omit<ProductPriceRow, 'price'> & {
        price: string | number;
      }
    >(
      `
				SELECT id, name, image, price
				FROM products
				WHERE id = ANY($1)
			`,
      [productIds],
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      image: row.image,
      price: typeof row.price === 'number' ? row.price : Number(row.price),
    }));
  }

  public async createOrder(
    dto: CreateOrderDto,
    snapshotItems: OrderItemSnapshotDto[],
    totalPrice: number,
  ): Promise<CreateOrderResult> {
    const result = await pool.query<OrderRow>(
      `
				INSERT INTO orders (name, email, phone, address, total_price, items)
				VALUES ($1, $2, $3, $4, $5, $6::jsonb)
				RETURNING id, name, email, phone, address, total_price, items, created_at
			`,
      [dto.name, dto.email, dto.phone, dto.address, totalPrice, JSON.stringify(snapshotItems)],
    );

    const row = result.rows[0];

    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      totalPrice: typeof row.total_price === 'number' ? row.total_price : Number(row.total_price),
      items: row.items,
      createdAt: row.created_at,
    };
  }
}
