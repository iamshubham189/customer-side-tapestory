"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import { calculateEstimatedPrice } from "@/services/customization.service";
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
import {
  AvatarCanvas3D,
  type AvatarBodyRepresentation,
  type AvatarViewPreset,
} from "@/components/avatar/AvatarCanvas3D";

const BODY_REPRESENTATIONS: AvatarBodyRepresentation[] = [
  "Unisex Balanced",
  "Feminine Contoured",
  "Masculine Broad",
  "Petite",
  "Tall",
];

export default function CustomizePreviewPage() {
  const router = useRouter();
  const {
    activeConfiguration,
    setActiveConfiguration,
    measurementProfiles,
    activeMeasurementProfileId,
  } = useTapestory();

  const activeProfile =
    measurementProfiles.find((m) => m.id === activeMeasurementProfileId) ??
    measurementProfiles[0];

  const [viewAngle, setViewAngle] = useState<AvatarViewPreset>("Front");
  const [bodyRep, setBodyRep] =
    useState<AvatarBodyRepresentation>("Unisex Balanced");
  const [stageMode, setStageMode] = useState<"3d-interactive" | "editorial">(
    "3d-interactive"
  );
  const [showRings, setShowRings] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const [fitOverride, setFitOverride] = useState<
    "Slim Fit" | "Regular Fit" | "Relaxed Fit"
  >("Relaxed Fit");
  const [garmentLengthCm, setGarmentLengthCm] = useState<number>(
    activeProfile.values.garmentLength || 72
  );
  const [sleeveLengthCm, setSleeveLengthCm] = useState<number>(
    activeProfile.values.sleeveLength || 61
  );

  // Virtual Try-On state
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [tryOnPhotoUrl, setTryOnPhotoUrl] = useState<string>(
    FIGMA_ASSETS.images.editorialPreview4
  );
  const [tryOnFileName, setTryOnFileName] =
    useState<string>("my-style-photo.jpg");
  const [tryOnStatus, setTryOnStatus] = useState<
    "ready" | "generating" | "failed"
  >("ready");

  const totalEstimateInr = calculateEstimatedPrice(activeConfiguration);

  const handleFitSelection = (
    fit: "Slim Fit" | "Regular Fit" | "Relaxed Fit"
  ) => {
    setFitOverride(fit);
    setActiveConfiguration((prev) => ({
      ...prev,
      styleSilhouette: {
        ...prev.styleSilhouette,
        name: fit,
      },
    }));
  };

  const handleTryOnUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setTryOnFileName(file.name);
    setTryOnStatus("generating");
    setTimeout(() => {
      setTryOnPhotoUrl(url);
      setTryOnStatus("ready");
    }, 650);
  };

  const viewThumbnails = [
    {
      angle: "Front" as const,
      label: "Front",
      thumb: FIGMA_ASSETS.images.editorialPreview1,
      nodeId: "20:31485",
    },
    {
      angle: "Side" as const,
      label: "Side",
      thumb: FIGMA_ASSETS.images.editorialPreview2,
      nodeId: "20:31489",
    },
    {
      angle: "Back" as const,
      label: "Back",
      thumb: FIGMA_ASSETS.images.editorialPreview3,
      nodeId: "20:31493",
    },
  ];

  const fitScore =
    fitOverride === "Relaxed Fit" ? 92 : fitOverride === "Regular Fit" ? 95 : 90;

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="20:31378"
    >
      <Header />

      <StudioHeader
        breadcrumbLabel="Home / Product / Customize"
        eyebrow="THE CUSTOMIZATION STUDIO / 03"
        title="See Your Design Before It's Made"
        description="Preview your customized outfit and understand how it complements your measurements."
        signatureQuote="Your story, in the making."
        activeStepIndex={5}
      />

      <main
        className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[48px] px-4 sm:px-8 lg:px-[72px] pb-[56px]"
        data-node-id="20:31479"
      >
        {/* PREVIEW DISCLOSURE BANNER (20:31480) */}
        <div
          className="flex items-center gap-[14px] bg-[#e9e0d3] p-[18px] w-full"
          data-node-id="20:31480"
        >
          <img
            alt=""
            className="size-[22px] shrink-0"
            src={FIGMA_ASSETS.icons.info}
          />
          <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
            Conceptual 3D and fit preview · All avatars, fit scores and try-on
            images are illustrative. This is not an actual AI assessment or
            verified measurement result, and does not guarantee exact fit.
          </p>
        </div>

        {/* 3D FITTING WORKSPACE (20:31483) */}
        <section
          className="flex flex-col lg:flex-row items-start gap-[24px] w-full"
          data-node-id="20:31483"
        >
          {/* Left: View Controls (Front, Side, Back) (20:31484) */}
          <div
            className="grid grid-cols-3 lg:flex lg:flex-col gap-[16px] w-full lg:w-[156px] shrink-0"
            data-node-id="20:31484"
          >
            {viewThumbnails.map((item) => {
              const isSelected = viewAngle === item.angle;
              return (
                <button
                  key={item.angle}
                  type="button"
                  onClick={() => setViewAngle(item.angle)}
                  className={`flex flex-col gap-[8px] items-start p-[5px] text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "border-2 border-[#172b24] bg-white"
                      : "border border-[#e9e0d3] hover:border-[#b69a68]"
                  }`}
                  data-node-id={item.nodeId}
                >
                  <div className="relative h-[120px] sm:h-[190px] w-full overflow-hidden bg-[#e9e0d3]">
                    <img
                      alt={`${item.label} view`}
                      className="size-full object-cover"
                      src={item.thumb}
                    />
                  </div>
                  <div
                    className={`px-[12px] py-[8px] text-[12px] w-full ${
                      isSelected
                        ? "bg-[#172b24] text-[#f5f0e7]"
                        : "bg-white text-[#172b24] border border-[#e9e0d3]"
                    }`}
                  >
                    {isSelected ? `✓  ${item.label}` : item.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Center: 3D Avatar Stage (20:31497) */}
          <div
            className={`relative flex flex-1 flex-col bg-[#e9e0d3] overflow-hidden w-full ${
              isFullscreen
                ? "fixed inset-4 z-50 h-auto"
                : "h-[640px] sm:h-[786px]"
            }`}
            data-node-id="20:31497"
          >
            {/* Interactive 3D Canvas OR Editorial Reference View */}
            <div className="relative h-[500px] sm:h-[650px] w-full">
              {stageMode === "3d-interactive" ? (
                <AvatarCanvas3D
                  configuration={activeConfiguration}
                  measurements={activeProfile.values}
                  viewAngle={viewAngle}
                  bodyRepresentation={bodyRep}
                  fitOverride={fitOverride}
                  garmentLengthCm={garmentLengthCm}
                  sleeveLengthCm={sleeveLengthCm}
                  showMeasurementRings={showRings}
                />
              ) : (
                <img
                  alt="Full-body avatar preview"
                  className="size-full object-cover"
                  src={FIGMA_ASSETS.images.avatarFullBody}
                />
              )}
            </div>

            {/* Stage Top Toolbar (20:31499) */}
            <div
              className="absolute top-[20px] left-[20px] right-[20px] flex flex-wrap items-center justify-between gap-2 pointer-events-auto"
              data-node-id="20:31499"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#e9e0d3]/95 border border-[#d7cdbe] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                  3D DESIGN PREVIEW · INTERACTIVE R3F STAGE
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setStageMode((m) =>
                      m === "3d-interactive" ? "editorial" : "3d-interactive"
                    )
                  }
                  className="bg-[#f5f0e7] border border-[#172b24] px-3 py-1.5 text-[11px] font-medium text-[#172b24] hover:bg-[#172b24] hover:text-[#f5f0e7] transition-colors cursor-pointer"
                >
                  {stageMode === "3d-interactive"
                    ? "Switch to Studio Lookbook Render"
                    : "Switch to Interactive 3D Mesh"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRings((r) => !r)}
                  className="bg-[#f5f0e7]/90 border border-[#d7cdbe] px-2.5 py-1.5 text-[11px] text-[#172b24] cursor-pointer"
                >
                  {showRings ? "Hide Fit Rings" : "Show Fit Rings"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsFullscreen((f) => !f)}
                aria-label="Toggle fullscreen stage"
                className="bg-[#f5f0e7] p-[10px] hover:bg-white cursor-pointer"
                data-node-id="20:31502"
              >
                <img
                  alt=""
                  className="size-[22px]"
                  src={FIGMA_ASSETS.icons.maximizeStudio}
                />
              </button>
            </div>

            {/* Body Representation Selector Pill Bar */}
            <div className="px-6 py-2 flex flex-wrap items-center justify-center gap-1.5 bg-[#e9e0d3]/90 border-t border-[#d7cdbe]">
              <span className="text-[10px] uppercase tracking-[1px] text-[#706a60] mr-1">
                Avatar Body Form:
              </span>
              {BODY_REPRESENTATIONS.map((rep) => (
                <button
                  key={rep}
                  type="button"
                  onClick={() => setBodyRep(rep)}
                  className={`px-2.5 py-1 text-[11px] cursor-pointer transition-colors ${
                    bodyRep === rep
                      ? "bg-[#172b24] text-[#f5f0e7]"
                      : "bg-[#f5f0e7] text-[#172b24] hover:bg-white"
                  }`}
                >
                  {rep}
                </button>
              ))}
            </div>

            {/* Stage Bottom Caption & 360 Affordance (20:31504) */}
            <div
              className="mt-auto flex flex-col gap-[12px] px-[24px] pb-[20px] pt-2 w-full"
              data-node-id="20:31504"
            >
              <div className="flex items-center justify-center gap-[10px] w-full">
                <button
                  type="button"
                  onClick={() =>
                    setViewAngle((v) => (v === "Orbit" ? "Front" : "Orbit"))
                  }
                  className="flex items-center gap-2 text-[12px] text-black hover:text-[#172b24] cursor-pointer"
                >
                  <img
                    alt=""
                    className="size-[22px]"
                    src={FIGMA_ASSETS.icons.rotate3d}
                  />
                  <span>
                    {viewAngle === "Orbit"
                      ? "360° Auto-Orbit Active · Click or drag to inspect"
                      : "360° · Drag to explore or click for auto-orbit"}
                  </span>
                </button>
              </div>

              <div
                className="flex items-center justify-between bg-[#f5f0e7] p-[18px] text-black w-full"
                data-node-id="20:31508"
              >
                <div className="flex flex-col gap-[4px]">
                  <p className="font-serif text-[22px] sm:text-[24px]">
                    {activeConfiguration.productName}
                  </p>
                  <p className="font-sans text-[11px]">
                    {activeConfiguration.fabric.name} ·{" "}
                    {activeConfiguration.color.name} ·{" "}
                    {activeConfiguration.pattern.name} · {fitOverride}
                  </p>
                </div>
                <p className="font-sans text-[13px] font-medium">
                  {formatInr(totalEstimateInr)}*
                </p>
              </div>
            </div>
          </div>

          {/* Right: Fit & Adjustment Panel (20:31513) */}
          <aside
            className="flex flex-col gap-[24px] items-start w-full lg:w-[344px] shrink-0"
            data-node-id="20:31513"
          >
            {/* Fit Information Card (20:31514) */}
            <div
              className="flex flex-col gap-[22px] items-start bg-white border border-[#e9e0d3] p-[24px] w-full"
              data-node-id="20:31514"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                ILLUSTRATIVE FIT INFORMATION
              </span>

              <div className="flex items-center justify-between w-full">
                <div className="flex flex-col gap-[4px]">
                  <p className="font-serif text-[27px] text-black">Fit Score</p>
                  <p className="font-sans text-[11px] text-[#706a60]">
                    Concept only · Not assessed
                  </p>
                </div>
                <p className="font-serif text-[40px] text-[#172b24]">
                  {fitScore}
                </p>
              </div>

              {/* 4 Fit Metric Bars */}
              {[
                {
                  label: "Shoulder Fit",
                  status: "Balanced",
                  pct: 88,
                },
                {
                  label: "Chest Fit",
                  status:
                    fitOverride === "Relaxed Fit"
                      ? "Room to layer"
                      : fitOverride === "Regular Fit"
                      ? "Classic ease"
                      : "Close contour",
                  pct: fitOverride === "Relaxed Fit" ? 92 : 86,
                },
                {
                  label: "Waist Fit",
                  status:
                    fitOverride === "Relaxed Fit"
                      ? "Easy drape"
                      : "Structured taper",
                  pct: 90,
                },
                {
                  label: "Length Fit",
                  status: `Hip length (${garmentLengthCm} cm)`,
                  pct: 87,
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="flex flex-col gap-[9px] w-full"
                >
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-black">{metric.label}</span>
                    <span className="text-[11px] text-[#706a60]">
                      {metric.status}
                    </span>
                  </div>
                  <div className="h-[4px] w-full bg-[#e9e0d3] overflow-hidden">
                    <div
                      className="h-full bg-[#172b24] transition-all duration-300"
                      style={{ width: `${metric.pct}%` }}
                    />
                  </div>
                </div>
              ))}

              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Example score: {fitScore} / 100. Visual indicators are a design
                demonstration, not measured performance.
              </p>
            </div>

            {/* Adjust Fit Controls Card (20:31547) */}
            <div
              className="flex flex-col gap-[16px] items-start border border-[#e9e0d3] bg-white/60 p-[24px] w-full"
              data-node-id="20:31547"
            >
              <h3 className="font-serif text-[28px] text-[#172b24]">
                Adjust Fit
              </h3>

              <div className="flex flex-wrap gap-[8px] w-full">
                {(["Slim Fit", "Regular Fit", "Relaxed Fit"] as const).map(
                  (fit) => {
                    const isSelected = fitOverride === fit;
                    return (
                      <button
                        key={fit}
                        type="button"
                        onClick={() => handleFitSelection(fit)}
                        className={`px-[14px] py-[10px] text-[12px] border transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#172b24] border-[#172b24] text-[#f5f0e7]"
                            : "bg-white border-[#e9e0d3] text-[#172b24] hover:border-[#172b24]"
                        }`}
                      >
                        {isSelected ? `✓  ${fit}` : fit}
                      </button>
                    );
                  }
                )}
              </div>

              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                {fitOverride} matches your selected base style. Changes here
                refine the 3D avatar preview in real time.
              </p>

              {/* Garment Length Select */}
              <div className="flex flex-col gap-[8px] w-full">
                <label
                  htmlFor="preview-garment-length"
                  className="font-sans text-[12px] text-[#29251f]"
                >
                  Garment length
                </label>
                <select
                  id="preview-garment-length"
                  value={garmentLengthCm}
                  onChange={(e) => setGarmentLengthCm(Number(e.target.value))}
                  className="h-[56px] w-full bg-white border border-[#e9e0d3] px-[16px] font-sans text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
                >
                  <option value={68}>Cropped length · 68 cm</option>
                  <option value={72}>Hip length · 72 cm</option>
                  <option value={76}>Longline · 76 cm</option>
                </select>
                <p className="font-sans text-[11px] text-[#172b24]">
                  Sample profile: {activeProfile.name}
                </p>
              </div>

              {/* Sleeve Length Quick Adjuster */}
              <div className="flex items-center justify-between w-full pt-1">
                <span className="text-[12px] text-[#172b24]">
                  Sleeve length · {sleeveLengthCm} cm
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setSleeveLengthCm((s) => Math.max(54, s - 1))
                    }
                    className="size-7 border border-[#d7cdbe] bg-white text-[13px] text-[#172b24] cursor-pointer"
                  >
                    −
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSleeveLengthCm((s) => Math.min(68, s + 1))
                    }
                    className="size-7 border border-[#d7cdbe] bg-white text-[13px] text-[#172b24] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </section>

        {/* COMPARE LOOKS (20:31567) */}
        <section
          className="flex flex-col gap-[24px] items-start w-full"
          data-node-id="20:31567"
        >
          <div className="flex flex-col gap-[8px] items-start w-full">
            <SectionHeading
              eyebrow="COMPARE LOOKS"
              title="One jacket. Different stories."
            />
            <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
              Explore alternatives alongside your current design. Only Current
              Design carries forward to review.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full"
            data-node-id="20:31573"
          >
            {/* Look 1 */}
            <div
              className="flex flex-col border border-[#e9e0d3] p-[8px]"
              data-node-id="20:31574"
            >
              <div className="relative h-[420px] sm:h-[500px] w-full bg-[#e9e0d3] overflow-hidden">
                <img
                  alt="Saved Look 01"
                  className="size-full object-cover"
                  src={FIGMA_ASSETS.images.compareOptionA}
                />
              </div>
              <div className="flex flex-col gap-[8px] pt-4 px-2 pb-2">
                <h3 className="font-serif text-[22px] text-[#172b24]">
                  Saved Look 01
                </h3>
                <p className="font-sans text-[12px] text-[#29251f]">
                  Cotton · Beige · Solid · Classic Fit
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-sans text-[14px] text-[#172b24]">
                    Alternative study
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveConfiguration((prev) => ({
                        ...prev,
                        color: { name: "Beige", hex: "#D6C7B2" },
                      }));
                      setFitOverride("Regular Fit");
                    }}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#172b24] underline cursor-pointer"
                  >
                    <span>Apply look</span>
                    <img
                      alt=""
                      className="size-[12px]"
                      src={FIGMA_ASSETS.icons.arrowUpRightSmall}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Look 2 */}
            <div
              className="flex flex-col border border-[#e9e0d3] p-[8px]"
              data-node-id="20:31594"
            >
              <div className="relative h-[420px] sm:h-[500px] w-full bg-[#e9e0d3] overflow-hidden">
                <img
                  alt="Saved Look 02"
                  className="size-full object-cover"
                  src={FIGMA_ASSETS.images.compareOptionB}
                />
              </div>
              <div className="flex flex-col gap-[8px] pt-4 px-2 pb-2">
                <h3 className="font-serif text-[22px] text-[#172b24]">
                  Saved Look 02
                </h3>
                <p className="font-sans text-[12px] text-[#29251f]">
                  Wool · Navy · Textures · Slim Fit
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-sans text-[14px] text-[#172b24]">
                    Alternative study
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveConfiguration((prev) => ({
                        ...prev,
                        color: { name: "Navy", hex: "#1E293B" },
                      }));
                      setFitOverride("Slim Fit");
                    }}
                    className="inline-flex items-center gap-1.5 text-[12px] text-[#172b24] underline cursor-pointer"
                  >
                    <span>Apply look</span>
                    <img
                      alt=""
                      className="size-[12px]"
                      src={FIGMA_ASSETS.icons.arrowUpRightSmall}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Current Design */}
            <div
              className="flex flex-col border-2 border-[#172b24] bg-white p-[8px]"
              data-node-id="20:31614"
            >
              <div className="relative h-[420px] sm:h-[500px] w-full bg-[#e9e0d3] overflow-hidden">
                <img
                  alt="Current Design"
                  className="size-full object-cover"
                  src={activeConfiguration.productImage}
                />
              </div>
              <div className="flex flex-col gap-[8px] pt-4 px-2 pb-2">
                <h3 className="font-serif text-[22px] text-[#172b24]">
                  Current Design
                </h3>
                <p className="font-sans text-[12px] text-[#29251f]">
                  {activeConfiguration.fabric.name} ·{" "}
                  {activeConfiguration.color.name} ·{" "}
                  {activeConfiguration.pattern.name} · {fitOverride}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="font-sans text-[14px] text-[#172b24]">
                    Sample estimate {formatInr(totalEstimateInr)}
                  </span>
                  <span className="text-[12px] font-medium text-[#172b24]">
                    ✓ Active look
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[#e9e0d3]" />

        {/* VIRTUAL TRY-ON / OPTIONAL (20:31635) */}
        <section
          className="flex flex-col gap-[28px] items-start w-full"
          data-node-id="20:31635"
        >
          <div className="flex flex-col gap-[8px] items-start w-full">
            <SectionHeading
              eyebrow="VIRTUAL TRY-ON / OPTIONAL"
              title="Imagine it on you"
            />
            <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
              Upload a full-length photo to explore a conceptual styling
              preview. You can continue without a try-on.
            </p>
          </div>

          <div
            className="flex flex-col lg:flex-row items-stretch gap-[32px] w-full"
            data-node-id="20:31641"
          >
            {/* Left Upload Card (20:31642) */}
            <div
              className="flex flex-col gap-[20px] items-start bg-white border border-[#e9e0d3] p-[28px] w-full lg:w-[368px] shrink-0"
              data-node-id="20:31642"
            >
              <img
                alt=""
                className="size-[30px]"
                src={FIGMA_ASSETS.icons.imageUp}
              />
              <h3 className="font-serif text-[28px] text-black leading-tight">
                Your photo, your perspective.
              </h3>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Choose a clear, full-length image in good light. Avoid loose
                layers that hide your outline.
              </p>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleTryOnUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="flex flex-col gap-[10px] items-start border border-dashed border-[#d7cdbe] p-[24px] text-left w-full hover:border-[#172b24] cursor-pointer"
                data-node-id="20:31646"
              >
                <span className="font-sans text-[12px] text-black">
                  Drop a JPG or PNG here
                </span>
                <span className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                  Up to 10 MB · Use a photo you have permission to share.
                </span>
              </button>

              <ButtonPrimary
                label="Upload Photo"
                onClick={() => photoInputRef.current?.click()}
                fullWidth
              />

              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                Review privacy and consent settings before uploading. Concept
                previews are not exact-fit guarantees.
              </p>
            </div>

            {/* Right Conceptual Preview State (20:31654) */}
            <div
              className="flex flex-1 flex-col sm:flex-row items-start sm:items-center gap-[24px] bg-[#e9e0d3] p-[16px]"
              data-node-id="20:31654"
            >
              <div className="relative h-[380px] sm:h-[436px] w-full sm:w-[310px] shrink-0 overflow-hidden bg-[#f5f0e7]">
                <img
                  alt="Editorial styling preview"
                  className="size-full object-cover"
                  src={tryOnPhotoUrl}
                />
              </div>

              <div className="flex flex-1 flex-col gap-[20px] items-start justify-center p-2">
                <span className="bg-[#f5f0e7] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                  {tryOnStatus === "generating"
                    ? "PREPARING PREVIEW…"
                    : "EXAMPLE PREVIEW STATE"}
                </span>

                <div className="font-serif text-[30px] leading-tight text-[#172b24]">
                  <p>A first impression,</p>
                  <p>not a final fitting.</p>
                </div>

                <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                  Concept image · {activeConfiguration.fabric.name} /{" "}
                  {activeConfiguration.color.name} / {fitOverride}. Fabric,
                  colour and proportions may vary in the finished garment.
                </p>

                <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                  Example uploaded file: {tryOnFileName}. This image is
                  illustrative; no customer photo was processed externally.
                </p>

                <ButtonText
                  label="Replace photo"
                  onClick={() => photoInputRef.current?.click()}
                />
              </div>
            </div>
          </div>

          {/* Try-On Alternate Statuses (20:31666) */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
            data-node-id="20:31666"
          >
            <div
              className="flex flex-col gap-[16px] items-start bg-white border border-[#e9e0d3] p-[24px]"
              data-node-id="20:31667"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                WHILE GENERATING · EXAMPLE
              </span>
              <img
                alt=""
                className="size-[22px]"
                src={FIGMA_ASSETS.icons.loaderCircle}
              />
              <p className="font-sans text-[16px] text-black">
                Preparing your preview…
              </p>
              <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                An illustrative generation status. Your selected jacket and
                photo would appear here once a preview is available.
              </p>
              <ButtonText
                label="Cancel preview"
                onClick={() => setTryOnStatus("ready")}
              />
            </div>

            <div
              className="flex flex-col gap-[16px] items-start bg-white border border-[#e9e0d3] p-[24px]"
              data-node-id="20:31677"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                IF GENERATION FAILS · EXAMPLE
              </span>
              <div className="flex items-start gap-4 bg-[#f5f0e7] border border-[#29251f] p-[19px] w-full">
                <span className="text-[20px] text-[#172b24]">!</span>
                <div className="flex flex-col gap-1">
                  <p className="font-sans text-[16px] text-[#172b24]">
                    Preview unavailable.
                  </p>
                  <p className="font-sans text-[13px] text-[#29251f]">
                    Try a clearer photo or continue without a preview.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-[20px]">
                <ButtonSecondary
                  label="Retry"
                  onClick={() => photoInputRef.current?.click()}
                />
                <ButtonText
                  label="Continue without try-on"
                  href="/customize/save"
                />
              </div>
            </div>
          </div>
        </section>

        <p className="font-sans text-[12px] leading-[1.65] text-[#706a60] w-full">
          *Sample estimate {formatInr(totalEstimateInr)} ={" "}
          {formatInr(activeConfiguration.basePriceInr)} base garment + custom
          options. {activeConfiguration.fabric.name},{" "}
          {activeConfiguration.color.name} and{" "}
          {activeConfiguration.pattern.name} pattern are included. A tailor
          confirms the final quote.
        </p>
      </main>

      {/* BOTTOM STUDIO ACTION BAR (20:31692) */}
      <div
        className="w-full border-t border-[#e9e0d3] bg-[#f5f0e7] px-4 sm:px-8 lg:px-[72px] py-[28px]"
        data-node-id="20:31692"
      >
        <div className="mx-auto flex w-full max-w-[1296px] flex-col sm:flex-row items-center justify-between gap-4">
          <ButtonSecondary label="Back to Customize" href="/customize" />
          <p className="font-sans text-[13px] text-[#172b24] text-center">
            {activeConfiguration.productName} &nbsp; · &nbsp; Sample estimate{" "}
            {formatInr(totalEstimateInr)}
          </p>
          <ButtonPrimary
            label="Continue to Review"
            onClick={() => router.push("/customize/save")}
          />
        </div>
      </div>

      <StudioFooter />
    </div>
  );
}
