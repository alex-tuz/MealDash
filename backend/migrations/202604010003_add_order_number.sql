BEGIN;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS order_number BIGSERIAL;

UPDATE orders
SET order_number = nextval(pg_get_serial_sequence('orders', 'order_number'))
WHERE order_number IS NULL;

ALTER TABLE orders
  ALTER COLUMN order_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number
  ON orders (order_number);

COMMIT;
