# Authentication Architecture — Tapestory Customer Website

## 1. Supported Authentication Methods

Tapestory supports three customer authentication flows across `/login`, `/signup`, and `/forgot-password`:

1. **Email & Password Authentication:**
   - Validated with Zod (`loginSchema` and `signupSchema` in `src/lib/validations/index.ts`).
   - Connects to `supabase.auth.signInWithPassword` / `supabase.auth.signUp` when Supabase environment variables are present, and synchronizes with `useTapestory().loginUser()` in local mode.
2. **Phone OTP Authentication (`+91` Mobile Verification):**
   - Customers can switch to the **Phone OTP** tab on `/login`, enter their 10-digit mobile number, request a 6-digit OTP (`supabase.auth.signInWithOtp`), and verify their session.
3. **Google OAuth (`Sign in with Google`):**
   - Triggers `supabase.auth.signInWithOAuth({ provider: "google" })` with redirect callback handling.

---

## 2. Onboarding & Fit Profile Linking

During `/signup`, customers can optionally pre-select:
- Their preferred measurement unit (`Centimeters (cm)` or `Inches (in)`)
- Their preferred fit block (`Men`, `Women`, or `Unisex`)

These preferences initialize their default `CustomerProfile` and measurement workspace so their first visit to `/customize` or `/measurements` is pre-configured.

---

## 3. Session & Security Controls (`/account/settings`)

Inside `/account/settings` (`06 Settings`), authenticated customers can:
- Update their password (`Current Password` → `New Password` → `Confirm New Password`).
- Enable or disable **Two-Factor Authentication (2FA)** via SMS/Email OTP.
- Inspect active device sessions (`MacBook Pro · Bengaluru, India` and `iPhone 15 · Bengaluru, India`) and sign out of all other devices.
- Sign out immediately via the sidebar or settings card (`logoutUser()`).
