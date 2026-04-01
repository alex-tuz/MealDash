import { pool } from '../postgres';
import { logger } from '../../logger/logger';

interface ShopSeed {
  name: string;
  image: string;
  rating: number;
}

interface ProductSeed {
  shopName: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

interface CountRow {
  count: number;
}

const SHOPS: ShopSeed[] = [
  {
    name: 'Mc Donny',
    image: 'https://www.google.com/s2/favicons?domain=mcdonalds.com&sz=256',
    rating: 4.7,
  },
  {
    name: 'CFK',
    image: 'https://www.google.com/s2/favicons?domain=kfc.com&sz=256',
    rating: 4.5,
  },
  {
    name: 'Green Bowl',
    image: 'https://www.google.com/s2/favicons?domain=sweetgreen.com&sz=256',
    rating: 4.9,
  },
];

const PRODUCTS: ProductSeed[] = [
  {
    shopName: 'Mc Donny',
    name: 'Big Big Burger',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800',
    price: 8.99,
    category: 'burgers',
  },
  {
    shopName: 'Mc Donny',
    name: 'Cheese Burger',
    image: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=800',
    price: 7.49,
    category: 'burgers',
  },
  {
    shopName: 'Mc Donny',
    name: 'Fries XL',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',
    price: 3.99,
    category: 'snacks',
  },
  {
    shopName: 'CFK',
    name: 'Hot Wings 8 pcs',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800',
    price: 9.49,
    category: 'chicken',
  },
  {
    shopName: 'CFK',
    name: 'Chicken Bucket',
    image: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=800',
    price: 14.99,
    category: 'chicken',
  },
  {
    shopName: 'CFK',
    name: 'Cola 0.5L',
    image: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=800',
    price: 2.19,
    category: 'drinks',
  },
  {
    shopName: 'Green Bowl',
    name: 'Vegan Bowl',
    image: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800',
    price: 10.99,
    category: 'healthy',
  },
  {
    shopName: 'Green Bowl',
    name: 'Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800',
    price: 8.49,
    category: 'salads',
  },
  {
    shopName: 'Green Bowl',
    name: 'Orange Fresh',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd5bba3f?w=800',
    price: 3.79,
    category: 'drinks',
  },
  {
    shopName: 'Green Bowl',
    name: 'Protein Smoothie',
    image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?w=800',
    price: 5.59,
    category: 'drinks',
  },
];

const assertHttpsUrl = (value: string, label: string): void => {
  try {
    const parsed = new URL(value);

    if (parsed.protocol !== 'https:') {
      throw new Error('URL must use https');
    }
  } catch (error) {
    throw new Error(`Invalid image URL for ${label}: ${value}`, { cause: error });
  }
};

const validateSeedInput = (): void => {
  for (const shop of SHOPS) {
    assertHttpsUrl(shop.image, `shop \"${shop.name}\"`);
  }

  for (const product of PRODUCTS) {
    assertHttpsUrl(product.image, `product \"${product.name}\"`);
  }
};

const seedDatabase = async (): Promise<void> => {
  validateSeedInput();

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const shop of SHOPS) {
      await client.query(
        `
          INSERT INTO shops (name, image, rating)
          VALUES ($1, $2, $3)
          ON CONFLICT (name)
          DO UPDATE SET
            image = EXCLUDED.image,
            rating = EXCLUDED.rating,
            updated_at = NOW()
        `,
        [shop.name, shop.image, shop.rating],
      );
    }

    const shopsResult = await client.query<{ id: string; name: string }>(
      'SELECT id, name FROM shops WHERE name = ANY($1)',
      [SHOPS.map((shop) => shop.name)],
    );
    const shopIdsByName = new Map(shopsResult.rows.map((row) => [row.name, row.id]));

    const uniqueCategories = Array.from(new Set(PRODUCTS.map((product) => product.category)));

    for (const categoryName of uniqueCategories) {
      await client.query(
        `
          INSERT INTO categories (name)
          VALUES ($1)
          ON CONFLICT (name) DO NOTHING
        `,
        [categoryName],
      );
    }

    const categoriesResult = await client.query<{ id: string; name: string }>(
      'SELECT id, name FROM categories WHERE name = ANY($1)',
      [uniqueCategories],
    );
    const categoryIdsByName = new Map(categoriesResult.rows.map((row) => [row.name, row.id]));

    for (const product of PRODUCTS) {
      const shopId = shopIdsByName.get(product.shopName);

      if (!shopId) {
        throw new Error(`Shop not found for product seed: ${product.shopName}`);
      }

      const categoryId = categoryIdsByName.get(product.category);

      if (!categoryId) {
        throw new Error(`Category not found for product seed: ${product.category}`);
      }

      await client.query(
        `
          INSERT INTO products (shop_id, name, image, price, category_id)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (shop_id, name)
          DO UPDATE SET
            image = EXCLUDED.image,
            price = EXCLUDED.price,
            category_id = EXCLUDED.category_id,
            updated_at = NOW()
        `,
        [shopId, product.name, product.image, product.price, categoryId],
      );
    }

    const [{ count: seededShopsCount }] = (
      await client.query<CountRow>('SELECT COUNT(*)::int AS count FROM shops WHERE name = ANY($1)', [
        SHOPS.map((shop) => shop.name),
      ])
    ).rows;

    const [{ count: seededProductsCount }] = (
      await client.query<CountRow>(
        `
          SELECT COUNT(*)::int AS count
          FROM products p
          JOIN shops s ON s.id = p.shop_id
          WHERE s.name = ANY($1)
        `,
        [SHOPS.map((shop) => shop.name)],
      )
    ).rows;

    const [{ count: seededCategoriesCount }] = (
      await client.query<CountRow>(
        `
          SELECT COUNT(DISTINCT c.name)::int AS count
          FROM products p
          JOIN categories c ON c.id = p.category_id
          JOIN shops s ON s.id = p.shop_id
          WHERE s.name = ANY($1)
        `,
        [SHOPS.map((shop) => shop.name)],
      )
    ).rows;

    if (seededShopsCount < 3) {
      throw new Error(`Seed validation failed: expected at least 3 shops, got ${seededShopsCount}`);
    }

    if (seededProductsCount < 10) {
      throw new Error(`Seed validation failed: expected at least 10 products, got ${seededProductsCount}`);
    }

    if (seededCategoriesCount < 3) {
      throw new Error(
        `Seed validation failed: expected products from at least 3 categories, got ${seededCategoriesCount}`,
      );
    }

    await client.query('COMMIT');
    logger.info('Database seeding completed', {
      shopsCount: seededShopsCount,
      productsCount: seededProductsCount,
      categoriesCount: seededCategoriesCount,
    });
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Database seeding failed', { error });
    throw error;
  } finally {
    client.release();
  }
};

void seedDatabase()
  .then(() => pool.end())
  .catch(async () => {
    await pool.end();
    process.exit(1);
  });
