# Future AI Body Scan Architecture — Tapestory Customer Website

## 1. Scope & Phased Rollout

- **Phase 1 (Current Production Build):** Implements Manual Guided Measurements (`/measurements`), Saved Measurement Profiles (`/account/measurements`), and the interactive Three.js 3D Avatar Preview (`/customize/preview`).
- **Future Phase (Phase 9 Architecture):** Camera-based **AI Body Scan** is architected as a plug-in module at [`src/features/measurements/body-scan/index.ts`](../src/features/measurements/body-scan/index.ts) so computer-vision landmark extraction can be enabled without rewriting the measurement store or UI.

---

## 2. Planned Technical Pipeline (`src/features/measurements/body-scan/index.ts`)

```mermaid
flowchart LR
    Cam["1. WebRTC Camera Stream (Front + Side Capture)"]
    Env["2. Environment & Gyroscope Validation"]
    Pose["3. 33-Point Pose Landmark Detection (BlazePose / TF.js)"]
    Calib["4. Height + Pitch Scale Calibration"]
    Ellipse["5. Elliptical Cross-Section Circumference Estimation"]
    Review["6. Customer Review & Profile Save"]

    Cam --> Env --> Pose --> Calib --> Ellipse --> Review
```

### Key Contracts Implemented in `src/features/measurements/body-scan/index.ts`
- `BodyScanCameraConfig` — Resolution (`1920x1080`), frame rate, and 5-second voice/visual countdown timer.
- `validateCaptureEnvironment()` — Verifies room brightness (`0.35–0.92`), phone vertical tilt angle (`±4.5°` via `DeviceOrientationEvent`), and full-body visibility (at least 24 of 33 landmarks above `0.75` confidence).
- `approximateEllipticalCircumferenceCm(frontWidthCm, sideDepthCm)` — Uses Ramanujan’s ellipse perimeter approximation from orthogonal front (`2a`) and side (`2b`) silhouettes.

---

## 3. Documented Limitations of Monocular Camera Body Scanning

1. **Lighting & Contrast Sensitivity:** Dim rooms or strong window backlighting blur silhouette boundaries, degrading chest and waist edge accuracy by `±2–3 cm`.
2. **Garment Occlusion:** Loose shirts or trousers hide true anatomical contours; users must wear form-fitting clothing during capture.
3. **Perspective Distortion (Camera Pitch & Distance):** If the smartphone is tilted >5° or placed closer than 1.8 meters, foreshortening skews torso-to-inseam ratios.
4. **Reference Scale Requirement:** Single-camera RGB sensors lack hardware depth (`LiDAR`), requiring an accurate self-reported user height (`cm`) or a reference calibration object (e.g., standard A4 sheet) to establish `pixelsPerCmScale`.
5. **Mandatory Human-in-the-Loop Review:** Because made-to-measure tailoring requires sub-centimeter confidence on collars and shoulders, all AI-estimated values must pass through the customer's manual review screen before saving to a `MeasurementProfile`.
