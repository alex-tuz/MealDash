import { pool } from '../../common/db/postgres';
import { CouponResponseDto } from './dto/coupon-response.dto';

interface CouponRow {
  id: string;
  name: string;
  code: string;
  discount_percent: number;
  image: string;
}

export class CouponsRepository {
  public async findAll(): Promise<CouponResponseDto[]> {
    const result = await pool.query<CouponRow>(
      `
        SELECT id, name, code, discount_percent, image
        FROM coupons
        ORDER BY discount_percent DESC, name ASC
      `,
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      discountPercent: row.discount_percent,
      image: row.image,
    }));
  }
}
