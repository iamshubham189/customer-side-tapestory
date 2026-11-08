"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import { SEED_PRODUCTS } from "@/lib/backend/seed-data";
import { formatInr } from "@/lib/utils/format";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import type { HeaderProps } from "./Header.types";

export function Header({ className, activeNav }: HeaderProps) {
  const router = useRouter();
  const { cart, wishlistProductIds, isHydrated } = useTapestory();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const cartCount = isHydrated
    ? cart.reduce((sum, item) => sum + item.quantity, 0)
    : 1;
  const wishlistCount = isHydrated ? wishlistProductIds.length : 4;

  const quickMatches =
    searchQuery.trim().length > 0
      ? SEED_PRODUCTS.filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.fabricFamily.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 4)
      : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchOpen(false);
    router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <>
      <header
        className={
          className ||
          "sticky top-0 z-40 w-full bg-[#f5f0e7]/95 backdrop-blur-xs border-b border-[#e9e0d3]"
        }
        data-node-id="5:7447"
      >
        <div className="mx-auto flex h-[76px] lg:h-[104px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-8 lg:px-[72px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              className="flex size-10 items-center justify-center border border-[#e9e0d3] text-[#172b24] lg:hidden"
            >
              <Menu className="size-5" />
            </button>
            <Link
              href="/"
              className="flex flex-col gap-[4px] items-start leading-none text-[#172b24] whitespace-nowrap"
              data-node-id="5:7427"
            >
              <span
                className="font-serif text-[28px] sm:text-[34px] tracking-[-1.4px]"
                data-node-id="5:7428"
              >
                Tapestory
              </span>
              <span
                className="font-sans text-[8px] tracking-[2.4px]"
                data-node-id="5:7429"
              >
                TAILORED TO YOU
              </span>
            </Link>
          </div>

          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-[28px]"
            data-node-id="5:7430"
          >
            <Link
              href="/products?gender=Men"
              className={`py-[8px] text-[13px] transition-colors hover:text-[#b69a68] ${
                activeNav === "Men"
                  ? "font-semibold text-[#172b24] border-b border-[#b69a68]"
                  : "font-normal text-[#172b24]"
              }`}
              data-node-id="5:6437"
            >
              Men
            </Link>
            <Link
              href="/products?gender=Women"
              className={`py-[8px] text-[13px] transition-colors hover:text-[#b69a68] ${
                activeNav === "Women"
                  ? "font-semibold text-[#172b24] border-b border-[#b69a68]"
                  : "font-normal text-[#172b24]"
              }`}
              data-node-id="5:7432"
            >
              Women
            </Link>
            <Link
              href="/products?gender=Unisex"
              className={`py-[8px] text-[13px] transition-colors hover:text-[#b69a68] ${
                activeNav === "Unisex"
                  ? "font-semibold text-[#172b24] border-b border-[#b69a68]"
                  : "font-normal text-[#172b24]"
              }`}
              data-node-id="5:7434"
            >
              Unisex
            </Link>
            <Link
              href="/products?occasion=Occasion"
              className={`py-[8px] text-[13px] transition-colors hover:text-[#b69a68] ${
                activeNav === "Occasion"
                  ? "font-semibold text-[#172b24] border-b border-[#b69a68]"
                  : "font-normal text-[#172b24]"
              }`}
              data-node-id="5:7436"
            >
              Occasion
            </Link>
            <Link
              href="/customize"
              className="py-[8px] text-[13px] font-semibold text-[#172b24] transition-colors hover:text-[#b69a68]"
              data-node-id="5:7438"
            >
              Custom Design
            </Link>
            <Link
              href="/#how-it-works"
              className="py-[8px] text-[13px] font-normal text-[#172b24] transition-colors hover:text-[#b69a68]"
              data-node-id="5:7440"
            >
              How It Works
            </Link>
          </nav>

          <div
            className="flex items-center gap-[16px] sm:gap-[20px]"
            data-node-id="5:7442"
          >
            <button
              type="button"
              onClick={() => setSearchOpen((prev) => !prev)}
              aria-label="Search designs, fabrics and tailors"
              className="flex h-[32px] w-[24px] items-center justify-center relative cursor-pointer"
              data-node-id="5:6350"
            >
              <img
                alt="Search"
                className="size-[20px]"
                src={FIGMA_ASSETS.icons.search}
              />
            </button>

            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="flex h-[32px] w-[24px] items-center justify-center relative"
              data-node-id="5:6372"
            >
              <img
                alt="Wishlist"
                className="size-[20px]"
                src={FIGMA_ASSETS.icons.heartHeader}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-2 flex size-[16px] items-center justify-center rounded-full bg-[#b69a68] text-[9px] font-medium text-[#172b24]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className="flex h-[32px] w-[24px] items-center justify-center relative"
              data-node-id="5:6394"
            >
              <img
                alt="Cart"
                className="size-[20px]"
                src={FIGMA_ASSETS.icons.shoppingBag}
              />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-2 flex size-[16px] items-center justify-center rounded-full bg-[#172b24] text-[9px] font-medium text-[#f5f0e7]">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              aria-label="Customer Account"
              className="flex h-[32px] w-[24px] items-center justify-center relative"
              data-node-id="5:6416"
            >
              <img
                alt="Account"
                className="size-[20px]"
                src={FIGMA_ASSETS.icons.userRound}
              />
            </Link>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-[#e9e0d3] bg-[#f5f0e7] px-4 py-4 sm:px-8 lg:px-[72px]">
            <div className="mx-auto max-w-[1296px]">
              <form
                onSubmit={handleSearchSubmit}
                className="flex items-center gap-3 border border-[#b69a68] bg-white px-4 py-2.5"
              >
                <img
                  alt=""
                  className="size-[18px] shrink-0"
                  src={FIGMA_ASSETS.icons.search}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Linen Field Jacket, Bandhgala, Atelier Niva, Silk..."
                  className="w-full bg-transparent text-[14px] text-[#29251f] placeholder:text-[#29251f]/50 focus:outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="bg-[#172b24] px-4 py-1.5 text-[12px] font-medium text-[#f5f0e7]"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="p-1 text-[#29251f]/70 hover:text-[#172b24]"
                >
                  <X className="size-4" />
                </button>
              </form>

              {quickMatches.length > 0 && (
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {quickMatches.map((item) => (
                    <Link
                      key={item.id}
                      href={`/product/${item.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 border border-[#e9e0d3] bg-white p-2.5 hover:border-[#b69a68]"
                    >
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="size-12 object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-[14px] text-[#172b24]">
                          {item.name}
                        </p>
                        <p className="truncate text-[11px] text-[#29251f]/70">
                          {item.vendorName} · {formatInr(item.startingPriceInr)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
