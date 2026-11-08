"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import { calculateEstimatedPrice } from "@/services/customization.service";
import { convertMeasurementsUnit } from "@/services/measurement.service";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";
import { Header } from "@/components/layout/Header";
import { StudioHeader, StudioFooter } from "@/components/layout/StudioHeader";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
} from "@/components/common/Button";
import { SectionHeading } from "@/components/common/SectionHeading";
import type { MeasurementUnit } from "@/types";

export default function MeasurementsPage() {
  const router = useRouter();
  const {
    activeConfiguration,
    measurementProfiles,
    activeMeasurementProfileId,
    setActiveMeasurementProfileId,
    saveMeasurementProfile,
  } = useTapestory();

  const currentProfile =
    measurementProfiles.find((m) => m.id === activeMeasurementProfileId) ??
    measurementProfiles[0];

  const [activeMethod, setActiveMethod] = useState<
    "Manual Entry" | "Saved Profile" | "AI Body Scan"
  >("Manual Entry");
  const [unit, setUnit] = useState<MeasurementUnit>("cm");
  const [profileName, setProfileName] = useState<string>("Everyday Fit · Demo");

  const [values, setValues] = useState({
    chest: 96,
    waist: 80,
    seatHips: 98,
    shoulderWidth: 44,
    sleeveLength: 61,
    garmentLength: 72,
    inseam: 76,
    neckCircumference: 38,
    wristCircumference: 17,
  });

  const [activeGuideTip, setActiveGuideTip] = useState<string>(
    "Chest: keep the tape level, breathe naturally."
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [savedBannerVisible, setSavedBannerVisible] = useState<boolean>(true);
  const [scanSimStage, setScanSimStage] = useState<
    "idle" | "permission" | "ready" | "scanning" | "processing" | "complete"
  >("idle");

  const totalEstimateInr = calculateEstimatedPrice(activeConfiguration);

  const handleUnitChange = (nextUnit: MeasurementUnit) => {
    if (nextUnit === unit) return;
    const converted = convertMeasurementsUnit(values, unit, nextUnit);
    setValues({
      chest: converted.chest,
      waist: converted.waist,
      seatHips: converted.seatHips,
      shoulderWidth: converted.shoulderWidth,
      sleeveLength: converted.sleeveLength,
      garmentLength: converted.garmentLength,
      inseam: converted.inseam ?? 76,
      neckCircumference: converted.neckCircumference,
      wristCircumference: converted.wristCircumference,
    });
    setUnit(nextUnit);
  };

  const handleFieldChange = (
    key: keyof typeof values,
    rawVal: string,
    tip: string
  ) => {
    setActiveGuideTip(tip);
    const num = parseFloat(rawVal);
    setValues((prev) => ({
      ...prev,
      [key]: Number.isNaN(num) ? 0 : num,
    }));
    setValidationError(null);
  };

  const handleSaveManualMeasurements = () => {
    if (!values.shoulderWidth || values.shoulderWidth <= 0) {
      setValidationError("Add your shoulder measurement.");
      return;
    }
    if (!values.chest || !values.waist || !values.seatHips) {
      setValidationError("Please complete Chest, Waist and Hip measurements.");
      return;
    }
    setValidationError(null);
    saveMeasurementProfile({
      id: currentProfile.id,
      name: profileName,
      forPerson: currentProfile.forPerson,
      genderFit: currentProfile.genderFit,
      unit,
      method: "Manual Entry",
      fitPreference: currentProfile.fitPreference,
      postureNotes: currentProfile.postureNotes,
      isDefault: true,
      values: {
        ...values,
        heightCm: currentProfile.values.heightCm ?? 168,
        weightKg: currentProfile.values.weightKg ?? 61,
      },
      changeNote: `Saved in Measurement Studio (${unit})`,
    });
    setSavedBannerVisible(true);
  };

  const handleSelectExistingProfile = (profileId: string) => {
    setActiveMeasurementProfileId(profileId);
    const found = measurementProfiles.find((p) => p.id === profileId);
    if (found) {
      setProfileName(found.name);
      setUnit(found.unit);
      setValues({
        chest: found.values.chest,
        waist: found.values.waist,
        seatHips: found.values.seatHips,
        shoulderWidth: found.values.shoulderWidth,
        sleeveLength: found.values.sleeveLength,
        garmentLength: found.values.garmentLength,
        inseam: found.values.inseam ?? 76,
        neckCircumference: found.values.neckCircumference,
        wristCircumference: found.values.wristCircumference,
      });
      setActiveMethod("Saved Profile");
    }
  };

  const manualFields = [
    {
      key: "chest" as const,
      label: "Chest / Bust  ⓘ",
      helper: "Around the fullest part; keep tape level.",
      tip: "Chest: keep the tape level, breathe naturally.",
      nodeId: "20:31099",
    },
    {
      key: "waist" as const,
      label: "Waist  ⓘ",
      helper: "Around your natural waist, without pulling tight.",
      tip: "Waist: measure around your natural waist crease, relaxed posture.",
      nodeId: "20:31111",
    },
    {
      key: "seatHips" as const,
      label: "Hip  ⓘ",
      helper: "Around the widest part of your hips.",
      tip: "Hip: stand with feet together and wrap around the widest point.",
      nodeId: "20:31123",
    },
    {
      key: "shoulderWidth" as const,
      label: "Shoulder  ⓘ",
      helper: "Shoulder point to point, across the back.",
      tip: "Shoulder: measure bone-to-bone across the natural curve of your back.",
      nodeId: "20:31135",
    },
    {
      key: "sleeveLength" as const,
      label: "Sleeve Length  ⓘ",
      helper: "Shoulder point to wrist, elbow softly bent.",
      tip: "Sleeve: measure from outer shoulder bone over a softly bent elbow to wrist.",
      nodeId: "20:31147",
    },
    {
      key: "garmentLength" as const,
      label: "Garment Length  ⓘ",
      helper: "Shoulder beside neck to your desired hem.",
      tip: "Garment Length: measure from beside neck base vertically down to desired hem.",
      nodeId: "20:31159",
    },
    {
      key: "inseam" as const,
      label: "Inseam  ⓘ",
      helper: "Inner leg to ankle; optional for this jacket.",
      tip: "Inseam: inner leg to ankle bone; only required for trousers or suits.",
      nodeId: "20:31171",
    },
  ];

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="20:30942"
    >
      <Header />

      <StudioHeader
        breadcrumbLabel="Home / Product / Customize"
        eyebrow="THE CUSTOMIZATION STUDIO / 02"
        title="Let's Get Your Perfect Fit"
        description="Accurate measurements help us create clothing that feels made just for you."
        signatureQuote="Your story, in the making."
        activeStepIndex={4}
      />

      <main
        className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[48px] px-4 sm:px-8 lg:px-[72px] pb-[56px]"
        data-node-id="20:31043"
      >
        {/* GARMENT CONTEXT BANNER (20:31044) */}
        <section
          className="flex flex-col sm:flex-row sm:items-center gap-[18px] bg-[#e9e0d3] p-[16px] w-full"
          data-node-id="20:31044"
        >
          <div className="relative h-[76px] w-[60px] shrink-0 bg-[#f5f0e7] overflow-hidden">
            <img
              alt={activeConfiguration.productName}
              className="size-full object-cover"
              src={activeConfiguration.productImage}
            />
          </div>
          <div className="flex flex-1 flex-col gap-[6px] items-start">
            <p className="font-serif text-[23px] text-[#172b24]">
              Made around you, not a standard size.
            </p>
            <p className="font-sans text-[12px] text-[#706a60]">
              {activeConfiguration.productName} ·{" "}
              {activeConfiguration.styleSilhouette.name} ·{" "}
              {activeConfiguration.fabric.name} /{" "}
              {activeConfiguration.color.name} /{" "}
              {activeConfiguration.pattern.name} · Sample estimate{" "}
              {formatInr(totalEstimateInr)}
            </p>
          </div>
          <span className="bg-[#f5f0e7] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24] shrink-0">
            DEMONSTRATION DATA
          </span>
        </section>

        {/* CHOOSE ONE MEASUREMENT METHOD (20:31060) */}
        <section
          className="flex flex-col gap-[20px] items-start w-full"
          data-node-id="20:31060"
        >
          <SectionHeading
            eyebrow="CHOOSE ONE MEASUREMENT METHOD"
            title="Your fit, your way"
          />

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full"
            data-node-id="20:31065"
          >
            {/* Card 1: AI Body Scan */}
            <button
              type="button"
              onClick={() => {
                setActiveMethod("AI Body Scan");
                document
                  .getElementById("section-ai-body-scan")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex flex-col gap-[12px] items-start p-[24px] text-left transition-colors cursor-pointer ${
                activeMethod === "AI Body Scan"
                  ? "bg-white border-2 border-[#172b24]"
                  : "bg-white border border-[#e9e0d3] hover:border-[#b69a68]"
              }`}
              data-node-id="20:31066"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.camera}
              />
              <div className="flex items-center gap-3 pt-1">
                <span
                  className={`size-[20px] rounded-full border flex items-center justify-center ${
                    activeMethod === "AI Body Scan"
                      ? "border-[#172b24]"
                      : "border-[#29251f]"
                  }`}
                >
                  {activeMethod === "AI Body Scan" && (
                    <span className="size-[8px] rounded-full bg-[#172b24]" />
                  )}
                </span>
                <span className="font-sans text-[14px] text-[#29251f]">
                  AI Body Scan
                </span>
              </div>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Camera-guided front and side capture. Explore the illustrative
                scan flow below.
              </p>
            </button>

            {/* Card 2: Manual Measurements */}
            <button
              type="button"
              onClick={() => setActiveMethod("Manual Entry")}
              className={`flex flex-col gap-[12px] items-start p-[24px] text-left transition-colors cursor-pointer ${
                activeMethod === "Manual Entry"
                  ? "bg-white border-2 border-[#172b24]"
                  : "bg-white border border-[#e9e0d3] hover:border-[#b69a68]"
              }`}
              data-node-id="20:31072"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.rulerStudio}
              />
              <div className="flex items-center gap-3 pt-1">
                <span
                  className={`size-[20px] rounded-full border flex items-center justify-center ${
                    activeMethod === "Manual Entry"
                      ? "border-[#172b24]"
                      : "border-[#29251f]"
                  }`}
                >
                  {activeMethod === "Manual Entry" && (
                    <span className="size-[8px] rounded-full bg-[#172b24]" />
                  )}
                </span>
                <span className="font-sans text-[14px] text-[#29251f]">
                  Manual Measurements
                </span>
              </div>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Use a measuring tape and our visual guide. This is your active
                method.
              </p>
            </button>

            {/* Card 3: Use Existing Profile */}
            <button
              type="button"
              onClick={() => {
                setActiveMethod("Saved Profile");
                document
                  .getElementById("section-existing-profiles")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex flex-col gap-[12px] items-start p-[24px] text-left transition-colors cursor-pointer ${
                activeMethod === "Saved Profile"
                  ? "bg-white border-2 border-[#172b24]"
                  : "bg-white border border-[#e9e0d3] hover:border-[#b69a68]"
              }`}
              data-node-id="20:31081"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.userRoundStudio}
              />
              <div className="flex items-center gap-3 pt-1">
                <span
                  className={`size-[20px] rounded-full border flex items-center justify-center ${
                    activeMethod === "Saved Profile"
                      ? "border-[#172b24]"
                      : "border-[#29251f]"
                  }`}
                >
                  {activeMethod === "Saved Profile" && (
                    <span className="size-[8px] rounded-full bg-[#172b24]" />
                  )}
                </span>
                <span className="font-sans text-[14px] text-[#29251f]">
                  Use Existing Profile
                </span>
              </div>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Select a saved measurement profile from your account archive or
                book an atelier fitting.
              </p>
            </button>
          </div>
        </section>

        {/* ACTIVE METHOD / MANUAL MEASUREMENTS FORM (20:31087) */}
        <section
          className="flex flex-col gap-[28px] items-start bg-white border border-[#e9e0d3] p-6 sm:p-[32px] w-full"
          data-node-id="20:31087"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
            <SectionHeading
              eyebrow="ACTIVE METHOD / MANUAL MEASUREMENTS"
              title="A few measurements. A more personal fit."
            />
            <div className="flex items-center gap-3">
              <div className="inline-flex border border-[#e9e0d3] bg-[#f5f0e7] p-0.5">
                {(["cm", "in"] as const).map((u) => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleUnitChange(u)}
                    className={`px-3 py-1 text-[11px] uppercase tracking-[0.8px] cursor-pointer ${
                      unit === u
                        ? "bg-[#172b24] text-[#f5f0e7]"
                        : "text-[#172b24]"
                    }`}
                  >
                    {u}
                  </button>
                ))}
              </div>
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24] uppercase">
                {profileName}
              </span>
            </div>
          </div>

          <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
            Measure over light clothing. Keep the tape comfortably close, not
            tight. All values below are demonstration data in{" "}
            {unit === "cm" ? "centimetres" : "inches"}, not real customer
            results.
          </p>

          <div
            className="flex flex-col xl:flex-row items-start gap-[32px] w-full"
            data-node-id="20:31096"
          >
            {/* Left Fields Grid (20:31097) */}
            <div
              className="flex flex-1 flex-col gap-[20px] items-start w-full"
              data-node-id="20:31097"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px] w-full">
                {manualFields.map((field) => (
                  <div
                    key={field.key}
                    className="flex items-start gap-[10px] w-full"
                    data-node-id={field.nodeId}
                  >
                    <div className="flex flex-1 flex-col gap-[8px] items-start">
                      <label
                        htmlFor={`field-${field.key}`}
                        className="font-sans text-[12px] text-[#29251f]"
                      >
                        {field.label}
                      </label>
                      <input
                        id={`field-${field.key}`}
                        type="number"
                        step="0.5"
                        value={values[field.key]}
                        onFocus={() => setActiveGuideTip(field.tip)}
                        onChange={(e) =>
                          handleFieldChange(
                            field.key,
                            e.target.value,
                            field.tip
                          )
                        }
                        className="h-[56px] w-full bg-white border border-[#e9e0d3] p-[16px] font-sans text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
                      />
                      <p className="font-sans text-[11px] leading-[1.5] text-[#172b24]">
                        {field.helper}
                      </p>
                    </div>

                    <div className="flex w-[94px] shrink-0 flex-col gap-[8px] items-start">
                      <span className="font-sans text-[12px] text-[#29251f]">
                        Unit
                      </span>
                      <select
                        aria-label={`${field.label} unit`}
                        value={unit}
                        onChange={(e) =>
                          handleUnitChange(e.target.value as MeasurementUnit)
                        }
                        className="h-[56px] w-full bg-white border border-[#e9e0d3] px-[12px] font-sans text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
                      >
                        <option value="cm">cm</option>
                        <option value="in">in</option>
                      </select>
                      <span className="font-sans text-[11px] text-[#172b24]">
                        cm / inches
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Inseam is only applicable to trousers or coordinated garments;
                it is not required for the {activeConfiguration.productName}.
              </p>

              {/* Save Measurements Button & Profile Name Input (20:31184) */}
              <div
                className="flex flex-col sm:flex-row sm:items-center gap-[20px] w-full pt-2"
                data-node-id="20:31184"
              >
                <ButtonPrimary
                  label="Save Measurements"
                  onClick={handleSaveManualMeasurements}
                />
                <div className="flex items-center gap-2 text-[12px] text-[#706a60]">
                  <span>Profile name:</span>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="border-b border-[#b69a68] bg-transparent px-2 py-1 text-[12px] text-[#172b24] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Visual Body Guide Panel (20:31190) */}
            <div
              className="flex w-full xl:w-[280px] shrink-0 flex-col gap-[18px] items-start"
              data-node-id="20:31190"
            >
              <div
                className="flex h-[300px] w-full sm:w-[220px] flex-col items-center justify-center gap-[10px] bg-[#f5f0e7]"
                data-node-id="20:31191"
              >
                <div className="relative h-[235px] w-[130px]">
                  <img
                    alt="Body measurement diagram"
                    className="size-full object-contain"
                    src={FIGMA_ASSETS.icons.bodyOutlineMain}
                  />
                </div>
                <p className="font-sans text-[11px] text-[#172b24]">
                  A Chest &nbsp;·&nbsp; B Waist &nbsp;·&nbsp; C Hip
                </p>
              </div>

              {/* Active Measurement Tooltip (5:7770) */}
              <div className="flex min-h-[48px] w-full items-center bg-[#172b24] border border-[#b69a68] px-4 py-3 shadow-xs">
                <p className="font-sans text-[12px] text-[#f5f0e7]">
                  {activeGuideTip}
                </p>
              </div>

              <ButtonText
                label="View Measurement Guide"
                onClick={() =>
                  document
                    .getElementById("section-visual-guide")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              />
            </div>
          </div>

          <div className="h-px w-full bg-[#e9e0d3]" />

          {/* Manual Form Alternate Validation & Saved States (20:31201) */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
            data-node-id="20:31201"
          >
            <div
              className="flex flex-col gap-[10px] items-start"
              data-node-id="20:31202"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                IF A VALUE IS MISSING
              </span>
              <div className="flex items-start gap-4 bg-[#f5f0e7] border border-[#29251f] p-[19px] w-full">
                <span className="text-[20px] text-[#172b24]">!</span>
                <div className="flex flex-col gap-1">
                  <p className="font-sans text-[16px] text-[#172b24]">
                    {validationError ?? "Add your shoulder measurement."}
                  </p>
                  <p className="font-sans text-[13px] text-[#29251f]">
                    Use the guide, then enter a value in {unit}.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex flex-col gap-[10px] items-start"
              data-node-id="20:31209"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                {savedBannerVisible
                  ? "ACTIVE PROFILE READY"
                  : "AFTER SAVING · EXAMPLE"}
              </span>
              <div className="flex items-start gap-4 bg-[#f5f0e7] border border-[#172b24] p-[19px] w-full">
                <span className="text-[20px] text-[#172b24]">✓</span>
                <div className="flex flex-col gap-1">
                  <p className="font-sans text-[16px] text-[#172b24]">
                    Measurements ready to review.
                  </p>
                  <p className="font-sans text-[13px] text-[#29251f]">
                    {profileName} — 7 sample values in {unit}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* YOUR VISUAL MEASUREMENT GUIDE (20:31216) */}
        <section
          id="section-visual-guide"
          className="flex flex-col gap-[24px] items-start w-full"
          data-node-id="20:31216"
        >
          <div className="flex flex-col gap-[8px] items-start w-full">
            <SectionHeading
              eyebrow="YOUR VISUAL MEASUREMENT GUIDE"
              title="Measure with confidence"
            />
            <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
              Ask someone to help with shoulder and sleeve measurements. Use
              body measurements, except for your chosen garment length.
            </p>
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] w-full"
            data-node-id="20:31222"
          >
            {/* Torso Measurement Guide (20:31223) */}
            <div
              className="flex flex-col sm:flex-row items-start gap-[24px] bg-[#e9e0d3] p-[24px]"
              data-node-id="20:31223"
            >
              <div className="flex h-[300px] w-full sm:w-[200px] shrink-0 flex-col items-center justify-center gap-[10px] bg-[#f5f0e7]">
                <div className="relative h-[235px] w-[130px]">
                  <img
                    alt="Around the body diagram"
                    className="size-full object-contain"
                    src={FIGMA_ASSETS.icons.bodyOutlineMain}
                  />
                </div>
                <p className="font-sans text-[11px] text-[#172b24]">
                  A Chest &nbsp;·&nbsp; B Waist &nbsp;·&nbsp; C Hip
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-[16px] items-start">
                <h3 className="font-serif text-[26px] text-black">
                  Around the body
                </h3>
                <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                  A / Chest or bust: fullest point, tape horizontal.
                </p>
                <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                  B / Waist: natural waist crease, relaxed posture.
                </p>
                <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                  C / Hip: widest part, feet together.
                </p>
              </div>
            </div>

            {/* Length Measurement Guide (20:31232) */}
            <div
              className="flex flex-col sm:flex-row items-start gap-[24px] bg-[#e9e0d3] p-[24px]"
              data-node-id="20:31232"
            >
              <div className="flex h-[300px] w-full sm:w-[200px] shrink-0 flex-col items-center justify-center gap-[10px] bg-[#f5f0e7]">
                <div className="relative h-[235px] w-[96px]">
                  <img
                    alt="Along the body diagram"
                    className="size-full object-contain"
                    src={FIGMA_ASSETS.icons.bodyOutlineAlt}
                  />
                </div>
                <p className="font-sans text-[11px] text-[#172b24]">
                  Shoulder · Sleeve · Length
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-[14px] items-start">
                <h3 className="font-serif text-[26px] text-black">
                  Along the body
                </h3>
                <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                  Shoulder: point to point across back. Sleeve: shoulder to
                  wrist.
                </p>
                <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                  Garment: beside neck to hem. Inseam: crotch to ankle, for
                  trousers only.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[#e9e0d3]" />

        {/* ALTERNATIVE METHOD / AI BODY SCAN (20:31241) */}
        <section
          id="section-ai-body-scan"
          className="flex flex-col gap-[28px] items-start w-full"
          data-node-id="20:31241"
        >
          <div className="flex flex-col gap-[8px] items-start w-full">
            <SectionHeading
              eyebrow="ALTERNATIVE METHOD / AI BODY SCAN"
              title="Prefer a camera-guided start?"
            />
            <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
              Illustrative UI states only. No scan has been taken and no real
              measurements have been generated.
            </p>
          </div>

          <div
            className="flex flex-col lg:flex-row items-start gap-[32px] w-full"
            data-node-id="20:31247"
          >
            {/* Front & Side Capture Guide (20:31248) */}
            <div
              className="grid grid-cols-2 gap-4 bg-[#e9e0d3] p-[20px] w-full lg:w-[440px] shrink-0"
              data-node-id="20:31248"
            >
              <div className="flex h-[300px] flex-col items-center justify-center gap-[10px] bg-[#f5f0e7]">
                <div className="relative h-[235px] w-[130px]">
                  <img
                    alt="Front view outline"
                    className="size-full object-contain"
                    src={FIGMA_ASSETS.icons.bodyOutlineMain}
                  />
                </div>
                <p className="font-sans text-[11px] text-[#172b24]">
                  FRONT VIEW
                </p>
              </div>
              <div className="flex h-[300px] flex-col items-center justify-center gap-[10px] bg-[#f5f0e7]">
                <div className="relative h-[235px] w-[96px]">
                  <img
                    alt="Side view outline"
                    className="size-full object-contain"
                    src={FIGMA_ASSETS.icons.bodyOutlineAlt}
                  />
                </div>
                <p className="font-sans text-[11px] text-[#172b24]">
                  SIDE VIEW
                </p>
              </div>
            </div>

            {/* Preparation Instructions (20:31255) */}
            <div
              className="flex flex-1 flex-col gap-[18px] items-start"
              data-node-id="20:31255"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                BEFORE YOU BEGIN · FUTURE PHASE ARCHITECTURE
              </span>
              <h3 className="font-serif text-[28px] text-[#172b24]">
                Give the camera a clear view.
              </h3>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                1. Stand in even light with a plain background. Wear
                close-fitting clothing.
              </p>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                2. Place the camera at waist height and step back until your
                whole body is visible.
              </p>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                3. Capture front and side views. Keep feet apart and arms
                slightly away from your body.
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Camera access is requested when you start. Review the consent
                and privacy settings before sharing images; choose manual entry
                if you prefer not to use a camera.
              </p>
              <div className="flex flex-wrap items-center gap-[20px]">
                <ButtonPrimary
                  label="Start Body Scan Walkthrough"
                  onClick={() => setScanSimStage("permission")}
                />
                <ButtonText
                  label="Review privacy & consent"
                  href="/account/settings"
                />
              </div>
            </div>
          </div>

          <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
            ILLUSTRATIVE SCAN SEQUENCE · ALTERNATE UI STATES
          </span>

          {/* Row 1 of Scan States (20:31274) */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full"
            data-node-id="20:31274"
          >
            <div
              className={`flex flex-col gap-[12px] items-start bg-white p-[20px] border ${
                scanSimStage === "permission"
                  ? "border-2 border-[#172b24]"
                  : "border-[#e9e0d3]"
              }`}
              data-node-id="20:31275"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.camera}
              />
              <p className="font-sans text-[15px] font-medium text-[#172b24]">
                Camera permission
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Allow camera access in your browser to frame your full body.
                Nothing starts until you choose to proceed.
              </p>
              <ButtonText
                label="Allow camera"
                onClick={() => setScanSimStage("ready")}
              />
            </div>

            <div
              className={`flex flex-col gap-[12px] items-start bg-white p-[20px] border ${
                scanSimStage === "ready"
                  ? "border-2 border-[#172b24]"
                  : "border-[#e9e0d3]"
              }`}
              data-node-id="20:31283"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.personStanding}
              />
              <p className="font-sans text-[15px] font-medium text-[#172b24]">
                Ready for your front view
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Follow the framing guide above. Turn sideways only when prompted
                for the second view.
              </p>
              <ButtonText
                label="I'm ready"
                onClick={() => setScanSimStage("scanning")}
              />
            </div>

            <div
              className={`flex flex-col gap-[12px] items-start bg-white p-[20px] border ${
                scanSimStage === "scanning"
                  ? "border-2 border-[#172b24]"
                  : "border-[#e9e0d3]"
              }`}
              data-node-id="20:31291"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.scanLine}
              />
              <p className="font-sans text-[15px] font-medium text-black">
                Scanning in progress · 60%
              </p>
              <div className="h-[4px] w-full bg-[#e9e0d3] overflow-hidden">
                <div className="h-full w-[60%] bg-[#172b24]" />
              </div>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Example capture state. Hold your pose while the front view is
                framed.
              </p>
              <ButtonText
                label="Cancel scan"
                onClick={() => setScanSimStage("idle")}
              />
            </div>
          </div>

          {/* Row 2 of Scan States (20:31301) */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full"
            data-node-id="20:31301"
          >
            <div
              className="flex flex-col gap-[12px] items-start bg-white border border-[#e9e0d3] p-[20px]"
              data-node-id="20:31302"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.loaderCircle}
              />
              <p className="font-sans text-[15px] font-medium text-[#172b24]">
                Processing your views
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Example processing state. Reviewing the two images before
                showing editable sample values.
              </p>
              <ButtonText
                label="Continue with manual entry"
                onClick={() => setActiveMethod("Manual Entry")}
              />
            </div>

            <div
              className="flex flex-col gap-[12px] items-start bg-white border border-[#e9e0d3] p-[20px]"
              data-node-id="20:31310"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.clipboardCheck}
              />
              <p className="font-sans text-[15px] font-medium text-[#172b24]">
                Results to review · Demo
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Chest 96 · Waist 80 · Hip 98 cm. Illustrative values only;
                review and edit before applying to a profile.
              </p>
              <ButtonText
                label="Review sample values"
                onClick={() => setActiveMethod("Manual Entry")}
              />
            </div>

            <div
              className="flex flex-col gap-[12px] items-start bg-white border border-[#e9e0d3] p-[20px]"
              data-node-id="20:31318"
            >
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.circleAlert}
              />
              <p className="font-sans text-[15px] font-medium text-[#172b24]">
                We couldn&apos;t complete the scan
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Example failure: body not fully visible. Reframe and try again.
                If access is denied, use manual measurements.
              </p>
              <ButtonText
                label="Retry scan"
                onClick={() => setScanSimStage("ready")}
              />
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[#e9e0d3]" />

        {/* ALTERNATIVE METHOD / USE EXISTING PROFILE (20:31327) */}
        <section
          id="section-existing-profiles"
          className="flex flex-col gap-[24px] items-start w-full"
          data-node-id="20:31327"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
            <SectionHeading
              eyebrow="ALTERNATIVE METHOD / USE EXISTING PROFILE"
              title="A familiar fit"
            />
            <ButtonSecondary
              label="Manage Profiles in Account"
              href="/account/measurements"
            />
          </div>

          <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
            Sample saved profiles. Selecting a profile replaces manual entry as
            the active method. The Everyday Fit demonstration values are used
            throughout this design.
          </p>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full"
            data-node-id="20:31336"
          >
            {measurementProfiles.map((prof) => {
              const isSelected = prof.id === activeMeasurementProfileId;
              return (
                <div
                  key={prof.id}
                  className={`flex flex-col justify-between gap-[16px] items-start bg-white p-[24px] border ${
                    isSelected
                      ? "border-2 border-[#172b24]"
                      : "border-[#e9e0d3]"
                  }`}
                >
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-start justify-between w-full">
                      <h3 className="font-serif text-[24px] text-black">
                        {prof.name}
                      </h3>
                      <img
                        alt=""
                        className="size-[22px]"
                        src={FIGMA_ASSETS.icons.userRoundStudio}
                      />
                    </div>
                    <p className="font-sans text-[12px] text-[#706a60]">
                      Last updated {prof.lastUpdated} · v{prof.version}
                    </p>
                    <p className="font-sans text-[13px] leading-[1.65] text-[#29251f]">
                      Chest {prof.values.chest} · Waist {prof.values.waist} · Hip{" "}
                      {prof.values.seatHips} · Shoulder{" "}
                      {prof.values.shoulderWidth} {prof.unit}
                    </p>
                    <p className="font-sans text-[12px] text-[#706a60]">
                      Sleeve {prof.values.sleeveLength} · Garment{" "}
                      {prof.values.garmentLength} {prof.unit} · Fit:{" "}
                      {prof.fitPreference}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <ButtonText
                      label={
                        isSelected ? "✓ Active Profile" : "Use this profile"
                      }
                      onClick={() => handleSelectExistingProfile(prof.id)}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* BOTTOM STUDIO ACTION BAR */}
      <div className="w-full border-t border-[#e9e0d3] bg-[#f5f0e7] px-4 sm:px-8 lg:px-[72px] py-[28px]">
        <div className="mx-auto flex w-full max-w-[1296px] flex-col sm:flex-row items-center justify-between gap-4">
          <ButtonSecondary label="Back to Customize" href="/customize" />
          <p className="font-sans text-[13px] text-[#172b24] text-center">
            {activeConfiguration.productName} &nbsp; · &nbsp; Sample estimate{" "}
            {formatInr(totalEstimateInr)}
          </p>
          <ButtonPrimary
            label="Continue to 3D Preview"
            onClick={() => {
              handleSaveManualMeasurements();
              router.push("/customize/preview");
            }}
          />
        </div>
      </div>

      <StudioFooter />
    </div>
  );
}
