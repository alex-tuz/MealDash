BEGIN;

CREATE UNIQUE INDEX IF NOT EXISTS ux_shops_name ON shops (name);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES shops (id) ON DELETE CASCADE,
  name VARCHAR(160) NOT NULL,
  image TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  category VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_products_shop_name UNIQUE (shop_id, name)
);

CREATE INDEX IF NOT EXISTS idx_products_shop_id ON products (shop_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);

COMMIT;
