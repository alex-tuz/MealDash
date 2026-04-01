# Food Delivery Backend

Base backend setup for Sprint 1 Task 01.

## Included
- Node.js + TypeScript + Express project structure
- Layered module structure: controller -> service -> repository
- DTO-first data contracts under module `dto` folders
- Environment config validation (zod)
- PostgreSQL connection check on startup (pg)
- Health check endpoint: `GET /health`
- Basic logger and unified error response format

## Architecture (backend/src)
- modules/
   - health/ (implemented)
   - shops/ (skeleton)
   - products/ (skeleton)
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
