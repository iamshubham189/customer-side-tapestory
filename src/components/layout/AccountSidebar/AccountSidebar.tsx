"use client";

import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import type { AccountNavTab, AccountSidebarProps } from "./AccountSidebar.types";

const ACCOUNT_NAV_ITEMS: {
  id: AccountNavTab;
  label: string;
  href: string;
  icon: string;
}[] = [
  {
    id: "profile",
    label: "Profile Overview",
    href: "/account",
    icon: FIGMA_ASSETS.icons.userRound,
  },
  {
    id: "measurements",
    label: "Measurements",
    href: "/account/measurements",
    icon: FIGMA_ASSETS.icons.rulerTrust,
  },
  {
    id: "wishlist",
    label: "Wishlist",
    href: "/account/wishlist",
    icon: FIGMA_ASSETS.icons.heartHeader,
  },
  {
    id: "notifications",
    label: "Notifications",
    href: "/account/notifications",
    icon: FIGMA_ASSETS.icons.bell,
  },
  {
    id: "support",
    label: "Support",
    href: "/account/support",
    icon: FIGMA_ASSETS.icons.messageCircle,
  },
  {
    id: "settings",
    label: "Settings",
    href: "/account/settings",
    icon: FIGMA_ASSETS.icons.settings,
  },
];

export function AccountSidebar({ activeTab }: AccountSidebarProps) {
  const { user, unreadNotificationsCount, isHydrated } = useTapestory();
  const displayName = isHydrated && user ? user.fullName : "Ananya Rao";
  const badgeCount = isHydrated ? unreadNotificationsCount : 3;

  return (
    <aside
      className="flex flex-col gap-[24px] lg:gap-[28px] items-start lg:pt-[14px] w-full lg:w-[232px] shrink-0"
      data-node-id="25:57040"
    >
      <div
        className="flex flex-col gap-[9px] items-start w-full"
        data-node-id="25:57041"
      >
        <p
          className="font-sans text-[10px] tracking-[1.2px] text-[#706a60]"
          data-node-id="25:57042"
        >
          YOUR PERSONAL WARDROBE
        </p>
        <p
          className="font-serif text-[24px] text-[#172b24]"
          data-node-id="25:57043"
        >
          {displayName}
        </p>
        <p
          className="font-sans text-[12px] leading-[1.65] text-[#706a60]"
          data-node-id="25:57044"
        >
          A little more you.
        </p>
      </div>

      <nav
        aria-label="Customer account navigation"
        className="flex flex-row lg:flex-col gap-[5px] items-start overflow-x-auto pb-2 lg:pb-0 w-full"
        data-node-id="25:57045"
      >
        {ACCOUNT_NAV_ITEMS.map((item) => {
          const isActive = item.id === activeTab;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-[12px] lg:gap-[14px] h-[48px] lg:h-[52px] px-[14px] lg:px-[16px] shrink-0 lg:w-full transition-colors ${
                isActive
                  ? "bg-[#e6ebe5] border-b-2 lg:border-b-0 lg:border-l-2 border-[#172b24] font-semibold text-[#172b24]"
                  : "bg-[#f5f0e7] font-normal text-[#172b24] hover:bg-[#e9e0d3]/60"
              }`}
            >
              <img alt="" className="size-[20px] shrink-0" src={item.icon} />
              <span className="text-[13px] whitespace-nowrap">{item.label}</span>
              {item.id === "notifications" && badgeCount > 0 && (
                <span className="ml-auto text-[11px] font-medium text-[#172b24]">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div
        className="hidden lg:flex flex-col gap-[14px] items-start border-t border-[#e9e0d3] pt-[24px] w-full"
        data-node-id="25:57065"
      >
        <p
          className="font-serif italic text-[20px] text-[#b69a68]"
          data-node-id="25:57066"
        >
          Your fit. Your story.
        </p>
        <p
          className="font-sans text-[12px] leading-[1.65] text-[#706a60]"
          data-node-id="25:57067"
        >
          Thoughtful details, all in one place.
        </p>
        <Link
          href="/orders"
          className="flex items-center gap-[16px] border-b border-[#b69a68] pb-[8px] text-[14px] text-[#172b24] hover:opacity-80"
          data-node-id="5:6305"
        >
          <span>View My Orders</span>
          <img
            alt=""
            className="size-[16px]"
            src={FIGMA_ASSETS.icons.arrowUpRightDark}
          />
        </Link>
      </div>
    </aside>
  );
}
