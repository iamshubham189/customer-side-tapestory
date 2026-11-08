import {
  SEED_FABRICS,
  SEED_PRODUCTS,
  SEED_REVIEWS,
} from "@/lib/backend/seed-data";
import { isSupabaseConfigured } from "@/lib/backend/supabase-client";
import type { FabricMaterialFamily, FabricOption, Product, ReviewItem } from "@/types";

export interface ProductFilterParams {
  query?: string;
  category?: string;
  gender?: "All" | "Men" | "Women" | "Unisex";
  fabricFamily?: FabricMaterialFamily | "All";
  occasion?: string;
  colorName?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "featured" | "price-asc" | "price-desc" | "rating" | "newest";
}

export async function getAllProducts(filters?: ProductFilterParams): Promise<Product[]> {
  let products = [...SEED_PRODUCTS];

  if (!filters) {
    return products;
  }

  if (filters.query && filters.query.trim().length > 0) {
    const q = filters.query.toLowerCase().trim();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.vendorName.toLowerCase().includes(q) ||
        p.fabricFamily.toLowerCase().includes(q)
    );
  }

  if (filters.category && filters.category !== "All" && filters.category !== "All Styles") {
    products = products.filter(
      (p) => p.category.toLowerCase() === filters.category!.toLowerCase()
    );
  }

  if (filters.gender && filters.gender !== "All") {
    products = products.filter(
      (p) => p.gender === filters.gender || p.gender === "Unisex"
    );
  }

  if (filters.fabricFamily && filters.fabricFamily !== "All") {
    products = products.filter((p) => p.fabricFamily === filters.fabricFamily);
  }

  if (filters.occasion && filters.occasion !== "All") {
    products = products.filter((p) =>
      p.occasion.some((occ) => occ.toLowerCase().includes(filters.occasion!.toLowerCase()))
    );
  }

  if (filters.colorName && filters.colorName !== "All") {
    products = products.filter((p) =>
      p.availableColors.some(
        (c) => c.name.toLowerCase() === filters.colorName!.toLowerCase()
      )
    );
  }

  if (typeof filters.minPrice === "number") {
    products = products.filter((p) => p.startingPriceInr >= filters.minPrice!);
  }

  if (typeof filters.maxPrice === "number") {
    products = products.filter((p) => p.startingPriceInr <= filters.maxPrice!);
  }

  switch (filters.sortBy) {
    case "price-asc":
      products.sort((a, b) => a.startingPriceInr - b.startingPriceInr);
      break;
    case "price-desc":
      products.sort((a, b) => b.startingPriceInr - a.startingPriceInr);
      break;
    case "rating":
      products.sort((a, b) => b.ratingAvg - a.ratingAvg);
      break;
    case "newest":
      products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      break;
    default:
      break;
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export async function getSimilarProducts(productId: string, limit = 4): Promise<Product[]> {
  const current = SEED_PRODUCTS.find((p) => p.id === productId);
  const others = SEED_PRODUCTS.filter((p) => p.id !== productId);
  if (!current) return others.slice(0, limit);

  const prioritized = others.sort((a, b) => {
    const aScore =
      (a.category === current.category ? 2 : 0) +
      (a.fabricFamily === current.fabricFamily ? 1 : 0);
    const bScore =
      (b.category === current.category ? 2 : 0) +
      (b.fabricFamily === current.fabricFamily ? 1 : 0);
    return bScore - aScore;
  });

  return prioritized.slice(0, limit);
}

export async function getAllFabrics(): Promise<FabricOption[]> {
  return SEED_FABRICS;
}

export async function getProductReviews(productId: string): Promise<ReviewItem[]> {
  const direct = SEED_REVIEWS.filter((r) => r.targetId === productId);
  return direct.length > 0 ? direct : SEED_REVIEWS;
}

export function getDataSourceMode(): "supabase" | "seed-fallback" {
  return isSupabaseConfigured() ? "supabase" : "seed-fallback";
}
