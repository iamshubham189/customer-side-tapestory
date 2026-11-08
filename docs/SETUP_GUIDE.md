# Setup & Deployment Guide — Tapestory Customer Website

## 1. Prerequisites

- **Node.js:** v20.x or v22.x LTS
- **npm:** v10+
- **Git**

---

## 2. Local Development Setup

1. **Navigate to the project directory:**
   ```bash
   cd /Users/shubhamsharma/.gemini/antigravity/scratch/tapestory-customer
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure environment variables:**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   ```env
   # Supabase Configuration (Optional for local dev — seed fallback is automatic)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Razorpay Configuration (Optional for local dev — simulated mode is automatic)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

   # Site URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Database Provisioning (When connecting live Supabase):**
   Open the Supabase SQL Editor and run [`backend/supabase/schema.sql`](../backend/supabase/schema.sql) to create all tables, indexes, triggers, and Row-Level Security policies.

5. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## 3. Quality & Production Build Commands

```bash
# Run TypeScript strict type-checking
npm run typecheck

# Run ESLint
npm run lint

# Build production bundle
npm run build

# Start production server
npm run start
```
