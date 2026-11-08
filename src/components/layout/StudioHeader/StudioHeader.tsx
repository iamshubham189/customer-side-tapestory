import React from "react";
import Link from "next/link";
import type { StudioHeaderProps } from "./StudioHeader.types";

const STUDIO_STEPS = [
  { step: 1, title: "Choose Style", href: "/customize#step-style" },
  { step: 2, title: "Pick Fabric", href: "/customize#step-fabric" },
  { step: 3, title: "Customize Details", href: "/customize#step-details" },
  { step: 4, title: "Add Measurements", href: "/measurements" },
  { step: 5, title: "Preview & Save", href: "/customize/preview" },
] as const;

export function StudioHeader({
  breadcrumbLabel = "Home / Product / Customize",
  eyebrow,
  title,
  description,
  signatureQuote = "Your story, in the making.",
  activeStepIndex,
}: StudioHeaderProps) {
  return (
    <section
      className="w-full px-4 sm:px-8 lg:px-[72px] pt-[24px] pb-[36px]"
      data-node-id="20:30548"
    >
      <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-[24px]">
        <div
          className="flex h-[32px] w-full items-center text-[12px] text-[#29251f]"
          data-node-id="5:7742"
        >
          {breadcrumbLabel}
        </div>

        <div
          className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between w-full"
          data-node-id="20:30551"
        >
          <div
            className="flex flex-col gap-[14px] items-start lg:max-w-[960px]"
            data-node-id="20:30552"
          >
            <p
              className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]"
              data-node-id="20:30553"
            >
              {eyebrow}
            </p>
            <h1
              className="font-serif text-[34px] sm:text-[42px] lg:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
              data-node-id="20:30554"
            >
              {title}
            </h1>
            <p
              className="font-sans text-[14px] leading-[1.65] text-[#29251f]"
              data-node-id="20:30555"
            >
              {description}
            </p>
          </div>
          <p
            className="font-serif italic text-[18px] text-[#b69a68] shrink-0"
            data-node-id="20:30556"
          >
            {signatureQuote}
          </p>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[12px] w-full"
          data-node-id="20:30557"
        >
          {STUDIO_STEPS.map((item) => {
            const isCompleted = item.step < activeStepIndex;
            const isCurrent = item.step === activeStepIndex;
            const statusText = isCompleted
              ? "✓  Complete"
              : isCurrent
              ? "In progress"
              : "Up next";

            return (
              <Link
                key={item.step}
                href={item.href}
                className={`flex flex-col items-start p-[14px] border-t-2 transition-colors ${
                  isCurrent
                    ? "bg-white border-[#172b24] shadow-xs"
                    : "bg-[#f5f0e7] border-[#e9e0d3] hover:border-[#b69a68]"
                }`}
              >
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <div className="flex items-baseline gap-[12px] text-[#172b24]">
                    <span className="text-[11px]">{item.step}</span>
                    <span className="text-[13px] sm:text-[14px] font-medium">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-[11px] leading-[1.75] text-[#29251f]">
                    {statusText}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function StudioFooter() {
  return (
    <footer
      className="w-full bg-[#172b24] px-4 sm:px-8 lg:px-[72px] py-[28px]"
      data-node-id="20:30935"
    >
      <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-[20px]">
          <Link
            href="/"
            className="font-serif text-[26px] text-[#f5f0e7] tracking-[-0.5px]"
          >
            Tapestory
          </Link>
          <p className="font-serif italic text-[14px] text-[#b69a68]">
            Clothing that tells your story.
          </p>
        </div>
        <div className="flex items-center gap-[20px] text-[10px] text-[#f5f0e7]">
          <span>© 2026 Tapestory</span>
          <span>India · INR ₹</span>
        </div>
      </div>
    </footer>
  );
}
