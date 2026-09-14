import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleDot,
  Copy,
  ImageOff,
  Loader2,
  MapPin,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";

import { API_BASE_URL } from "../config";

const STATUS_STEPS = [
  { key: "Pending", title: "Order Placed", icon: Package },
  { key: "Processing", title: "Processing", icon: CheckCircle2 },
  { key: "Shipped", title: "Shipped", icon: Truck },
  { key: "Delivered", title: "Delivered", icon: CheckCircle2 },
];

const OrderTracking = () => {
  const pageRef = useRef(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll("[data-reveal]");

    if (!elements?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ectoo-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [order]);

  const getImageUrl = (image) => {
    if (!image) return "";

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getDestination = (shippingAddress) => {
    if (!shippingAddress) return "—";

    return [shippingAddress.city, shippingAddress.state]
      .filter(Boolean)
      .join(", ");
  };

  const handleTrackOrder = async (event) => {
    event.preventDefault();

    const value = trackingNumber.trim().toUpperCase();

    setError("");
    setOrder(null);

    if (!value) {
      setError("Please enter your order number.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/orders/track/${encodeURIComponent(value)}`
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "We couldn't find an order with this number. Please check and try again."
        );
      }

      setOrder(data.order);
    } catch (fetchError) {
      setError(
        fetchError?.message ||
          "Unable to retrieve this order right now. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCopyTracking = async () => {
    if (!order?.orderNumber) return;

    try {
      await navigator.clipboard.writeText(order.orderNumber);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(
      `Order Support - ${order?.orderNumber || ""}`
    );

    window.location.href = `mailto:info@ectoo.us?subject=${subject}`;
  };

  const isCancelled = order?.status === "Cancelled";

  const currentStepIndex = order
    ? STATUS_STEPS.findIndex((step) => step.key === order.status)
    : -1;

  return (
    <main
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(34px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-42px);
        }

        [data-reveal="right"] {
          transform: translateX(42px);
        }

        [data-reveal="scale"] {
          transform: scale(0.96);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .ectoo-lift {
          transition:
            transform 0.35s ease,
            box-shadow 0.35s ease,
            border-color 0.35s ease;
        }

        .ectoo-lift:hover {
          transform: translateY(-5px);
          border-color: rgba(31, 45, 34, 0.2);
          box-shadow: 0 20px 55px rgba(31, 45, 34, 0.08);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>

      <section className="relative isolate overflow-hidden border-b border-[#E4DED7] bg-[#EEE7DF]">
        <div className="absolute left-0 top-0 h-full w-full">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border border-[#1F2D22]/10" />
          <div className="absolute -left-10 -top-10 h-48 w-48 rounded-full border border-[#1F2D22]/10" />
          <div className="absolute right-[-120px] top-[-80px] h-80 w-80 rounded-full bg-[#E4E5DD]" />
          <div className="absolute bottom-[-100px] right-[12%] h-60 w-60 rounded-full border border-[#9A5937]/20" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-12 lg:py-24">
          <div data-reveal="left" className="flex items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-[#9A5937]">
                Ectoo Order Care
              </p>

              <h1 className="mt-5 max-w-xl font-display text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
                Follow your order from checkout to delivery.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#5E5B57] sm:text-base">
                Enter your order number below to view the latest status available
                for your purchase.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-[#5E5B57]">
                <span className="rounded-full border border-[#1F2D22]/10 bg-white/55 px-4 py-2">
                  Live order status
                </span>
                <span className="rounded-full border border-[#1F2D22]/10 bg-white/55 px-4 py-2">
                  Delivery progress
                </span>
                <span className="rounded-full border border-[#1F2D22]/10 bg-white/55 px-4 py-2">
                  Order details
                </span>
              </div>
            </div>
          </div>

          <div data-reveal="right" className="relative">
            <div className="relative min-h-[430px] overflow-hidden rounded-[34px] bg-[#1F2D22] p-5 shadow-[0_28px_80px_rgba(31,45,34,0.16)] sm:p-7">
              <img
                src="/order tracking.png"
                alt="Track Your Order"
                className="absolute inset-0 h-full w-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F2D22] via-[#1F2D22]/65 to-[#1F2D22]/10" />

              <div className="relative flex min-h-[376px] flex-col justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur">
                  <Truck size={24} />
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/50">
                    Simple tracking
                  </p>
                  <h2 className="mt-3 max-w-xs font-display text-4xl leading-tight text-white">
                    One number. One clear view of your order.
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-6 max-w-7xl px-5 sm:px-8 lg:px-12">
        <div
          data-reveal="scale"
          className="rounded-[28px] border border-[#E4DED7] bg-white p-5 shadow-[0_24px_70px_rgba(31,45,34,0.08)] sm:p-7 lg:p-8"
        >
          <form
            onSubmit={handleTrackOrder}
            className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"
          >
            <div>
              <label
                htmlFor="trackingNumber"
                className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5E5B57]"
              >
                Order Number
              </label>

              <div className="relative">
                <Package
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5B57]/70"
                />

                <input
                  id="trackingNumber"
                  type="text"
                  value={trackingNumber}
                  onChange={(event) => {
                    setTrackingNumber(event.target.value);
                    setError("");
                  }}
                  placeholder="Example: EC-123456"
                  className={`h-14 w-full rounded-[16px] border bg-[#FAF8F5] pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-[#5E5B57]/50 focus:bg-white focus:shadow-[0_0_0_4px_rgba(31,45,34,0.05)] ${
                    error
                      ? "border-red-300 focus:border-red-500"
                      : "border-[#E4DED7] focus:border-[#1F2D22]"
                  }`}
                />
              </div>

              {error && (
                <p className="mt-3 text-sm font-semibold text-red-600">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-14 items-center justify-center gap-2 rounded-[16px] bg-[#1F2D22] px-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_14px_30px_rgba(31,45,34,0.15)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F4C3A] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search size={17} />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {!order && !error && !loading && (
        <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-reveal="left" className="flex items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9A5937]">
                  How it works
                </p>
                <h2 className="mt-4 max-w-sm font-display text-4xl leading-tight sm:text-5xl">
                  A quieter, clearer way to check your order.
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-[#5E5B57]">
                  Use the order number from your confirmation and we’ll show the
                  latest status stored for your order.
                </p>
              </div>
            </div>

            <div data-reveal="right" className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Package,
                  number: "01",
                  title: "Enter your order",
                  description:
                    "Use the order number from your existing order confirmation.",
                },
                {
                  icon: Truck,
                  number: "02",
                  title: "View the progress",
                  description:
                    "See the current order stage and the latest available update.",
                },
                {
                  icon: CheckCircle2,
                  number: "03",
                  title: "Need more help?",
                  description:
                    "Contact support if anything about your order needs attention.",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="ectoo-lift rounded-[24px] border border-[#E4DED7] bg-white p-6"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8E7DF] text-[#1F2D22]">
                        <Icon size={19} />
                      </div>
                      <span className="font-display text-2xl text-[#1F2D22]/20">
                        {item.number}
                      </span>
                    </div>

                    <h3 className="mt-7 font-display text-2xl leading-tight">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-[#5E5B57]">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {order && (
        <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div
            data-reveal="scale"
            className="overflow-hidden rounded-[30px] border border-[#E4DED7] bg-white shadow-[0_20px_60px_rgba(31,45,34,0.05)]"
          >
            <div className="grid gap-0 lg:grid-cols-[1.3fr_0.7fr]">
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`rounded-full px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                      isCancelled
                        ? "bg-red-50 text-red-700"
                        : "bg-[#E8E7DF] text-[#1F2D22]"
                    }`}
                  >
                    {order.status}
                  </span>

                  <span className="text-xs font-medium text-[#5E5B57]">
                    {order.orderNumber}
                  </span>
                </div>

                <h2 className="mt-5 max-w-xl font-display text-4xl leading-tight sm:text-5xl">
                  {isCancelled
                    ? "This order was cancelled"
                    : order.status === "Delivered"
                    ? "Your order has been delivered"
                    : "Your order is moving forward"}
                </h2>

                <p className="mt-4 text-sm text-[#5E5B57]">
                  Placed on{" "}
                  <span className="font-semibold text-[#111311]">
                    {formatDateTime(order.createdAt)}
                  </span>
                </p>
              </div>

              <div className="flex flex-col justify-between border-t border-[#E4DED7] bg-[#EEE7DF] p-6 sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5E5B57]">
                    Order Number
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="break-all font-display text-2xl">
                      {order.orderNumber}
                    </span>

                    <button
                      type="button"
                      onClick={handleCopyTracking}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#1F2D22] transition hover:bg-[#1F2D22] hover:text-white"
                      aria-label="Copy order number"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  {copied && (
                    <p className="mt-2 text-xs font-semibold text-emerald-600">
                      Order number copied.
                    </p>
                  )}
                </div>

                <div className="mt-8 flex items-center gap-3 border-t border-[#1F2D22]/10 pt-5 text-sm text-[#5E5B57]">
                  <Clock3 size={16} />
                  Latest update: {formatDateTime(order.updatedAt)}
                </div>
              </div>
            </div>

            <div className="grid gap-px bg-[#E4DED7] sm:grid-cols-3">
              <div className="flex items-center gap-4 bg-white p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8E7DF] text-[#1F2D22]">
                  <Package size={19} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5E5B57]">
                    Status
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {order.status || "Processing"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8E7DF] text-[#1F2D22]">
                  <MapPin size={19} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5E5B57]">
                    Destination
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {getDestination(order.shippingAddress)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-6">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#E8E7DF] text-[#1F2D22]">
                  <CalendarDays size={19} />
                </div>
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#5E5B57]">
                    Last Updated
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDateTime(order.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div data-reveal="left">
              <div className="rounded-[28px] border border-[#E4DED7] bg-white p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A5937]">
                  Shipment Progress
                </p>

                <h3 className="mt-3 font-display text-3xl">Order Timeline</h3>

                <div className="mt-8">
                  {isCancelled ? (
                    <div className="flex items-start gap-4 rounded-[20px] bg-red-50 p-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-600 text-white">
                        <XCircle size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-red-700">
                          Order Cancelled
                        </h4>
                        <p className="mt-1 text-sm leading-6 text-red-600">
                          This order was cancelled and will not be delivered.
                          Contact support if you believe this is a mistake.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {STATUS_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        const completed = index <= currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                          <div
                            key={step.key}
                            className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[20px] border p-4 sm:p-5 ${
                              isCurrent
                                ? "border-[#1F2D22]/20 bg-[#E8E7DF]"
                                : completed
                                ? "border-[#E4DED7] bg-[#FAF8F5]"
                                : "border-[#E4DED7] bg-white"
                            }`}
                          >
                            <div
                              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                                completed
                                  ? "bg-[#1F2D22] text-white"
                                  : "bg-[#F1EEE8] text-[#5E5B57]"
                              }`}
                            >
                              <Icon size={18} />
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold">
                                  {step.title}
                                </h4>
                                {isCurrent && (
                                  <span className="rounded-full bg-white px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-[#1F2D22]">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs text-[#5E5B57]">
                                {completed ? "Completed" : "Not reached yet"}
                              </p>
                            </div>

                            <span className="hidden text-xs font-medium text-[#5E5B57] sm:block">
                              {index === 0
                                ? formatDateTime(order.createdAt)
                                : isCurrent
                                ? formatDateTime(order.updatedAt)
                                : ""}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div data-reveal="right" className="space-y-6">
              <div className="rounded-[28px] border border-[#E4DED7] bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5E5B57]">
                      Your Purchase
                    </p>
                    <h3 className="mt-2 font-display text-2xl">Order Items</h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8E7DF] text-[#1F2D22]">
                    <Package size={18} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex gap-4 rounded-[18px] bg-[#FAF8F5] p-3"
                    >
                      {item.image ? (
                        <img
                          src={getImageUrl(item.image)}
                          alt={item.name}
                          className="h-20 w-20 shrink-0 rounded-[14px] object-cover"
                        />
                      ) : (
                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[14px] bg-[#E8E7DF] text-[#5E5B57]">
                          <ImageOff size={20} />
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h4 className="line-clamp-2 text-sm font-semibold">
                          {item.name}
                        </h4>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-[#5E5B57]">
                            Qty: {item.quantity}
                          </span>

                          <span className="text-sm font-semibold">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-[#E4DED7] pt-5">
                  <span className="text-sm font-medium text-[#5E5B57]">
                    Total
                  </span>
                  <span className="font-display text-2xl">
                    ${Number(order.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-[28px] bg-[#1F2D22] p-7 text-white">
                <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/10" />
                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                    <CircleDot size={18} />
                  </div>

                  <h3 className="mt-5 font-display text-2xl">
                    Need assistance?
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-white/60">
                    If anything about your order looks incorrect, our support team
                    can help.
                  </p>

                  <button
                    type="button"
                    onClick={handleContactSupport}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-[14px] bg-[#F1EEE8] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                  >
                    Contact Support
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default OrderTracking;
