import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ImageOff,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useCart } from "./CartContext";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
  } = useCart();

  const pageRef = useRef(null);

  const handleQuantityChange = (
    id,
    action,
    currentQuantity
  ) => {
    const newQuantity =
      action === "increase"
        ? currentQuantity + 1
        : Math.max(1, currentQuantity - 1);

    updateQuantity(id, newQuantity);
  };

  const subtotal = cartSubtotal;
  const shipping = 0;
  const total = subtotal + shipping;

  const totalItems = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

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
        threshold: 0.12,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [cartItems.length]);

  if (cartItems.length === 0) {
    return (
      <div
        ref={pageRef}
        className="min-h-[78vh] overflow-hidden bg-[#FAF8F5] text-[#111311]"
      >
        <style>{animationStyles}</style>

        <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div
            data-reveal="scale"
            className="mx-auto max-w-[900px] overflow-hidden rounded-[24px] border border-[#E4DED7] bg-white"
          >
            <div className="grid md:grid-cols-[0.72fr_1.28fr]">
              <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden bg-[#1F2D22] p-10 text-white md:min-h-[430px]">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full border border-white/5" />
                <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full border border-white/5" />

                <div className="relative text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                    <ShoppingBag
                      size={32}
                      strokeWidth={1.35}
                    />
                  </div>

                  <p className="mt-6 text-[9px] font-semibold uppercase tracking-[0.32em] text-white/50">
                    Ectoo
                  </p>

                  <p className="mt-2 font-display text-2xl">
                    Your Bag
                  </p>
                </div>
              </div>

              <div className="flex items-center px-7 py-12 sm:px-10 lg:px-14">
                <div data-reveal="right">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                    Shopping Bag
                  </p>

                  <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
                    Nothing here
                    <span className="block text-[#5E5B57]">
                      just yet.
                    </span>
                  </h1>

                  <p className="mt-5 max-w-md text-sm leading-7 text-[#5E5B57]">
                    Explore our handbag collection and add the styles that work
                    for your everyday routine.
                  </p>

                  <Link
                    to="/shop"
                    className="ectoo-cta group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] bg-[#1F2D22] px-7 text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#3F4C3A]"
                  >
                    Explore Handbags

                    <ArrowRight
                      size={15}
                      strokeWidth={1.7}
                      className="ectoo-arrow"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{animationStyles}</style>

      <section className="border-b border-[#E4DED7] bg-[#E4E5DD]">
        <div className="mx-auto max-w-[1450px] px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
          <Link
            to="/shop"
            data-reveal="left"
            className="group inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#5E5B57] transition-colors hover:text-[#111311]"
          >
            <ChevronLeft
              size={15}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Continue Shopping
          </Link>

          <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div data-reveal="left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#9A5937]">
                Ectoo
              </p>

              <h1 className="mt-3 font-display text-4xl leading-none sm:text-5xl lg:text-[58px]">
                Your Shopping Bag
              </h1>
            </div>

            <div
              data-reveal="right"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                <ShoppingBag
                  size={16}
                  strokeWidth={1.5}
                />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-[0.18em] text-[#5E5B57]">
                  In Your Bag
                </p>

                <p className="mt-0.5 text-[12px] font-semibold">
                  {totalItems} {totalItems === 1 ? "Item" : "Items"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[minmax(0,1fr)_390px] xl:gap-14">
          <div>
            <div
              data-reveal
              className="mb-5 flex items-center justify-between"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#5E5B57]">
                Selected Items
              </p>

              <p className="text-[10px] text-[#5E5B57]">
                {totalItems} total
              </p>
            </div>

            <div className="space-y-4">
              {cartItems.map((item, index) => (
                <article
                  key={item.id}
                  data-reveal
                  style={{
                    transitionDelay: `${index * 80}ms`,
                  }}
                  className="ectoo-cart-card group overflow-hidden rounded-[18px] border border-[#E4DED7] bg-white p-4 sm:p-5"
                >
                  <div className="flex gap-4 sm:gap-6">
                    <Link
                      to={`/shop/${item.id}`}
                      className="relative h-[125px] w-[105px] shrink-0 overflow-hidden rounded-[13px] bg-[#F5F1EC] sm:h-[155px] sm:w-[135px]"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="ectoo-product-image h-full w-full object-contain p-2.5"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[#5E5B57]/30">
                          <ImageOff
                            size={25}
                            strokeWidth={1.4}
                          />
                        </div>
                      )}
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          {item.category && (
                            <p className="truncate text-[8px] font-semibold uppercase tracking-[0.2em] text-[#9A5937]">
                              {item.category}
                            </p>
                          )}

                          <Link to={`/shop/${item.id}`}>
                            <h2 className="mt-1.5 line-clamp-2 font-display text-xl leading-tight transition-colors duration-300 hover:text-[#9A5937] sm:text-2xl">
                              {item.name}
                            </h2>
                          </Link>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeFromCart(item.id)
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[#5E5B57] transition-all duration-300 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2
                            size={16}
                            strokeWidth={1.6}
                          />
                        </button>
                      </div>

                      <div className="mt-auto flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="mb-2 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#5E5B57]">
                            Quantity
                          </p>

                          <div className="inline-flex items-center rounded-full border border-[#E4DED7] bg-[#FAF8F5] p-1">
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  "decrease",
                                  item.quantity
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white"
                              aria-label="Decrease quantity"
                            >
                              <Minus
                                size={12}
                                strokeWidth={1.8}
                              />
                            </button>

                            <span className="min-w-[34px] text-center text-[11px] font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  "increase",
                                  item.quantity
                                )
                              }
                              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-white"
                              aria-label="Increase quantity"
                            >
                              <Plus
                                size={12}
                                strokeWidth={1.8}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#5E5B57]">
                            Item Total
                          </p>

                          <p className="mt-1 font-display text-2xl">
                            $
                            {(
                              item.price *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div
              data-reveal
              className="mt-5 rounded-[18px] bg-[#E4E5DD] p-5 sm:p-6"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1F2D22] text-white">
                  <Truck
                    size={18}
                    strokeWidth={1.4}
                  />
                </div>

                <div>
                  <p className="text-[12px] font-semibold">
                    Free U.S. Shipping
                  </p>

                  <p className="mt-1 text-[10px] leading-5 text-[#5E5B57]">
                    No shipping charge is added to this order.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside
            data-reveal="right"
            className="lg:sticky lg:top-28 lg:h-fit"
          >
            <div className="relative overflow-hidden rounded-[22px] bg-[#1F2D22] p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/5" />
              <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full border border-white/5" />

              <div className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.25em] text-white/45">
                      Your Order
                    </p>

                    <h2 className="mt-2 font-display text-3xl">
                      Summary
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <ShoppingBag
                      size={18}
                      strokeWidth={1.4}
                    />
                  </div>
                </div>

                <div className="mt-8 space-y-4 border-t border-white/10 pt-7">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-white/55">
                      Subtotal
                    </span>

                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-white/55">
                      Shipping
                    </span>

                    <span className="font-semibold text-[#E4E5DD]">
                      FREE
                    </span>
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/45">
                        Order Total
                      </p>

                      <p className="mt-1 text-[9px] text-white/40">
                        Before checkout
                      </p>
                    </div>

                    <p className="font-display text-3xl">
                      ${total.toFixed(2)}
                    </p>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="ectoo-cta group mt-8 flex min-h-[50px] w-full items-center justify-center gap-3 rounded-[6px] bg-[#F1EEE8] px-5 text-[9px] font-semibold uppercase tracking-[0.1em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  Proceed To Checkout

                  <ArrowRight
                    size={15}
                    strokeWidth={1.7}
                    className="ectoo-arrow"
                  />
                </Link>

                <div className="mt-6 flex items-start gap-3 border-t border-white/10 pt-5">
                  <PackageCheck
                    size={16}
                    strokeWidth={1.4}
                    className="mt-0.5 shrink-0 text-white/55"
                  />

                  <p className="text-[9px] leading-5 text-white/45">
                    Review your items and quantities before continuing to checkout.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/shop"
              className="group mt-4 flex min-h-12 items-center justify-center gap-2 rounded-[15px] border border-[#E4DED7] bg-white text-[9px] font-semibold uppercase tracking-[0.1em] transition-all duration-300 hover:border-[#1F2D22]/30"
            >
              <ChevronLeft
                size={14}
                className="transition-transform duration-300 group-hover:-translate-x-1"
              />

              Continue Shopping
            </Link>
          </aside>
        </div>
      </section>
    </div>
  );
};

const animationStyles = `
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

  .ectoo-cart-card {
    transition:
      transform 0.4s ease,
      box-shadow 0.4s ease,
      border-color 0.4s ease;
  }

  .ectoo-cart-card:hover {
    transform: translateY(-4px);
    border-color: rgba(31, 45, 34, 0.18);
    box-shadow: 0 18px 45px rgba(31, 45, 34, 0.06);
  }

  .ectoo-product-image {
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .ectoo-cart-card:hover .ectoo-product-image {
    transform: scale(1.045);
  }

  @keyframes ectooCartArrow {
    0%,
    100% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(5px);
    }
  }

  .ectoo-cta:hover .ectoo-arrow {
    animation: ectooCartArrow 0.8s ease infinite;
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
`;

export default Cart;