import { pool } from '../../common/db/postgres';
import { CouponResponseDto } from './dto/coupon-response.dto';

interface CouponRow {
  id: string;
  name: string;
  code: string;
  discount_percent: number;
  image: string;
}

const mapCouponRow = (row: CouponRow): CouponResponseDto => ({
  id: row.id,
  name: row.name,
  code: row.code,
  discountPercent: row.discount_percent,
  image: row.image,
});

export class CouponsRepository {
  public async findAll(): Promise<CouponResponseDto[]> {
    const result = await pool.query<CouponRow>(
      `
        SELECT id, name, code, discount_percent, image
        FROM coupons
        ORDER BY discount_percent DESC, name ASC
      `,
    );

    return result.rows.map(mapCouponRow);
  }

  public async findByCode(code: string): Promise<CouponResponseDto | null> {
    const result = await pool.query<CouponRow>(
      `
        SELECT id, name, code, discount_percent, image
        FROM coupons
        WHERE UPPER(code) = UPPER($1)
        LIMIT 1
      `,
      [code],
    );

    const row = result.rows[0];
    return row ? mapCouponRow(row) : null;
  }
}
