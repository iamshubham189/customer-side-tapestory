import { SEED_PRODUCTS, SEED_REVIEWS, SEED_VENDORS } from "@/lib/backend/seed-data";
import type { Product, ReviewItem, Vendor } from "@/types";

export async function getAllVendors(): Promise<Vendor[]> {
  return SEED_VENDORS;
}

export async function getVendorBySlug(slug: string): Promise<Vendor | undefined> {
  return SEED_VENDORS.find((v) => v.slug === slug || v.id === slug);
}

export async function getVendorProducts(vendorId: string): Promise<Product[]> {
  return SEED_PRODUCTS.filter((p) => p.vendorId === vendorId);
}

export async function getVendorReviews(vendorId: string): Promise<ReviewItem[]> {
  const vendorReviews = SEED_REVIEWS.filter((r) => r.targetId === vendorId);
  return vendorReviews.length > 0 ? vendorReviews : SEED_REVIEWS;
}
