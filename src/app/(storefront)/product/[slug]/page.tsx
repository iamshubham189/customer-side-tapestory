"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import { SEED_FABRICS, SEED_PRODUCTS, SEED_REVIEWS, SEED_VENDORS } from "@/lib/backend/seed-data";
import { formatInr } from "@/lib/utils/format";
import { createDefaultConfiguration } from "@/services/customization.service";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonPrimary, ButtonText } from "@/components/common/Button";
import { SectionHeadingWithViewAll } from "@/components/common/SectionHeading";
import { TrustIndicator } from "@/components/common/EditorialBlocks";
import { ProductCard } from "@/components/products/ProductCard";

const GALLERY_LABELS = ["Front view", "Back view", "Fabric detail", "Lifestyle"];

function ProductDetailView({ slug }: { slug: string }) {
  const router = useRouter();
  const {
    addToCart,
    loadProductIntoStudio,
    toggleWishlistProduct,
    isProductWishlisted,
    isHydrated,
  } = useTapestory();

  const product =
    SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug) ?? SEED_PRODUCTS[0];
  const vendor =
    SEED_VENDORS.find((v) => v.id === product.vendorId) ?? SEED_VENDORS[0];

  const gallery =
    product.galleryImages.length >= 4
      ? product.galleryImages
      : [
          product.primaryImage,
          FIGMA_ASSETS.images.jacketGalleryBack,
          FIGMA_ASSETS.images.jacketGalleryFabric,
          FIGMA_ASSETS.images.jacketGalleryLifestyle,
        ];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [selectedFabricName, setSelectedFabricName] = useState<string>(
    product.fabricFamily
  );
  const [selectedStyleName, setSelectedStyleName] = useState<string>(
    product.category === "Jackets" ? "Field Jacket (Relaxed)" : "Classic Tailored"
  );
  const [selectedColor, setSelectedColor] = useState(
    product.availableColors[0] ?? { name: "Deep Green", hex: "#172B24" }
  );

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    details: true,
    fabric: true,
    customization: false,
    sizeGuide: false,
    delivery: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const fabricObj =
    SEED_FABRICS.find((f) => f.name === selectedFabricName) ?? SEED_FABRICS[0];
  const computedPrice =
    product.startingPriceInr + (fabricObj ? fabricObj.priceModifierInr : 0);

  const wishlisted = isHydrated ? isProductWishlisted(product.id) : false;

  const handleBuyNow = () => {
    const baseConfig = createDefaultConfiguration(product.slug);
    const updatedConfig = {
      ...baseConfig,
      fabric: {
        id: fabricObj.id,
        name: fabricObj.name,
        materialFamily: fabricObj.materialFamily,
        composition: `${fabricObj.name} (${fabricObj.weightGsm} GSM)`,
        priceDeltaInr: fabricObj.priceModifierInr,
        swatchImage: fabricObj.swatchImage,
      },
      color: selectedColor,
      totalEstimatedPriceInr: computedPrice,
    };
    addToCart(updatedConfig, 1);
    router.push("/cart");
  };

  const handleCustomizeNow = () => {
    loadProductIntoStudio(product.slug);
    router.push(`/customize?product=${product.slug}`);
  };

  const similarProducts = SEED_PRODUCTS.filter((p) => p.id !== product.id).slice(
    0,
    4
  );
  const completeLookProducts = SEED_PRODUCTS.filter(
    (p) => p.id !== product.id
  ).slice(4, 8);

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="12:21859"
    >
      <Header />

      <main className="flex-1">
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[28px] px-4 sm:px-8 lg:px-[72px] pt-[32px] pb-[72px]"
          data-node-id="12:21890"
        >
          {/* Breadcrumb */}
          <div
            className="flex h-[32px] items-center flex-wrap gap-2 text-[14px] text-[#29251f]"
            data-node-id="5:7727"
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span>/</span>
            <Link
              href={`/products?gender=${product.gender}`}
              className="hover:underline"
            >
              {product.gender}
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:underline">
              {product.category}
            </Link>
            <span>/</span>
            <span className="font-medium text-[#172b24]">{product.name}</span>
          </div>

          {/* Product Overview Grid (12:21893) */}
          <div
            className="flex flex-col lg:flex-row items-start gap-10 lg:gap-[64px] w-full"
            data-node-id="12:21893"
          >
            {/* Left Column: Product Gallery & Editorial Story (12:21894) */}
            <div
              className="flex flex-col gap-[28px] items-start w-full lg:w-[664px] shrink-0"
              data-node-id="12:21894"
            >
              <div
                className="flex flex-col-reverse sm:flex-row items-start gap-[16px] w-full"
                data-node-id="12:21895"
              >
                {/* Thumbnail Strip (12:21896) */}
                <div
                  className="grid grid-cols-4 sm:flex sm:flex-col gap-[12px] sm:gap-[16px] w-full sm:w-[76px] shrink-0"
                  data-node-id="12:21896"
                >
                  {gallery.slice(0, 4).map((imgUrl, idx) => {
                    const isSelected = activeImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`flex flex-col gap-[6px] items-start w-full cursor-pointer ${
                          isSelected
                            ? "border border-[#172b24] p-[3px]"
                            : "opacity-80 hover:opacity-100"
                        }`}
                      >
                        <div className="relative h-[80px] sm:h-[96px] w-full overflow-hidden bg-[#e9e0d3]">
                          <img
                            alt={`${product.name} ${GALLERY_LABELS[idx]}`}
                            className="absolute inset-0 size-full object-cover"
                            src={imgUrl}
                          />
                        </div>
                        <span className="font-sans text-[9px] text-[#29251f] text-center w-full">
                          {GALLERY_LABELS[idx] ?? `View ${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Primary Image (12:21909) */}
                <div
                  className="relative flex-1 h-[420px] sm:h-[600px] lg:h-[730px] w-full overflow-hidden bg-[#e9e0d3]"
                  data-node-id="12:21909"
                >
                  <img
                    alt={product.name}
                    className="absolute inset-0 size-full object-cover"
                    src={gallery[activeImageIndex]}
                  />
                  <button
                    type="button"
                    onClick={() => setFullscreenOpen(true)}
                    aria-label="View fullscreen image"
                    className="absolute top-[16px] right-[16px] flex size-[40px] items-center justify-center bg-[#f5f0e7] cursor-pointer hover:bg-[#e9e0d3]"
                    data-node-id="12:21911"
                  >
                    <img
                      alt=""
                      className="size-[20px]"
                      src={FIGMA_ASSETS.icons.maximize}
                    />
                  </button>
                  <div
                    className="absolute bottom-[20px] left-[20px] bg-[#f5f0e7] px-[12px] py-[9px]"
                    data-node-id="12:21913"
                  >
                    <p className="font-sans text-[10px] tracking-[0.6px] text-[#172b24]">
                      {(GALLERY_LABELS[activeImageIndex] ?? "VIEW").toUpperCase()} ·{" "}
                      {selectedColor.name.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3D Preview Entry Banner (12:21915) */}
              <div
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-[#e9e0d3] p-[20px] w-full bg-[#f5f0e7]"
                data-node-id="12:21915"
              >
                <div
                  className="flex items-center gap-[12px]"
                  data-node-id="12:21916"
                >
                  <img
                    alt=""
                    className="size-[24px] shrink-0"
                    src={FIGMA_ASSETS.icons.box3d}
                  />
                  <div className="flex flex-col gap-[4px] items-start">
                    <p className="font-sans text-[13px] text-[#172b24]">
                      See it from a new perspective
                    </p>
                    <p className="font-sans text-[10px] text-[#29251f]">
                      3D / Try-On preview · visual concept
                    </p>
                  </div>
                </div>
                <ButtonText
                  label="Explore preview"
                  href={`/customize/preview?product=${product.slug}`}
                />
              </div>

              {/* Material Story (12:21925) */}
              <div
                className="flex flex-col sm:flex-row items-start gap-[24px] pt-[20px] w-full"
                data-node-id="12:21925"
              >
                <div
                  className="relative h-[220px] sm:h-[260px] w-full sm:w-[240px] shrink-0 overflow-hidden"
                  data-node-id="12:21926"
                >
                  <img
                    alt="Linen texture detail"
                    className="absolute inset-0 size-full object-cover"
                    src={FIGMA_ASSETS.images.jacketMaterialStory}
                  />
                </div>
                <div
                  className="flex flex-1 flex-col justify-center gap-[16px] sm:h-[260px]"
                  data-node-id="12:21927"
                >
                  <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
                    THE BEAUTY IS IN THE DETAILS
                  </p>
                  <h3 className="font-serif text-[28px] leading-[1.2] text-[#172b24] whitespace-pre-line">
                    {"Texture with\ncharacter."}
                  </h3>
                  <p className="font-sans text-[13px] leading-[1.7] text-[#29251f]">
                    Natural linen brings a breathable feel and a softly lived-in
                    texture. Choose the colour, proportions and finishing that
                    feel like you.
                  </p>
                </div>
              </div>

              {/* Jacket Lifestyle Banner (12:21931) */}
              <div
                className="relative h-[260px] sm:h-[330px] w-full overflow-hidden"
                data-node-id="12:21931"
              >
                <img
                  alt={`${product.name} editorial`}
                  className="absolute inset-0 size-full object-cover"
                  src={FIGMA_ASSETS.images.jacketEditorialBanner}
                />
              </div>
            </div>

            {/* Right Column: Product Information & Configurator Entry (12:21932) */}
            <div
              className="flex flex-1 flex-col gap-[20px] items-start w-full"
              data-node-id="12:21932"
            >
              <div
                className="flex items-center justify-between w-full"
                data-node-id="12:21933"
              >
                <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
                  {product.category.toUpperCase()} · {product.gender.toUpperCase()}
                </p>
                <div className="bg-[#e9e0d3] p-[8px]" data-node-id="12:21935">
                  <p className="font-sans text-[10px] tracking-[0.5px] text-[#172b24]">
                    BESTSELLER · SAMPLE
                  </p>
                </div>
              </div>

              <h1
                className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24] w-full"
                data-node-id="12:21937"
              >
                {product.name}
              </h1>

              <div
                className="flex flex-col gap-[6px] items-start w-full"
                data-node-id="12:21938"
              >
                <div className="flex items-center gap-3" data-node-id="5:7700">
                  <span className="text-[18px] text-[#b69a68]">★★★★★</span>
                  <span className="text-[12px] text-[#29251f]">
                    {product.ratingAvg} / 5 · {product.reviewCount} sample reviews
                  </span>
                </div>
                <Link
                  href={`/vendors/${vendor.slug}`}
                  className="text-[13px] text-[#172b24] hover:underline"
                  data-node-id="12:21942"
                >
                  Designed by {product.vendorName}
                </Link>
              </div>

              <div
                className="flex flex-col gap-[8px] items-start w-full"
                data-node-id="12:21943"
              >
                <p className="font-sans text-[11px] text-[#29251f]">
                  STARTING FROM
                </p>
                <p
                  className="font-serif text-[40px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
                  data-node-id="12:21945"
                >
                  {formatInr(computedPrice)}
                </p>
                <p className="font-sans text-[11px] leading-[1.7] text-[#29251f]">
                  Inclusive of applicable taxes. Final price reflects your
                  customization.
                </p>
              </div>

              <p
                className="font-sans text-[14px] leading-[1.7] text-[#29251f] w-full"
                data-node-id="12:21947"
              >
                {product.description}
              </p>

              {/* Product Benefits Strip (12:21948) */}
              <div
                className="flex flex-wrap items-center justify-between gap-4 border-y border-[#e9e0d3] py-[16px] w-full"
                data-node-id="12:21948"
              >
                <div className="flex items-center gap-[12px]">
                  <img
                    alt=""
                    className="size-[20px]"
                    src={FIGMA_ASSETS.icons.layersTrust}
                  />
                  <span className="text-[12px] text-[#172b24]">
                    Breathable Fabric
                  </span>
                </div>
                <div className="flex items-center gap-[12px]">
                  <img
                    alt=""
                    className="size-[20px]"
                    src={FIGMA_ASSETS.icons.rulerTrust}
                  />
                  <span className="text-[12px] text-[#172b24]">
                    Made to Measure
                  </span>
                </div>
                <div className="flex items-center gap-[12px]">
                  <img
                    alt=""
                    className="size-[20px]"
                    src={FIGMA_ASSETS.icons.scissorsTrust}
                  />
                  <span className="text-[12px] text-[#172b24]">
                    Customizable Fit
                  </span>
                </div>
              </div>

              {/* Make it yours Quick Customization Box (12:21967) */}
              <div
                className="flex flex-col gap-[18px] items-start bg-[#e9e0d3] p-[24px] w-full"
                data-node-id="12:21967"
              >
                <div className="flex flex-col gap-[6px] items-start">
                  <p className="font-serif text-[24px] text-[#172b24]">
                    Make it yours
                  </p>
                  <p className="font-sans text-[11px] text-[#29251f]">
                    Start with the essentials. Refine every detail next.
                  </p>
                </div>

                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-[16px] w-full"
                  data-node-id="12:21971"
                >
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="pdp-fabric-select"
                      className="text-[12px] text-[#29251f]"
                    >
                      Fabric
                    </label>
                    <select
                      id="pdp-fabric-select"
                      value={selectedFabricName}
                      onChange={(e) => setSelectedFabricName(e.target.value)}
                      className="h-[56px] w-full border border-[#e9e0d3] bg-white px-[15px] text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
                    >
                      {SEED_FABRICS.map((f) => (
                        <option key={f.id} value={f.name}>
                          {f.name} ({f.weightGsm} GSM)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="pdp-style-select"
                      className="text-[12px] text-[#29251f]"
                    >
                      Style
                    </label>
                    <select
                      id="pdp-style-select"
                      value={selectedStyleName}
                      onChange={(e) => setSelectedStyleName(e.target.value)}
                      className="h-[56px] w-full border border-[#e9e0d3] bg-white px-[15px] text-[14px] text-[#29251f] focus:border-[#172b24] focus:outline-none"
                    >
                      <option value="Field Jacket (Relaxed)">Field Jacket</option>
                      <option value="Classic Structured">Classic Structured</option>
                      <option value="Tailored Sculpted">Tailored Sculpted</option>
                    </select>
                  </div>
                </div>

                {/* Colour Selection (12:21982) */}
                <div
                  className="flex flex-col gap-[12px] items-start w-full"
                  data-node-id="12:21982"
                >
                  <p className="font-sans text-[12px] text-[#172b24]">
                    Colour · {selectedColor.name}
                  </p>
                  <div
                    className="flex flex-wrap items-start gap-[18px]"
                    data-node-id="12:21984"
                  >
                    {[
                      { name: "Deep Green", hex: "#172B24" },
                      { name: "Beige", hex: "#CDBDA5" },
                      { name: "Cream", hex: "#EEE8D9" },
                      { name: "Navy", hex: "#253243" },
                      { name: "Brown", hex: "#735444" },
                    ].map((col) => {
                      const active = selectedColor.name === col.name;
                      return (
                        <button
                          key={col.name}
                          type="button"
                          onClick={() => setSelectedColor(col)}
                          className="flex flex-col items-center gap-[7px] cursor-pointer"
                        >
                          <span
                            className={`flex size-[38px] items-center justify-center rounded-full border p-[3px] ${
                              active ? "border-[#172b24]" : "border-[#e9e0d3]"
                            }`}
                          >
                            <span
                              className="size-full rounded-full"
                              style={{ backgroundColor: col.hex }}
                            />
                          </span>
                          <span className="font-sans text-[10px] text-[#29251f]">
                            {col.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ButtonPrimary
                  label="Buy Now"
                  onClick={handleBuyNow}
                  className="flex h-[56px] w-full items-center justify-center gap-[24px] bg-[#172b24] px-[24px] text-white rounded-[2px] shadow-xs cursor-pointer hover:opacity-95"
                />
              </div>

              {/* Secondary Actions: Customize This Product + Save to Wishlist (12:22009) */}
              <div
                className="flex flex-col sm:flex-row items-stretch justify-center gap-3 w-full"
                data-node-id="12:22009"
              >
                <button
                  type="button"
                  onClick={handleCustomizeNow}
                  className="flex-1 flex h-[56px] items-center justify-center border border-[#172b24] px-[16px] font-sans text-[14px] font-medium text-[#172b24] hover:bg-[#e9e0d3]/60 cursor-pointer"
                  data-node-id="12:22010"
                >
                  Customize This Product
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlistProduct(product.id)}
                  className="flex h-[56px] items-center justify-center gap-2 border border-[#e9e0d3] bg-white px-5 text-[13px] text-[#172b24] hover:border-[#b69a68] cursor-pointer"
                >
                  <img
                    alt=""
                    className="size-4"
                    src={FIGMA_ASSETS.icons.heartProduct}
                  />
                  <span>{wishlisted ? "Saved in Wishlist" : "Save to Wishlist"}</span>
                </button>
              </div>

              {/* Vendor Information Card (12:22012) */}
              <div
                className="flex items-start gap-[16px] border border-[#e9e0d3] p-[20px] w-full bg-[#f5f0e7]"
                data-node-id="12:22012"
              >
                <div
                  className="flex size-[56px] shrink-0 items-center justify-center bg-[#172b24] border border-[#b69a68]"
                  data-node-id="12:22013"
                >
                  <span className="font-serif text-[24px] text-[#f5f0e7]">
                    {vendor.markInitials}
                  </span>
                </div>
                <div
                  className="flex flex-1 flex-col gap-[7px] items-start"
                  data-node-id="12:22015"
                >
                  <div className="flex flex-wrap items-center gap-[12px]">
                    <p className="font-serif text-[24px] text-[#172b24]">
                      {vendor.name}
                    </p>
                    <div className="flex items-center gap-[5px]">
                      <img
                        alt=""
                        className="size-[16px]"
                        src={FIGMA_ASSETS.icons.badgeCheck}
                      />
                      <span className="font-sans text-[11px] text-[#172b24]">
                        Verified · illustrative
                      </span>
                    </div>
                  </div>
                  <p className="font-sans text-[11px] text-[#29251f]">
                    {vendor.locationCity}, {vendor.locationState}
                  </p>
                  <p className="font-sans text-[11px] text-[#172b24]">
                    ★ {vendor.ratingAvg} / 5 · {vendor.reviewCount} sample reviews
                  </p>
                  <ButtonText
                    label="View Profile"
                    href={`/vendors/${vendor.slug}`}
                  />
                </div>
              </div>

              {/* Additional Information Accordions (12:22027) */}
              <div
                className="flex flex-col items-start w-full"
                data-node-id="12:22027"
              >
                {/* Product Details */}
                <div className="flex flex-col gap-[14px] border-t border-[#e9e0d3] py-[20px] w-full">
                  <button
                    type="button"
                    onClick={() => toggleSection("details")}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      Product Details
                    </span>
                    <img
                      alt=""
                      className="size-[16px]"
                      src={
                        openSections.details
                          ? FIGMA_ASSETS.icons.minus
                          : FIGMA_ASSETS.icons.plus
                      }
                    />
                  </button>
                  {openSections.details && (
                    <p className="font-sans text-[12px] leading-[1.7] text-[#29251f]">
                      Pointed collar, button-through front and four flap
                      pockets. A relaxed, hip-length silhouette with full
                      sleeves. Adjust length and ease in customization.{" "}
                      {product.fitSummary}
                    </p>
                  )}
                </div>

                {/* Fabric & Care */}
                <div className="flex flex-col gap-[14px] border-t border-[#e9e0d3] py-[20px] w-full">
                  <button
                    type="button"
                    onClick={() => toggleSection("fabric")}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      Fabric & Care
                    </span>
                    <img
                      alt=""
                      className="size-[16px]"
                      src={
                        openSections.fabric
                          ? FIGMA_ASSETS.icons.minus
                          : FIGMA_ASSETS.icons.plus
                      }
                    />
                  </button>
                  {openSections.fabric && (
                    <div className="font-sans text-[12px] leading-[1.7] text-[#29251f] space-y-1">
                      <p>
                        Linen with a naturally textured hand. Follow the care
                        instructions supplied with your chosen fabric and
                        finished garment.
                      </p>
                      <ul className="list-disc pl-4 pt-1">
                        {product.careInformation.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Customization Options */}
                <div className="flex flex-col gap-[14px] border-t border-[#e9e0d3] py-[20px] w-full">
                  <button
                    type="button"
                    onClick={() => toggleSection("customization")}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      Customization Options
                    </span>
                    <img
                      alt=""
                      className="size-[16px]"
                      src={
                        openSections.customization
                          ? FIGMA_ASSETS.icons.minus
                          : FIGMA_ASSETS.icons.plus
                      }
                    />
                  </button>
                  {openSections.customization && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[12px] text-[#29251f]">
                      {product.customizationHighlights.map((hl) => (
                        <div
                          key={hl.category}
                          className="border border-[#e9e0d3] bg-white p-3"
                        >
                          <p className="font-medium text-[#172b24]">
                            {hl.category}
                          </p>
                          <p className="text-[11px] text-[#706a60] mt-1">
                            {hl.options.join(" · ")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Size Guide */}
                <div className="flex flex-col gap-[14px] border-t border-[#e9e0d3] py-[20px] w-full">
                  <button
                    type="button"
                    onClick={() => toggleSection("sizeGuide")}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      Size Guide
                    </span>
                    <img
                      alt=""
                      className="size-[16px]"
                      src={
                        openSections.sizeGuide
                          ? FIGMA_ASSETS.icons.minus
                          : FIGMA_ASSETS.icons.plus
                      }
                    />
                  </button>
                  {openSections.sizeGuide && (
                    <div className="text-[12px] text-[#29251f] space-y-2">
                      <p>
                        Every Tapestory garment is cut to your personal
                        measurement profile (cm or inches). Reference standard
                        body ranges below or enter exact measurements at checkout:
                      </p>
                      <div className="overflow-x-auto border border-[#e9e0d3] bg-white">
                        <table className="w-full text-left text-[11px]">
                          <thead className="bg-[#e9e0d3] text-[#172b24]">
                            <tr>
                              <th className="p-2">Reference Fit</th>
                              <th className="p-2">Chest (cm)</th>
                              <th className="p-2">Waist (cm)</th>
                              <th className="p-2">Shoulder (cm)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e9e0d3]">
                            <tr>
                              <td className="p-2 font-medium">Small / 36</td>
                              <td className="p-2">88–92</td>
                              <td className="p-2">72–76</td>
                              <td className="p-2">40–42</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Medium / 38–40</td>
                              <td className="p-2">94–100</td>
                              <td className="p-2">78–84</td>
                              <td className="p-2">43–45</td>
                            </tr>
                            <tr>
                              <td className="p-2 font-medium">Large / 42–44</td>
                              <td className="p-2">102–110</td>
                              <td className="p-2">86–94</td>
                              <td className="p-2">46–48</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery & Returns */}
                <div className="flex flex-col gap-[14px] border-t border-[#e9e0d3] py-[20px] w-full">
                  <button
                    type="button"
                    onClick={() => toggleSection("delivery")}
                    className="flex items-center justify-between w-full text-left cursor-pointer"
                  >
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      Delivery & Returns
                    </span>
                    <img
                      alt=""
                      className="size-[16px]"
                      src={
                        openSections.delivery
                          ? FIGMA_ASSETS.icons.minus
                          : FIGMA_ASSETS.icons.plus
                      }
                    />
                  </button>
                  {openSections.delivery && (
                    <p className="font-sans text-[12px] leading-[1.7] text-[#29251f]">
                      Estimated tailoring & delivery: {product.leadTimeDays}.
                      Includes complimentary post-delivery fit alteration within
                      14 days of receipt.
                    </p>
                  )}
                </div>
              </div>

              <p
                className="font-sans text-[11px] text-[#29251f] w-full"
                data-node-id="12:22051"
              >
                Illustrative product, starting price, ratings, verification and
                Bestseller label. Not verified inventory or customer
                endorsements.
              </p>
            </div>
          </div>

          {/* Customer Reviews & Ratings Section */}
          <div className="mt-8 border-t border-[#e9e0d3] pt-12 w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-[11px] tracking-[2px] text-[#172b24] font-medium">
                  TAILORED EXPERIENCES
                </p>
                <h2 className="font-serif text-[32px] text-[#172b24] mt-2">
                  Customer Reviews & Fit Impressions
                </h2>
              </div>
              <Link
                href="/orders/TS-1042/review"
                className="text-[13px] text-[#172b24] underline"
              >
                Write a Verified Review →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SEED_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="flex flex-col justify-between gap-4 border border-[#e9e0d3] bg-white p-6"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[14px] text-[#b69a68]">★★★★★</span>
                      <span className="text-[11px] text-[#706a60]">
                        {rev.date}
                      </span>
                    </div>
                    <p className="font-serif text-[18px] text-[#172b24]">
                      “{rev.title}”
                    </p>
                    <p className="text-[12px] leading-[1.7] text-[#29251f]">
                      {rev.comment}
                    </p>
                  </div>
                  <div className="border-t border-[#e9e0d3] pt-3 text-[11px] text-[#706a60]">
                    <p className="font-medium text-[#172b24]">
                      {rev.authorName} · {rev.authorLocation}
                    </p>
                    <p>{rev.garmentOrdered}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SIMILAR DESIGNS (12:22052) */}
        <section
          className="w-full bg-[#e9e0d3]"
          data-node-id="12:22052"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[32px] px-4 sm:px-8 lg:p-[72px] py-14">
            <SectionHeadingWithViewAll
              eyebrow="A SHARED SENSE OF STYLE"
              title="Similar Designs"
              actionLabel="View all designs"
              actionHref="/products"
            />
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full">
              {similarProducts.map((item) => (
                <ProductCard key={item.id} product={item} aspect="Portrait" />
              ))}
            </div>
          </div>
        </section>

        {/* COMPLETE YOUR WARDROBE (12:22163) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[32px] px-4 sm:px-8 lg:p-[72px] py-14"
          data-node-id="12:22163"
        >
          <SectionHeadingWithViewAll
            eyebrow="THOUGHTFULLY PAIRED"
            title="Recommended For You"
            actionLabel="Explore collection"
            actionHref="/products"
          />
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full">
            {completeLookProducts.map((item) => (
              <ProductCard key={item.id} product={item} aspect="Compact" />
            ))}
          </div>
        </section>
      </main>

      {fullscreenOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b24]/85 p-4"
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={() => setFullscreenOpen(false)}
            className="absolute top-6 right-6 flex size-11 items-center justify-center bg-[#f5f0e7] text-[#172b24] cursor-pointer"
          >
            <X className="size-5" />
          </button>
          <img
            src={gallery[activeImageIndex]}
            alt={product.name}
            className="max-h-[88vh] max-w-[90vw] object-contain"
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductSlugPage() {
  const params = useParams<{ slug?: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "linen-field-jacket";
  return <ProductDetailView slug={slug} />;
}
