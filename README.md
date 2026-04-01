# MealDash

MealDash is a food delivery app for browsing shops, filtering and sorting products, managing a cart, creating orders, searching order history, reordering past orders, and applying coupons at checkout.

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, React Hook Form, Zustand, Axios
- Backend: Node.js, Express, TypeScript, PostgreSQL, Zod
- Tooling: Docker Compose, ESLint, Prettier

## Implementation Level

### Base

- [x] Shops page with a list of shops from the database
- [x] Products grid for the selected shop
- [x] Add to cart
- [x] Cart page with quantity controls and removal
- [x] Checkout form with validation
- [x] Order submission to the database

### Middle

- [x] Responsive layout for mobile, tablet, and desktop
- [x] Product filtering by category
- [x] Product sorting by name and price
- [x] Shop filtering by rating range

### Advanced

- [x] Infinite scroll for products
- [x] Order history search by email, phone, and order id
- [x] Reorder from order history
- [x] Coupons page with copy-to-clipboard
- [x] Apply coupon on cart with discounted total

## One-Command Startup

Run the full stack with Docker:

```bash
docker compose up --build
```

This starts:
- PostgreSQL on `5432`
- Backend API on `3000`
- Frontend on `5173`

Open the app at:
- http://localhost:5173

## Local Startup Without Docker

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run migrate:up
npm run seed
npm run dev
```

Backend runs at http://localhost:3000.

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Frontend runs at http://localhost:5173.

## Environment Variables

### Backend

- `NODE_ENV` - development, test, or production
- `PORT` - backend port, default `3000`
- `DATABASE_URL` - PostgreSQL connection string

### Frontend

- `VITE_API_BASE_URL` - API base URL, default `/api`

## API Overview

### Health

```http
GET /health
```

### Shops

```http
GET /shops
GET /shops/:id/products
GET /shops/:id/products?category=drinks&sort=price_desc&page=1&limit=10
```

### Orders

```http
POST /orders
GET /orders?email=user@example.com
GET /orders?phone=+1234567890
GET /orders?id=order-uuid
```

### Coupons

```http
GET /coupons
POST /coupons/apply
```

Example coupon apply payload:

```json
{
  "code": "WELCOME10"
}
```

## Database

### Tables

- `shops` - shop name, image, rating
- `categories` - normalized product categories
- `products` - products linked to shops and categories
- `orders` - saved checkout data with order items snapshot
- `coupons` - promo codes with discount percent and image

### Seeded Demo Data

- 3 shops
- 27 products total
- 4 coupons
- categories normalized into a separate table

## Known Issues / Limitations

- Public deployment URL is not added yet.
- Screenshots are not included in the repository yet.
- Coupon list is seeded data and not connected to an admin editor.
- Order search is read-only and supports search by one criterion at a time.

## Project Structure

- `backend/` - Express API, migrations, and seeds
- `frontend/` - React UI
- `doc/` - task descriptions and sprint documentation
- `docker-compose.yml` - one-command local startup

## Verification

These commands were validated during implementation:

- `docker compose config`
- `npm run build` in `frontend`
- `npm run typecheck` in `backend`
- `npm run migrate:up`
- `npm run seed`

## Notes

The project is currently ready for local review and containerized startup. Add the public deployment URL later when the frontend and backend are published.
