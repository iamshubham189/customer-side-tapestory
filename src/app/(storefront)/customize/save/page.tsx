"use client";

import React, { useState } from "react";
import Link from "next/link";
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

export default function SaveDesignPage() {
  const router = useRouter();
  const {
    activeConfiguration,
    measurementProfiles,
    activeMeasurementProfileId,
    savedDesigns,
    saveDesignToCollection,
    loadSavedDesignIntoStudio,
    addToCart,
  } = useTapestory();

  const [designName, setDesignName] = useState<string>("The Forest Weekender");
  const [collectionTag, setCollectionTag] = useState<string>(
    `Personal Archive · ${activeConfiguration.vendorName}`
  );
  const [destination, setDestination] = useState<"Saved" | "Draft">("Saved");
  const [saveState, setSaveState] = useState<
    "idle" | "saving" | "saved" | "error"
  >("saved");

  const activeProfile =
    measurementProfiles.find((m) => m.id === activeMeasurementProfileId) ??
    measurementProfiles[0];

  const totalEstimateInr = calculateEstimatedPrice(activeConfiguration);

  const handleSaveDesign = () => {
    if (!designName.trim()) {
      setSaveState("error");
      return;
    }
    setSaveState("saving");
    setTimeout(() => {
      saveDesignToCollection(designName, collectionTag, destination);
      setSaveState("saved");
    }, 350);
  };

  const handleAddToCartAndCheckout = () => {
    addToCart(activeConfiguration, 1);
    router.push("/cart");
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="20:31707"
    >
      <Header />

      <StudioHeader
        breadcrumbLabel="Home / Product / Customize"
        eyebrow="THE CUSTOMIZATION STUDIO / 04"
        title="Save Your Creation"
        description="A design that feels like you. Give it a name and decide where its story continues."
        signatureQuote="Your story, in the making."
        activeStepIndex={5}
      />

      <main
        className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[48px] px-4 sm:px-8 lg:px-[72px] pb-[64px]"
        data-node-id="20:31808"
      >
        {/* TOP SPLIT: DESIGN REVIEW & SAVE FORM (20:31809) */}
        <section
          className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[48px] w-full"
          data-node-id="20:31809"
        >
          {/* Left: Design Review Card (20:31810) */}
          <div
            className="flex flex-col gap-[20px] items-start w-full lg:w-[608px] shrink-0"
            data-node-id="20:31810"
          >
            <div
              className="relative h-[440px] sm:h-[680px] w-full bg-[#e9e0d3] overflow-hidden"
              data-node-id="20:31811"
            >
              <img
                alt={activeConfiguration.productName}
                className="size-full object-cover"
                src={activeConfiguration.productImage}
              />
              <div
                className="absolute bottom-[20px] left-[20px] bg-[#e9e0d3] px-[10px] py-[7px]"
                data-node-id="20:31823"
              >
                <p className="font-sans text-[10px] tracking-[0.6px] text-[#172b24] uppercase">
                  YOUR {activeConfiguration.productName} ·{" "}
                  {activeConfiguration.color.name}
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-[20px] bg-[#e9e0d3] p-[20px] w-full"
              data-node-id="20:31825"
            >
              <div className="relative h-[96px] w-[88px] shrink-0 bg-[#f5f0e7] overflow-hidden">
                <img
                  alt=""
                  className="size-full object-cover"
                  src={FIGMA_ASSETS.images.productLinenFieldJacketDetail}
                />
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start">
                <p className="font-serif text-[24px] text-[#172b24]">
                  {activeConfiguration.productName}
                </p>
                <p className="font-sans text-[12px] text-[#706a60]">
                  By {activeConfiguration.vendorName} · New Delhi, India
                </p>
                <p className="font-sans text-[12px] text-[#706a60]">
                  Natural {activeConfiguration.fabric.name.toLowerCase()}.
                  Practical details. Your proportions.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Save Form (20:31840) */}
          <div
            className="flex flex-1 flex-col gap-[24px] items-start w-full min-w-0"
            data-node-id="20:31840"
          >
            <SectionHeading
              eyebrow="REVIEW YOUR DESIGN"
              title="A little more you."
            />

            {/* Attributes Grid (20:31845) */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 gap-[24px] w-full"
              data-node-id="20:31845"
            >
              <div className="flex flex-col gap-[10px] items-start">
                <p className="font-sans text-[12px] text-[#706a60]">
                  STYLE &amp; FABRIC
                </p>
                <p className="font-sans text-[15px] text-black">
                  {activeConfiguration.styleSilhouette.name} ·{" "}
                  {activeConfiguration.fabric.name}
                </p>
                <p className="font-sans text-[13px] text-black">
                  {activeConfiguration.color.name} ·{" "}
                  {activeConfiguration.pattern.name} pattern
                </p>
              </div>
              <div className="flex flex-col gap-[10px] items-start">
                <p className="font-sans text-[12px] text-[#706a60]">
                  FINISHING
                </p>
                <div className="font-sans text-[13px] leading-[1.65] text-black">
                  <p>
                    {activeConfiguration.details.collar} ·{" "}
                    {activeConfiguration.details.sleeves}
                  </p>
                  <p>
                    {activeConfiguration.details.cuffs} ·{" "}
                    {activeConfiguration.details.length}
                  </p>
                  <p>
                    {activeConfiguration.details.buttons} ·{" "}
                    {activeConfiguration.details.pockets}
                  </p>
                </div>
              </div>
            </div>

            {/* Linked Measurement Profile Card (20:31853) */}
            <div
              className="flex flex-col sm:flex-row sm:items-center gap-[16px] bg-[#e9e0d3] p-[18px] w-full"
              data-node-id="20:31853"
            >
              <img
                alt=""
                className="size-[22px] shrink-0"
                src={FIGMA_ASSETS.icons.rulerStudio}
              />
              <div className="flex flex-1 flex-col gap-[6px] items-start">
                <p className="font-sans text-[13px] font-medium text-black">
                  {activeProfile.name}
                </p>
                <div className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                  <p>
                    {activeProfile.method} · Updated {activeProfile.lastUpdated}
                  </p>
                  <p>
                    Chest {activeProfile.values.chest} · Waist{" "}
                    {activeProfile.values.waist} · Hip{" "}
                    {activeProfile.values.seatHips} · Shoulder{" "}
                    {activeProfile.values.shoulderWidth} {activeProfile.unit}
                  </p>
                  <p>
                    Sleeve {activeProfile.values.sleeveLength} · Garment{" "}
                    {activeProfile.values.garmentLength} {activeProfile.unit}
                  </p>
                </div>
              </div>
              <ButtonText label="Edit" href="/measurements" />
            </div>

            {/* Design Name Input (20:31862) */}
            <div
              className="flex flex-col gap-[8px] items-start w-full"
              data-node-id="20:31862"
            >
              <label
                htmlFor="design-name-input"
                className="font-sans text-[12px] text-[#29251f]"
              >
                Design name
              </label>
              <input
                id="design-name-input"
                type="text"
                maxLength={60}
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="h-[56px] w-full bg-white border border-[#e9e0d3] p-[16px] font-sans text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
              />
              <p className="font-sans text-[11px] text-[#172b24]">
                Choose a name that helps you find it again. {designName.length} /
                60 characters
              </p>
            </div>

            {/* Collection Tag Input */}
            <div className="flex flex-col gap-[8px] items-start w-full">
              <label
                htmlFor="collection-tag-input"
                className="font-sans text-[12px] text-[#29251f]"
              >
                Collection / Occasion tag
              </label>
              <input
                id="collection-tag-input"
                type="text"
                value={collectionTag}
                onChange={(e) => setCollectionTag(e.target.value)}
                className="h-[48px] w-full bg-white border border-[#e9e0d3] px-[16px] font-sans text-[13px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
              />
            </div>

            {/* Save Destinations (20:31867) */}
            <div
              className="flex flex-col gap-[12px] items-start w-full"
              data-node-id="20:31867"
            >
              <button
                type="button"
                onClick={() => setDestination("Saved")}
                className={`flex flex-col gap-[6px] items-start p-[18px] w-full text-left transition-colors cursor-pointer ${
                  destination === "Saved"
                    ? "bg-white border-2 border-[#172b24]"
                    : "bg-transparent border border-[#e9e0d3] hover:border-[#b69a68]"
                }`}
                data-node-id="20:31868"
              >
                <div className="flex items-center gap-[12px]">
                  <span
                    className={`size-[20px] rounded-full border flex items-center justify-center ${
                      destination === "Saved"
                        ? "border-[#172b24]"
                        : "border-[#29251f]"
                    }`}
                  >
                    {destination === "Saved" && (
                      <span className="size-[8px] rounded-full bg-[#172b24]" />
                    )}
                  </span>
                  <span className="font-sans text-[14px] text-[#29251f]">
                    Save to Wishlist
                  </span>
                </div>
                <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                  Save your customized design for later, with its selected details
                  and measurement profile.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDestination("Draft")}
                className={`flex flex-col gap-[6px] items-start p-[18px] w-full text-left transition-colors cursor-pointer ${
                  destination === "Draft"
                    ? "bg-white border-2 border-[#172b24]"
                    : "bg-transparent border border-[#e9e0d3] hover:border-[#b69a68]"
                }`}
                data-node-id="20:31876"
              >
                <div className="flex items-center gap-[12px]">
                  <span
                    className={`size-[20px] rounded-full border flex items-center justify-center ${
                      destination === "Draft"
                        ? "border-[#172b24]"
                        : "border-[#29251f]"
                    }`}
                  >
                    {destination === "Draft" && (
                      <span className="size-[8px] rounded-full bg-[#172b24]" />
                    )}
                  </span>
                  <span className="font-sans text-[14px] text-[#29251f]">
                    Save as Draft
                  </span>
                </div>
                <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                  Save your progress and return to customization when inspiration
                  strikes.
                </p>
              </button>
            </div>

            {/* Price Breakdown (20:31881) */}
            <div
              className="flex items-center justify-between w-full pt-2"
              data-node-id="20:31881"
            >
              <div className="flex flex-col gap-[6px] text-[12px]">
                <span className="text-black">Sample estimated total</span>
                <span className="text-[#706a60]">
                  {formatInr(activeConfiguration.basePriceInr)} base + custom
                  fabric &amp; finishing
                </span>
              </div>
              <p className="font-serif text-[36px] text-[#172b24]">
                {formatInr(totalEstimateInr)}
              </p>
            </div>

            <p className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
              {activeConfiguration.fabric.name}, {activeConfiguration.color.name}{" "}
              and {activeConfiguration.pattern.name} are included. This
              illustrative estimate is not a committed quote. Your tailor
              confirms availability and final pricing.
            </p>

            {/* Save Actions (20:31887) */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[16px] w-full"
              data-node-id="20:31887"
            >
              <ButtonPrimary
                label={saveState === "saving" ? "Saving…" : "Save Design"}
                onClick={handleSaveDesign}
                className="flex-1"
              />
              <ButtonSecondary
                label="Add to Bag & Checkout"
                onClick={handleAddToCartAndCheckout}
              />
              <ButtonSecondary label="Back to Customize" href="/customize" />
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[#e9e0d3]" />

        {/* AFTER YOU SAVE / CONFIRMATION PANEL (20:31896) */}
        <section
          className="flex flex-col gap-[24px] items-start w-full"
          data-node-id="20:31896"
        >
          <SectionHeading
            eyebrow="AFTER YOU SAVE / EXAMPLE CONFIRMATION"
            title="Ready for the next chapter"
          />

          <div
            className="flex flex-col lg:flex-row items-start lg:items-center gap-[32px] bg-[#e9e0d3] p-6 sm:p-[32px] w-full"
            data-node-id="20:31901"
          >
            <div className="relative h-[152px] w-[120px] shrink-0 bg-[#f5f0e7] overflow-hidden">
              <img
                alt={activeConfiguration.productName}
                className="size-full object-cover"
                src={activeConfiguration.productImage}
              />
            </div>

            <div className="flex flex-1 flex-col gap-[16px] items-start w-full">
              <div
                className="flex items-start gap-4 bg-[#f5f0e7] border border-[#172b24] p-[19px] w-full"
                data-node-id="5:7756"
              >
                <span className="text-[20px] text-[#172b24]">✓</span>
                <div className="flex flex-col gap-1">
                  <p className="font-sans text-[16px] text-[#172b24]">
                    Your creation is saved.
                  </p>
                  <p className="font-sans text-[13px] text-[#29251f]">
                    {designName || "The Forest Weekender"} is in your{" "}
                    {destination === "Saved" ? "wishlist" : "drafts"}. Return to
                    refine it whenever you like.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-[16px]">
                <ButtonPrimary
                  label="View Wishlist"
                  href="/account/wishlist"
                />
                <ButtonText label="Continue designing" href="/customize" />
              </div>
            </div>

            <div
              className="flex flex-col gap-[12px] items-start lg:w-[240px]"
              data-node-id="20:31926"
            >
              <span className="bg-[#f5f0e7] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                {saveState === "saved" ? "SAVED TO ARCHIVE" : "EXAMPLE SUCCESS STATE"}
              </span>
              <div className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                <p>
                  {destination === "Saved" ? "Wishlist" : "Draft"} · 8 Nov 2026
                </p>
                <p>{activeConfiguration.productName}</p>
                <p>{activeProfile.name}</p>
              </div>
            </div>
          </div>

          {/* Alternate Save Statuses (20:31930) */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
            data-node-id="20:31930"
          >
            <div
              className="flex items-start gap-[20px] bg-white border border-[#e9e0d3] p-[24px]"
              data-node-id="20:31931"
            >
              <img
                alt=""
                className={`size-[22px] shrink-0 ${
                  saveState === "saving" ? "animate-spin" : ""
                }`}
                src={FIGMA_ASSETS.icons.loaderCircle}
              />
              <div className="flex flex-col gap-[10px] items-start">
                <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                  WHILE SAVING · EXAMPLE
                </span>
                <p className="font-sans text-[15px] text-black">
                  Saving your design…
                </p>
                <p className="font-sans text-[12px] text-[#706a60]">
                  Please wait before leaving this page.
                </p>
              </div>
            </div>

            <div
              className="flex flex-col gap-[12px] items-start bg-white border border-[#e9e0d3] p-[24px]"
              data-node-id="20:31938"
            >
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24]">
                IF SAVE FAILS · EXAMPLE
              </span>
              <div className="flex items-start gap-4 bg-[#f5f0e7] border border-[#29251f] p-[19px] w-full">
                <span className="text-[20px] text-[#172b24]">!</span>
                <div className="flex flex-col gap-1">
                  <p className="font-sans text-[16px] text-[#172b24]">
                    Your design could not be saved.
                  </p>
                  <p className="font-sans text-[13px] text-[#29251f]">
                    Keep this page open and try again.
                  </p>
                </div>
              </div>
              <ButtonText label="Retry Save" onClick={handleSaveDesign} />
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-[#e9e0d3]" />

        {/* EXISTING SAVED DESIGNS (20:31950) */}
        <section
          className="flex flex-col gap-[24px] items-start w-full"
          data-node-id="20:31950"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
            <SectionHeading
              eyebrow="EXISTING SAVED DESIGNS / POPULATED EXAMPLE"
              title="Your stories in progress"
            />
            <ButtonText
              label="View all saved designs"
              href="/account/wishlist"
            />
          </div>

          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] w-full"
            data-node-id="20:31960"
          >
            {savedDesigns.slice(0, 4).map((design) => (
              <div
                key={design.id}
                className="flex flex-col sm:flex-row items-start gap-[24px] bg-white border border-[#e9e0d3] p-[16px]"
              >
                <div className="relative h-[244px] w-full sm:w-[180px] shrink-0 bg-[#e9e0d3] overflow-hidden">
                  <img
                    alt={design.name}
                    className="size-full object-cover"
                    src={design.configuration.productImage}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-[16px] items-start">
                  <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.6px] text-[#172b24] uppercase">
                    {design.status === "Saved"
                      ? "WISHLIST"
                      : "DRAFT · DETAILS IN PROGRESS"}
                  </span>
                  <h3 className="font-serif text-[28px] text-black leading-tight">
                    {design.name}
                  </h3>
                  <div className="font-sans text-[12px] leading-[1.65] text-[#706a60]">
                    <p>
                      {design.configuration.fabric.name} ·{" "}
                      {design.configuration.color.name} ·{" "}
                      {design.configuration.styleSilhouette.name}
                    </p>
                    <p>
                      Sample estimate{" "}
                      {formatInr(design.configuration.totalEstimatedPriceInr)}
                    </p>
                    <p>Saved {design.updatedAt}</p>
                  </div>
                  <ButtonText
                    label={
                      design.status === "Saved"
                        ? "Open design"
                        : "Resume customization"
                    }
                    onClick={() => {
                      loadSavedDesignIntoStudio(design.id);
                      router.push(`/customize?saved=${design.id}`);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FIRST VISIT / ALTERNATE EMPTY STATES (20:32001) */}
        <section
          className="flex flex-col gap-[24px] items-start bg-[#e9e0d3] p-6 sm:p-[32px] w-full"
          data-node-id="20:32001"
        >
          <div className="flex flex-col gap-[8px] items-start w-full">
            <SectionHeading
              eyebrow="FIRST VISIT / ALTERNATE EMPTY STATES"
              title="Every story starts somewhere"
            />
            <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
              These are the first-visit experiences before any designs are saved
              — separate from the populated example above.
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
            data-node-id="20:32007"
          >
            <div className="flex flex-col justify-between bg-[#f5f0e7] p-[32px] min-h-[240px]">
              <div className="flex flex-col gap-3">
                <p className="font-serif text-[28px] text-[#172b24]">
                  Your wishlist is waiting.
                </p>
                <p className="font-sans text-[14px] text-[#29251f]">
                  Save a customized design to keep inspiration close.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/customize"
                  className="inline-flex h-[48px] items-center justify-center bg-[#172b24] px-[20px] font-sans text-[14px] text-white"
                >
                  Start a Design &nbsp;↗
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-[#f5f0e7] p-[32px] min-h-[240px]">
              <div className="flex flex-col gap-3">
                <p className="font-serif text-[28px] text-[#172b24]">
                  A fresh page for your ideas.
                </p>
                <p className="font-sans text-[14px] text-[#29251f]">
                  No drafts yet. Start with a silhouette and make it yours.
                </p>
              </div>
              <div className="pt-6">
                <Link
                  href="/products"
                  className="inline-flex h-[48px] items-center justify-center bg-[#172b24] px-[20px] font-sans text-[14px] text-white"
                >
                  Explore Base Designs &nbsp;↗
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <StudioFooter />
    </div>
  );
}
