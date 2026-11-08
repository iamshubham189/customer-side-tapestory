"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import type {
  CategoryImageCardProps,
  CollectionCardProps,
  EditorialImageCardProps,
  FabricSwatchCardProps,
  FeatureBenefitItemProps,
  StepIndicatorProps,
  TestimonialCardProps,
  TrustIndicatorProps,
} from "./EditorialBlocks.types";

export function EditorialImageCard({
  story = "Craft",
  label = "THE ART OF YOUR EVERYDAY",
  edition = "Made for you.",
  statement = "Considered. Cut. Crafted.",
  supportingCaption = "The difference is in the details.",
  className,
}: EditorialImageCardProps) {
  const isCampaign = story === "Campaign";

  if (isCampaign) {
    return (
      <div
        className={
          className ||
          "relative flex flex-1 flex-col min-h-[360px] lg:h-full w-full overflow-hidden"
        }
        data-node-id="5:6996"
      >
        <img
          alt="Tapestory Tailors Campaign"
          className="absolute inset-0 size-full object-cover"
          src={FIGMA_ASSETS.images.heroCampaign}
        />
        <div
          className="absolute bottom-[24px] lg:bottom-[32px] left-[24px] lg:left-[32px] bg-[#f5f0e7] flex items-center gap-[24px] px-[16px] py-[12px] text-[#172b24]"
          data-node-id="5:6993"
        >
          <span className="font-sans text-[10px] tracking-[1.4px]">
            {label}
          </span>
          <span className="font-serif italic text-[16px]">{edition}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        className ||
        "relative flex flex-col h-[420px] sm:h-[560px] w-full lg:w-[526px] shrink-0 overflow-hidden"
      }
      data-node-id="5:6985"
    >
      <img
        alt="Tailoring craftsmanship detail"
        className="absolute inset-0 size-full object-cover"
        src={FIGMA_ASSETS.images.tailoringDetailCraft}
      />
      <div
        className="absolute bottom-[24px] left-[24px] bg-[#f5f0e7] flex flex-col gap-[8px] items-start p-[24px] w-[280px] sm:w-[320px]"
        data-node-id="5:6982"
      >
        <p className="font-serif italic text-[22px] sm:text-[24px] text-[#172b24]">
          {statement}
        </p>
        <p className="font-sans text-[11px] text-[#29251f]">
          {supportingCaption}
        </p>
      </div>
    </div>
  );
}

const COLLECTION_META = {
  "Formal Edit": {
    title: "Formal Edit",
    description: "Quiet confidence, perfectly cut.",
    image: FIGMA_ASSETS.images.collectionFormalEdit,
    href: "/products?occasion=Formal%20Edit",
    nodeId: "5:6917",
  },
  "Wedding Edit": {
    title: "Wedding Edit",
    description: "For your most memorable moments.",
    image: FIGMA_ASSETS.images.collectionWeddingEdit,
    href: "/products?occasion=Wedding%20Edit",
    nodeId: "5:6934",
  },
  "Everyday Essentials": {
    title: "Everyday Essentials",
    description: "Considered pieces, effortless living.",
    image: FIGMA_ASSETS.images.collectionEverydayEssentials,
    href: "/products?occasion=Everyday",
    nodeId: "5:6951",
  },
  "Fusion Wear": {
    title: "Fusion Wear",
    description: "Tradition, with a fresh perspective.",
    image: FIGMA_ASSETS.images.collectionFusionWear,
    href: "/products?occasion=Fusion%20Wear",
    nodeId: "5:6968",
  },
} as const;

export function CollectionCard({ collection, className }: CollectionCardProps) {
  const meta = COLLECTION_META[collection];
  return (
    <Link
      href={meta.href}
      className={
        className ||
        "group relative flex flex-col h-[300px] sm:h-[352px] w-full lg:w-[636px] overflow-hidden"
      }
      data-node-id={meta.nodeId}
    >
      <img
        alt={meta.title}
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        src={meta.image}
      />
      <div className="absolute bottom-[20px] sm:bottom-[24px] left-[20px] sm:left-[24px] right-[20px] sm:right-auto bg-[#172b24] flex items-center justify-between p-[20px] sm:p-[24px] sm:w-[392px]">
        <div className="flex flex-col gap-[8px] items-start text-[#f5f0e7]">
          <p className="font-serif text-[24px] sm:text-[28px] leading-none">
            {meta.title}
          </p>
          <p className="font-sans text-[11px]">{meta.description}</p>
        </div>
        <img
          alt=""
          className="size-[24px] shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          src={FIGMA_ASSETS.icons.arrowUpRightGold}
        />
      </div>
    </Link>
  );
}

const CATEGORY_META = {
  Men: {
    title: "Men",
    description: "Tailored for your every day.",
    image: FIGMA_ASSETS.images.categoryMen,
    href: "/products?gender=Men",
    nodeId: "5:6823",
  },
  Women: {
    title: "Women",
    description: "Shape your own expression.",
    image: FIGMA_ASSETS.images.categoryWomen,
    href: "/products?gender=Women",
    nodeId: "5:6838",
  },
  Unisex: {
    title: "Unisex",
    description: "Style beyond boundaries.",
    image: FIGMA_ASSETS.images.categoryUnisex,
    href: "/products?gender=Unisex",
    nodeId: "5:6853",
  },
  Occasion: {
    title: "Occasion",
    description: "For moments that matter.",
    image: FIGMA_ASSETS.images.categoryOccasion,
    href: "/products?occasion=Occasion",
    nodeId: "5:6868",
  },
  Workwear: {
    title: "Workwear",
    description: "Confidence, well dressed.",
    image: FIGMA_ASSETS.images.categoryWorkwear,
    href: "/products?occasion=Workwear",
    nodeId: "5:6883",
  },
  Casual: {
    title: "Casual",
    description: "Ease, made personal.",
    image: FIGMA_ASSETS.images.categoryCasual,
    href: "/products?occasion=Casual",
    nodeId: "5:6898",
  },
} as const;

export function CategoryImageCard({
  category,
  className,
}: CategoryImageCardProps) {
  const meta = CATEGORY_META[category];
  return (
    <Link
      href={meta.href}
      className={
        className ||
        "group flex flex-col gap-[16px] items-start w-full sm:w-[196px]"
      }
      data-node-id={meta.nodeId}
    >
      <div className="relative h-[256px] w-full overflow-hidden bg-[#e9e0d3]">
        <img
          alt={meta.title}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={meta.image}
        />
      </div>
      <div className="flex items-center justify-between w-full">
        <p className="font-serif text-[24px] leading-none text-[#172b24]">
          {meta.title}
        </p>
        <img
          alt=""
          className="size-[16px] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          src={FIGMA_ASSETS.icons.arrowUpRightDark}
        />
      </div>
      <p className="font-sans text-[11px] text-[#29251f]">{meta.description}</p>
    </Link>
  );
}

const FABRIC_META = {
  Linen: {
    name: "Linen",
    description: "Airy, naturally textured.",
    image: FIGMA_ASSETS.images.fabricLinen,
    nodeId: "5:7314",
  },
  Cotton: {
    name: "Cotton",
    description: "Soft, breathable, everyday ease.",
    image: FIGMA_ASSETS.images.fabricCotton,
    nodeId: "5:7325",
  },
  Silk: {
    name: "Silk",
    description: "Fluid drape. Quiet luxury.",
    image: FIGMA_ASSETS.images.fabricSilk,
    nodeId: "5:7336",
  },
  Wool: {
    name: "Wool",
    description: "Beautiful structure, natural warmth.",
    image: FIGMA_ASSETS.images.fabricWool,
    nodeId: "5:7347",
  },
  Blends: {
    name: "Blends",
    description: "Versatile comfort, thoughtfully woven.",
    image: FIGMA_ASSETS.images.fabricBlends,
    nodeId: "5:7358",
  },
} as const;

export function FabricSwatchCard({
  material,
  className,
}: FabricSwatchCardProps) {
  const meta = FABRIC_META[material];
  return (
    <Link
      href={`/customize?fabric=${encodeURIComponent(material)}`}
      className={
        className ||
        "group flex flex-col gap-[16px] items-start w-full sm:w-[196px] shrink-0"
      }
      data-node-id={meta.nodeId}
    >
      <div className="relative h-[208px] w-full sm:w-[196px] overflow-hidden">
        <img
          alt={meta.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={meta.image}
        />
      </div>
      <div className="flex flex-col gap-[8px] items-start w-full">
        <p className="font-serif text-[24px] leading-none text-[#172b24]">
          {meta.name}
        </p>
        <p className="font-sans text-[12px] leading-[1.6] text-[#29251f]">
          {meta.description}
        </p>
      </div>
    </Link>
  );
}

const STEP_ICONS = {
  shirt: FIGMA_ASSETS.icons.shirtStep,
  layers: FIGMA_ASSETS.icons.layersStep,
  ruler: FIGMA_ASSETS.icons.rulerStep,
  package: FIGMA_ASSETS.icons.packageCheckStep,
};

export function StepIndicator({
  stepNumber,
  title,
  description,
  iconType,
  className,
}: StepIndicatorProps) {
  return (
    <div
      className={
        className ||
        "relative z-10 flex flex-col gap-[24px] items-start w-full lg:w-[306px] shrink-0"
      }
      data-node-id="5:7123"
    >
      <div className="flex size-[64px] items-center justify-center rounded-full bg-[#e9e0d3] border border-[#b69a68]">
        <img
          alt=""
          className="size-[28px]"
          src={STEP_ICONS[iconType]}
        />
      </div>
      <div className="flex flex-col gap-[12px] items-start w-full">
        <div className="flex items-baseline gap-[12px] text-[#172b24]">
          <span className="font-sans text-[11px]">{stepNumber}</span>
          <span className="font-serif text-[24px] leading-none">{title}</span>
        </div>
        <p className="font-sans text-[13px] leading-[1.75] text-[#29251f]">
          {description}
        </p>
      </div>
    </div>
  );
}

const BENEFIT_META = {
  "Made-to-measure fit": {
    title: "Made-to-measure fit",
    description: "Thoughtfully cut to your measurements, not a standard size.",
    icon: FIGMA_ASSETS.icons.rulerGold,
    nodeId: "5:7199",
  },
  "Premium materials": {
    title: "Premium materials",
    description: "Considered fabrics chosen for their feel, drape and durability.",
    icon: FIGMA_ASSETS.icons.layersGold,
    nodeId: "5:7212",
  },
  "Skilled tailoring partners": {
    title: "Skilled tailoring partners",
    description: "Experienced hands bring care and precision to every detail.",
    icon: FIGMA_ASSETS.icons.scissorsGold,
    nodeId: "5:7225",
  },
  Personalization: {
    title: "Personalization",
    description:
      "Make your own choices, from fabric and colour to finishing touches.",
    icon: FIGMA_ASSETS.icons.slidersHorizontalGold,
    nodeId: "5:7238",
  },
  "Order tracking": {
    title: "Convenient order tracking",
    description: "Keep up with your outfit as it moves from design to delivery.",
    icon: FIGMA_ASSETS.icons.packageCheckGold,
    nodeId: "5:7251",
  },
} as const;

export function FeatureBenefitItem({
  benefit,
  className,
}: FeatureBenefitItemProps) {
  const meta = BENEFIT_META[benefit];
  return (
    <div
      className={
        className ||
        "flex items-center gap-[24px] border-b-[0.5px] border-[#b69a68] py-[16px] w-full"
      }
      data-node-id={meta.nodeId}
    >
      <img alt="" className="size-[24px] shrink-0" src={meta.icon} />
      <div className="flex flex-col gap-[8px] items-start flex-1">
        <p className="font-serif text-[21px] leading-none text-[#172b24]">
          {meta.title}
        </p>
        <p className="font-sans text-[12px] leading-[1.5] text-[#29251f]">
          {meta.description}
        </p>
      </div>
    </div>
  );
}

const TRUST_META = {
  "Perfect Fit": {
    label: "Perfect Fit",
    icon: FIGMA_ASSETS.icons.rulerTrust,
    nodeId: "5:7009",
  },
  "Premium Fabrics": {
    label: "Premium Fabrics",
    icon: FIGMA_ASSETS.icons.layersTrust,
    nodeId: "5:7018",
  },
  "Tailored by Experts": {
    label: "Tailored by Experts",
    icon: FIGMA_ASSETS.icons.scissorsTrust,
    nodeId: "5:7027",
  },
} as const;

export function TrustIndicator({ benefit, className }: TrustIndicatorProps) {
  const meta = TRUST_META[benefit];
  return (
    <div
      className={className || "flex items-center gap-[12px]"}
      data-node-id={meta.nodeId}
    >
      <img alt="" className="size-[20px] shrink-0" src={meta.icon} />
      <span className="font-sans text-[12px] text-[#172b24] whitespace-nowrap">
        {meta.label}
      </span>
    </div>
  );
}

const TESTIMONIAL_META = {
  "Story 1": {
    quote:
      "“I wanted a linen suit that felt like me, not something borrowed from a standard-size rack.”",
    name: "Ananya S.",
    story: "Illustrative story · Workwear",
    image: FIGMA_ASSETS.images.customerPortraitAnanya,
    nodeId: "5:7268",
  },
  "Story 2": {
    quote:
      "“Choosing the fabric and fit made our occasion outfits feel personal, without looking the same.”",
    name: "Rohan M.",
    story: "Illustrative story · Occasion",
    image: FIGMA_ASSETS.images.customerPortraitRohan,
    nodeId: "5:7283",
  },
  "Story 3": {
    quote:
      "“Finally, a relaxed silhouette shaped around my measurements. Comfort without compromise.”",
    name: "Alex R.",
    story: "Illustrative story · Everyday",
    image: FIGMA_ASSETS.images.customerPortraitAlex,
    nodeId: "5:7298",
  },
} as const;

export function TestimonialCard({ story, className }: TestimonialCardProps) {
  const meta = TESTIMONIAL_META[story];
  return (
    <div
      className={
        className ||
        "flex flex-col gap-[32px] items-start border-t border-[#b69a68] pt-[24px] pr-[24px] w-full lg:w-[416px]"
      }
      data-node-id={meta.nodeId}
    >
      <p className="font-serif text-[22px] sm:text-[24px] leading-[1.5] lg:min-h-[152px] text-[#172b24] w-full">
        {meta.quote}
      </p>
      <div className="flex items-center gap-[16px] w-full">
        <div className="relative h-[72px] w-[64px] shrink-0 overflow-hidden">
          <img
            alt={meta.name}
            className="absolute inset-0 size-full object-cover"
            src={meta.image}
          />
        </div>
        <div className="flex flex-col gap-[8px] items-start">
          <p className="font-sans text-[13px] font-medium text-[#172b24]">
            {meta.name}
          </p>
          <p className="font-sans text-[11px] leading-[1.5] text-[#29251f]">
            {meta.story}
          </p>
        </div>
      </div>
    </div>
  );
}

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        className ||
        "flex flex-col gap-[16px] items-start w-full lg:w-[636px]"
      }
      data-node-id="5:7780"
      noValidate
    >
      <label
        htmlFor="newsletter-email"
        className="font-sans text-[11px] text-[#172b24]"
        data-node-id="5:7771"
      >
        Email address
      </label>
      <div
        className="flex h-[56px] w-full items-stretch"
        data-node-id="5:7772"
      >
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Enter your email address"
          className="flex-1 bg-[#f5f0e7] border border-[#b69a68] px-[16px] text-[14px] text-[#29251f] placeholder:text-[#29251f]/70 focus:outline-none"
          data-node-id="5:7773"
        />
        <button
          type="submit"
          className="bg-[#172b24] flex items-center gap-[24px] px-[24px] text-[14px] text-[#f5f0e7] shrink-0 cursor-pointer hover:opacity-95"
          data-node-id="5:7775"
        >
          <span>Subscribe</span>
          <img
            alt=""
            className="size-[16px]"
            src={FIGMA_ASSETS.icons.arrowRightIvory}
          />
        </button>
      </div>
      {status === "success" && (
        <div
          className="flex items-start gap-3 border border-[#172b24] bg-[#f5f0e7] px-4 py-3 text-[#172b24] w-full"
          data-node-id="5:7756"
        >
          <span className="text-[16px] font-medium">✓</span>
          <div className="text-[12px]">
            <p className="font-medium">You’re on the list.</p>
            <p className="text-[#29251f]">
              New collections and tailoring stories, coming your way.
            </p>
          </div>
        </div>
      )}
      {status === "error" && (
        <div
          className="flex items-start gap-3 border border-[#29251f] bg-[#f5f0e7] px-4 py-3 text-[#172b24] w-full"
          data-node-id="5:7763"
        >
          <span className="text-[16px] font-medium">!</span>
          <div className="text-[12px]">
            <p className="font-medium">Please check your email address.</p>
            <p className="text-[#29251f]">
              Use a valid email to subscribe to Tapestory updates.
            </p>
          </div>
        </div>
      )}
      <p
        className="font-sans text-[10px] text-[#29251f]"
        data-node-id="5:7779"
      >
        By subscribing, you agree to our Privacy Policy. Unsubscribe at any time.
      </p>
    </form>
  );
}
