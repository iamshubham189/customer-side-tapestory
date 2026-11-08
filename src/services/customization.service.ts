import { FIGMA_ASSETS } from "@/config/assets";
import { SEED_FABRICS, SEED_PRODUCTS, SEED_SAVED_DESIGNS } from "@/lib/backend/seed-data";
import type { FabricOption, GarmentConfiguration, SavedDesign } from "@/types";

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  priceDeltaInr: number;
}

export interface DetailCategoryOptions {
  key: keyof GarmentConfiguration["details"];
  label: string;
  iconSvg: string;
  options: {
    label: string;
    description: string;
    priceDeltaInr: number;
  }[];
}

export const STUDIO_STYLE_OPTIONS: StyleOption[] = [
  {
    id: "relaxed-fit",
    name: "Relaxed Fit",
    description: "An easy silhouette with room to layer and unhurried drape.",
    priceDeltaInr: 0,
  },
  {
    id: "classic-fit",
    name: "Classic Fit",
    description: "Balanced structure through the shoulder and chest with clean lines.",
    priceDeltaInr: 0,
  },
  {
    id: "tailored-sculpted",
    name: "Tailored / Sculpted Fit",
    description: "Contoured waist and closer armhole pitch for architectural poise.",
    priceDeltaInr: 250,
  },
];

export const STUDIO_DETAIL_CATEGORIES: DetailCategoryOptions[] = [
  {
    key: "collar",
    label: "Collar",
    iconSvg: FIGMA_ASSETS.icons.detailCollar,
    options: [
      { label: "Stand collar", description: "Clean architectural mandarin band", priceDeltaInr: 0 },
      { label: "Camp / Cuban collar", description: "Relaxed open-neck lapel", priceDeltaInr: 0 },
      { label: "Classic Point collar", description: "Structured everyday shirt collar", priceDeltaInr: 0 },
      { label: "Notch Lapel", description: "Softly tailored jacket lapel", priceDeltaInr: 250 },
    ],
  },
  {
    key: "sleeves",
    label: "Sleeves",
    iconSvg: FIGMA_ASSETS.icons.detailSleeves,
    options: [
      { label: "Full sleeves", description: "Cut to your exact wrist bone measurement", priceDeltaInr: 0 },
      { label: "Roll-tab sleeves", description: "Full sleeve with internal button tab", priceDeltaInr: 150 },
      { label: "Three-quarter sleeves", description: "Cropped mid-forearm proportion", priceDeltaInr: 0 },
      { label: "Half sleeves", description: "Relaxed elbow-grazing cut", priceDeltaInr: -100 },
    ],
  },
  {
    key: "cuffs",
    label: "Cuffs",
    iconSvg: FIGMA_ASSETS.icons.detailCuffs,
    options: [
      { label: "Buttoned cuffs", description: "Single-button adjustable barrel cuff", priceDeltaInr: 0 },
      { label: "Two-button mitered cuff", description: "Angled tailoring cuff with two horn buttons", priceDeltaInr: 150 },
      { label: "Turn-back open cuff", description: "Clean unfastened resort finish", priceDeltaInr: 0 },
    ],
  },
  {
    key: "length",
    label: "Length",
    iconSvg: FIGMA_ASSETS.icons.detailLength,
    options: [
      { label: "Regular hip-length", description: "Balanced proportion hitting mid-hip", priceDeltaInr: 0 },
      { label: "Cropped / Boxy (-3 cm)", description: "Contemporary higher break at waist", priceDeltaInr: 0 },
      { label: "Longline (+4 cm)", description: "Extended coverage with side vents", priceDeltaInr: 200 },
    ],
  },
  {
    key: "buttons",
    label: "Buttons",
    iconSvg: FIGMA_ASSETS.icons.detailButtons,
    options: [
      { label: "Natural horn buttons", description: "Organic mottled dark espresso horn", priceDeltaInr: 250 },
      { label: "Corozo nut buttons", description: "Matte botanical ivory/earth buttons", priceDeltaInr: 0 },
      { label: "Mother of pearl", description: "Iridescent smoked shell buttons", priceDeltaInr: 350 },
      { label: "Concealed placket", description: "Minimalist hidden front closure", priceDeltaInr: 150 },
    ],
  },
  {
    key: "pockets",
    label: "Pockets",
    iconSvg: FIGMA_ASSETS.icons.detailPockets,
    options: [
      { label: "Four utility flap pockets", description: "Signature field jacket bellow pockets", priceDeltaInr: 0 },
      { label: "Twin lower patch pockets", description: "Clean chore-style lower pockets", priceDeltaInr: 0 },
      { label: "Single chest welt pocket", description: "Minimalist formal breast pocket", priceDeltaInr: 0 },
      { label: "No external pockets (Internal only)", description: "Sleek uninterrupted front panel", priceDeltaInr: 0 },
    ],
  },
];

export function createDefaultConfiguration(productSlugOrId?: string): GarmentConfiguration {
  const product =
    SEED_PRODUCTS.find(
      (p) => p.slug === productSlugOrId || p.id === productSlugOrId
    ) ?? SEED_PRODUCTS[0];

  const defaultFabric: FabricOption =
    SEED_FABRICS.find((f) => f.materialFamily === product.fabricFamily) ?? SEED_FABRICS[0];

  return {
    productId: product.id,
    productName: product.name,
    productImage: product.primaryImage,
    vendorId: product.vendorId,
    vendorName: product.vendorName,
    basePriceInr: product.startingPriceInr,
    styleSilhouette: STUDIO_STYLE_OPTIONS[0],
    fabric: {
      id: defaultFabric.id,
      name: defaultFabric.name,
      materialFamily: defaultFabric.materialFamily,
      composition: `${defaultFabric.name} (${defaultFabric.weightGsm} GSM)`,
      priceDeltaInr: defaultFabric.priceModifierInr,
      swatchImage: defaultFabric.swatchImage,
    },
    color: product.availableColors[0] ?? { name: "Deep Green", hex: "#172B24" },
    pattern: {
      id: "solid",
      name: "Solid",
    },
    details: {
      collar: "Stand collar",
      sleeves: "Full sleeves",
      cuffs: "Buttoned cuffs",
      length: "Regular hip-length",
      buttons: "Natural horn buttons",
      pockets: "Four utility flap pockets",
      lining: "Unlined breathable finish (+₹0)",
      fitPreference: "Relaxed / Easy",
    },
    personalNotes: "",
    monogram: "",
    referenceImageUrls: [],
    measurementProfileId: "meas-ananya-default",
    measurementProfileName: "Ananya — Everyday Relaxed Fit",
    totalEstimatedPriceInr: product.startingPriceInr + defaultFabric.priceModifierInr + 250,
  };
}

export function calculateEstimatedPrice(config: GarmentConfiguration): number {
  let detailDelta = 0;
  for (const cat of STUDIO_DETAIL_CATEGORIES) {
    const selectedLabel = config.details[cat.key];
    const match = cat.options.find((opt) => opt.label === selectedLabel);
    if (match) {
      detailDelta += match.priceDeltaInr;
    }
  }
  return Math.max(
    1499,
    config.basePriceInr +
      config.styleSilhouette.priceDeltaInr +
      config.fabric.priceDeltaInr +
      detailDelta
  );
}

export async function getInitialSavedDesigns(): Promise<SavedDesign[]> {
  return SEED_SAVED_DESIGNS;
}
