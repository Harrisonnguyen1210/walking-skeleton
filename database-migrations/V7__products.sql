CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0
);

INSERT INTO products (name, stock_quantity)
SELECT
  'Product ' || n AS name,
  (FLOOR(RANDOM() * 1000) + 1)::INTEGER AS stock_quantity
FROM generate_series(1, 1000000) AS s(n);

ALTER TABLE items
  ADD COLUMN user_count INT DEFAULT 0;

WITH item_user_counts AS (
  SELECT item_id, COUNT(*) AS user_count
  FROM users_to_items
  GROUP BY item_id
)
UPDATE items
  SET user_count = item_user_counts.user_count
  FROM item_user_counts
  WHERE items.id = item_user_counts.item_id;