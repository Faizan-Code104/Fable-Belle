import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

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

const BUSINESS_INFO = {
  businessName:
    import.meta.env.VITE_BUSINESS_NAME || "Ectoo",

  email:
    import.meta.env.VITE_SUPPORT_EMAIL || "",

  phoneDisplay:
    import.meta.env.VITE_SUPPORT_PHONE_DISPLAY || "",

  phoneHref:
    import.meta.env.VITE_SUPPORT_PHONE_HREF || "",

  addressLine1:
    import.meta.env.VITE_BUSINESS_ADDRESS_1 || "",

  addressLine2:
    import.meta.env.VITE_BUSINESS_ADDRESS_2 || "",

  country:
    import.meta.env.VITE_BUSINESS_COUNTRY || "",

  businessDays:
    import.meta.env.VITE_SUPPORT_DAYS || "",

  supportHours:
    import.meta.env.VITE_SUPPORT_HOURS || "",

  timeZone:
    import.meta.env.VITE_SUPPORT_TIMEZONE || "",
};

const Layout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [searchFocused, setSearchFocused] =
    useState(false);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [footerVisible, setFooterVisible] =
    useState(false);

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

    navigate(
      `/shop?search=${encodeURIComponent(query)}`
    );

    setMobileMenuOpen(false);
    setSearchFocused(false);
  };

  useEffect(() => {
    closeMobileMenu();
    setSearchFocused(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow =
      mobileMenuOpen ? "hidden" : "";

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
      }
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
              <Truck
                size={14}
                strokeWidth={1.7}
              />

              <span>
                Free Shipping on All U.S. Orders
              </span>
            </div>

            <div className="hidden items-center justify-center gap-2 lg:flex lg:w-1/3">
              <Gem
                size={13}
                strokeWidth={1.7}
              />

              <span>
                Elegant Styles. Everyday Confidence.
              </span>
            </div>

            <div className="hidden items-center justify-end gap-2 lg:flex lg:w-1/3">
              <PackageCheck
                size={14}
                strokeWidth={1.7}
              />

              <span>
                30-Day Hassle-Free Returns
              </span>
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

              <div className="relative z-10">

                <div className="ectoo-logo-text font-display text-[25px] tracking-[0.28em] sm:text-[31px]">
                  ECTOO
                </div>

                <div className="mt-0.5 hidden whitespace-nowrap text-[6.5px] font-medium uppercase tracking-[0.16em] text-white/65 sm:block">
                  Modern Bags for Modern Women
                </div>

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
                        active
                          ? "w-full"
                          : "w-0 group-hover:w-full"
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
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  onFocus={() =>
                    setSearchFocused(true)
                  }
                  onBlur={() =>
                    setSearchFocused(false)
                  }
                  placeholder="Search bags..."
                  aria-label="Search products"
                  className="h-full w-full bg-transparent pl-5 pr-11 text-[11px] text-[#111311] outline-none placeholder:text-[#5E5B57]/70"
                />

                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 hover:bg-white"
                >
                  <Search
                    size={18}
                    strokeWidth={1.8}
                  />
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
                  cartCount > 0
                    ? ` with ${cartCount} items`
                    : ""
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
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
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
                <ShoppingBag
                  size={19}
                  strokeWidth={1.7}
                />

                {cartCount > 0 && (
                  <span className="ectoo-cart-badge absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#1F2D22] px-1 text-[8px] font-bold text-white">
                    {cartCount > 99
                      ? "99+"
                      : cartCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                aria-label={
                  mobileMenuOpen
                    ? "Close navigation"
                    : "Open navigation"
                }
                aria-expanded={mobileMenuOpen}
                onClick={() =>
                  setMobileMenuOpen(
                    (previous) => !previous
                  )
                }
                className="flex h-10 w-10 items-center justify-center"
              >
                {mobileMenuOpen ? (
                  <X
                    size={22}
                    strokeWidth={1.7}
                  />
                ) : (
                  <Menu
                    size={22}
                    strokeWidth={1.7}
                  />
                )}
              </button>

            </div>

          </div>

          {}

          {mobileMenuOpen && (
            <div className="ectoo-mobile-menu absolute left-2 right-2 top-[calc(100%+2px)] overflow-hidden rounded-b-[20px] border border-[#E4DED7] bg-white shadow-[0_22px_60px_rgba(31,45,34,0.14)] md:hidden">

              <div className="p-5">

                <form
                  onSubmit={handleSearch}
                  className="relative mb-5"
                >
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder="Search handbags..."
                    className="h-12 w-full rounded-full bg-[#F5F1EC] px-5 pr-12 text-sm outline-none"
                  />

                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center"
                  >
                    <Search
                      size={18}
                      strokeWidth={1.7}
                    />
                  </button>
                </form>

                <nav className="flex flex-col">

                  {navigation.map(
                    (item, index) => (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={closeMobileMenu}
                        style={{
                          transitionDelay: `${
                            index * 20
                          }ms`,
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
                    )
                  )}

                </nav>

                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-5 flex h-12 items-center justify-center gap-2 rounded-[5px] border border-[#1F2D22] text-[11px] font-semibold uppercase tracking-[0.12em] transition-all duration-300 hover:bg-[#1F2D22] hover:text-white"
                >
                  <User
                    size={16}
                    strokeWidth={1.7}
                  />

                  My Account
                </Link>

              </div>
            </div>
          )}

        </div>
      </header>

      {}

      <main>
        {children}
      </main>

      {}

      <div
        ref={footerRef}
        className="relative mt-[85px]"
      >

        {}

        <svg
          className="pointer-events-none absolute bottom-[calc(100%-1px)] left-0 z-10 h-[100px] w-full"
          viewBox="0 0 1600 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="
              M0,75
              C120,35 245,27 380,48
              C510,68 625,78 760,62
              C900,45 985,17 1110,25
              C1250,34 1340,79 1460,69
              C1510,65 1560,56 1600,51
              L1600,120
              L0,120
              Z
            "
            fill="#1F2D22"
          />
        </svg>

        {}

        <footer
          className={`relative overflow-hidden bg-[#1F2D22] text-white ${
            footerVisible
              ? "ectoo-footer-enter"
              : "opacity-0"
          }`}
        >

          <div className="pointer-events-none absolute -right-[170px] -top-[160px] h-[400px] w-[400px] rounded-full bg-white/[0.025]" />

          <div className="relative mx-auto max-w-[1600px] px-6 pb-7 pt-10 sm:px-8 lg:px-12">

            {}

            <div className="grid gap-11 sm:grid-cols-2 lg:grid-cols-[1.45fr_0.72fr_0.95fr_1.3fr_0.65fr] lg:gap-8">

              {}

              <div>

                <Link
                  to="/"
                  className="group inline-block"
                >
                  <div className="font-display text-[29px] tracking-[0.28em] transition-all duration-500 group-hover:tracking-[0.33em]">
                    ECTOO
                  </div>

                  <div className="mt-1 text-[6.5px] uppercase tracking-[0.18em] text-white/55">
                    Modern Bags for Modern Women
                  </div>
                </Link>

                <p className="mt-5 max-w-[280px] text-[11.5px] leading-[1.8] text-white/65">
                  We curate timeless handbags designed
                  for modern women who value style,
                  quality, practical details, and
                  everyday confidence.
                </p>

              </div>

              {}

              <div>

                <h3 className="text-[11px] font-semibold text-white">
                  Quick Links
                </h3>

                <ul className="mt-5 space-y-3">

                  {quickLinks.map((item) => (
                    <li key={item.name}>

                      <Link
                        to={item.path}
                        className="group inline-flex items-center text-[11px] text-white/65 transition-colors duration-300 hover:text-white"
                      >
                        <span className="mr-0 h-px w-0 bg-white transition-all duration-300 group-hover:mr-2 group-hover:w-3" />

                        {item.name}
                      </Link>

                    </li>
                  ))}

                </ul>

              </div>

              {}

              <div>

                <h3 className="text-[11px] font-semibold text-white">
                  Customer Care
                </h3>

                <ul className="mt-5 space-y-3">

                  {customerCare.map((item) => (
                    <li key={item.name}>

                      <Link
                        to={item.path}
                        className="group inline-flex items-center text-[11px] text-white/65 transition-colors duration-300 hover:text-white"
                      >
                        <span className="mr-0 h-px w-0 bg-white transition-all duration-300 group-hover:mr-2 group-hover:w-3" />

                        {item.name}
                      </Link>

                    </li>
                  ))}

                </ul>

              </div>

              {}

              <div>

                <h3 className="text-[11px] font-semibold text-white">
                  Contact Us
                </h3>

                <div className="mt-5 space-y-4 text-[11px] text-white/65">

                  {BUSINESS_INFO.email && (
                    <a
                      href={`mailto:${BUSINESS_INFO.email}`}
                      className="group flex min-w-0 items-start gap-3 transition-colors duration-300 hover:text-white"
                    >
                      <Mail
                        size={14}
                        strokeWidth={1.7}
                        className="mt-0.5 shrink-0 transition-transform duration-300 group-hover:scale-110"
                      />

                      <span className="break-all">
                        {BUSINESS_INFO.email}
                      </span>
                    </a>
                  )}

                  {BUSINESS_INFO.phoneDisplay && (
                    <a
                      href={`tel:${BUSINESS_INFO.phoneHref}`}
                      className="group flex items-center gap-3 transition-colors duration-300 hover:text-white"
                    >
                      <Phone
                        size={14}
                        strokeWidth={1.7}
                        className="shrink-0 transition-transform duration-300 group-hover:scale-110"
                      />

                      {
                        BUSINESS_INFO.phoneDisplay
                      }
                    </a>
                  )}

                  {hasAddress && (
                    <div className="flex items-start gap-3">

                      <MapPin
                        size={14}
                        strokeWidth={1.7}
                        className="mt-[2px] shrink-0"
                      />

                      <span className="leading-5">

                        {
                          BUSINESS_INFO.addressLine1
                        }

                        {BUSINESS_INFO.addressLine1 &&
                          BUSINESS_INFO.addressLine2 && (
                            <br />
                          )}

                        {
                          BUSINESS_INFO.addressLine2
                        }

                        {(BUSINESS_INFO.addressLine1 ||
                          BUSINESS_INFO.addressLine2) &&
                          BUSINESS_INFO.country && (
                            <br />
                          )}

                        {
                          BUSINESS_INFO.country
                        }

                      </span>

                    </div>
                  )}

                  {hasHours && (
                    <div className="flex items-start gap-3">

                      <Clock
                        size={14}
                        strokeWidth={1.7}
                        className="mt-[2px] shrink-0"
                      />

                      <span className="leading-5">

                        {
                          BUSINESS_INFO.businessDays
                        }

                        {BUSINESS_INFO.businessDays &&
                          BUSINESS_INFO.supportHours && (
                            <br />
                          )}

                        {
                          BUSINESS_INFO.supportHours
                        }

                        {BUSINESS_INFO.timeZone && (
                          <>
                            {" "}
                            (
                            {
                              BUSINESS_INFO.timeZone
                            }
                            )
                          </>
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
                        className="group inline-flex items-center gap-2 text-white"
                      >
                        Contact Support

                        <ArrowRight
                          size={13}
                          strokeWidth={1.7}
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    )}

                </div>

              </div>

              {}

              <div className="hidden border-l border-white/15 pl-7 lg:flex lg:flex-col lg:items-center lg:justify-center">

                <div className="ectoo-leaf-float flex h-16 w-16 items-center justify-center">

                  <Leaf
                    size={48}
                    strokeWidth={1.05}
                    className="text-white/85"
                  />

                </div>

                <p className="mt-5 text-center font-display text-[12px] uppercase leading-6 tracking-[0.28em] text-white/75">
                  Elevated
                  <br />
                  Everyday
                </p>

                <div className="mt-5 h-px w-10 bg-white/40" />

              </div>

            </div>

            {}

            <div className="mt-11 border-t border-white/15 pt-5">

              <div className="flex flex-col items-center justify-between gap-4 text-center text-[10px] text-white/45 sm:flex-row sm:text-left">

                <p>
                  © {new Date().getFullYear()} Ectoo.
                  All rights reserved.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">

                  <Link
                    to="/privacy-policy"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Privacy Policy
                  </Link>

                  <span className="hidden h-3 w-px bg-white/20 sm:block" />

                  <Link
                    to="/terms-and-conditions"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Terms & Conditions
                  </Link>

                  <span className="hidden h-3 w-px bg-white/20 sm:block" />

                  <Link
                    to="/payment-policy"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Payment Policy
                  </Link>

                  <span className="hidden h-3 w-px bg-white/20 sm:block" />

                  <Link
                    to="/order-cancellation-policy"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Order Cancellation Policy
                  </Link>

                  <span className="hidden h-3 w-px bg-white/20 sm:block" />

                  <Link
                    to="/cookie-policy"
                    className="transition-colors duration-300 hover:text-white"
                  >
                    Cookie Policy
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </footer>

      </div>

    </div>
  );
};

export default Layout;