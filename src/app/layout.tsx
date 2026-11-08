import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { TapestoryProvider } from "@/features/store-provider";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tapestory — Made for Everyone | Bespoke & Made-to-Measure Clothing",
    template: "%s | Tapestory",
  },
  description:
    "Premium unisex made-to-measure fashion platform. Discover custom-tailored clothing for men, women and unisex styles crafted to your exact measurements by verified ateliers across India.",
  keywords: [
    "Tapestory",
    "Made to Measure",
    "Bespoke Clothing India",
    "Unisex Tailoring",
    "Custom Linen Jacket",
    "3D Avatar Preview",
    "Atelier Niva",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-[#f5f0e7] font-sans text-[#29251f] antialiased selection:bg-[#172b24] selection:text-[#f5f0e7]">
        <TapestoryProvider>{children}</TapestoryProvider>
      </body>
    </html>
  );
}
