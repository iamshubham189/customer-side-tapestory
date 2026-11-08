"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonText,
} from "@/components/common/Button";
import { SectionHeading } from "@/components/common/SectionHeading";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    couponCode,
    couponDiscountInr,
    applyCouponCode,
    removeCouponCode,
    setActiveConfiguration,
    savedDesigns,
    addToCart,
  } = useTapestory();

  const [couponInput, setCouponInput] = useState<string>(couponCode ?? "");
  const [couponFeedback, setCouponFeedback] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const subtotalInr = cart.reduce(
    (sum, item) =>
      sum + item.configuration.totalEstimatedPriceInr * item.quantity,
    0
  );
  const totalInr = Math.max(0, subtotalInr - couponDiscountInr);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const res = applyCouponCode(couponInput);
    setCouponFeedback(res);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f0e7] w-full">
      <Header />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-[36px] lg:py-[56px]">
        {/* Breadcrumb & Page Intro (Flow 05 K01) */}
        <div className="flex flex-col gap-[20px]">
          <p className="font-sans text-[12px] text-[#29251f]">
            Home &nbsp;/&nbsp; Shopping Bag
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-[12px]">
              <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
                FLOW 05 · CART &amp; CHECKOUT / K01–K03
              </p>
              <h1 className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
                Your Bespoke Bag
              </h1>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Review your custom garment specifications, linked measurement
                profiles and estimated tailoring timeline before checkout.
              </p>
            </div>
            <p className="font-serif italic text-[18px] text-[#b69a68]">
              Crafted individually for you.
            </p>
          </div>
        </div>

        {cart.length === 0 ? (
          /* Empty Cart State */
          <section className="flex flex-col items-start justify-between gap-6 bg-[#e9e0d3] p-8 sm:p-12">
            <div className="flex flex-col gap-3 max-w-[540px]">
              <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
                YOUR BAG IS CURRENTLY EMPTY
              </p>
              <h2 className="font-serif text-[32px] text-[#172b24]">
                Every wardrobe begins with a single story.
              </h2>
              <p className="font-sans text-[14px] leading-[1.65] text-[#29251f]">
                Explore our unisex made-to-measure collection or add one of your
                saved designs below.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <ButtonPrimary label="Explore Collection" href="/products" />
              <ButtonSecondary
                label="Open Customization Studio"
                href="/customize"
              />
              {savedDesigns[0] && (
                <ButtonSecondary
                  label={`Restore "${savedDesigns[0].name}"`}
                  onClick={() => addToCart(savedDesigns[0].configuration, 1)}
                />
              )}
            </div>
          </section>
        ) : (
          <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[40px] w-full">
            {/* Left: Cart Items List (K01 & K02) */}
            <div className="flex flex-1 flex-col gap-[24px] w-full">
              {cart.map((item) => {
                const cfg = item.configuration;
                return (
                  <article
                    key={item.id}
                    className="flex flex-col sm:flex-row items-start gap-[24px] bg-white border border-[#e9e0d3] p-[20px] sm:p-[24px] w-full"
                  >
                    <Link
                      href={`/product/${cfg.productId.replace("prod-", "")}`}
                      className="relative h-[260px] sm:h-[240px] w-full sm:w-[180px] shrink-0 bg-[#e9e0d3] overflow-hidden"
                    >
                      <img
                        alt={cfg.productName}
                        className="size-full object-cover"
                        src={cfg.productImage}
                      />
                    </Link>

                    <div className="flex flex-1 flex-col gap-[14px] w-full">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <span className="inline-block bg-[#e9e0d3] px-2.5 py-1 text-[10px] tracking-[0.6px] text-[#172b24] uppercase mb-2">
                            MADE TO MEASURE · {cfg.vendorName}
                          </span>
                          <h2 className="font-serif text-[26px] text-[#172b24]">
                            {cfg.productName}
                          </h2>
                        </div>
                        <p className="font-serif text-[26px] text-[#172b24]">
                          {formatInr(cfg.totalEstimatedPriceInr * item.quantity)}
                        </p>
                      </div>

                      {/* Custom Details Summary */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#f5f0e7] p-3.5 text-[12px] text-[#29251f]">
                        <div>
                          <p className="text-[10px] tracking-[0.8px] text-[#706a60] uppercase">
                            STYLE &amp; FABRIC
                          </p>
                          <p className="font-medium text-[#172b24] mt-0.5">
                            {cfg.styleSilhouette.name} · {cfg.fabric.name}
                          </p>
                          <p className="text-[#706a60]">
                            {cfg.color.name} · {cfg.pattern.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] tracking-[0.8px] text-[#706a60] uppercase">
                            TAILORING DETAILS
                          </p>
                          <p className="mt-0.5">
                            {cfg.details.collar} · {cfg.details.sleeves}
                          </p>
                          <p className="text-[#706a60]">
                            {cfg.details.buttons} · {cfg.details.pockets}
                          </p>
                        </div>
                      </div>

                      {/* Linked Measurement Profile */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-y border-[#e9e0d3] py-2.5 text-[12px]">
                        <div className="flex items-center gap-2 text-[#172b24]">
                          <img
                            alt=""
                            className="size-4"
                            src={FIGMA_ASSETS.icons.rulerStudio}
                          />
                          <span>
                            Measurement Profile:{" "}
                            <strong>
                              {cfg.measurementProfileName ??
                                "Ananya — Everyday Relaxed Fit"}
                            </strong>
                          </span>
                        </div>
                        <Link
                          href="/measurements"
                          className="text-[11px] text-[#172b24] underline underline-offset-4 hover:text-[#b69a68]"
                        >
                          Change profile
                        </Link>
                      </div>

                      {/* Item Controls: Quantity, Edit Customization, Remove */}
                      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                        <div className="flex items-center gap-3">
                          <span className="text-[12px] text-[#706a60]">
                            Qty:
                          </span>
                          <div className="inline-flex items-center border border-[#e9e0d3] bg-[#f5f0e7]">
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity - 1)
                              }
                              className="px-3 py-1.5 text-[13px] text-[#172b24] cursor-pointer"
                            >
                              −
                            </button>
                            <span className="px-3 py-1.5 text-[13px] font-medium text-[#172b24]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateCartQuantity(item.id, item.quantity + 1)
                              }
                              className="px-3 py-1.5 text-[13px] text-[#172b24] cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <ButtonText
                            label="Edit Customization"
                            onClick={() => {
                              setActiveConfiguration(cfg);
                              router.push("/customize");
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[12px] text-[#706a60] underline underline-offset-4 hover:text-black cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Delivery Estimate & Craftsmanship Assurance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#e9e0d3] p-6">
                <div className="flex items-start gap-3">
                  <img
                    alt=""
                    className="size-5 mt-0.5"
                    src={FIGMA_ASSETS.icons.truck}
                  />
                  <div>
                    <p className="font-sans text-[13px] font-medium text-[#172b24]">
                      Estimated Delivery: 10–14 Business Days
                    </p>
                    <p className="font-sans text-[12px] text-[#706a60] mt-1">
                      Insured priority shipping across India included at no
                      additional charge.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <img
                    alt=""
                    className="size-5 mt-0.5"
                    src={FIGMA_ASSETS.icons.scissorsTrust}
                  />
                  <div>
                    <p className="font-sans text-[13px] font-medium text-[#172b24]">
                      Complimentary Fit Alteration Guarantee
                    </p>
                    <p className="font-sans text-[12px] text-[#706a60] mt-1">
                      Includes 14-day post-delivery fit refinement with your
                      atelier.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Coupon & Order Summary Rail (K03) */}
            <aside className="flex flex-col gap-[24px] w-full lg:w-[380px] shrink-0 bg-white border border-[#e9e0d3] p-[24px] lg:sticky lg:top-[124px]">
              <SectionHeading
                eyebrow="ORDER SUMMARY"
                title="Estimated Total"
              />

              {/* Coupon Box (K03) */}
              <form
                onSubmit={handleApplyCoupon}
                className="flex flex-col gap-2 border-y border-[#e9e0d3] py-4"
              >
                <label
                  htmlFor="cart-coupon-input"
                  className="font-sans text-[12px] text-[#29251f]"
                >
                  Apply privilege or atelier code
                </label>
                <div className="flex gap-2">
                  <input
                    id="cart-coupon-input"
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Try TAPESTORY10 or ATELIER500"
                    className="h-[44px] flex-1 border border-[#e9e0d3] bg-[#f5f0e7] px-3 text-[12px] uppercase text-[#172b24] focus:border-[#172b24] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-[44px] bg-[#172b24] px-4 text-[12px] font-medium text-[#f5f0e7] cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <div className="flex items-center justify-between bg-[#e9e0d3] px-3 py-1.5 text-[11px] text-[#172b24]">
                    <span>
                      ✓ Code <strong>{couponCode}</strong> active (−
                      {formatInr(couponDiscountInr)})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        removeCouponCode();
                        setCouponFeedback(null);
                      }}
                      className="underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
                {couponFeedback && !couponFeedback.valid && (
                  <p className="text-[11px] text-[#7a2e2e]">
                    {couponFeedback.message}
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 text-[13px] text-[#29251f]">
                <div className="flex items-center justify-between">
                  <span>Bespoke garments ({cart.length})</span>
                  <span>{formatInr(subtotalInr)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Custom pattern drafting &amp; finishing</span>
                  <span className="text-[#172b24]">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Insured priority shipping (India)</span>
                  <span className="text-[#172b24]">Complimentary</span>
                </div>
                {couponDiscountInr > 0 && (
                  <div className="flex items-center justify-between text-[#172b24] font-medium">
                    <span>Privilege discount ({couponCode})</span>
                    <span>− {formatInr(couponDiscountInr)}</span>
                  </div>
                )}
                <div className="h-px w-full bg-[#e9e0d3] my-1" />
                <div className="flex items-baseline justify-between">
                  <span className="font-sans text-[14px] font-medium text-black">
                    Total Payable (INR)
                  </span>
                  <span className="font-serif text-[32px] text-[#172b24]">
                    {formatInr(totalInr)}
                  </span>
                </div>
                <p className="text-[11px] text-[#706a60]">
                  Inclusive of all applicable GST and bespoke tailoring charges.
                </p>
              </div>

              <ButtonPrimary
                label="Proceed to Checkout"
                href="/checkout"
                fullWidth
              />
              <ButtonSecondary
                label="Continue Exploring"
                href="/products"
                fullWidth
              />
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
