import { pool } from '../../common/db/postgres';
import { ProductQueryDto, ProductSortOrder } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';

interface ProductRow {
  id: string;
  shop_id: string;
  name: string;
  image: string;
  price: string | number;
  category: string;
}

const SORT_SQL_BY_ORDER: Record<ProductSortOrder, string> = {
  [ProductSortOrder.priceAsc]: 'price ASC, name ASC',
  [ProductSortOrder.priceDesc]: 'price DESC, name ASC',
  [ProductSortOrder.nameAz]: 'name ASC',
};

const DEFAULT_LIMIT = 30;

export class ProductsRepository {
  public async shopExists(shopId: string): Promise<boolean> {
    const result = await pool.query<{ exists: boolean }>(
      'SELECT EXISTS(SELECT 1 FROM shops WHERE id = $1)',
      [shopId],
    );

    return result.rows[0]?.exists ?? false;
  }

  public async findByShopId(shopId: string, query: ProductQueryDto): Promise<ProductResponseDto[]> {
    const values: Array<string | number> = [shopId];
    const whereParts: string[] = ['shop_id = $1'];

    if (query.category) {
      values.push(query.category);
      whereParts.push(`category = $${values.length}`);
    }

    const orderBy = query.sort ? SORT_SQL_BY_ORDER[query.sort] : 'name ASC';
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    values.push(limit);
    const limitParam = `$${values.length}`;
    values.push(offset);
    const offsetParam = `$${values.length}`;

    const sql = `
			SELECT id, shop_id, name, image, price, category
			FROM products
			WHERE ${whereParts.join(' AND ')}
			ORDER BY ${orderBy}
			LIMIT ${limitParam}
			OFFSET ${offsetParam}
		`;

    const result = await pool.query<ProductRow>(sql, values);

    return result.rows.map((row) => ({
      id: row.id,
      shopId: row.shop_id,
      name: row.name,
      image: row.image,
      price: typeof row.price === 'number' ? row.price : Number(row.price),
      category: row.category,
    }));
  }
}
