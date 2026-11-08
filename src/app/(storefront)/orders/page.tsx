"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";

type OrderTabFilter = "All" | "Ongoing" | "Delivered" | "Cancelled";

export default function OrdersHistoryPage() {
  const router = useRouter();
  const { orders, loadProductIntoStudio } = useTapestory();

  const [activeTab, setActiveTab] = useState<OrderTabFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [statePreviewMode, setStatePreviewMode] = useState<"default" | "empty" | "loading">(
    "default"
  );

  const counts = useMemo(() => {
    return {
      All: orders.length,
      Ongoing: orders.filter((o) => o.statusCategory === "Ongoing").length,
      Delivered: orders.filter((o) => o.statusCategory === "Delivered").length,
      Cancelled: orders.filter((o) => o.statusCategory === "Cancelled").length,
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesTab = activeTab === "All" || order.statusCategory === activeTab;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.productName.toLowerCase().includes(q) ||
        order.vendorName.toLowerCase().includes(q) ||
        order.fabricSummary.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const handleReorder = (productSlug: string) => {
    loadProductIntoStudio(productSlug);
    router.push(`/customize?product=${productSlug}`);
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#1c1a17]">
      <Header activeNav="account" />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-14 lg:py-12">
        {/* Page Header (Figma 25:30550) */}
        <section className="border-b border-[#d8cec1] pb-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-[#6a6258]"
          >
            <Link href="/" className="transition hover:text-[#1c1a17]">
              Home
            </Link>
            <span>/</span>
            <Link href="/account" className="transition hover:text-[#1c1a17]">
              My Account
            </Link>
            <span>/</span>
            <span className="font-medium text-[#1c1a17]">Orders</span>
          </nav>

          <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
            YOUR PERSONAL WARDROBE / ORDERS
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-[32px] font-medium leading-[1.15] text-[#1c1a17] sm:text-[40px]">
                My Orders
              </h1>
              <p className="mt-2 max-w-[580px] text-[14px] leading-[22px] text-[#6a6258]">
                Every custom piece you’ve created, from studio sketch to finished garment.
              </p>
            </div>
            <p className="font-serif text-[16px] italic text-[#7c7367]">
              Your story, beautifully made.
            </p>
          </div>
        </section>

        {/* Filter Bar (Figma 25:30589) */}
        <section className="mt-7 flex flex-col justify-between gap-4 border-b border-[#d8cec1] pb-6 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2.5">
            {(["All", "Ongoing", "Delivered", "Cancelled"] as OrderTabFilter[]).map((tab) => {
              const active = activeTab === tab;
              const label = tab === "All" ? `All Orders (${counts.All})` : `${tab} (${counts[tab]})`;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setStatePreviewMode("default");
                  }}
                  className={`rounded-full px-4 py-2 text-[12px] font-medium transition ${
                    active
                      ? "bg-[#1c1a17] text-[#fbf8f3]"
                      : "border border-[#d8cec1] bg-[#fbf8f3] text-[#6a6258] hover:border-[#1c1a17] hover:text-[#1c1a17]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-[290px]">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setStatePreviewMode("default");
                }}
                placeholder="Search by design or order ID"
                className="h-[40px] w-full rounded-[3px] border border-[#d8cec1] bg-[#fbf8f3] pl-3.5 pr-9 text-[13px] text-[#1c1a17] placeholder:text-[#7c7367] focus:border-[#1c1a17] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[12px] text-[#7c7367] hover:text-[#1c1a17]"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Orders List / States */}
        <section className="mt-7 space-y-5">
          {statePreviewMode === "loading" ? (
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                LOADING STATE
              </p>
              <div className="mt-4 flex flex-col gap-5 sm:flex-row">
                <div className="h-[148px] w-[124px] animate-pulse rounded-[3px] bg-[#efe7dc]" />
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-3.5 w-48 animate-pulse rounded bg-[#e8dfd2]" />
                  <div className="h-5 w-64 animate-pulse rounded bg-[#e8dfd2]" />
                  <div className="h-3.5 w-80 animate-pulse rounded bg-[#efe7dc]" />
                  <div className="h-3.5 w-56 animate-pulse rounded bg-[#efe7dc]" />
                </div>
              </div>
            </div>
          ) : statePreviewMode === "empty" ? (
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] px-6 py-12 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                FIRST-TIME VISIT
              </p>
              <h2 className="mt-2 font-serif text-[26px] font-medium text-[#1c1a17]">
                Your custom wardrobe starts here
              </h2>
              <p className="mx-auto mt-2 max-w-[440px] text-[13px] leading-[21px] text-[#6a6258]">
                Once you customize or order a garment, you’ll see its production journey and order
                history right here.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/products"
                  className="inline-flex h-[42px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[13px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                >
                  Explore Collection
                </Link>
                <button
                  type="button"
                  onClick={() => setStatePreviewMode("default")}
                  className="inline-flex h-[42px] items-center justify-center rounded-[3px] border border-[#d8cec1] bg-[#fbf8f3] px-5 text-[13px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                >
                  Restore My Orders
                </button>
              </div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] px-6 py-12 text-center">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                FILTERED VIEW
              </p>
              <h2 className="mt-2 font-serif text-[26px] font-medium text-[#1c1a17]">
                No orders match this view
              </h2>
              <p className="mx-auto mt-2 max-w-[440px] text-[13px] leading-[21px] text-[#6a6258]">
                Try switching the status tab or clearing your search to view all of your past and
                ongoing orders.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("All");
                  setSearchQuery("");
                }}
                className="mt-5 inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-5 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isOngoing = order.statusCategory === "Ongoing";
              const isDelivered = order.statusCategory === "Delivered";
              const isCancelled = order.statusCategory === "Cancelled";
              const isReviewed = !order.eligibleForReview && isDelivered;

              return (
                <article
                  key={order.id}
                  className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5 transition hover:border-[#b69a68] sm:p-6"
                >
                  <div className="flex flex-col justify-between gap-6 lg:flex-row">
                    {/* Left: Thumbnail + Details */}
                    <div className="flex flex-col gap-5 sm:flex-row">
                      <Link
                        href={`/orders/${order.id}`}
                        className="relative h-[180px] w-full shrink-0 overflow-hidden rounded-[3px] bg-[#efe7dc] sm:h-[148px] sm:w-[124px]"
                      >
                        <Image
                          src={order.productImage}
                          alt={order.productName}
                          fill
                          sizes="(max-width: 640px) 100vw, 124px"
                          className="object-cover"
                        />
                      </Link>

                      <div className="flex flex-col justify-between">
                        <div>
                          {/* Meta + Status Badge */}
                          <div className="flex flex-wrap items-center gap-2.5">
                            <span className="text-[12px] text-[#6a6258]">
                              Order {order.orderNumber} · Ordered on {order.placedDate}
                            </span>

                            {isOngoing && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efe4d2] px-3 py-1 text-[11px] font-medium text-[#7b5d2e]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#7b5d2e]" />
                                In Production · {order.currentStage}
                              </span>
                            )}
                            {isDelivered && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6efe8] px-3 py-1 text-[11px] font-medium text-[#2f5b3d]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2f5b3d]" />
                                Delivered
                              </span>
                            )}
                            {isCancelled && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efe5e3] px-3 py-1 text-[11px] font-medium text-[#7a3e37]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#7a3e37]" />
                                Cancelled
                              </span>
                            )}
                            {isReviewed && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#ede5d8] px-2.5 py-1 text-[11px] font-medium text-[#5c5347]">
                                ★ Reviewed
                              </span>
                            )}
                          </div>

                          {/* Product Name & Vendor */}
                          <Link href={`/orders/${order.id}`} className="mt-1.5 block">
                            <h2 className="font-serif text-[22px] font-medium leading-[29px] text-[#1c1a17] hover:underline">
                              {order.productName}
                            </h2>
                          </Link>
                          <p className="mt-0.5 text-[13px] text-[#6a6258]">
                            Crafted by{" "}
                            <Link
                              href={`/vendors/${order.vendorSlug}`}
                              className="underline decoration-[#c8bba8] underline-offset-4 hover:text-[#1c1a17]"
                            >
                              {order.vendorName}
                            </Link>{" "}
                            · {order.fabricSummary} · {order.colorName}
                          </p>
                          <p className="mt-1 text-[12px] text-[#6a6258]">
                            {order.customDetailsSummary.slice(0, 2).join(" · ")} ·{" "}
                            {order.measurementProfileName}
                          </p>
                        </div>

                        {/* Status Line */}
                        <div className="mt-3 pt-2 text-[12px] text-[#6a6258]">
                          {isOngoing && (
                            <p>
                              Estimated delivery:{" "}
                              <strong className="font-medium text-[#1c1a17]">
                                {order.estimatedDelivery}
                              </strong>{" "}
                              · Next step: Quality Check
                            </p>
                          )}
                          {isDelivered && (
                            <p>
                              Delivered on{" "}
                              <strong className="font-medium text-[#1c1a17]">
                                {order.deliveredDate || order.estimatedDelivery}
                              </strong>{" "}
                              · Eligible for alteration refinement
                            </p>
                          )}
                          {isCancelled && (
                            <p>
                              {order.cancellationReason ||
                                "Cancelled before fabric cutting · Full refund processed to original payment method"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Total + Action Buttons */}
                    <div className="flex flex-col justify-between border-t border-[#e7dfd3] pt-4 lg:items-end lg:border-t-0 lg:pt-0">
                      <div className="flex items-baseline justify-between gap-3 lg:flex-col lg:items-end lg:gap-0.5">
                        <span className="text-[11px] uppercase tracking-[1.32px] text-[#7c7367]">
                          {isCancelled ? "Refunded Amount" : "Order Total"}
                        </span>
                        <span className="font-serif text-[22px] font-medium text-[#1c1a17]">
                          {formatInr(order.totalInr)}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2.5 lg:justify-end">
                        {isOngoing && (
                          <>
                            <Link
                              href={`/orders/${order.id}`}
                              className="inline-flex h-[38px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                            >
                              Track Order
                            </Link>
                            <Link
                              href={`/orders/${order.id}`}
                              className="inline-flex h-[38px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                            >
                              View Details
                            </Link>
                          </>
                        )}

                        {isDelivered && (
                          <>
                            <Link
                              href={`/orders/${order.id}/alteration`}
                              className="inline-flex h-[38px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                            >
                              Reorder
                            </Link>
                            {order.eligibleForAlteration && (
                              <Link
                                href={`/orders/${order.id}/alteration#alteration-form`}
                                className="inline-flex h-[38px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-3.5 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                              >
                                Request Alteration
                              </Link>
                            )}
                            <Link
                              href={`/orders/${order.id}/review`}
                              className="inline-flex h-[38px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-3.5 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                            >
                              {order.eligibleForReview ? "Write a Review" : "View Review"}
                            </Link>
                            <Link
                              href={`/orders/${order.id}`}
                              className="inline-flex h-[38px] items-center justify-center px-2 text-[12px] font-medium text-[#1c1a17] underline underline-offset-4"
                            >
                              View Details
                            </Link>
                          </>
                        )}

                        {isCancelled && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReorder(order.productSlug)}
                              className="inline-flex h-[38px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                            >
                              Reorder Design
                            </button>
                            <Link
                              href={`/orders/${order.id}`}
                              className="inline-flex h-[38px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                            >
                              View Details
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        {/* Support Invitation Banner (Figma 25:30750) */}
        <section className="mt-10 flex flex-col justify-between gap-6 rounded-[4px] border border-[#d8cec1] bg-[#ede3d4] p-6 sm:p-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
              ORDER ASSISTANCE
            </p>
            <h2 className="mt-1.5 font-serif text-[24px] font-medium text-[#1c1a17]">
              A little help along the way.
            </h2>
            <p className="mt-1 max-w-[600px] text-[13px] leading-[21px] text-[#6a6258]">
              Need to update delivery instructions, check on fabric sourcing, or request a post-delivery
              fit adjustment? Our atelier support team is here for you.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/account/support"
              className="inline-flex h-[40px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-5 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
            >
              Contact Support
            </Link>
            <Link
              href="/account/support#raise-request"
              className="inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-5 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
            >
              Raise an Order Issue
            </Link>
          </div>
        </section>

        {/* Alternate Order History States (Figma 25:30764) */}
        <section className="mt-12 border-t border-[#d8cec1] pt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
              ORDER EXPERIENCE STATES · EMPTY, FILTERED &amp; LOADING VIEWS
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatePreviewMode("default")}
                className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                  statePreviewMode === "default"
                    ? "bg-[#1c1a17] text-[#fbf8f3]"
                    : "text-[#6a6258] hover:text-[#1c1a17]"
                }`}
              >
                Active List
              </button>
              <button
                type="button"
                onClick={() => setStatePreviewMode("empty")}
                className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                  statePreviewMode === "empty"
                    ? "bg-[#1c1a17] text-[#fbf8f3]"
                    : "text-[#6a6258] hover:text-[#1c1a17]"
                }`}
              >
                Empty Wardrobe
              </button>
              <button
                type="button"
                onClick={() => setStatePreviewMode("loading")}
                className={`rounded px-2.5 py-1 text-[11px] font-medium ${
                  statePreviewMode === "loading"
                    ? "bg-[#1c1a17] text-[#fbf8f3]"
                    : "text-[#6a6258] hover:text-[#1c1a17]"
                }`}
              >
                Loading Skeleton
              </button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* Empty Orders State */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                FIRST-TIME VISIT
              </p>
              <h3 className="mt-2 font-serif text-[20px] font-medium text-[#1c1a17]">
                Your custom wardrobe starts here
              </h3>
              <p className="mt-1.5 text-[12px] leading-[19px] text-[#6a6258]">
                Once you customize or order a garment, you’ll see its production journey and order
                history right here.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex h-[36px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3]"
              >
                Explore Collection
              </Link>
            </div>

            {/* No Filter Results State */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                FILTERED VIEW
              </p>
              <h3 className="mt-2 font-serif text-[20px] font-medium text-[#1c1a17]">
                No orders match this view
              </h3>
              <p className="mt-1.5 text-[12px] leading-[19px] text-[#6a6258]">
                Try switching the status tab or clearing your search to view all of your past and
                ongoing orders.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("All");
                  setSearchQuery("");
                  setStatePreviewMode("default");
                }}
                className="mt-4 inline-flex h-[36px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17]"
              >
                Clear Filters
              </button>
            </div>

            {/* Loading Order Card Skeleton */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                LOADING STATE
              </p>
              <div className="mt-3 flex gap-4">
                <div className="h-[92px] w-[76px] shrink-0 rounded-[3px] bg-[#efe7dc]" />
                <div className="flex-1 space-y-2.5 py-1">
                  <div className="h-3 w-28 rounded bg-[#e8dfd2]" />
                  <div className="h-4 w-40 rounded bg-[#e8dfd2]" />
                  <div className="h-3 w-48 rounded bg-[#efe7dc]" />
                  <div className="h-3 w-32 rounded bg-[#efe7dc]" />
                </div>
              </div>
              <p className="mt-3 text-[11px] text-[#7c7367]">
                Fetching latest atelier updates and shipment milestones...
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
