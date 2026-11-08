import { z } from "zod";

export const manualMeasurementSchema = z
  .object({
    profileName: z.string().min(2, "Please provide a profile name (e.g. Everyday Linen Fit)."),
    forPerson: z.string().min(1, "Please specify who this profile is for."),
    genderFit: z.enum(["Men", "Women", "Unisex"]),
    unit: z.enum(["cm", "in"]),
    fitPreference: z.enum(["Tailored / Sculpted", "Regular / Classic", "Relaxed / Easy"]),
    chest: z.number({ invalid_type_error: "Enter a valid number" }),
    waist: z.number({ invalid_type_error: "Enter a valid number" }),
    seatHips: z.number({ invalid_type_error: "Enter a valid number" }),
    shoulderWidth: z.number({ invalid_type_error: "Enter a valid number" }),
    sleeveLength: z.number({ invalid_type_error: "Enter a valid number" }),
    garmentLength: z.number({ invalid_type_error: "Enter a valid number" }),
    neckCircumference: z.number({ invalid_type_error: "Enter a valid number" }),
    wristCircumference: z.number({ invalid_type_error: "Enter a valid number" }),
    postureNotes: z.string().max(500).optional(),
  })
  .superRefine((data, ctx) => {
    const isCm = data.unit === "cm";
    const ranges: Record<string, [number, number, string]> = isCm
      ? {
          chest: [70, 160, "Chest must be between 70 cm and 160 cm"],
          waist: [55, 155, "Waist must be between 55 cm and 155 cm"],
          seatHips: [70, 165, "Seat / Hips must be between 70 cm and 165 cm"],
          shoulderWidth: [34, 62, "Shoulder width must be between 34 cm and 62 cm"],
          sleeveLength: [48, 78, "Sleeve length must be between 48 cm and 78 cm"],
          garmentLength: [52, 125, "Garment length must be between 52 cm and 125 cm"],
          neckCircumference: [30, 56, "Neck circumference must be between 30 cm and 56 cm"],
          wristCircumference: [13, 26, "Wrist circumference must be between 13 cm and 26 cm"],
        }
      : {
          chest: [27.5, 63, "Chest must be between 27.5 in and 63 in"],
          waist: [21.5, 61, "Waist must be between 21.5 in and 61 in"],
          seatHips: [27.5, 65, "Seat / Hips must be between 27.5 in and 65 in"],
          shoulderWidth: [13.4, 24.5, "Shoulder width must be between 13.4 in and 24.5 in"],
          sleeveLength: [18.9, 30.7, "Sleeve length must be between 18.9 in and 30.7 in"],
          garmentLength: [20.5, 49.2, "Garment length must be between 20.5 in and 49.2 in"],
          neckCircumference: [11.8, 22, "Neck circumference must be between 11.8 in and 22 in"],
          wristCircumference: [5.1, 10.2, "Wrist circumference must be between 5.1 in and 10.2 in"],
        };

    for (const [key, [min, max, msg]] of Object.entries(ranges)) {
      const val = data[key as keyof typeof data] as number;
      if (typeof val !== "number" || Number.isNaN(val) || val < min || val > max) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [key],
          message: msg,
        });
      }
    }
  });

export const addressSchema = z.object({
  label: z.enum(["Home", "Work", "Atelier Pickup", "Other"]),
  recipientName: z.string().min(2, "Recipient name is required"),
  phone: z
    .string()
    .regex(/^(\+91[\-\s]?)?[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  line1: z.string().min(5, "Street / building address is required"),
  line2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  country: z.string().default("India"),
  isDefault: z.boolean().default(false),
});

export const razorpayCreateOrderSchema = z.object({
  amountInr: z.number().int().positive("Order amount must be positive"),
  currency: z.literal("INR").default("INR"),
  idempotencyKey: z.string().min(8, "Idempotency key is required"),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10),
  shippingAddressId: z.string().min(1),
  paymentMethod: z.enum(["upi", "card"]),
  itemsCount: z.number().int().min(1),
});

export const razorpayVerifySchema = z.object({
  razorpay_order_id: z.string().min(1, "Missing razorpay_order_id"),
  razorpay_payment_id: z.string().min(1, "Missing razorpay_payment_id"),
  razorpay_signature: z.string().min(1, "Missing razorpay_signature"),
  internalOrderId: z.string().min(1, "Missing internalOrderId"),
});

export const alterationRequestSchema = z.object({
  orderId: z.string().min(1, "Please select an eligible delivered order"),
  requestedAreas: z.array(z.string()).min(1, "Select at least one garment area to adjust"),
  fitAdjustmentNotes: z
    .string()
    .min(15, "Please describe the fit adjustment in at least 15 characters"),
  preferredResolution: z.enum([
    "Atelier Alteration",
    "Home Pickup & Return",
    "Virtual Fit Consultation",
  ]),
  pickupAddressId: z.string().min(1, "Please select a pickup address"),
});

export const reviewSubmissionSchema = z.object({
  orderId: z.string().min(1),
  type: z.enum(["product", "vendor"]),
  targetId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  fitAccuracyRating: z.number().int().min(1).max(5).optional(),
  craftsmanshipRating: z.number().int().min(1).max(5).optional(),
  title: z.string().min(4, "Please provide a brief headline for your review"),
  comment: z.string().min(20, "Please share at least 20 characters about your experience"),
});

export const supportTicketSchema = z.object({
  category: z.string().min(2, "Please select an issue category"),
  orderNumber: z.string().optional(),
  subject: z.string().min(5, "Please enter a brief subject"),
  description: z.string().min(20, "Please provide details so our team can assist you"),
});
