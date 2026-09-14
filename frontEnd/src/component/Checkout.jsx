import React, { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ClipboardCheck,
  Clock3,
  ImageOff,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useCart } from "./CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);

  const { cartItems, cartSubtotal } = useCart();

  const getSavedEmail = () => {
    try {
      const savedUser = localStorage.getItem("ectoo-user");

      if (!savedUser) {
        return "";
      }

      const user = JSON.parse(savedUser);

      return typeof user?.email === "string"
        ? user.email
        : "";
    } catch {
      return "";
    }
  };

  const [formData, setFormData] = useState(() => ({
    firstName: "",
    lastName: "",
    email: getSavedEmail(),
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  }));

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart", {
        replace: true,
      });
    }
  }, [cartItems.length, navigate]);

  useEffect(() => {
    const elements =
      pageRef.current?.querySelectorAll("[data-reveal]");

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
        threshold: 0.1,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [cartItems.length]);

  const subtotal = Number(cartSubtotal) || 0;
  const shipping = 0;
  const total = subtotal + shipping;

  const totalItems = cartItems.reduce(
    (count, item) =>
      count + (Number(item.quantity) || 0),
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const inputClass =
    "w-full min-h-12 rounded-[8px] border border-[#E4DED7] bg-[#FAF8F5] px-4 py-3 text-sm text-[#111311] outline-none transition-all duration-300 placeholder:text-[#5E5B57]/45 focus:border-[#1F2D22] focus:bg-white focus:shadow-[0_0_0_3px_rgba(31,45,34,0.06)]";

  const labelClass =
    "mb-2 block text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5E5B57]";

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(38px);
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

        .ectoo-checkout-card {
          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }

        .ectoo-checkout-card:hover {
          transform: translateY(-3px);
          border-color: rgba(31, 45, 34, 0.16);
          box-shadow: 0 18px 45px rgba(31, 45, 34, 0.055);
        }

        .ectoo-order-image {
          transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .ectoo-order-item:hover .ectoo-order-image {
          transform: scale(1.05);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] {
            opacity: 1;
            transform: none;
            transition: none;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <section className="border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <Link
            to="/cart"
            data-reveal="left"
            className="group inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#5E5B57] transition-colors hover:text-[#111311]"
          >
            <ArrowLeft
              size={14}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            Back to Bag
          </Link>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div data-reveal="left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#9A5937]">
                Ectoo Checkout
              </p>

              <h1 className="mt-3 font-display text-5xl leading-none sm:text-6xl lg:text-[68px]">
                Delivery details.
              </h1>
            </div>

            <p
              data-reveal="right"
              className="max-w-lg text-sm leading-7 text-[#5E5B57] lg:justify-self-end"
            >
              Review your contact and U.S. delivery information. Online
              checkout is currently being activated.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto max-w-[1450px]"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px] xl:gap-12">
            <div className="min-w-0 space-y-6">
              <section
                data-reveal="left"
                className="ectoo-checkout-card rounded-[20px] border border-[#E4DED7] bg-white p-5 sm:p-7 lg:p-8"
              >
                <div className="mb-7 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                    <Package size={17} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#9A5937]">
                      Step 01
                    </p>
                    <h2 className="mt-1 font-display text-3xl">
                      Contact Information
                    </h2>
                    <p className="mt-1.5 text-[11px] leading-5 text-[#5E5B57]">
                      Add the details we would use to identify and contact you
                      regarding your order.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className={labelClass}>
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      autoComplete="given-name"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className={labelClass}>
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      autoComplete="family-name"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 555 000 0000"
                      className={inputClass}
                    />
                  </div>
                </div>
              </section>

              <section
                data-reveal="left"
                className="ectoo-checkout-card rounded-[20px] border border-[#E4DED7] bg-white p-5 sm:p-7 lg:p-8"
              >
                <div className="mb-7 flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                    <MapPin size={17} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#9A5937]">
                      Step 02
                    </p>
                    <h2 className="mt-1 font-display text-3xl">
                      Shipping Address
                    </h2>
                    <p className="mt-1.5 text-[11px] leading-5 text-[#5E5B57]">
                      Enter the U.S. address where your order would be
                      delivered once checkout is active.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label htmlFor="address" className={labelClass}>
                      Street Address
                    </label>
                    <input
                      id="address"
                      type="text"
                      name="address"
                      autoComplete="address-line1"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 Main Street"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="apartment" className={labelClass}>
                      Apartment, Suite, etc.{" "}
                      <span className="normal-case tracking-normal text-[#5E5B57]/55">
                        (Optional)
                      </span>
                    </label>
                    <input
                      id="apartment"
                      type="text"
                      name="apartment"
                      autoComplete="address-line2"
                      value={formData.apartment}
                      onChange={handleChange}
                      placeholder="Apartment 4B"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        name="city"
                        autoComplete="address-level2"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="New York"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="state" className={labelClass}>
                        State
                      </label>
                      <input
                        id="state"
                        type="text"
                        name="state"
                        autoComplete="address-level1"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="New York"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="postalCode" className={labelClass}>
                        ZIP Code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        name="postalCode"
                        inputMode="numeric"
                        autoComplete="postal-code"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="10001"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className={labelClass}>
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        name="country"
                        value="United States"
                        readOnly
                        className={`${inputClass} cursor-not-allowed text-[#5E5B57]`}
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section
                data-reveal="left"
                className="overflow-hidden rounded-[20px] bg-[#E4E5DD] p-5 sm:p-7 lg:p-8"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                    <Clock3 size={17} strokeWidth={1.4} />
                  </div>

                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#9A5937]">
                      Payment Status
                    </p>
                    <h2 className="mt-1 font-display text-3xl">
                      Online payment coming soon.
                    </h2>
                    <p className="mt-3 max-w-2xl text-[11px] leading-6 text-[#5E5B57]">
                      Ectoo is currently completing its online payment setup.
                      Completed online orders and card payments are not being
                      accepted through this website at this time.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <aside
              data-reveal="right"
              className="min-w-0 lg:sticky lg:top-28 lg:h-fit"
            >
              <div className="relative overflow-hidden rounded-[22px] bg-[#1F2D22] p-6 text-white sm:p-7">
                <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/5" />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/45">
                        Order Review
                      </p>
                      <h2 className="mt-1 font-display text-3xl">
                        Your Bag
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                      <ShoppingBag size={17} strokeWidth={1.4} />
                    </div>
                  </div>

                  <div className="mt-7 space-y-5 border-t border-white/10 pt-7">
                    {cartItems.map((item, index) => {
                      const itemId = item.id || item._id;

                      return (
                        <div
                          key={itemId}
                          className="ectoo-order-item flex min-w-0 gap-4"
                          style={{
                            transitionDelay: `${index * 60}ms`,
                          }}
                        >
                          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[11px] bg-[#F5F1EC]">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name || "Ectoo handbag"}
                                className="ectoo-order-image h-full w-full object-contain p-1.5"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#1F2D22]/30">
                                <ImageOff size={18} />
                              </div>
                            )}

                            <span className="absolute right-1.5 top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1F2D22] px-1 text-[9px] font-semibold text-white">
                              {item.quantity}
                            </span>
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 font-display text-lg leading-tight">
                              {item.name}
                            </p>

                            {item.category && (
                              <p className="mt-1 text-[8px] uppercase tracking-[0.12em] text-white/40">
                                {item.category}
                              </p>
                            )}

                            <p className="mt-2 text-[11px] font-semibold">
                              ${(
                                Number(item.price || 0) *
                                Number(item.quantity || 1)
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-7 space-y-4 border-t border-white/10 pt-7">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/50">
                        Subtotal
                      </span>
                      <span className="font-semibold">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/50">
                        Shipping
                      </span>
                      <span className="font-semibold text-[#DDE1D7]">
                        FREE
                      </span>
                    </div>

                    <div className="flex items-end justify-between border-t border-white/10 pt-5">
                      <div>
                        <p className="text-[8px] uppercase tracking-[0.16em] text-white/40">
                          Total
                        </p>
                        <p className="mt-1 text-[8px] text-white/30">
                          {totalItems} {totalItems === 1 ? "item" : "items"}
                        </p>
                      </div>

                      <span className="font-display text-3xl">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-7 rounded-[14px] border border-white/10 bg-white/[0.06] p-5">
                    <div className="flex items-start gap-3">
                      <Clock3
                        size={16}
                        strokeWidth={1.4}
                        className="mt-0.5 shrink-0 text-white/60"
                      />

                      <div>
                        <p className="text-[10px] font-semibold">
                          Checkout Not Active
                        </p>
                        <p className="mt-2 text-[9px] leading-5 text-white/45">
                          Online orders and card payments are not currently
                          being accepted.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <div className="rounded-[16px] border border-[#E4DED7] bg-white p-5">
                  <ClipboardCheck
                    size={18}
                    strokeWidth={1.4}
                    className="text-[#1F2D22]"
                  />
                  <p className="mt-3 text-[10px] font-semibold">
                    Review Your Details
                  </p>
                  <p className="mt-1.5 text-[9px] leading-5 text-[#5E5B57]">
                    Check your contact and delivery information before
                    checkout becomes available.
                  </p>
                </div>

                <div className="rounded-[16px] border border-[#E4DED7] bg-white p-5">
                  <Truck
                    size={18}
                    strokeWidth={1.4}
                    className="text-[#1F2D22]"
                  />
                  <p className="mt-3 text-[10px] font-semibold">
                    U.S. Delivery
                  </p>
                  <p className="mt-1.5 text-[9px] leading-5 text-[#5E5B57]">
                    This checkout currently collects United States delivery
                    information only.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Checkout;
