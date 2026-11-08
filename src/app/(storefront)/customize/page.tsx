"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import { SEED_FABRICS, SEED_PRODUCTS } from "@/lib/backend/seed-data";
import {
  calculateEstimatedPrice,
  STUDIO_DETAIL_CATEGORIES,
  STUDIO_STYLE_OPTIONS,
} from "@/services/customization.service";
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

const SWATCH_RING_MAP: Record<string, string> = {
  "Deep Green": FIGMA_ASSETS.icons.swatchRingGreen,
  Beige: FIGMA_ASSETS.icons.swatchRingBeige,
  Cream: FIGMA_ASSETS.icons.swatchRingCream,
  Navy: FIGMA_ASSETS.icons.swatchRingNavy,
  Brown: FIGMA_ASSETS.icons.swatchRingBrown,
};

const FIT_BADGE_OPTIONS = [
  { id: "classic-fit", label: "Classic Fit", description: "Balanced structure through the shoulder and chest with clean lines.", priceDeltaInr: 0 },
  { id: "relaxed-fit", label: "Relaxed Fit", description: "An easy silhouette with room to layer.", priceDeltaInr: 0 },
  { id: "slim-fit", label: "Slim Fit", description: "Closer contour through the chest and waist.", priceDeltaInr: 150 },
  { id: "oversized-fit", label: "Oversized Fit", description: "Generous drop-shoulder proportion for statement layering.", priceDeltaInr: 150 },
  { id: "contemporary-fit", label: "Contemporary Fit", description: "Soft shoulder with modern architectural taper.", priceDeltaInr: 250 },
];

const LINING_OPTIONS = [
  "Unlined — light, breathable construction (+₹0)",
  "Half-lined back & sleeves in breathable Bemberg (+₹350)",
  "Full Bemberg cupro lining with internal passport pocket (+₹650)",
];

function CustomizationStudioContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productParam = searchParams.get("product");
  const savedParam = searchParams.get("saved");

  const {
    activeConfiguration,
    setActiveConfiguration,
    loadProductIntoStudio,
    loadSavedDesignIntoStudio,
  } = useTapestory();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>(
    "jacket-pocket-reference.jpg"
  );
  const [uploadedFileSize, setUploadedFileSize] = useState<string>(
    "1.8 MB · Sample reference"
  );
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string>(
    FIGMA_ASSETS.images.productLinenFieldJacketDetail
  );
  const [hasReferenceImage, setHasReferenceImage] = useState<boolean>(true);

  useEffect(() => {
    if (savedParam) {
      loadSavedDesignIntoStudio(savedParam);
    } else if (productParam) {
      loadProductIntoStudio(productParam);
    }
  }, [productParam, savedParam, loadProductIntoStudio, loadSavedDesignIntoStudio]);

  const baseDesigns = [
    SEED_PRODUCTS[0], // Linen Field Jacket
    SEED_PRODUCTS[12] ?? SEED_PRODUCTS[1], // Everyday Overshirt
    SEED_PRODUCTS[1], // The Everyday Linen Suit
    SEED_PRODUCTS[3], // The Ivory Occasion Bandhgala
  ];

  const computedTotalInr = calculateEstimatedPrice(activeConfiguration);

  const handleSelectBaseDesign = (slug: string) => {
    loadProductIntoStudio(slug);
  };

  const handleSelectStyleFit = (fitOpt: (typeof FIT_BADGE_OPTIONS)[number]) => {
    setActiveConfiguration((prev) => {
      const next = {
        ...prev,
        styleSilhouette: {
          id: fitOpt.id,
          name: fitOpt.label,
          description: fitOpt.description,
          priceDeltaInr: fitOpt.priceDeltaInr,
        },
      };
      return {
        ...next,
        totalEstimatedPriceInr: calculateEstimatedPrice(next),
      };
    });
  };

  const handleSelectFabric = (fabricId: string) => {
    const found = SEED_FABRICS.find((f) => f.id === fabricId);
    if (!found) return;
    setActiveConfiguration((prev) => {
      const next = {
        ...prev,
        fabric: {
          id: found.id,
          name: found.name,
          materialFamily: found.materialFamily,
          composition: `${found.name} (${found.weightGsm} GSM)`,
          priceDeltaInr: found.priceModifierInr,
          swatchImage: found.swatchImage,
        },
      };
      return {
        ...next,
        totalEstimatedPriceInr: calculateEstimatedPrice(next),
      };
    });
  };

  const handleSelectColor = (color: { name: string; hex: string }) => {
    setActiveConfiguration((prev) => ({
      ...prev,
      color,
    }));
  };

  const handleSelectPattern = (pattern: { id: string; name: string }) => {
    setActiveConfiguration((prev) => ({
      ...prev,
      pattern,
    }));
  };

  const handleSelectDetail = (
    key: keyof typeof activeConfiguration.details,
    value: string
  ) => {
    setActiveConfiguration((prev) => {
      const next = {
        ...prev,
        details: {
          ...prev.details,
          [key]: value,
        },
      };
      return {
        ...next,
        totalEstimatedPriceInr: calculateEstimatedPrice(next),
      };
    });
  };

  const handleReferenceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setUploadedFileName(file.name);
    setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB · Uploaded`);
    setUploadedPreviewUrl(url);
    setHasReferenceImage(true);
    setActiveConfiguration((prev) => ({
      ...prev,
      referenceImageUrls: [url],
    }));
  };

  const orderedFabrics = [
    SEED_FABRICS.find((f) => f.name === "Cotton") ?? SEED_FABRICS[1],
    SEED_FABRICS.find((f) => f.name === "Linen") ?? SEED_FABRICS[0],
    SEED_FABRICS.find((f) => f.name === "Silk") ?? SEED_FABRICS[2],
    SEED_FABRICS.find((f) => f.name === "Wool") ?? SEED_FABRICS[3],
    SEED_FABRICS.find((f) => f.name === "Blends") ?? SEED_FABRICS[4],
  ];

  const colorPalette = [
    { name: "Deep Green", hex: "#172B24" },
    { name: "Beige", hex: "#D6C7B2" },
    { name: "Cream", hex: "#F5F0E7" },
    { name: "Navy", hex: "#1E293B" },
    { name: "Brown", hex: "#5C4332" },
  ];

  const patternPalette = [
    { id: "solid", name: "Solid", type: "solid" as const },
    { id: "stripes", name: "Stripes", type: "svg" as const, src: FIGMA_ASSETS.icons.patternSolid },
    { id: "checks", name: "Checks", type: "svg" as const, src: FIGMA_ASSETS.icons.patternStripes },
    { id: "prints", name: "Prints", type: "svg" as const, src: FIGMA_ASSETS.icons.patternChecks },
    { id: "textures", name: "Textures", type: "img" as const, src: FIGMA_ASSETS.images.weaveCloseup },
  ];

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="20:30517"
    >
      <Header />

      <StudioHeader
        breadcrumbLabel="Home / Product / Customize"
        eyebrow="THE CUSTOMIZATION STUDIO / 01"
        title="Design Your Own"
        description="Create something that feels uniquely yours. Choose your style, fabric, colours and details."
        signatureQuote="Your story, in the making."
        activeStepIndex={3}
      />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col lg:flex-row items-start gap-10 lg:gap-[40px] px-4 sm:px-8 lg:px-[72px] pb-[56px]">
        {/* LEFT COLUMN — ATELIER WORKBENCH (20:30619) */}
        <div
          className="flex flex-1 flex-col gap-[48px] items-start w-full min-w-0"
          data-node-id="20:30619"
        >
          {/* 01 / CHOOSE STYLE (20:30620) */}
          <section
            id="step-style"
            className="flex flex-col gap-[24px] items-start w-full"
            data-node-id="20:30620"
          >
            <div className="flex flex-col gap-[8px] items-start w-full">
              <SectionHeading
                eyebrow="01 / CHOOSE STYLE"
                title="Start with a silhouette"
              />
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                A considered foundation. Refine the proportions to make it yours.
              </p>
            </div>

            {/* Base Design Gallery (20:30626) */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full"
              data-node-id="20:30626"
            >
              {baseDesigns.slice(0, 2).map((prod) => {
                const isSelected = activeConfiguration.productId === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectBaseDesign(prod.slug)}
                    className={`flex flex-col gap-[12px] items-start p-[8px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#172b24] bg-white/50"
                        : "border border-[#e9e0d3] hover:border-[#b69a68]"
                    }`}
                  >
                    <div className="relative h-[340px] sm:h-[520px] w-full bg-[#e9e0d3] overflow-hidden">
                      <img
                        alt={prod.name}
                        className="size-full object-cover"
                        src={prod.primaryImage}
                      />
                    </div>
                    <div className="flex items-center justify-between p-[8px] w-full text-black">
                      <span className="font-sans text-[14px]">{prod.name}</span>
                      <span className="font-sans text-[12px] text-[#172b24]">
                        {isSelected ? "✓ Selected" : `From ${formatInr(prod.startingPriceInr)}`}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Additional Base Designs Selector Bar */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] uppercase tracking-[1.2px] text-[#706a60] mr-2">
                More Studio Silhouettes:
              </span>
              {SEED_PRODUCTS.slice(1, 6).map((prod) => {
                const isSelected = activeConfiguration.productId === prod.id;
                return (
                  <button
                    key={prod.id}
                    type="button"
                    onClick={() => handleSelectBaseDesign(prod.slug)}
                    className={`px-3 py-1.5 text-[12px] border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#172b24] text-[#f5f0e7] border-[#172b24]"
                        : "bg-white text-[#172b24] border-[#e9e0d3] hover:border-[#172b24]"
                    }`}
                  >
                    {prod.name}
                  </button>
                );
              })}
            </div>

            {/* Fit Selections (20:30645) */}
            <div
              className="flex flex-wrap gap-[8px] items-start w-full"
              data-node-id="20:30645"
            >
              {FIT_BADGE_OPTIONS.map((fitOpt) => {
                const isSelected =
                  activeConfiguration.styleSilhouette.name === fitOpt.label;
                return (
                  <button
                    key={fitOpt.id}
                    type="button"
                    onClick={() => handleSelectStyleFit(fitOpt)}
                    className={`px-[16px] py-[12px] text-[12px] border transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-[#172b24] border-[#172b24] text-[#f5f0e7]"
                        : "bg-white border-[#e9e0d3] text-[#172b24] hover:border-[#172b24]"
                    }`}
                  >
                    {isSelected ? `✓  ${fitOpt.label}` : fitOpt.label}
                  </button>
                );
              })}
            </div>

            <p className="font-sans text-[12px] leading-[1.65] text-[#706a60] w-full">
              Selected: {activeConfiguration.styleSilhouette.name} —{" "}
              {activeConfiguration.styleSilhouette.description} All fits are
              available for men, women and unisex wardrobes.
            </p>
          </section>

          <div className="h-px w-full bg-[#e9e0d3]" />

          {/* 02 / PICK FABRIC (20:30658) */}
          <section
            id="step-fabric"
            className="flex flex-col gap-[24px] items-start w-full"
            data-node-id="20:30658"
          >
            <div className="flex flex-col gap-[8px] items-start w-full">
              <SectionHeading
                eyebrow="02 / PICK FABRIC"
                title="Feel the difference"
              />
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Select a weave for the way you move. Adjustments below are sample
                INR prices.
              </p>
            </div>

            <div
              className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-[12px] w-full"
              data-node-id="20:30664"
            >
              {orderedFabrics.map((fab) => {
                const isSelected = activeConfiguration.fabric.id === fab.id;
                const priceTag =
                  fab.priceModifierInr === 0
                    ? "Included"
                    : fab.priceModifierInr > 0
                    ? `+ ₹${fab.priceModifierInr.toLocaleString("en-IN")}`
                    : `− ₹${Math.abs(fab.priceModifierInr).toLocaleString("en-IN")}`;

                return (
                  <button
                    key={fab.id}
                    type="button"
                    onClick={() => handleSelectFabric(fab.id)}
                    className={`flex flex-col justify-between gap-[12px] items-start p-[8px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#172b24] bg-white"
                        : "border border-[#e9e0d3] bg-transparent hover:border-[#b69a68]"
                    }`}
                  >
                    <div className="flex flex-col gap-[16px] w-full">
                      <div className="relative h-[180px] sm:h-[208px] w-full overflow-hidden bg-[#e9e0d3]">
                        <img
                          alt={fab.name}
                          className="size-full object-cover"
                          src={fab.swatchImage}
                        />
                      </div>
                      <div className="flex flex-col gap-[8px] items-start w-full">
                        <p className="font-serif text-[20px] text-[#172b24]">
                          {fab.name === "Blends" ? "Blended Fabrics" : fab.name}
                        </p>
                        <p className="font-sans text-[12px] leading-[1.6] text-[#29251f]">
                          {fab.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="font-sans text-[11px] font-medium text-[#172b24] pt-2">
                      {isSelected ? `✓ Selected · ${priceTag}` : priceTag}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="h-px w-full bg-[#e9e0d3]" />

          {/* 03 / CUSTOMIZE DETAILS · COLOUR & PATTERN (20:30717) */}
          <section
            className="flex flex-col gap-[24px] items-start w-full"
            data-node-id="20:30717"
          >
            <SectionHeading
              eyebrow="03 / CUSTOMIZE DETAILS · COLOUR & PATTERN"
              title="Find your shade"
            />

            {/* Colour Library (20:30722) */}
            <div
              className="flex flex-wrap gap-[24px] sm:gap-[30px] items-start w-full"
              data-node-id="20:30722"
            >
              {colorPalette.map((c) => {
                const isSelected = activeConfiguration.color.name === c.name;
                const ringSvg = SWATCH_RING_MAP[c.name];
                return (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSelectColor(c)}
                    className="flex flex-col gap-[10px] items-center cursor-pointer group"
                  >
                    <div
                      className={`relative size-[50px] rounded-full flex items-center justify-center ${
                        isSelected
                          ? "ring-2 ring-[#172b24] ring-offset-2 ring-offset-[#f5f0e7]"
                          : "group-hover:ring-1 group-hover:ring-[#b69a68]"
                      }`}
                    >
                      {ringSvg ? (
                        <img
                          alt={c.name}
                          className="size-full object-contain"
                          src={ringSvg}
                        />
                      ) : (
                        <span
                          className="size-[42px] rounded-full border border-[#d7cdbe]"
                          style={{ backgroundColor: c.hex }}
                        />
                      )}
                    </div>
                    <span className="font-sans text-[11px] text-black">
                      {isSelected ? `✓ ${c.name}` : c.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Pattern Library (20:30743) */}
            <div
              className="grid grid-cols-2 sm:grid-cols-5 gap-[12px] w-full"
              data-node-id="20:30743"
            >
              {patternPalette.map((pat) => {
                const isSelected = activeConfiguration.pattern.id === pat.id;
                return (
                  <button
                    key={pat.id}
                    type="button"
                    onClick={() =>
                      handleSelectPattern({ id: pat.id, name: pat.name })
                    }
                    className={`flex flex-col gap-[10px] items-start p-[6px] text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-2 border-[#172b24] bg-white"
                        : "border border-[#e9e0d3] hover:border-[#b69a68]"
                    }`}
                  >
                    <div className="relative h-[76px] w-full bg-[#e9e0d3] overflow-hidden flex items-center justify-center">
                      {pat.type === "solid" ? (
                        <div
                          className="size-full"
                          style={{ backgroundColor: activeConfiguration.color.hex }}
                        />
                      ) : pat.type === "img" ? (
                        <img
                          alt={pat.name}
                          className="size-full object-cover"
                          src={pat.src}
                        />
                      ) : (
                        <img
                          alt={pat.name}
                          className="h-full w-full object-cover"
                          src={pat.src}
                        />
                      )}
                    </div>
                    <span className="font-sans text-[12px] text-black">
                      {isSelected ? `✓ ${pat.name}` : pat.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="font-sans text-[12px] leading-[1.65] text-[#706a60] w-full">
              {activeConfiguration.color.name} / {activeConfiguration.pattern.name}{" "}
              selected · Included. Pattern alternatives shown for exploration; a
              tailor confirms availability.
            </p>
          </section>

          <div className="h-px w-full bg-[#e9e0d3]" />

          {/* 03 / CUSTOMIZE DETAILS · FINISHING (20:30766) */}
          <section
            id="step-details"
            className="flex flex-col gap-[24px] items-start w-full"
            data-node-id="20:30766"
          >
            <div className="flex flex-col gap-[8px] items-start w-full">
              <SectionHeading
                eyebrow="03 / CUSTOMIZE DETAILS · FINISHING"
                title="The details make it yours"
              />
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Practical field-jacket details, thoughtfully finished.
              </p>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-[20px] w-full"
              data-node-id="20:30772"
            >
              {STUDIO_DETAIL_CATEGORIES.map((category) => {
                const currentSelection = activeConfiguration.details[category.key];
                return (
                  <div
                    key={category.key}
                    className="flex gap-[16px] items-start bg-white border border-[#e9e0d3] p-[16px] w-full"
                  >
                    <div className="relative h-[80px] w-[76px] shrink-0">
                      <img
                        alt={category.label}
                        className="size-full object-contain"
                        src={category.iconSvg}
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                      <p className="font-sans text-[13px] font-medium text-black">
                        {category.label} style
                      </p>
                      <div className="flex flex-wrap gap-[6px] items-start">
                        {category.options.map((opt) => {
                          const isSelected = currentSelection === opt.label;
                          const priceSuffix =
                            opt.priceDeltaInr > 0
                              ? ` · + ₹${opt.priceDeltaInr}`
                              : opt.priceDeltaInr < 0
                              ? ` · − ₹${Math.abs(opt.priceDeltaInr)}`
                              : "";
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              onClick={() =>
                                handleSelectDetail(category.key, opt.label)
                              }
                              className={`px-[12px] py-[10px] text-[12px] border transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-[#172b24] border-[#172b24] text-[#f5f0e7]"
                                  : "bg-white border-[#e9e0d3] text-[#172b24] hover:border-[#172b24]"
                              }`}
                            >
                              {isSelected
                                ? `✓  ${opt.label}${priceSuffix}`
                                : `${opt.label}${priceSuffix}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Lining Select (20:30833) */}
            <div
              className="flex flex-col gap-[8px] items-start w-full"
              data-node-id="20:30833"
            >
              <label
                htmlFor="studio-lining-select"
                className="font-sans text-[12px] text-[#29251f]"
              >
                Lining
              </label>
              <div className="relative w-full">
                <select
                  id="studio-lining-select"
                  value={activeConfiguration.details.lining}
                  onChange={(e) => handleSelectDetail("lining", e.target.value)}
                  className="h-[56px] w-full appearance-none bg-white border border-[#e9e0d3] px-[16px] pr-10 text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
                >
                  {LINING_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[18px] text-[#172b24]">
                  ⌄
                </span>
              </div>
              <p className="font-sans text-[11px] text-[#172b24]">
                Included · Keeps the natural character of{" "}
                {activeConfiguration.fabric.name.toLowerCase()}.
              </p>
            </div>
          </section>

          <div className="h-px w-full bg-[#e9e0d3]" />

          {/* PERSONAL TOUCHES & REFERENCE UPLOAD (20:30840) */}
          <section
            className="flex flex-col gap-[20px] items-start w-full"
            data-node-id="20:30840"
          >
            <SectionHeading
              eyebrow="PERSONAL TOUCHES"
              title="A note to your tailor"
            />

            <textarea
              rows={4}
              value={activeConfiguration.personalNotes}
              onChange={(e) =>
                setActiveConfiguration((prev) => ({
                  ...prev,
                  personalNotes: e.target.value,
                }))
              }
              placeholder="Tell us how you'd like your outfit to look or fit... (e.g., watch allowance on left cuff, subtle tonal pick-stitching, or pocket placement)"
              className="w-full bg-white border border-[#e9e0d3] p-[20px] font-sans text-[14px] leading-[1.6] text-[#29251f] placeholder:text-[#706a60] focus:border-[#172b24] focus:outline-none"
              data-node-id="20:30845"
            />

            {/* Monogram Input */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full bg-white border border-[#e9e0d3] p-4">
              <div className="flex-1">
                <p className="font-sans text-[12px] font-medium text-[#172b24]">
                  Complimentary Interior Monogram (Optional)
                </p>
                <p className="font-sans text-[11px] text-[#706a60]">
                  Up to 6 characters stitched inside the placket or collar band in Muted Gold thread.
                </p>
              </div>
              <input
                type="text"
                maxLength={6}
                value={activeConfiguration.monogram ?? ""}
                onChange={(e) =>
                  setActiveConfiguration((prev) => ({
                    ...prev,
                    monogram: e.target.value,
                  }))
                }
                placeholder="e.g. A.R."
                className="h-[44px] w-full sm:w-[160px] border border-[#e9e0d3] bg-[#f5f0e7] px-3 text-[13px] text-[#172b24] focus:border-[#172b24] focus:outline-none"
              />
            </div>

            {/* Reference Upload (20:30847) */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] w-full"
              data-node-id="20:30847"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleReferenceFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-[150px] flex-col items-center justify-center gap-[12px] border border-dashed border-[#d7cdbe] p-[20px] text-center hover:border-[#172b24] transition-colors cursor-pointer"
                data-node-id="20:30848"
              >
                <img
                  alt=""
                  className="size-[22px]"
                  src={FIGMA_ASSETS.icons.upload}
                />
                <span className="font-sans text-[13px] text-black">
                  Add a reference image
                </span>
                <span className="font-sans text-[12px] text-[#706a60]">
                  JPG or PNG · Up to 10 MB · Optional
                </span>
              </button>

              {hasReferenceImage && (
                <div
                  className="flex h-[150px] items-start gap-[16px] bg-white p-[12px] border border-[#e9e0d3]"
                  data-node-id="20:30852"
                >
                  <div className="relative h-[126px] w-[100px] shrink-0 bg-[#e9e0d3] overflow-hidden">
                    <img
                      alt="Uploaded reference"
                      className="size-full object-cover"
                      src={uploadedPreviewUrl}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-[10px] items-start min-w-0">
                    <span className="bg-[#e9e0d3] px-[10px] py-[5px] text-[10px] tracking-[0.6px] text-[#172b24]">
                      UPLOADED PREVIEW
                    </span>
                    <p className="font-sans text-[12px] text-black truncate w-full">
                      {uploadedFileName}
                    </p>
                    <p className="font-sans text-[12px] text-[#706a60]">
                      {uploadedFileSize}
                    </p>
                    <ButtonText
                      label="Remove"
                      onClick={() => setHasReferenceImage(false)}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT STICKY COLUMN — DESIGN SUMMARY (20:30872) */}
        <aside
          className="w-full lg:w-[352px] shrink-0 bg-white border border-[#e9e0d3] lg:sticky lg:top-[124px]"
          data-node-id="20:30872"
        >
          <div
            className="relative h-[360px] sm:h-[440px] w-full bg-[#e9e0d3] overflow-hidden"
            data-node-id="20:30873"
          >
            <img
              alt={activeConfiguration.productName}
              className="size-full object-cover"
              src={activeConfiguration.productImage}
            />
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#172b24]/90 px-3 py-1.5 text-[11px] text-[#f5f0e7]">
              <span
                className="size-3 rounded-full border border-white/40"
                style={{ backgroundColor: activeConfiguration.color.hex }}
              />
              <span>
                {activeConfiguration.color.name} · {activeConfiguration.fabric.name}
              </span>
            </div>
          </div>

          <div
            className="flex flex-col gap-[16px] items-start p-[24px] w-full"
            data-node-id="20:30883"
          >
            <span className="bg-[#e9e0d3] px-[10px] py-[7px] font-sans text-[10px] tracking-[0.6px] text-[#172b24]">
              YOUR DESIGN · UNISEX
            </span>

            <h2 className="font-serif text-[28px] text-[#172b24] leading-tight">
              {activeConfiguration.productName}
            </h2>
            <p className="font-sans text-[12px] text-[#706a60]">
              {activeConfiguration.vendorName} · New Delhi, India
            </p>

            <div className="h-px w-full bg-[#e9e0d3]" />

            <div className="flex flex-col gap-[4px] w-full">
              <span className="text-[10px] text-[#706a60]">STYLE</span>
              <span className="text-[12px] text-[#172b24]">
                {activeConfiguration.styleSilhouette.name}
              </span>
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="text-[10px] text-[#706a60]">FABRIC</span>
              <span className="text-[12px] text-[#172b24]">
                {activeConfiguration.fabric.name}
              </span>
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="text-[10px] text-[#706a60]">COLOUR / PATTERN</span>
              <span className="text-[12px] text-[#172b24]">
                {activeConfiguration.color.name} / {activeConfiguration.pattern.name}
              </span>
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="text-[10px] text-[#706a60]">DETAILS</span>
              <span className="text-[12px] text-[#172b24]">
                {activeConfiguration.details.collar} ·{" "}
                {activeConfiguration.details.sleeves}
              </span>
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="text-[10px] text-[#706a60]">FINISHING</span>
              <span className="text-[12px] text-[#172b24]">
                {activeConfiguration.details.cuffs} ·{" "}
                {activeConfiguration.details.length}
              </span>
            </div>

            <div className="flex flex-col gap-[4px] w-full">
              <span className="text-[10px] text-[#706a60]">SIGNATURE</span>
              <span className="text-[12px] text-[#172b24]">
                {activeConfiguration.details.buttons} ·{" "}
                {activeConfiguration.details.pockets}
              </span>
            </div>

            <div className="h-px w-full bg-[#e9e0d3]" />

            <div className="flex items-center justify-between w-full text-[11px] text-black">
              <span>Base garment</span>
              <span>{formatInr(activeConfiguration.basePriceInr)}</span>
            </div>

            <div className="flex items-center justify-between w-full text-[11px] text-black">
              <span>
                {activeConfiguration.fabric.name} · {activeConfiguration.color.name} ·{" "}
                {activeConfiguration.pattern.name}
              </span>
              <span>
                {activeConfiguration.fabric.priceDeltaInr === 0
                  ? "Included"
                  : activeConfiguration.fabric.priceDeltaInr > 0
                  ? `+ ${formatInr(activeConfiguration.fabric.priceDeltaInr)}`
                  : `− ${formatInr(Math.abs(activeConfiguration.fabric.priceDeltaInr))}`}
              </span>
            </div>

            <div className="flex items-center justify-between w-full text-[11px] text-black">
              <span>{activeConfiguration.details.buttons}</span>
              <span>
                {computedTotalInr -
                  activeConfiguration.basePriceInr -
                  activeConfiguration.fabric.priceDeltaInr >
                0
                  ? `+ ${formatInr(
                      computedTotalInr -
                        activeConfiguration.basePriceInr -
                        activeConfiguration.fabric.priceDeltaInr
                    )}`
                  : "Included"}
              </span>
            </div>

            <div className="flex items-center justify-between w-full pt-1">
              <span className="font-sans text-[12px] text-black">
                Sample estimate
              </span>
              <span className="font-serif text-[30px] text-[#172b24]">
                {formatInr(computedTotalInr)}
              </span>
            </div>

            <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
              Illustrative INR pricing, not a final quote. Your tailor confirms
              the price after reviewing your choices and measurements.
            </p>

            <ButtonPrimary
              label="Continue to Measurements"
              href="/measurements"
              fullWidth
            />
            <ButtonSecondary
              label="Preview on 3D Avatar"
              href="/customize/preview"
              fullWidth
            />
            <ButtonSecondary
              label="Save Design"
              href="/customize/save"
              fullWidth
            />
          </div>
        </aside>
      </main>

      {/* BOTTOM STUDIO ACTION BAR (20:30927) */}
      <div
        className="w-full border-t border-[#e9e0d3] bg-[#f5f0e7] px-4 sm:px-8 lg:px-[72px] py-[28px]"
        data-node-id="20:30927"
      >
        <div className="mx-auto flex w-full max-w-[1296px] flex-col sm:flex-row items-center justify-between gap-4">
          <ButtonSecondary label="Save Design" href="/customize/save" />
          <p className="font-sans text-[13px] text-[#172b24] text-center">
            {activeConfiguration.productName} &nbsp; · &nbsp; Sample estimate{" "}
            {formatInr(computedTotalInr)}
          </p>
          <ButtonPrimary
            label="Continue to Measurements"
            onClick={() => router.push("/measurements")}
          />
        </div>
      </div>

      <StudioFooter />
    </div>
  );
}

export default function CustomizePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f0e7] flex items-center justify-center text-[#172b24]">
          Loading Customization Studio…
        </div>
      }
    >
      <CustomizationStudioContent />
    </Suspense>
  );
}
