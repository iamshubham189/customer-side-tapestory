"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";
import type { BodyMeasurements, MeasurementUnit } from "@/types";

const MEASUREMENT_ROWS: {
  key: keyof BodyMeasurements;
  label: string;
  guidance: string;
  fallbackCm: number;
}[] = [
  {
    key: "chest",
    label: "Chest / Bust",
    guidance: "Around the fullest part of your chest",
    fallbackCm: 96,
  },
  {
    key: "waist",
    label: "Waist",
    guidance: "At your natural waist",
    fallbackCm: 80,
  },
  {
    key: "seatHips",
    label: "Hip",
    guidance: "Around the widest part of your hips",
    fallbackCm: 98,
  },
  {
    key: "shoulderWidth",
    label: "Shoulder",
    guidance: "Shoulder point to point, across the back",
    fallbackCm: 44,
  },
  {
    key: "sleeveLength",
    label: "Sleeve Length",
    guidance: "Shoulder point to wrist, elbow slightly bent",
    fallbackCm: 61,
  },
  {
    key: "garmentLength",
    label: "Garment Length",
    guidance: "Shoulder beside neck to desired hem",
    fallbackCm: 72,
  },
  {
    key: "inseam",
    label: "Inseam",
    guidance: "Trousers only · Not required for this jacket",
    fallbackCm: 76,
  },
];

export default function AccountMeasurementsPage() {
  const {
    user,
    isHydrated,
    measurementProfiles,
    activeMeasurementProfileId,
    setActiveMeasurementProfileId,
    saveMeasurementProfile,
    setDefaultMeasurementProfile,
  } = useTapestory();

  const selectedProfile =
    measurementProfiles.find((m) => m.id === activeMeasurementProfileId) ??
    measurementProfiles[0];

  const [displayUnit, setDisplayUnit] = useState<MeasurementUnit>("cm");
  const [editingKey, setEditingKey] = useState<keyof BodyMeasurements | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [newForPerson, setNewForPerson] = useState("Ananya Rao");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const convertVal = (cmVal: number) => {
    if (displayUnit === "in") {
      return Number((cmVal / 2.54).toFixed(1));
    }
    return cmVal;
  };

  const handleStartRowEdit = (key: keyof BodyMeasurements, currentCm: number) => {
    setEditingKey(key);
    setEditValue(String(convertVal(currentCm)));
  };

  const handleSaveRowEdit = (key: keyof BodyMeasurements, label: string) => {
    if (!selectedProfile) return;
    const numeric = parseFloat(editValue);
    if (Number.isNaN(numeric) || numeric <= 0) return;
    const cmVal =
      displayUnit === "in" ? Math.round(numeric * 2.54 * 10) / 10 : Math.round(numeric * 10) / 10;

    saveMeasurementProfile({
      id: selectedProfile.id,
      name: selectedProfile.name,
      forPerson: selectedProfile.forPerson,
      genderFit: selectedProfile.genderFit,
      unit: "cm",
      method: selectedProfile.method,
      fitPreference: selectedProfile.fitPreference,
      postureNotes: selectedProfile.postureNotes,
      isDefault: selectedProfile.isDefault,
      values: {
        ...selectedProfile.values,
        [key]: cmVal,
      },
      changeNote: `Updated ${label} to ${cmVal} cm`,
    });
    setEditingKey(null);
    setStatusMessage(`Saved ${label} (${cmVal} cm) to ${selectedProfile.name}.`);
  };

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    const created = saveMeasurementProfile({
      name: newProfileName.trim(),
      forPerson: newForPerson.trim() || "Ananya Rao",
      genderFit: "Unisex",
      unit: "cm",
      method: "Manual Entry",
      fitPreference: "Relaxed / Easy",
      postureNotes: "Standard posture · Created from My Account",
      isDefault: false,
      values: {
        chest: 96,
        waist: 80,
        seatHips: 98,
        shoulderWidth: 44,
        sleeveLength: 61,
        garmentLength: 72,
        neckCircumference: 38,
        wristCircumference: 16.5,
        inseam: 76,
      },
      changeNote: `Profile created · ${newProfileName.trim()}`,
    });
    setNewProfileName("");
    setShowAddForm(false);
    setStatusMessage(`Created new measurement profile “${created.name}”.`);
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]"
      data-node-id="25:57333"
    >
      <Header />

      <main
        className="flex-1 flex flex-col lg:flex-row gap-8 lg:gap-[40px] items-start px-4 sm:px-8 lg:px-[72px] pt-8 lg:pt-[40px] pb-12 lg:pb-[64px] max-w-[1440px] w-full mx-auto"
        data-node-id="25:57364"
      >
        <AccountSidebar activeTab="measurements" />

        <div
          className="flex-1 flex flex-col gap-[32px] items-start w-full min-w-0"
          data-node-id="25:57397"
        >
          {/* Page Introduction */}
          <div className="flex flex-col gap-[14px] items-start w-full" data-node-id="25:57398">
            <nav aria-label="Breadcrumb" className="text-[14px] text-[#29251f]">
              <Link href="/" className="hover:underline">
                Home
              </Link>{" "}
              /{" "}
              <Link href="/account" className="hover:underline">
                My Account
              </Link>{" "}
              / <span className="text-[#172b24] font-medium">Measurements</span>
            </nav>

            <div className="flex flex-wrap items-center justify-between gap-4 w-full">
              <h1
                className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
                data-node-id="25:57402"
              >
                My Measurements
              </h1>
              <button
                type="button"
                onClick={() => setShowAddForm((prev) => !prev)}
                className="border border-[#172b24] h-[56px] px-[16px] text-[14px] text-[#172b24] hover:bg-[#e9e0d3]/60 transition-colors"
              >
                Add New Profile
              </button>
            </div>

            <p className="text-[14px] leading-[1.6] text-[#29251f]" data-node-id="25:57405">
              Keep your measurements updated for a consistently personalized fit.
            </p>
            <p className="text-[12px] leading-[1.65] text-[#706a60]" data-node-id="25:57406">
              Illustrative sample account · {isHydrated && user ? user.fullName : "Ananya Rao"} · Example information and UI states, as of 2 Nov 2026.
            </p>
          </div>

          {statusMessage && (
            <div className="bg-[#f5f0e7] border border-[#172b24] p-4 w-full flex items-center justify-between">
              <p className="text-[13px] text-[#172b24]">✓ {statusMessage}</p>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-[12px] text-[#706a60] underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {showAddForm && (
            <form
              onSubmit={handleCreateProfile}
              className="bg-white border-2 border-[#172b24] p-6 sm:p-[28px] w-full space-y-5"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-[24px] text-[#172b24]">Create New Fit Profile</h2>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-[12px] text-[#706a60] underline"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] mb-1">Profile Name</label>
                  <input
                    type="text"
                    required
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder="e.g., Winter Layering Fit · Demo"
                    className="w-full h-[52px] px-4 bg-white border border-[#e9e0d3] text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] mb-1">Measured For</label>
                  <input
                    type="text"
                    value={newForPerson}
                    onChange={(e) => setNewForPerson(e.target.value)}
                    className="w-full h-[52px] px-4 bg-white border border-[#e9e0d3] text-[14px]"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="h-[52px] px-6 bg-[#172b24] text-white text-[14px] font-medium"
                >
                  Save Profile
                </button>
                <Link
                  href="/measurements"
                  className="h-[52px] px-6 border border-[#172b24] text-[#172b24] text-[14px] inline-flex items-center"
                >
                  Open Full Guided Studio
                </Link>
              </div>
            </form>
          )}

          {/* Saved Measurement Profiles Grid */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-[24px] w-full"
            data-node-id="25:57407"
          >
            {measurementProfiles.map((profile) => {
              const isSelected = profile.id === selectedProfile?.id;
              return (
                <div
                  key={profile.id}
                  className={`bg-white p-6 sm:p-[28px] flex flex-col gap-[16px] items-start transition-colors ${
                    isSelected
                      ? "border-2 border-[#172b24]"
                      : "border border-[#e9e0d3]"
                  }`}
                  data-node-id="25:57408"
                >
                  <div className="flex items-start justify-between w-full">
                    <img alt="" className="size-[20px]" src={FIGMA_ASSETS.icons.rulerNav} />
                    <div className="flex items-center gap-2">
                      {profile.isDefault && (
                        <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24]">
                          DEFAULT {isSelected ? "· SELECTED" : ""}
                        </span>
                      )}
                      {!profile.isDefault && isSelected && (
                        <span className="bg-[#e9e0d3] px-[10px] py-[7px] text-[10px] tracking-[0.5px] text-[#172b24]">
                          SELECTED
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="font-serif text-[24px] text-[#172b24]">{profile.name}</p>
                  <p className="text-[14px] text-[#706a60]">
                    {profile.fitPreference} · {profile.genderFit}
                  </p>
                  <p className="text-[12px] text-[#706a60]">
                    Updated {profile.lastUpdated} · Version v{profile.version}
                  </p>
                  <p className="text-[14px] text-[#172b24]">
                    Chest {profile.values.chest} / Waist {profile.values.waist} / Hip{" "}
                    {profile.values.seatHips} cm
                  </p>

                  <div className="flex flex-wrap gap-[24px] items-center pt-1">
                    <button
                      type="button"
                      onClick={() => setActiveMeasurementProfileId(profile.id)}
                      className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                    >
                      <span>View Details</span>
                      <img
                        alt=""
                        className="size-[16px]"
                        src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                      />
                    </button>
                    <Link
                      href="/measurements"
                      onClick={() => setActiveMeasurementProfileId(profile.id)}
                      className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                    >
                      <span>Edit</span>
                      <img
                        alt=""
                        className="size-[16px]"
                        src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                      />
                    </Link>
                    {!profile.isDefault && (
                      <button
                        type="button"
                        onClick={() => setDefaultMeasurementProfile(profile.id)}
                        className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                      >
                        <span>Make Default</span>
                        <img
                          alt=""
                          className="size-[16px]"
                          src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                        />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add New Measurement Methods Card */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:57446"
          >
            <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57448">
              Add New Measurement
            </h2>
            <p className="text-[14px] text-[#706a60] leading-[1.65]" data-node-id="25:57449">
              Choose how you would like to start. Review your measurements before saving a new profile.
            </p>

            <div
              className="grid grid-cols-1 md:grid-cols-3 gap-[20px] w-full"
              data-node-id="25:57450"
            >
              <div className="bg-[#f5f0e7] p-[20px] flex flex-col gap-[16px] items-start">
                <img alt="" className="size-[20px]" src={FIGMA_ASSETS.icons.camera} />
                <p className="text-[15px] text-[#172b24]">AI Body Scan</p>
                <p className="text-[12px] text-[#706a60] leading-[1.65]">
                  Explore a camera-guided entry. No scan has been taken.
                </p>
                <Link
                  href="/measurements?method=scan"
                  className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24] mt-auto"
                >
                  <span>Choose AI Body Scan</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>

              <div className="bg-[#f5f0e7] p-[20px] flex flex-col gap-[16px] items-start">
                <img alt="" className="size-[20px]" src={FIGMA_ASSETS.icons.rulerNav} />
                <p className="text-[15px] text-[#172b24]">Manual Measurements</p>
                <p className="text-[12px] text-[#706a60] leading-[1.65]">
                  Enter values using a measuring tape.
                </p>
                <Link
                  href="/measurements?method=manual"
                  className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24] mt-auto"
                >
                  <span>Choose Manual Measurements</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>

              <div className="bg-[#f5f0e7] p-[20px] flex flex-col gap-[16px] items-start">
                <img alt="" className="size-[20px]" src={FIGMA_ASSETS.icons.bookOpen} />
                <p className="text-[15px] text-[#172b24]">Measurement Guide</p>
                <p className="text-[12px] text-[#706a60] leading-[1.65]">
                  See where and how to measure.
                </p>
                <Link
                  href="/measurements#measurement-instructions"
                  className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24] mt-auto"
                >
                  <span>Open Guide</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>
            </div>
          </section>

          {/* Selected Profile Detailed Measurement Table */}
          {selectedProfile && (
            <section
              className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
              data-node-id="25:57475"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57477">
                  {selectedProfile.name}
                </h2>
                <Link
                  href="/measurements"
                  className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>Edit Profile</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <p className="text-[14px] text-[#706a60]" data-node-id="25:57483">
                  Selected profile · {selectedProfile.method} · Updated {selectedProfile.lastUpdated}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setDisplayUnit("cm")}
                    className={`px-[10px] py-[7px] text-[10px] tracking-[0.5px] uppercase ${
                      displayUnit === "cm"
                        ? "bg-[#172b24] text-white"
                        : "bg-[#e9e0d3] text-[#172b24]"
                    }`}
                  >
                    SAVED VALUES · CM
                  </button>
                  <button
                    type="button"
                    onClick={() => setDisplayUnit("in")}
                    className={`px-[10px] py-[7px] text-[10px] tracking-[0.5px] uppercase ${
                      displayUnit === "in"
                        ? "bg-[#172b24] text-white"
                        : "bg-[#e9e0d3] text-[#172b24]"
                    }`}
                  >
                    INCHES
                  </button>
                </div>
              </div>

              <p className="text-[12px] text-[#706a60] leading-[1.65]" data-node-id="25:57486">
                Illustrative measurements, not results from a real body scan. Used for the Deep Green Linen Field Jacket and The Forest Weekender.
              </p>

              {/* Measurement Table */}
              <div className="w-full overflow-x-auto" data-node-id="25:57487">
                <div className="min-w-[640px] flex flex-col">
                  <div className="bg-[#e9e0d3] flex items-center p-[16px] text-[11px] text-[#29251f] font-medium">
                    <span className="w-[210px] shrink-0">MEASUREMENT</span>
                    <span className="w-[110px] shrink-0">SAVED VALUE</span>
                    <span className="w-[90px] shrink-0">UNIT</span>
                    <span className="flex-1">GUIDANCE</span>
                    <span className="w-[90px] text-right shrink-0">EDIT</span>
                  </div>

                  {MEASUREMENT_ROWS.map((row) => {
                    const rawCm = selectedProfile.values[row.key] ?? row.fallbackCm;
                    const shownVal = convertVal(rawCm);
                    const isRowEditing = editingKey === row.key;

                    return (
                      <div
                        key={row.key}
                        className="border-b border-[#e9e0d3] flex items-center px-[16px] py-[18px]"
                      >
                        <span className="w-[210px] shrink-0 text-[14px] text-[#172b24]">
                          {row.label}
                        </span>
                        <div className="w-[110px] shrink-0">
                          {isRowEditing ? (
                            <input
                              type="number"
                              step="0.5"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-[80px] h-[36px] px-2 border border-[#172b24] text-[14px] text-[#172b24]"
                            />
                          ) : (
                            <span className="text-[16px] text-[#172b24]">{shownVal}</span>
                          )}
                        </div>
                        <span className="w-[90px] shrink-0 text-[13px] text-[#29251f]">
                          {displayUnit}
                        </span>
                        <span className="flex-1 text-[12px] text-[#706a60]">{row.guidance}</span>
                        <div className="w-[90px] shrink-0 flex justify-end">
                          {isRowEditing ? (
                            <button
                              type="button"
                              onClick={() => handleSaveRowEdit(row.key, row.label)}
                              className="bg-[#172b24] text-white px-3 py-1.5 text-[12px]"
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleStartRowEdit(row.key, rawCm)}
                              className="border-b border-[#b69a68] pb-[6px] inline-flex items-center gap-[8px] text-[14px] text-[#172b24]"
                            >
                              <span>Edit</span>
                              <img
                                alt=""
                                className="size-[14px]"
                                src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                              />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 w-full">
                <p className="text-[12px] text-[#706a60] leading-[1.65]">
                  Display unit: {displayUnit} (selected) · Unit changes convert values; they do not change the saved fit.
                </p>
                <Link
                  href="/measurements#measurement-instructions"
                  className="border-b border-[#b69a68] pb-[8px] inline-flex items-center gap-[12px] text-[14px] text-[#172b24]"
                >
                  <span>Measurement Guide</span>
                  <img
                    alt=""
                    className="size-[16px]"
                    src={FIGMA_ASSETS.icons.arrowUpRightPrimary}
                  />
                </Link>
              </div>
            </section>
          )}

          {/* Measurement History Section */}
          <section
            className="bg-white border border-[#e9e0d3] flex flex-col gap-[22px] p-6 sm:p-[28px] w-full"
            data-node-id="25:57570"
          >
            <div className="flex items-center justify-between w-full">
              <h2 className="font-serif text-[24px] text-[#172b24]" data-node-id="25:57572">
                Measurement history
              </h2>
              <span className="text-[12px] text-[#706a60]">
                {selectedProfile?.history.length ?? 0} recorded versions
              </span>
            </div>

            <p className="text-[12px] text-[#706a60] leading-[1.65]" data-node-id="25:57577">
              Updates for {selectedProfile?.name}. Latest entry matches the saved values above.
            </p>

            <div className="flex flex-col w-full">
              {selectedProfile?.history.map((entry, idx) => (
                <div
                  key={`${entry.version}-${idx}`}
                  className="border-b border-[#e9e0d3] py-[16px] flex flex-col sm:flex-row gap-2 sm:gap-[24px] items-start"
                >
                  <p className="text-[13px] text-[#172b24] w-[120px] shrink-0">{entry.date}</p>
                  <div className="flex-1 flex flex-col gap-[6px]">
                    <p className="text-[14px] text-[#706a60] leading-[1.65]">
                      {entry.note} · {entry.summary}
                    </p>
                    <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                      {idx === 0 ? `Latest update · v${entry.version}` : `Version v${entry.version}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Alternate Experiences · Empty & Save States */}
          <section
            className="border-t border-[#e9e0d3] pt-[36px] flex flex-col gap-[24px] w-full"
            data-node-id="25:57588"
          >
            <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
              ALTERNATE EXPERIENCES · ILLUSTRATIVE UI STATES
            </p>
            <h3 className="font-serif text-[24px] text-[#172b24]">
              A fit profile, from the first entry
            </h3>

            <div className="bg-white border border-[#e9e0d3] p-6 sm:p-[28px] flex flex-col gap-[20px]">
              <p className="text-[10px] tracking-[1.2px] text-[#706a60] uppercase">
                BEFORE YOUR FIRST PROFILE · EMPTY EXAMPLE
              </p>
              <div className="bg-[#f5f0e7] p-6 sm:p-[32px] flex flex-col gap-[18px] items-start">
                <p className="font-serif text-[28px] text-[#172b24]">
                  A more personal fit starts here.
                </p>
                <p className="text-[14px] text-[#29251f]">
                  Save a set of measurements to use across your chosen garments.
                </p>
                <Link
                  href="/measurements"
                  className="bg-[#172b24] text-white h-[48px] px-[20px] inline-flex items-center text-[14px]"
                >
                  Add Your First Measurement
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
