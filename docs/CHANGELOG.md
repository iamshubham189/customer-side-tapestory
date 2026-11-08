# Changelog — Tapestory Customer Website

## v1.0.0 — Complete Customer Website Implementation (2026-11-08)

### Phase 0: Figma Audit & Architecture Planning
- Audited all 4 pages and 21 screens of the Tapestory Figma file (`q3e61PlsaiMa4Hszn9pZdC`).
- Downloaded 161 static image and SVG icon assets into `public/images/` and `public/icons/`.
- Designed the Supabase PostgreSQL schema (`backend/supabase/schema.sql`) and architecture blueprint.

### Phase 1: Foundation, Services & Store Provider
- Initialized Next.js 15 App Router + TypeScript strict mode + Tailwind CSS v4 + MUI + Radix UI + Three.js/R3F.
- Built 7 domain services (`src/services/*.service.ts`), Zod schemas (`src/lib/validations/index.ts`), and `TapestoryProvider` (`src/features/store-provider.tsx`).

### Phase 2: Shared Layout & Component Library
- Built `Header`, `MobileNavigation`, `Footer`, `StudioHeader`, `AccountSidebar`, `Button`, `SectionHeading`, `EditorialBlocks`, `ProductCard`, and `TailorCard` in isolated component folders.

### Phase 3: Discovery & Products
- Implemented `/` (Homepage), `/products` (Product Listing), `/product/[slug]` (Product Details), and `/vendors/[slug]` (Vendor Profile).

### Phase 4: Customization Studio & Save Design
- Implemented `/customize` (`01 Customization Studio`) with live fabric/colour/detail configurator and `/customize/save` (`04 Save Design`).

### Phase 5: Measurements & 3D Avatar Preview
- Implemented `/measurements` (`02 Measurements`), `AvatarCanvas3D` (Three.js/R3F interactive 3D mannequin), and `/customize/preview` (`03 3D Preview and Virtual Try-On`).

### Phase 6: Cart, Checkout & Razorpay API
- Implemented `/cart`, `/checkout`, `/checkout/confirmation`, and server-side Razorpay routes (`/api/payments/razorpay/create-order`, `/verify`, `/webhook`).

### Phase 7: Authentication & Customer Account
- Implemented `/login`, `/signup`, `/forgot-password`, `/account`, `/account/measurements`, `/account/wishlist`, `/account/notifications`, and `/account/settings`.

### Phase 8: Orders, Post-Purchase & Support
- Implemented `/orders` (`01 Order History`), `/orders/[id]` (`02 Order Tracking & Details`), `/orders/[id]/alteration` (`03 Reorder & Alteration`), `/orders/[id]/review` (`04 Ratings & Reviews`), and `/account/support` (`05 Support`).

### Phase 9: Future AI Body Scan Module & Technical Documentation
- Created `src/features/measurements/body-scan/index.ts` and all 12 technical documentation files in `docs/`.
