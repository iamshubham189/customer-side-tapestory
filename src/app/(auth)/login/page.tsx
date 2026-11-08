"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FIGMA_ASSETS } from "@/config/assets";
import { useTapestory } from "@/features/store-provider";

type AuthMethod = "email" | "phone" | "google";

export default function LoginPage() {
  const router = useRouter();
  const { loginUser } = useTapestory();

  const [authMethod, setAuthMethod] = useState<AuthMethod>("email");
  const [email, setEmail] = useState("ananya.rao@tapestory.in");
  const [password, setPassword] = useState("••••••••••••");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("482910");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginUser({
        email,
        verifiedEmail: true,
      });
      setIsSubmitting(false);
      router.push("/account");
    }, 450);
  };

  const handlePhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!otpSent) {
      setOtpSent(true);
      setStatusMessage(`6-digit verification code sent to ${phone}.`);
      return;
    }
    if (otpCode.trim().length < 4) {
      setErrorMessage("Please enter the 6-digit OTP sent to your mobile number.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      loginUser({
        phone,
        verifiedPhone: true,
      });
      setIsSubmitting(false);
      router.push("/account");
    }, 450);
  };

  const handleGoogleSignIn = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      loginUser({
        fullName: "Ananya Rao",
        email: "ananya.rao@tapestory.in",
        verifiedEmail: true,
      });
      setIsSubmitting(false);
      router.push("/account");
    }, 450);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]">
      <Header />

      <main className="flex-1 px-4 sm:px-8 lg:px-[72px] py-10 lg:py-16">
        <div className="mx-auto max-w-[1120px] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Editorial Visual Panel */}
          <div className="lg:col-span-6 bg-[#172b24] text-[#f5f0e7] p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-4 relative z-10">
              <p className="text-[11px] tracking-[1.5px] uppercase text-[#b69a68]">
                YOUR PERSONAL WARDROBE
              </p>
              <h1 className="font-serif text-[34px] sm:text-[42px] leading-[1.18] tracking-[-0.8px] text-[#f5f0e7]">
                Welcome back to your bespoke archive.
              </h1>
              <p className="text-[14px] leading-[1.7] text-[#e9e0d3] max-w-[440px]">
                Sign in to access your saved body measurement profiles, custom garment drafts, 3D avatar fit previews and live atelier production updates.
              </p>
            </div>

            <div className="my-8 relative h-[260px] sm:h-[300px] bg-[#29251f] overflow-hidden border border-[#b69a68]/30">
              <img
                src={FIGMA_ASSETS.images.artOfPersonalization}
                alt="Tapestory bespoke tailoring"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#172b24]/90 backdrop-blur-xs p-4 border border-[#b69a68]/40">
                <p className="font-serif italic text-[18px] text-[#b69a68]">
                  “Your fit. Your story. Thoughtful details, all in one place.”
                </p>
                <p className="text-[11px] text-[#f5f0e7]/80 mt-1">
                  Synced across Customization Studio, 3D Preview & My Orders
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#b69a68]/30 text-[12px]">
              <div>
                <p className="text-[#b69a68] font-medium">Saved Profiles</p>
                <p className="text-[#f5f0e7]/80 mt-0.5">Versioned in cm & in</p>
              </div>
              <div>
                <p className="text-[#b69a68] font-medium">Custom Drafts</p>
                <p className="text-[#f5f0e7]/80 mt-0.5">Resume any garment</p>
              </div>
              <div>
                <p className="text-[#b69a68] font-medium">Live Tracking</p>
                <p className="text-[#f5f0e7]/80 mt-0.5">5-stage atelier updates</p>
              </div>
            </div>
          </div>

          {/* Right Authentication Card */}
          <div className="lg:col-span-6 bg-white border border-[#e9e0d3] p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[11px] tracking-[1.4px] uppercase text-[#706a60]">
                  CUSTOMER ACCOUNT ACCESS
                </p>
                <h2 className="font-serif text-[32px] text-[#172b24] tracking-[-0.5px]">
                  Sign In to Tapestory
                </h2>
                <p className="text-[13px] text-[#706a60] leading-[1.6]">
                  Choose your preferred sign-in method below. Supported via Supabase Auth (Email, Phone OTP & Google OAuth).
                </p>
              </div>

              {/* Method Switcher Tabs */}
              <div className="grid grid-cols-3 border border-[#e9e0d3] bg-[#f5f0e7] p-1 gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("email");
                    setErrorMessage(null);
                  }}
                  className={`h-[42px] text-[12px] font-medium transition-colors ${
                    authMethod === "email"
                      ? "bg-[#172b24] text-white"
                      : "text-[#172b24] hover:bg-[#e9e0d3]/60"
                  }`}
                >
                  Email & Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("phone");
                    setErrorMessage(null);
                  }}
                  className={`h-[42px] text-[12px] font-medium transition-colors ${
                    authMethod === "phone"
                      ? "bg-[#172b24] text-white"
                      : "text-[#172b24] hover:bg-[#e9e0d3]/60"
                  }`}
                >
                  Phone OTP
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMethod("google");
                    setErrorMessage(null);
                  }}
                  className={`h-[42px] text-[12px] font-medium transition-colors ${
                    authMethod === "google"
                      ? "bg-[#172b24] text-white"
                      : "text-[#172b24] hover:bg-[#e9e0d3]/60"
                  }`}
                >
                  Google OAuth
                </button>
              </div>

              {errorMessage && (
                <div className="bg-[#f5f0e7] border border-[#29251f] p-4 flex items-start gap-3">
                  <span className="text-[18px] text-[#172b24] font-medium">!</span>
                  <div>
                    <p className="text-[14px] font-medium text-[#172b24]">
                      Please check your sign-in details
                    </p>
                    <p className="text-[12px] text-[#29251f] mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {statusMessage && (
                <div className="bg-[#f5f0e7] border border-[#172b24] p-4 flex items-start gap-3">
                  <span className="text-[18px] text-[#172b24] font-medium">✓</span>
                  <div>
                    <p className="text-[14px] font-medium text-[#172b24]">Verification code sent</p>
                    <p className="text-[12px] text-[#29251f] mt-0.5">{statusMessage}</p>
                  </div>
                </div>
              )}

              {authMethod === "email" && (
                <form onSubmit={handleEmailLogin} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[12px] text-[#29251f]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-[12px] text-[#29251f]">Password</label>
                      <Link
                        href="/forgot-password"
                        className="text-[12px] text-[#172b24] border-b border-[#b69a68] pb-0.5 hover:opacity-80"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[56px] bg-[#172b24] text-white text-[14px] font-medium flex items-center justify-center gap-4 hover:bg-[#172b24]/95 transition-colors disabled:opacity-60"
                  >
                    <span>{isSubmitting ? "Signing in to your wardrobe…" : "Sign In with Email"}</span>
                    <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightLight} />
                  </button>
                </form>
              )}

              {authMethod === "phone" && (
                <form onSubmit={handlePhoneOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[12px] text-[#29251f]">
                      Mobile Number (India +91)
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-[54px] px-4 bg-white border border-[#e9e0d3] text-[14px] text-[#29251f] focus:outline-none focus:border-[#172b24]"
                    />
                    <p className="text-[11px] text-[#706a60]">
                      We’ll send a one-time verification code via SMS.
                    </p>
                  </div>

                  {otpSent && (
                    <div className="space-y-2">
                      <label className="block text-[12px] text-[#29251f]">6-Digit OTP</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full h-[54px] px-4 bg-white border border-[#172b24] text-[16px] tracking-[6px] font-medium text-[#172b24] focus:outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-[56px] bg-[#172b24] text-white text-[14px] font-medium flex items-center justify-center gap-4 hover:bg-[#172b24]/95 transition-colors"
                  >
                    <span>
                      {isSubmitting
                        ? "Verifying OTP…"
                        : otpSent
                        ? "Verify OTP & Sign In"
                        : "Send 6-Digit OTP"}
                    </span>
                    <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightLight} />
                  </button>
                </form>
              )}

              {authMethod === "google" && (
                <div className="space-y-5 py-2">
                  <div className="p-5 bg-[#f5f0e7] border border-[#e9e0d3] space-y-2">
                    <p className="text-[14px] font-medium text-[#172b24]">
                      One-Click Google OAuth Sign-In
                    </p>
                    <p className="text-[12px] text-[#706a60] leading-[1.6]">
                      Connect your Google account via Supabase OAuth to sync your saved designs, measurement profiles and order updates across devices.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
                    className="w-full h-[56px] bg-white border border-[#172b24] text-[#172b24] text-[14px] font-medium flex items-center justify-center gap-3 hover:bg-[#f5f0e7] transition-colors"
                  >
                    <span>{isSubmitting ? "Connecting with Google…" : "Continue with Google"}</span>
                    <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightPrimary} />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-8 mt-8 border-t border-[#e9e0d3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-[13px] text-[#29251f]">New to Tapestory?</p>
                <p className="text-[12px] text-[#706a60]">
                  Create your personal wardrobe and save your first measurement profile.
                </p>
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center gap-3 border-b border-[#b69a68] pb-1.5 text-[14px] text-[#172b24] font-medium shrink-0"
              >
                <span>Create Account</span>
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
