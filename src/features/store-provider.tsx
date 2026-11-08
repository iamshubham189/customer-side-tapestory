"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  SEED_ADDRESSES,
  SEED_ALTERATION_REQUESTS,
  SEED_MEASUREMENT_PROFILES,
  SEED_NOTIFICATIONS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_REVIEWS,
  SEED_SAVED_DESIGNS,
  SEED_SUPPORT_TICKETS,
} from "@/lib/backend/seed-data";
import { DEFAULT_CUSTOMER_PROFILE, type CustomerProfile } from "@/services/account.service";
import {
  calculateEstimatedPrice,
  createDefaultConfiguration,
} from "@/services/customization.service";
import type {
  Address,
  AlterationRequest,
  CartItem,
  GarmentConfiguration,
  MeasurementProfile,
  NotificationItem,
  Order,
  ReviewItem,
  SavedDesign,
  SupportTicket,
} from "@/types";

interface TapestoryStoreContextValue {
  isHydrated: boolean;
  user: CustomerProfile | null;
  loginUser: (partial?: Partial<CustomerProfile>) => void;
  logoutUser: () => void;
  updateUserProfile: (updates: Partial<CustomerProfile>) => void;

  // Customization Studio
  activeConfiguration: GarmentConfiguration;
  setActiveConfiguration: React.Dispatch<React.SetStateAction<GarmentConfiguration>>;
  loadProductIntoStudio: (productSlugOrId: string) => void;
  loadSavedDesignIntoStudio: (savedDesignId: string) => void;

  // Saved Designs & Drafts
  savedDesigns: SavedDesign[];
  saveDesignToCollection: (
    name: string,
    collectionTag: string,
    status: "Saved" | "Draft",
    config?: GarmentConfiguration
  ) => SavedDesign;
  deleteSavedDesign: (id: string) => void;

  // Measurements
  measurementProfiles: MeasurementProfile[];
  activeMeasurementProfileId: string;
  setActiveMeasurementProfileId: (id: string) => void;
  saveMeasurementProfile: (
    profile: Omit<MeasurementProfile, "id" | "lastUpdated" | "version" | "history"> & {
      id?: string;
      changeNote?: string;
    }
  ) => MeasurementProfile;
  setDefaultMeasurementProfile: (id: string) => void;
  deleteMeasurementProfile: (id: string) => void;

  // Wishlist
  wishlistProductIds: string[];
  toggleWishlistProduct: (productId: string) => void;
  isProductWishlisted: (productId: string) => boolean;

  // Cart & Checkout
  cart: CartItem[];
  addToCart: (config: GarmentConfiguration, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  couponCode: string | null;
  couponDiscountInr: number;
  applyCouponCode: (code: string) => { valid: boolean; message: string };
  removeCouponCode: () => void;

  // Addresses
  addresses: Address[];
  saveAddress: (address: Omit<Address, "id"> & { id?: string }) => Address;
  setDefaultAddress: (id: string) => void;
  deleteAddress: (id: string) => void;

  // Orders, Alterations & Reviews
  orders: Order[];
  createConfirmedOrder: (params: {
    shippingAddress: Address;
    paymentMethod: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
  }) => Order[];
  alterationRequests: AlterationRequest[];
  submitAlterationRequest: (
    payload: Omit<
      AlterationRequest,
      "id" | "requestNumber" | "status" | "submittedDate" | "estimatedCompletion"
    >
  ) => AlterationRequest;
  reviews: ReviewItem[];
  submitCustomerReview: (
    payload: Omit<ReviewItem, "id" | "date" | "status" | "verifiedPurchase">
  ) => ReviewItem;

  // Notifications & Support
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  supportTickets: SupportTicket[];
  createSupportTicket: (
    payload: Pick<SupportTicket, "orderNumber" | "category" | "subject" | "description">
  ) => SupportTicket;
}

const STORAGE_KEY = "tapestory_customer_store_v1";

const DEFAULT_CART: CartItem[] = [
  {
    id: "cart-seed-1",
    configuration: SEED_SAVED_DESIGNS[0].configuration,
    quantity: 1,
    addedAt: "2026-11-02T10:30:00.000Z",
  },
];

const DEFAULT_WISHLIST_IDS = [
  "prod-linen-field-jacket",
  "prod-everyday-linen-suit",
  "prod-sand-linen-coord",
  "prod-a-line-dress",
];

const TapestoryContext = createContext<TapestoryStoreContextValue | undefined>(undefined);

export function TapestoryProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<CustomerProfile | null>(DEFAULT_CUSTOMER_PROFILE);
  const [activeConfiguration, setActiveConfiguration] = useState<GarmentConfiguration>(() =>
    createDefaultConfiguration("linen-field-jacket")
  );
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>(SEED_SAVED_DESIGNS);
  const [measurementProfiles, setMeasurementProfiles] = useState<MeasurementProfile[]>(
    SEED_MEASUREMENT_PROFILES
  );
  const [activeMeasurementProfileId, setActiveMeasurementProfileId] = useState<string>(
    SEED_MEASUREMENT_PROFILES[0].id
  );
  const [wishlistProductIds, setWishlistProductIds] = useState<string[]>(DEFAULT_WISHLIST_IDS);
  const [cart, setCart] = useState<CartItem[]>(DEFAULT_CART);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>(SEED_ADDRESSES);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [alterationRequests, setAlterationRequests] = useState<AlterationRequest[]>(
    SEED_ALTERATION_REQUESTS
  );
  const [reviews, setReviews] = useState<ReviewItem[]>(SEED_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(SEED_NOTIFICATIONS);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(SEED_SUPPORT_TICKETS);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.user !== undefined) setUser(parsed.user);
        if (parsed.activeConfiguration) setActiveConfiguration(parsed.activeConfiguration);
        if (Array.isArray(parsed.savedDesigns)) setSavedDesigns(parsed.savedDesigns);
        if (Array.isArray(parsed.measurementProfiles))
          setMeasurementProfiles(parsed.measurementProfiles);
        if (parsed.activeMeasurementProfileId)
          setActiveMeasurementProfileId(parsed.activeMeasurementProfileId);
        if (Array.isArray(parsed.wishlistProductIds))
          setWishlistProductIds(parsed.wishlistProductIds);
        if (Array.isArray(parsed.cart)) setCart(parsed.cart);
        if (parsed.couponCode !== undefined) setCouponCode(parsed.couponCode);
        if (Array.isArray(parsed.addresses)) setAddresses(parsed.addresses);
        if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
        if (Array.isArray(parsed.alterationRequests))
          setAlterationRequests(parsed.alterationRequests);
        if (Array.isArray(parsed.reviews)) setReviews(parsed.reviews);
        if (Array.isArray(parsed.notifications)) setNotifications(parsed.notifications);
        if (Array.isArray(parsed.supportTickets)) setSupportTickets(parsed.supportTickets);
      }
    } catch {
      // Ignore malformed storage
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user,
          activeConfiguration,
          savedDesigns,
          measurementProfiles,
          activeMeasurementProfileId,
          wishlistProductIds,
          cart,
          couponCode,
          addresses,
          orders,
          alterationRequests,
          reviews,
          notifications,
          supportTickets,
        })
      );
    } catch {
      // Storage quota exceeded or private browsing
    }
  }, [
    isHydrated,
    user,
    activeConfiguration,
    savedDesigns,
    measurementProfiles,
    activeMeasurementProfileId,
    wishlistProductIds,
    cart,
    couponCode,
    addresses,
    orders,
    alterationRequests,
    reviews,
    notifications,
    supportTickets,
  ]);

  const loginUser = useCallback((partial?: Partial<CustomerProfile>) => {
    setUser((prev) => ({
      ...(prev ?? DEFAULT_CUSTOMER_PROFILE),
      ...partial,
    }));
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
  }, []);

  const updateUserProfile = useCallback((updates: Partial<CustomerProfile>) => {
    setUser((prev) => {
      const base = prev ?? DEFAULT_CUSTOMER_PROFILE;
      const nextName = updates.fullName ?? base.fullName;
      const initials = nextName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
      return {
        ...base,
        ...updates,
        avatarInitials: initials || base.avatarInitials,
      };
    });
  }, []);

  const loadProductIntoStudio = useCallback((productSlugOrId: string) => {
    const nextConfig = createDefaultConfiguration(productSlugOrId);
    setActiveConfiguration(nextConfig);
  }, []);

  const loadSavedDesignIntoStudio = useCallback(
    (savedDesignId: string) => {
      const found = savedDesigns.find((d) => d.id === savedDesignId);
      if (found) {
        setActiveConfiguration({ ...found.configuration });
      }
    },
    [savedDesigns]
  );

  const saveDesignToCollection = useCallback(
    (
      name: string,
      collectionTag: string,
      status: "Saved" | "Draft",
      config?: GarmentConfiguration
    ): SavedDesign => {
      const targetConfig = config ?? activeConfiguration;
      const computedPrice = calculateEstimatedPrice(targetConfig);
      const entry: SavedDesign = {
        id: `saved-${Date.now()}`,
        name: name.trim() || `${targetConfig.color.name} ${targetConfig.productName}`,
        collectionTag: collectionTag.trim() || `Personal Archive · ${targetConfig.vendorName}`,
        status,
        updatedAt: "Just now · 8 Nov 2026",
        configuration: {
          ...targetConfig,
          totalEstimatedPriceInr: computedPrice,
        },
      };
      setSavedDesigns((prev) => [entry, ...prev]);
      return entry;
    },
    [activeConfiguration]
  );

  const deleteSavedDesign = useCallback((id: string) => {
    setSavedDesigns((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const saveMeasurementProfile = useCallback(
    (
      payload: Omit<MeasurementProfile, "id" | "lastUpdated" | "version" | "history"> & {
        id?: string;
        changeNote?: string;
      }
    ): MeasurementProfile => {
      const existing = payload.id
        ? measurementProfiles.find((m) => m.id === payload.id)
        : undefined;

      const nextVersion = existing ? existing.version + 1 : 1;
      const dateStr = "08 Nov 2026";
      const summary = `Chest ${payload.values.chest} ${payload.unit} · Waist ${payload.values.waist} ${payload.unit} · Hips ${payload.values.seatHips} ${payload.unit} · Shoulder ${payload.values.shoulderWidth} ${payload.unit}`;

      const updatedProfile: MeasurementProfile = {
        id: existing?.id ?? `meas-${Date.now()}`,
        name: payload.name,
        forPerson: payload.forPerson,
        genderFit: payload.genderFit,
        unit: payload.unit,
        method: payload.method,
        fitPreference: payload.fitPreference,
        postureNotes: payload.postureNotes,
        isDefault: payload.isDefault,
        lastUpdated: dateStr,
        version: nextVersion,
        values: payload.values,
        history: [
          {
            version: nextVersion,
            date: dateStr,
            note:
              payload.changeNote ||
              (existing
                ? "Updated measurements in Measurements Studio"
                : "Created new measurement profile"),
            summary,
          },
          ...(existing?.history ?? []),
        ],
      };

      setMeasurementProfiles((prev) => {
        const list = existing
          ? prev.map((item) => (item.id === existing.id ? updatedProfile : item))
          : [updatedProfile, ...prev];
        if (updatedProfile.isDefault) {
          return list.map((item) => ({
            ...item,
            isDefault: item.id === updatedProfile.id,
          }));
        }
        return list;
      });

      setActiveMeasurementProfileId(updatedProfile.id);
      setActiveConfiguration((prev) => ({
        ...prev,
        measurementProfileId: updatedProfile.id,
        measurementProfileName: updatedProfile.name,
      }));

      return updatedProfile;
    },
    [measurementProfiles]
  );

  const setDefaultMeasurementProfile = useCallback((id: string) => {
    setMeasurementProfiles((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    setActiveMeasurementProfileId(id);
  }, []);

  const deleteMeasurementProfile = useCallback((id: string) => {
    setMeasurementProfiles((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const toggleWishlistProduct = useCallback((productId: string) => {
    setWishlistProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [productId, ...prev]
    );
  }, []);

  const isProductWishlisted = useCallback(
    (productId: string) => wishlistProductIds.includes(productId),
    [wishlistProductIds]
  );

  const addToCart = useCallback((config: GarmentConfiguration, quantity = 1) => {
    const price = calculateEstimatedPrice(config);
    const newItem: CartItem = {
      id: `cart-${Date.now()}`,
      configuration: {
        ...config,
        totalEstimatedPriceInr: price,
      },
      quantity,
      addedAt: new Date().toISOString(),
    };
    setCart((prev) => [newItem, ...prev]);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  }, []);

  const updateCartQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== cartItemId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCouponCode(null);
  }, []);

  const cartSubtotalInr = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + item.configuration.totalEstimatedPriceInr * item.quantity,
        0
      ),
    [cart]
  );

  const couponDiscountInr = useMemo(() => {
    if (!couponCode) return 0;
    const upper = couponCode.toUpperCase();
    if (upper === "TAPESTORY10" || upper === "BESPOKE10") {
      return Math.round(cartSubtotalInr * 0.1);
    }
    if (upper === "ATELIER500") {
      return Math.min(500, cartSubtotalInr);
    }
    return 0;
  }, [couponCode, cartSubtotalInr]);

  const applyCouponCode = useCallback((code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === "TAPESTORY10" || clean === "BESPOKE10") {
      setCouponCode(clean);
      return {
        valid: true,
        message: `Coupon ${clean} applied — 10% bespoke privilege discount unlocked.`,
      };
    }
    if (clean === "ATELIER500") {
      setCouponCode(clean);
      return {
        valid: true,
        message: "Coupon ATELIER500 applied — ₹500 complimentary tailoring credit added.",
      };
    }
    return {
      valid: false,
      message: "Invalid code. Try TAPESTORY10 (10% off) or ATELIER500 (₹500 off).",
    };
  }, []);

  const removeCouponCode = useCallback(() => {
    setCouponCode(null);
  }, []);

  const saveAddress = useCallback(
    (payload: Omit<Address, "id"> & { id?: string }): Address => {
      const saved: Address = {
        ...payload,
        id: payload.id ?? `addr-${Date.now()}`,
      };
      setAddresses((prev) => {
        const exists = prev.some((a) => a.id === saved.id);
        const list = exists
          ? prev.map((a) => (a.id === saved.id ? saved : a))
          : [saved, ...prev];
        if (saved.isDefault) {
          return list.map((a) => ({ ...a, isDefault: a.id === saved.id }));
        }
        return list;
      });
      return saved;
    },
    []
  );

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  }, []);

  const deleteAddress = useCallback((id: string) => {
    setAddresses((prev) => (prev.length <= 1 ? prev : prev.filter((a) => a.id !== id)));
  }, []);

  const createConfirmedOrder = useCallback(
    (params: {
      shippingAddress: Address;
      paymentMethod: string;
      razorpayOrderId: string;
      razorpayPaymentId: string;
    }): Order[] => {
      const itemsToOrder =
        cart.length > 0
          ? cart
          : [
              {
                id: "cart-fallback",
                configuration: activeConfiguration,
                quantity: 1,
                addedAt: new Date().toISOString(),
              },
            ];

      const createdOrders: Order[] = itemsToOrder.map((item, idx) => {
        const numericId = 1075 + orders.length + idx;
        const orderCode = `TS-${numericId}`;
        const productObj = SEED_PRODUCTS.find((p) => p.id === item.configuration.productId);
        const itemTotal = item.configuration.totalEstimatedPriceInr * item.quantity;
        const discountShare = idx === 0 ? couponDiscountInr : 0;

        return {
          id: orderCode,
          orderNumber: `#${orderCode}`,
          placedDate: "8 Nov 2026",
          statusCategory: "Ongoing",
          currentStage: "Order Confirmed",
          estimatedDelivery: "20 Nov 2026",
          productId: item.configuration.productId,
          productSlug: productObj?.slug ?? "linen-field-jacket",
          productName: item.configuration.productName,
          productImage: item.configuration.productImage,
          vendorId: item.configuration.vendorId,
          vendorName: item.configuration.vendorName,
          vendorSlug: productObj?.vendorSlug ?? "atelier-niva",
          vendorLocation: productObj?.vendorLocation ?? "New Delhi, India",
          fabricSummary: `${item.configuration.fabric.composition} · ${item.configuration.color.name}`,
          colorName: item.configuration.color.name,
          fitSummary: `${item.configuration.styleSilhouette.name} · ${item.configuration.details.collar} · ${item.configuration.details.cuffs}`,
          measurementProfileName:
            item.configuration.measurementProfileName ?? "Ananya — Everyday Relaxed Fit",
          customDetailsSummary: [
            `Style: ${item.configuration.productName} (${item.configuration.styleSilhouette.name})`,
            `Fabric: ${item.configuration.fabric.name} · ${item.configuration.color.name} · ${item.configuration.pattern.name}`,
            `Collar & Sleeves: ${item.configuration.details.collar} · ${item.configuration.details.sleeves}`,
            `Cuffs & Pockets: ${item.configuration.details.cuffs} · ${item.configuration.details.pockets}`,
            ...(item.configuration.personalNotes
              ? [`Personal Note: ${item.configuration.personalNotes}`]
              : []),
          ],
          subtotalInr: item.configuration.basePriceInr * item.quantity,
          customizationFeeInr: Math.max(
            0,
            itemTotal - item.configuration.basePriceInr * item.quantity
          ),
          shippingInr: 0,
          taxInr: 0,
          discountInr: discountShare,
          totalInr: Math.max(999, itemTotal - discountShare),
          paymentMethod: params.paymentMethod,
          paymentStatus: "Paid",
          razorpayOrderId: params.razorpayOrderId,
          razorpayPaymentId: params.razorpayPaymentId,
          shippingAddress: params.shippingAddress,
          trackingNumber: `BLR-DEL-${990100 + numericId}`,
          courierPartner: "BlueDart Bespoke Priority",
          eligibleForReview: false,
          eligibleForAlteration: false,
          timeline: [
            {
              id: `tl-${orderCode}-1`,
              stage: "Order Confirmed & Pattern Assigned",
              status: "current",
              date: "08 Nov 2026 · Just now",
              description: `Payment verified via Razorpay (${params.razorpayPaymentId}). Assigned to ${item.configuration.vendorName}.`,
              makerNote:
                "“We have received your custom ticket and measurement profile. Master cutter review begins within 24 hours.”",
            },
            {
              id: `tl-${orderCode}-2`,
              stage: "Pattern Drafting & Fabric Inspection",
              status: "upcoming",
              date: "Expected 10 Nov 2026",
              description: "Individual paper pattern drafting and pre-shrinking of fabric.",
            },
            {
              id: `tl-${orderCode}-3`,
              stage: "Cutting & Hand Tailoring",
              status: "upcoming",
              date: "Expected 13 Nov 2026",
              description: "Panel cutting, basting and hand-finishing of collar and pockets.",
            },
            {
              id: `tl-${orderCode}-4`,
              stage: "Finishing & 18-Point Quality Check",
              status: "upcoming",
              date: "Expected 17 Nov 2026",
              description: "Final measurement verification against your profile.",
            },
            {
              id: `tl-${orderCode}-5`,
              stage: "Dispatched & Insured Delivery",
              status: "upcoming",
              date: "Expected 20 Nov 2026",
              description: `Insured courier delivery to ${params.shippingAddress.city}.`,
            },
          ],
        };
      });

      setOrders((prev) => [...createdOrders, ...prev]);
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          category: "Order Updates",
          title: `Order ${createdOrders[0].orderNumber} Confirmed with ${createdOrders[0].vendorName}`,
          message: `Your custom ${createdOrders[0].productName} order has been verified and queued for pattern drafting.`,
          timestamp: "Just now · 8 Nov 2026",
          isRead: false,
          actionLabel: `Track ${createdOrders[0].orderNumber}`,
          actionHref: `/orders/${createdOrders[0].id}`,
          iconType: "package",
        },
        ...prev,
      ]);
      setCart([]);
      setCouponCode(null);

      return createdOrders;
    },
    [cart, activeConfiguration, orders.length, couponDiscountInr]
  );

  const submitAlterationRequest = useCallback(
    (
      payload: Omit<
        AlterationRequest,
        "id" | "requestNumber" | "status" | "submittedDate" | "estimatedCompletion"
      >
    ): AlterationRequest => {
      const nextNum = 205 + alterationRequests.length;
      const req: AlterationRequest = {
        ...payload,
        id: `alt-${Date.now()}`,
        requestNumber: `#ALT-${nextNum}`,
        status: "Submitted",
        submittedDate: "08 Nov 2026",
        estimatedCompletion: "16 Nov 2026",
      };
      setAlterationRequests((prev) => [req, ...prev]);
      return req;
    },
    [alterationRequests.length]
  );

  const submitCustomerReview = useCallback(
    (
      payload: Omit<ReviewItem, "id" | "date" | "status" | "verifiedPurchase">
    ): ReviewItem => {
      const created: ReviewItem = {
        ...payload,
        id: `rev-${Date.now()}`,
        date: "08 Nov 2026",
        status: "Published",
        verifiedPurchase: true,
      };
      setReviews((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const createSupportTicket = useCallback(
    (
      payload: Pick<SupportTicket, "orderNumber" | "category" | "subject" | "description">
    ): SupportTicket => {
      const nextNum = 420 + supportTickets.length;
      const ticket: SupportTicket = {
        id: `sup-${Date.now()}`,
        ticketNumber: `#SUP-${nextNum}`,
        orderNumber: payload.orderNumber,
        category: payload.category,
        subject: payload.subject,
        description: payload.description,
        status: "Open",
        createdAt: "08 Nov 2026",
        updatedAt: "08 Nov 2026",
        lastResponse:
          "Your request has been assigned to a Tapestory Bespoke Concierge specialist. Typical response time is under 2 hours.",
      };
      setSupportTickets((prev) => [ticket, ...prev]);
      return ticket;
    },
    [supportTickets.length]
  );

  const value = useMemo<TapestoryStoreContextValue>(
    () => ({
      isHydrated,
      user,
      loginUser,
      logoutUser,
      updateUserProfile,
      activeConfiguration,
      setActiveConfiguration,
      loadProductIntoStudio,
      loadSavedDesignIntoStudio,
      savedDesigns,
      saveDesignToCollection,
      deleteSavedDesign,
      measurementProfiles,
      activeMeasurementProfileId,
      setActiveMeasurementProfileId,
      saveMeasurementProfile,
      setDefaultMeasurementProfile,
      deleteMeasurementProfile,
      wishlistProductIds,
      toggleWishlistProduct,
      isProductWishlisted,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      couponCode,
      couponDiscountInr,
      applyCouponCode,
      removeCouponCode,
      addresses,
      saveAddress,
      setDefaultAddress,
      deleteAddress,
      orders,
      createConfirmedOrder,
      alterationRequests,
      submitAlterationRequest,
      reviews,
      submitCustomerReview,
      notifications,
      unreadNotificationsCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      supportTickets,
      createSupportTicket,
    }),
    [
      isHydrated,
      user,
      loginUser,
      logoutUser,
      updateUserProfile,
      activeConfiguration,
      loadProductIntoStudio,
      loadSavedDesignIntoStudio,
      savedDesigns,
      saveDesignToCollection,
      deleteSavedDesign,
      measurementProfiles,
      activeMeasurementProfileId,
      saveMeasurementProfile,
      setDefaultMeasurementProfile,
      deleteMeasurementProfile,
      wishlistProductIds,
      toggleWishlistProduct,
      isProductWishlisted,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      couponCode,
      couponDiscountInr,
      applyCouponCode,
      removeCouponCode,
      addresses,
      saveAddress,
      setDefaultAddress,
      deleteAddress,
      orders,
      createConfirmedOrder,
      alterationRequests,
      submitAlterationRequest,
      reviews,
      submitCustomerReview,
      notifications,
      unreadNotificationsCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      supportTickets,
      createSupportTicket,
    ]
  );

  return <TapestoryContext.Provider value={value}>{children}</TapestoryContext.Provider>;
}

export function useTapestory() {
  const ctx = useContext(TapestoryContext);
  if (!ctx) {
    throw new Error("useTapestory must be used within a TapestoryProvider");
  }
  return ctx;
}

export const useTapestoryStore = useTapestory;
