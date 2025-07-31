## Starting schema

```sql
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
```

## Query performance

### Select a product based on the name

```sql
SELECT * FROM products WHERE name = 'Product 42';
```

Average execution duration over 5 queries: 38.0504 ms


### Selecting products based on low stock quantity

```sql
SELECT * FROM products WHERE stock_quantity < 5;
```

Average execution duration over 5 queries: 41.8064 ms



## Added indexes

```sql
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_stock_quantity_low ON products (stock_quantity)WHERE stock_quantity < 5;
```

Results after adding the indexes:

### Select a product based on the name

```sql
SELECT * FROM products WHERE name = 'Product 42';
```

Average execution duration over 5 queries: 0.1562 ms


### Selecting products based on low stock quantity

```sql
SELECT * FROM products WHERE stock_quantity < 5;
```

Average execution duration over 5 queries: 7.8244 ms



=====================================================


## Starting schema

```sql
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL,
  year INTEGER NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

INSERT INTO students (name)
SELECT
  'Student ' || n AS name
FROM generate_series(1, 100000) AS s(n);

INSERT INTO enrollments (student_id, year)
SELECT
  id AS student_id,
  (FLOOR(RANDOM() * (2025 - 1990 + 1)) + 1990)::INTEGER AS year
FROM
  students;
```

## Query performance


```sql
SELECT
  enrollments.year,
  COUNT(*)
FROM enrollments
  JOIN students ON enrollments.student_id = students.id
GROUP BY enrollments.year
ORDER BY enrollments.year;
```

Average execution duration over 5 queries: 63.203 ms



## Denormalization

```sql
ALTER TABLE students
ADD COLUMN enrollment_year INTEGER;

UPDATE students
SET enrollment_year = enrollments.year
FROM enrollments
WHERE students.id = enrollments.student_id;

```


## Query and performance after denormalization

```sql
SELECT enrollment_year AS year, COUNT(*) AS student_count
FROM students
GROUP BY enrollment_year
ORDER BY enrollment_year;
```

Average execution duration over 5 queries: 30.4982
