import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import type {
  BreadcrumbProps,
  SectionHeadingProps,
  SectionHeadingWithViewAllProps,
} from "./SectionHeading.types";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={
        className ||
        "flex flex-col gap-[16px] items-start w-full"
      }
      data-node-id="5:7096"
    >
      <p className="font-sans text-[11px] font-medium tracking-[2px] text-[#172b24]">
        {eyebrow}
      </p>
      <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
        {title}
      </h2>
      {description && (
        <p className="font-sans text-[14px] leading-[1.6] text-[#29251f] max-w-[720px]">
          {description}
        </p>
      )}
    </div>
  );
}

export function SectionHeadingWithViewAll({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  className,
}: SectionHeadingWithViewAllProps) {
  return (
    <div
      className={
        className ||
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between w-full"
      }
      data-node-id="5:7061"
    >
      <div className="flex flex-col gap-[16px] items-start">
        <p className="font-sans text-[11px] font-medium tracking-[2px] text-[#172b24]">
          {eyebrow}
        </p>
        <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px] text-[#172b24]">
          {title}
        </h2>
        {description && (
          <p className="font-sans text-[14px] leading-[1.6] text-[#29251f] max-w-[680px]">
            {description}
          </p>
        )}
      </div>

      <Link
        href={actionHref}
        className="inline-flex items-center gap-[16px] border-b border-[#b69a68] pb-[8px] shrink-0 self-start sm:self-end transition-opacity hover:opacity-80"
        data-node-id="5:7057"
      >
        <span className="font-sans text-[14px] text-[#172b24] whitespace-nowrap">
          {actionLabel}
        </span>
        <img
          alt=""
          className="size-[16px]"
          src={FIGMA_ASSETS.icons.arrowUpRightDark}
        />
      </Link>
    </div>
  );
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ||
        "flex h-[32px] items-center flex-wrap gap-1.5 text-[12px] text-[#29251f]"
      }
      data-node-id="5:7742"
    >
      {items.map((item, idx) => (
        <React.Fragment key={`${item.label}-${idx}`}>
          {idx > 0 && <span className="text-[#29251f]/50">/</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-[#172b24] hover:underline"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-[#172b24]">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
