import { SEED_MEASUREMENT_PROFILES } from "@/lib/backend/seed-data";
import { cmToInches, inchesToCm } from "@/lib/utils/format";
import type { BodyMeasurements, MeasurementProfile, MeasurementUnit } from "@/types";

export interface MeasurementFieldGuide {
  key: keyof BodyMeasurements;
  label: string;
  minCm: number;
  maxCm: number;
  stepInstruction: string;
  bodyZoneLabel: string;
}

export const MEASUREMENT_FIELD_GUIDES: MeasurementFieldGuide[] = [
  {
    key: "chest",
    label: "Chest / Bust Circumference",
    minCm: 70,
    maxCm: 165,
    stepInstruction:
      "Wrap the tape horizontally around the fullest part of your chest/bust, keeping the tape level under your arms and across your shoulder blades. Breathe naturally.",
    bodyZoneLabel: "Upper Torso · Line A",
  },
  {
    key: "waist",
    label: "Natural Waist",
    minCm: 55,
    maxCm: 155,
    stepInstruction:
      "Measure around the narrowest part of your natural waistline (just above the hip bone), keeping one finger comfortably behind the tape.",
    bodyZoneLabel: "Mid Torso · Line B",
  },
  {
    key: "seatHips",
    label: "Seat / Hips Circumference",
    minCm: 70,
    maxCm: 170,
    stepInstruction:
      "Stand with heels together and wrap the tape around the fullest part of your seat/hips, ensuring the tape remains parallel to the floor.",
    bodyZoneLabel: "Lower Torso · Line C",
  },
  {
    key: "shoulderWidth",
    label: "Shoulder Width (Point to Point)",
    minCm: 32,
    maxCm: 62,
    stepInstruction:
      "Measure across the natural curve of your upper back from the outer edge of the left shoulder bone (acromion) to the outer edge of the right shoulder bone.",
    bodyZoneLabel: "Upper Back · Line D",
  },
  {
    key: "sleeveLength",
    label: "Sleeve Length",
    minCm: 42,
    maxCm: 80,
    stepInstruction:
      "With your arm relaxed at your side and slightly bent, measure from the outer shoulder bone down over the elbow to the prominent wrist bone.",
    bodyZoneLabel: "Arm · Line E",
  },
  {
    key: "garmentLength",
    label: "Preferred Garment Length",
    minCm: 48,
    maxCm: 135,
    stepInstruction:
      "Measure vertically from the base of the side neck (where the shoulder seam meets the collar) straight down to where you want the hem to finish.",
    bodyZoneLabel: "Vertical Drop · Line F",
  },
  {
    key: "neckCircumference",
    label: "Neck Circumference",
    minCm: 30,
    maxCm: 56,
    stepInstruction:
      "Measure around the base of your neck where a shirt collar naturally sits, placing one finger inside the tape for comfortable breathing ease.",
    bodyZoneLabel: "Collar Base · Line G",
  },
  {
    key: "wristCircumference",
    label: "Wrist Circumference",
    minCm: 12,
    maxCm: 26,
    stepInstruction:
      "Measure snugly around the widest part of your wrist bone. Add +0.5 cm in your posture notes if you wear a wide mechanical watch.",
    bodyZoneLabel: "Cuff · Line H",
  },
];

export async function getInitialMeasurementProfiles(): Promise<MeasurementProfile[]> {
  return SEED_MEASUREMENT_PROFILES;
}

export function convertMeasurementsUnit(
  values: BodyMeasurements,
  fromUnit: MeasurementUnit,
  toUnit: MeasurementUnit
): BodyMeasurements {
  if (fromUnit === toUnit) return { ...values };
  const fn = toUnit === "in" ? cmToInches : inchesToCm;

  return {
    chest: fn(values.chest),
    waist: fn(values.waist),
    seatHips: fn(values.seatHips),
    shoulderWidth: fn(values.shoulderWidth),
    sleeveLength: fn(values.sleeveLength),
    garmentLength: fn(values.garmentLength),
    neckCircumference: fn(values.neckCircumference),
    wristCircumference: fn(values.wristCircumference),
    bicep: values.bicep ? fn(values.bicep) : undefined,
    inseam: values.inseam ? fn(values.inseam) : undefined,
    heightCm: values.heightCm,
    weightKg: values.weightKg,
  };
}
