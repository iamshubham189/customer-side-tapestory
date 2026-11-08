import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import { Badge } from "@/components/common/Button";
import type { TailorCardProps } from "./TailorCard.types";

export function TailorCard({
  name,
  slug,
  description,
  image,
  badges,
  className,
}: TailorCardProps) {
  return (
    <article
      className={
        className ||
        "group flex flex-1 flex-col gap-[16px] items-start w-full"
      }
      data-node-id="17:1259"
    >
      <Link
        href={`/vendors/${slug}`}
        className="relative h-[220px] w-full overflow-hidden bg-[#e9e0d3]"
      >
        <img
          alt={name}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          src={image}
        />
      </Link>
      <div className="flex flex-col gap-[8px] items-start p-[20px] sm:p-[24px] w-full">
        <Link
          href={`/vendors/${slug}`}
          className="font-serif text-[24px] text-[#172b24] hover:opacity-80"
        >
          {name}
        </Link>
        <p className="font-sans text-[11px] leading-[1.6] text-[#29251f]">
          {description}
        </p>
        <div className="flex flex-wrap items-center gap-[12px] sm:gap-[16px] pt-2">
          {badges.slice(0, 2).map((badge) => (
            <Badge key={badge} label={badge} />
          ))}
          <Link
            href={`/vendors/${slug}`}
            className="flex items-center gap-[8px] text-[12px] text-[#172b24] underline"
          >
            <span>View profile</span>
            <img
              alt=""
              className="size-[12px]"
              src={FIGMA_ASSETS.icons.arrowUpRightSmall}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
