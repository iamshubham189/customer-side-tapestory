"use client";

import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import { formatStartingPrice } from "@/lib/utils/format";
import type { ProductCardProps } from "./ProductCard.types";

export function ProductCard({
  product,
  aspect,
  layout = "grid",
  showExtendedListingMeta = false,
  onQuickView,
  className,
}: ProductCardProps) {
  const { isProductWishlisted, toggleWishlistProduct, isHydrated } = useTapestory();
  const wishlisted = isHydrated ? isProductWishlisted(product.id) : false;
  const effectiveAspect = aspect ?? product.aspectRatio ?? "Portrait";
  const isCompact = effectiveAspect === "Compact";

  if (layout === "list") {
    return (
      <article className="flex flex-col sm:flex-row gap-6 border border-[#e9e0d3] bg-white p-5 transition-colors hover:border-[#b69a68]">
        <div className="relative h-[260px] sm:h-[220px] sm:w-[200px] shrink-0 overflow-hidden bg-[#e9e0d3]">
          <Link href={`/product/${product.slug}`} className="block size-full">
            <img
              alt={product.name}
              className="size-full object-cover"
              src={product.primaryImage}
            />
          </Link>
          {product.isCustomizable && (
            <div className="absolute top-[12px] left-[12px] bg-[#f5f0e7] p-[6px]">
              <span className="font-sans text-[10px] tracking-[0.5px] text-[#172b24]">
                CUSTOMIZABLE
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] text-[#706a60]">
                  {product.category} · {product.gender} · {product.vendorName}
                </p>
                <Link
                  href={`/product/${product.slug}`}
                  className="font-serif text-[24px] leading-[1.25] text-[#172b24] hover:underline"
                >
                  {product.name}
                </Link>
              </div>
              <button
                type="button"
                onClick={() => toggleWishlistProduct(product.id)}
                aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`flex size-[32px] items-center justify-center rounded-full border ${
                  wishlisted
                    ? "bg-[#172b24] border-[#172b24]"
                    : "bg-[#f5f0e7] border-[#e9e0d3]"
                }`}
              >
                <img
                  alt=""
                  className={`size-[16px] ${wishlisted ? "invert" : ""}`}
                  src={FIGMA_ASSETS.icons.heartProduct}
                />
              </button>
            </div>
            <p className="text-[13px] leading-[1.6] text-[#29251f]">
              {product.description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="text-[12px] text-[#172b24] font-medium">
                {product.fabricSummary}
              </span>
              <span className="text-[11px] text-[#706a60]">
                ★ {product.ratingAvg.toFixed(1)} ({product.reviewCount})
              </span>
              <div className="flex items-center gap-1.5">
                {product.availableColors.map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="size-3.5 rounded-full border border-[#29251f]/20"
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e9e0d3] pt-3">
            <span className="font-sans text-[15px] font-medium text-[#172b24]">
              {formatStartingPrice(product.startingPriceInr)}
            </span>
            <div className="flex items-center gap-4">
              {onQuickView && (
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  className="text-[12px] text-[#29251f] underline cursor-pointer"
                >
                  Quick view
                </button>
              )}
              <Link
                href={`/customize?product=${product.slug}`}
                className="bg-[#172b24] px-4 py-2 text-[12px] font-medium text-[#f5f0e7]"
              >
                Customize Now
              </Link>
              <Link
                href={`/product/${product.slug}`}
                className="flex items-center gap-[8px] text-[12px] text-[#172b24] underline"
              >
                <span>View details</span>
                <img
                  alt=""
                  className="size-[12px]"
                  src={FIGMA_ASSETS.icons.arrowUpRightProduct}
                />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={
        className ||
        "group flex flex-col gap-[16px] items-start w-full"
      }
      data-node-id="5:6540"
    >
      <div
        className={`relative flex flex-col items-start overflow-hidden bg-[#e9e0d3] w-full ${
          isCompact ? "h-[328px]" : "h-[384px]"
        }`}
        data-node-id={isCompact ? "5:6518" : "5:6500"}
      >
        <Link href={`/product/${product.slug}`} className="relative flex-1 w-full">
          <img
            alt={product.name}
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            src={product.primaryImage}
          />
        </Link>

        {product.isCustomizable && (
          <div
            className="absolute top-[16px] left-[16px] bg-[#f5f0e7] p-[8px]"
            data-node-id="5:6476"
          >
            <p className="font-sans text-[10px] tracking-[0.5px] text-[#172b24] whitespace-nowrap">
              CUSTOMIZABLE
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={() => toggleWishlistProduct(product.id)}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
          className={`absolute top-[12px] right-[12px] flex size-[32px] items-center justify-center rounded-full transition-colors cursor-pointer ${
            wishlisted ? "bg-[#172b24]" : "bg-[#f5f0e7] hover:bg-[#e9e0d3]"
          }`}
          data-node-id="5:6455"
        >
          <img
            alt=""
            className={`size-[16px] ${wishlisted ? "invert" : ""}`}
            src={FIGMA_ASSETS.icons.heartProduct}
          />
        </button>
      </div>

      <div className="flex flex-col gap-[8px] items-start w-full">
        {showExtendedListingMeta && (
          <div className="flex items-center justify-between w-full text-[11px] text-[#706a60]">
            <span>
              {product.category} · {product.gender}
            </span>
            <span>
              ★ {product.ratingAvg.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
        )}

        <Link
          href={`/product/${product.slug}`}
          className="font-serif text-[22px] leading-[1.25] text-[#172b24] hover:opacity-80 w-full"
          data-node-id="5:6483"
        >
          {product.name}
        </Link>

        <p className="font-sans text-[12px] text-[#29251f] w-full">
          {product.fabricSummary}
        </p>

        {showExtendedListingMeta && (
          <div className="flex items-center justify-between w-full pt-0.5">
            <span className="text-[11px] text-[#706a60]">
              By {product.vendorName}
            </span>
            <div className="flex items-center gap-1.5">
              {product.availableColors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  title={c.name}
                  className="size-3 rounded-full border border-[#29251f]/25"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-[8px] w-full">
          <p
            className="font-sans text-[14px] text-[#172b24] whitespace-nowrap"
            data-node-id="5:6490"
          >
            {formatStartingPrice(product.startingPriceInr)}
          </p>

          <div className="flex items-center gap-3">
            {onQuickView && (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="text-[11px] text-[#706a60] hover:text-[#172b24] underline cursor-pointer"
              >
                Quick view
              </button>
            )}
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-[8px]"
            >
              <span className="font-sans text-[12px] text-[#172b24] underline whitespace-nowrap">
                View details
              </span>
              <img
                alt=""
                className="size-[12px]"
                src={FIGMA_ASSETS.icons.arrowUpRightProduct}
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
