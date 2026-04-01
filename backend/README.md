# Food Delivery Backend

## Included

- Node.js + TypeScript + Express project structure
- Layered module structure: controller -> service -> repository
- DTO-first data contracts under module `dto` folders
- Environment config validation (zod)
- PostgreSQL connection check on startup (pg)
- Health check endpoint: `GET /health`
- Shops endpoint: `GET /shops`
- Shop products endpoint: `GET /shops/:id/products`
- Basic logger and unified error response format

## Architecture (backend/src)

- modules/
  - health/ (implemented)
  - shops/ (implemented)
  - products/ (implemented for `GET /shops/:id/products`)
  - orders/ (skeleton)
  - coupons/ (skeleton)
- common/
  - constants/
  - filters/
  - interceptors/
  - pipes/
  - config/, db/, errors/, logger/, middleware/

## Run

1. Install dependencies:
   `npm install`
2. Create `.env` from `.env.example` and update `DATABASE_URL`.
3. Start in development mode:
   `npm run dev`

Server URL: `http://localhost:3000`
Health check: `http://localhost:3000/health`
Shops endpoint: `http://localhost:3000/shops`
Shop products endpoint: `http://localhost:3000/shops/:id/products`

## Database migrations and seed

1. Apply migrations:
  `npm run migrate:up`
2. Seed demo data (3+ shops, 10+ products):
  `npm run seed`

Seed script behavior:

- Uses upsert strategy by unique keys, so repeated runs do not create duplicates.
- Validates image URLs before writing to DB (must be valid `https` URLs).
- Verifies inserted dataset after write:
  - at least 3 shops
  - at least 10 products
  - products from at least 3 categories

## Expected health response

```json
{
  "data": {
    "status": "ok",
    "service": "food-delivery-backend",
    "database": "up",
    "timestamp": "2026-03-31T12:34:56.000Z"
  }
}
```

## GET /shops/:id/products

### Query params

- `category` (optional): product category filter
- `sort` (optional): `price_asc` | `price_desc` | `name_az`
- `page` (optional): page number, minimum `1`
- `limit` (optional): page size, minimum `1`, maximum `100`

### Request examples

```http
GET /shops/9e8611a1-43fd-4f74-94c0-a8f274b6e9b8/products
GET /shops/9e8611a1-43fd-4f74-94c0-a8f274b6e9b8/products?category=drinks
GET /shops/9e8611a1-43fd-4f74-94c0-a8f274b6e9b8/products?sort=price_desc&page=1&limit=12
```

### Success response example (200)

```json
{
  "data": [
    {
      "id": "2fd4de7b-5723-4f05-b4eb-1179fd6f1f37",
      "shopId": "9e8611a1-43fd-4f74-94c0-a8f274b6e9b8",
      "name": "Big Big Burger",
      "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
      "price": 8.99,
      "category": "burgers"
    }
  ]
}
```

### Not found response example (404)

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Shop not found",
    "details": {
      "shopId": "9f8bca16-7cf8-4bf5-ae8c-717595f9fd6f"
    },
    "timestamp": "2026-03-31T12:34:56.000Z"
  }
}
```
