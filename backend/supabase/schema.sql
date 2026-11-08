-- ============================================================================
-- TAPESTORY CUSTOMER PLATFORM — POSTGRESQL SCHEMA & RLS POLICIES (SUPABASE)
-- ============================================================================

create extension if not exists "uuid-ossp";

-- 1. Customer Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  phone text,
  avatar_url text,
  preferred_unit text not null default 'cm' check (preferred_unit in ('cm', 'in')),
  language text not null default 'English (India)',
  privacy_settings jsonb not null default '{"share_measurements_with_tailor": true, "save_scan_history": false, "marketing_emails": true}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Customer Addresses
create table if not exists public.addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text not null check (label in ('Home', 'Work', 'Atelier Pickup', 'Other')),
  recipient_name text not null,
  phone text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text not null,
  postal_code text not null,
  country text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- 3. Measurement Profiles
create table if not exists public.measurement_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  profile_name text not null,
  for_person text not null default 'Self',
  gender_fit text not null check (gender_fit in ('Men', 'Women', 'Unisex')),
  unit text not null default 'cm' check (unit in ('cm', 'in')),
  method text not null check (method in ('Manual Entry', 'Saved Profile', 'AI Body Scan', 'Tailor Home Visit')),
  fit_preference text not null default 'Regular / Classic',
  posture_notes text,
  measurements jsonb not null,
  is_default boolean not null default false,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 4. Measurement History
create table if not exists public.measurement_history (
  id uuid primary key default uuid_generate_v4(),
  measurement_profile_id uuid not null references public.measurement_profiles(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  change_note text,
  recorded_at timestamptz not null default now()
);

-- 5. Vendors / Tailoring Partners
create table if not exists public.vendors (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  tagline text not null,
  short_description text not null,
  story_paragraphs text[] not null default '{}',
  location_city text not null,
  location_state text not null,
  established_year integer not null default 2018,
  verified boolean not null default true,
  rating_avg numeric(3,2) not null default 4.80,
  review_count integer not null default 0,
  badges text[] not null default '{}',
  specializations jsonb not null default '[]'::jsonb,
  turnaround_days text not null default '10–14 days',
  price_range_inr text not null default '₹2,499 – ₹18,999',
  banner_image text not null,
  story_image text not null,
  card_image text not null,
  mark_initials text not null default 'AN',
  portfolio_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 6. Categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  gender_group text not null check (gender_group in ('Men', 'Women', 'Unisex', 'Occasion', 'Workwear', 'Casual')),
  description text not null,
  image_url text not null,
  sort_order integer not null default 0
);

-- 7. Fabrics
create table if not exists public.fabrics (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text not null,
  material_family text not null check (material_family in ('Linen', 'Cotton', 'Silk', 'Wool', 'Blends')),
  subtitle text not null,
  description text not null,
  weight_gsm integer not null,
  drape_note text not null,
  care_instructions text not null,
  price_modifier_inr integer not null default 0,
  swatch_image text not null,
  available_colors jsonb not null default '[]'::jsonb,
  available_patterns jsonb not null default '[]'::jsonb
);

-- 8. Products
create table if not exists public.products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  name text not null,
  subtitle text not null,
  description text not null,
  starting_price_inr integer not null,
  gender text not null check (gender in ('Men', 'Women', 'Unisex')),
  category text not null,
  occasion text[] not null default '{}',
  fabric_family text not null check (fabric_family in ('Linen', 'Cotton', 'Silk', 'Wool', 'Blends')),
  fabric_summary text not null,
  care_information text[] not null default '{}',
  fit_summary text not null,
  lead_time_days text not null default '10–12 business days',
  is_customizable boolean not null default true,
  is_trending boolean not null default false,
  is_new_arrival boolean not null default false,
  aspect_ratio text not null default 'Portrait' check (aspect_ratio in ('Portrait', 'Compact')),
  primary_image text not null,
  gallery_images text[] not null default '{}',
  rating_avg numeric(3,2) not null default 4.80,
  review_count integer not null default 0,
  available_colors jsonb not null default '[]'::jsonb,
  customization_highlights jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- 9. Saved Designs & Drafts
create table if not exists public.saved_designs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  measurement_profile_id uuid references public.measurement_profiles(id) on delete set null,
  name text not null,
  collection_tag text not null default 'Personal Atelier',
  status text not null default 'Saved' check (status in ('Saved', 'Draft')),
  configuration jsonb not null,
  estimated_price_inr integer not null,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- 10. Wishlists
create table if not exists public.wishlists (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

-- 11. Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  user_id uuid not null references public.profiles(id) on delete restrict,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  status_category text not null default 'Ongoing' check (status_category in ('Ongoing', 'Delivered', 'Cancelled')),
  current_stage text not null,
  estimated_delivery text not null,
  delivered_date text,
  cancelled_date text,
  cancellation_reason text,
  shipping_address_snapshot jsonb not null,
  subtotal_inr integer not null,
  customization_fee_inr integer not null default 0,
  shipping_inr integer not null default 0,
  tax_inr integer not null default 0,
  discount_inr integer not null default 0,
  total_inr integer not null,
  payment_method text not null check (payment_method in ('UPI', 'Card')),
  payment_status text not null default 'Pending' check (payment_status in ('Paid', 'Pending', 'Refunded')),
  idempotency_key text unique not null,
  tracking_number text,
  courier_partner text,
  timeline jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 12. Order Items
create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  vendor_id uuid not null references public.vendors(id) on delete restrict,
  title text not null,
  quantity integer not null default 1,
  unit_price_inr integer not null,
  configuration_snapshot jsonb not null,
  measurement_snapshot jsonb not null
);

-- 13. Payments (Razorpay)
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete restrict,
  provider text not null default 'razorpay',
  razorpay_order_id text unique not null,
  razorpay_payment_id text unique,
  razorpay_signature text,
  method text not null check (method in ('upi', 'card')),
  amount_inr integer not null,
  currency text not null default 'INR',
  status text not null default 'created' check (status in ('created', 'authorized', 'captured', 'failed', 'refunded')),
  webhook_event_id text unique,
  error_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 14. Alteration Requests
create table if not exists public.alteration_requests (
  id uuid primary key default uuid_generate_v4(),
  request_number text unique not null,
  order_id uuid not null references public.orders(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  requested_areas text[] not null,
  fit_adjustment_notes text not null,
  preferred_resolution text not null,
  pickup_address_snapshot jsonb not null,
  status text not null default 'Submitted' check (status in ('Submitted', 'Tailor Reviewing', 'In Alteration', 'Completed')),
  created_at timestamptz not null default now()
);

-- 15. Reviews (Product & Vendor)
create table if not exists public.reviews (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete restrict,
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('product', 'vendor')),
  target_id text not null,
  target_name text not null,
  rating smallint not null check (rating between 1 and 5),
  fit_accuracy_rating smallint check (fit_accuracy_rating between 1 and 5),
  craftsmanship_rating smallint check (craftsmanship_rating between 1 and 5),
  title text not null,
  comment text not null,
  status text not null default 'Published' check (status in ('Published', 'Under Review')),
  created_at timestamptz not null default now()
);

-- 16. Notifications & Support Tickets
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('Order Updates', 'Offers & Launches', 'Style Recommendations')),
  title text not null,
  message text not null,
  action_label text not null,
  action_href text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  ticket_number text unique not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  order_number text,
  category text not null,
  subject text not null,
  description text not null,
  status text not null default 'Open' check (status in ('Open', 'In Progress', 'Resolved')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.measurement_profiles enable row level security;
alter table public.measurement_history enable row level security;
alter table public.saved_designs enable row level security;
alter table public.wishlists enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.alteration_requests enable row level security;
alter table public.reviews enable row level security;
alter table public.notifications enable row level security;
alter table public.support_tickets enable row level security;

-- Public read access for catalog tables
alter table public.vendors enable row level security;
alter table public.categories enable row level security;
alter table public.fabrics enable row level security;
alter table public.products enable row level security;

create policy "Public read vendors" on public.vendors for select using (true);
create policy "Public read categories" on public.categories for select using (true);
create policy "Public read fabrics" on public.fabrics for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read published reviews" on public.reviews for select using (status = 'Published');

-- Authenticated user isolation policies
create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own addresses" on public.addresses for all using (auth.uid() = user_id);
create policy "Users manage own measurements" on public.measurement_profiles for all using (auth.uid() = user_id);
create policy "Users view own measurement history" on public.measurement_history for select using (auth.uid() = user_id);
create policy "Users manage own saved designs" on public.saved_designs for all using (auth.uid() = user_id);
create policy "Users manage own wishlist" on public.wishlists for all using (auth.uid() = user_id);
create policy "Users view own orders" on public.orders for select using (auth.uid() = user_id);
create policy "Users view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users manage own alterations" on public.alteration_requests for all using (auth.uid() = user_id);
create policy "Users create own reviews" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);
create policy "Users manage own support tickets" on public.support_tickets for all using (auth.uid() = user_id);
