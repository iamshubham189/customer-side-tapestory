"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";

interface ProductionMilestone {
  stepNumber: number;
  title: string;
  subtitle: string;
  statusLabel: string;
  state: "completed" | "current" | "upcoming";
}

const FIGMA_8_STEP_TIMELINE: ProductionMilestone[] = [
  {
    stepNumber: 1,
    title: "Order Confirmed",
    subtitle: "Your design, fabric selection, and payment have been confirmed.",
    statusLabel: "Completed · 12 Mar, 11:20 AM",
    state: "completed",
  },
  {
    stepNumber: 2,
    title: "Measurements Verified",
    subtitle: "Saved profile “Aarav — Everyday Fit” checked by the pattern master.",
    statusLabel: "Completed · 13 Mar, 02:15 PM",
    state: "completed",
  },
  {
    stepNumber: 3,
    title: "Fabric Prepared",
    subtitle: "Olive washed linen inspected, pre-washed, and steamed before cutting.",
    statusLabel: "Completed · 14 Mar, 05:40 PM",
    state: "completed",
  },
  {
    stepNumber: 4,
    title: "Cutting & Stitching",
    subtitle: "Master tailor is assembling panels, collar structure, and horn buttons.",
    statusLabel: "In Progress · Started 15 Mar",
    state: "current",
  },
  {
    stepNumber: 5,
    title: "Quality Check",
    subtitle: "Final measurements, seam finish, and pressing inspection.",
    statusLabel: "Expected · 19 Mar",
    state: "upcoming",
  },
  {
    stepNumber: 6,
    title: "Ready for Dispatch",
    subtitle: "Garment packed in breathable cotton garment bag with care card.",
    statusLabel: "Expected · 20 Mar",
    state: "upcoming",
  },
  {
    stepNumber: 7,
    title: "Shipped",
    subtitle: "Handed over to insured courier partner with live tracking link.",
    statusLabel: "Expected · 20 Mar",
    state: "upcoming",
  },
  {
    stepNumber: 8,
    title: "Delivered",
    subtitle: "Arrives at your doorstep, ready to wear.",
    statusLabel: "Estimated · 22 Mar 2026",
    state: "upcoming",
  },
];

export default function OrderTrackingDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { orders, measurementProfiles, loadProductIntoStudio } = useTapestory();
  const [copiedTracking, setCopiedTracking] = useState(false);

  const rawId = decodeURIComponent(params?.id || "ord-ts-1068");

  const order = useMemo(() => {
    const normalized = rawId.replace(/^#/, "").toLowerCase();
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === normalized ||
          o.orderNumber.replace(/^#/, "").toLowerCase() === normalized
      ) || orders[0]
    );
  }, [orders, rawId]);

  const activeProfile = useMemo(() => {
    return (
      measurementProfiles.find((p) => p.name === order?.measurementProfileName) ||
      measurementProfiles[0]
    );
  }, [measurementProfiles, order]);

  const milestones: ProductionMilestone[] = useMemo(() => {
    if (!order) return FIGMA_8_STEP_TIMELINE;
    if (order.orderNumber === "#TS-1068") {
      return FIGMA_8_STEP_TIMELINE;
    }
    if (order.statusCategory === "Delivered") {
      return FIGMA_8_STEP_TIMELINE.map((step) => ({
        ...step,
        state: "completed" as const,
        statusLabel:
          step.stepNumber === 8
            ? `Delivered · ${order.deliveredDate || order.estimatedDelivery}`
            : "Completed",
      }));
    }
    if (order.statusCategory === "Cancelled") {
      return FIGMA_8_STEP_TIMELINE.slice(0, 3).map((step, idx) => ({
        ...step,
        state: idx === 0 ? ("completed" as const) : ("upcoming" as const),
        statusLabel:
          idx === 0
            ? `Placed · ${order.placedDate}`
            : `Cancelled · ${order.cancelledDate || order.placedDate}`,
      }));
    }
    return FIGMA_8_STEP_TIMELINE;
  }, [order]);

  const handleCopyTracking = () => {
    const tracking = order?.trackingNumber || "TAP-BLR-8841209";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tracking);
    }
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const handleCustomizeSimilar = () => {
    if (order) {
      loadProductIntoStudio(order.productSlug);
      router.push(`/customize?product=${order.productSlug}`);
    }
  };

  if (!order) return null;

  const vendorInitials = order.vendorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#1c1a17]">
      <Header activeNav="account" />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-14 lg:py-12">
        {/* Order Switcher Pills for quick demo navigation */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#e2d8c9] bg-[#efe7dc]/70 px-4 py-2.5">
          <span className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
            Inspect Order:
          </span>
          <div className="flex flex-wrap gap-2">
            {orders.map((item) => {
              const active = item.id === order.id;
              return (
                <Link
                  key={item.id}
                  href={`/orders/${item.id}`}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    active
                      ? "bg-[#1c1a17] text-[#fbf8f3]"
                      : "bg-[#fbf8f3] text-[#6a6258] hover:text-[#1c1a17]"
                  }`}
                >
                  {item.orderNumber} · {item.productName} ({item.statusCategory})
                </Link>
              );
            })}
          </div>
        </div>

        {/* Page Header (Figma 25:30906) */}
        <section className="border-b border-[#d8cec1] pb-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-[#6a6258]"
          >
            <Link href="/" className="transition hover:text-[#1c1a17]">
              Home
            </Link>
            <span>/</span>
            <Link href="/orders" className="transition hover:text-[#1c1a17]">
              My Orders
            </Link>
            <span>/</span>
            <span className="font-medium text-[#1c1a17]">Order {order.orderNumber}</span>
          </nav>

          <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
            ORDER DETAILS &amp; PRODUCTION TRACKING
          </p>

          <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-serif text-[30px] font-medium leading-[1.15] text-[#1c1a17] sm:text-[36px]">
                  Order {order.orderNumber} — {order.productName}
                </h1>
                {order.statusCategory === "Ongoing" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efe4d2] px-3.5 py-1 text-[11px] font-medium text-[#7b5d2e]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7b5d2e]" />
                    In Production · {order.currentStage}
                  </span>
                )}
                {order.statusCategory === "Delivered" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6efe8] px-3.5 py-1 text-[11px] font-medium text-[#2f5b3d]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2f5b3d]" />
                    Delivered
                  </span>
                )}
                {order.statusCategory === "Cancelled" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#efe5e3] px-3.5 py-1 text-[11px] font-medium text-[#7a3e37]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#7a3e37]" />
                    Cancelled
                  </span>
                )}
              </div>
              <p className="mt-2 text-[14px] leading-[22px] text-[#6a6258]">
                Ordered on {order.placedDate} · Crafted by {order.vendorName}, {order.vendorLocation} ·{" "}
                {order.statusCategory === "Delivered"
                  ? `Delivered on ${order.deliveredDate || order.estimatedDelivery}`
                  : `Estimated delivery ${order.estimatedDelivery}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {order.statusCategory === "Delivered" ? (
                <>
                  <Link
                    href={`/orders/${order.id}/alteration`}
                    className="inline-flex h-[40px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                  >
                    Reorder or Alter
                  </Link>
                  <Link
                    href={`/orders/${order.id}/review`}
                    className="inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    Rate &amp; Review
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/account/support"
                    className="inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    Need Help?
                  </Link>
                  <button
                    type="button"
                    onClick={handleCustomizeSimilar}
                    className="inline-flex h-[40px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                  >
                    Customize Similar Piece
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Top Row: Production Timeline (Left) + Your Creation Summary (Right 400px) (Figma 25:30948) */}
        <section className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-12">
          {/* Left: Production Timeline Card (Figma 25:30949) */}
          <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-8">
            <div className="flex flex-col justify-between gap-2 border-b border-[#e7dfd3] pb-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                  01 / HOW YOUR GARMENT COMES TO LIFE
                </p>
                <h2 className="mt-1 font-serif text-[26px] font-medium text-[#1c1a17]">
                  Production timeline
                </h2>
              </div>
              <p className="text-[12px] text-[#6a6258]">
                Updated by {order.vendorName} · Today, 10:30 AM
              </p>
            </div>

            <div className="mt-6 space-y-3">
              {milestones.map((step) => {
                const isCompleted = step.state === "completed";
                const isCurrent = step.state === "current";

                return (
                  <div
                    key={step.stepNumber}
                    className={`flex flex-col justify-between gap-3 rounded-[4px] p-4 transition sm:flex-row sm:items-center ${
                      isCurrent
                        ? "border-l-[3px] border-[#b69a68] bg-[#f4ebdd]"
                        : "border border-transparent hover:border-[#e7dfd3]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-medium ${
                          isCompleted
                            ? "bg-[#2f5b3d] text-[#fbf8f3]"
                            : isCurrent
                              ? "bg-[#7b5d2e] text-[#fbf8f3]"
                              : "border border-[#cfc3b2] bg-[#f1eae0] text-[#7c7367]"
                        }`}
                      >
                        {step.stepNumber}
                      </span>
                      <div>
                        <h3
                          className={`text-[14px] font-medium ${
                            step.state === "upcoming" ? "text-[#6a6258]" : "text-[#1c1a17]"
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p className="mt-0.5 text-[12px] leading-[19px] text-[#6a6258]">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 text-[11px] font-medium sm:text-right ${
                        isCurrent
                          ? "text-[#7b5d2e]"
                          : isCompleted
                            ? "text-[#2f5b3d]"
                            : "text-[#7c7367]"
                      }`}
                    >
                      {step.statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Your Creation Summary Card (Figma 25:31026) */}
          <aside className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-4">
            <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
              02 / GARMENT &amp; CUSTOMIZATION
            </p>
            <h2 className="mt-1 font-serif text-[26px] font-medium text-[#1c1a17]">
              Your creation
            </h2>

            {/* Garment Hero Preview */}
            <div className="mt-4 flex gap-4 rounded-[4px] bg-[#efe7dc] p-3.5">
              <div className="relative h-[96px] w-[80px] shrink-0 overflow-hidden rounded-[3px] bg-[#e5dccf]">
                <Image
                  src={order.productImage}
                  alt={order.productName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="font-serif text-[18px] font-medium text-[#1c1a17]">
                  {order.productName}
                </h3>
                <p className="mt-0.5 text-[12px] text-[#6a6258]">
                  Unisex Relaxed Utility Silhouette
                </p>
                <p className="mt-1 text-[12px] font-medium text-[#1c1a17]">
                  {order.fabricSummary} · {order.colorName}
                </p>
              </div>
            </div>

            {/* Customization Spec Rows */}
            <div className="mt-5 space-y-2.5 border-t border-[#e7dfd3] pt-4 text-[12px]">
              <div className="flex justify-between gap-4">
                <span className="text-[#6a6258]">Style / Base</span>
                <span className="text-right font-medium text-[#1c1a17]">
                  Field Jacket · Relaxed Fit
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#6a6258]">Fabric</span>
                <span className="text-right font-medium text-[#1c1a17]">{order.fabricSummary}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#6a6258]">Colour &amp; Pattern</span>
                <span className="text-right font-medium text-[#1c1a17]">
                  {order.colorName} · Solid Matte Weave
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#6a6258]">Collar &amp; Cuffs</span>
                <span className="text-right font-medium text-[#1c1a17]">
                  {order.customDetailsSummary.slice(0, 2).join(" · ") ||
                    "Structured Stand Collar · Buttoned Tab Cuffs"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#6a6258]">Pockets &amp; Buttons</span>
                <span className="text-right font-medium text-[#1c1a17]">
                  4 Utility Flap Pockets · Matte Horn Buttons
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-[#6a6258]">Personal Note</span>
                <span className="text-right font-medium text-[#1c1a17]">
                  “Slightly softer shoulder drape for layering”
                </span>
              </div>
            </div>

            {/* Measurements Used */}
            <div className="mt-5 border-t border-[#e7dfd3] pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                MEASUREMENTS USED
              </p>
              <p className="mt-1 text-[13px] font-medium text-[#1c1a17]">
                Profile: {order.measurementProfileName} ({activeProfile?.unit || "cm"})
              </p>
              <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                Chest {activeProfile?.values.chest || 100} cm · Waist{" "}
                {activeProfile?.values.waist || 84} cm · Shoulder{" "}
                {activeProfile?.values.shoulderWidth || 45} cm · Sleeve{" "}
                {activeProfile?.values.sleeveLength || 63} cm · Jacket Length{" "}
                {activeProfile?.values.garmentLength || 72} cm
              </p>
            </div>

            {/* Order Total Breakdown */}
            <div className="mt-5 space-y-2 border-t border-[#e7dfd3] pt-4 text-[12px]">
              <div className="flex justify-between text-[#6a6258]">
                <span>Base Garment + Fabric</span>
                <span className="text-[#1c1a17]">{formatInr(order.subtotalInr)}</span>
              </div>
              <div className="flex justify-between text-[#6a6258]">
                <span>Custom Detailing &amp; Horn Buttons</span>
                <span className="text-[#1c1a17]">{formatInr(order.customizationFeeInr)}</span>
              </div>
              <div className="flex justify-between text-[#6a6258]">
                <span>Shipping &amp; Insured Packaging</span>
                <span className="text-[#2f5b3d]">
                  {order.shippingInr === 0 ? "Complimentary" : formatInr(order.shippingInr)}
                </span>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#d8cec1] pt-3">
                <span className="text-[13px] font-medium text-[#1c1a17]">
                  Total Paid ({order.paymentMethod})
                </span>
                <span className="font-serif text-[20px] font-medium text-[#1c1a17]">
                  {formatInr(order.totalInr)}
                </span>
              </div>
            </div>
          </aside>
        </section>

        {/* Bottom Row: Vendor Details + Delivery & Tracking (Figma 25:31110) */}
        <section className="mt-7 grid grid-cols-1 gap-7 lg:grid-cols-2">
          {/* Vendor Card (Figma 25:31111) */}
          <div className="flex flex-col justify-between rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                03 / THE PEOPLE BEHIND YOUR PIECE
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e5dac8] font-serif text-[20px] font-medium text-[#1c1a17]">
                  {vendorInitials}
                </div>
                <div>
                  <h2 className="font-serif text-[24px] font-medium text-[#1c1a17]">
                    {order.vendorName}
                  </h2>
                  <p className="text-[13px] text-[#6a6258]">
                    {order.vendorLocation} · Outerwear &amp; Natural Linen Tailoring
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-[21px] text-[#6a6258]">
                An independent slow-fashion studio specializing in breathable linen outerwear, clean
                architectural seams, and small-batch custom garments made one piece at a time.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e7dfd3] pt-4">
              <span className="text-[12px] font-medium text-[#1c1a17]">
                ★ 4.8 / 5 · 20 sample reviews · 98% on-time delivery
              </span>
              <Link
                href={`/vendors/${order.vendorSlug}`}
                className="inline-flex h-[38px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
              >
                View Vendor Profile
              </Link>
            </div>
          </div>

          {/* Delivery & Tracking Card (Figma 25:31135) */}
          <div className="flex flex-col justify-between rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                04 / FROM THE ATELIER TO YOUR DOOR
              </p>
              <h2 className="mt-1 font-serif text-[24px] font-medium text-[#1c1a17]">
                Delivery details
              </h2>

              <div className="mt-4 space-y-2.5 text-[13px]">
                <div className="flex justify-between gap-4">
                  <span className="text-[#6a6258]">Shipment Status</span>
                  <span className="text-right font-medium text-[#1c1a17]">
                    {order.statusCategory === "Delivered"
                      ? "Delivered to Recipient"
                      : "Preparing at Atelier · Dispatch on 20 Mar"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6a6258]">Expected Delivery</span>
                  <span className="text-right font-medium text-[#1c1a17]">
                    {order.statusCategory === "Delivered"
                      ? order.deliveredDate || order.estimatedDelivery
                      : "Sunday, 22 Mar 2026 (By 8:00 PM)"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[#6a6258]">Delivery Partner</span>
                  <span className="text-right font-medium text-[#1c1a17]">
                    {order.courierPartner || "BlueDart Priority Insured"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[#6a6258]">Tracking Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[12px] font-medium text-[#1c1a17]">
                      {order.trackingNumber || "TAP-BLR-8841209 (Assigned · Active upon dispatch)"}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyTracking}
                      className="rounded border border-[#d8cec1] px-2 py-0.5 text-[11px] text-[#6a6258] hover:border-[#1c1a17] hover:text-[#1c1a17]"
                    >
                      {copiedTracking ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 border-t border-[#e7dfd3] pt-4">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                DELIVER TO
              </p>
              <p className="mt-1 text-[13px] leading-[20px] text-[#1c1a17]">
                {order.shippingAddress.recipientName} · {order.shippingAddress.line1},{" "}
                {order.shippingAddress.line2 ? `${order.shippingAddress.line2}, ` : ""}
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode} · {order.shippingAddress.phone}
              </p>
            </div>
          </div>
        </section>

        {/* Order Help Bar (Figma 25:31173) */}
        <section className="mt-8 flex flex-col justify-between gap-5 rounded-[4px] border border-[#d8cec1] bg-[#ede3d4] p-6 sm:p-7 lg:flex-row lg:items-center">
          <div>
            <h2 className="font-serif text-[20px] font-medium text-[#1c1a17]">
              Questions about your creation?
            </h2>
            <p className="mt-1 text-[13px] text-[#6a6258]">
              Quote Order ID <strong className="font-medium text-[#1c1a17]">{order.orderNumber}</strong>{" "}
              when chatting with our team for priority assistance with sizing, timeline, or delivery.
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
              href={`/account/support?order=${encodeURIComponent(order.orderNumber)}#raise-request`}
              className="inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
            >
              Raise an Order Issue
            </Link>
            <Link
              href="/account/support"
              className="inline-flex h-[40px] items-center justify-center px-2 text-[12px] font-medium text-[#1c1a17] underline underline-offset-4"
            >
              Help Centre
            </Link>
          </div>
        </section>

        {/* Alternate Tracking State Examples (Figma 25:31185) */}
        <section className="mt-12 border-t border-[#d8cec1] pt-10">
          <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
            ORDER STATUS STATES · PROCESSING, DELAYED, SHIPPED, DELIVERED &amp; CANCELLED
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                PROCESSING ORDER
              </p>
              <h3 className="mt-1.5 font-serif text-[17px] font-medium text-[#1c1a17]">
                Measurements Check
              </h3>
              <p className="mt-1 text-[12px] leading-[18px] text-[#6a6258]">
                Order confirmed. Pattern master is reviewing your saved fit profile before cutting.
              </p>
              <p className="mt-3 text-[11px] font-medium text-[#7b5d2e]">
                Step 2 of 8 · On Schedule
              </p>
            </div>

            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#9b5b28]">
                DELAYED ORDER
              </p>
              <h3 className="mt-1.5 font-serif text-[17px] font-medium text-[#1c1a17]">
                Revised Estimate (+2 Days)
              </h3>
              <p className="mt-1 text-[12px] leading-[18px] text-[#6a6258]">
                Extra hand-finishing time required at quality check. New delivery date shared via SMS.
              </p>
              <p className="mt-3 text-[11px] font-medium text-[#9b5b28]">
                Updated Delivery · 24 Mar
              </p>
            </div>

            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#2f5b3d]">
                SHIPPED ORDER
              </p>
              <h3 className="mt-1.5 font-serif text-[17px] font-medium text-[#1c1a17]">
                In Transit to You
              </h3>
              <p className="mt-1 text-[12px] leading-[18px] text-[#6a6258]">
                Dispatched from Jaipur atelier via BlueDart Priority. Live courier tracking active.
              </p>
              <p className="mt-3 text-[11px] font-medium text-[#2f5b3d]">
                Step 7 of 8 · Arriving Tomorrow
              </p>
            </div>

            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#2f5b3d]">
                DELIVERED ORDER · #TS-1042
              </p>
              <h3 className="mt-1.5 font-serif text-[17px] font-medium text-[#1c1a17]">
                A-Line Dress Delivered
              </h3>
              <p className="mt-1 text-[12px] leading-[18px] text-[#6a6258]">
                Delivered on 28 Feb 2026. Reorder this design, request an alteration, or leave a
                review.
              </p>
              <Link
                href="/orders/ord-ts-1042/alteration"
                className="mt-3 inline-block text-[11px] font-medium text-[#1c1a17] underline underline-offset-4"
              >
                Reorder · Alter · Review →
              </Link>
            </div>

            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
              <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#7a3e37]">
                CANCELLED ORDER · #TS-1031
              </p>
              <h3 className="mt-1.5 font-serif text-[17px] font-medium text-[#1c1a17]">
                Order Cancelled &amp; Refunded
              </h3>
              <p className="mt-1 text-[12px] leading-[18px] text-[#6a6258]">
                Cancelled before fabric cutting. ₹3,499 refunded to your original payment method.
              </p>
              <Link
                href="/orders/ord-ts-1031"
                className="mt-3 inline-block text-[11px] font-medium text-[#7a3e37] underline underline-offset-4"
              >
                Refund Completed · 15 Feb →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
