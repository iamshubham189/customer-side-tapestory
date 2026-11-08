# API & Service Layer Documentation — Tapestory Customer Website

## 1. Server-Side Next.js API Route Handlers

### A. `POST /api/payments/razorpay/create-order`
Creates a Razorpay payment order on the server using `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (or deterministic simulated mode when keys are not configured).

**Request Body:**
```json
{
  "amountInr": 4749,
  "currency": "INR",
  "receipt": "rcpt_ts_1731072000",
  "notes": {
    "customerEmail": "aarav.mehta@email.com",
    "itemCount": "1"
  }
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "order": {
    "id": "order_TapestorySim98123",
    "entity": "order",
    "amount": 474900,
    "amount_paid": 0,
    "amount_due": 474900,
    "currency": "INR",
    "receipt": "rcpt_ts_1731072000",
    "status": "created"
  },
  "keyId": "rzp_test_tapestory_demo",
  "mode": "simulated"
}
```

---

### B. `POST /api/payments/razorpay/verify`
Verifies the Razorpay payment signature using HMAC-SHA256 (`order_id + "|" + payment_id`) and prevents duplicate `paymentId` replay attacks.

**Request Body:**
```json
{
  "razorpay_order_id": "order_TapestorySim98123",
  "razorpay_payment_id": "pay_TapestorySim45190",
  "razorpay_signature": "simulated_valid_signature"
}
```

**Response (`200 OK`):**
```json
{
  "verified": true,
  "orderId": "order_TapestorySim98123",
  "paymentId": "pay_TapestorySim45190",
  "verifiedAt": "2026-11-08T14:00:00.000Z"
}
```

---

### C. `POST /api/payments/razorpay/webhook`
Receives asynchronous Razorpay webhook events (`payment.captured`, `payment.failed`, `refund.processed`), validates the `x-razorpay-signature` header against `RAZORPAY_WEBHOOK_SECRET`, and ensures idempotency via `x-razorpay-event-id`.

---

## 2. Domain Service Layer (`src/services/`)

| Service File | Exported Functions |
| :--- | :--- |
| `product.service.ts` | `getAllProducts()`, `getProductBySlug(slug)`, `filterProducts(params)`, `getFeaturedProducts()`, `getSimilarProducts(productId)` |
| `vendor.service.ts` | `getAllVendors()`, `getVendorBySlug(slug)`, `getVendorProducts(vendorId)` |
| `customization.service.ts` | `createDefaultConfiguration(productSlug)`, `calculateEstimatedPrice(config)` |
| `measurement.service.ts` | `convertCmToIn(cm)`, `convertInToCm(inches)`, `validateMeasurements(values, unit)` |
| `order.service.ts` | `getAllOrders()`, `getOrderByIdOrNumber(id)` |
| `payment.service.ts` | `initiateRazorpayOrder(payload)`, `verifyRazorpayPayment(payload)` |
| `account.service.ts` | `DEFAULT_CUSTOMER_PROFILE`, `formatAddressLine(address)` |
