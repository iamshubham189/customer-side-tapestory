"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FIGMA_ASSETS } from "@/config/assets";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("ananya.rao@tapestory.in");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e7] text-[#29251f]">
      <Header />

      <main className="flex-1 px-4 sm:px-8 lg:px-[72px] py-12 lg:py-20 flex items-center justify-center">
        <div className="w-full max-w-[560px] bg-white border border-[#e9e0d3] p-8 sm:p-12 space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] tracking-[1.4px] uppercase text-[#706a60]">
              ACCOUNT RECOVERY
            </p>
            <h1 className="font-serif text-[32px] text-[#172b24] tracking-[-0.5px]">
              Reset your password
            </h1>
            <p className="text-[14px] text-[#706a60] leading-[1.6]">
              Enter the email address linked to your Tapestory account. We will send a secure password reset link.
            </p>
          </div>

          {submitted ? (
            <div className="space-y-6">
              <div className="bg-[#f5f0e7] border border-[#172b24] p-5 flex items-start gap-4">
                <span className="text-[20px] text-[#172b24]">✓</span>
                <div className="space-y-1">
                  <p className="text-[16px] text-[#172b24]">Recovery link sent.</p>
                  <p className="text-[13px] text-[#29251f] leading-[1.6]">
                    If an account exists for <span className="font-medium">{email}</span>, you will receive instructions to choose a new password shortly.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-[13px] text-[#172b24] border-b border-[#b69a68] pb-1"
                >
                  Use a different email
                </button>
                <Link
                  href="/login"
                  className="h-[48px] px-6 bg-[#172b24] text-white text-[13px] font-medium inline-flex items-center gap-3"
                >
                  <span>Return to Sign In</span>
                  <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightLight} />
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                className="w-full h-[56px] bg-[#172b24] text-white text-[14px] font-medium flex items-center justify-center gap-4 hover:bg-[#172b24]/95 transition-colors"
              >
                <span>Send Recovery Link</span>
                <img alt="" className="size-4" src={FIGMA_ASSETS.icons.arrowUpRightLight} />
              </button>
            </form>
          )}

          <div className="pt-6 border-t border-[#e9e0d3] flex items-center justify-between text-[13px]">
            <Link href="/login" className="text-[#172b24] border-b border-[#b69a68] pb-1">
              Back to Sign In
            </Link>
            <Link href="/account/support" className="text-[#706a60] hover:text-[#172b24]">
              Need help? Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
