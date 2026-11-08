"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import type { Address } from "@/types";

export default function AccountProfileOverviewPage() {
  const {
    user,
    updateUserProfile,
    addresses,
    saveAddress,
    setDefaultAddress,
    deleteAddress,
    measurementProfiles,
    isHydrated,
  } = useTapestory();

  const [fullName, setFullName] = useState(user?.fullName ?? "Ananya Rao");
  const [email, setEmail] = useState(user?.email ?? "ananya.rao@example.com");
  const [phone, setPhone] = useState(user?.phone ?? "+91 90000 00000");
  const [dob, setDob] = useState("Not provided");
  const [stylePreference, setStylePreference] = useState("Prefer not to disclose");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSavedMessage, setProfileSavedMessage] = useState<string | null>(null);

  // Address Modal / Inline Add-Edit Form State
  const [editingAddress, setEditingAddress] = useState<Partial<Address> | null>(null);
  const [confirmDeleteAddressId, setConfirmDeleteAddressId] = useState<string | null>(null);

  const defaultProfile =
    measurementProfiles.find((m) => m.isDefault) ?? measurementProfiles[0];

  const handleSavePersonalDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSavedMessage(null);
    setTimeout(() => {
      updateUserProfile({
        fullName: fullName.trim() || "Ananya Rao",
        email: email.trim() || "ananya.rao@example.com",
        phone: phone.trim() || "+91 90000 00000",
      });
      setIsSavingProfile(false);
      setProfileSavedMessage("Your details are updated. Your saved profile summary reflects your changes.");
    }, 350);
  };

  const handleResetPersonalDetails = () => {
    setFullName(user?.fullName ?? "Ananya Rao");
    setEmail(user?.email ?? "ananya.rao@example.com");
    setPhone(user?.phone ?? "+91 90000 00000");
    setDob("Not provided");
    setStylePreference("Prefer not to disclose");
    setProfileSavedMessage(null);
  };

  const handleSaveAddressForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    saveAddress({
      id: editingAddress.id,
      label: (editingAddress.label as Address["label"]) || "Home",
      recipientName: editingAddress.recipientName || fullName,
      phone: editingAddress.phone || phone,
      line1: editingAddress.line1 || "24 Gulmohar Lane, Indiranagar",
      line2: editingAddress.line2 || "",
      city: editingAddress.city || "Bengaluru",
      state: editingAddress.state || "Karnataka",
      postalCode: editingAddress.postalCode || "560038",
      country: editingAddress.country || "India",
      isDefault: Boolean(editingAddress.isDefault),
    });
    setEditingAddress(null);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]"
      data-node-id="25:57008"
    >
      <Header />

      <main
        className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 sm:px-8 lg:px-[72px] pt-8 lg:pt-[40px] pb-12 lg:pb-[64px] max-w-[1440px] w-full mx-auto"
        data-node-id="25:57039"
      >
        <AccountSidebar activeTab="profile" />

        <div
          className="flex-1 flex flex-col gap-[32px] items-start w-full min-w-0"
          data-node-id="25:57072"
        >
          {/* Page Introduction */}
          <div className="flex flex-col gap-[14px] items-start w-full" data-node-id="25:57073">
            <nav aria-label="Breadcrumb" className="text-[14px] text-[#29251f]">
              <Link href="/" className="hover:underline">
                Home
              </Link>{" "}
              / <span className="text-[#172b24] font-medium">My Account</span>
            </nav>
            <h1
              className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
              data-node-id="25:57077"
            >
              My Account
            </h1>
            <p className="text-[14px] leading-[1.6] text-[#29251f]" data-node-id="25:57078">
              Manage your personal details, preferences and saved information.
            </p>
            <p className="text-[12px] leading-[1.65] text-[#706a60]" data-node-id="25:57079">
              Illustrative sample account · {isHydrated && user ? user.fullName : "Ananya Rao"} · Example information and UI states, as of 2 Nov 2026.
            </p>
          </div>

          {/* Profile Summary Banner */}
          <section
            className="bg-[#172b24] flex flex-col sm:flex-row sm:items-center gap-[24px] p-6 sm:p-[28px] w-full"
            data-node-id="25:57080"
          >
            <div className="relative rounded-full size-[88px] shrink-0 overflow-hidden border border-[#b69a68]/40">
              <img
                alt={fullName}
                className="size-full object-cover"
                src={FIGMA_ASSETS.images.portraitAccountCustomer}
              />
            </div>

            <div className="flex-1 flex flex-col gap-[8px] text-[#f5f0e7] min-w-0">
              <p className="font-serif text-[28px] leading-tight" data-node-id="25:57083">
                {isHydrated && user ? user.fullName : "Ananya Rao"}
              </p>
              <p className="text-[13px] text-[#f5f0e7]/90" data-node-id="25:57084">
                {isHydrated && user ? user.email : "ananya.rao@example.com"}
              </p>
              <p className="text-[12px] text-[#f5f0e7]/80" data-node-id="25:57085">
                {isHydrated && user ? user.phone : "+91 90000 00000"} · Example contact
              </p>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-[12px] shrink-0">
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24] uppercase">
                PROFILE SUMMARY · VIEW ONLY
              </span>
              <a
                href="#personal-details-form"
                className="border border-[#b69a68] h-[52px] px-[18px] inline-flex items-center justify-center text-[14px] text-[#f5f0e7] hover:bg-[#b69a68]/15 transition-colors"
              >
                Edit Profile
              </a>
            </div>
          </section>

          {/* Personal Details Edit Section */}
          <form
            id="personal-details-form"
            onSubmit={handleSavePersonalDetails}
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:57092"
          >
            <div className="flex items-center justify-between w-full">
              <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57094">
                Personal details
              </h2>
              <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24]">
                EDIT MODE
              </span>
            </div>

            <p className="text-[14px] text-[#706a60] leading-[1.65]" data-node-id="25:57096">
              Editing your details · Save below to update your personal wardrobe profile.
            </p>

            {profileSavedMessage && (
              <div
                className="bg-[#f5f0e7] border border-[#172b24] p-5 flex items-start gap-4"
                data-node-id="5:7756"
              >
                <span className="text-[20px] text-[#172b24]">✓</span>
                <div>
                  <p className="text-[16px] text-[#172b24]">Your details are updated.</p>
                  <p className="text-[13px] text-[#29251f] mt-1">{profileSavedMessage}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#29251f]">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#29251f]">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#29251f]">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                />
                <span className="text-[12px] text-[#706a60]">Illustrative contact number</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#29251f]">Date of Birth</label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  placeholder="DD / MM / YYYY"
                  className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                />
                <span className="text-[12px] text-[#706a60]">Optional · DD / MM / YYYY</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] items-start w-full">
              <div className="flex flex-col gap-2">
                <label className="text-[12px] text-[#29251f]">Gender / Style Preference</label>
                <select
                  value={stylePreference}
                  onChange={(e) => setStylePreference(e.target.value)}
                  className="h-[56px] px-[15px] bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                >
                  <option value="Prefer not to disclose">Prefer not to disclose</option>
                  <option value="Unisex & Gender-Neutral">Unisex & Gender-Neutral</option>
                  <option value="Women’s Silhouettes">Women’s Silhouettes</option>
                  <option value="Men’s Silhouettes">Men’s Silhouettes</option>
                  <option value="All Wardrobes">All Wardrobes</option>
                </select>
                <span className="text-[12px] text-[#706a60]">
                  Optional. Explore Men, Women and Unisex freely.
                </span>
              </div>
              <div className="md:pt-[26px]">
                <p className="text-[14px] leading-[1.65] text-[#706a60]" data-node-id="25:57150">
                  Style is personal. Clothing preferences below help you keep your favourite silhouettes together.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-[16px] items-center">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="bg-[#172b24] text-white h-[56px] px-[24px] rounded-[2px] flex items-center gap-[20px] text-[14px] font-medium hover:bg-[#172b24]/95 transition-colors"
                data-node-id="5:6229"
              >
                <span>{isSavingProfile ? "Saving your changes…" : "Save Changes"}</span>
                <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.arrowUpRightMuted} />
              </button>
              <button
                type="button"
                onClick={handleResetPersonalDetails}
                className="border border-[#172b24] h-[56px] px-[16px] text-[14px] text-[#172b24] hover:bg-[#f5f0e7] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>

          {/* Default Addresses Section */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:57158"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57160">
                Default addresses
              </h2>
              <button
                type="button"
                onClick={() =>
                  setEditingAddress({
                    label: "Home",
                    recipientName: fullName,
                    phone,
                    line1: "",
                    city: "Bengaluru",
                    state: "Karnataka",
                    postalCode: "560038",
                    country: "India",
                    isDefault: false,
                  })
                }
                className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[16px] text-[14px] text-[#172b24] hover:opacity-80"
              >
                <span>Add New Address</span>
                <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.arrowUpRightPrimary} />
              </button>
            </div>

            {editingAddress && (
              <form
                onSubmit={handleSaveAddressForm}
                className="bg-[#f5f0e7] border border-[#172b24] p-6 space-y-4 w-full"
              >
                <div className="flex items-center justify-between">
                  <p className="font-serif text-[20px] text-[#172b24]">
                    {editingAddress.id ? "Edit Address" : "Add New Address"}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEditingAddress(null)}
                    className="text-[12px] text-[#706a60] underline"
                  >
                    Close
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[12px] mb-1">Address Label</label>
                    <select
                      value={editingAddress.label ?? "Home"}
                      onChange={(e) =>
                        setEditingAddress({
                          ...editingAddress,
                          label: e.target.value as Address["label"],
                        })
                      }
                      className="w-full h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Atelier Pickup">Atelier Pickup</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[12px] mb-1">Recipient Name</label>
                    <input
                      type="text"
                      required
                      value={editingAddress.recipientName ?? ""}
                      onChange={(e) =>
                        setEditingAddress({ ...editingAddress, recipientName: e.target.value })
                      }
                      className="w-full h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editingAddress.phone ?? ""}
                      onChange={(e) =>
                        setEditingAddress({ ...editingAddress, phone: e.target.value })
                      }
                      className="w-full h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[12px] mb-1">Street / Building Line 1</label>
                    <input
                      type="text"
                      required
                      value={editingAddress.line1 ?? ""}
                      onChange={(e) =>
                        setEditingAddress({ ...editingAddress, line1: e.target.value })
                      }
                      placeholder="24 Gulmohar Lane, Indiranagar"
                      className="w-full h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] mb-1">City, State & PIN</label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        required
                        value={editingAddress.city ?? ""}
                        onChange={(e) =>
                          setEditingAddress({ ...editingAddress, city: e.target.value })
                        }
                        placeholder="City"
                        className="h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                      />
                      <input
                        type="text"
                        required
                        value={editingAddress.state ?? ""}
                        onChange={(e) =>
                          setEditingAddress({ ...editingAddress, state: e.target.value })
                        }
                        placeholder="State"
                        className="h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                      />
                      <input
                        type="text"
                        required
                        value={editingAddress.postalCode ?? ""}
                        onChange={(e) =>
                          setEditingAddress({ ...editingAddress, postalCode: e.target.value })
                        }
                        placeholder="PIN"
                        className="h-[48px] px-3 bg-white border border-[#e9e0d3] text-[13px]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="h-[48px] px-6 bg-[#172b24] text-white text-[13px] font-medium"
                  >
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingAddress(null)}
                    className="h-[48px] px-4 border border-[#172b24] text-[13px] text-[#172b24]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
              data-node-id="25:57165"
            >
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-[#e9e0d3] flex flex-col gap-[16px] p-[24px]"
                  data-node-id="25:57166"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-[10px]">
                      <img
                        alt=""
                        className="size-[20px]"
                        src={
                          addr.label === "Work"
                            ? FIGMA_ASSETS.icons.briefcase
                            : FIGMA_ASSETS.icons.house
                        }
                      />
                      <span className="text-[14px] text-[#172b24]">{addr.label}</span>
                    </div>
                    {addr.isDefault && (
                      <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24]">
                        DEFAULT ADDRESS
                      </span>
                    )}
                  </div>

                  <p className="text-[14px] text-[#172b24]">{addr.recipientName}</p>

                  <div className="text-[14px] text-[#706a60] leading-[1.65]">
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p>{addr.country}</p>
                  </div>

                  <p className="text-[12px] text-[#706a60]">{addr.phone} · Example contact</p>

                  <div className="flex flex-wrap gap-[24px] items-center pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingAddress(addr)}
                      className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                    >
                      <span>Edit</span>
                      <img
                        alt=""
                        className="size-[16px]"
                        src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                      />
                    </button>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteAddressId(addr.id)}
                        className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                      >
                        <span>Delete</span>
                        <img
                          alt=""
                          className="size-[16px]"
                          src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                        />
                      </button>
                    )}
                    {!addr.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultAddress(addr.id)}
                        className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                      >
                        <span>Set as Default</span>
                        <img
                          alt=""
                          className="size-[16px]"
                          src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                        />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[12px] text-[#706a60] leading-[1.65]" data-node-id="25:57206">
              Addresses and contact details are examples. Home matches the sample delivery address used in My Orders.
            </p>
          </section>

          {/* Saved Fit & Preferences 2-Column Section */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
            data-node-id="25:57207"
          >
            {/* Your Saved Fit */}
            <section
              className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px]"
              data-node-id="25:57208"
            >
              <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57210">
                Your saved fit
              </h2>
              <div className="flex gap-[20px] items-start">
                <img
                  alt=""
                  className="size-[28px] shrink-0"
                  src={FIGMA_ASSETS.icons.rulerTrust}
                />
                <div className="flex flex-col gap-[12px] items-start">
                  <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24] uppercase">
                    {measurementProfiles.length} SAVED PROFILES
                  </span>
                  <p className="text-[15px] text-[#172b24]" data-node-id="25:57216">
                    {defaultProfile?.name ?? "Everyday Fit · Demo"}
                  </p>
                  <p className="text-[12px] text-[#706a60] leading-[1.65]" data-node-id="25:57217">
                    Default profile · Updated {defaultProfile?.lastUpdated ?? "28 Oct 2026"}
                  </p>
                  <Link
                    href="/account/measurements"
                    className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[16px] text-[14px] text-[#172b24] hover:opacity-80"
                  >
                    <span>View Measurements</span>
                    <img
                      alt=""
                      className="size-[16px]"
                      src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                    />
                  </Link>
                </div>
              </div>
            </section>

            {/* Your Preferences */}
            <section
              className="bg-white border border-[#e9e0d3] flex flex-col gap-[18px] p-6 sm:p-[28px]"
              data-node-id="25:57222"
            >
              <div className="flex items-center justify-between w-full">
                <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57224">
                  Your preferences
                </h2>
                <Link
                  href="/account/settings"
                  className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>Edit</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>

              <div>
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  PREFERRED CLOTHING CATEGORIES
                </p>
                <p className="text-[14px] text-[#706a60] leading-[1.65] mt-1">
                  Jackets · Shirts · Dresses · Unisex layers
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  STYLE PREFERENCES
                </p>
                <p className="text-[14px] text-[#706a60] leading-[1.65] mt-1">
                  Relaxed silhouettes · Natural fabrics · Earth tones
                </p>
              </div>

              <div>
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  COMMUNICATION
                </p>
                <p className="text-[12px] text-[#706a60] leading-[1.65] mt-1">
                  Order updates & recommendations: On
                  <br />
                  Offers: Off · Email: On · SMS: Off
                </p>
              </div>

              <Link
                href="/account/settings"
                className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[16px] text-[14px] text-[#172b24] self-start hover:opacity-80"
              >
                <span>Manage in Settings</span>
                <img
                  alt=""
                  className="size-[16px]"
                  src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                />
              </Link>
            </section>
          </div>

          {/* Alternate Experiences · Illustrative UI States (from Figma 25:57239) */}
          <section
            className="border-t border-[#e9e0d3] pt-[36px] flex flex-col gap-[24px] w-full"
            data-node-id="25:57239"
          >
            <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
              ALTERNATE EXPERIENCES · ILLUSTRATIVE UI STATES
            </p>
            <h3 className="font-serif text-[24px] text-[#172b24]">When your details change</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full">
              <div className="flex flex-col gap-[12px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  WHILE SAVING · EXAMPLE
                </p>
                <div className="bg-white border border-[#e9e0d3] p-[28px] flex flex-col gap-[16px]">
                  <div className="flex items-center gap-[12px]">
                    <img alt="" className="size-[20px]" src={FIGMA_ASSETS.icons.loaderCircle} />
                    <span className="text-[14px] text-[#29251f]">Saving your changes…</span>
                  </div>
                  <p className="text-[12px] text-[#706a60] leading-[1.65]">
                    Keep this page open until saving finishes.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  AFTER SAVE · EXAMPLE
                </p>
                <div className="bg-[#f5f0e7] border border-[#172b24] p-[22px] flex items-start gap-[16px]">
                  <span className="text-[20px] text-[#172b24]">✓</span>
                  <div>
                    <p className="text-[16px] text-[#172b24]">Your details are updated.</p>
                    <p className="text-[13px] text-[#29251f] mt-1">
                      Your saved profile summary reflects your changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {confirmDeleteAddressId && (
              <div className="bg-white border border-[#172b24] p-[28px] flex flex-col gap-[18px]">
                <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                  REMOVE ADDRESS · CONFIRMATION
                </p>
                <p className="font-serif text-[24px] text-[#172b24]">
                  Delete this saved address?
                </p>
                <p className="text-[14px] text-[#706a60] leading-[1.65]">
                  This removes the address from your saved list. Past orders keep their recorded delivery address.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      deleteAddress(confirmDeleteAddressId);
                      setConfirmDeleteAddressId(null);
                    }}
                    className="h-[48px] px-6 bg-[#172b24] text-white text-[13px] font-medium"
                  >
                    Confirm Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAddressId(null)}
                    className="h-[48px] px-6 border border-[#172b24] text-[13px] text-[#172b24]"
                  >
                    Keep Address
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
