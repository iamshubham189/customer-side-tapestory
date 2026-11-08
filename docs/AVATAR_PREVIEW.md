# 3D Avatar Preview & Virtual Try-On — Tapestory Customer Website

## 1. Overview & Honest Technical Framing

The **3D Avatar Preview** (`/customize/preview`, Figma `20:31378`) is part of the initial Phase 1 release and is powered by **Three.js**, **React Three Fiber (`@react-three/fiber`)**, and **Drei (`@react-three/drei`)** inside [`src/components/avatar/AvatarCanvas3D/AvatarCanvas3D.tsx`](../src/components/avatar/AvatarCanvas3D/AvatarCanvas3D.tsx).

In accordance with project guidelines:
- It renders a **real interactive WebGL 3D mannequin and parametric garment mesh** (never a static image disguised as 3D).
- It clearly communicates to customers that the 3D preview is a **proportion, colour, and silhouette visualization tool** driven by their selected measurement profile and fit ease (`Slim`, `Regular`, `Relaxed`), rather than a physics-grade cloth tension simulator.

---

## 2. Supported Interactive Capabilities

1. **Parametric Body Proportions:**
   - Scales torso chest/waist/hip radii, shoulder width, and limb proportions dynamically from the customer's active `MeasurementProfile` (`Aarav — Everyday Fit`, `Meera — Evening Fit`, etc.) and avatar body type (`Feminine`, `Masculine`, `Androgynous`).
2. **Real-Time Garment Mesh & Material Shader:**
   - Updates garment colour hex (`#c89d94` Soft Rose, `#5a6248` Olive Drab, `#d8cbb8` Raw Sand, `#1f2421` Deep Charcoal, etc.), surface roughness (matte linen vs subtle silk-cotton sheen), neckline geometry, sleeve length (`Sleeveless`, `Short`, `Elbow Puff`, `Full`), and skirt/jacket length (`Cropped`, `Regular`, `Midi`, `Maxi`).
3. **Camera Angle Presets & Orbit Controls:**
   - Customers can drag to orbit 360°, zoom, or click instant camera presets (`Front View`, `Side Profile`, `Back Drape`, `Collar & Sleeve Detail`).
4. **Drape & Ease Visualization:**
   - Switching between `Slim Fit`, `Regular Fit`, and `Relaxed Fit` adjusts the radial garment offset around the torso and updates the 4 fit-zone indicators (`Bust & Chest`, `Waist Ease`, `Hip Drape`, `Hem Length`).
5. **Side-by-Side Variation Comparison:**
   - Customers can compare Option A (e.g., Soft Rose Linen · Elbow Puff Sleeve) and Option B (e.g., Terracotta Linen · Three-Quarter Sleeve) directly inside `/customize/preview`.
