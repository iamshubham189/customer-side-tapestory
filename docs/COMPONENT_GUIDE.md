# Component Guide — Tapestory Customer Website

## 1. Component Directory Convention

Every reusable component in `src/components/` follows the strict folder convention required by the architecture specification:

```text
ComponentName/
├── ComponentName.tsx        # Implementation
├── ComponentName.types.ts   # Exported TypeScript props & interfaces
└── index.ts                 # Barrel export
```

---

## 2. Core Component Catalog

### Layout Components (`src/components/layout/`)
- **`Header`** (`src/components/layout/Header/`) — Sticky top navigation bar (`84px` height on desktop) with brand wordmark, primary links (`Men`, `Women`, `Unisex`, `Collections`, `Customize`, `Our Ateliers`), search trigger, wishlist counter, account link, cart drawer badge, and mobile drawer toggle.
- **`MobileNavigation`** (`src/components/layout/MobileNavigation/`) — Slide-over mobile navigation drawer with touch-friendly links, quick studio launch, and account shortcuts.
- **`StudioHeader`** (`src/components/layout/StudioHeader/`) — Focused step-progress header used across `/customize`, `/measurements`, `/customize/preview`, and `/customize/save`.
- **`AccountSidebar`** (`src/components/layout/AccountSidebar/`) — `280px` desktop / horizontal mobile pill navigation used across all 6 `/account/*` screens (`Profile Overview`, `Measurements`, `Wishlist`, `Notifications`, `Support`, `Settings`, `Logout`).
- **`Footer`** (`src/components/layout/Footer/`) — Warm charcoal (`#1c1a17`) editorial footer with newsletter signup, craft guarantees, and 4 navigation columns.

### Shared & Product Components (`src/components/common/` & `src/components/products/`)
- **`Button`** (`src/components/common/Button/`) — Supports `primary`, `secondary`, `outline`, and `ghost` variants with `sm`, `md`, `lg` sizes.
- **`SectionHeading`** (`src/components/common/SectionHeading/`) — Editorial eyebrow + `Playfair Display` title + optional subtitle and right-aligned link.
- **`EditorialBlocks`** (`src/components/common/EditorialBlocks/`) — Shared editorial quote banners and atelier craft highlights.
- **`ProductCard`** (`src/components/products/ProductCard/`) — Displays garment image, atelier name, fabric badge, price in INR, wishlist heart toggle, and `Customize` CTA.
- **`TailorCard`** (`src/components/products/TailorCard/`) — Displays atelier portrait/monogram, city, specialization tags, community rating, and `View Atelier` link.

### 3D Avatar Component (`src/components/avatar/AvatarCanvas3D/`)
- **`AvatarCanvas3D`** (`src/components/avatar/AvatarCanvas3D/`) — Interactive Three.js / React Three Fiber canvas with parametric body geometry, live garment shader, orbit controls, and camera view presets.
