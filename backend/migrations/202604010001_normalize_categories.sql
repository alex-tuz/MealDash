BEGIN;

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_categories_name UNIQUE (name)
);

INSERT INTO categories (name)
SELECT DISTINCT p.category
FROM products p
WHERE p.category IS NOT NULL
ON CONFLICT (name) DO NOTHING;

ALTER TABLE products
ADD COLUMN IF NOT EXISTS category_id UUID;

UPDATE products p
SET category_id = c.id
FROM categories c
WHERE c.name = p.category
  AND p.category_id IS NULL;

ALTER TABLE products
ALTER COLUMN category_id SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'fk_products_category_id'
  ) THEN
    ALTER TABLE products
    ADD CONSTRAINT fk_products_category_id
    FOREIGN KEY (category_id)
    REFERENCES categories (id)
    ON DELETE RESTRICT;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products (category_id);

DROP INDEX IF EXISTS idx_products_category;
ALTER TABLE products DROP COLUMN IF EXISTS category;

COMMIT;
