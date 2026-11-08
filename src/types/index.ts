export type GenderCategory = "Men" | "Women" | "Unisex" | "Occasion";
export type FabricMaterialFamily = "Linen" | "Cotton" | "Silk" | "Wool" | "Blends";
export type MeasurementUnit = "cm" | "in";
export type FitPreference = "Tailored / Sculpted" | "Regular / Classic" | "Relaxed / Easy";

export interface FabricOption {
  id: string;
  code: string;
  name: string;
  materialFamily: FabricMaterialFamily;
  subtitle: string;
  description: string;
  weightGsm: number;
  drapeNote: string;
  careInstructions: string;
  priceModifierInr: number;
  swatchImage: string;
  availableColors: {
    name: string;
    hex: string;
    ringSvg?: string;
  }[];
  availablePatterns: {
    id: string;
    name: string;
    description: string;
    iconSvg?: string;
  }[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  startingPriceInr: number;
  gender: "Men" | "Women" | "Unisex";
  category: string;
  occasion: string[];
  fabricFamily: FabricMaterialFamily;
  fabricSummary: string;
  careInformation: string[];
  fitSummary: string;
  leadTimeDays: string;
  isCustomizable: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  aspectRatio: "Portrait" | "Compact";
  primaryImage: string;
  galleryImages: string[];
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorLocation: string;
  vendorVerified: boolean;
  ratingAvg: number;
  reviewCount: number;
  availableColors: {
    name: string;
    hex: string;
  }[];
  customizationHighlights: {
    category: string;
    options: string[];
  }[];
}

export interface Vendor {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  storyParagraphs: string[];
  locationCity: string;
  locationState: string;
  establishedYear: number;
  verified: boolean;
  ratingAvg: number;
  reviewCount: number;
  ratingDistribution: {
    stars: number;
    percentage: number;
    count: number;
  }[];
  badges: string[];
  specializations: {
    title: string;
    description: string;
  }[];
  turnaroundDays: string;
  priceRangeInr: string;
  bannerImage: string;
  storyImage: string;
  cardImage: string;
  markInitials: string;
  portfolioItems: {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    featured?: boolean;
  }[];
}

export interface GarmentConfiguration {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  basePriceInr: number;
  styleSilhouette: {
    id: string;
    name: string;
    description: string;
    priceDeltaInr: number;
  };
  fabric: {
    id: string;
    name: string;
    materialFamily: FabricMaterialFamily;
    composition: string;
    priceDeltaInr: number;
    swatchImage: string;
  };
  color: {
    name: string;
    hex: string;
  };
  pattern: {
    id: string;
    name: string;
  };
  details: {
    collar: string;
    sleeves: string;
    cuffs: string;
    length: string;
    buttons: string;
    pockets: string;
    lining: string;
    fitPreference: FitPreference;
  };
  personalNotes: string;
  monogram?: string;
  referenceImageUrls: string[];
  measurementProfileId?: string;
  measurementProfileName?: string;
  totalEstimatedPriceInr: number;
}

export interface SavedDesign {
  id: string;
  name: string;
  collectionTag: string;
  status: "Saved" | "Draft";
  updatedAt: string;
  configuration: GarmentConfiguration;
}

export interface BodyMeasurements {
  chest: number;
  waist: number;
  seatHips: number;
  shoulderWidth: number;
  sleeveLength: number;
  garmentLength: number;
  neckCircumference: number;
  wristCircumference: number;
  bicep?: number;
  inseam?: number;
  heightCm?: number;
  weightKg?: number;
}

export interface MeasurementProfile {
  id: string;
  name: string;
  forPerson: string;
  genderFit: "Men" | "Women" | "Unisex";
  unit: MeasurementUnit;
  method: "Manual Entry" | "Saved Profile" | "AI Body Scan" | "Tailor Home Visit";
  fitPreference: FitPreference;
  postureNotes: string;
  isDefault: boolean;
  lastUpdated: string;
  version: number;
  values: BodyMeasurements;
  history: {
    version: number;
    date: string;
    note: string;
    summary: string;
  }[];
}

export interface CartItem {
  id: string;
  configuration: GarmentConfiguration;
  quantity: number;
  addedAt: string;
}

export type OrderStage =
  | "Order Confirmed"
  | "Pattern & Fabric Preparation"
  | "Cutting & Hand Tailoring"
  | "Finishing & Quality Check"
  | "Dispatched"
  | "Delivered"
  | "Cancelled";

export interface OrderTimelineStep {
  id: string;
  stage: string;
  status: "completed" | "current" | "upcoming";
  date: string;
  description: string;
  makerNote?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  placedDate: string;
  statusCategory: "Ongoing" | "Delivered" | "Cancelled";
  currentStage: OrderStage;
  estimatedDelivery: string;
  deliveredDate?: string;
  cancelledDate?: string;
  cancellationReason?: string;
  productId: string;
  productSlug: string;
  productName: string;
  productImage: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorLocation: string;
  fabricSummary: string;
  colorName: string;
  fitSummary: string;
  measurementProfileName: string;
  customDetailsSummary: string[];
  subtotalInr: number;
  customizationFeeInr: number;
  shippingInr: number;
  taxInr: number;
  discountInr: number;
  totalInr: number;
  paymentMethod: string;
  paymentStatus: "Paid" | "Pending" | "Refunded";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  shippingAddress: Address;
  trackingNumber?: string;
  courierPartner?: string;
  timeline: OrderTimelineStep[];
  eligibleForReview: boolean;
  eligibleForAlteration: boolean;
}

export interface Address {
  id: string;
  label: "Home" | "Work" | "Atelier Pickup" | "Other";
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface ReviewItem {
  id: string;
  orderId: string;
  orderNumber: string;
  type: "product" | "vendor";
  targetId: string;
  targetName: string;
  authorName: string;
  authorLocation?: string;
  rating: number;
  fitAccuracyRating?: number;
  craftsmanshipRating?: number;
  title: string;
  comment: string;
  garmentOrdered: string;
  fabricChosen: string;
  date: string;
  status: "Published" | "Under Review";
  verifiedPurchase: boolean;
}

export interface AlterationRequest {
  id: string;
  requestNumber: string;
  orderId: string;
  orderNumber: string;
  garmentName: string;
  vendorName: string;
  requestedAreas: string[];
  fitAdjustmentNotes: string;
  preferredResolution: "Atelier Alteration" | "Home Pickup & Return" | "Virtual Fit Consultation";
  pickupAddressId: string;
  status: "Submitted" | "Tailor Reviewing" | "In Alteration" | "Completed";
  submittedDate: string;
  estimatedCompletion: string;
}

export interface NotificationItem {
  id: string;
  category: "Order Updates" | "Offers & Launches" | "Style Recommendations";
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionLabel: string;
  actionHref: string;
  iconType: "scissors" | "truck" | "package" | "sparkles" | "tag" | "ruler" | "shirt";
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  orderNumber?: string;
  category: string;
  subject: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  createdAt: string;
  updatedAt: string;
  lastResponse: string;
}
