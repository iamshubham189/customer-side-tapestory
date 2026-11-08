# Project Overview — Tapestory Customer Website

## 1. Brand & Product Vision

**Tapestory** is a premium unisex made-to-measure fashion platform built around slow craftsmanship, breathable natural textiles, and individualized fit. Rather than forcing shoppers into standardized off-the-rack sizing (`S / M / L`), Tapestory pairs customers directly with verified independent Indian ateliers (*Studio Mira*, *Atelier Niva*, *Loom & Line*, *Kora Craft*, and *House of Verve*).

### Core Value Propositions
1. **Unisex Made-to-Measure:** Every silhouette can be tailored to any body measurement profile (`Men`, `Women`, or `Unisex` fit blocks) with Slim, Regular, or Relaxed ease.
2. **Co-Creation in the Studio:** Customers choose base silhouettes, fabrics (Belgian Linen, Handwoven Cotton-Linen, Mulberry Silk-Cotton, Organic Twill), colours, patterns, collars, sleeves, cuffs, garment lengths, buttons, pockets, and personal tailor notes.
3. **Interactive 3D Avatar Preview:** Customers inspect their chosen silhouette, fabric colour, neckline, sleeve length, and fit drape on an interactive Three.js 3D mannequin from Front, Side, Back, and Detail angles before ordering.
4. **Transparent Atelier Production Tracking:** Every order is tracked across 8 granular atelier milestones—from *Order Confirmed* and *Measurements Verified* to *Cutting & Stitching*, *Quality Check*, and *Delivered*.
5. **Post-Purchase Fit Care:** Complimentary 14-day post-delivery alteration requests and 1-click reorders using saved patterns and measurement profiles.

---

## 2. Target Audience & User Journeys

1. **First-Time Custom Shopper:**
   - Explores the Homepage (`/`) or Catalog (`/products`) → Inspects a garment (`/product/linen-field-jacket`) → Customizes fabric & details (`/customize`) → Enters guided manual measurements (`/measurements`) → Previews on the 3D Avatar (`/customize/preview`) → Completes Razorpay checkout (`/checkout`).
2. **Returning Wardrobe Builder:**
   - Opens Saved Designs (`/account/wishlist`) or Past Orders (`/orders`) → Uses 1-click Reorder with a new fabric colour (`/orders/ord-ts-1042/alteration`) or requests a complimentary hem adjustment → Shares verified product & atelier reviews (`/orders/ord-ts-1042/review`).

---

## 3. Design System Fidelity (Figma Source of Truth)

All 21 screens across the 4 pages of the approved Figma file (`q3e61PlsaiMa4Hszn9pZdC`) are implemented with strict fidelity:
- **Color Palette:** Warm alabaster canvas (`#f5efe6`), elevated ivory card surfaces (`#fbf8f3`), soft sand secondary panels (`#ede3d4`), hairline borders (`#d8cec1`), espresso ink (`#1c1a17`), warm muted stone (`#6a6258`), antique brass (`#b69a68`), and botanical status greens (`#2f5b3d`).
- **Typography:** Editorial serif headings (`Playfair Display`) paired with clean geometric sans-serif body and UI controls (`Inter`).
- **Mobile-First Breakpoints:** Designed progressively from Mobile (`360px–639px`) → Tablet (`640px–1023px`) → Desktop (`1024px–1439px`) → Large Desktop (`1440px+`).
