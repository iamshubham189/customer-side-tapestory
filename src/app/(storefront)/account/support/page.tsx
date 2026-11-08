"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { useTapestory } from "@/features/store-provider";

const FAQ_CATEGORIES = [
  "All Topics",
  "Orders & Tracking",
  "Customization",
  "Measurements",
  "Payments",
  "Delivery & Returns",
  "Account Management",
] as const;

type FaqCategory = (typeof FAQ_CATEGORIES)[number];

interface FaqItem {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    category: "Orders & Tracking",
    question: "How long does it take to craft and deliver a custom garment?",
    answer:
      "Most custom garments take 7–10 business days to craft at our partner ateliers, followed by 2–4 days for insured doorstep delivery. You can follow every stage—from fabric preparation to cutting, stitching, and quality check—on your Order Tracking page.",
  },
  {
    id: "faq-2",
    category: "Delivery & Returns",
    question: "What if my garment needs a small fit adjustment after delivery?",
    answer:
      "Every Tapestory garment includes complimentary minor fit care within 14 days of delivery. You can request a sleeve, hem, or waist refinement directly from My Orders → Reorder & Alteration, and we will arrange doorstep pickup and return.",
  },
  {
    id: "faq-3",
    category: "Customization",
    question: "Can I update my measurements or fabric choice after placing an order?",
    answer:
      "Yes—changes to measurements, collar/sleeve details, or fabric colour can be made free of charge within 12 hours of placing your order, before the atelier begins pattern cutting. Raise a request below quoting your Order ID for priority assistance.",
  },
  {
    id: "faq-4",
    category: "Measurements",
    question: "How do I create or update my body measurement profile?",
    answer:
      "Visit My Account → Measurements or the Measurements Studio to enter your dimensions in cm or inches using our illustrated step-by-step guide. You can save multiple profiles for different fit preferences (Slim, Regular, Relaxed) and preview them on our 3D Avatar.",
  },
  {
    id: "faq-5",
    category: "Payments",
    question: "Which payment methods are supported and how do refunds work?",
    answer:
      "We accept UPI, Visa/Mastercard/RuPay cards, NetBanking, and EMI via Razorpay. If you cancel an order before fabric cutting begins, 100% of your payment is refunded to your original payment method within 3–5 business days.",
  },
  {
    id: "faq-6",
    category: "Account Management",
    question: "Can I save multiple custom designs and share them before ordering?",
    answer:
      "Yes! Use the ‘Save Design’ button inside the Customization Studio to keep drafts or finished configurations in your Wishlist & Saved Designs library, complete with fabric swatches, custom notes, and estimated pricing.",
  },
];

export default function AccountSupportPage() {
  const { orders, supportTickets, createSupportTicket } = useTapestory();

  const [faqQuery, setFaqQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FaqCategory>("All Topics");
  const [openFaqId, setOpenFaqId] = useState<string>("faq-1");

  // Live Chat Drawer state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { sender: "agent" | "user"; text: string; time: string }[]
  >([
    {
      sender: "agent",
      text: "Hello Aarav! I’m Meera from Tapestory Atelier Care. How can I help you with your custom order or measurements today?",
      time: "Just now",
    },
  ]);

  // Raise a Request form state
  const [requestCategory, setRequestCategory] = useState("Order & Production Update");
  const [relatedOrderNumber, setRelatedOrderNumber] = useState(
    orders[0] ? `${orders[0].orderNumber} — ${orders[0].productName}` : "Order #TS-1068 — Linen Field Jacket"
  );
  const [subject, setSubject] = useState("Update sleeve length by +0.5 cm before cutting");
  const [description, setDescription] = useState(
    "Hello team, if cutting hasn’t started yet for #TS-1068, could the master tailor add 0.5 cm to the sleeve length for easier layering?"
  );
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [latestTicketNumber, setLatestTicketNumber] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCat =
        selectedCategory === "All Topics" || item.category === selectedCategory;
      const q = faqQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [selectedCategory, faqQuery]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, time: "Just now" },
      {
        sender: "agent",
        text: "Thank you! I’ve noted that on your order file and shared it with Atelier Niva’s pattern master. You’ll receive an update shortly.",
        time: "Just now",
      },
    ]);
    setChatInput("");
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) return;
    const orderNumMatch = relatedOrderNumber.match(/#TS-\d+/);
    const created = createSupportTicket({
      orderNumber: orderNumMatch ? orderNumMatch[0] : "#TS-1068",
      category: requestCategory,
      subject: subject.trim(),
      description: description.trim(),
    });
    setLatestTicketNumber(created.ticketNumber);
  };

  return (
    <div className="min-h-screen bg-[#f5efe6] text-[#1c1a17]">
      <Header activeNav="account" />

      <main className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 lg:px-14 lg:py-12">
        {/* Top Breadcrumb + Page Title (Figma 25:58280) */}
        <section className="border-b border-[#d8cec1] pb-7">
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-[#6a6258]"
          >
            <Link href="/" className="transition hover:text-[#1c1a17]">
              Home
            </Link>
            <span>/</span>
            <Link href="/account" className="transition hover:text-[#1c1a17]">
              My Account
            </Link>
            <span>/</span>
            <span className="font-medium text-[#1c1a17]">Support</span>
          </nav>

          <h1 className="font-serif text-[32px] font-medium leading-[1.15] text-[#1c1a17] sm:text-[38px]">
            How Can We Help?
          </h1>
          <p className="mt-1.5 text-[14px] leading-[22px] text-[#6a6258]">
            Find answers about custom clothing, measurements, orders, and post-delivery care.
          </p>
        </section>

        {/* Workspace Row: Left AccountSidebar + Right Support Content */}
        <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-start">
          <AccountSidebar activeTab="support" />

          <div className="min-w-0 flex-1 space-y-7">
            {/* Card 1: Help Centre & FAQs (Figma 25:58359) */}
            <section className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                    HELP CENTRE
                  </p>
                  <h2 className="mt-1 font-serif text-[26px] font-medium text-[#1c1a17]">
                    Find an answer
                  </h2>
                </div>
                <span className="text-[12px] text-[#6a6258]">
                  Updated for custom &amp; made-to-measure orders
                </span>
              </div>

              {/* Search Bar */}
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <input
                  type="search"
                  value={faqQuery}
                  onChange={(e) => setFaqQuery(e.target.value)}
                  placeholder="Search FAQs (e.g. measurements, alteration, delivery time)..."
                  className="h-[44px] flex-1 rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-4 text-[13px] text-[#1c1a17] placeholder:text-[#7c7367] focus:border-[#1c1a17] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex h-[44px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[13px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                >
                  Search
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {FAQ_CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                        active
                          ? "bg-[#1c1a17] text-[#fbf8f3]"
                          : "border border-[#d8cec1] bg-[#f8f3eb] text-[#6a6258] hover:border-[#1c1a17] hover:text-[#1c1a17]"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* FAQ Accordion Items */}
              <div className="mt-6 space-y-3">
                {filteredFaqs.length === 0 ? (
                  <div className="rounded-[4px] border border-[#d8cec1] bg-[#f8f3eb] p-5 text-center">
                    <p className="font-serif text-[18px] font-medium text-[#1c1a17]">
                      Couldn’t find a matching answer?
                    </p>
                    <p className="mt-1 text-[12px] text-[#6a6258]">
                      Try searching with fewer keywords like “linen care”, “cancel order”, or “fit
                      profile”, or chat directly with our support team below.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFaqQuery("");
                        setSelectedCategory("All Topics");
                      }}
                      className="mt-3 inline-flex h-[34px] items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17]"
                    >
                      Reset Search
                    </button>
                  </div>
                ) : (
                  filteredFaqs.map((item) => {
                    const isOpen = openFaqId === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-[4px] border transition ${
                          isOpen
                            ? "border-[#c8bba8] bg-[#f4ebdd]"
                            : "border-[#e2d8c9] bg-[#f8f3eb]"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenFaqId(isOpen ? "" : item.id)}
                          className="flex w-full items-center justify-between gap-4 p-4 text-left"
                        >
                          <span className="text-[14px] font-medium text-[#1c1a17]">
                            {item.question}
                          </span>
                          <span className="shrink-0 text-[18px] leading-none text-[#6a6258]">
                            {isOpen ? "−" : "+"}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="border-t border-[#e2d8c9] px-4 pb-4 pt-3 text-[13px] leading-[21px] text-[#5c5347]">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            {/* Card 2: Support Channels (Figma 25:58415) */}
            <section className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                    DIRECT ASSISTANCE
                  </p>
                  <h2 className="mt-1 font-serif text-[26px] font-medium text-[#1c1a17]">
                    A little help along the way.
                  </h2>
                </div>
                <span className="text-[12px] text-[#6a6258]">
                  Choose how you’d like to reach our atelier care team
                </span>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Chat with Support */}
                <div className="flex flex-col justify-between rounded-[4px] border border-[#d8cec1] bg-[#f8f3eb] p-5">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6efe8] px-2.5 py-0.5 text-[10px] font-medium text-[#2f5b3d]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#2f5b3d]" />
                      Available Now · 9 AM – 9 PM IST
                    </span>
                    <h3 className="mt-2.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                      Chat with Support
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-[19px] text-[#6a6258]">
                      Connect with a Tapestory fit &amp; order specialist for quick help with
                      sizing, fabric choices, or active orders.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setChatOpen((prev) => !prev)}
                    className="mt-4 inline-flex h-[38px] w-full items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                  >
                    {chatOpen ? "Close Live Chat" : "Start Live Chat"}
                  </button>
                </div>

                {/* Email Support */}
                <div className="flex flex-col justify-between rounded-[4px] border border-[#d8cec1] bg-[#f8f3eb] p-5">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#ede3d4] px-2.5 py-0.5 text-[10px] font-medium text-[#5c5347]">
                      Replies within 4–6 hours
                    </span>
                    <h3 className="mt-2.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                      Email Support
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-[19px] text-[#6a6258]">
                      Send us detailed questions, measurement reference photos, or collaboration
                      inquiries at care@tapestory.in.
                    </p>
                  </div>
                  <a
                    href="mailto:care@tapestory.in?subject=Tapestory%20Order%20Assistance"
                    className="mt-4 inline-flex h-[38px] w-full items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    Send an Email
                  </a>
                </div>

                {/* Order Assistance */}
                <div className="flex flex-col justify-between rounded-[4px] border border-[#d8cec1] bg-[#f8f3eb] p-5">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-[#efe4d2] px-2.5 py-0.5 text-[10px] font-medium text-[#7b5d2e]">
                      Priority for active orders
                    </span>
                    <h3 className="mt-2.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                      Order Assistance
                    </h3>
                    <p className="mt-1.5 text-[12px] leading-[19px] text-[#6a6258]">
                      Need help with an ongoing production step, shipping address change, or
                      post-delivery alteration request?
                    </p>
                  </div>
                  <Link
                    href="/orders"
                    className="mt-4 inline-flex h-[38px] w-full items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] transition hover:border-[#1c1a17]"
                  >
                    Select an Order
                  </Link>
                </div>
              </div>

              {/* Interactive Live Chat Panel */}
              {chatOpen && (
                <div className="mt-5 rounded-[4px] border border-[#1c1a17] bg-[#f8f3eb] p-4">
                  <div className="flex items-center justify-between border-b border-[#d8cec1] pb-3">
                    <div>
                      <p className="text-[12px] font-medium text-[#1c1a17]">
                        Tapestory Atelier Concierge · Meera
                      </p>
                      <p className="text-[11px] text-[#2f5b3d]">● Online · Connected to Order #TS-1068</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setChatOpen(false)}
                      className="text-[12px] text-[#6a6258] hover:text-[#1c1a17]"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="my-3 max-h-[200px] space-y-2.5 overflow-y-auto pr-1">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex flex-col ${
                          msg.sender === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-[4px] px-3.5 py-2 text-[12px] leading-[18px] ${
                            msg.sender === "user"
                              ? "bg-[#1c1a17] text-[#fbf8f3]"
                              : "border border-[#d8cec1] bg-[#fbf8f3] text-[#1c1a17]"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="mt-0.5 text-[10px] text-[#7c7367]">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Write a message to our fit specialist..."
                      className="h-[38px] flex-1 rounded-[3px] border border-[#d8cec1] bg-[#fbf8f3] px-3 text-[12px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="inline-flex h-[38px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-4 text-[12px] font-medium text-[#fbf8f3]"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}
            </section>

            {/* Card 3: Raise a Request Form (Figma 25:58449) */}
            <section
              id="raise-request"
              className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-6 sm:p-7"
            >
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                    SUPPORT REQUEST
                  </p>
                  <h2 className="mt-1 font-serif text-[26px] font-medium text-[#1c1a17]">
                    Raise a Request
                  </h2>
                </div>
                <span className="text-[12px] text-[#6a6258]">
                  Share your question or order issue and we’ll get back to you shortly
                </span>
              </div>

              {latestTicketNumber && (
                <div className="mt-4 rounded-[4px] border border-[#2f5b3d]/30 bg-[#e6efe8] px-4 py-3 text-[13px] font-medium text-[#2f5b3d]">
                  ✓ Support Ticket <strong>{latestTicketNumber}</strong> created! We’ve sent a
                  confirmation to aarav.mehta@email.com.
                </div>
              )}

              <form onSubmit={handleSubmitTicket} className="mt-5 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                      REQUEST CATEGORY
                    </label>
                    <select
                      value={requestCategory}
                      onChange={(e) => setRequestCategory(e.target.value)}
                      className="mt-1.5 h-[42px] w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-3 text-[13px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                    >
                      <option value="Order & Production Update">
                        Order &amp; Production Update
                      </option>
                      <option value="Measurement & Fit Consultation">
                        Measurement &amp; Fit Consultation
                      </option>
                      <option value="Post-Delivery Alteration">Post-Delivery Alteration</option>
                      <option value="Payment & Billing">Payment &amp; Billing</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                      RELATED ORDER ID
                    </label>
                    <select
                      value={relatedOrderNumber}
                      onChange={(e) => setRelatedOrderNumber(e.target.value)}
                      className="mt-1.5 h-[42px] w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-3 text-[13px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                    >
                      {orders.map((ord) => (
                        <option
                          key={ord.id}
                          value={`Order ${ord.orderNumber} — ${ord.productName}`}
                        >
                          Order {ord.orderNumber} — {ord.productName}
                        </option>
                      ))}
                      <option value="General Inquiry (No Order)">General Inquiry (No Order)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    SUBJECT
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1.5 h-[42px] w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] px-3.5 text-[13px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    DESCRIBE YOUR ISSUE
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1.5 w-full rounded-[3px] border border-[#d8cec1] bg-[#f8f3eb] p-3.5 text-[13px] leading-[20px] text-[#1c1a17] focus:border-[#1c1a17] focus:outline-none"
                  />
                </div>

                {/* Upload Attachment */}
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    UPLOAD ATTACHMENTS (OPTIONAL)
                  </p>
                  <div className="mt-1.5 flex flex-col justify-between gap-3 rounded-[4px] border border-dashed border-[#c8bba8] bg-[#f8f3eb] p-4 sm:flex-row sm:items-center">
                    <span className="text-[12px] text-[#6a6258]">
                      {attachmentName
                        ? `Attached: ${attachmentName}`
                        : "Attach reference photos, measurement notes, or screenshots (PNG, JPG, PDF up to 10 MB)"}
                    </span>
                    <label className="inline-flex h-[36px] shrink-0 cursor-pointer items-center justify-center rounded-[3px] border border-[#cfc3b2] bg-[#fbf8f3] px-4 text-[12px] font-medium text-[#1c1a17] hover:border-[#1c1a17]">
                      Choose File
                      <input
                        type="file"
                        onChange={(e) =>
                          setAttachmentName(e.target.files?.[0]?.name || null)
                        }
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-3 border-t border-[#e7dfd3] pt-4 sm:flex-row sm:items-center">
                  <span className="text-[12px] text-[#6a6258]">
                    We’ll send a ticket confirmation and updates to aarav.mehta@email.com
                  </span>
                  <button
                    type="submit"
                    className="inline-flex h-[42px] items-center justify-center rounded-[3px] bg-[#1c1a17] px-6 text-[13px] font-medium text-[#fbf8f3] transition hover:bg-[#322d27]"
                  >
                    Submit Request
                  </button>
                </div>
              </form>

              {/* Recent Tickets */}
              {supportTickets.length > 0 && (
                <div className="mt-6 border-t border-[#e7dfd3] pt-5">
                  <p className="text-[11px] font-medium uppercase tracking-[1.54px] text-[#7c7367]">
                    YOUR RECENT SUPPORT TICKETS
                  </p>
                  <div className="mt-3 space-y-2.5">
                    {supportTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="flex flex-col justify-between gap-2 rounded-[4px] border border-[#e2d8c9] bg-[#f8f3eb] p-3.5 sm:flex-row sm:items-center"
                      >
                        <div>
                          <p className="text-[13px] font-medium text-[#1c1a17]">
                            {ticket.ticketNumber} · {ticket.subject}
                          </p>
                          <p className="text-[11px] text-[#6a6258]">
                            {ticket.category}{" "}
                            {ticket.orderNumber ? `· Order ${ticket.orderNumber}` : ""} ·{" "}
                            {ticket.lastResponse}
                          </p>
                        </div>
                        <span className="w-fit rounded-full bg-[#e6efe8] px-3 py-0.5 text-[11px] font-medium text-[#2f5b3d]">
                          {ticket.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Alternate Support Experiences (Figma 25:58508) */}
            <section className="pt-2">
              <p className="text-[11px] font-medium uppercase tracking-[1.76px] text-[#7c7367]">
                ALTERNATE SUPPORT EXPERIENCES
              </p>

              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#2f5b3d]">
                    REQUEST SUBMITTED
                  </p>
                  <h3 className="mt-1.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                    Ticket {latestTicketNumber || "#SUP-4092"} Created
                  </h3>
                  <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                    Your request for Order #TS-1068 has been shared with Atelier Niva and our care
                    specialist. Expected reply within 4 hours.
                  </p>
                </div>

                <div className="rounded-[4px] border border-[#d8cec1] bg-[#fbf8f3] p-5">
                  <p className="text-[10px] font-medium uppercase tracking-[1.4px] text-[#7c7367]">
                    NO FAQ RESULTS
                  </p>
                  <h3 className="mt-1.5 font-serif text-[20px] font-medium text-[#1c1a17]">
                    Couldn’t find a matching answer?
                  </h3>
                  <p className="mt-1 text-[12px] leading-[19px] text-[#6a6258]">
                    Try searching with fewer keywords like “linen care”, “cancel order”, or “fit
                    profile”, or chat directly with our support team above.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
