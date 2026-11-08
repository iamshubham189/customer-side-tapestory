"use client";

import React from "react";
import Link from "next/link";
import { X, ArrowUpRight, Sparkles, Ruler, ShoppingBag, Heart, UserRound, Package } from "lucide-react";
import { useTapestory } from "@/features/store-provider";
import type { MobileNavigationProps } from "./MobileNavigation.types";

const PRIMARY_LINKS = [
  { label: "Men", href: "/products?gender=Men", sub: "Tailored for your every day" },
  { label: "Women", href: "/products?gender=Women", sub: "Shape your own expression" },
  { label: "Unisex", href: "/products?gender=Unisex", sub: "Style beyond boundaries" },
  { label: "Occasion", href: "/products?occasion=Occasion", sub: "For moments that matter" },
  { label: "Custom Design Studio", href: "/customize", sub: "5-step bespoke configurator", highlight: true },
  { label: "Discover Tailors", href: "/vendors", sub: "Verified ateliers across India" },
  { label: "3D Avatar Preview", href: "/customize/preview", sub: "Interactive 3D fit visualization" },
  { label: "Measurements", href: "/measurements", sub: "Manual & saved fit profiles" },
];

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const { cart, wishlistProductIds, user } = useTapestory();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      <div
        className="fixed inset-0 bg-[#172b24]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 z-10 flex w-full max-w-[360px] flex-col justify-between overflow-y-auto bg-[#f5f0e7] border-r border-[#e9e0d3] p-6 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-[#e9e0d3] pb-4">
            <Link href="/" onClick={onClose} className="flex flex-col gap-1 text-[#172b24]">
              <span className="font-serif text-[28px] leading-none tracking-[-1.2px]">
                Tapestory
              </span>
              <span className="font-sans text-[8px] tracking-[2.4px]">
                TAILORED TO YOU
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="flex size-10 items-center justify-center border border-[#b69a68]/40 text-[#172b24] hover:bg-[#e9e0d3]"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex flex-col divide-y divide-[#e9e0d3]">
            {PRIMARY_LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center justify-between py-3.5 text-[#172b24]"
              >
                <div className="flex flex-col gap-0.5">
                  <span
                    className={`text-[14px] ${
                      item.highlight ? "font-semibold text-[#172b24]" : "font-normal"
                    }`}
                  >
                    {item.label}
                  </span>
                  <span className="text-[11px] text-[#29251f]/75">{item.sub}</span>
                </div>
                <ArrowUpRight className="size-4 text-[#b69a68] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            ))}
          </nav>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/account/wishlist"
              onClick={onClose}
              className="flex items-center gap-2.5 border border-[#e9e0d3] bg-white px-3.5 py-3 text-[12px] text-[#172b24]"
            >
              <Heart className="size-4 text-[#b69a68]" />
              <span>Wishlist ({wishlistProductIds.length})</span>
            </Link>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center gap-2.5 border border-[#e9e0d3] bg-white px-3.5 py-3 text-[12px] text-[#172b24]"
            >
              <ShoppingBag className="size-4 text-[#b69a68]" />
              <span>Bag ({cart.length})</span>
            </Link>
            <Link
              href="/orders"
              onClick={onClose}
              className="flex items-center gap-2.5 border border-[#e9e0d3] bg-white px-3.5 py-3 text-[12px] text-[#172b24]"
            >
              <Package className="size-4 text-[#b69a68]" />
              <span>My Orders</span>
            </Link>
            <Link
              href="/account"
              onClick={onClose}
              className="flex items-center gap-2.5 border border-[#e9e0d3] bg-white px-3.5 py-3 text-[12px] text-[#172b24]"
            >
              <UserRound className="size-4 text-[#b69a68]" />
              <span>{user ? user.fullName.split(" ")[0] : "Sign In"}</span>
            </Link>
          </div>
        </div>

        <div className="mt-8 border-t border-[#b69a68]/40 pt-5">
          <Link
            href="/customize"
            onClick={onClose}
            className="flex h-12 w-full items-center justify-center gap-3 bg-[#172b24] px-5 text-[13px] font-medium text-[#f5f0e7]"
          >
            <Sparkles className="size-4 text-[#b69a68]" />
            <span>Start Customizing</span>
          </Link>
          <div className="mt-3 flex items-center justify-between text-[10px] text-[#29251f]/75">
            <span>MADE FOR EVERY BODY</span>
            <span>India · INR ₹</span>
          </div>
        </div>
      </div>
    </div>
  );
}
