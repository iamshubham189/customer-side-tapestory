import type { BodyMeasurements, MeasurementUnit } from "@/types";

/**
 * TAPESTORY — Modular Future AI Body Scan Architecture (Phase 9)
 *
 * IMPORTANT ARCHITECTURAL BOUNDARY:
 * - Phase 1 (Initial Release) ships the interactive 3D Avatar Preview (`AvatarCanvas3D`)
 *   and Manual / Saved Measurement Profiles.
 * - Real camera-based AI Body Scan is planned for a future phase and is intentionally
 *   isolated behind this adapter contract so that MediaPipe BlazePose / TensorFlow.js
 *   or a cloud photogrammetry provider can be plugged in without modifying the
 *   existing `measurement.service.ts` or `/measurements` UI.
 */

export type BodyScanCapturePose = "front_a_pose" | "side_orthogonal_pose";

export interface BodyScanCameraConfig {
  facingMode: "user" | "environment";
  idealWidth: number;
  idealHeight: number;
  frameRate: number;
  countdownSeconds: number;
}

export interface PoseLandmarkPoint {
  index: number;
  name: string;
  x: number; // Normalized [0, 1]
  y: number; // Normalized [0, 1]
  z: number; // Relative depth
  visibility: number; // Confidence [0, 1]
}

export interface BodyScanEnvironmentCheck {
  lightingAdequate: boolean;
  estimatedLuxLevel: "low" | "optimal" | "overexposed";
  devicePitchDegrees: number;
  isDeviceVertical: boolean;
  subjectDistanceMeters: number;
  isFullBodyInFrame: boolean;
  blockingWarnings: string[];
}

export interface BodyScanCalibrationInput {
  knownHeightCm: number;
  unitPreference: MeasurementUnit;
  frontLandmarks: PoseLandmarkPoint[];
  sideLandmarks: PoseLandmarkPoint[];
  devicePitchDegrees: number;
}

export interface BodyScanCalibrationResult {
  pixelsPerCmScale: number;
  perspectiveCorrectionFactor: number;
  overallConfidence: number; // [0, 1]
  isCalibrated: boolean;
}

export interface BodyScanMeasurementEstimate {
  estimatedValuesCm: BodyMeasurements;
  perDimensionConfidence: Partial<Record<keyof BodyMeasurements, number>>;
  requiresManualReviewFields: (keyof BodyMeasurements)[];
  calibration: BodyScanCalibrationResult;
  capturedAtIso: string;
}

export interface BodyScanEstimationEngine {
  readonly engineId: string;
  readonly version: string;
  validateEnvironment(frame: {
    brightnessScore: number;
    devicePitchDegrees: number;
    landmarks: PoseLandmarkPoint[];
  }): BodyScanEnvironmentCheck;
  calibrate(input: BodyScanCalibrationInput): BodyScanCalibrationResult;
  estimateMeasurements(input: BodyScanCalibrationInput): Promise<BodyScanMeasurementEstimate>;
}

export const DEFAULT_BODY_SCAN_CAMERA_CONFIG: BodyScanCameraConfig = {
  facingMode: "user",
  idealWidth: 1920,
  idealHeight: 1080,
  frameRate: 30,
  countdownSeconds: 5,
};

/**
 * Validates lighting, phone tilt angle, and full-body visibility before allowing capture.
 */
export function validateCaptureEnvironment(params: {
  brightnessScore: number;
  devicePitchDegrees: number;
  landmarks: PoseLandmarkPoint[];
}): BodyScanEnvironmentCheck {
  const warnings: string[] = [];

  const lightingAdequate = params.brightnessScore >= 0.35 && params.brightnessScore <= 0.92;
  const estimatedLuxLevel: BodyScanEnvironmentCheck["estimatedLuxLevel"] =
    params.brightnessScore < 0.35
      ? "low"
      : params.brightnessScore > 0.92
        ? "overexposed"
        : "optimal";

  if (!lightingAdequate) {
    warnings.push(
      estimatedLuxLevel === "low"
        ? "Room lighting is too dim for accurate silhouette edge detection."
        : "Strong backlighting detected. Stand facing an even light source."
    );
  }

  const isDeviceVertical = Math.abs(params.devicePitchDegrees) <= 4.5;
  if (!isDeviceVertical) {
    warnings.push(
      `Phone tilt is ${params.devicePitchDegrees.toFixed(1)}°. Prop your phone upright within ±4.5° of vertical.`
    );
  }

  const highVisibilityCount = params.landmarks.filter((lm) => lm.visibility >= 0.75).length;
  const isFullBodyInFrame = highVisibilityCount >= 24;
  if (!isFullBodyInFrame) {
    warnings.push("Step back to 2.0–2.4 meters so both ankles, shoulders, and head are visible.");
  }

  return {
    lightingAdequate,
    estimatedLuxLevel,
    devicePitchDegrees: params.devicePitchDegrees,
    isDeviceVertical,
    subjectDistanceMeters: 2.2,
    isFullBodyInFrame,
    blockingWarnings: warnings,
  };
}

/**
 * Elliptical Ramanujan circumference approximation from orthogonal front (major axis 2a)
 * and side (minor axis 2b) silhouettes.
 */
export function approximateEllipticalCircumferenceCm(
  frontWidthCm: number,
  sideDepthCm: number
): number {
  const a = Math.max(frontWidthCm / 2, 1);
  const b = Math.max(sideDepthCm / 2, 1);
  const h = Math.pow(a - b, 2) / Math.pow(a + b, 2);
  const circumference = Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  return Number(circumference.toFixed(1));
}
