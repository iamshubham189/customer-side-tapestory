import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import type {
  BadgeProps,
  ButtonPrimaryProps,
  ButtonSecondaryProps,
  ButtonTextProps,
} from "./Button.types";

export function ButtonPrimary({
  label,
  href,
  onClick,
  type = "button",
  tone = "Forest",
  showArrow = true,
  fullWidth = false,
  disabled = false,
  className,
}: ButtonPrimaryProps) {
  const isIvory = tone === "Ivory";
  const baseClass =
    className ||
    `inline-flex h-[56px] items-center justify-center gap-[24px] px-[24px] rounded-[2px] shadow-[0px_4px_16px_0px_rgba(41,37,31,0.05)] transition-opacity hover:opacity-95 disabled:opacity-50 cursor-pointer ${
      fullWidth ? "w-full " : ""
    }${isIvory ? "bg-[#f5f0e7] text-[#172b24]" : "bg-[#172b24] text-white"}`;

  const content = (
    <>
      <span className="font-sans text-[14px] font-medium leading-none whitespace-nowrap">
        {label}
      </span>
      {showArrow && (
        <img
          alt=""
          className="size-[16px] shrink-0"
          src={
            isIvory
              ? FIGMA_ASSETS.icons.arrowUpRightDark
              : FIGMA_ASSETS.icons.arrowUpRightWhite
          }
        />
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        data-node-id={isIvory ? "5:6249" : "5:6229"}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      data-node-id={isIvory ? "5:6249" : "5:6229"}
    >
      {content}
    </button>
  );
}

export function ButtonSecondary({
  label,
  href,
  onClick,
  type = "button",
  tone = "Standard",
  fullWidth = false,
  disabled = false,
  className,
}: ButtonSecondaryProps) {
  const isInverse = tone === "Inverse";
  const baseClass =
    className ||
    `inline-flex h-[56px] items-center justify-center px-[16px] border border-solid transition-colors cursor-pointer disabled:opacity-50 ${
      fullWidth ? "w-full " : ""
    }${
      isInverse
        ? "border-[#b69a68] text-[#f5f0e7] hover:bg-[#f5f0e7]/10"
        : "border-[#172b24] text-[#172b24] hover:bg-[#e9e0d3]/60"
    }`;

  const content = (
    <span className="font-sans text-[14px] font-normal leading-none whitespace-nowrap">
      {label}
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        data-node-id={isInverse ? "5:6286" : "5:6274"}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClass}
      data-node-id={isInverse ? "5:6286" : "5:6274"}
    >
      {content}
    </button>
  );
}

export function ButtonText({
  label,
  href,
  onClick,
  className,
}: ButtonTextProps) {
  const baseClass =
    className ||
    "inline-flex items-center gap-[16px] border-b border-[#b69a68] pb-[8px] text-[14px] text-[#172b24] transition-opacity hover:opacity-80 cursor-pointer";

  const content = (
    <>
      <span className="font-sans text-[14px] font-normal leading-none whitespace-nowrap">
        {label}
      </span>
      <img
        alt=""
        className="size-[16px] shrink-0"
        src={FIGMA_ASSETS.icons.arrowUpRightDark}
      />
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass} data-node-id="5:6305">
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClass} data-node-id="5:6305">
      {content}
    </button>
  );
}

export function Badge({ label, tone = "Neutral", className }: BadgeProps) {
  const toneClass =
    tone === "Forest"
      ? "bg-[#172b24] border-[#172b24] text-[#f5f0e7]"
      : tone === "Accent"
      ? "bg-[#f5f0e7] border-[#b69a68] text-[#172b24]"
      : "bg-[#e9e0d3] border-[#e9e0d3] text-[#172b24]";

  return (
    <span
      className={
        className ||
        `inline-flex h-[32px] items-center justify-center border px-[11px] font-sans text-[10px] tracking-[0.4px] whitespace-nowrap ${toneClass}`
      }
      data-node-id="5:7732"
    >
      {label}
    </span>
  );
}
