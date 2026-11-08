"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import type { NotificationItem } from "@/types";

type FilterTab = "All" | "Order Updates" | "Offers & Launches" | "Style Recommendations";

function getNotificationIcon(iconType: NotificationItem["iconType"]) {
  switch (iconType) {
    case "scissors":
      return FIGMA_ASSETS.icons.scissorsGold;
    case "truck":
      return FIGMA_ASSETS.icons.truck;
    case "package":
      return FIGMA_ASSETS.icons.packageCheckGold;
    case "sparkles":
      return FIGMA_ASSETS.icons.sparkles;
    case "tag":
      return FIGMA_ASSETS.icons.tag;
    case "ruler":
      return FIGMA_ASSETS.icons.rulerTrust;
    case "shirt":
    default:
      return FIGMA_ASSETS.icons.shirtGold;
  }
}

export default function AccountNotificationsPage() {
  const {
    user,
    isHydrated,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
  } = useTapestory();

  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");
  const [clearedLocal, setClearedLocal] = useState(false);

  const filteredNotifications = clearedLocal
    ? []
    : notifications.filter((item) =>
        activeFilter === "All" ? true : item.category === activeFilter
      );

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]"
      data-node-id="25:57975"
    >
      <Header />

      <main
        className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 sm:px-8 lg:px-[72px] pt-8 lg:pt-[40px] pb-12 lg:pb-[64px] max-w-[1440px] w-full mx-auto"
        data-node-id="25:58006"
      >
        <AccountSidebar activeTab="notifications" />

        <div
          className="flex-1 flex flex-col gap-[32px] items-start w-full min-w-0"
          data-node-id="25:58039"
        >
          {/* Page Introduction */}
          <div className="flex flex-col gap-[14px] items-start w-full" data-node-id="25:58040">
            <nav aria-label="Breadcrumb" className="text-[14px] text-[#29251f]">
              <Link href="/" className="hover:underline">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:underline">
                My Account
              </Link>{" "}
              / <span className="text-[#172b24] font-medium">Notifications</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <h1
                className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
                data-node-id="25:58044"
              >
                Notifications
              </h1>
              <Link
                href="/account/settings"
                className="border border-[#172b24] h-[56px] px-[16px] inline-flex items-center text-[14px] text-[#172b24] hover:bg-[#e9e0d3]/60 transition-colors"
              >
                Notification Preferences
              </Link>
            </div>

            <p className="text-[14px] leading-[1.6] text-[#29251f]" data-node-id="25:58047">
              Stay updated on your orders, new collections and personalized recommendations.
            </p>
            <p className="text-[12px] leading-[1.65] text-[#706a60]" data-node-id="25:58048">
              Illustrative sample account · {isHydrated && user ? user.fullName : "Ananya Rao"} · Example information and UI states, as of 2 Nov 2026.
            </p>
          </div>

          {/* Inbox Actions */}
          <div
            className="flex flex-wrap items-center justify-between gap-4 w-full"
            data-node-id="25:58049"
          >
            <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24] uppercase">
              {clearedLocal ? 0 : unreadNotificationsCount} UNREAD ·{" "}
              {clearedLocal ? 0 : notifications.length} NOTIFICATIONS
            </span>

            <div className="flex flex-wrap gap-[24px] items-center">
              <button
                type="button"
                onClick={() => {
                  setClearedLocal(false);
                  markAllNotificationsAsRead();
                }}
                className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
              >
                <span>Mark All as Read</span>
                <img
                  alt=""
                  className="size-[16px]"
                  src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                />
              </button>
              <button
                type="button"
                onClick={() => setClearedLocal((prev) => !prev)}
                className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
              >
                <span>{clearedLocal ? "Restore Notifications" : "Clear Notifications"}</span>
                <img
                  alt=""
                  className="size-[16px]"
                  src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div
            className="border-b border-[#e9e0d3] flex gap-[28px] items-start overflow-x-auto w-full"
            data-node-id="25:58061"
          >
            {(
              [
                { id: "All", label: "All" },
                { id: "Order Updates", label: "Order Updates" },
                { id: "Offers & Launches", label: "Offers & Promotions" },
                { id: "Style Recommendations", label: "Product Recommendations" },
              ] as { id: FilterTab; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`py-[18px] text-[13px] whitespace-nowrap transition-colors ${
                  activeFilter === tab.id
                    ? "border-b-2 border-[#172b24] font-semibold text-[#172b24]"
                    : "text-[#172b24] hover:opacity-80"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notification Inbox List */}
          {filteredNotifications.length === 0 ? (
            <div className="bg-[#f5f0e7] border border-[#e9e0d3] p-8 flex flex-col gap-5 items-start w-full">
              <p className="font-serif text-[28px] text-[#172b24]">You’re all caught up.</p>
              <p className="text-[14px] text-[#29251f]">
                Order updates and saved-style inspiration will appear here when available.
              </p>
              <div className="flex gap-4">
                <Link
                  href="/products"
                  className="bg-[#172b24] text-white h-[48px] px-[20px] inline-flex items-center text-[14px]"
                >
                  Explore Collection
                </Link>
                {clearedLocal && (
                  <button
                    type="button"
                    onClick={() => setClearedLocal(false)}
                    className="border border-[#172b24] h-[48px] px-[20px] text-[14px] text-[#172b24]"
                  >
                    Restore Sample Inbox
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div
              className="flex flex-col gap-[12px] items-start w-full"
              data-node-id="25:58070"
            >
              {filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => markNotificationAsRead(item.id)}
                  className={`bg-white p-[24px] flex flex-col sm:flex-row gap-[20px] items-start w-full cursor-pointer transition-colors ${
                    !item.isRead
                      ? "border-t border-r border-b border-l-3 border-[#172b24]"
                      : "border border-[#e9e0d3]"
                  }`}
                  data-node-id="25:58071"
                >
                  <div className="bg-[#f5f0e7] size-[44px] flex items-center justify-center shrink-0">
                    <img
                      alt=""
                      className="size-[20px]"
                      src={getNotificationIcon(item.iconType)}
                    />
                  </div>

                  <div className="flex-1 flex flex-col gap-[10px] items-start w-full">
                    <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                      {item.category}
                    </p>
                    <p
                      className={`text-[15px] text-[#172b24] ${
                        !item.isRead ? "font-semibold" : "font-normal"
                      }`}
                    >
                      {item.title}
                    </p>
                    <p className="text-[14px] text-[#706a60] leading-[1.65]">{item.message}</p>

                    <div className="flex flex-wrap items-center justify-between gap-4 w-full pt-1">
                      <span className="text-[11px] text-[#706a60]">{item.timestamp}</span>
                      <Link
                        href={item.actionHref}
                        className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                      >
                        <span>{item.actionLabel}</span>
                        <img
                          alt=""
                          className="size-[16px]"
                          src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                        />
                      </Link>
                    </div>
                  </div>

                  <span className="text-[11px] text-[#172b24] shrink-0">
                    {!item.isRead ? "● Unread" : "Read"}
                  </span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[12px] text-[#706a60] leading-[1.65]" data-node-id="25:58183">
            Illustrative inbox only; no notifications have been sent. Offers & Promotions is currently Off; the older offer example remains in history. Order Updates and Product Recommendations are On. Email On · SMS Off.
          </p>

          {/* Alternate Experiences · Empty & Clear Confirmations */}
          <section
            className="border-t border-[#e9e0d3] pt-[36px] flex flex-col gap-[24px] w-full"
            data-node-id="25:58184"
          >
            <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
              ALTERNATE EXPERIENCES · ILLUSTRATIVE UI STATES
            </p>
            <h3 className="font-serif text-[24px] text-[#172b24]">A quieter inbox</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              <div className="bg-white border border-[#e9e0d3] p-6 sm:p-[28px] flex flex-col gap-[20px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  CLEAR NOTIFICATIONS · CONFIRMATION EXAMPLE
                </p>
                <p className="font-serif text-[24px] text-[#172b24]">
                  Clear your notification list?
                </p>
                <p className="text-[14px] text-[#706a60] leading-[1.65]">
                  This clears the inbox view, not your orders or notification preferences. Cancel to keep your list.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setClearedLocal(false)}
                    className="bg-[#172b24] text-white h-[48px] px-6 text-[13px] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setClearedLocal(true)}
                    className="border border-[#172b24] h-[48px] px-6 text-[13px] text-[#172b24]"
                  >
                    Clear Notifications
                  </button>
                </div>
              </div>

              <div className="bg-white border border-[#e9e0d3] p-6 sm:p-[28px] flex flex-col gap-[20px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  WHILE LOADING · EXAMPLE
                </p>
                <div className="flex items-center gap-[14px]">
                  <img alt="" className="size-[20px]" src={FIGMA_ASSETS.icons.loaderCircle} />
                  <span className="text-[14px] text-[#29251f]">Loading notifications…</span>
                </div>
                <p className="text-[12px] text-[#706a60] leading-[1.65]">
                  Your notification list will appear here.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
