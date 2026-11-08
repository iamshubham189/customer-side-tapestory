"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FIGMA_ASSETS } from "@/config/assets";
import {
  createServerPaymentOrder,
  verifyServerPaymentSignature,
} from "@/services/payment.service";
import { useTapestory } from "@/features/store-provider";
import { formatInr } from "@/lib/utils/format";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  ButtonPrimary,
  ButtonSecondary,
} from "@/components/common/Button";
import { SectionHeading } from "@/components/common/SectionHeading";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    user,
    cart,
    activeConfiguration,
    couponCode,
    couponDiscountInr,
    addresses,
    saveAddress,
    createConfirmedOrder,
  } = useTapestory();

  const effectiveItems =
    cart.length > 0
      ? cart
      : [
          {
            id: "checkout-direct",
            configuration: activeConfiguration,
            quantity: 1,
            addedAt: new Date().toISOString(),
          },
        ];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? ""
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home" as "Home" | "Work" | "Atelier Pickup" | "Other",
    recipientName: user?.fullName ?? "Ananya Rao",
    phone: user?.phone ?? "+91 98765 43210",
    line1: "",
    line2: "",
    city: "New Delhi",
    state: "Delhi",
    postalCode: "110003",
  });

  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "Card"
  >("UPI");
  const [upiId, setUpiId] = useState<string>("ananya@okicici");
  const [cardLast4, setCardLast4] = useState<string>("4821");

  const [paymentState, setPaymentState] = useState<
    "idle" | "creating-order" | "awaiting-gateway" | "verifying" | "failed"
  >("idle");
  const [paymentErrorMessage, setPaymentErrorMessage] = useState<string | null>(
    null
  );
  const [razorpayModalOrder, setRazorpayModalOrder] = useState<{
    razorpayOrderId: string;
    amountPaise: number;
    keyId: string;
    mode: string;
  } | null>(null);

  const subtotalInr = effectiveItems.reduce(
    (sum, item) =>
      sum + item.configuration.totalEstimatedPriceInr * item.quantity,
    0
  );
  const totalPayableInr = Math.max(999, subtotalInr - couponDiscountInr);

  const selectedAddress =
    addresses.find((a) => a.id === selectedAddressId) ?? addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.line1.trim()) return;
    const created = saveAddress({
      ...newAddress,
      country: "India",
      isDefault: false,
    });
    setSelectedAddressId(created.id);
    setShowNewAddressForm(false);
  };

  // Step 1: Call Server API (/api/payments/razorpay/create-order)
  const handleInitiateRazorpayPayment = async () => {
    try {
      setPaymentErrorMessage(null);
      setPaymentState("creating-order");

      const serverOrder = await createServerPaymentOrder({
        amountInr: totalPayableInr,
        currency: "INR",
        receipt: `tap_rcpt_${Date.now()}`,
        customerName: selectedAddress.recipientName,
        customerEmail: user?.email ?? "ananya.rao@example.com",
        customerPhone: selectedAddress.phone,
        notes: {
          garment: effectiveItems[0].configuration.productName,
          atelier: effectiveItems[0].configuration.vendorName,
        },
      });

      setRazorpayModalOrder({
        razorpayOrderId: serverOrder.razorpayOrderId,
        amountPaise: serverOrder.amountPaise,
        keyId: serverOrder.keyId,
        mode: serverOrder.mode,
      });
      setPaymentState("awaiting-gateway");
    } catch (err) {
      setPaymentState("failed");
      setPaymentErrorMessage(
        err instanceof Error
          ? err.message
          : "Could not initialize Razorpay order."
      );
    }
  };

  // Step 2: Verify Signature on Server (/api/payments/razorpay/verify) & Persist Order
  const handleCompleteGatewayAuthorization = async (simulateFailure = false) => {
    if (!razorpayModalOrder) return;

    if (simulateFailure) {
      setRazorpayModalOrder(null);
      setPaymentState("failed");
      setPaymentErrorMessage(
        "Payment authorization was declined or cancelled in Razorpay Checkout. Your bag has been preserved—you may retry securely."
      );
      return;
    }

    try {
      setPaymentState("verifying");
      const generatedPaymentId = `pay_Tap${Date.now().toString().slice(-8)}`;

      const verifyRes = await verifyServerPaymentSignature({
        razorpay_order_id: razorpayModalOrder.razorpayOrderId,
        razorpay_payment_id: generatedPaymentId,
        razorpay_signature: "tapestory_verified_sandbox_sig",
        internalOrderId: `TS-${Date.now()}`,
      });

      if (!verifyRes.verified) {
        throw new Error(verifyRes.message || "Signature verification failed");
      }

      const methodLabel =
        paymentMethod === "UPI"
          ? `Razorpay UPI (${upiId})`
          : `Razorpay Card (•••• ${cardLast4})`;

      const createdOrders = createConfirmedOrder({
        shippingAddress: selectedAddress,
        paymentMethod: methodLabel,
        razorpayOrderId: verifyRes.razorpayOrderId,
        razorpayPaymentId: verifyRes.razorpayPaymentId,
      });

      setRazorpayModalOrder(null);
      router.push(
        `/checkout/confirmation?order=${createdOrders[0]?.id ?? "TS-1068"}`
      );
    } catch (err) {
      setRazorpayModalOrder(null);
      setPaymentState("failed");
      setPaymentErrorMessage(
        err instanceof Error ? err.message : "Payment verification failed."
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#f5f0e7] w-full">
      <Header />

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-[36px] lg:py-[56px]">
        {/* Page Header (Flow 05 K04–K08) */}
        <div className="flex flex-col gap-[16px]">
          <p className="font-sans text-[12px] text-[#29251f]">
            Home &nbsp;/&nbsp; Shopping Bag &nbsp;/&nbsp; Checkout
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-[10px]">
              <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
                FLOW 05 · SECURE BESPOKE CHECKOUT / K04–K08
              </p>
              <h1 className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
                Shipping &amp; Payment
              </h1>
            </div>
            <p className="font-serif italic text-[18px] text-[#b69a68]">
              Verified server-side via Razorpay (INR ₹)
            </p>
          </div>
        </div>

        {paymentState === "failed" && paymentErrorMessage && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#f5f0e7] border-2 border-[#29251f] p-6">
            <div className="flex items-start gap-4">
              <span className="text-[22px] text-[#172b24]">!</span>
              <div>
                <p className="font-sans text-[16px] font-medium text-[#172b24]">
                  Payment Could Not Be Completed (K08 Recovery State)
                </p>
                <p className="font-sans text-[13px] text-[#29251f] mt-1">
                  {paymentErrorMessage}
                </p>
              </div>
            </div>
            <ButtonPrimary
              label="Retry Razorpay Checkout"
              onClick={handleInitiateRazorpayPayment}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row items-start gap-8 lg:gap-[40px] w-full">
          {/* Left Column: Shipping Address (K04), Delivery Estimate (K05) & Payment Options (K06) */}
          <div className="flex flex-1 flex-col gap-[32px] w-full">
            {/* K04: Shipping Address Selection */}
            <section className="flex flex-col gap-[20px] bg-white border border-[#e9e0d3] p-6 sm:p-[32px]">
              <div className="flex items-center justify-between">
                <SectionHeading
                  eyebrow="01 / SHIPPING ADDRESS (K04)"
                  title="Where should we deliver?"
                />
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm((s) => !s)}
                  className="text-[12px] text-[#172b24] underline underline-offset-4 cursor-pointer"
                >
                  {showNewAddressForm ? "Cancel" : "+ Add New Address"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => {
                  const isSelected = addr.id === selectedAddress.id;
                  return (
                    <button
                      key={addr.id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`flex flex-col gap-2 p-5 text-left transition-colors cursor-pointer ${
                        isSelected
                          ? "border-2 border-[#172b24] bg-[#f5f0e7]/50"
                          : "border border-[#e9e0d3] hover:border-[#b69a68]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="bg-[#e9e0d3] px-2.5 py-0.5 text-[10px] tracking-[0.8px] text-[#172b24] uppercase">
                          {addr.label}
                        </span>
                        <span className="text-[12px] text-[#172b24]">
                          {isSelected ? "✓ Selected" : "Select"}
                        </span>
                      </div>
                      <p className="font-sans text-[14px] font-medium text-black mt-1">
                        {addr.recipientName}
                      </p>
                      <p className="font-sans text-[12px] leading-[1.6] text-[#29251f]">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                        <br />
                        {addr.city}, {addr.state} — {addr.postalCode}
                      </p>
                      <p className="font-sans text-[12px] text-[#706a60]">
                        Phone: {addr.phone}
                      </p>
                    </button>
                  );
                })}
              </div>

              {showNewAddressForm && (
                <form
                  onSubmit={handleSaveNewAddress}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#e9e0d3] pt-5"
                >
                  <input
                    type="text"
                    required
                    placeholder="Recipient full name"
                    value={newAddress.recipientName}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        recipientName: e.target.value,
                      }))
                    }
                    className="h-[48px] border border-[#e9e0d3] px-3 text-[13px]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Phone (+91)"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="h-[48px] border border-[#e9e0d3] px-3 text-[13px]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Street address, house / flat number"
                    value={newAddress.line1}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, line1: e.target.value }))
                    }
                    className="sm:col-span-2 h-[48px] border border-[#e9e0d3] px-3 text-[13px]"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={(e) =>
                      setNewAddress((p) => ({ ...p, city: e.target.value }))
                    }
                    className="h-[48px] border border-[#e9e0d3] px-3 text-[13px]"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress((p) => ({
                        ...p,
                        postalCode: e.target.value,
                      }))
                    }
                    className="h-[48px] border border-[#e9e0d3] px-3 text-[13px]"
                  />
                  <div className="sm:col-span-2">
                    <ButtonPrimary label="Save & Use Address" type="submit" />
                  </div>
                </form>
              )}
            </section>

            {/* K05: Production & Delivery Schedule */}
            <section className="flex flex-col gap-[16px] bg-[#e9e0d3] p-6 sm:p-[28px]">
              <p className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]">
                02 / TAILORING &amp; DELIVERY SCHEDULE (K05)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#f5f0e7] p-4">
                  <p className="text-[11px] text-[#706a60]">PATTERN &amp; CUTTING</p>
                  <p className="font-serif text-[20px] text-[#172b24] mt-1">
                    Days 1–4
                  </p>
                  <p className="text-[12px] text-[#29251f] mt-1">
                    Individual paper pattern drafted to your profile.
                  </p>
                </div>
                <div className="bg-[#f5f0e7] p-4">
                  <p className="text-[11px] text-[#706a60]">
                    HAND TAILORING &amp; QC
                  </p>
                  <p className="font-serif text-[20px] text-[#172b24] mt-1">
                    Days 5–10
                  </p>
                  <p className="text-[12px] text-[#29251f] mt-1">
                    Stitching, horn buttons &amp; 18-point verification.
                  </p>
                </div>
                <div className="bg-[#f5f0e7] p-4">
                  <p className="text-[11px] text-[#706a60]">INSURED DELIVERY</p>
                  <p className="font-serif text-[20px] text-[#172b24] mt-1">
                    By 20 Nov 2026
                  </p>
                  <p className="text-[12px] text-[#29251f] mt-1">
                    Dispatched to {selectedAddress.city} via BlueDart Priority.
                  </p>
                </div>
              </div>
            </section>

            {/* K06 & K07: Payment Options & Razorpay Integration */}
            <section className="flex flex-col gap-[20px] bg-white border border-[#e9e0d3] p-6 sm:p-[32px]">
              <SectionHeading
                eyebrow="03 / PAYMENT METHOD · RAZORPAY INDIA (K06)"
                title="Select how you would like to pay"
              />
              <p className="font-sans text-[13px] text-[#706a60]">
                All transactions are processed in Indian Rupees (INR ₹) via
                Razorpay with server-side HMAC SHA256 signature verification.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("UPI")}
                  className={`flex flex-col gap-2 p-5 text-left cursor-pointer ${
                    paymentMethod === "UPI"
                      ? "border-2 border-[#172b24] bg-[#f5f0e7]/50"
                      : "border border-[#e9e0d3]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      UPI (Google Pay, PhonePe, BHIM)
                    </span>
                    <span className="text-[12px] text-[#172b24]">
                      {paymentMethod === "UPI" ? "✓ Active" : ""}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#706a60]">
                    Instant zero-fee verification using any UPI app or VPA.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("Card")}
                  className={`flex flex-col gap-2 p-5 text-left cursor-pointer ${
                    paymentMethod === "Card"
                      ? "border-2 border-[#172b24] bg-[#f5f0e7]/50"
                      : "border border-[#e9e0d3]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-[14px] font-medium text-[#172b24]">
                      Credit / Debit Card (Visa, Mastercard, RuPay)
                    </span>
                    <span className="text-[12px] text-[#172b24]">
                      {paymentMethod === "Card" ? "✓ Active" : ""}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#706a60]">
                    RBI-compliant tokenized card checkout via Razorpay.
                  </p>
                </button>
              </div>

              {paymentMethod === "UPI" ? (
                <div className="flex flex-col gap-2 pt-2">
                  <label
                    htmlFor="checkout-upi-id"
                    className="text-[12px] text-[#29251f]"
                  >
                    UPI ID / VPA
                  </label>
                  <input
                    id="checkout-upi-id"
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="h-[52px] max-w-[360px] border border-[#e9e0d3] bg-[#f5f0e7] px-4 text-[14px] text-[#172b24]"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <label
                    htmlFor="checkout-card-last4"
                    className="text-[12px] text-[#29251f]"
                  >
                    Saved Card Ending In
                  </label>
                  <input
                    id="checkout-card-last4"
                    type="text"
                    maxLength={4}
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    className="h-[52px] max-w-[200px] border border-[#e9e0d3] bg-[#f5f0e7] px-4 text-[14px] text-[#172b24]"
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary & Pay Action */}
          <aside className="flex flex-col gap-[20px] w-full lg:w-[400px] shrink-0 bg-white border border-[#e9e0d3] p-[24px] lg:sticky lg:top-[124px]">
            <SectionHeading
              eyebrow="ORDER REVIEW"
              title="Your Custom Ticket"
            />

            <div className="flex flex-col gap-4 divide-y divide-[#e9e0d3]">
              {effectiveItems.map((item) => (
                <div key={item.id} className="flex gap-3 pt-3 first:pt-0">
                  <div className="relative h-[88px] w-[68px] shrink-0 bg-[#e9e0d3] overflow-hidden">
                    <img
                      alt={item.configuration.productName}
                      className="size-full object-cover"
                      src={item.configuration.productImage}
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 text-[12px]">
                    <p className="font-serif text-[18px] text-[#172b24]">
                      {item.configuration.productName}
                    </p>
                    <p className="text-[#706a60]">
                      {item.configuration.styleSilhouette.name} ·{" "}
                      {item.configuration.fabric.name} ·{" "}
                      {item.configuration.color.name}
                    </p>
                    <p className="text-[#172b24] font-medium">
                      {formatInr(
                        item.configuration.totalEstimatedPriceInr *
                          item.quantity
                      )}{" "}
                      (Qty {item.quantity})
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-[#e9e0d3]" />

            <div className="flex flex-col gap-2.5 text-[13px] text-[#29251f]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatInr(subtotalInr)}</span>
              </div>
              <div className="flex justify-between">
                <span>Insured Shipping</span>
                <span className="text-[#172b24]">Complimentary</span>
              </div>
              {couponDiscountInr > 0 && (
                <div className="flex justify-between text-[#172b24] font-medium">
                  <span>Privilege Discount ({couponCode})</span>
                  <span>− {formatInr(couponDiscountInr)}</span>
                </div>
              )}
              <div className="h-px w-full bg-[#e9e0d3] my-1" />
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-black">Total Payable</span>
                <span className="font-serif text-[32px] text-[#172b24]">
                  {formatInr(totalPayableInr)}
                </span>
              </div>
            </div>

            <ButtonPrimary
              label={
                paymentState === "creating-order"
                  ? "Creating Server Order…"
                  : paymentState === "verifying"
                  ? "Verifying Signature…"
                  : `Pay ${formatInr(totalPayableInr)} via Razorpay`
              }
              onClick={handleInitiateRazorpayPayment}
              disabled={
                paymentState === "creating-order" ||
                paymentState === "verifying"
              }
              fullWidth
            />
            <ButtonSecondary
              label="Return to Bag"
              href="/cart"
              fullWidth
            />
          </aside>
        </div>
      </main>

      {/* RAZORPAY CHECKOUT MODAL (K07) */}
      {razorpayModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="flex w-full max-w-[460px] flex-col bg-[#f5f0e7] border-2 border-[#172b24] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between bg-[#172b24] px-6 py-4 text-[#f5f0e7]">
              <div>
                <p className="font-sans text-[10px] tracking-[1.4px] text-[#b69a68]">
                  RAZORPAY SECURE CHECKOUT · INR
                </p>
                <p className="font-serif text-[22px]">Tapestory Bespoke</p>
              </div>
              <p className="font-serif text-[26px]">
                {formatInr(totalPayableInr)}
              </p>
            </div>

            <div className="flex flex-col gap-4 p-6">
              <div className="bg-[#e9e0d3] p-3.5 text-[12px] text-[#29251f]">
                <p>
                  <strong>Server Order ID:</strong>{" "}
                  {razorpayModalOrder.razorpayOrderId}
                </p>
                <p className="mt-1">
                  <strong>Method:</strong>{" "}
                  {paymentMethod === "UPI"
                    ? `UPI (${upiId})`
                    : `Card (•••• ${cardLast4})`}
                </p>
                <p className="mt-1 text-[11px] text-[#706a60]">
                  Signature will be verified on{" "}
                  <code>/api/payments/razorpay/verify</code> using HMAC SHA256.
                </p>
              </div>

              <ButtonPrimary
                label={`Authorize & Pay ${formatInr(totalPayableInr)}`}
                onClick={() => handleCompleteGatewayAuthorization(false)}
                fullWidth
              />
              <ButtonSecondary
                label="Simulate Payment Failure (Test K08 Recovery)"
                onClick={() => handleCompleteGatewayAuthorization(true)}
                fullWidth
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
