import { pool } from '../../common/db/postgres';
import { ProductQueryDto, ProductSortOrder } from './dto/product-query.dto';
import { ProductResponseDto } from './dto/product-response.dto';

interface ProductRow {
  id: string;
  shop_id: string;
  name: string;
  image: string;
  price: string | number;
  category_name: string;
}

const SORT_SQL_BY_ORDER: Record<ProductSortOrder, string> = {
  [ProductSortOrder.priceAsc]: 'p.price ASC, p.name ASC',
  [ProductSortOrder.priceDesc]: 'p.price DESC, p.name ASC',
  [ProductSortOrder.nameAz]: 'p.name ASC',
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
    const whereParts: string[] = ['p.shop_id = $1'];

    if (query.categories && query.categories.length > 0) {
      const categoryPlaceholders = query.categories.map((category) => {
        values.push(category);
        return `$${values.length}`;
      });

      whereParts.push(`c.name IN (${categoryPlaceholders.join(', ')})`);
    }

    const orderBy = query.sort ? SORT_SQL_BY_ORDER[query.sort] : 'p.name ASC';
    const page = query.page ?? 1;
    const limit = query.limit ?? DEFAULT_LIMIT;
    const offset = (page - 1) * limit;

    values.push(limit);
    const limitParam = `$${values.length}`;
    values.push(offset);
    const offsetParam = `$${values.length}`;

    const sql = `
      SELECT p.id, p.shop_id, p.name, p.image, p.price, c.name AS category_name
      FROM products p
      JOIN categories c ON c.id = p.category_id
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
      category: row.category_name,
    }));
  }
}
