import { pool } from '../../common/db/postgres';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderItemSnapshotDto } from './dto/order-item.dto';

interface ProductPriceRow {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface CouponRow {
  code: string;
  discount_percent: number;
}

interface OrderRow {
  id: string;
  order_number: number;
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
  orderNumber: number;
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
        RETURNING id, order_number, name, email, phone, address, total_price, items, created_at
			`,
      [dto.name, dto.email, dto.phone, dto.address, totalPrice, JSON.stringify(snapshotItems)],
    );

    const row = result.rows[0];

    return {
      id: row.id,
      orderNumber: row.order_number,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      totalPrice: typeof row.total_price === 'number' ? row.total_price : Number(row.total_price),
      items: row.items,
      createdAt: row.created_at,
    };
  }

  public async findCouponByCode(code: string): Promise<{ code: string; discountPercent: number } | null> {
    const result = await pool.query<CouponRow>(
      `
        SELECT code, discount_percent
        FROM coupons
        WHERE UPPER(code) = UPPER($1)
        LIMIT 1
      `,
      [code],
    );

    const row = result.rows[0];
    return row ? { code: row.code, discountPercent: row.discount_percent } : null;
  }

  public async findBySearchCriteria(
    email?: string,
    phone?: string,
    orderId?: string,
  ): Promise<CreateOrderResult[]> {
    const conditions: string[] = [];
    const values: Array<string | number> = [];

    if (email) {
      conditions.push(`email = $${values.length + 1}`);
      values.push(email);
    }

    if (phone) {
      conditions.push(`phone = $${values.length + 1}`);
      values.push(phone);
    }

    if (orderId) {
      if (/^\d+$/.test(orderId)) {
        conditions.push(`order_number = $${values.length + 1}`);
        values.push(Number(orderId));
      } else {
        conditions.push(`id = $${values.length + 1}`);
        values.push(orderId);
      }
    }

    if (conditions.length === 0) {
      return [];
    }

    const whereClause = conditions.join(' OR ');

    const result = await pool.query<OrderRow>(
      `
        SELECT id, order_number, name, email, phone, address, total_price, items, created_at
        FROM orders
        WHERE ${whereClause}
        ORDER BY created_at DESC
      `,
      values,
    );

    return result.rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      name: row.name,
      email: row.email,
      phone: row.phone,
      address: row.address,
      totalPrice: typeof row.total_price === 'number' ? row.total_price : Number(row.total_price),
      items: row.items,
      createdAt: row.created_at,
    }));
  }
}
