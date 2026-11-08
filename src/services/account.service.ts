import {
  SEED_ADDRESSES,
  SEED_FAQS,
  SEED_NOTIFICATIONS,
  SEED_SUPPORT_TICKETS,
} from "@/lib/backend/seed-data";
import type { Address, NotificationItem, SupportTicket } from "@/types";

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  memberSince: string;
  preferredFit: string;
  preferredUnit: "cm" | "in";
  preferredLanguage: string;
  preferredFabrics: string[];
  preferredColors: string[];
  avatarInitials: string;
  verifiedPhone: boolean;
  verifiedEmail: boolean;
}

export const DEFAULT_CUSTOMER_PROFILE: CustomerProfile = {
  id: "usr-ananya-rao",
  fullName: "Ananya Rao",
  email: "ananya.rao@tapestory.in",
  phone: "+91 98765 43210",
  memberSince: "August 2026",
  preferredFit: "Relaxed / Easy",
  preferredUnit: "cm",
  preferredLanguage: "English (India)",
  preferredFabrics: ["European Flax Linen", "Organic Cotton", "Tussar Silk"],
  preferredColors: ["Deep Green", "Warm Ivory", "Sand Beige"],
  avatarInitials: "AR",
  verifiedPhone: true,
  verifiedEmail: true,
};

export async function getCustomerProfile(): Promise<CustomerProfile> {
  return DEFAULT_CUSTOMER_PROFILE;
}

export async function getCustomerAddresses(): Promise<Address[]> {
  return SEED_ADDRESSES;
}

export async function getInitialNotifications(): Promise<NotificationItem[]> {
  return SEED_NOTIFICATIONS;
}

export async function getInitialSupportTickets(): Promise<SupportTicket[]> {
  return SEED_SUPPORT_TICKETS;
}

export async function getHelpFaqs() {
  return SEED_FAQS;
}
