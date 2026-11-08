"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "@/components/common/Button";
import { SectionHeading } from "@/components/common/SectionHeading";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderParam = searchParams.get("order");
  const { orders } = useTapestory();

  const confirmedOrder =
    orders.find((o) => o.id === orderParam || o.orderNumber === orderParam) ??
    orders[0];

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f0e7] w-full">
      <Header />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-[40px] lg:py-[64px]">
        {/* Confirmation Hero Banner (Flow 05 K09) */}
        <section className="flex flex-col gap-[24px] bg-white border-2 border-[#172b24] p-6 sm:p-[40px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="bg-[#e9e0d3] px-3 py-1.5 font-sans text-[10px] tracking-[1px] text-[#172b24] uppercase">
              ORDER CONFIRMED · PAYMENT VERIFIED VIA RAZORPAY
            </span>
            <span className="font-sans text-[12px] text-[#706a60]">
              Placed on {confirmedOrder.placedDate}
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
              Thank you. Your story is now with the atelier.
            </h1>
            <p className="font-sans text-[14px] leading-[1.65] text-[#29251f] max-w-[760px]">
              Order <strong>{confirmedOrder.orderNumber}</strong> has been
              assigned to <strong>{confirmedOrder.vendorName}</strong> (
              {confirmedOrder.vendorLocation}). Master pattern drafting begins
              within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#f5f0e7] p-6 border border-[#e9e0d3]">
            <div>
              <p className="text-[10px] tracking-[1px] text-[#706a60] uppercase">
                ORDER NUMBER &amp; PAYMENT
              </p>
              <p className="font-serif text-[22px] text-[#172b24] mt-1">
                {confirmedOrder.orderNumber}
              </p>
              <p className="text-[12px] text-[#29251f] mt-1">
                {confirmedOrder.paymentMethod} · {confirmedOrder.paymentStatus}
              </p>
              {confirmedOrder.razorpayPaymentId && (
                <p className="text-[11px] text-[#706a60] mt-0.5">
                  Ref: {confirmedOrder.razorpayPaymentId}
                </p>
              )}
            </div>

            <div>
              <p className="text-[10px] tracking-[1px] text-[#706a60] uppercase">
                ESTIMATED DELIVERY
              </p>
              <p className="font-serif text-[22px] text-[#172b24] mt-1">
                {confirmedOrder.estimatedDelivery}
              </p>
              <p className="text-[12px] text-[#29251f] mt-1">
                {confirmedOrder.shippingAddress.recipientName} ·{" "}
                {confirmedOrder.shippingAddress.city}
              </p>
            </div>

            <div>
              <p className="text-[10px] tracking-[1px] text-[#706a60] uppercase">
                MEASUREMENT PROFILE LOCKED
              </p>
              <p className="font-serif text-[20px] text-[#172b24] mt-1">
                {confirmedOrder.measurementProfileName}
              </p>
              <p className="text-[12px] text-[#29251f] mt-1">
                18-point quality check included
              </p>
            </div>
          </div>

          {/* Garment Ticket Summary */}
          <div className="flex flex-col sm:flex-row items-start gap-6 border-t border-[#e9e0d3] pt-6">
            <div className="relative h-[180px] w-[140px] shrink-0 bg-[#e9e0d3] overflow-hidden">
              <img
                alt={confirmedOrder.productName}
                className="size-full object-cover"
                src={confirmedOrder.productImage}
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <h2 className="font-serif text-[26px] text-[#172b24]">
                {confirmedOrder.productName}
              </h2>
              <p className="text-[13px] text-[#29251f]">
                {confirmedOrder.fabricSummary} · {confirmedOrder.fitSummary}
              </p>
              <ul className="mt-1 space-y-1 text-[12px] text-[#706a60]">
                {confirmedOrder.customDetailsSummary.map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-[11px] text-[#706a60]">Total Paid</span>
              <p className="font-serif text-[32px] text-[#172b24]">
                {formatInr(confirmedOrder.totalInr)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <ButtonPrimary
              label={`Track Order ${confirmedOrder.orderNumber}`}
              href={`/orders/${confirmedOrder.id}`}
            />
            <ButtonSecondary label="View All Orders" href="/orders" />
            <ButtonSecondary label="Continue Exploring" href="/products" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f0e7] flex items-center justify-center text-[#172b24]">
          Loading Order Confirmation…
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
