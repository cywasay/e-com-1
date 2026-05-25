# Phase 0 — Scope & product decisions

**Project:** uniforms.ae (new e-com)  
**Status:** Locked for Phases 1–8  
**Last updated:** 2026-05-25

---

## 1. Product model (locked)

| Decision | Choice |
|----------|--------|
| **Buyer model** | **Single shop** — one catalog and one site; behavior changes by login role |
| **Guest pricing** | **Retail/list prices visible**; wholesale/tier pricing only after login |
| **B2C checkout** | **Full self-serve** — cart → Stripe checkout |
| **B2B primary action** | **Request Quote** — line items → admin quotes queue (Hoffmeyer-style) |
| **Brand pages** | **Yes, later** — reserve in sitemap; build in Phase 9 |
| **Marketplace** | **In scope (vision)** — multi-brand / multi-storefront is part of the product; not active in Phases 1–8 UI |

### How to read this

- **Phases 1–8** ship a polished **single storefront** (uniforms.ae) with clear B2C vs B2B rules.
- **Phase 9+** activates marketplace features (vendor storefronts, brands admin, financials, etc.).
- Admin stubs for marketplace stay in the repo but stay **hidden from nav** until their phase.

---

## 2. Role matrix

What each actor sees and can do on the **storefront** (Phases 1–8 target).

| Capability | Guest | B2C customer | B2B (pending) | B2B (approved) | Admin |
|------------|-------|--------------|---------------|----------------|-------|
| Browse catalog | ✅ | ✅ | ✅ | ✅ | ✅ |
| See retail/list price | ✅ | ✅ | ✅ | ✅ | — |
| See wholesale/tier price | ❌ | ❌ | ❌ | ✅ | — |
| Add to cart | ✅ | ✅ | ❌ | ❌* | — |
| Stripe checkout | ❌ | ✅ | ❌ | ❌ | — |
| Request quote (PDP / cart) | ✅** | ✅** | ✅ | ✅ | — |
| Wholesale application | — | — | ✅ (submitted) | — | — |
| Account area | ❌ | ✅ | ✅ | ✅ | — |
| Admin panel | ❌ | ❌ | ❌ | ❌ | ✅ |

\* *Approved B2B uses quote flow, not cart/checkout, unless we explicitly add “both” in a later phase.*  
\** *Guests can request quote via contact / quote form; PDP quote may require login — decide in Phase 3 UI.*

### Registration & approval

| Role | Register as | Approval |
|------|-------------|----------|
| B2C | `b2c_customer` | Immediate access |
| B2B | `b2b_buyer` | Admin approves via **B2B Applications**; until approved: retail pricing only, quote allowed |

---

## 3. Sitemap

### Storefront — live now

| Route | Purpose | Phase |
|-------|---------|-------|
| `/` | Home | 1 (polish), 2 (sections) |
| `/products` | Catalog grid + filters | 2 |
| `/products/[slug]` | Product detail | 2–3 |
| `/catalogs` | PDF catalog downloads | 7 |
| `/blog`, `/blog/[slug]` | Content | 7 |
| `/case-studies`, `/case-studies/[slug]` | Content | 7 |
| `/contact` | Contact + general quote | 3 |
| `/wholesale` | B2B application | 3 |
| `/login`, `/register` | Auth | 3 |
| `/cart` | Cart (B2C) | 4 |
| `/checkout` | Stripe checkout (B2C) | 4 |
| `/order/success` | Post-payment | 4 |

### Storefront — planned (Phases 2–5)

| Route | Purpose | Phase |
|-------|---------|-------|
| `/categories/[slug]` | Category hub (hero, subs, featured) | 2 |
| `/compare` | Product compare (`?slugs=`) | 2 |
| `/account` | Account dashboard | 5 |
| `/account/orders` | Order list | 4–5 |
| `/account/orders/[id]` | Order detail | 4 |
| `/account/addresses` | Shipping address | 5 |
| `/account/wholesale` | B2B status | 3 |
| `/account/profile` | Profile + password | 5 |
| `/privacy`, `/terms` | Legal | 1 |

### Storefront — reserved (Phase 9)

| Route | Purpose |
|-------|---------|
| `/brands` | Brand index |
| `/brands/[slug]` | Brand landing |
| `/store/[slug]` | Vendor / multi-site storefront |

### Admin — in sidebar (keep & polish)

| Route | Purpose | Phase |
|-------|---------|-------|
| `/admin` | Dashboard | 6 |
| `/admin/products` | Product CRUD | 6 |
| `/admin/categories` | Category tree | 6 |
| `/admin/orders` | Order ops | 6 |
| `/admin/quotes` | Quote pipeline | 3–6 |
| `/admin/b2b-applications` | B2B approvals | 6 |
| `/admin/pricing` | Price sets | 6 |
| `/admin/blog` | Blog CMS | 7 |
| `/admin/case-studies` | Case studies CMS | 7 |
| `/admin/catalogs` | PDF catalogs CMS | 7 |
| `/admin/settings` | Store settings | 6 |
| `/admin/sites` | Multi-site prep (internal) | 8–9 |
| `/admin/customers` | Customer list | 6 |

### Admin — hidden until Phase 9 (do not delete)

| Route | Reason deferred |
|-------|-----------------|
| `/admin/brands` | Brand pages Phase 9 |
| `/admin/storefronts` | Marketplace Phase 9 |
| `/admin/financials` | Marketplace Phase 9 |
| `/admin/users` | Admin user mgmt Phase 9 |
| `/admin/pending` | Vendor approvals Phase 9 |
| `/admin/suspended` | Vendor moderation Phase 9 |
| `/admin/contacts` | Merge into Quotes or Phase 9 |
| `/admin/b2b-approvals` | **Duplicate** — remove in Phase 6 |

---

## 4. Navigation (target)

### Header (all pages)

| Link | Audience | Notes |
|------|----------|-------|
| Logo → `/` | All | — |
| Catalog → `/products` | All | Phase 2: optional Products dropdown by category |
| Wholesale → `/wholesale` | All | **Add in Phase 1** (missing today) |
| Catalogs → `/catalogs` | All | — |
| Blog | All | — |
| Case Studies | All | — |
| Contact | All | — |
| Search | All | Phase 2 — icon + dropdown |
| Cart | B2C + guests | Hide or disable for approved B2B in Phase 3 |
| Login / Account | All | — |

### Footer

| Link | Phase |
|------|-------|
| Contact | Live |
| Privacy → `/privacy` | 1 |
| Terms → `/terms` | 1 |

### Account sidebar

| Link | B2C | B2B |
|------|-----|-----|
| Dashboard → `/account` | Phase 5 | Phase 5 |
| Orders | ✅ | ✅ |
| Addresses | ✅ | ✅ |
| Wholesale status | Hidden or “Apply” | ✅ |
| Profile | ✅ | ✅ (+ company fields) |

---

## 5. Page-level UI rules (Phases 1–8)

### Product detail (PDP)

| Role | Price shown | Primary CTA | Secondary |
|------|-------------|---------------|-----------|
| Guest | Retail/list | Request Quote | — |
| B2C | Retail | Add to Cart | Request Quote (optional) |
| B2B pending | Retail | Request Quote | — |
| B2B approved | Wholesale/tier | Request Quote | — |

### Catalog cards

- Always show **retail/list price** for guests and non-approved users.
- Show **“From $X wholesale”** or tier badge for approved B2B when logged in.
- Badges: In stock, MOQ (Phase 3), Featured (Phase 2).

### Cart & checkout

- **B2C only** for self-serve Stripe path.
- B2B buyers: cart hidden or replaced with **“Add to quote”** / quote builder (Phase 3).

---

## 6. Cut list & deferrals

### Remove in Phase 6

- `/admin/b2b-approvals` — duplicate of `/admin/b2b-applications`

### Hide from admin nav (keep files)

- brands, storefronts, financials, users, pending, suspended, contacts

### Do not build in Phases 1–8

- Public brand pages
- Vendor onboarding / split payouts
- Net terms / PO checkout
- Server-side cart (optional Phase 4 — not required for lock)
- Homepage fully API-driven (optional)

### Hoffmeyer patterns to adopt (UI reference)

- Category hub → listing → compare → PDP
- Listing: list/grid, filters, sort, stock badges
- Compare: sessionStorage + sticky bar + compare page
- Quote-first tone for B2B CTAs

### Hoffmeyer patterns to skip

- Fake “Add to cart” with no backend
- Admin-only login as storefront auth
- Static homepage forever (we may wire featured sections later)

---

## 7. Backend implications (by phase — for planning only)

| UI decision | Backend work |
|-------------|--------------|
| Guest retail pricing | Stop hiding all prices; return `base_retail_price` / list price on public API |
| B2B wholesale after approval | Enforce `b2b_status === approved` before tier pricing in `PricingService` |
| B2B quote from PDP | Extend `POST /quotes` with line items (product_id, qty, variant) |
| B2C cart/checkout | Keep Stripe; fix order success verify + `GET /orders/{id}` |
| Category hubs | `GET /categories/{slug}` with products (may exist — wire to frontend) |
| Compare / search | Mostly frontend; add `GET /search` in Phase 2 |
| Product visibility / MOQ | Enforce on public product endpoints in Phase 8 |
| Marketplace | Sites model exists; public multi-storefront = Phase 9 |

---

## 8. Success criteria for Phase 0

- [x] Buyer model chosen
- [x] Pricing visibility rules defined
- [x] B2C vs B2B actions defined
- [x] Sitemap drafted (now / planned / deferred)
- [x] Nav targets documented
- [x] Admin cut vs keep list documented
- [x] Marketplace scoped to Phase 9 with prep in admin

**Phase 0 complete.** Next: **Phase 1 — Design system & shell cleanup**.

---

## 9. Open items (resolve in Phase 1 or 3 UI)

1. **Guest quote on PDP** — allow without login, or require login/register?
2. **B2C secondary CTA** — show “Request Quote” on PDP in addition to Add to Cart?
3. **Cart for guests** — allow add-to-cart before login, gate at checkout only?
4. **Approved B2B** — ever allow cart for small reorders, or quote-only forever?

*Defaults if unanswered: guest quote via contact only; B2C PDP = Add to Cart only; guest cart allowed, login at checkout; B2B approved = quote only.*
