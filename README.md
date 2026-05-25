# uniforms.ae — E-commerce Platform

Single-shop B2C/B2B uniform storefront with Laravel API and Next.js frontend.

## Stack

| Layer | Tech |
|-------|------|
| Backend | Laravel 11, Sanctum, SQLite/MySQL |
| Frontend | Next.js 16, React, TanStack Query, Zustand |
| Payments | Stripe Checkout (B2C) |
| B2B | Quote requests + wholesale application flow |

## Local development

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 20+
- Stripe test keys (optional, for checkout)

### Backend

```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php -S 127.0.0.1:8080 -t public
```

API base: `http://127.0.0.1:8080/api/v1`

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: `http://localhost:3000`

### Test accounts (after seed)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@uniforms.ae | password |
| Admin Staff | staff@uniforms.ae | password |

## Environment variables

### Backend (`backend/.env`)

| Variable | Purpose |
|----------|---------|
| `APP_URL` | Laravel app URL |
| `FRONTEND_URL` | Next.js URL (Stripe redirects, password reset links) |
| `CORS_ALLOWED_ORIGINS` | Comma-separated frontend origins |
| `SANCTUM_STATEFUL_DOMAINS` | Stateful auth domains |
| `STRIPE_SECRET_KEY` | Stripe secret |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_CURRENCY` | Default `aed` |

### Frontend (`frontend/.env.local`)

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

## Production deployment

1. **Backend** — deploy Laravel to any PHP host. Set `APP_ENV=production`, `APP_DEBUG=false`, configure DB, mail, and Stripe vars.
2. **Frontend** — deploy to Vercel. Set `NEXT_PUBLIC_API_URL` to your production API.
3. **CORS** — set `CORS_ALLOWED_ORIGINS` to your production frontend URL.
4. **Stripe webhook** — point to `POST /api/v1/webhooks/stripe` with `checkout.session.completed` event.

## Project phases

See `docs/phase-0-scope.md` for the full product scope and phase roadmap.

## Key routes

| Storefront | Admin |
|------------|-------|
| `/products` | `/admin/products` |
| `/contact` | `/admin/quotes` |
| `/wholesale` | `/admin/b2b-applications` |
| `/account` | `/admin/orders` |
| `/cart`, `/checkout` | `/admin/settings` |
