"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, isHydrated, updateUserProfile, logoutUser } = useTapestory();

  const [language, setLanguage] = useState(user?.preferredLanguage ?? "English");
  const [orderUpdatesOn, setOrderUpdatesOn] = useState(true);
  const [offersOn, setOffersOn] = useState(false);
  const [recommendationsOn, setRecommendationsOn] = useState(true);
  const [emailNotificationsOn, setEmailNotificationsOn] = useState(true);
  const [smsNotificationsOn, setSmsNotificationsOn] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("••••••••••••");
  const [newPassword, setNewPassword] = useState("••••••••••••");
  const [confirmPassword, setConfirmPassword] = useState("••••••••••••");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [savedBanner, setSavedBanner] = useState<string | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSaveLanguage = () => {
    updateUserProfile({ preferredLanguage: language });
    setSavedBanner(`Language preference saved (${language}).`);
  };

  const handleSaveNotifications = () => {
    setSavedBanner(
      `Notification preferences saved · Order Updates: ${
        orderUpdatesOn ? "On" : "Off"
      }, Offers: ${offersOn ? "On" : "Off"}, Recommendations: ${
        recommendationsOn ? "On" : "Off"
      }.`
    );
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords don’t match. Re-enter your new password.");
      return;
    }
    setPasswordMessage("Your password has been updated.");
  };

  const handleConfirmLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]"
      data-node-id="25:58595"
    >
      <Header />

      <main
        className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 sm:px-8 lg:px-[72px] pt-8 lg:pt-[40px] pb-12 lg:pb-[64px] max-w-[1440px] w-full mx-auto"
        data-node-id="25:58626"
      >
        <AccountSidebar activeTab="settings" />

        <div
          className="flex-1 flex flex-col gap-[32px] items-start w-full min-w-0"
          data-node-id="25:58659"
        >
          {/* Page Introduction */}
          <div className="flex flex-col gap-[14px] items-start w-full" data-node-id="25:58660">
            <nav aria-label="Breadcrumb" className="text-[14px] text-[#29251f]">
              <Link href="/" className="hover:underline">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:underline">
                My Account
              </Link>{" "}
              / <span className="text-[#172b24] font-medium">Settings</span>
            </nav>

            <h1
              className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
              data-node-id="25:58664"
            >
              Settings
            </h1>

            <p className="text-[14px] leading-[1.6] text-[#29251f]" data-node-id="25:58665">
              Manage your account preferences and privacy.
            </p>
            <p className="text-[12px] leading-[1.65] text-[#706a60]" data-node-id="25:58666">
              Illustrative sample account · {isHydrated && user ? user.fullName : "Ananya Rao"} · Example information and UI states, as of 2 Nov 2026.
            </p>
          </div>

          {savedBanner && (
            <div className="bg-[#f5f0e7] border border-[#172b24] p-4 w-full flex items-center justify-between">
              <p className="text-[13px] text-[#172b24]">✓ {savedBanner}</p>
              <button
                type="button"
                onClick={() => setSavedBanner(null)}
                className="text-[12px] text-[#706a60] underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Language Preferences */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:58667"
          >
            <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:58669">
              Language Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[32px] items-start w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#29251f]">Select Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                >
                  <option value="English">English</option>
                  <option value="English (India) · INR (₹)">English (India) · INR (₹)</option>
                  <option value="Hindi (हिन्दी)">Hindi (हिन्दी)</option>
                </select>
                <span className="text-[12px] text-[#706a60]">Default language: English</span>
              </div>

              <div className="flex flex-col gap-[10px] md:pt-[20px] text-[#706a60]">
                <p className="text-[14px] leading-[1.65]" data-node-id="25:58683">
                  Choose the language you prefer for your account.
                </p>
                <p className="text-[12px] leading-[1.65]" data-node-id="25:58684">
                  English is shown in this illustrative experience; this is not a list of all supported languages.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveLanguage}
              className="bg-[#172b24] text-white h-[56px] px-[24px] rounded-[2px] inline-flex items-center gap-[20px] text-[14px] font-medium self-start hover:bg-[#172b24]/95 transition-colors"
            >
              <span>Save Preferences</span>
              <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.arrowUpRightMuted} />
            </button>
          </section>

          {/* Notification Preferences */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:58689"
          >
            <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:58691">
              Notification preferences
            </h2>
            <p className="text-[14px] text-[#706a60] leading-[1.65]" data-node-id="25:58692">
              Choose the topics you want to hear about, then your preferred channels. These choices match your Profile Overview.
            </p>

            <div className="flex flex-col w-full" data-node-id="25:58693">
              {[
                {
                  title: "Order Updates",
                  desc: "Updates about your orders and their recorded tailoring stages.",
                  checked: orderUpdatesOn,
                  toggle: () => setOrderUpdatesOn((v) => !v),
                },
                {
                  title: "Offers & Promotions",
                  desc: "Seasonal edits and promotional messages.",
                  checked: offersOn,
                  toggle: () => setOffersOn((v) => !v),
                },
                {
                  title: "Product Recommendations",
                  desc: "Style suggestions related to your saved preferences.",
                  checked: recommendationsOn,
                  toggle: () => setRecommendationsOn((v) => !v),
                },
                {
                  title: "Email Notifications",
                  desc: `Use ${user?.email ?? "ananya.rao@example.com"} for selected updates.`,
                  checked: emailNotificationsOn,
                  toggle: () => setEmailNotificationsOn((v) => !v),
                },
                {
                  title: "SMS Notifications",
                  desc: "Use the saved example phone number for selected updates.",
                  checked: smsNotificationsOn,
                  toggle: () => setSmsNotificationsOn((v) => !v),
                },
              ].map((pref) => (
                <div
                  key={pref.title}
                  className="border-b border-[#e9e0d3] py-[18px] flex items-center justify-between gap-[24px] w-full"
                >
                  <div className="flex flex-col gap-[6px]">
                    <p className="text-[14px] text-[#172b24]">{pref.title}</p>
                    <p className="text-[12px] text-[#706a60] leading-[1.65]">{pref.desc}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[12px] text-[#172b24]">
                      {pref.checked ? "On" : "Off"}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={pref.checked}
                      onClick={pref.toggle}
                      className={`w-[44px] h-[24px] rounded-full p-0.5 transition-colors flex items-center ${
                        pref.checked ? "bg-[#172b24] justify-end" : "bg-[#e9e0d3] justify-start"
                      }`}
                    >
                      <span className="size-[20px] rounded-full bg-white block shadow-xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[12px] text-[#706a60] leading-[1.65]">
              Saved preference example · Order updates and recommendations On, offers Off. Email On · SMS Off.
            </p>

            <button
              type="button"
              onClick={handleSaveNotifications}
              className="bg-[#172b24] text-white h-[56px] px-[24px] rounded-[2px] inline-flex items-center gap-[20px] text-[14px] font-medium self-start hover:bg-[#172b24]/95 transition-colors"
            >
              <span>Save Notification Preferences</span>
              <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.arrowUpRightMuted} />
            </button>
          </section>

          {/* Privacy & Security */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:58734"
          >
            <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:58736">
              Privacy & Security
            </h2>
            <p className="text-[14px] text-[#706a60] leading-[1.65]">
              Review your saved information and manage how you access your account.
            </p>

            <div className="flex flex-col w-full">
              <div className="border-b border-[#e9e0d3] py-[18px] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px] text-[#172b24]">Personal Information Preferences</p>
                  <p className="text-[12px] text-[#706a60]">
                    Gender / Style Preference: Prefer not to disclose. Date of birth: Not provided.
                  </p>
                </div>
                <Link
                  href="/account"
                  className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>Edit Preferences</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>

              <div className="border-b border-[#e9e0d3] py-[18px] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px] text-[#172b24]">Data and Privacy Information</p>
                  <p className="text-[12px] text-[#706a60]">
                    Read information about account data, saved measurements and future camera consent before deciding what to share.
                  </p>
                </div>
                <a
                  href="#password-change-section"
                  className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>View Information</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </a>
              </div>

              <div className="border-b border-[#e9e0d3] py-[18px] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px] text-[#172b24]">Change Password</p>
                  <p className="text-[12px] text-[#706a60]">
                    Password values are never displayed in your profile.
                  </p>
                </div>
                <a
                  href="#password-change-section"
                  className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>Change Password</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </a>
              </div>

              <div className="py-[18px] flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[14px] text-[#172b24]">Login Information</p>
                  <p className="text-[12px] text-[#706a60]">
                    Account email: {user?.email ?? "ananya.rao@example.com"} · Example account.
                  </p>
                </div>
                <Link
                  href="/account"
                  className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>View Login Information</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>
            </div>
          </section>

          {/* Account Management (Logout & Deletion Request) */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:58778"
          >
            <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:58780">
              Account Management
            </h2>

            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex flex-col gap-[8px]">
                <p className="text-[15px] text-[#172b24]">Logout</p>
                <p className="text-[12px] text-[#706a60]">
                  Leave this account on the current browser.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLogoutDialog(true)}
                className="border border-[#172b24] h-[56px] px-[20px] text-[14px] text-[#172b24] hover:bg-[#f5f0e7] transition-colors"
              >
                Logout
              </button>
            </div>

            <div className="border-t border-[#e9e0d3] pt-[24px] flex flex-wrap items-center justify-between gap-4 w-full">
              <div className="flex flex-col gap-[8px]">
                <p className="text-[15px] text-[#86483a]">Delete Account request</p>
                <p className="text-[12px] text-[#706a60]">
                  Review the confirmation before requesting account deletion. This is not an instant delete action.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowDeleteDialog(true)}
                className="border border-[#172b24] h-[56px] px-[20px] text-[14px] text-[#172b24] hover:bg-[#f5f0e7] transition-colors"
              >
                Request Deletion
              </button>
            </div>
          </section>

          {/* Change Password & Confirmation Dialogs Section (Figma 25:58793) */}
          <section
            id="password-change-section"
            className="border-t border-[#e9e0d3] pt-[36px] flex flex-col gap-[24px] w-full"
            data-node-id="25:58793"
          >
            <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
              ALTERNATE EXPERIENCES · ILLUSTRATIVE UI STATES
            </p>
            <h3 className="font-serif text-[24px] text-[#172b24]">
              Review before making a change
            </h3>

            {/* Change Password Form */}
            <form
              onSubmit={handleSavePassword}
              className="bg-white border border-[#e9e0d3] p-6 sm:p-[28px] flex flex-col gap-[22px] w-full"
              data-node-id="25:58796"
            >
              <h4 className="font-serif text-[24px] text-[#172b24]">Change Password</h4>
              <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                PASSWORD EDITING · ALTERNATE EXAMPLE
              </p>

              {passwordMessage && (
                <div className="bg-[#f5f0e7] border border-[#172b24] p-4 text-[13px] text-[#172b24]">
                  {passwordMessage}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#29251f]">Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#29251f]">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] items-start w-full">
                <div className="flex flex-col gap-2">
                  <label className="text-[12px] text-[#29251f]">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px]"
                  />
                  <span className="text-[12px] text-[#706a60]">Must match the new password.</span>
                </div>
                <p className="text-[12px] text-[#706a60] leading-[1.65] md:pt-[24px]">
                  Masked example values only. If confirmation does not match, show: “Passwords don’t match. Re-enter your new password.”
                </p>
              </div>

              <div className="flex gap-[16px]">
                <button
                  type="submit"
                  className="bg-[#172b24] text-white h-[56px] px-[24px] rounded-[2px] inline-flex items-center gap-[16px] text-[14px] font-medium"
                >
                  <span>Save Password</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightMuted}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setPasswordMessage(null)}
                  className="border border-[#172b24] h-[56px] px-[16px] text-[14px] text-[#172b24]"
                >
                  Cancel
                </button>
              </div>
            </form>

            {/* Logout & Deletion Confirmation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              <div
                className={`bg-white p-6 sm:p-[28px] flex flex-col gap-[18px] ${
                  showLogoutDialog
                    ? "border-2 border-[#172b24]"
                    : "border border-[#e9e0d3]"
                }`}
              >
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  LOGOUT · CONFIRMATION DIALOG
                </p>
                <img alt="" className="size-[24px]" src={FIGMA_ASSETS.icons.logOut} />
                <p className="font-serif text-[24px] text-[#172b24]">Ready to leave?</p>
                <p className="text-[14px] text-[#706a60] leading-[1.65]">
                  Log out of {user?.fullName ?? "Ananya Rao"}’s account on this browser? Save any changes you want to keep before continuing.
                </p>
                <div className="flex gap-[16px] pt-2">
                  <button
                    type="button"
                    onClick={() => setShowLogoutDialog(false)}
                    className="bg-[#172b24] text-white h-[52px] px-[20px] text-[14px] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmLogout}
                    className="border border-[#172b24] h-[52px] px-[20px] text-[14px] text-[#172b24]"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div
                className={`bg-white p-6 sm:p-[28px] flex flex-col gap-[18px] ${
                  showDeleteDialog
                    ? "border-2 border-[#86483a]"
                    : "border border-[#e9e0d3]"
                }`}
              >
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  DELETION REQUEST · CONFIRMATION DIALOG
                </p>
                <img alt="" className="size-[24px]" src={FIGMA_ASSETS.icons.triangleAlert} />
                <p className="font-serif text-[24px] text-[#172b24]">
                  Request account deletion?
                </p>
                <p className="text-[14px] text-[#706a60] leading-[1.65]">
                  Our concierge team reviews deletion requests to ensure any active tailoring orders or refunds are settled first.
                </p>
                <div className="flex gap-[16px] pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteDialog(false)}
                    className="bg-[#172b24] text-white h-[52px] px-[20px] text-[14px] font-medium"
                  >
                    Keep Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteDialog(false);
                      setSavedBanner(
                        "Account deletion review request logged with Tapestory Concierge."
                      );
                    }}
                    className="border border-[#86483a] h-[52px] px-[20px] text-[14px] text-[#86483a]"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
