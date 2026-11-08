export interface EditorialImageCardProps {
  story?: "Craft" | "Campaign";
  label?: string;
  edition?: string;
  statement?: string;
  supportingCaption?: string;
  className?: string;
}

export interface CollectionCardProps {
  collection: "Formal Edit" | "Wedding Edit" | "Everyday Essentials" | "Fusion Wear";
  className?: string;
}

export interface CategoryImageCardProps {
  category: "Men" | "Women" | "Unisex" | "Occasion" | "Workwear" | "Casual";
  className?: string;
}

export interface FabricSwatchCardProps {
  material: "Linen" | "Cotton" | "Silk" | "Wool" | "Blends";
  className?: string;
}

export interface StepIndicatorProps {
  stepNumber: string;
  title: string;
  description: string;
  iconType: "shirt" | "layers" | "ruler" | "package";
  className?: string;
}

export interface FeatureBenefitItemProps {
  benefit:
    | "Made-to-measure fit"
    | "Premium materials"
    | "Skilled tailoring partners"
    | "Personalization"
    | "Order tracking";
  className?: string;
}

export interface TrustIndicatorProps {
  benefit: "Perfect Fit" | "Premium Fabrics" | "Tailored by Experts";
  className?: string;
}

export interface TestimonialCardProps {
  story: "Story 1" | "Story 2" | "Story 3";
  className?: string;
}
