import { SEED_ALTERATION_REQUESTS, SEED_ORDERS, SEED_REVIEWS } from "@/lib/backend/seed-data";
import type { AlterationRequest, Order, ReviewItem } from "@/types";

export async function getAllOrders(): Promise<Order[]> {
  return SEED_ORDERS;
}

export async function getOrderById(orderId: string): Promise<Order | undefined> {
  const normalized = orderId.replace(/^#/, "");
  return SEED_ORDERS.find(
    (o) =>
      o.id.toLowerCase() === normalized.toLowerCase() ||
      o.orderNumber.replace(/^#/, "").toLowerCase() === normalized.toLowerCase()
  );
}

export async function getInitialAlterationRequests(): Promise<AlterationRequest[]> {
  return SEED_ALTERATION_REQUESTS;
}

export async function getInitialCustomerReviews(): Promise<ReviewItem[]> {
  return SEED_REVIEWS;
}
