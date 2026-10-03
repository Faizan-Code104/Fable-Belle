import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  User,
  X,
} from "lucide-react";

import { useCart } from "./CartContext";
import storeInfo, { getFullAddress } from "../storeInfo";

const navigation = [
  { name: "Home", path: "/" },
  { name: "Shop", path: "/shop" },
  { name: "Collection", path: "/categories" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const referenceLinks = [
  { name: "FAQ", note: "Quick answers", path: "/faqs" },
  {
    name: "Shipping policy",
    note: "Delivery information",
    path: "/shipping-policy",
  },
  {
    name: "Returns & refunds",
    note: "Before you purchase",
    path: "/return-policy",
  },
  {
    name: "Privacy policy",
    note: "Your information",
    path: "/privacy-policy",
  },
  {
    name: "Terms of use",
    note: "Site information",
    path: "/terms-and-conditions",
  },
];

const extraLinks = [
  { name: "Payment policy", path: "/payment-policy" },
  {
    name: "Order cancellation",
    path: "/order-cancellation-policy",
  },
  { name: "Cookie policy", path: "/cookie-policy" },
  { name: "Track your order", path: "/track-order" },
];

const Layout = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const { cartCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const address = getFullAddress();
  const hours = [
    storeInfo.businessDays,
    [storeInfo.supportHours, storeInfo.timeZone]
      .filter(Boolean)
      .join(" "),
  ]
    .filter(Boolean)
    .join(" · ");

  const phoneHref =
    storeInfo.phoneHref ||
    storeInfo.phoneDisplay.replace(/[^\d+]/g, "");

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname === path ||
        location.pathname.startsWith(`${path}/`);

  const closeMenu = () => {
    menuRef.current?.close();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    const query = searchTerm.trim();

    if (!query) return;

    navigate(`/shop?search=${encodeURIComponent(query)}`);
    closeMenu();
  };

  useEffect(() => {
    menuRef.current?.close();
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1280px)");
    const handleResize = () => {
      if (desktop.matches) menuRef.current?.close();
    };

    desktop.addEventListener("change", handleResize);
    return () => desktop.removeEventListener("change", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-paper font-sans text-navy">
      <style>{`
        .fb-mobile-dialog {
          position: fixed;
          inset: 0 0 0 auto;
          margin: 0;
          width: min(100%, 440px);
          height: 100dvh;
          max-width: 100%;
          max-height: 100dvh;
          padding: 0;
          border: 0;
          overflow-y: auto;
          overscroll-behavior: contain;
          background: #FFFAF3;
          color: #17243B;
        }

        .fb-mobile-dialog::backdrop {
          background: rgba(16, 27, 46, 0.65);
          backdrop-filter: blur(3px);
        }

        body:has(.fb-mobile-dialog[open]) {
          overflow: hidden;
        }
      `}</style>

      <a
        href="#main-content"
        className="sr-only z-[100] bg-navy px-5 py-3 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      {/* HEADER */}
      <header className="border-b border-navy/25 bg-paper">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-10 xl:min-h-24">
          <nav
            aria-label="Main navigation"
            className="hidden min-w-0 items-center gap-6 xl:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`inline-flex min-h-11 items-center gap-1 border-b text-sm font-semibold transition-colors ${
                  isActive(item.path)
                    ? "border-gold text-navy"
                    : "border-transparent hover:border-gold"
                }`}
              >
                {item.name}
                {item.path === "/shop" && (
                  <ArrowUpRight
                    size={13}
                    className="text-gold"
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            aria-label={`${storeInfo.businessName} home`}
            className="min-w-0 shrink-0 xl:order-last"
          >
            <img
              src="/logo-mark.png"
              alt={storeInfo.businessName}
              width="196"
              height="56"
              className="h-auto w-[128px] -rotate-3 transition-transform hover:rotate-0 sm:w-[170px] xl:w-[196px]"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(12%) sepia(19%) saturate(1500%) hue-rotate(179deg) brightness(94%) contrast(95%)",
              }}
            />
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <form
              onSubmit={handleSearch}
              role="search"
              className="hidden h-11 w-[175px] items-center border-b border-navy/30 md:flex 2xl:w-[210px]"
            >
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search bags..."
                aria-label="Search products"
                className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm placeholder:text-mute"
              />
              <button
                type="submit"
                aria-label="Search"
                className="flex h-11 w-11 shrink-0 items-center justify-center hover:text-gold"
              >
                <Search size={18} />
              </button>
            </form>

            <Link
              to="/login"
              aria-label="My account"
              className="hidden h-11 w-11 items-center justify-center hover:text-gold sm:flex"
            >
              <User size={19} strokeWidth={1.7} />
            </Link>

            <Link
  to="/cart"
  aria-label={`Shopping cart with ${cartCount || 0} items`}
  className="inline-flex min-h-11 items-center gap-1 px-2 text-xs font-semibold hover:text-gold sm:text-sm"
>
  Cart
  <span>({cartCount || 0})</span>
</Link>

            <a
              href="#help"
              className="hidden min-h-11 items-center px-2 text-sm font-semibold hover:text-gold xl:inline-flex"
            >
              Help
            </a>

            <button
              ref={menuButtonRef}
              type="button"
              aria-label="Open navigation"
              aria-haspopup="dialog"
              aria-controls="fablebelle-navigation"
              onClick={() => menuRef.current?.showModal()}
              className="flex h-11 w-11 items-center justify-center hover:text-gold xl:hidden"
            >
              <Menu size={23} strokeWidth={1.7} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE AND TABLET NAVIGATION */}
      <dialog
        ref={menuRef}
        id="fablebelle-navigation"
        aria-labelledby="fablebelle-menu-title"
        className="fb-mobile-dialog"
        onClose={() => menuButtonRef.current?.focus()}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;

          const bounds = event.currentTarget.getBoundingClientRect();
          if (
            event.clientX < bounds.left ||
            event.clientX > bounds.right ||
            event.clientY < bounds.top ||
            event.clientY > bounds.bottom
          ) {
            closeMenu();
          }
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2
              id="fablebelle-menu-title"
              className="text-xl font-semibold tracking-tight"
            >
              {storeInfo.businessName}
            </h2>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close navigation"
              className="flex h-11 w-11 items-center justify-center border border-navy/30"
            >
              <X size={21} />
            </button>
          </div>

          <form
            onSubmit={handleSearch}
            role="search"
            className="mb-7 flex min-h-12 border border-navy/30"
          >
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search handbags..."
              aria-label="Search products"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm"
            />
            <button
              type="submit"
              aria-label="Search"
              className="flex w-12 shrink-0 items-center justify-center"
            >
              <Search size={19} />
            </button>
          </form>

          <nav aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMenu}
                aria-current={isActive(item.path) ? "page" : undefined}
                className={`flex min-h-16 items-center justify-between gap-4 border-b border-navy/20 px-2 text-xl tracking-tight transition-colors ${
                  isActive(item.path)
                    ? "bg-champagne"
                    : "hover:bg-champagne"
                }`}
              >
                {item.name}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
          </nav>

          <Link
            to="/login"
            onClick={closeMenu}
            className="mt-8 flex min-h-12 items-center justify-center gap-3 bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-navy-dark"
          >
            <User size={17} />
            My account
          </Link>

          <Link
            to="/track-order"
            onClick={closeMenu}
            className="mt-3 flex min-h-12 items-center justify-center border border-navy/30 px-5 py-3 text-sm"
          >
            Track your order
          </Link>
        </div>
      </dialog>

      {/* PAGE CONTENT */}
      <main id="main-content" tabIndex={-1} className="min-w-0">
        {children}
      </main>

      {/* BRAND STRIP */}
      <section
        aria-label="FableBelle approach"
        className="bg-gold text-white"
      >
        <div className="mx-auto flex max-w-[1600px] items-center gap-5 px-5 py-8 sm:px-6 lg:gap-8 lg:px-10 lg:py-10">
          <span
            aria-hidden="true"
            className="shrink-0 text-4xl font-bold tracking-[-0.12em]"
          >
            f<span className="text-champagne">.</span>b
          </span>

          <p className="text-lg font-medium leading-snug tracking-[-0.04em] sm:text-2xl lg:text-3xl">
            Good design leaves room for your life.
          </p>

          <span className="ml-auto hidden shrink-0 text-[10px] font-bold uppercase tracking-[0.15em] xl:block">
            Make it yours / Carry it your way
          </span>
        </div>
      </section>

      {/* SERVICE DESK */}
      <footer id="help" className="scroll-mt-6 bg-navy-dark text-paper">
        <div className="mx-auto max-w-[1600px] px-5 pb-6 pt-16 sm:px-6 sm:pt-20 lg:px-10 lg:pt-28">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.6fr_0.6fr] lg:gap-10">
            <p className="flex items-start gap-3 pt-2 text-[10px] font-bold uppercase tracking-[0.13em] sm:text-xs">
              <span
                aria-hidden="true"
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-champagne"
              />
              {storeInfo.businessName} / Service desk
            </p>

            <div className="min-w-0">
              <h2 className="text-[clamp(2.5rem,6vw,6rem)] font-medium leading-[1.04] tracking-[-0.065em]">
                Need a hand
                <br />
                with the details?
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-paper/80 sm:text-base">
                Start with a question. Product and order information should
                feel straightforward from the first look.
              </p>
            </div>

            <Link
              to="/contact"
              className="flex h-28 w-28 flex-col justify-center gap-3 rounded-full bg-champagne p-5 text-sm font-bold leading-tight text-navy transition-transform hover:rotate-0 sm:h-32 sm:w-32 lg:rotate-6 lg:self-end lg:justify-self-end"
            >
              Contact
              <br />
              details
              <ArrowUpRight size={22} aria-hidden="true" />
            </Link>
          </div>

          {/* REFERENCE BOARD */}
          <div className="mt-14 bg-champagne text-navy shadow-[7px_9px_0_rgba(0,0,0,0.16)] sm:mt-20 lg:mt-24">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/40 px-5 py-4 text-[10px] font-bold uppercase tracking-[0.14em] sm:px-7">
              <span>Your reference sheet</span>
              <span>01—05</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-6">
              {referenceLinks.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex min-h-28 min-w-0 flex-col justify-between gap-5 border-b border-navy/40 p-5 transition-colors hover:bg-navy hover:text-paper sm:p-7 ${
                    index < 3 ? "lg:col-span-2" : "lg:col-span-3"
                  } ${index % 2 === 0 ? "sm:border-r" : ""} ${
                    index === 4 ? "sm:col-span-2 lg:col-span-3" : ""
                  }`}
                >
                  <span className="text-xl font-medium leading-tight tracking-[-0.04em] sm:text-2xl">
                    {item.name}
                  </span>

                  <span className="flex items-center justify-between gap-4">
                    <span className="text-xs">{item.note}</span>
                    <ArrowUpRight
                      size={21}
                      className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* BUSINESS DETAILS AND LINKS */}
          <div className="mt-14 grid gap-10 border-b border-paper/25 pb-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="min-w-0">
              <Link
                to="/"
                className="text-2xl font-semibold tracking-[-0.05em]"
              >
                {storeInfo.businessName}
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-7 text-paper/75">
                Find your way to carry. Explore shapes for your daily
                routines and the moments in between.
              </p>

              <Link
                to="/shop"
                className="mt-5 inline-flex min-h-11 items-center gap-4 text-sm font-semibold"
              >
                Explore the collection
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-champagne">
                Explore
              </h3>

              <nav
                aria-label="Footer navigation"
                className="flex flex-wrap gap-x-6 gap-y-1"
              >
                {navigation.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="inline-flex min-h-11 items-center text-sm text-paper/80 hover:text-white"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="min-w-0 md:col-span-2 lg:col-span-1">
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-champagne">
                Get in touch
              </h3>

              <div className="space-y-4 text-sm leading-6 text-paper/80">
                {storeInfo.email && (
                  <a
                    href={`mailto:${storeInfo.email}`}
                    className="flex min-w-0 items-start gap-3 hover:text-white"
                  >
                    <Mail size={17} className="mt-1 shrink-0" />
                    <span className="break-all">{storeInfo.email}</span>
                  </a>
                )}

                {storeInfo.phoneDisplay && (
                  <a
                    href={`tel:${phoneHref}`}
                    className="flex items-start gap-3 hover:text-white"
                  >
                    <Phone size={17} className="mt-1 shrink-0" />
                    <span>{storeInfo.phoneDisplay}</span>
                  </a>
                )}

                {address && (
                  <div className="flex items-start gap-3">
                    <MapPin size={17} className="mt-1 shrink-0" />
                    <p className="min-w-0 break-words">{address}</p>
                  </div>
                )}

                {hours && (
                  <div className="flex items-start gap-3">
                    <Clock size={17} className="mt-1 shrink-0" />
                    <p className="min-w-0 break-words">{hours}</p>
                  </div>
                )}

                <Link
                  to="/contact"
                  className="inline-flex min-h-11 items-center gap-3 font-semibold text-white"
                >
                  Contact support
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          <nav
            aria-label="Additional customer policies"
            className="flex flex-wrap gap-x-6 gap-y-1 border-b border-paper/25 py-5"
          >
            {extraLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="inline-flex min-h-11 items-center text-xs text-paper/80 hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-4 pt-6 text-xs text-paper/75 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {storeInfo.businessName}.
              All rights reserved.
            </p>

            <p>Thoughtfully carried, clearly explained.</p>

            <button
              type="button"
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)",
                  ).matches
                    ? "auto"
                    : "smooth",
                })
              }
              className="inline-flex min-h-11 items-center self-start font-semibold text-champagne"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;