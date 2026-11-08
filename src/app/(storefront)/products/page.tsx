"use client";

import React, { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { FIGMA_ASSETS } from "@/config/assets";
import { SEED_PRODUCTS } from "@/lib/backend/seed-data";
import { formatInr, formatStartingPrice } from "@/lib/utils/format";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ButtonPrimary, ButtonSecondary, ButtonText } from "@/components/common/Button";
import { SectionHeadingWithViewAll } from "@/components/common/SectionHeading";
import { ProductCard } from "@/components/products/ProductCard";
import type { FabricMaterialFamily, Product } from "@/types";

const CATEGORY_TABS = [
  "All",
  "Shirts",
  "Trousers",
  "Jackets",
  "Dresses",
  "Kurtas",
  "Suits",
  "Ethnic wear",
] as const;

const COLOR_SWATCHES = [
  { name: "Deep Green", hex: "#172B24" },
  { name: "Beige", hex: "#CDBDA5" },
  { name: "Cream", hex: "#EEE8D9" },
  { name: "Navy", hex: "#253243" },
  { name: "Brown", hex: "#735444" },
];

function ProductListingContent() {
  const searchParams = useSearchParams();
  const initialGender = searchParams.get("gender") || "All";
  const initialOccasion = searchParams.get("occasion") || "All";
  const initialSearch = searchParams.get("q") || "";
  const initialSort = searchParams.get("sort") || "recommended";

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGender, setSelectedGender] = useState<string>(initialGender);
  const [selectedFabric, setSelectedFabric] = useState<FabricMaterialFamily | "All">("All");
  const [selectedStyle, setSelectedStyle] = useState<string>("All");
  const [selectedOccasion, setSelectedOccasion] = useState<string>(initialOccasion);
  const [selectedColor, setSelectedColor] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(15000);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState<number>(8);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [occasionExpanded, setOccasionExpanded] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    let list = [...SEED_PRODUCTS];

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.vendorName.toLowerCase().includes(q) ||
          p.fabricFamily.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All") {
      list = list.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedGender !== "All") {
      list = list.filter(
        (p) => p.gender === selectedGender || p.gender === "Unisex"
      );
    }

    if (selectedFabric !== "All") {
      list = list.filter((p) => p.fabricFamily === selectedFabric);
    }

    if (selectedStyle !== "All") {
      list = list.filter((p) =>
        p.fitSummary.toLowerCase().includes(selectedStyle.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(selectedStyle.toLowerCase())
      );
    }

    if (selectedOccasion !== "All") {
      list = list.filter((p) =>
        p.occasion.some((o) =>
          o.toLowerCase().includes(selectedOccasion.toLowerCase())
        )
      );
    }

    if (selectedColor !== "All") {
      list = list.filter((p) =>
        p.availableColors.some(
          (c) => c.name.toLowerCase() === selectedColor.toLowerCase()
        )
      );
    }

    list = list.filter((p) => p.startingPriceInr <= maxPrice);

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.startingPriceInr - b.startingPriceInr);
        break;
      case "price-desc":
        list.sort((a, b) => b.startingPriceInr - a.startingPriceInr);
        break;
      case "rating":
        list.sort((a, b) => b.ratingAvg - a.ratingAvg);
        break;
      case "newest":
        list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
        break;
      default:
        break;
    }

    return list;
  }, [
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedFabric,
    selectedStyle,
    selectedOccasion,
    selectedColor,
    maxPrice,
    sortBy,
  ]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedGender("All");
    setSelectedFabric("All");
    setSelectedStyle("All");
    setSelectedOccasion("All");
    setSelectedColor("All");
    setMaxPrice(15000);
    setSearchQuery("");
    setSortBy("recommended");
  };

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const trendingProducts = SEED_PRODUCTS.filter((p) => p.isTrending).slice(0, 4);
  const recentlyViewedProducts = SEED_PRODUCTS.slice(4, 8);

  const FilterPanel = (
    <div className="flex flex-col items-start w-full" data-node-id="12:21266">
      <div
        className="flex items-center justify-between w-full pb-2"
        data-node-id="12:21267"
      >
        <p
          className="font-serif text-[24px] text-[#172b24]"
          data-node-id="12:21268"
        >
          Refine by
        </p>
        <ButtonText label="Clear All" onClick={handleClearFilters} />
      </div>

      {/* Category Filter Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21273"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Category
          </p>
          <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.minus} />
        </div>
        {[
          { label: "All clothing", value: "All" },
          { label: "Jackets & layers", value: "Jackets" },
          { label: "Everyday essentials", value: "Shirts" },
          { label: "Suits & bandhgalas", value: "Suits" },
          { label: "Dresses & kurtas", value: "Dresses" },
        ].map((opt) => {
          const checked = selectedCategory === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => setSelectedCategory(opt.value)}
              className="flex h-[32px] items-center gap-[12px] w-full text-left cursor-pointer"
            >
              <span
                className={`flex size-[20px] items-center justify-center rounded-[2px] border border-[#172b24] text-[13px] ${
                  checked
                    ? "bg-[#172b24] text-[#b69a68]"
                    : "bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="font-sans text-[14px] text-[#29251f]">
                {opt.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Gender / Collection Filter Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21287"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Gender / Collection
          </p>
          <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.minus} />
        </div>
        {["All", "Men", "Women", "Unisex"].map((g) => {
          const checked = selectedGender === g;
          return (
            <button
              key={g}
              type="button"
              onClick={() => setSelectedGender(g)}
              className="flex h-[32px] items-center gap-[12px] w-full text-left cursor-pointer"
            >
              <span
                className={`flex size-[20px] items-center justify-center rounded-[2px] border border-[#172b24] text-[13px] ${
                  checked
                    ? "bg-[#172b24] text-[#b69a68]"
                    : "bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="font-sans text-[14px] text-[#29251f]">
                {g === "All" ? "All Genders" : g}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fabric Filter Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21301"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Fabric
          </p>
          <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.minus} />
        </div>
        {(
          [
            { label: "All fabrics", value: "All" },
            { label: "Linen", value: "Linen" },
            { label: "Cotton", value: "Cotton" },
            { label: "Silk & blends", value: "Silk" },
            { label: "Wool", value: "Wool" },
          ] as const
        ).map((fab) => {
          const checked = selectedFabric === fab.value;
          return (
            <button
              key={fab.label}
              type="button"
              onClick={() => setSelectedFabric(fab.value)}
              className="flex h-[32px] items-center gap-[12px] w-full text-left cursor-pointer"
            >
              <span
                className={`flex size-[20px] items-center justify-center rounded-[2px] border border-[#172b24] text-[13px] ${
                  checked
                    ? "bg-[#172b24] text-[#b69a68]"
                    : "bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="font-sans text-[14px] text-[#29251f]">
                {fab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Style Filter Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21314"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Style
          </p>
          <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.minus} />
        </div>
        {["All", "Relaxed", "Sculpted", "Structured"].map((st) => {
          const checked = selectedStyle === st;
          return (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStyle(st)}
              className="flex h-[32px] items-center gap-[12px] w-full text-left cursor-pointer"
            >
              <span
                className={`flex size-[20px] items-center justify-center rounded-[2px] border border-[#172b24] text-[13px] ${
                  checked
                    ? "bg-[#172b24] text-[#b69a68]"
                    : "bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <span className="font-sans text-[14px] text-[#29251f]">
                {st === "All" ? "All silhouettes" : st}
              </span>
            </button>
          );
        })}
      </div>

      {/* Price Range Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21324"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Price Range
          </p>
          <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.minus} />
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#29251f] w-full">
          <span>₹1,500</span>
          <span className="font-medium text-[#172b24]">
            Up to {formatInr(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={2000}
          max={15000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          aria-label="Maximum price in INR"
          className="w-full accent-[#172b24] cursor-pointer"
        />
      </div>

      {/* Occasion Filter Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21335"
      >
        <button
          type="button"
          onClick={() => setOccasionExpanded((prev) => !prev)}
          className="flex items-center justify-between w-full cursor-pointer"
        >
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Occasion
          </p>
          <img
            alt=""
            className="size-[16px]"
            src={
              occasionExpanded
                ? FIGMA_ASSETS.icons.minus
                : FIGMA_ASSETS.icons.plus
            }
          />
        </button>
        {occasionExpanded && (
          <div className="flex flex-col gap-2 pt-1 w-full">
            {[
              "All",
              "Everyday",
              "Workwear",
              "Formal Edit",
              "Wedding Edit",
              "Fusion Wear",
            ].map((occ) => (
              <button
                key={occ}
                type="button"
                onClick={() => setSelectedOccasion(occ)}
                className={`text-left text-[13px] py-1 cursor-pointer ${
                  selectedOccasion === occ
                    ? "font-semibold text-[#172b24]"
                    : "text-[#29251f]"
                }`}
              >
                {selectedOccasion === occ ? `✓ ${occ}` : occ}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Colour Filter Group */}
      <div
        className="flex flex-col gap-[12px] items-start border-b border-[#e9e0d3] py-[20px] w-full"
        data-node-id="12:21339"
      >
        <div className="flex items-center justify-between w-full">
          <p className="font-sans text-[14px] font-medium text-[#172b24]">
            Colour
          </p>
          <img alt="" className="size-[16px]" src={FIGMA_ASSETS.icons.minus} />
        </div>
        <div
          className="flex items-center gap-[12px]"
          data-node-id="12:21343"
        >
          {COLOR_SWATCHES.map((swatch) => {
            const active = selectedColor === swatch.name;
            return (
              <button
                key={swatch.name}
                type="button"
                title={swatch.name}
                onClick={() =>
                  setSelectedColor(active ? "All" : swatch.name)
                }
                className={`flex size-[28px] items-center justify-center rounded-full border p-[3px] cursor-pointer ${
                  active ? "border-[#172b24]" : "border-[#e9e0d3]"
                }`}
              >
                <span
                  className="size-full rounded-full"
                  style={{ backgroundColor: swatch.hex }}
                />
              </button>
            );
          })}
        </div>
        {selectedColor !== "All" && (
          <p className="text-[11px] text-[#172b24]">
            Selected colour: {selectedColor}
          </p>
        )}
      </div>

      <div className="pt-[24px] w-full" data-node-id="12:21359">
        <ButtonPrimary
          label="Apply Filters"
          onClick={() => setMobileFiltersOpen(false)}
          className="flex h-[56px] w-full items-center justify-center gap-[24px] bg-[#172b24] px-[24px] text-white rounded-[2px] cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div
      className="flex min-h-screen flex-col bg-[#f5f0e7] w-full"
      data-node-id="12:21208"
    >
      <Header activeNav={selectedGender !== "All" ? selectedGender : undefined} />

      <main className="flex-1">
        {/* DISCOVERY INTRODUCTION (12:21239) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[28px] px-4 sm:px-8 lg:px-[72px] pt-[32px]"
          data-node-id="12:21239"
        >
          <div
            className="flex h-[32px] items-center text-[14px] text-[#29251f]"
            data-node-id="5:7727"
          >
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{selectedGender === "All" ? "Unisex" : selectedGender}</span>
            <span className="mx-2">/</span>
            <span className="font-medium text-[#172b24]">
              {selectedCategory === "All" ? "Clothing" : selectedCategory}
            </span>
          </div>

          <div
            className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between w-full"
            data-node-id="12:21242"
          >
            <div
              className="flex flex-1 flex-col gap-[16px] items-start"
              data-node-id="12:21243"
            >
              <p
                className="font-sans text-[10px] tracking-[1.4px] text-[#172b24]"
                data-node-id="12:21244"
              >
                CONSIDERED DESIGNS. INDIVIDUAL EXPRESSION.
              </p>
              <h1
                className="font-serif text-[36px] sm:text-[48px] leading-[1.2] tracking-[-0.8px] text-[#172b24]"
                data-node-id="12:21245"
              >
                Discover Your Style
              </h1>
              <p
                className="font-sans text-[14px] leading-[1.7] text-[#29251f]"
                data-node-id="12:21246"
              >
                Explore thoughtfully crafted designs, made personal to your fit
                and preferences.
              </p>
            </div>
            <p
              className="font-serif italic text-[20px] text-[#172b24] lg:w-[210px] whitespace-pre-line"
              data-node-id="12:21247"
            >
              {"Not off the rack.\nEntirely your own."}
            </p>
          </div>

          {/* CATEGORY TABS (12:21248) */}
          <div
            className="flex items-start gap-[24px] sm:gap-[36px] overflow-x-auto border-b border-[#e9e0d3] pt-[16px] w-full"
            data-node-id="12:21248"
          >
            {CATEGORY_TABS.map((tab) => {
              const active =
                selectedCategory.toLowerCase() === tab.toLowerCase();
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedCategory(tab)}
                  className={`py-[16px] sm:py-[20px] text-[13px] whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? "border-b-2 border-[#172b24] font-semibold text-[#172b24]"
                      : "font-normal text-[#172b24] hover:text-[#b69a68]"
                  }`}
                >
                  {tab === "Ethnic wear" ? "Ethnic Wear" : tab}
                </button>
              );
            })}
          </div>
        </section>

        {/* PRODUCT DISCOVERY BODY (12:21265) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row items-start gap-[40px] px-4 sm:px-8 lg:px-[72px] pt-[40px] pb-[64px]"
          data-node-id="12:21265"
        >
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-[224px] shrink-0">
            {FilterPanel}
          </aside>

          {/* Mobile Filter Trigger */}
          <div className="flex lg:hidden items-center justify-between w-full border-b border-[#e9e0d3] pb-3">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 border border-[#172b24] bg-white px-4 py-2.5 text-[13px] font-medium text-[#172b24]"
            >
              <SlidersHorizontal className="size-4" />
              <span>Refine & Filter</span>
            </button>
            <span className="text-[12px] text-[#29251f]">
              {filteredProducts.length} designs
            </span>
          </div>

          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="fixed inset-0 bg-[#172b24]/60"
                onClick={() => setMobileFiltersOpen(false)}
              />
              <div className="fixed inset-y-0 left-0 z-10 w-full max-w-[320px] overflow-y-auto bg-[#f5f0e7] p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-[#e9e0d3] pb-3">
                  <span className="font-serif text-[20px] text-[#172b24]">
                    Filters
                  </span>
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(false)}
                    className="p-1 text-[#172b24]"
                  >
                    <X className="size-5" />
                  </button>
                </div>
                {FilterPanel}
              </div>
            </div>
          )}

          {/* Product Listing Main Column */}
          <div
            className="flex flex-1 flex-col gap-[28px] items-start w-full"
            data-node-id="12:21364"
          >
            {/* Listing Toolbar (12:21365) */}
            <div
              className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full"
              data-node-id="12:21365"
            >
              <div
                className="flex flex-col gap-[5px] items-start"
                data-node-id="12:21366"
              >
                <p
                  className="font-sans text-[14px] text-[#172b24]"
                  data-node-id="12:21367"
                >
                  {filteredProducts.length} designs to make your own
                </p>
                <p
                  className="font-sans text-[11px] text-[#29251f]"
                  data-node-id="12:21368"
                >
                  Illustrative collection · sample prices
                </p>
              </div>

              <div
                className="flex flex-wrap items-center gap-[16px] sm:gap-[20px]"
                data-node-id="12:21369"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by keyword..."
                  className="border border-[#e9e0d3] bg-white px-3 py-2 text-[12px] text-[#29251f] placeholder:text-[#29251f]/50 focus:border-[#172b24] focus:outline-none"
                />

                <div
                  className="flex items-center gap-[12px] border border-[#e9e0d3] bg-[#f5f0e7] px-[16px] py-[10px]"
                  data-node-id="12:21370"
                >
                  <label
                    htmlFor="sort-select"
                    className="text-[12px] text-[#172b24]"
                  >
                    Sort By:
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-[12px] font-medium text-[#172b24] focus:outline-none cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest Arrivals</option>
                  </select>
                </div>

                <div
                  className="flex items-center gap-[12px]"
                  data-node-id="12:21373"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                    className={`p-1.5 cursor-pointer ${
                      viewMode === "grid"
                        ? "bg-[#e9e0d3]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      alt="Grid"
                      className="size-[20px]"
                      src={FIGMA_ASSETS.icons.layoutGrid}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                    className={`p-1.5 cursor-pointer ${
                      viewMode === "list"
                        ? "bg-[#e9e0d3]"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      alt="List"
                      className="size-[20px]"
                      src={FIGMA_ASSETS.icons.listView}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Results */}
            {displayedProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 border border-[#e9e0d3] bg-white p-12 text-center w-full">
                <p className="font-serif text-[26px] text-[#172b24]">
                  No designs match your current filters
                </p>
                <p className="text-[13px] text-[#29251f] max-w-md">
                  Try clearing one or more filters or explore our full made-to-measure archive.
                </p>
                <ButtonSecondary
                  label="Reset All Filters"
                  onClick={handleClearFilters}
                />
              </div>
            ) : viewMode === "list" ? (
              <div className="flex flex-col gap-5 w-full">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout="list"
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div
                className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 xl:grid-cols-4 w-full"
                data-node-id="12:21376"
              >
                {displayedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-[8px] items-start w-full"
                  >
                    <ProductCard
                      product={product}
                      aspect="Portrait"
                      showExtendedListingMeta
                      onQuickView={setQuickViewProduct}
                    />
                    <Link
                      href={`/customize?product=${product.slug}`}
                      className="font-sans text-[12px] text-[#172b24] hover:text-[#b69a68] underline"
                    >
                      Customize Now · View Details
                    </Link>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination / Load More (12:21562) */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#e9e0d3] pt-6 w-full">
              <div className="flex items-center gap-2">
                {[1, 2].map((page) => {
                  const isCurrentPage =
                    (page === 1 && visibleCount <= 8) ||
                    (page === 2 && visibleCount > 8);
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setVisibleCount(page === 1 ? 8 : 16)}
                      className={`flex size-10 items-center justify-center text-[13px] cursor-pointer ${
                        isCurrentPage
                          ? "bg-[#172b24] text-[#f5f0e7] font-medium"
                          : "border border-[#e9e0d3] bg-white text-[#172b24]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              {visibleCount < filteredProducts.length && (
                <ButtonSecondary
                  label={`Load More Designs (${filteredProducts.length - visibleCount} remaining)`}
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                />
              )}
            </div>
          </div>
        </section>

        {/* TRENDING DESIGNS SECTION (12:21581) */}
        <section
          className="w-full bg-[#e9e0d3]"
          data-node-id="12:21581"
        >
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[32px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[64px]">
            <SectionHeadingWithViewAll
              eyebrow="LOVED FOR THEIR FIT AND FEEL"
              title="Trending Designs"
              description="Our most customized silhouettes across ateliers this season."
              actionLabel="Customize Your Own"
              actionHref="/customize"
            />
            <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full">
              {trendingProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  aspect="Compact"
                />
              ))}
            </div>
          </div>
        </section>

        {/* RECENTLY VIEWED SECTION (12:21692) */}
        <section
          className="mx-auto flex w-full max-w-[1440px] flex-col gap-[32px] px-4 sm:px-8 lg:px-[72px] py-14 lg:py-[64px]"
          data-node-id="12:21692"
        >
          <SectionHeadingWithViewAll
            eyebrow="CONTINUE WHERE YOU LEFT OFF"
            title="Recently Viewed"
            actionLabel="View Wishlist"
            actionHref="/account/wishlist"
          />
          <div className="grid grid-cols-1 gap-[24px] sm:grid-cols-2 lg:grid-cols-4 w-full">
            {recentlyViewedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                aspect="Compact"
              />
            ))}
          </div>
        </section>
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#172b24]/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative grid w-full max-w-[780px] grid-cols-1 md:grid-cols-2 gap-6 bg-[#f5f0e7] border border-[#b69a68] p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setQuickViewProduct(null)}
              aria-label="Close quick view"
              className="absolute top-4 right-4 flex size-9 items-center justify-center bg-white border border-[#e9e0d3] text-[#172b24] cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div className="relative h-[320px] md:h-[380px] w-full overflow-hidden bg-[#e9e0d3]">
              <img
                src={quickViewProduct.primaryImage}
                alt={quickViewProduct.name}
                className="size-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-2.5">
                <p className="text-[10px] tracking-[1.5px] text-[#172b24]">
                  {quickViewProduct.vendorName.toUpperCase()} · {quickViewProduct.gender.toUpperCase()}
                </p>
                <h3 className="font-serif text-[28px] text-[#172b24]">
                  {quickViewProduct.name}
                </h3>
                <p className="font-serif text-[20px] text-[#172b24]">
                  {formatStartingPrice(quickViewProduct.startingPriceInr)}
                </p>
                <p className="text-[13px] leading-[1.65] text-[#29251f]">
                  {quickViewProduct.description}
                </p>
                <div className="border-t border-[#e9e0d3] pt-3 text-[12px] text-[#29251f] space-y-1">
                  <p>
                    <strong className="text-[#172b24]">Fabric:</strong>{" "}
                    {quickViewProduct.fabricSummary}
                  </p>
                  <p>
                    <strong className="text-[#172b24]">Fit:</strong>{" "}
                    {quickViewProduct.fitSummary}
                  </p>
                  <p>
                    <strong className="text-[#172b24]">Tailoring Lead Time:</strong>{" "}
                    {quickViewProduct.leadTimeDays}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <ButtonPrimary
                  label="Customize This Product"
                  href={`/customize?product=${quickViewProduct.slug}`}
                />
                <ButtonSecondary
                  label="Full Details"
                  href={`/product/${quickViewProduct.slug}`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f5f0e7] p-12 text-center font-serif text-[20px] text-[#172b24]">
          Loading Tapestory Collection...
        </div>
      }
    >
      <ProductListingContent />
    </Suspense>
  );
}
