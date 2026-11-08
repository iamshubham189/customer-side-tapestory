# File Structure — Tapestory Customer Website

```text
tapestory-customer/
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
├── .prettierrc
├── .env.example
├── backend/
│   └── supabase/
│       └── schema.sql                         # Full PostgreSQL schema + RLS policies
├── docs/                                      # 12 technical documentation guides
│   ├── PROJECT_OVERVIEW.md
│   ├── ARCHITECTURE.md
│   ├── FILE_STRUCTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_DOCUMENTATION.md
│   ├── AUTHENTICATION.md
│   ├── PAYMENT_INTEGRATION.md
│   ├── AVATAR_PREVIEW.md
│   ├── FUTURE_BODY_SCAN.md
│   ├── COMPONENT_GUIDE.md
│   ├── SETUP_GUIDE.md
│   └── CHANGELOG.md
├── public/
│   ├── images/                                # Downloaded Figma photography & swatches
│   ├── icons/                                 # Downloaded Figma SVG vector icons
│   ├── fonts/
│   └── models/
└── src/
    ├── app/
    │   ├── globals.css                        # Design tokens, Tailwind v4, editorial utilities
    │   ├── layout.tsx                         # Root layout with Playfair Display + Inter fonts
    │   ├── (auth)/
    │   │   ├── login/page.tsx                 # Email/Password, Phone OTP & Google OAuth login
    │   │   ├── signup/page.tsx                # Account registration & fit onboarding
    │   │   └── forgot-password/page.tsx       # Password reset workflow
    │   ├── (storefront)/
    │   │   ├── page.tsx                       # Homepage (Figma 5:4986)
    │   │   ├── products/page.tsx              # Product Listing (Figma 12:21208)
    │   │   ├── product/
    │   │   │   ├── page.tsx                   # Default product detail entry
    │   │   │   └── [slug]/page.tsx            # Product Details (Figma 12:21859)
    │   │   ├── vendors/
    │   │   │   ├── page.tsx                   # Default vendor profile entry
    │   │   │   └── [slug]/page.tsx            # Vendor Profile (Figma 12:22330)
    │   │   ├── customize/
    │   │   │   ├── page.tsx                   # 01 Customization Studio (Figma 20:30517)
    │   │   │   ├── preview/page.tsx           # 03 3D Preview & Virtual Try-On (Figma 20:31378)
    │   │   │   └── save/page.tsx              # 04 Save Design (Figma 20:31707)
    │   │   ├── measurements/page.tsx          # 02 Measurements (Figma 20:30942)
    │   │   ├── cart/page.tsx                  # 05 Cart (Figma 20:32049)
    │   │   ├── checkout/
    │   │   │   ├── page.tsx                   # 06 Checkout (Figma 20:32333)
    │   │   │   └── confirmation/page.tsx      # 07 Order Confirmation (Figma 20:32669)
    │   │   ├── orders/
    │   │   │   ├── page.tsx                   # 01 Order History (Figma 25:30550)
    │   │   │   ├── alteration/page.tsx        # Direct Reorder & Alteration route
    │   │   │   ├── review/page.tsx            # Direct Ratings & Reviews route
    │   │   │   └── [id]/
    │   │   │       ├── page.tsx               # 02 Order Tracking & Details (Figma 25:30903)
    │   │   │       ├── alteration/page.tsx    # 03 Reorder & Alteration (Figma 25:31268)
    │   │   │       └── review/page.tsx        # 04 Ratings & Reviews (Figma 25:31617)
    │   │   └── account/
    │   │       ├── page.tsx                   # 01 Profile Overview (Figma 25:57008)
    │   │       ├── measurements/page.tsx      # 02 Measurements Management (Figma 25:57333)
    │   │       ├── wishlist/page.tsx          # 03 Wishlist & Saved Designs (Figma 25:57670)
    │   │       ├── notifications/page.tsx     # 04 Notifications (Figma 25:57975)
    │   │       ├── support/page.tsx           # 05 Support & Help Centre (Figma 25:58277)
    │   │       └── settings/page.tsx          # 06 Settings (Figma 25:58595)
    │   └── api/
    │       └── payments/
    │           └── razorpay/
    │               ├── create-order/route.ts  # Server-side Razorpay order creation
    │               ├── verify/route.ts        # HMAC SHA256 payment verification
    │               └── webhook/route.ts       # Idempotent Razorpay webhook listener
    ├── components/
    │   ├── layout/
    │   │   ├── Header/
    │   │   ├── MobileNavigation/
    │   │   ├── Footer/
    │   │   ├── StudioHeader/
    │   │   └── AccountSidebar/
    │   ├── common/
    │   │   ├── Button/
    │   │   ├── SectionHeading/
    │   │   └── EditorialBlocks/
    │   ├── products/
    │   │   ├── ProductCard/
    │   │   └── TailorCard/
    │   └── avatar/
    │       └── AvatarCanvas3D/                # Interactive Three.js / R3F 3D Avatar
    ├── config/
    │   └── assets.ts                          # Central map of local Figma images & icons
    ├── features/
    │   ├── store-provider.tsx                 # Global state context & localStorage persistence
    │   └── measurements/
    │       └── body-scan/index.ts             # Phase 9 modular AI Body Scan contracts
    ├── lib/
    │   ├── backend/
    │   │   ├── supabase-client.ts
    │   │   ├── supabase-server.ts
    │   │   └── seed-data.ts
    │   ├── utils/
    │   │   ├── cn.ts
    │   │   └── format.ts
    │   └── validations/
    │       └── index.ts
    ├── services/
    │   ├── product.service.ts
    │   ├── vendor.service.ts
    │   ├── customization.service.ts
    │   ├── measurement.service.ts
    │   ├── order.service.ts
    │   ├── payment.service.ts
    │   └── account.service.ts
    └── types/
        └── index.ts
```
