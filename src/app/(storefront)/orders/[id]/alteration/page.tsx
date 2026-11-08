"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTapestory } from "@/features/store-provider";
import { createDefaultConfiguration } from "@/services/customization.service";
import { formatInr } from "@/lib/utils/format";

type ReorderMode =
  | "reuse_exact"
  | "update_fabric"
  | "update_measurements"
  | "customize_again";

const ALTERATION_CHIPS = [
  "Length adjustment (-2 cm)",
  "Waist adjustment (-1.5 cm)",
  "Sleeve adjustment",
  "Fit adjustment",
  "Other alteration",
];

export default function ReorderAndAlterationPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    orders,
    addresses,
    alterationRequests,
    submitAlterationRequest,
    addToCart,
    loadProductIntoStudio,
  } = useTapestory();

  const rawId = decodeURIComponent(params?.id || "ord-ts-1042");

  const deliveredOrders = useMemo(
    () => orders.filter((o) => o.statusCategory === "Delivered"),
    [orders]
  );

  const selectedOrder = useMemo(() => {
    const normalized = rawId.replace(/^#/, "").toLowerCase();
    return (
      orders.find(
        (o) =>
          o.id.toLowerCase() === normalized ||
          o.orderNumber.replace(/^#/, "").toLowerCase() === normalized
      ) ||
      deliveredOrders[0] ||
      orders[0]
    );
  }, [orders, deliveredOrders, rawId]);

  const [reorderMode, setReorderMode] = useState<ReorderMode>("reuse_exact");
  const [reorderBanner, setReorderBanner] = useState<string | null>(null);

  const [selectedOrderIdForAlteration, setSelectedOrderIdForAlteration] = useState<string>(
    selectedOrder?.id || "ord-ts-1042"
  );
  const [alterationType, setAlterationType] = useState(
    "Minor Fit & Length Refinement (Complimentary)"
  );
  const [selectedAreas, setSelectedAreas] = useState<string[]>([
    "Length adjustment (-2 cm)",
    "Waist adjustment (-1.5 cm)",
  ]);
  const [requirementNotes, setRequirementNotes] = useState(
    "Please shorten the hem by 2 cm for flat sandals and take in the waist slightly by 1.5 cm while keeping the side pockets comfortable."
  );
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "front-drape-fit.jpg",
    "hem-pinning-reference.jpg",
  ]);
  const [contactMethod, setContactMethod] = useState<"email" | "phone">("email");
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState<string | null>(null);

  const alterationTargetOrder = useMemo(() => {
    return (
      orders.find((o) => o.id === selectedOrderIdForAlteration) ||
      selectedOrder ||
      orders[0]
    );
  }, [orders, selectedOrderIdForAlteration, selectedOrder]);

  const toggleAreaChip = (chip: string) => {
    setSelectedAreas((prev) =>
      prev.includes(chip) ? prev.filter((item) => item !== chip) : [...prev, chip]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    setUploadedPhotos((prev) => [...prev, ...names].slice(0, 4));
  };

  const handlePrimaryReorder = () => {
    if (!selectedOrder) return;
    if (reorderMode === "reuse_exact") {
      const config = createDefaultConfiguration(selectedOrder.productSlug);
      addToCart(config, 1);
      setReorderBanner(
        `${selectedOrder.productName} (${selectedOrder.fabricSummary}) added to your cart with saved measurements.`
      );
      setTimeout(() => {
        router.push("/cart");
      }, 900);
      return;
    }
    if (reorderMode === "update_measurements") {
      loadProductIntoStudio(selectedOrder.productSlug);
      router.push(`/measurements?product=${selectedOrder.productSlug}`);
      return;
    }
    loadProductIntoStudio(selectedOrder.productSlug);
    router.push(`/customize?product=${selectedOrder.productSlug}`);
  };

  const handleOpenInStudio = () => {
    if (!selectedOrder) return;
    loadProductIntoStudio(selectedOrder.productSlug);
    router.push(`/customize?product=${selectedOrder.productSlug}`);
  };

  const handleAlterationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alterationTargetOrder) return;

    const created = submitAlterationRequest({
      orderId: alterationTargetOrder.id,
      orderNumber: alterationTargetOrder.orderNumber,
      garmentName: `${alterationTargetOrder.productName} (${alterationTargetOrder.colorName})`,
      vendorName: alterationTargetOrder.vendorName,
      requestedAreas:
        selectedAreas.length > 0 ? selectedAreas : ["Length adjustment (-2 cm)"],
      fitAdjustmentNotes: requirementNotes,
      preferredResolution:
        contactMethod === "phone" ? "Virtual Fit Consultation" : "Home Pickup & Return",
      pickupAddressId: addresses[0]?.id || "addr-home",
    });

    setSubmittedRequestNumber(created.requestNumber);
  };

  if (!selectedOrder) return null;

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#1c1a17]">
      <Header activeNav="account" />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-14 lg:py-12">
        {/* Page Header (Figma 25:31271) */}
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
            <span className="font-medium text-[#1c1a17]">Reorder &amp; Alteration</span>
          </nav>

          <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
            AFTER DELIVERY / {selectedOrder.orderNumber}
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <h1 className="font-serif text-[32px] font-medium leading-[1.15] text-[#1c1a17] sm:text-[38px]">
                The next chapter of your design
              </h1>
              <p className="mt-2 max-w-[640px] text-[14px] leading-[22px] text-[#6a6258]">
                Love the fit of a past piece? Reorder it in a new fabric, or ask your original
                tailor for a careful alteration.
              </p>
            </div>
            <Link
              href={`/orders/${selectedOrder.id}`}
              className="inline-flex h-[40px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
            >
              ← Back to Order {selectedOrder.orderNumber}
            </Link>
          </div>
        </section>

        {/* Section 01: Order This Design Again (Figma 25:31299) */}
        <section className="mt-9">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                01 / A FAVOURITE, REIMAGINED
              </p>
              <h2 className="mt-1 font-serif text-[28px] font-medium text-[#1c1a17]">
                Order This Design Again
              </h2>
            </div>
            <p className="text-[13px] text-[#6a6258]">
              Keep your saved pattern and measurements, or refresh the fabric and details.
            </p>
          </div>

          {reorderBanner && (
            <div className="mt-4 rounded-[4px] border border-[#2f5b3d]/30 bg-[#e6efe8] px-4 py-3 text-[13px] font-medium text-[#2f5b3d]">
              ✓ {reorderBanner}
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Left Delivered Design Card (Figma 25:31309) */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-5">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="relative h-[156px] w-full shrink-0 overflow-hidden rounded-[3px] bg-[#efe7dc] sm:w-[132px]">
                  <Image
                    src={selectedOrder.productImage}
                    alt={selectedOrder.productName}
                    fill
                    sizes="132px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="inline-flex w-fit items-center rounded-full bg-[#e6efe8] px-3 py-1 text-[11px] font-medium text-[#2f5b3d]">
                    Order {selectedOrder.orderNumber} · Delivered{" "}
                    {selectedOrder.deliveredDate || "28 Feb 2026"}
                  </span>
                  <h3 className="mt-2 font-serif text-[24px] font-medium text-[#1c1a17]">
                    {selectedOrder.productName}
                  </h3>
                  <p className="mt-1 text-[13px] text-[#6a6258]">
                    {selectedOrder.vendorName} · {selectedOrder.fabricSummary} ·{" "}
                    {selectedOrder.colorName}
                  </p>
                  <p className="mt-2 font-serif text-[20px] font-medium text-[#1c1a17]">
                    {formatInr(selectedOrder.totalInr)}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4 border-t border-[#e7dfd3] pt-5 text-[12px]">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                    SAVED SPECIFICATIONS
                  </p>
                  <p className="mt-1 text-[13px] leading-[20px] text-[#1c1a17]">
                    {selectedOrder.customDetailsSummary.join(" · ") ||
                      "Square Neckline · Elbow Puff Sleeves · Concealed Side Zip · Side Seam Pockets"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                    MEASUREMENT PROFILE
                  </p>
                  <p className="mt-1 text-[13px] leading-[20px] text-[#1c1a17]">
                    {selectedOrder.measurementProfileName} (Bust 88 cm · Waist 70 cm · Hip 96 cm ·
                    Dress Length 116 cm)
                  </p>
                </div>
              </div>
            </div>

            {/* Right Reorder Configuration Card (Figma 25:31336) */}
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-7">
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                CHOOSE YOUR REORDER PATH
              </p>
              <h3 className="mt-1 font-serif text-[22px] font-medium text-[#1c1a17]">
                How would you like to reorder?
              </h3>

              <div className="mt-4 space-y-3">
                {[
                  {
                    id: "reuse_exact" as ReorderMode,
                    title: "Reuse Previous Design",
                    description: `Keep the exact fabric, colour, details, and measurements from Order ${selectedOrder.orderNumber}.`,
                    badge: "Fastest Checkout",
                  },
                  {
                    id: "update_fabric" as ReorderMode,
                    title: "Update Fabric / Colour",
                    description:
                      "Keep the silhouette and fit, but explore Terracotta, Ivory, or Olive Linen.",
                  },
                  {
                    id: "update_measurements" as ReorderMode,
                    title: "Update Measurements",
                    description:
                      "Switch to a newer measurement profile or adjust specific body dimensions.",
                  },
                  {
                    id: "customize_again" as ReorderMode,
                    title: "Customize Again",
                    description:
                      "Open this base garment in the Customization Studio to tweak neckline or sleeves.",
                  },
                ].map((opt) => {
                  const active = reorderMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setReorderMode(opt.id)}
                      className={`flex w-full items-start justify-between gap-4 rounded-[4px] border p-4 text-left transition ${
                        active
                          ? "border-[#1c1a17] bg-[#f4ebdd]"
                          : "border-[#d8cec1] bg-[#fbf8f3] hover:border-[#b69a68]"
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                            active ? "border-[#1c1a17] bg-[#1c1a17]" : "border-[#9a8f80]"
                          }`}
                        >
                          {active && <span className="h-1.5 w-1.5 rounded-full bg-[#fbf8f3]" />}
                        </span>
                        <div>
                          <span className="block text-[14px] font-medium text-[#1c1a17]">
                            {opt.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-[19px] text-[#6a6258]">
                            {opt.description}
                          </span>
                        </div>
                      </div>
                      {opt.badge && (
                        <span className="shrink-0 rounded-full bg-[#ede3d4] px-2.5 py-1 text-[11px] font-medium text-[#5c5347]">
                          {opt.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#e7dfd3] pt-5">
                <p className="text-[12px] text-[#6a6258]">
                  Estimated production: <strong className="text-[#1c1a17]">7–9 days</strong> · Free
                  shipping
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={handleOpenInStudio}
                    className="inline-flex h-[42px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-5 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    Open in Studio
                  </button>
                  <button
                    type="button"
                    onClick={handlePrimaryReorder}
                    className="inline-flex h-[42px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                  >
                    Reorder This Design
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Need an Adjustment? (Figma 25:31384) */}
        <section id="alteration-form" className="mt-12 border-t border-[#d8cec1] pt-10">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                02 / REFINE WHAT YOU ALREADY OWN
              </p>
              <h2 className="mt-1 font-serif text-[28px] font-medium text-[#1c1a17]">
                Need an Adjustment?
              </h2>
            </div>
            <p className="text-[13px] text-[#6a6258]">
              Complimentary minor fit adjustments within 14 days of delivery.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-7 lg:grid-cols-12">
            {/* Left Alteration Form Card (Figma 25:31394) */}
            <form
              onSubmit={handleAlterationSubmit}
              className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7 lg:col-span-7"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    SELECT GARMENT
                  </label>
                  <select
                    value={selectedOrderIdForAlteration}
                    onChange={(e) => setSelectedOrderIdForAlteration(e.target.value)}
                    className="mt-1.5 h-[42px] w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-3 text-[13px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                  >
                    {orders.map((ord) => (
                      <option key={ord.id} value={ord.id}>
                        Order {ord.orderNumber} — {ord.productName} ({ord.colorName})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    TYPE OF ALTERATION
                  </label>
                  <select
                    value={alterationType}
                    onChange={(e) => setAlterationType(e.target.value)}
                    className="mt-1.5 h-[42px] w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-3 text-[13px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                  >
                    <option value="Minor Fit & Length Refinement (Complimentary)">
                      Minor Fit &amp; Length Refinement (Complimentary)
                    </option>
                    <option value="Waist & Bodice Tapering (Complimentary)">
                      Waist &amp; Bodice Tapering (Complimentary)
                    </option>
                    <option value="Sleeve & Shoulder Drape Adjustment">
                      Sleeve &amp; Shoulder Drape Adjustment
                    </option>
                  </select>
                </div>
              </div>

              {/* Alteration Area Chips */}
              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  WHAT WOULD YOU LIKE ADJUSTED? (SELECT ALL THAT APPLY)
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {ALTERATION_CHIPS.map((chip) => {
                    const selected = selectedAreas.includes(chip);
                    return (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => toggleAreaChip(chip)}
                        className={`rounded-full px-3.5 py-2 text-[12px] font-medium transition ${
                          selected
                            ? "bg-[#1c1a17] text-[#fbf8f3]"
                            : "border border-[#d8cec1] bg-[#f8f3eb] text-[#6a6258] hover:border-[#1c1a17] hover:text-[#1c1a17]"
                        }`}
                      >
                        {chip}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Requirement Description */}
              <div className="mt-5">
                <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  DESCRIBE YOUR REQUIREMENT
                </label>
                <textarea
                  rows={3}
                  value={requirementNotes}
                  onChange={(e) => setRequirementNotes(e.target.value)}
                  className="mt-1.5 w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] p-3 text-[13px] leading-[20px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                />
              </div>

              {/* Upload Reference Images */}
              <div className="mt-5">
                <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                  UPLOAD REFERENCE IMAGES (OPTIONAL)
                </p>
                <div className="mt-1.5 flex flex-col justify-between gap-3 rounded-[4px] border border-dashed border-[#c8bba8] bg-[#f8f3eb] p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-[13px] font-medium text-[#1c1a17]">
                      Drop fit photos or pinned garment references here
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#6a6258]">
                      JPG or PNG up to 10 MB · Helps the tailor see exact drape and pinning
                    </p>
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {uploadedPhotos.map((file) => (
                          <span
                            key={file}
                            className="inline-flex items-center gap-1.5 rounded bg-[#ede3d4] px-2.5 py-1 text-[11px] text-[#1c1a17]"
                          >
                            📎 {file}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <label className="inline-flex h-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] hover:border-[#1c1a17]">
                    Choose Files
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

              {/* Preferred Contact + Submit */}
              <div className="mt-6 flex flex-col justify-between gap-4 border-t border-[#e7dfd3] pt-5 sm:flex-row sm:items-center">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    PREFERRED CONTACT METHOD
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => setContactMethod("email")}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                        contactMethod === "email"
                          ? "bg-[#1c1a17] text-[#fbf8f3]"
                          : "border border-[#d8cec1] text-[#6a6258]"
                      }`}
                    >
                      Email update (aarav@email.com)
                    </button>
                    <button
                      type="button"
                      onClick={() => setContactMethod("phone")}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                        contactMethod === "phone"
                          ? "bg-[#1c1a17] text-[#fbf8f3]"
                          : "border border-[#d8cec1] text-[#6a6258]"
                      }`}
                    >
                      Phone call with tailor
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex h-[44px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[13px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                >
                  Submit Alteration Request
                </button>
              </div>
            </form>

            {/* Right Summary + Confirmation Card (Figma 25:31454) */}
            <aside className="space-y-5 lg:col-span-5">
              <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6">
                <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                  ALTERATION REQUEST SUMMARY
                </p>
                <h3 className="mt-1 font-serif text-[22px] font-medium text-[#1c1a17]">
                  Request overview
                </h3>

                <div className="mt-4 space-y-2.5 text-[12px]">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6a6258]">Garment</span>
                    <span className="text-right font-medium text-[#1c1a17]">
                      {alterationTargetOrder.productName} · {alterationTargetOrder.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6a6258]">Original Tailor</span>
                    <span className="text-right font-medium text-[#1c1a17]">
                      {alterationTargetOrder.vendorName}, {alterationTargetOrder.vendorLocation}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6a6258]">Selected Adjustments</span>
                    <span className="text-right font-medium text-[#1c1a17]">
                      {selectedAreas.join(" · ") || "Length (-2 cm) · Waist (-1.5 cm)"}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6a6258]">Pickup &amp; Return</span>
                    <span className="text-right font-medium text-[#1c1a17]">
                      Free Doorstep Pickup (Indiranagar)
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#6a6258]">Estimated Turnaround</span>
                    <span className="text-right font-medium text-[#1c1a17]">
                      4–5 Business Days
                    </span>
                  </div>
                  <div className="flex justify-between gap-4 border-t border-[#e7dfd3] pt-2.5">
                    <span className="font-medium text-[#1c1a17]">Alteration Fee</span>
                    <span className="font-medium text-[#2f5b3d]">
                      Complimentary (1st Fit Care)
                    </span>
                  </div>
                </div>
              </div>

              {/* Confirmation Preview Card (Figma 25:31484) */}
              <div
                className={`rounded-[4px] border p-6 transition ${
                  submittedRequestNumber
                    ? "border-[#2f5b3d] bg-[#e6efe8]"
                    : "border-[#d8cec1] bg-[#ede3d4]"
                }`}
              >
                <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#2f5b3d]">
                  {submittedRequestNumber
                    ? `CONFIRMED · REQUEST ${submittedRequestNumber}`
                    : "AFTER SUBMISSION"}
                </p>
                <h3 className="mt-1 font-serif text-[22px] font-medium text-[#1c1a17]">
                  Your request is with the tailor
                </h3>
                <p className="mt-1.5 text-[12px] leading-[19px] text-[#5c5347]">
                  Request{" "}
                  <strong className="text-[#1c1a17]">
                    {submittedRequestNumber ||
                      alterationRequests[0]?.requestNumber ||
                      "#ALT-209"}
                  </strong>{" "}
                  created. {alterationTargetOrder.vendorName} will review your notes and confirm
                  doorstep pickup within 24 hours.
                </p>
                <p className="mt-3 text-[12px] font-medium text-[#1c1a17]">
                   Also update my saved profile “{alterationTargetOrder.measurementProfileName}”
                  with these adjustments
                </p>
                <Link
                  href={`/orders/${alterationTargetOrder.id}`}
                  className="mt-4 inline-flex h-[38px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                >
                  View Request Status
                </Link>
              </div>
            </aside>
          </div>
        </section>

        {/* Post-Purchase Care States (Figma 25:31495) */}
        <section className="mt-12 border-t border-[#d8cec1] pt-10">
          <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
            POST-PURCHASE CARE STATES · REORDER &amp; ALTERATION LIFECYCLE
          </p>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7b5d2e]">
                REORDER READY
              </p>
              <h3 className="mt-1.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                Saved Pattern Loaded in Cart
              </h3>
              <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                Your previous customization and measurement profile are pre-attached for 1-click
                checkout.
              </p>
            </div>

            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7b5d2e]">
                ALTERATION SUBMITTED
              </p>
              <h3 className="mt-1.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                Pickup Scheduled · Tomorrow
              </h3>
              <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                Courier partner will collect your garment between 10 AM – 1 PM in a reusable
                garment bag.
              </p>
            </div>

            <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
              <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#2f5b3d]">
                ALTERATION COMPLETED
              </p>
              <h3 className="mt-1.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                Refined &amp; Dispatched Back
              </h3>
              <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                Hem shortened by 2 cm and steamed at Studio Mira. Your saved profile has been
                updated.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
