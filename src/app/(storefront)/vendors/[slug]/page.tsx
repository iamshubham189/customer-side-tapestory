"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import { SEED_PRODUCTS, SEED_VENDORS } from "@/lib/backend/seed-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonSecondary } from "@/components/common/Button";
import { SectionHeadingWithViewAll } from "@/components/common/SectionHeading";
import {
  EditorialImageCard,
  FeatureBenefitItem,
  TestimonialCard,
} from "@/components/common/EditorialBlocks";
import { ProductCard } from "@/components/products/ProductCard";

function VendorProfileView({ initialSlug }: { initialSlug: string }) {
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug);
  const vendor =
    SEED_VENDORS.find((v) => v.slug === selectedSlug || v.id === selectedSlug) ??
    SEED_VENDORS[0];

  const [activeTab, setActiveTab] = useState<
    "Overview" | "Portfolio" | "Reviews" | "Products"
  >("Overview");
  const [following, setFollowing] = useState(false);

  const vendorProducts = SEED_PRODUCTS.filter(
    (p) => p.vendorId === vendor.id
  ).slice(0, 8);
  const displayProducts =
    vendorProducts.length >= 4 ? vendorProducts : SEED_PRODUCTS.slice(0, 4);

  const portfolioTopRow = vendor.portfolioItems.slice(0, 2);
  const portfolioBottomRow = vendor.portfolioItems.slice(2, 5);

  const scrollToSection = (
    tab: "Overview" | "Portfolio" | "Reviews" | "Products",
    elementId: string
  ) => {
    setActiveTab(tab);
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="12:22330"
    >
      <Header />

      {/* Verified Ateliers Switcher Bar */}
      <div className="bg-[#e9e0d3] border-b border-[#d7cdbe] px-4 sm:px-8 lg:px-[72px] py-3">
        <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="font-sans text-[10px] tracking-[1.4px] uppercase text-[#172b24]">
              TAPESTORY VERIFIED ATELIERS
            </span>
            <span className="text-[12px] text-[#706a60]">·</span>
            <span className="text-[12px] text-[#29251f]">
              Select a bespoke tailoring partner to explore their studio profile, portfolio &amp; designs:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {SEED_VENDORS.map((v) => {
              const isSelected = v.slug === vendor.slug;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedSlug(v.slug)}
                  className={`px-3.5 py-1.5 text-[12px] transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#172b24] text-[#f5f0e7] font-medium"
                      : "bg-[#f5f0e7] text-[#172b24] border border-[#d7cdbe] hover:border-[#172b24]"
                  }`}
                >
                  {v.name} ({v.locationCity})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main className="flex-1">
        {/* ATELIER HERO BANNER (12:22361) */}
        <section
          className="relative flex flex-col h-[320px] sm:h-[420px] w-full overflow-hidden"
          data-node-id="12:22361"
        >
          <img
            alt={`${vendor.name} craftsmanship`}
            className="absolute inset-0 size-full object-cover"
            src={vendor.bannerImage}
          />
          <div
            className="absolute bottom-[24px] sm:bottom-[36px] left-4 sm:left-8 lg:left-[72px] bg-[#172b24] flex flex-col gap-[10px] items-start p-[20px] sm:p-[24px]"
            data-node-id="12:22363"
          >
            <p className="font-sans text-[10px] tracking-[1.6px] text-[#b69a68]">
              MEET THE MAKER
            </p>
            <p className="font-serif text-[28px] sm:text-[34px] tracking-[-1.4px] text-[#f5f0e7]">
              Crafted with intention.
            </p>
          </div>
        </section>

        {/* VENDOR IDENTITY HEADER (12:22366) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col md:flex-row md:items-center gap-[24px] lg:gap-[28px] px-4 sm:px-8 lg:px-[72px] py-[40px]"
          data-node-id="12:22366"
        >
          <div
            className="flex size-[84px] sm:size-[96px] shrink-0 flex-col items-center justify-center gap-[3px] bg-[#172b24] border border-[#b69a68]"
            data-node-id="12:22367"
          >
            <span className="font-serif text-[36px] sm:text-[40px] text-[#f5f0e7]">
              {vendor.markInitials}
            </span>
            <span className="font-sans text-[7px] tracking-[1.2px] text-[#b69a68]">
              {vendor.name.toUpperCase()}
            </span>
          </div>

          <div
            className="flex flex-1 flex-col gap-[12px] items-start"
            data-node-id="12:22370"
          >
            <div className="flex flex-wrap items-center gap-[16px] sm:gap-[20px]">
              <h1
                className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
                data-node-id="12:22372"
              >
                {vendor.name}
              </h1>
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

            <p className="font-sans text-[14px] text-[#29251f]">
              Modern silhouettes. Considered materials. Unmistakably yours.
            </p>

            <div className="flex flex-wrap items-center gap-[24px]">
              <div className="flex items-center gap-[6px]">
                <img
                  alt=""
                  className="size-[16px]"
                  src={FIGMA_ASSETS.icons.mapPin}
                />
                <span className="font-sans text-[12px] text-[#29251f]">
                  {vendor.locationCity}, {vendor.locationState}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[18px] text-[#b69a68]">★★★★★</span>
                <span className="text-[12px] text-[#29251f]">
                  {vendor.ratingAvg} / 5 · {vendor.reviewCount} sample reviews
                </span>
              </div>
            </div>
          </div>

          <ButtonSecondary
            label={following ? "✓ Following Atelier" : "+ Follow"}
            onClick={() => setFollowing((prev) => !prev)}
          />
        </section>

        {/* STICKY PROFILE NAVIGATION TABS (12:22386) */}
        <div
          className="sticky top-[76px] lg:top-[104px] z-30 border-y border-[#e9e0d3] bg-[#f5f0e7]/95 backdrop-blur-xs w-full"
          data-node-id="12:22386"
        >
          <div className="mx-auto flex w-full max-w-[1440px] items-start gap-[32px] sm:gap-[48px] overflow-x-auto px-4 sm:px-8 lg:px-[72px]">
            {(
              [
                { label: "Overview", id: "vendor-about" },
                { label: "Portfolio", id: "vendor-portfolio" },
                { label: "Reviews", id: "vendor-reviews" },
                { label: "Products", id: "vendor-products" },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.label;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => scrollToSection(tab.label, tab.id)}
                  className={`py-[18px] sm:py-[22px] text-[13px] whitespace-nowrap cursor-pointer ${
                    active
                      ? "border-b-2 border-[#172b24] font-semibold text-[#172b24]"
                      : "font-normal text-[#172b24] hover:text-[#b69a68]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ABOUT ATELIER NIVA (12:22395) */}
        <section
          id="vendor-about"
          className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row lg:items-center gap-12 lg:gap-[80px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]"
          data-node-id="12:22395"
        >
          <div
            className="flex flex-1 flex-col gap-[24px] items-start"
            data-node-id="12:22396"
          >
            <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
              A STUDIO FOR INDIVIDUAL EXPRESSION
            </p>
            <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
              About {vendor.name}
            </h2>
            {vendor.storyParagraphs.map((para, idx) => (
              <p
                key={idx}
                className="font-sans text-[13px] sm:text-[14px] leading-[1.7] text-[#29251f]"
              >
                {para}
              </p>
            ))}

            <div
              className="flex flex-col gap-[8px] items-start w-full pt-2"
              data-node-id="12:22401"
            >
              <FeatureBenefitItem benefit="Made-to-measure fit" />
              <FeatureBenefitItem benefit="Premium materials" />
              <FeatureBenefitItem benefit="Skilled tailoring partners" />
            </div>
          </div>

          <EditorialImageCard
            story="Craft"
            className="relative flex flex-col h-[420px] sm:h-[560px] w-full lg:w-[570px] shrink-0 overflow-hidden"
          />
        </section>

        {/* PORTFOLIO (12:22435) */}
        <section
          id="vendor-portfolio"
          className="w-full bg-[#e9e0d3]"
          data-node-id="12:22435"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[36px] px-4 sm:px-8 lg:p-[72px] py-14">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between w-full">
              <div className="flex flex-col gap-[14px] items-start text-[#172b24]">
                <p className="font-sans text-[10px] tracking-[1.4px]">
                  THE ATELIER, IN EXPRESSION
                </p>
                <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px]">
                  A portfolio of possibilities
                </h2>
              </div>
              <p className="font-sans text-[13px] leading-[1.7] text-[#29251f] lg:w-[390px]">
                Different silhouettes. One considered point of view. Explore
                illustrative looks from the studio.
              </p>
            </div>

            {/* Top Featured Portfolio Row */}
            <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full">
              {portfolioTopRow.map((item) => (
                <Link
                  key={item.id}
                  href="/products"
                  className="group relative flex flex-col h-[340px] sm:h-[420px] overflow-hidden"
                >
                  <img
                    alt={item.title}
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    src={item.image}
                  />
                  <div className="absolute bottom-[24px] left-[24px] right-[24px] sm:right-auto bg-[#172b24] flex items-center justify-between p-[20px] sm:w-[392px]">
                    <div className="flex flex-col gap-[8px] items-start text-[#f5f0e7]">
                      <p className="font-serif text-[24px] leading-none">
                        {item.title}
                      </p>
                      <p className="font-sans text-[11px]">{item.category}</p>
                    </div>
                    <img
                      alt=""
                      className="size-[24px] shrink-0"
                      src={FIGMA_ASSETS.icons.arrowUpRightGold}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Bottom 3-Column Portfolio Row */}
            {portfolioBottomRow.length > 0 && (
              <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
                {portfolioBottomRow.map((item) => (
                  <Link
                    key={item.id}
                    href="/products"
                    className="group relative flex flex-col h-[320px] sm:h-[400px] overflow-hidden"
                  >
                    <img
                      alt={item.title}
                      className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      src={item.image}
                    />
                    <div className="absolute bottom-[24px] left-[24px] right-[24px] bg-[#172b24] flex items-center justify-between p-[20px]">
                      <div className="flex flex-col gap-[8px] items-start text-[#f5f0e7]">
                        <p className="font-serif text-[22px] leading-none">
                          {item.title}
                        </p>
                        <p className="font-sans text-[11px]">{item.category}</p>
                      </div>
                      <img
                        alt=""
                        className="size-[22px] shrink-0"
                        src={FIGMA_ASSETS.icons.arrowUpRightGold}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* REVIEWS & RATINGS (12:22483) */}
        <section
          id="vendor-reviews"
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[36px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]"
          data-node-id="12:22483"
        >
          <div className="flex flex-col gap-[14px] items-start w-full">
            <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
              INDIVIDUAL STYLE, SHARED STORIES
            </p>
            <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
              Reviews & Ratings
            </h2>
            <p className="font-sans text-[12px] leading-[1.7] text-[#29251f]">
              Illustrative sample reviews and ratings — not verified reviews,
              research or actual customer endorsements.
            </p>
          </div>

          <div
            className="flex flex-col md:flex-row md:items-center gap-8 lg:gap-[64px] border-y border-[#e9e0d3] py-[24px] w-full"
            data-node-id="12:22488"
          >
            <div className="flex flex-col gap-[8px] items-start sm:w-[240px]">
              <p className="font-serif text-[52px] sm:text-[62px] leading-[1.13] tracking-[-1.8px] text-[#172b24]">
                {vendor.ratingAvg}
              </p>
              <p className="text-[18px] tracking-[3px] text-[#b69a68]">★★★★★</p>
              <p className="text-[12px] text-[#29251f]">
                out of 5 · {vendor.reviewCount} sample reviews
              </p>
            </div>

            <div className="flex flex-col gap-[12px] items-start w-full max-w-[480px]">
              {vendor.ratingDistribution.map((dist) => (
                <div
                  key={dist.stars}
                  className="flex items-center gap-[14px] w-full"
                >
                  <span className="text-[11px] text-[#29251f] w-[30px]">
                    {dist.stars} ★
                  </span>
                  <div className="h-[5px] flex-1 bg-[#e9e0d3] overflow-hidden">
                    <div
                      className="h-full bg-[#b69a68]"
                      style={{ width: `${dist.percentage}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-[#29251f] w-[26px]">
                    {dist.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full">
            <TestimonialCard story="Story 1" />
            <TestimonialCard story="Story 2" />
            <TestimonialCard story="Story 3" />
          </div>
        </section>

        {/* OTHER PRODUCTS BY ATELIER NIVA (12:22579) */}
        <section
          id="vendor-products"
          className="w-full bg-[#e9e0d3]"
          data-node-id="12:22579"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[36px] px-4 sm:px-8 lg:p-[72px] py-14">
            <SectionHeadingWithViewAll
              eyebrow="DESIGNED BY THE STUDIO"
              title={`Designs by ${vendor.name}`}
              actionLabel="Browse all designs"
              actionHref="/products"
            />
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full">
              {displayProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  aspect="Portrait"
                />
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function VendorSlugPage() {
  const params = useParams<{ slug?: string }>();
  const slug = typeof params?.slug === "string" ? params.slug : "atelier-niva";
  return <VendorProfileView initialSlug={slug} />;
}
