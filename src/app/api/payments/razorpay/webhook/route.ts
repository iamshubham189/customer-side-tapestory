import { NextResponse } from "next/server";
import crypto from "crypto";

const handledWebhookEventIds = new Set<string>();

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signatureHeader =
      request.headers.get("x-razorpay-signature") ?? "";
    const eventId =
      request.headers.get("x-razorpay-event-id") ?? `evt_${Date.now()}`;

    if (handledWebhookEventIds.has(eventId)) {
      return NextResponse.json({
        received: true,
        duplicate: true,
        eventId,
      });
    }

    const webhookSecret =
      process.env.RAZORPAY_WEBHOOK_SECRET || "tapestory_webhook_secret_2026";

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (
      process.env.RAZORPAY_WEBHOOK_SECRET &&
      signatureHeader !== expectedSignature
    ) {
      return NextResponse.json(
        { error: "Invalid Razorpay webhook signature" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(rawBody || "{}");
    handledWebhookEventIds.add(eventId);

    return NextResponse.json({
      received: true,
      eventId,
      event: payload.event ?? "payment.captured",
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook processing error",
      },
      { status: 500 }
    );
  }
}
