# Tapestory — Customer Website

**Tapestory** is a premium, unisex made-to-measure fashion platform that connects customers with independent Indian craft ateliers (*Studio Mira*, *Atelier Niva*, *Loom & Line*, *Kora Craft*, *House of Verve*). Customers can discover silhouettes across Men, Women, and Unisex lines, customize every garment detail in the interactive Customization Studio, manage body measurement profiles, preview their garment on an interactive 3D avatar, pay securely via Razorpay, and track every stage of hand-tailored production.

---

## 1. Confirmed Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) with React 19 & TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS v4, `shadcn/ui` primitives (Radix UI + CVA), Material UI (`@mui/material`) |
| **3D Experience** | Three.js (`three`), React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`) |
| **Backend & Database** | Supabase (`@supabase/supabase-js`, `@supabase/ssr` — PostgreSQL + Auth + Storage + RLS) with automatic local seed fallback (`src/lib/backend/seed-data.ts`) |
| **Payments** | Razorpay (Server-side Order Creation, HMAC SHA256 Signature Verification, Idempotent Webhook Handler) |
| **Validation** | Zod (`src/lib/validations/index.ts`) |

---

## 2. Implemented Feature Scope & Routes

### Page 1: Discovery & Products
- `/` — **Homepage** (Hero editorial, Shop by Category, Featured Collections, Trending Designs, New Arrivals, Verified Ateliers, 4-Step How It Works, About Tapestory, Editorial Testimonials)
- `/products` — **Product Listing** (Grid/List toggle, Gender/Category/Fabric/Occasion/Price filters, Search, Sort, Quick Customize)
- `/product/[slug]` & `/product` — **Product Details** (Interactive gallery, fabric swatches, colour palettes, custom highlights, size guide modal, verified reviews, similar pieces)
- `/vendors/[slug]` & `/vendors` — **Vendor / Atelier Profile** (Atelier switcher, craft story, specialization badges, portfolio lookbook, verified community reviews)

### Page 2: Customization, Measurements, 3D Preview & Checkout
- `/customize` — **01 Customization Studio** (6-step configurator: Style, Fabric, Colour & Pattern, Garment Details [Collar, Sleeve, Cuff, Length, Buttons, Pockets], Personal Notes & Reference Uploads, Live Price Calculation)
- `/measurements` — **02 Measurements** (Manual Entry with cm/in conversion, Illustrated Measurement Guide, Saved Profile Manager, Future AI Body Scan architectural preview)
- `/customize/preview` — **03 3D Preview & Virtual Try-On** (Real-time Three.js / React Three Fiber 3D mannequin with interactive orbit camera, Front/Side/Back/Detail presets, live garment mesh, fit drape indicators, Side-by-Side Variation Compare)
- `/customize/save` — **04 Save Design** (Save finished designs or drafts, share link generator, saved wardrobe collection)
- `/cart` — **05 Cart** (Custom spec expandable cards, quantity controls, coupon engine `WELCOME10` / `FIRSTFIT` / `ATELIER500`)
- `/checkout` — **06 Checkout** (Saved address selector, new shipping address form, Razorpay payment method selector, server-side order creation & signature verification)
- `/checkout/confirmation` — **07 Order Confirmation** (Production timeline preview, order receipt, customization & measurement summary)

### Page 3: Orders & Post-Purchase
- `/orders` — **01 Order History** (All / Ongoing / Delivered / Cancelled tabs, search by Order ID or design, empty/filtered/loading experience states)
- `/orders/[id]` — **02 Order Tracking & Details** (8-step atelier production timeline, garment & measurement spec card, craft partner card, live tracking & delivery details)
- `/orders/[id]/alteration` & `/orders/alteration` — **03 Reorder & Alteration** (4-mode reorder configurator + complimentary 14-day post-delivery alteration request workflow)
- `/orders/[id]/review` & `/orders/review` — **04 Ratings & Reviews** (Multi-criteria product & atelier review forms + verified feedback archive)

### Page 4: Authentication & Customer Account
- `/login`, `/signup`, `/forgot-password` — **Authentication** (Email & Password, Phone OTP, Google OAuth)
- `/account` — **01 Profile Overview** (Personal details, saved addresses, default measurement profile, active orders, style preferences)
- `/account/measurements` — **02 Measurements Management** (Create, edit, duplicate, set default, and view version history of measurement profiles)
- `/account/wishlist` — **03 Wishlist & Saved Designs** (Saved Products, Saved Custom Designs, In-Progress Studio Drafts)
- `/account/notifications` — **04 Notifications** (Order updates, fabric launches, style recommendations, notification channel toggles)
- `/account/support` — **05 Support & Help Centre** (Searchable FAQ accordion, interactive live concierge chat, Raise a Support Ticket form)
- `/account/settings` — **06 Account Settings** (Language, currency & measurement unit defaults, security/2FA, active sessions, GDPR data export)

---

## 3. Quick Start

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Copy environment variables (optional — app runs out-of-the-box with built-in seed data & simulated Razorpay mode)
cp .env.example .env.local

# 3. Start development server
npm run dev

# 4. Run strict TypeScript check & production build
npm run typecheck
npm run build
```

---

## 4. Technical Documentation Index (`docs/`)

1. [docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md) — Brand vision, personas, and end-to-end user journeys.
2. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — Frontend + Supabase + Razorpay system architecture.
3. [docs/FILE_STRUCTURE.md](docs/FILE_STRUCTURE.md) — Complete directory and route map.
4. [docs/DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) — PostgreSQL tables, relationships, and Row-Level Security (RLS) policies.
5. [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) — Next.js Route Handlers and service layer contracts.
6. [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) — Email/Password, Google OAuth, and Phone OTP flows.
7. [docs/PAYMENT_INTEGRATION.md](docs/PAYMENT_INTEGRATION.md) — Razorpay server-side order creation, HMAC verification, and webhook handling.
8. [docs/AVATAR_PREVIEW.md](docs/AVATAR_PREVIEW.md) — Three.js / React Three Fiber 3D Avatar & garment mesh pipeline.
9. [docs/FUTURE_BODY_SCAN.md](docs/FUTURE_BODY_SCAN.md) — Phase 9 modular AI Body Scan architecture & photogrammetry constraints.
10. [docs/COMPONENT_GUIDE.md](docs/COMPONENT_GUIDE.md) — Component folder conventions, design tokens, and shared primitives.
11. [docs/SETUP_GUIDE.md](docs/SETUP_GUIDE.md) — Local environment, Supabase SQL setup, and Razorpay configuration.
12. [docs/CHANGELOG.md](docs/CHANGELOG.md) — Phase-by-phase engineering changelog.
