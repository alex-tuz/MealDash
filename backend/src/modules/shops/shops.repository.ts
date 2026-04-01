import { pool } from '../../common/db/postgres';
import { ShopFilterDto, ShopSortOrder } from './dto/shop-filter.dto';
import { ShopResponseDto } from './dto/shop-response.dto';

interface ShopRow {
  id: string;
  name: string;
  image: string;
  rating: string | number;
}

const SORT_SQL_BY_ORDER: Record<ShopSortOrder, string> = {
  [ShopSortOrder.nameAsc]: 'name ASC',
  [ShopSortOrder.nameDesc]: 'name DESC',
  [ShopSortOrder.ratingAsc]: 'rating ASC, name ASC',
  [ShopSortOrder.ratingDesc]: 'rating DESC, name ASC',
};

const DEFAULT_SORT_SQL = SORT_SQL_BY_ORDER[ShopSortOrder.nameAsc];

export class ShopsRepository {
  public async findAll(filters: ShopFilterDto): Promise<ShopResponseDto[]> {
    const whereParts: string[] = [];
    const values: number[] = [];

    if (typeof filters.minRating === 'number') {
      values.push(filters.minRating);
      whereParts.push(`rating >= $${values.length}`);
    }

    if (typeof filters.maxRating === 'number') {
      values.push(filters.maxRating);
      whereParts.push(`rating <= $${values.length}`);
    }

    const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';
    const sortClause = SORT_SQL_BY_ORDER[filters.sort ?? ShopSortOrder.nameAsc] ?? DEFAULT_SORT_SQL;

    const query = `
      SELECT id, name, image, rating
      FROM shops
      ${whereClause}
      ORDER BY ${sortClause}
    `;

    const result = await pool.query<ShopRow>(query, values);

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      image: row.image,
      rating: typeof row.rating === 'number' ? row.rating : Number(row.rating),
    }));
  }
}
