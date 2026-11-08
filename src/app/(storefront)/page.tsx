import React from "react";
import Link from "next/link";
import { FIGMA_ASSETS } from "@/config/assets";
import { SEED_PRODUCTS, SEED_VENDORS } from "@/lib/backend/seed-data";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonPrimary, ButtonSecondary, ButtonText } from "@/components/common/Button";
import {
  SectionHeading,
  SectionHeadingWithViewAll,
} from "@/components/common/SectionHeading";
import {
  CategoryImageCard,
  CollectionCard,
  EditorialImageCard,
  FabricSwatchCard,
  FeatureBenefitItem,
  NewsletterForm,
  StepIndicator,
  TestimonialCard,
  TrustIndicator,
} from "@/components/common/EditorialBlocks";
import { ProductCard } from "@/components/products/ProductCard";
import { TailorCard } from "@/components/products/TailorCard";

export default function HomePage() {
  const trendingProducts = SEED_PRODUCTS.filter((p) => p.isTrending).slice(0, 4);
  const newArrivalProducts = SEED_PRODUCTS.filter((p) => p.isNewArrival).slice(0, 4);
  const featuredTailors = SEED_VENDORS.filter(
    (v) => v.slug === "priyas-bespoke-atelier" || v.slug === "rohan-tailoring-studio"
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full overflow-x-hidden"
      data-node-id="5:4986"
    >
      <Header />

      <main className="flex-1">
        {/* HERO SECTION (5:5013) */}
        <section
          className="w-full bg-[#172b24]"
          data-node-id="5:5013"
        >
          <div
            className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row lg:h-[640px]"
            data-node-id="5:5014"
          >
            <div
              className="flex flex-col justify-center gap-[24px] bg-[#172b24] px-4 sm:px-8 lg:pl-[72px] lg:pr-[48px] py-12 lg:py-[64px] w-full lg:w-[622px] shrink-0"
              data-node-id="5:5015"
            >
              <div
                className="flex items-center gap-[12px]"
                data-node-id="5:5016"
              >
                <div
                  className="h-px w-[32px] bg-[#b69a68]"
                  data-node-id="5:5017"
                />
                <p
                  className="font-sans text-[11px] tracking-[2.2px] text-[#f5f0e7]"
                  data-node-id="5:5018"
                >
                  INDIVIDUAL BY DESIGN
                </p>
              </div>

              <h1
                className="font-serif text-[42px] sm:text-[52px] lg:text-[62px] leading-[1.13] tracking-[-1.8px] text-[#f5f0e7]"
                data-node-id="5:5019"
              >
                <span>Discover Tailors. </span>
                <span className="text-[#b69a68]">Design Your Fit.</span>
              </h1>

              <p
                className="font-sans text-[15px] leading-[1.8] text-[#f5f0e7]"
                data-node-id="5:5020"
              >
                Browse local tailors, choose your style, and create custom
                clothing made to your measurements.
              </p>

              <div
                className="flex flex-wrap items-center gap-[16px] pt-[8px]"
                data-node-id="5:5021"
              >
                <ButtonPrimary
                  label="Find a Tailor"
                  href="/vendors"
                  tone="Ivory"
                />
                <ButtonSecondary
                  label="Explore Collection"
                  href="/products"
                  tone="Inverse"
                />
              </div>
            </div>

            <EditorialImageCard
              story="Campaign"
              label="Tapestory Tailors"
              edition="Discover local makers"
            />
          </div>

          {/* TRUST STRIP (5:5032) */}
          <div
            className="w-full bg-[#e9e0d3]"
            data-node-id="5:5032"
          >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 md:flex-row md:items-center md:justify-between px-4 sm:px-8 lg:px-[72px] py-5 md:h-[80px] md:py-0">
              <p
                className="font-serif italic text-[18px] sm:text-[20px] text-[#172b24]"
                data-node-id="5:5033"
              >
                Meet the tailors. Own the fit.
              </p>
              <div
                className="flex flex-wrap items-center gap-6 sm:gap-[56px]"
                data-node-id="5:5034"
              >
                <TrustIndicator benefit="Perfect Fit" />
                <TrustIndicator benefit="Premium Fabrics" />
                <TrustIndicator benefit="Tailored by Experts" />
              </div>
            </div>
          </div>
        </section>

        {/* TRENDING DESIGNS (5:5129) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]"
          data-node-id="5:5129"
        >
          <SectionHeadingWithViewAll
            eyebrow="MADE PERSONAL, WORN YOUR WAY"
            title="Trending Designs"
            description="Start with a design you love. Make every detail your own."
            actionLabel="Browse All Designs"
            actionHref="/products"
          />

          <div
            className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full"
            data-node-id="5:5138"
          >
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                aspect="Portrait"
              />
            ))}
          </div>

          <p
            className="font-sans text-[11px] text-[#29251f] w-full"
            data-node-id="5:5199"
          >
            Sample products & starting prices in INR, shown for illustration.
            Final pricing varies with fabric, measurements and customization.
          </p>
        </section>

        {/* NEW ARRIVALS (5:5200) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] pb-14 lg:pb-[80px]"
          data-node-id="5:5200"
        >
          <div
            className="h-px w-full bg-[#e9e0d3]"
            data-node-id="5:5201"
          />

          <SectionHeadingWithViewAll
            eyebrow="FRESH PERSPECTIVES"
            title="New Arrivals"
            actionLabel="View All"
            actionHref="/products?sort=newest"
          />

          <div
            className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full"
            data-node-id="5:5209"
          >
            {newArrivalProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                aspect="Compact"
              />
            ))}
          </div>

          <p
            className="font-sans text-[11px] text-[#29251f] w-full"
            data-node-id="5:5270"
          >
            Illustrative sample products and starting INR prices. Your final
            price reflects the choices you make.
          </p>
        </section>

        {/* MEN / WOMEN / UNISEX / OCCASION CATEGORIES (5:6908) */}
        <section
          className="w-full border-y border-[#e9e0d3] bg-[#f5f0e7]"
          data-node-id="5:6908"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[72px]">
            <SectionHeadingWithViewAll
              eyebrow="TAILORED WITHOUT BOUNDARIES"
              title="Explore by Category"
              description="Thoughtfully proportioned silhouettes for men, women and gender-neutral wardrobes."
              actionLabel="Explore All Categories"
              actionHref="/products"
            />
            <div className="grid grid-cols-2 gap-[24px] sm:grid-cols-3 lg:grid-cols-6 w-full">
              <CategoryImageCard category="Men" className="flex flex-col gap-[16px] items-start w-full" />
              <CategoryImageCard category="Women" className="flex flex-col gap-[16px] items-start w-full" />
              <CategoryImageCard category="Unisex" className="flex flex-col gap-[16px] items-start w-full" />
              <CategoryImageCard category="Occasion" className="flex flex-col gap-[16px] items-start w-full" />
              <CategoryImageCard category="Workwear" className="flex flex-col gap-[16px] items-start w-full" />
              <CategoryImageCard category="Casual" className="flex flex-col gap-[16px] items-start w-full" />
            </div>
          </div>
        </section>

        {/* DISCOVER TAILORS (5:5044) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]"
          data-node-id="5:5044"
        >
          <div
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between w-full"
            data-node-id="17:1250"
          >
            <div className="flex flex-col gap-[16px] items-start text-[#172b24]">
              <p className="font-sans text-[11px] font-medium tracking-[2px]">
                MEET THE MAKERS
              </p>
              <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px]">
                Discover Tailors
              </h2>
            </div>
            <ButtonText label="Explore all tailors" href="/vendors" />
          </div>

          <div
            className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full"
            data-node-id="17:1258"
          >
            {featuredTailors.map((vendor) => (
              <TailorCard
                key={vendor.id}
                name={vendor.name}
                slug={vendor.slug}
                description={vendor.shortDescription}
                image={vendor.cardImage}
                badges={vendor.badges}
              />
            ))}
          </div>

          <p
            className="font-sans text-[12px] leading-[20px] text-[#172b24] w-full"
            data-node-id="17:1289"
          >
            Illustrative tailor profiles and photography. Discover makers,
            explore their work, and find the right fit for your style.
          </p>
        </section>

        {/* HOW TAPESTORY WORKS (5:5271) */}
        <section
          id="how-it-works"
          className="w-full bg-[#e9e0d3]"
          data-node-id="5:5271"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]">
            <div
              className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between w-full"
              data-node-id="5:5272"
            >
              <div className="flex flex-col gap-[16px] items-start text-[#172b24]">
                <p className="font-sans text-[11px] font-medium tracking-[2px]">
                  FROM AN IDEA TO YOUR WARDROBE
                </p>
                <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px]">
                  How Tapestory Works
                </h2>
              </div>
              <ButtonText
                label="The made-to-measure guide"
                href="/measurements"
              />
            </div>

            <div
              className="relative grid grid-cols-1 gap-8 sm:grid-cols-2 lg:flex lg:items-start lg:gap-[24px] w-full"
              data-node-id="5:5279"
            >
              <div
                className="hidden lg:block absolute top-[32px] left-[32px] h-px w-[990px] bg-[#b69a68]"
                data-node-id="5:5280"
              />
              <StepIndicator
                stepNumber="01"
                title="Find a Tailor"
                description="Explore tailor profiles and find a maker for your style."
                iconType="shirt"
              />
              <StepIndicator
                stepNumber="02"
                title="Choose Your Style"
                description="Choose a design, fabric and details with your tailor."
                iconType="layers"
              />
              <StepIndicator
                stepNumber="03"
                title="Add Measurements"
                description="Share your measurements for a fit made around you."
                iconType="ruler"
              />
              <StepIndicator
                stepNumber="04"
                title="Place Your Order"
                description="Review your choices and place your custom clothing order."
                iconType="package"
              />
            </div>
          </div>
        </section>

        {/* YOUR STYLE. YOUR FIT. YOUR STORY. (5:5313) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row lg:h-[544px]"
          data-node-id="5:5313"
        >
          <div
            className="relative h-[340px] sm:h-[420px] lg:h-full w-full lg:w-[720px] shrink-0 overflow-hidden"
            data-node-id="5:5314"
          >
            <img
              alt="The art of personalization"
              className="absolute inset-0 size-full object-cover"
              src={FIGMA_ASSETS.images.personalizationAtelier}
            />
          </div>

          <div
            className="flex flex-1 flex-col justify-center gap-[24px] bg-[#172b24] px-4 sm:px-8 lg:px-[72px] py-12 lg:py-[64px]"
            data-node-id="5:5316"
          >
            <p
              className="font-sans text-[11px] tracking-[2px] text-[#b69a68]"
              data-node-id="5:5317"
            >
              THE FREEDOM TO MAKE IT YOURS
            </p>
            <h2
              className="font-serif text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#f5f0e7]"
              data-node-id="5:5318"
            >
              <span>Your Style. Your Fit. </span>
              <span className="text-[#b69a68]">Your Story.</span>
            </h2>
            <p
              className="font-sans text-[14px] leading-[1.8] text-[#f5f0e7]"
              data-node-id="5:5319"
            >
              A favourite silhouette. A fabric that feels just right. The little
              details only you would choose. Create a piece that is yours in
              every sense.
            </p>

            <div
              className="flex flex-wrap items-center gap-[24px]"
              data-node-id="5:5320"
            >
              {["Fit", "Fabric", "Finishing"].map((item) => (
                <div key={item} className="flex items-center gap-[8px]">
                  <img
                    alt=""
                    className="size-[14px]"
                    src={FIGMA_ASSETS.icons.checkGold}
                  />
                  <span className="font-sans text-[12px] text-[#f5f0e7]">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-1">
              <ButtonPrimary
                label="Start Designing"
                href="/customize"
                tone="Ivory"
              />
            </div>
          </div>
        </section>

        {/* PREMIUM FABRICS (5:5333) */}
        <section
          id="premium-fabrics"
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]"
          data-node-id="5:5333"
        >
          <div
            className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between w-full"
            data-node-id="5:5334"
          >
            <div className="flex flex-col gap-[16px] items-start text-[#172b24]">
              <p className="font-sans text-[11px] font-medium tracking-[2px]">
                GOOD DESIGN STARTS WITH GOOD FABRIC
              </p>
              <h2 className="font-serif text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.8px]">
                Premium Fabrics
              </h2>
            </div>
            <ButtonText
              label="Explore the fabric library"
              href="/customize#step-fabric"
            />
          </div>

          <div
            className="grid grid-cols-2 gap-[24px] sm:grid-cols-3 lg:flex lg:items-start lg:gap-[24px] w-full"
            data-node-id="5:5341"
          >
            <div
              className="col-span-2 sm:col-span-1 flex flex-col gap-[24px] items-start pt-[16px] pr-[16px] lg:w-[196px] shrink-0"
              data-node-id="5:5342"
            >
              <p
                className="font-serif italic text-[28px] sm:text-[30px] leading-[1.25] text-[#172b24]"
                data-node-id="5:5343"
              >
                It all begins with a feeling.
              </p>
              <p
                className="font-sans text-[13px] leading-[1.75] text-[#29251f]"
                data-node-id="5:5344"
              >
                Consider the texture. Feel the drape. Find the fabric your story
                is made of.
              </p>
              <Link href="/customize#step-fabric" aria-label="Explore fabrics">
                <img
                  alt=""
                  className="size-[24px]"
                  src={FIGMA_ASSETS.icons.arrowRightGold}
                />
              </Link>
            </div>

            <FabricSwatchCard material="Linen" />
            <FabricSwatchCard material="Cotton" />
            <FabricSwatchCard material="Silk" />
            <FabricSwatchCard material="Wool" />
            <FabricSwatchCard material="Blends" />
          </div>
        </section>

        {/* WHY CHOOSE TAPESTORY (5:5371) */}
        <section
          className="w-full bg-[#e9e0d3]"
          data-node-id="5:5371"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row items-start gap-[24px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]">
            <EditorialImageCard story="Craft" />

            <div
              className="flex flex-1 flex-col gap-[32px] items-start lg:pl-[48px] pt-[8px] w-full"
              data-node-id="5:5377"
            >
              <SectionHeading
                eyebrow="THE TAPESTORY DIFFERENCE"
                title="Why Choose Tapestory"
              />
              <div
                className="flex flex-col w-full"
                data-node-id="5:5381"
              >
                <FeatureBenefitItem benefit="Made-to-measure fit" />
                <FeatureBenefitItem benefit="Premium materials" />
                <FeatureBenefitItem benefit="Skilled tailoring partners" />
                <FeatureBenefitItem benefit="Personalization" />
                <FeatureBenefitItem benefit="Order tracking" />
              </div>
            </div>
          </div>
        </section>

        {/* STORIES OF INDIVIDUAL STYLE (5:5407) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]"
          data-node-id="5:5407"
        >
          <SectionHeading
            eyebrow="INDIVIDUAL STYLE, SHARED STORIES"
            title="Stories of individual style"
            description="Illustrative sample testimonials — not verified customer reviews."
          />

          <div
            className="grid grid-cols-1 gap-[24px] md:grid-cols-3 w-full"
            data-node-id="5:5413"
          >
            <TestimonialCard story="Story 1" />
            <TestimonialCard story="Story 2" />
            <TestimonialCard story="Story 3" />
          </div>
        </section>

        {/* FEATURED COLLECTIONS (5:5089) */}
        <section
          className="w-full bg-[#e9e0d3]"
          data-node-id="5:5089"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[80px]">
            <SectionHeadingWithViewAll
              eyebrow="CURATED FOR YOUR MANY MOMENTS"
              title="Featured Collections"
              description="Distinct edits for every side of you. Made to your measurements."
              actionLabel="Explore All Collections"
              actionHref="/products"
            />

            <div
              className="grid grid-cols-1 gap-[24px] md:grid-cols-2 w-full"
              data-node-id="5:5098"
            >
              <CollectionCard collection="Formal Edit" />
              <CollectionCard collection="Wedding Edit" />
              <CollectionCard collection="Everyday Essentials" />
              <CollectionCard collection="Fusion Wear" />
            </div>
          </div>
        </section>

        {/* NEWSLETTER (5:5435) */}
        <section
          className="w-full bg-[#e9e0d3] border-t border-[#b69a68]/30"
          data-node-id="5:5435"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row lg:items-center gap-[24px] px-4 sm:px-8 lg:px-[72px] py-12 lg:py-[64px]">
            <div
              className="flex flex-col gap-[16px] items-start lg:pr-[80px] lg:w-[636px]"
              data-node-id="5:5436"
            >
              <h2
                className="font-serif text-[32px] sm:text-[40px] tracking-[-0.8px] text-[#172b24]"
                data-node-id="5:5437"
              >
                Stay in the Loop
              </h2>
              <p
                className="font-sans text-[14px] leading-[1.7] text-[#29251f]"
                data-node-id="5:5438"
              >
                New collections, tailoring insights and thoughtful updates. A
                little Tapestory, delivered to your inbox.
              </p>
            </div>
            <NewsletterForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
