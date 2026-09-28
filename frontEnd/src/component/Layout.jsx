import React, { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  ArrowRight,
  Clock,
  Gem,
  Leaf,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  User,
  X,
} from "lucide-react";

import { useCart } from "../component/CartContext";
import EctooLogo from "../component/Logo.jsx";

const BUSINESS_INFO = {
  businessName: import.meta.env.VITE_BUSINESS_NAME || "Ectoo",

  email: import.meta.env.VITE_SUPPORT_EMAIL || "info@ectoo.us",

  phoneDisplay:
    import.meta.env.VITE_SUPPORT_PHONE_DISPLAY || "+1 (832) 347-8821",

  phoneHref: import.meta.env.VITE_SUPPORT_PHONE_HREF || "+19176952303",

  addressLine1:
    import.meta.env.VITE_BUSINESS_ADDRESS_1 || "1825 Dickinson Ave Ste D",

  addressLine2:
    import.meta.env.VITE_BUSINESS_ADDRESS_2 || "Dickinson, TX 77539",

  country: import.meta.env.VITE_BUSINESS_COUNTRY || "United States",

  businessDays: import.meta.env.VITE_SUPPORT_DAYS || "Monday – Friday",

  supportHours: import.meta.env.VITE_SUPPORT_HOURS || "9:00 AM – 5:00 PM",

  timeZone: import.meta.env.VITE_SUPPORT_TIMEZONE || "CT",
};

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [searchFocused, setSearchFocused] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [footerVisible, setFooterVisible] = useState(false);

  const footerRef = useRef(null);

  const { cartCount } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    {
      name: "Collection",
      path: "/categories",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const quickLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Shop",
      path: "/shop",
    },
    {
      name: "Collection",
      path: "/categories",
    },
    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  const customerCare = [
    {
      name: "Shipping Policy",
      path: "/shipping-policy",
    },
    {
      name: "Return Policy",
      path: "/return-policy",
    },
    {
      name: "Privacy Policy",
      path: "/privacy-policy",
    },
    {
      name: "Terms & Conditions",
      path: "/terms-and-conditions",
    },
    {
      name: "Payment Policy",
      path: "/payment-policy",
    },
    {
      name: "Order Cancellation Policy",
      path: "/order-cancellation-policy",
    },
    {
      name: "Cookie Policy",
      path: "/cookie-policy",
    },
    {
      name: "FAQs",
      path: "/faqs",
    },
    {
      name: "Track Your Order",
      path: "/track-order",
    },
  ];

  const isActive = (path) => {
    const cleanPath = path.split("?")[0];

    if (cleanPath === "/") {
      return location.pathname === "/";
    }

    return location.pathname === cleanPath;
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchTerm.trim();

    if (!query) {
      return;
    }

    navigate(`/shop?search=${encodeURIComponent(query)}`);

    setMobileMenuOpen(false);
    setSearchFocused(false);
  };

  useEffect(() => {
    closeMobileMenu();
    setSearchFocused(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const footerElement = footerRef.current;

    if (!footerElement) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setFooterVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.08,
      },
    );

    observer.observe(footerElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  const hasAddress =
    BUSINESS_INFO.addressLine1 ||
    BUSINESS_INFO.addressLine2 ||
    BUSINESS_INFO.country;

  const hasHours =
    BUSINESS_INFO.businessDays ||
    BUSINESS_INFO.supportHours ||
    BUSINESS_INFO.timeZone;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]">
      {}

      <style>{`
        @keyframes ectooFadeDown {
          from {
            opacity: 0;
            transform: translateY(-18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ectooSlideDown {
          from {
            opacity: 0;
            transform: translateY(-18px) scale(0.985);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ectooFadeUp {
          from {
            opacity: 0;
            transform: translateY(45px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes ectooBadgePop {
          0% {
            opacity: 0;
            transform: scale(0.55);
          }

          70% {
            opacity: 1;
            transform: scale(1.15);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes ectooLogoReveal {
          from {
            opacity: 0;
            letter-spacing: 0.12em;
          }

          to {
            opacity: 1;
            letter-spacing: 0.28em;
          }
        }

        @keyframes ectooFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .ectoo-header-enter {
          animation: ectooFadeDown 0.7s ease both;
        }

        .ectoo-mobile-menu {
          animation: ectooSlideDown 0.3s ease both;
          transform-origin: top center;
        }

        .ectoo-footer-enter {
          animation: ectooFadeUp 0.85s ease both;
        }

        .ectoo-cart-badge {
          animation: ectooBadgePop 0.35s ease both;
        }

        .ectoo-logo-text {
          animation: ectooLogoReveal 0.75s ease both;
        }

        .ectoo-leaf-float {
          animation: ectooFloat 4s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {}

      <div className="bg-[#1F2D22] text-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex min-h-[35px] items-center justify-center text-[10px] font-medium sm:text-[11px]">
            <div className="flex items-center gap-2 lg:w-1/3 lg:justify-start">
              <Truck size={14} strokeWidth={1.7} />

              <span>Free Shipping on All U.S. Orders</span>
            </div>

            <div className="hidden items-center justify-center gap-2 lg:flex lg:w-1/3">
              <Gem size={13} strokeWidth={1.7} />

              <span>Elegant Styles. Everyday Confidence.</span>
            </div>

            <div className="hidden items-center justify-end gap-2 lg:flex lg:w-1/3">
              <PackageCheck size={14} strokeWidth={1.7} />

              <span>30-Day Hassle-Free Returns</span>
            </div>
          </div>
        </div>
      </div>

      {}

      <header className="ectoo-header-enter sticky top-0 z-50 bg-[#FAF8F5]/95 px-2 py-2 backdrop-blur-xl">
        <div className="mx-auto max-w-[1600px]">
          <div className="relative flex min-h-[70px] items-center overflow-visible rounded-[9px] bg-white shadow-[0_8px_35px_rgba(31,45,34,0.06)]">
            {}

            <Link
              to="/"
              aria-label="Ectoo home"
              className="group relative z-20 flex h-[70px] min-w-[165px] shrink-0 items-center overflow-visible pl-7 pr-6 text-white sm:min-w-[225px] sm:pl-11 lg:min-w-[260px]"
            >
              <div
                className="absolute inset-y-0 left-0 right-0 bg-[#1F2D22]"
                style={{
                  borderTopLeftRadius: "8px",
                  borderBottomLeftRadius: "8px",
                  borderTopRightRadius: "52px",
                  borderBottomRightRadius: "14px",
                }}
              />

              <div
                className="absolute -bottom-[5px] right-[-27px] hidden h-[45px] w-[82px] bg-[#1F2D22] sm:block"
                style={{
                  borderBottomRightRadius: "65px",
                  transform: "skewX(26deg)",
                  transformOrigin: "left bottom",
                }}
              />

              <div
                className="absolute -right-[51px] -top-[1px] hidden h-[50px] w-[66px] bg-white sm:block"
                style={{
                  borderBottomLeftRadius: "52px",
                }}
              />

              <div className="relative z-10 flex items-center">
                <EctooLogo size="lg" className="brightness-0 invert" />
              </div>
            </Link>

            {}

            <nav
              aria-label="Main navigation"
              className="hidden flex-1 items-center justify-center gap-5 pl-12 pr-3 lg:flex xl:gap-7 xl:pl-16"
            >
              {navigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group relative whitespace-nowrap py-6 text-[11px] font-semibold transition-colors duration-300 ${
                      active
                        ? "text-[#9A5937]"
                        : "text-[#111311] hover:text-[#9A5937]"
                    }`}
                  >
                    {item.name}

                    <span
                      className={`absolute bottom-[15px] left-0 h-[1.5px] bg-[#9A5937] transition-all duration-300 ${
                        active ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </Link>
                );
              })}
            </nav>

            {}

            <div className="ml-auto hidden shrink-0 items-center gap-1 pr-4 md:flex">
              <form
                onSubmit={handleSearch}
                className={`relative flex h-[43px] items-center rounded-full bg-[#F5F1EC] transition-all duration-500 ${
                  searchFocused
                    ? "w-[235px] xl:w-[265px]"
                    : "w-[190px] xl:w-[220px]"
                }`}
              >
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Search bags..."
                  aria-label="Search products"
                  className="h-full w-full bg-transparent pl-5 pr-11 text-[11px] text-[#111311] outline-none placeholder:text-[#5E5B57]/70"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-white"
                >
                  <Search size={18} strokeWidth={1.8} />
                </button>
              </form>

              <Link
                to="/login"
                aria-label="Account"
                className="group flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F5F1EC]"
              >
                <User
                  size={19}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                to="/cart"
                aria-label={`Shopping bag${
                  cartCount > 0 ? ` with ${cartCount} items` : ""
                }`}
                className="group relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:bg-[#F5F1EC]"
              >
                <ShoppingBag
                  size={19}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                />

                {cartCount > 0 && (
                  <span className="ectoo-cart-badge absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#1F2D22] px-1 text-[8px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            </div>

            {}

            <div className="ml-auto flex items-center pr-2 md:hidden">
              <Link
                to="/cart"
                aria-label="Shopping bag"
                className="relative flex h-10 w-10 items-center justify-center"
              >
                <ShoppingBag size={19} strokeWidth={1.7} />

                {cartCount > 0 && (
                  <span className="ectoo-cart-badge absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1F2D22] px-1 text-[8px] font-bold text-white">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label={
                  mobileMenuOpen ? "Close navigation" : "Open navigation"
                }
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((previous) => !previous)}
                className="flex h-10 w-10 items-center justify-center"
              >
                {mobileMenuOpen ? (
                  <X size={22} strokeWidth={1.7} />
                ) : (
                  <Menu size={22} strokeWidth={1.7} />
                )}
              </button>
            </div>
          </div>

          {}

          {mobileMenuOpen && (
            <div className="ectoo-mobile-menu absolute left-2 right-2 top-[calc(100%+2px)] overflow-hidden rounded-b-[20px] border border-[#E4DED7] bg-white shadow-[0_22px_60px_rgba(31,45,34,0.14)] md:hidden">
              <div className="p-5">
                <form onSubmit={handleSearch} className="relative mb-5">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search handbags..."
                    className="h-12 w-full rounded-full bg-[#F5F1EC] px-5 pr-12 text-sm outline-none"
                  />

                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center"
                  >
                    <Search size={18} strokeWidth={1.7} />
                  </button>
                </form>

                <nav className="flex flex-col">
                  {navigation.map((item, index) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={closeMobileMenu}
                      style={{
                        transitionDelay: `${index * 20}ms`,
                      }}
                      className={`group flex min-h-[54px] items-center justify-between border-b border-[#E4DED7] text-[12px] font-semibold transition-all duration-300 hover:pl-2 ${
                        isActive(item.path)
                          ? "text-[#9A5937]"
                          : "text-[#111311] hover:text-[#9A5937]"
                      }`}
                    >
                      {item.name}

                      <ArrowRight
                        size={15}
                        strokeWidth={1.7}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </Link>
                  ))}
                </nav>

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-5 flex h-12 items-center justify-center gap-2 rounded-[5px] border border-[#1F2D22] text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-[#1F2D22] hover:text-white"
                >
                  <User size={16} strokeWidth={1.7} />
                  My Account
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {}

      <main>{children}</main>

      {}

      <div ref={footerRef} className="relative mt-[95px] bg-[#FAF8F5] pt-8">
        <section className="relative z-20 mx-auto max-w-[1500px] px-4 sm:px-7 lg:px-10">
          <div className="overflow-hidden rounded-[30px] bg-[#EDE5DA] shadow-[0_24px_70px_rgba(31,45,34,0.10)]">
            <div className="grid min-h-[285px] lg:grid-cols-[1.08fr_0.92fr]">
              <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
                <span className="mb-4 text-[9px] font-bold uppercase tracking-[0.34em] text-[#9A5937]">
                  The Ectoo Edit
                </span>
                <h2 className="font-display text-[38px] leading-[1.02] text-[#17231A] sm:text-[52px] lg:text-[60px]">
                  Carry Your Style.
                  <br />
                  Own Every Moment.
                </h2>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/shop"
                    className="group inline-flex h-11 items-center gap-3 rounded-full bg-[#1F2D22] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#354739]"
                  >
                    Shop Collection{" "}
                    <ArrowRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex h-11 items-center rounded-full border border-[#1F2D22]/25 px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition hover:border-[#1F2D22]"
                  >
                    Our Story
                  </Link>
                </div>
              </div>
              <div className="relative min-h-[260px] overflow-hidden lg:min-h-[285px]">
                <img
                  src="/Crossbody Bags.png"
                  alt="ECTOO crossbody bag"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#EDE5DA]/25 via-transparent to-[#1F2D22]/10" />
                <span className="absolute bottom-6 right-6 rounded-full border border-white/40 bg-white/75 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[#1F2D22] backdrop-blur-md">
                  Everyday Icons
                </span>
              </div>
            </div>
          </div>
        </section>

        <footer
          className={`relative -mt-10 overflow-hidden bg-[#1F2D22] pt-24 text-white ${footerVisible ? "ectoo-footer-enter" : "opacity-0"}`}
        >
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-white/[0.05]" />
          <div className="pointer-events-none absolute right-[-90px] top-[-40px] h-80 w-80 rounded-full bg-white/[0.025]" />
          <div className="relative mx-auto max-w-[1500px] px-6 pb-7 sm:px-8 lg:px-10">
            <div className="grid gap-10 border-b border-white/15 pb-10 lg:grid-cols-[1.35fr_0.72fr_1fr] lg:gap-12">
              <div>
                <Link to="/" className="inline-block">
                  <EctooLogo
                    size="xl"
                    showTagline={true}
                    className="brightness-0 invert"
                  />
                </Link>
                <p className="mt-6 max-w-[390px] text-[12px] leading-7 text-white/65">
                  Thoughtfully selected handbags for modern routines, refined
                  looks, and the moments you carry with you every day.
                </p>
                <Link
                  to="/shop"
                  className="group mt-7 inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.24em] text-white"
                >
                  Explore Ectoo{" "}
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 transition group-hover:bg-white group-hover:text-[#1F2D22]">
                    <ArrowRight size={13} />
                  </span>
                </Link>
              </div>
              <div>
                <p className="mb-6 text-[9px] font-bold uppercase tracking-[0.28em] text-[#C99A79]">
                  Navigate
                </p>
                <ul className="space-y-3.5">
                  {quickLinks.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className="group inline-flex items-center gap-2 text-[12px] text-white/68 transition hover:text-white"
                      >
                        <span className="h-px w-0 bg-[#C99A79] transition-all group-hover:w-4" />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-6 text-[9px] font-bold uppercase tracking-[0.28em] text-[#C99A79]">
                  Get In Touch
                </p>
                <div className="space-y-4 text-[11px] leading-6 text-white/68">
                  {BUSINESS_INFO.phoneDisplay && (
                    <a
                      href={`tel:${BUSINESS_INFO.phoneHref}`}
                      className="flex gap-3 hover:text-white"
                    >
                      <Phone
                        size={15}
                        className="mt-1 shrink-0 text-[#C99A79]"
                      />
                      {BUSINESS_INFO.phoneDisplay}
                    </a>
                  )}
                  {BUSINESS_INFO.email && (
                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="flex min-w-0 gap-3 hover:text-white"
                    >
                      <Mail
                        size={15}
                        className="mt-1 shrink-0 text-[#C99A79]"
                      />
                      <span className="break-all">{BUSINESS_INFO.email}</span>
                    </a>
                  )}
                  {hasAddress && (
                    <div className="flex items-start gap-3">
                      <MapPin
                        size={15}
                        className="mt-1 shrink-0 text-[#C99A79]"
                      />
                      <span>
                        {BUSINESS_INFO.addressLine1}
                        {BUSINESS_INFO.addressLine1 &&
                          BUSINESS_INFO.addressLine2 && <br />}
                        {BUSINESS_INFO.addressLine2}
                        {(BUSINESS_INFO.addressLine1 ||
                          BUSINESS_INFO.addressLine2) &&
                          BUSINESS_INFO.country && <br />}
                        {BUSINESS_INFO.country}
                      </span>
                    </div>
                  )}
                  {hasHours && (
                    <div className="flex items-start gap-3">
                      <Clock
                        size={15}
                        className="mt-1 shrink-0 text-[#C99A79]"
                      />
                      <span>
                        {BUSINESS_INFO.businessDays}
                        {BUSINESS_INFO.businessDays &&
                          BUSINESS_INFO.supportHours && <br />}
                        {BUSINESS_INFO.supportHours}
                        {BUSINESS_INFO.timeZone && (
                          <> ({BUSINESS_INFO.timeZone})</>
                        )}
                      </span>
                    </div>
                  )}
                  {!BUSINESS_INFO.email &&
                    !BUSINESS_INFO.phoneDisplay &&
                    !hasAddress &&
                    !hasHours && (
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 text-white"
                      >
                        Contact Support <ArrowRight size={13} />
                      </Link>
                    )}
                </div>
              </div>
            </div>
            <div className="border-b border-white/15 py-7">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                <p className="shrink-0 text-[9px] font-bold uppercase tracking-[0.28em] text-[#C99A79]">
                  Customer Care
                </p>
                <div className="hidden h-px flex-1 bg-white/10 lg:block" />
                <ul className="flex flex-wrap gap-x-5 gap-y-3">
                  {customerCare.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className="whitespace-nowrap text-[10px] text-white/55 transition hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex flex-col gap-4 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="text-[11px] text-white/45">
                © {new Date().getFullYear()} Ectoo. All rights reserved.
              </p>
              <p className="font-display text-[15px] italic tracking-wide text-white/70">
                More than a bag — a brighter you.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
