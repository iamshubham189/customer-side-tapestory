import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import type { FooterProps } from "./Footer.types";

const FOOTER_GROUPS = [
  {
    title: "SHOP",
    nodeId: "5:7374",
    links: [
      { label: "Men", href: "/products?gender=Men" },
      { label: "Women", href: "/products?gender=Women" },
      { label: "Unisex", href: "/products?gender=Unisex" },
      { label: "Occasion", href: "/products?occasion=Occasion" },
    ],
  },
  {
    title: "EXPLORE",
    nodeId: "5:7388",
    links: [
      { label: "Custom Design", href: "/customize" },
      { label: "Fabrics", href: "/#premium-fabrics" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "3D Avatar Preview", href: "/customize/preview" },
    ],
  },
  {
    title: "SUPPORT",
    nodeId: "5:7401",
    links: [
      { label: "Contact", href: "/account/support" },
      { label: "FAQs", href: "/account/support#faqs" },
      { label: "Order Tracking", href: "/orders" },
      { label: "Measurements Guide", href: "/measurements" },
    ],
  },
  {
    title: "POLICIES",
    nodeId: "5:7415",
    links: [
      { label: "Shipping", href: "/account/support" },
      { label: "Returns & Alterations", href: "/orders/TS-1042/alteration" },
      { label: "Privacy", href: "/account/settings" },
      { label: "Terms", href: "/account/settings" },
    ],
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <footer
      className={
        className ||
        "w-full bg-[#172b24] px-4 sm:px-8 lg:px-[72px] pt-[64px] pb-[32px]"
      }
      data-node-id="5:5448"
    >
      <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-[56px]">
        <div
          className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:flex lg:items-start lg:gap-[24px] w-full"
          data-node-id="5:5449"
        >
          <div
            className="flex flex-col gap-[24px] items-start lg:pr-[64px] lg:w-[416px] shrink-0"
            data-node-id="5:5450"
          >
            <Link
              href="/"
              className="font-serif text-[40px] sm:text-[48px] leading-none text-[#f5f0e7] tracking-[-2px]"
              data-node-id="5:5451"
            >
              Tapestory
            </Link>
            <p
              className="font-serif italic text-[21px] sm:text-[23px] leading-[1.4] text-[#b69a68]"
              data-node-id="5:5452"
            >
              Clothing that tells your story.
            </p>
            <p
              className="font-sans text-[12px] leading-[1.8] text-[#f5f0e7]/90"
              data-node-id="5:5453"
            >
              Premium, inclusive, made-to-measure clothing. Designed by you.
              Tailored for you.
            </p>
            <div
              className="flex items-center gap-[24px]"
              data-node-id="5:5454"
            >
              <a
                href="#instagram"
                aria-label="Tapestory on Instagram"
                className="flex size-[24px] items-center justify-center opacity-90 hover:opacity-100"
                data-node-id="5:5455"
              >
                <img
                  alt=""
                  className="size-[18px]"
                  src={FIGMA_ASSETS.icons.instagram}
                />
              </a>
              <a
                href="#facebook"
                aria-label="Tapestory on Facebook"
                className="flex size-[24px] items-center justify-center opacity-90 hover:opacity-100"
                data-node-id="5:5457"
              >
                <img
                  alt=""
                  className="size-[18px]"
                  src={FIGMA_ASSETS.icons.facebook}
                />
              </a>
              <a
                href="#youtube"
                aria-label="Tapestory on YouTube"
                className="flex size-[24px] items-center justify-center opacity-90 hover:opacity-100"
                data-node-id="5:5459"
              >
                <img
                  alt=""
                  className="size-[18px]"
                  src={FIGMA_ASSETS.icons.youtube}
                />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:flex lg:gap-[24px] flex-1">
            {FOOTER_GROUPS.map((group) => (
              <div
                key={group.title}
                className="flex flex-col gap-[24px] items-start pt-[16px] lg:w-[196px] shrink-0"
                data-node-id={group.nodeId}
              >
                <p className="font-sans text-[11px] tracking-[1.5px] text-[#b69a68]">
                  {group.title}
                </p>
                <div className="flex flex-col gap-[16px] items-start text-[12px] text-[#f5f0e7]">
                  {group.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="transition-colors hover:text-[#b69a68]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t-[0.5px] border-[#b69a68] pt-[24px] text-[10px] text-[#f5f0e7] w-full"
          data-node-id="5:5487"
        >
          <p data-node-id="5:5488">© 2026 Tapestory. All rights reserved.</p>
          <p className="tracking-[1px]" data-node-id="5:5489">
            MADE FOR EVERY BODY. MADE FOR YOUR STORY.
          </p>
          <p data-node-id="5:5490">India · INR ₹</p>
        </div>
      </div>
    </footer>
  );
}
