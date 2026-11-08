"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";

function StarSelector({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (rating: number) => void;
  size?: "sm" | "md" | "lg";
}) {
  const textSize =
    size === "lg" ? "text-[22px]" : size === "md" ? "text-[16px]" : "text-[14px]";
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 5 stars`}
          className={`${textSize} leading-none transition ${
            star <= value ? "text-[#b6862c]" : "text-[#cfc3b2] hover:text-[#b69a68]"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function RatingsAndReviewsPage() {
  const params = useParams<{ id: string }>();
  const { orders, user, reviews, submitCustomerReview } = useTapestory();

  const rawId = decodeURIComponent(params?.id || "ord-ts-1042");

  const selectedOrder = useMemo(() => {
    const normalized = rawId.replace(/^#/, "").toLowerCase();
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === normalized ||
          o.orderNumber.replace(/^#/, "").toLowerCase() === normalized
      ) ||
      orders.find((o) => o.orderNumber === "#TS-1042") ||
      orders[0]
    );
  }, [orders, rawId]);

  // Product review state
  const [overallRating, setOverallRating] = useState(5);
  const [fitAccuracy, setFitAccuracy] = useState(5);
  const [comfortRating, setComfortRating] = useState(5);
  const [fabricQuality, setFabricQuality] = useState(4);
  const [craftsmanship, setCraftsmanship] = useState(5);
  const [reviewTitle, setReviewTitle] = useState(
    "A dream summer dress that actually fits my shoulders and waist"
  );
  const [reviewComment, setReviewComment] = useState(
    "Standard sizes always gap at my waist or pull across the bust, so using my savedEvening Fit profile made all the difference. The Soft Rose linen has a lovely weight and isn’t sheer in daylight. The concealed side pockets lie completely flat."
  );
  const [photoNames, setPhotoNames] = useState<string[]>(["daylight-rose-linen.jpg"]);
  const [productReviewSubmitted, setProductReviewSubmitted] = useState(false);

  // Vendor review state
  const [commRating, setCommRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [vendorFeedback, setVendorFeedback] = useState(
    "Studio Mira double-checked my dress length preference before cutting the fabric and shared a photo of the rose linen swatch in natural light. Packed thoughtfully in a reusable cotton bag."
  );
  const [vendorReviewSubmitted, setVendorReviewSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const added = Array.from(files).map((f) => f.name);
    setPhotoNames((prev) => [...prev, ...added].slice(0, 4));
  };

  const handleProductReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    submitCustomerReview({
      orderId: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      type: "product",
      targetId: selectedOrder.productId,
      targetName: selectedOrder.productName,
      authorName: user?.fullName || "Aarav Mehta",
      authorLocation: "Bengaluru",
      rating: overallRating,
      fitAccuracyRating: fitAccuracy,
      craftsmanshipRating: craftsmanship,
      title: reviewTitle,
      comment: reviewComment,
      garmentOrdered: selectedOrder.productName,
      fabricChosen: `${selectedOrder.fabricSummary} (${selectedOrder.colorName})`,
    });
    setProductReviewSubmitted(true);
  };

  const handleVendorReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    const avgVendor = Math.round((commRating + serviceRating + deliveryRating) / 3);
    submitCustomerReview({
      orderId: selectedOrder.id,
      orderNumber: selectedOrder.orderNumber,
      type: "vendor",
      targetId: selectedOrder.vendorId,
      targetName: selectedOrder.vendorName,
      authorName: user?.fullName || "Aarav Mehta",
      authorLocation: "Bengaluru",
      rating: avgVendor,
      title: `Thoughtful tailoring by ${selectedOrder.vendorName}`,
      comment: vendorFeedback,
      garmentOrdered: selectedOrder.productName,
      fabricChosen: `${selectedOrder.fabricSummary} (${selectedOrder.colorName})`,
    });
    setVendorReviewSubmitted(true);
  };

  if (!selectedOrder) return null;

  const vendorInitials = selectedOrder.vendorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#1c1a17]">
      <Header activeNav="account" />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-14 lg:py-12">
        {/* Page Header (Figma 25:31620) */}
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
            <span className="font-medium text-[#1c1a17]">Ratings &amp; Reviews</span>
          </nav>

          <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
            VERIFIED CUSTOMER FEEDBACK
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-[32px] font-medium leading-[1.15] text-[#1c1a17] sm:text-[38px]">
                Share how your piece turned out
              </h1>
              <p className="mt-2 max-w-[680px] text-[14px] leading-[22px] text-[#6a6258]">
                Your honest experience helps other customers choose with confidence—and celebrates
                the craft of independent ateliers.
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
            >
              ← Back to My Orders
            </Link>
          </div>
        </section>

        {/* Eligible Delivered Orders Bar (Figma 25:31647) */}
        <section className="mt-8 rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                YOUR DELIVERED DESIGNS
              </p>
              <h2 className="mt-1 font-serif text-[24px] font-medium text-[#1c1a17]">
                One story waiting to be shared
              </h2>
            </div>
            <p className="text-[12px] text-[#6a6258]">
              Reviews are open exclusively for verified delivered orders.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Active Eligible Purchase */}
            <Link
              href="/orders/ord-ts-1042/review"
              className="flex items-center justify-between gap-4 rounded-[4px] border border-[#1c1a17] bg-[#f4ebdd] p-4"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-[68px] w-[56px] shrink-0 overflow-hidden rounded-[3px] bg-[#e5dccf]">
                  <Image
                    src="/images/f0865.png"
                    alt="A-Line Dress"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#7b5d2e]">
                    ELIGIBLE PURCHASE · READY TO REVIEW
                  </p>
                  <h3 className="mt-0.5 font-serif text-[18px] font-medium text-[#1c1a17]">
                    A-Line Dress
                  </h3>
                  <p className="text-[12px] text-[#6a6258]">
                    Order #TS-1042 · Studio Mira · Soft Rose Linen · Delivered 28 Feb
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#1c1a17] px-3 py-1 text-[11px] font-medium text-[#fbf8f3]">
                Reviewing Now
              </span>
            </Link>

            {/* Already Reviewed Purchase */}
            <Link
              href="/orders/ord-ts-1017/review"
              className="flex items-center justify-between gap-4 rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4 transition hover:border-[#b69a68]"
            >
              <div className="flex items-center gap-4">
                <div className="relative h-[68px] w-[56px] shrink-0 overflow-hidden rounded-[3px] bg-[#e5dccf]">
                  <Image
                    src="/images/73c97.png"
                    alt="Everyday Overshirt"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#2f5b3d]">
                    ALREADY REVIEWED · PUBLISHED
                  </p>
                  <h3 className="mt-0.5 font-serif text-[18px] font-medium text-[#1c1a17]">
                    Everyday Overshirt
                  </h3>
                  <p className="text-[12px] text-[#6a6258]">
                    Order #TS-1017 · Loom &amp; Line · Sand Cotton-Linen · Delivered 04 Feb
                  </p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-[#e6efe8] px-3 py-1 text-[11px] font-medium text-[#2f5b3d]">
                ★★★★★ 5.0 · Published
              </span>
            </Link>
          </div>
        </section>

        {/* Section 01: Product Review (Figma 25:31676) */}
        <section className="mt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                01 / PRODUCT REVIEW · {selectedOrder.orderNumber}
              </p>
              <h2 className="mt-1 font-serif text-[28px] font-medium text-[#1c1a17]">
                How does it feel to wear it?
              </h2>
            </div>
            <p className="text-[13px] text-[#6a6258]">
              Rate the fit, comfort, fabric, and tailoring of your custom{" "}
              {selectedOrder.productName}.
            </p>
          </div>

          {productReviewSubmitted && (
            <div className="mt-4 rounded-[4px] border border-[#2f5b3d]/30 bg-[#e6efe8] px-4 py-3 text-[13px] font-medium text-[#2f5b3d]">
              ✓ Thank you! Your verified product review for {selectedOrder.productName} (
              {selectedOrder.orderNumber}) has been submitted and added to your feedback archive
              below.
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Left Product Review Form Card (Figma 25:31686) */}
            <form
              onSubmit={handleProductReviewSubmit}
              className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-8"
            >
              {/* Overall Rating */}
              <div className="flex flex-col justify-between gap-3 rounded-[4px] bg-[#f4ebdd] p-4 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    OVERALL RATING
                  </p>
                  <p className="mt-0.5 text-[14px] font-medium text-[#1c1a17]">
                    How satisfied are you with this garment overall?
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StarSelector value={overallRating} onChange={setOverallRating} size="lg" />
                  <span className="text-[13px] font-medium text-[#1c1a17]">
                    {overallRating} out of 5 — {overallRating >= 5 ? "Love it" : "Great fit"}
                  </span>
                </div>
              </div>

              {/* Detailed Aspects 2x2 Grid */}
              <div className="mt-6">
                <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  RATE SPECIFIC DETAILS
                </p>

                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#1c1a17]">Fit Accuracy</span>
                      <StarSelector value={fitAccuracy} onChange={setFitAccuracy} size="sm" />
                    </div>
                    <p className="mt-1 text-[11px] text-[#6a6258]">
                      {fitAccuracy} / 5 · True to profile
                    </p>
                  </div>

                  <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#1c1a17]">Comfort</span>
                      <StarSelector value={comfortRating} onChange={setComfortRating} size="sm" />
                    </div>
                    <p className="mt-1 text-[11px] text-[#6a6258]">
                      {comfortRating} / 5 · Breathable all day
                    </p>
                  </div>

                  <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#1c1a17]">
                        Fabric Quality
                      </span>
                      <StarSelector value={fabricQuality} onChange={setFabricQuality} size="sm" />
                    </div>
                    <p className="mt-1 text-[11px] text-[#6a6258]">
                      {fabricQuality} / 5 · Rich linen weave
                    </p>
                  </div>

                  <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-medium text-[#1c1a17]">Craftsmanship</span>
                      <StarSelector value={craftsmanship} onChange={setCraftsmanship} size="sm" />
                    </div>
                    <p className="mt-1 text-[11px] text-[#6a6258]">
                      {craftsmanship} / 5 · Clean seam finish
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <div className="mt-5">
                <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  REVIEW TITLE
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="mt-1.5 h-[42px] w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-3.5 text-[13px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                />
              </div>

              {/* Review Description */}
              <div className="mt-5">
                <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  YOUR REVIEW
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="mt-1.5 w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] p-3.5 text-[13px] leading-[21px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                />
              </div>

              {/* Photo Upload + Submit Row */}
              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#e7dfd3] pt-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    ADD PHOTOS (OPTIONAL)
                  </p>
                  <p className="mt-0.5 text-[12px] text-[#6a6258]">
                    Upload up to 4 photos showing the drape, colour, or styling
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {photoNames.map((name) => (
                      <span
                        key={name}
                        className="rounded bg-[#ede3d4] px-2.5 py-1 text-[11px] text-[#1c1a17]"
                      >
                        📷 {name}
                      </span>
                    ))}
                    <label className="cursor-pointer rounded border border-[#cfc3b2] bg-[#fbf8f3] px-3 py-1 text-[11px] font-medium text-[#1c1a17] hover:border-[#1c1a17]">
                      + Add Photo
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-[44px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[13px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                >
                  Submit Review
                </button>
              </div>
            </form>

            {/* Right Context Card (Figma 25:31734) */}
            <aside className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 lg:col-span-4">
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                YOU’RE REVIEWING
              </p>

              <div className="mt-4 flex gap-4 rounded-[4px] bg-[#efe7dc] p-3.5">
                <div className="relative h-[88px] w-[72px] shrink-0 overflow-hidden rounded-[3px] bg-[#e5dccf]">
                  <Image
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                    fill
                    sizes="72px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-[19px] font-medium text-[#1c1a17]">
                    {selectedOrder.productName}
                  </h3>
                  <p className="text-[12px] text-[#6a6258]">
                    Order {selectedOrder.orderNumber} · {formatInr(selectedOrder.totalInr)}
                  </p>
                  <p className="mt-1 text-[12px] text-[#1c1a17]">
                    {selectedOrder.colorName} · {selectedOrder.fabricSummary}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-1.5 text-[12px] text-[#6a6258]">
                <p>
                  Crafted by <strong className="text-[#1c1a17]">{selectedOrder.vendorName}</strong>{" "}
                  · Delivered {selectedOrder.deliveredDate || "28 Feb 2026"}
                </p>
                <p>Measurement Profile: {selectedOrder.measurementProfileName}</p>
                <p className="pt-1 font-medium text-[#2f5b3d]">
                  ✓ Verified Purchase Badge will appear on your review
                </p>
              </div>

              <div className="mt-6 border-t border-[#e7dfd3] pt-5">
                <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                  HELPFUL REVIEW TIPS
                </p>
                <ul className="mt-3 space-y-2 text-[12px] leading-[19px] text-[#6a6258]">
                  <li>• Mention how the garment felt compared to your saved measurement profile.</li>
                  <li>• Share how the fabric feels against the skin in your local weather.</li>
                  <li>• Note any custom details you chose (neckline, pockets, sleeve length).</li>
                  <li>• Keep feedback respectful and focused on the garment experience.</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* Section 02: Vendor Review (Figma 25:31757) */}
        <section className="mt-12 border-t border-[#d8cec1] pt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                02 / VENDOR REVIEW
              </p>
              <h2 className="mt-1 font-serif text-[28px] font-medium text-[#1c1a17]">
                The care behind the craft
              </h2>
            </div>
            <p className="text-[13px] text-[#6a6258]">
              Rate your experience working with {selectedOrder.vendorName} on Order{" "}
              {selectedOrder.orderNumber}.
            </p>
          </div>

          {vendorReviewSubmitted && (
            <div className="mt-4 rounded-[4px] border border-[#2f5b3d]/30 bg-[#e6efe8] px-4 py-3 text-[13px] font-medium text-[#2f5b3d]">
              ✓ Your atelier partner review for {selectedOrder.vendorName} has been recorded.
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Left Partner Context Card (Figma 25:31767) */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                YOUR CRAFT PARTNER
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#e5dac8] font-serif text-[20px] font-medium text-[#1c1a17]">
                  {vendorInitials}
                </div>
                <div>
                  <h3 className="font-serif text-[24px] font-medium text-[#1c1a17]">
                    {selectedOrder.vendorName}
                  </h3>
                  <p className="text-[13px] text-[#6a6258]">
                    {selectedOrder.vendorLocation} · Contemporary Linen &amp; Occasionwear
                  </p>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-[21px] text-[#6a6258]">
                Every vendor review goes directly to the studio team and helps highlight responsive,
                detail-oriented independent makers on Tapestory.
              </p>

              <p className="mt-5 border-t border-[#e7dfd3] pt-4 text-[12px] font-medium text-[#1c1a17]">
                Current Community Rating: ★ 4.9 / 5 (18 verified reviews)
              </p>
            </div>

            {/* Right Vendor Rating Form Card (Figma 25:31781) */}
            <form
              onSubmit={handleVendorReviewSubmit}
              className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-7"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                  <span className="block text-[13px] font-medium text-[#1c1a17]">
                    Communication
                  </span>
                  <div className="mt-2">
                    <StarSelector value={commRating} onChange={setCommRating} size="sm" />
                  </div>
                  <p className="mt-1 text-[11px] text-[#6a6258]">
                    {commRating} / 5 · Proactive updates
                  </p>
                </div>

                <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                  <span className="block text-[13px] font-medium text-[#1c1a17]">Service</span>
                  <div className="mt-2">
                    <StarSelector value={serviceRating} onChange={setServiceRating} size="sm" />
                  </div>
                  <p className="mt-1 text-[11px] text-[#6a6258]">
                    {serviceRating} / 5 · Attentive to notes
                  </p>
                </div>

                <div className="rounded-[4px] border border-[#e7dfd3] bg-[#f8f3eb] p-4">
                  <span className="block text-[13px] font-medium text-[#1c1a17]">
                    Delivery Experience
                  </span>
                  <div className="mt-2">
                    <StarSelector value={deliveryRating} onChange={setDeliveryRating} size="sm" />
                  </div>
                  <p className="mt-1 text-[11px] text-[#6a6258]">
                    {deliveryRating} / 5 · 2 days early
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  WRITTEN FEEDBACK FOR {selectedOrder.vendorName.toUpperCase()}
                </label>
                <textarea
                  rows={3}
                  value={vendorFeedback}
                  onChange={(e) => setVendorFeedback(e.target.value)}
                  className="mt-1.5 w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] p-3.5 text-[13px] leading-[20px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                />
              </div>

              <div className="mt-5 flex flex-col justify-between gap-3 border-t border-[#e7dfd3] pt-4 sm:flex-row sm:items-center">
                <span className="text-[12px] text-[#6a6258]">
                  Displayed on {selectedOrder.vendorName}’s public profile with “Verified Customer”
                  tag
                </span>
                <button
                  type="submit"
                  className="inline-flex h-[42px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                >
                  Submit Vendor Review
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Submitted & Published Review Preview (Figma 25:31807) */}
        <section className="mt-12 border-t border-[#d8cec1] pt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                YOUR EARLIER FEEDBACK
              </p>
              <h2 className="mt-1 font-serif text-[28px] font-medium text-[#1c1a17]">
                A story you’ve shared
              </h2>
            </div>
            <p className="text-[12px] text-[#6a6258]">
              Submitted reviews can be edited within 7 days of posting.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Published Review Card */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-8">
              {reviews.slice(0, 2).map((rev, idx) => (
                <div
                  key={rev.id}
                  className={idx > 0 ? "mt-6 border-t border-[#e7dfd3] pt-6" : ""}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-[#2f5b3d]">
                      ★★★★★ {rev.rating}.0 · Verified Purchase · Order {rev.orderNumber}
                    </span>
                    <span className="rounded-full bg-[#e6efe8] px-3 py-0.5 text-[11px] font-medium text-[#2f5b3d]">
                      {rev.status} · {rev.date}
                    </span>
                  </div>

                  <h3 className="mt-2 font-serif text-[22px] font-medium text-[#1c1a17]">
                    “{rev.title}”
                  </h3>
                  <p className="mt-2 text-[13px] leading-[21px] text-[#6a6258]">{rev.comment}</p>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#e7dfd3] pt-3 text-[12px] text-[#6a6258]">
                    <span>
                      Fit {rev.fitAccuracyRating || 5}/5 · Craftsmanship{" "}
                      {rev.craftsmanshipRating || 5}/5 · {rev.garmentOrdered} ({rev.fabricChosen})
                    </span>
                    <span className="font-medium text-[#1c1a17]">
                      Thank you for sharing your review
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Review Status States Card */}
            <div className="space-y-4 lg:col-span-4">
              <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
                <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#7b5d2e]">
                  SUBMITTED STATE
                </p>
                <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                  Thank you for your review! Our moderation team verifies order photos within 2
                  hours before publishing.
                </p>
              </div>

              <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
                <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#2f5b3d]">
                  PUBLISHED STATE
                </p>
                <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                  Live on the product and vendor pages with your Verified Custom Fit badge and fit
                  rating summary.
                </p>
              </div>

              <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-4">
                <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  EDIT WINDOW
                </p>
                <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                  Want to update your fit notes after a few washes? Edit your review anytime within
                  7 days of posting.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
