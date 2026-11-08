import type { Product } from "@/types";

export interface ProductCardProps {
  product: Product;
  aspect?: "Portrait" | "Compact";
  layout?: "grid" | "list";
  showExtendedListingMeta?: boolean;
  onQuickView?: (product: Product) => void;
  className?: string;
}
