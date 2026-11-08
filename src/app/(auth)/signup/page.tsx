"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";

export default function SignupPage() {
  const router = useRouter();
  const { loginUser } = useTapestory();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [password, setPassword] = useState("");
  const [preferredFit, setPreferredFit] = useState("Relaxed / Easy");
  const [preferredUnit, setPreferredUnit] = useState<"cm" | "in">("cm");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginUser({
        fullName: fullName.trim() || "Ananya Rao",
        email: email.trim() || "ananya.rao@tapestory.in",
        phone: phone.trim() || "+91 98765 43210",
        preferredFit,
        preferredUnit,
        memberSince: "November 2026",
        verifiedEmail: true,
        verifiedPhone: true,
      });
      setIsSubmitting(false);
      router.push("/account");
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]">
      <Header />

      <main className="flex-1 px-4 sm:px-8 lg:px-[72px] py-10 lg:py-16">
        <div className="mx-auto max-w-[1120px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Visual Panel */}
          <div className="lg:col-span-5 bg-[#172b24] text-[#f5f0e7] p-8 sm:p-10 flex flex-col justify-between">
            <div className="space-y-4">
              <p className="text-[11px] tracking-[1.5px] uppercase text-[#b69a68]">
                BEGIN YOUR BESPOKE JOURNEY
              </p>
              <h1 className="font-serif text-[34px] sm:text-[40px] leading-[1.2] tracking-[-0.8px]">
                Clothing made to your fit, from the first thread.
              </h1>
              <p className="text-[14px] leading-[1.7] text-[#e9e0d3]">
                Create your Tapestory account to save personal measurements, build custom designs in the studio and preview silhouettes on a 3D avatar.
              </p>
            </div>

            <div className="my-8 space-y-4 border-t border-b border-[#b69a68]/30 py-6">
              <div className="flex items-start gap-3">
                <img alt="" className="size-5 mt-0.5" src={FIGMA_ASSETS.icons.rulerStep} />
                <div>
                  <p className="text-[13px] font-medium text-[#f5f0e7]">
                    Versioned Measurement Profiles
                  </p>
                  <p className="text-[12px] text-[#e9e0d3]/80">
                    Store multiple profiles in centimetres or inches for yourself or loved ones.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img alt="" className="size-5 mt-0.5" src={FIGMA_ASSETS.icons.layersStep} />
                <div>
                  <p className="text-[13px] font-medium text-[#f5f0e7]">
                    Natural Fabrics & Verified Ateliers
                  </p>
                  <p className="text-[12px] text-[#e9e0d3]/80">
                    Customize European flax linen, organic cotton, raw silk and merino wool.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <img alt="" className="size-5 mt-0.5" src={FIGMA_ASSETS.icons.packageCheckStep} />
                <div>
                  <p className="text-[13px] font-medium text-[#f5f0e7]">
                    Complimentary Alteration Assurance
                  </p>
                  <p className="text-[12px] text-[#e9e0d3]/80">
                    Post-delivery fit support within 14 days on every bespoke order.
                  </p>
                </div>
              </div>
            </div>

            <p className="font-serif italic text-[18px] text-[#b69a68]">
              Tailored for Men, Women & Unisex wardrobes.
            </p>
          </div>

          {/* Right Registration Form */}
          <div className="lg:col-span-7 bg-white border border-[#e9e0d3] p-6 sm:p-10 lg:p-12">
            <div className="space-y-2 mb-8">
              <p className="text-[11px] tracking-[1.4px] uppercase text-[#706a60]">
                NEW CUSTOMER PROFILE
              </p>
              <h2 className="font-serif text-[32px] text-[#172b24] tracking-[-0.5px]">
                Create Your Tapestory Account
              </h2>
              <p className="text-[13px] text-[#706a60]">
                Fill in your details below or continue with Google OAuth.
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[12px] text-[#29251f]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ananya Rao"
                    className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] text-[#29251f]">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ananya.rao@example.com"
                    className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-[12px] text-[#29251f]">Mobile Number (for OTP & Delivery)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] text-[#29251f]">Create Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="block text-[12px] text-[#29251f]">Preferred Fit Silhouette</label>
                  <select
                    value={preferredFit}
                    onChange={(e) => setPreferredFit(e.target.value)}
                    className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                  >
                    <option value="Relaxed / Easy">Relaxed / Easy</option>
                    <option value="Regular / Classic">Regular / Classic</option>
                    <option value="Tailored / Sculpted">Tailored / Sculpted</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[12px] text-[#29251f]">Default Measurement Unit</label>
                  <div className="grid grid-cols-2 gap-2 h-[54px]">
                    <button
                      type="button"
                      onClick={() => setPreferredUnit("cm")}
                      className={`border text-[13px] font-medium ${
                        preferredUnit === "cm"
                          ? "bg-[#172b24] text-white border-[#172b24]"
                          : "bg-[#f5f0e7] text-[#172b24] border-[#e9e0d3]"
                      }`}
                    >
                      Centimetres (cm)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredUnit("in")}
                      className={`border text-[13px] font-medium ${
                        preferredUnit === "in"
                          ? "bg-[#172b24] text-white border-[#172b24]"
                          : "bg-[#f5f0e7] text-[#172b24] border-[#e9e0d3]"
                      }`}
                    >
                      Inches (in)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-[56px] bg-[#172b24] text-white text-[14px] font-medium flex items-center justify-center gap-4 hover:bg-[#172b24]/95 transition-colors"
                >
                  <span>{isSubmitting ? "Creating your wardrobe…" : "Create My Account"}</span>
                  <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightLight} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    loginUser();
                    router.push("/measurements");
                  }}
                  className="h-[56px] px-6 border border-[#172b24] text-[#172b24] text-[14px] hover:bg-[#f5f0e7] transition-colors"
                >
                  Create & Add Measurements
                </button>
              </div>
            </form>

            <div className="pt-8 mt-8 border-t border-[#e9e0d3] flex items-center justify-between">
              <p className="text-[13px] text-[#706a60]">Already have a Tapestory account?</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border-b border-[#b69a68] pb-1 text-[14px] text-[#172b24] font-medium"
              >
                <span>Sign In</span>
                <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightPrimary} />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
