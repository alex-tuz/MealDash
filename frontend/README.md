# MealDash Frontend

- Vite + React + TypeScript
- Tailwind CSS (via Vite plugin)
- Axios API client with response interceptors
- Base routing for Shop and Shopping Cart pages

## Run

1. Install dependencies:
   npm install
2. Create env file:
   copy .env.example .env
3. Start dev server:
   npm run dev

By default, frontend runs on http://localhost:5173.

## Environment

Set API URL in .env:

VITE_API_BASE_URL=http://localhost:3000

## Structure

- src/pages - route pages
- src/components - layout and shared UI components
- src/store - state containers (prepared for task 09)
- src/api - axios client and API modules
