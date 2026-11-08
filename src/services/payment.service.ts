export interface CreateRazorpayOrderPayload {
  amountInr: number;
  currency?: "INR";
  receipt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: Record<string, string>;
}

export interface CreateRazorpayOrderResponse {
  success: boolean;
  razorpayOrderId: string;
  amountPaise: number;
  currency: "INR";
  keyId: string;
  receipt: string;
  mode: "live-razorpay" | "simulated-server-order";
}

export interface VerifyRazorpayPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  internalOrderId: string;
}

export interface VerifyRazorpayPaymentResponse {
  verified: boolean;
  paymentStatus: "Paid" | "Failed";
  razorpayOrderId: string;
  razorpayPaymentId: string;
  verifiedAt: string;
  message: string;
}

export async function createServerPaymentOrder(
  payload: CreateRazorpayOrderPayload
): Promise<CreateRazorpayOrderResponse> {
  const response = await fetch("/api/payments/razorpay/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Failed to create order" }));
    throw new Error(err.error || "Unable to initialize Razorpay payment order");
  }

  return response.json();
}

export async function verifyServerPaymentSignature(
  payload: VerifyRazorpayPaymentPayload
): Promise<VerifyRazorpayPaymentResponse> {
  const response = await fetch("/api/payments/razorpay/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: "Verification failed" }));
    throw new Error(err.message || "Payment signature verification failed");
  }

  return response.json();
}
