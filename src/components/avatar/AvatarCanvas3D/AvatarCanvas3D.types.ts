import type { BodyMeasurements, GarmentConfiguration } from "@/types";

export type AvatarViewPreset = "Front" | "Side" | "Back" | "Orbit";

export type AvatarBodyRepresentation =
  | "Unisex Balanced"
  | "Feminine Contoured"
  | "Masculine Broad"
  | "Petite"
  | "Tall";

export interface AvatarCanvas3DProps {
  configuration: GarmentConfiguration;
  measurements?: BodyMeasurements;
  viewAngle: AvatarViewPreset;
  bodyRepresentation?: AvatarBodyRepresentation;
  fitOverride?: "Slim Fit" | "Regular Fit" | "Relaxed Fit";
  garmentLengthCm?: number;
  sleeveLengthCm?: number;
  showMeasurementRings?: boolean;
  className?: string;
}
