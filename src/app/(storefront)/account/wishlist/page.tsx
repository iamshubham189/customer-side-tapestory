"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { FIGMA_ASSETS } from "@/config/assets";
import { SEED_PRODUCTS } from "@/lib/backend/seed-data";
import { formatInr } from "@/lib/utils/format";
import { useTapestory } from "@/features/store-provider";

type WishlistTab = "products" | "designs";

export default function AccountWishlistPage() {
  const router = useRouter();
  const {
    user,
    isHydrated,
    wishlistProductIds,
    toggleWishlistProduct,
    savedDesigns,
    deleteSavedDesign,
    loadSavedDesignIntoStudio,
  } = useTapestory();

  const [activeTab, setActiveTab] = useState<WishlistTab>("products");
  const [removedBanner, setRemovedBanner] = useState<{
    title: string;
    productId?: string;
  } | null>(null);

  const wishlistedProducts = SEED_PRODUCTS.filter((p) =>
    wishlistProductIds.includes(p.id)
  );

  const handleRemoveProduct = (productId: string, name: string) => {
    toggleWishlistProduct(productId);
    setRemovedBanner({ title: `${name} removed from your wishlist.`, productId });
  };

  const handleContinueCustomizing = (designId: string) => {
    loadSavedDesignIntoStudio(designId);
    router.push("/customize");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]"
      data-node-id="25:57670"
    >
      <Header />

      <main
        className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 sm:px-8 lg:px-[72px] pt-8 lg:pt-[40px] pb-12 lg:pb-[64px] max-w-[1440px] w-full mx-auto"
        data-node-id="25:57701"
      >
        <AccountSidebar activeTab="wishlist" />

        <div
          className="flex-1 flex flex-col gap-[32px] items-start w-full min-w-0"
          data-node-id="25:57734"
        >
          {/* Page Introduction */}
          <div className="flex flex-col gap-[14px] items-start w-full" data-node-id="25:57735">
            <nav aria-label="Breadcrumb" className="text-[14px] text-[#29251f]">
              <Link href="/" className="hover:underline">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:underline">
                My Account
              </Link>{" "}
              / <span className="text-[#172b24] font-medium">Wishlist</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <h1
                className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
                data-node-id="25:57739"
              >
                My Wishlist
              </h1>
              <Link
                href="/products"
                className="border border-[#172b24] h-[56px] px-[16px] inline-flex items-center text-[14px] text-[#172b24] hover:bg-[#e9e0d3]/60 transition-colors"
              >
                Explore Designs
              </Link>
            </div>

            <p className="text-[14px] leading-[1.6] text-[#29251f]" data-node-id="25:57742">
              Keep your favourite styles and personalized designs together.
            </p>
            <p className="text-[12px] leading-[1.65] text-[#706a60]" data-node-id="25:57743">
              Illustrative sample account · {isHydrated && user ? user.fullName : "Ananya Rao"} · Example information and UI states, as of 2 Nov 2026.
            </p>
          </div>

          {removedBanner && (
            <div className="bg-[#f5f0e7] border border-[#172b24] p-4 w-full flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[18px] text-[#172b24]">✓</span>
                <div>
                  <p className="text-[14px] text-[#172b24] font-medium">{removedBanner.title}</p>
                  <p className="text-[12px] text-[#706a60]">
                    You can save it again anytime or undo below.
                  </p>
                </div>
              </div>
              {removedBanner.productId && (
                <button
                  type="button"
                  onClick={() => {
                    if (removedBanner.productId) {
                      toggleWishlistProduct(removedBanner.productId);
                    }
                    setRemovedBanner(null);
                  }}
                  className="border-b border-[#b69a68] pb-1 text-[13px] text-[#172b24] font-medium"
                >
                  Undo Removal
                </button>
              )}
            </div>
          )}

          {/* Wishlist Tabs */}
          <div
            className="border-b border-[#e9e0d3] flex gap-[32px] items-start w-full"
            data-node-id="25:57744"
          >
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className={`px-[4px] py-[18px] text-[14px] transition-colors ${
                activeTab === "products"
                  ? "border-b-2 border-[#172b24] font-semibold text-[#172b24]"
                  : "text-[#172b24] hover:opacity-80"
              }`}
              data-node-id="25:57745"
            >
              Saved Products ({wishlistedProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("designs")}
              className={`px-[4px] py-[18px] text-[14px] transition-colors ${
                activeTab === "designs"
                  ? "border-b-2 border-[#172b24] font-semibold text-[#172b24]"
                  : "text-[#172b24] hover:opacity-80"
              }`}
              data-node-id="25:57747"
            >
              Saved Designs ({savedDesigns.length})
            </button>
          </div>

          {/* Saved Products Section */}
          {activeTab === "products" && (
            <div className="flex flex-col gap-[24px] w-full">
              <div className="flex items-center justify-between w-full">
                <p className="text-[14px] text-[#706a60]">
                  {wishlistedProducts.length} saved products · The pieces you come back to.
                </p>
                <span className="text-[12px] text-[#29251f]">Recently saved ⌄</span>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="bg-[#f5f0e7] border border-[#e9e0d3] p-8 flex flex-col gap-4 items-start">
                  <p className="font-serif text-[28px] text-[#172b24]">
                    Your next favourite awaits.
                  </p>
                  <p className="text-[14px] text-[#29251f]">
                    Explore thoughtful styles for Men, Women and Unisex wardrobes.
                  </p>
                  <Link
                    href="/products"
                    className="bg-[#172b24] text-white h-[48px] px-[20px] inline-flex items-center text-[14px]"
                  >
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] w-full"
                  data-node-id="25:57752"
                >
                  {wishlistedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex flex-col gap-[12px] items-start"
                      data-node-id="25:57753"
                    >
                      <div className="flex flex-col gap-[16px] w-full">
                        <div className="relative bg-[#e9e0d3] aspect-[3/4] w-full overflow-hidden">
                          <img
                            alt={product.name}
                            src={product.primaryImage}
                            className="size-full object-cover"
                          />
                          {product.isCustomizable && (
                            <span className="absolute left-[16px] top-[16px] bg-[#f5f0e7] p-[8px] text-[10px] tracking-[0.5px] text-[#172b24]">
                              CUSTOMIZABLE
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label={`Remove ${product.name} from wishlist`}
                            onClick={() => handleRemoveProduct(product.id, product.name)}
                            className="absolute right-[12px] top-[12px] bg-[#f5f0e7]/90 rounded-full size-[32px] flex items-center justify-center hover:bg-white transition-colors"
                          >
                            <img
                              alt=""
                              className="size-[16px]"
                              src={FIGMA_ASSETS.icons.heartCard}
                            />
                          </button>
                        </div>

                        <div className="flex flex-col gap-[8px] w-full">
                          <Link
                            href={`/product/${product.slug}`}
                            className="font-serif text-[22px] leading-[1.25] text-[#172b24] hover:underline"
                          >
                            {product.name}
                          </Link>
                          <p className="text-[12px] text-[#29251f]">
                            {product.fabricSummary} · {product.gender}
                          </p>
                          <div className="flex items-center justify-between pt-[8px] w-full">
                            <span className="text-[14px] text-[#172b24]">
                              From {formatInr(product.startingPriceInr)}
                            </span>
                            <Link
                              href={`/product/${product.slug}`}
                              className="inline-flex items-center gap-[8px] text-[12px] text-[#172b24] underline"
                            >
                              <span>View Product</span>
                              <img
                                alt=""
                                className="size-[12px]"
                                src={FIGMA_ASSETS.icons.arrowUpRightSmall}
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <p className="text-[12px] text-[#706a60]">By {product.vendorName}</p>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-[12px] text-[#706a60] leading-[1.65]" data-node-id="25:57822">
                Illustrative products and starting prices in INR. Final pricing varies with fabric, measurements and customization. Heart controls remove an item from this saved list.
              </p>
            </div>
          )}

          {/* Saved Designs & Drafts Section (always visible in 'designs' tab + below as in Figma 25:57823) */}
          <section
            className="border-t border-[#e9e0d3] pt-[32px] flex flex-col gap-[24px] w-full"
            data-node-id="25:57823"
          >
            <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
              SAVED DESIGNS & DRAFTS · PERSONALIZED ARCHIVE
            </p>
            <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57825">
              Your stories in progress
            </h2>
            <p className="text-[14px] text-[#706a60] leading-[1.65]" data-node-id="25:57826">
              {savedDesigns.length} personalized designs · Resume customizing or review your saved fabric and fit choices.
            </p>

            <div className="flex flex-col gap-[24px] w-full">
              {savedDesigns.map((design) => (
                <div
                  key={design.id}
                  className="bg-white border border-[#e9e0d3] p-6 flex flex-col sm:flex-row gap-[28px] items-start w-full"
                  data-node-id="25:57827"
                >
                  <div className="bg-[#e9e0d3] h-[254px] w-full sm:w-[196px] shrink-0 overflow-hidden">
                    <img
                      alt={design.name}
                      src={design.configuration.productImage}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-[14px] items-start w-full">
                    <div className="flex items-start justify-between w-full">
                      <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24] uppercase">
                        {design.status === "Draft"
                          ? "DRAFT · DETAILS IN PROGRESS"
                          : "WISHLIST · PERSONALIZED DESIGN"}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteSavedDesign(design.id)}
                        className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[10px] text-[14px] text-[#172b24]"
                      >
                        <span>Remove</span>
                        <img
                          alt=""
                          className="size-[16px]"
                          src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                        />
                      </button>
                    </div>

                    <p className="font-serif text-[28px] text-[#172b24]">{design.name}</p>
                    <p className="text-[14px] text-[#706a60]">
                      {design.configuration.productName} · {design.configuration.vendorName}
                    </p>
                    <p className="text-[14px] text-[#706a60]">
                      {design.configuration.fabric.name} · {design.configuration.color.name} ·{" "}
                      {design.configuration.pattern.name} ·{" "}
                      {design.configuration.styleSilhouette.name}
                    </p>
                    <p className="text-[12px] text-[#706a60]">
                      Updated {design.updatedAt} ·{" "}
                      {design.configuration.measurementProfileName ??
                        "Measurements not yet added"}{" "}
                      · Sample estimate {formatInr(design.configuration.totalEstimatedPriceInr)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleContinueCustomizing(design.id)}
                      className="bg-[#172b24] text-white h-[56px] px-[24px] rounded-[2px] inline-flex items-center gap-[20px] text-[14px] font-medium hover:bg-[#172b24]/95 transition-colors"
                    >
                      <span>Continue Customizing</span>
                      <img
                        alt=""
                        className="size-[16px]"
                        src={FIGMA_ASSETS.icons.arrowUpRightMuted}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Alternate Experiences · Empty Wishlist States */}
          <section
            className="border-t border-[#e9e0d3] pt-[36px] flex flex-col gap-[24px] w-full"
            data-node-id="25:57881"
          >
            <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
              ALTERNATE EXPERIENCES · ILLUSTRATIVE UI STATES
            </p>
            <h3 className="font-serif text-[24px] text-[#172b24]">
              When your saved list is a fresh page
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              <div className="bg-white border border-[#e9e0d3] p-6 sm:p-[28px] flex flex-col gap-[20px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  NO SAVED PRODUCTS · EXAMPLE
                </p>
                <div className="bg-[#f5f0e7] p-6 sm:p-[32px] flex flex-col gap-[18px] items-start">
                  <p className="font-serif text-[28px] text-[#172b24]">
                    Your next favourite awaits.
                  </p>
                  <p className="text-[14px] text-[#29251f]">
                    Explore thoughtful styles for Men, Women and Unisex wardrobes.
                  </p>
                  <Link
                    href="/products"
                    className="bg-[#172b24] text-white h-[48px] px-[20px] inline-flex items-center text-[14px]"
                  >
                    Explore Products
                  </Link>
                </div>
              </div>

              <div className="bg-white border border-[#e9e0d3] p-6 sm:p-[28px] flex flex-col gap-[20px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  NO SAVED DESIGNS · EXAMPLE
                </p>
                <div className="bg-[#f5f0e7] p-6 sm:p-[32px] flex flex-col gap-[18px] items-start">
                  <p className="font-serif text-[28px] text-[#172b24]">
                    A fresh page for your ideas.
                  </p>
                  <p className="text-[14px] text-[#29251f]">
                    Start with a silhouette. Save your fabric, fit and finishing choices.
                  </p>
                  <Link
                    href="/customize"
                    className="bg-[#172b24] text-white h-[48px] px-[20px] inline-flex items-center text-[14px]"
                  >
                    Start a Design
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
