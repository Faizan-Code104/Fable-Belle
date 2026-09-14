import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  Eye,
  Gem,
  ImageOff,
  Leaf,
  Mail,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/products`;
const SERVER_URL = API_BASE_URL;

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [email, setEmail] = useState("");
  const pageRef = useRef(null);

  /* =========================================================
     IMAGE URL
  ========================================================= */

  const getImageUrl = (image) => {
    if (!image || typeof image !== "string") {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${SERVER_URL}${image}`;
  };

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            "Unable to load products."
          );
        }

        const data = await response.json();

        if (!isMounted) {
          return;
        }

        setProducts(
          Array.isArray(data?.products)
            ? data.products
            : []
        );
      } catch {
        if (isMounted) {
          setProducts([]);

          setLoadError(
            "Products are temporarily unavailable. Please try again later."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  /* =========================================================
     SCROLL REVEAL ANIMATIONS
  ========================================================= */

  useEffect(() => {
    const elements =
      pageRef.current?.querySelectorAll("[data-reveal]");

    if (!elements?.length) {
      return;
    }

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
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [loading, products.length]);

  /* =========================================================
     LATEST PRODUCTS
  ========================================================= */

  const latestProducts = useMemo(() => {
    return [...products]
      .sort((a, b) => {
        const dateA = new Date(
          a?.createdAt || 0
        ).getTime();

        const dateB = new Date(
          b?.createdAt || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 10);
  }, [products]);

  /* =========================================================
     NEWSLETTER
  ========================================================= */

  const handleNewsletter = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    setEmail("");
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}

      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(42px);
          transition:
            opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
        }

        [data-reveal="left"] {
          transform: translateX(-45px);
        }

        [data-reveal="right"] {
          transform: translateX(45px);
        }

        [data-reveal="scale"] {
          transform: scale(0.96);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0) scale(1);
        }

        .home-image-zoom {
          transition: transform 1.2s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .home-image-wrap:hover .home-image-zoom {
          transform: scale(1.035);
        }

        .home-hover-card {
          transition:
            transform 0.4s ease,
            box-shadow 0.4s ease,
            background-color 0.4s ease;
        }

        [data-reveal].ectoo-visible.home-hover-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 45px rgba(31, 45, 34, 0.08);
        }

        @keyframes homeFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-6px);
          }
        }

        @keyframes homeArrowMove {
          0%,
          100% {
            transform: translateX(0);
          }

          50% {
            transform: translateX(5px);
          }
        }

        .home-floating {
          animation: homeFloat 4.5s ease-in-out infinite;
        }

        .home-cta:hover .home-arrow {
          animation: homeArrowMove 0.8s ease infinite;
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

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#EEE7DF]">

        <div className="mx-auto grid min-h-[520px] max-w-[1600px] lg:grid-cols-[0.95fr_1.05fr] lg:min-h-[590px]">

          {/* LEFT CONTENT */}

          <div data-reveal="left" className="relative z-10 flex items-center px-6 py-14 sm:px-10 lg:px-16 xl:px-20">

            <div className="max-w-xl">

              <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#5E5B57] sm:text-[11px]">
                Bags For A Brighter You
              </p>

              <h1 className="mt-5 font-display text-[48px] leading-[0.95] tracking-[-0.025em] text-[#111311] sm:text-[62px] lg:text-[70px] xl:text-[76px]">
                Carry More
                <br />
                Than Essentials
              </h1>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#5E5B57] sm:text-[16px]">
                Thoughtfully selected handbags
                designed for the moments that matter.
              </p>

              <Link
                to="/shop"
                className="group mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-[5px] bg-[#1F2D22] px-7 text-[11px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F4C3A]"
              >
                Shop Now

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              {/* HERO FEATURES */}

              <div className="mt-10 grid max-w-xl grid-cols-1 gap-5 border-t border-[#111311]/10 pt-7 sm:grid-cols-3">

                <div data-reveal className="flex items-center gap-3">
                  <Gem
                    size={24}
                    strokeWidth={1.45}
                    className="shrink-0"
                  />

                  <div>
                    <p className="text-[11px] font-semibold">
                      Thoughtful Style
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#5E5B57]">
                      Everyday designs
                    </p>
                  </div>
                </div>

                <div
                  data-reveal
                  className="flex items-center gap-3"
                  style={{
                    transitionDelay: "100ms",
                  }}
                >
                  <Truck
                    size={25}
                    strokeWidth={1.45}
                    className="shrink-0"
                  />

                  <div>
                    <p className="text-[11px] font-semibold">
                      Free Shipping
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#5E5B57]">
                      U.S. Orders
                    </p>
                  </div>
                </div>

                <div
                  data-reveal
                  className="flex items-center gap-3"
                  style={{
                    transitionDelay: "200ms",
                  }}
                >
                  <PackageCheck
                    size={25}
                    strokeWidth={1.45}
                    className="shrink-0"
                  />

                  <div>
                    <p className="text-[11px] font-semibold">
                      Easy Returns
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#5E5B57]">
                      Within 30 Days
                    </p>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* RIGHT HERO IMAGE */}

          <div data-reveal="scale" className="home-image-wrap relative min-h-[400px] overflow-hidden lg:min-h-full">

            <img
              src="/hero-banner.png"
              alt="Ectoo handbag collection"
              className="home-image-zoom absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#EEE7DF]/10 via-transparent to-black/5" />

            {/* EDITORIAL TEXT */}

            <div data-reveal="right" className="absolute right-5 top-10 hidden border-l border-white/30 pl-5 text-white lg:block xl:right-8 xl:top-20">

              <p className="font-display text-[13px] uppercase leading-6 tracking-[0.26em]">
                Style
                <br />
                Function
                <br />
                Confidence
              </p>

              <div className="mt-4 h-px w-10 bg-white/50" />

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}

      <section className="bg-white px-4 py-12 sm:px-6 sm:py-14 lg:px-8">

        <div className="mx-auto max-w-[1500px]">

          {/* TITLE */}

          <div data-reveal className="mb-7 flex items-end justify-between gap-5">

            <div>

              <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                Discover Ectoo
              </p>

              <h2 className="font-display text-3xl leading-none sm:text-4xl">
                Our Handbags
              </h2>

            </div>

            <Link
              to="/shop"
              className="group hidden items-center gap-2 text-[10px] font-semibold sm:flex"
            >
              View All Products

              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

          </div>

          {/* LOADING */}

          {loading ? (
            <div
              className="py-20 text-center text-sm text-[#5E5B57]"
              role="status"
            >
              Loading products...
            </div>
          ) : loadError ? (
            <div className="rounded-[18px] border border-[#E4DED7] bg-[#FAF8F5] px-5 py-14 text-center">

              <p className="text-sm text-[#5E5B57]">
                {loadError}
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-[4px] bg-[#1F2D22] px-6 text-xs font-semibold text-white"
              >
                Visit Shop

                <ArrowRight size={15} />
              </Link>

            </div>
          ) : latestProducts.length === 0 ? (
            <div className="rounded-[18px] border border-[#E4DED7] bg-[#FAF8F5] px-5 py-14 text-center">

              <ShoppingBag
                size={30}
                strokeWidth={1.5}
                className="mx-auto text-[#5E5B57]"
              />

              <h3 className="mt-4 font-display text-2xl">
                Collection Coming Soon
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5E5B57]">
                Products are being prepared for the
                Ectoo collection. Please check back soon.
              </p>

            </div>
          ) : (

            /* PRODUCT GRID */

            <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {latestProducts.map(
                (product, index) => {
                  const id =
                    product?._id || product?.id;

                  if (!id) {
                    return null;
                  }

                  const mainImage =
                    getImageUrl(
                      product?.images?.[0]
                    );

                  const secondImage =
                    getImageUrl(
                      product?.images?.[1]
                    );

                  return (
                    <article
                      key={id}
                      data-reveal
                      className="home-hover-card group min-w-0"
                      style={{
                        transitionDelay: `${
                          index * 55
                        }ms`,
                      }}
                    >

                      {/* IMAGE */}

                      <Link
                        to={`/shop/${id}`}
                        className="relative block aspect-[1/1] overflow-hidden rounded-[16px] bg-[#F5F1EC]"
                      >

                        {mainImage ? (
                          <img
                            src={mainImage}
                            alt={
                              product?.name
                                ? `${product.name} handbag`
                                : "Ectoo handbag"
                            }
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-contain object-center p-3 transition-all duration-700 group-hover:scale-[1.035]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[#5E5B57]/40">

                            <ImageOff
                              size={28}
                              strokeWidth={1.5}
                            />

                          </div>
                        )}

                        {secondImage && (
                          <img
                            src={secondImage}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="absolute inset-0 hidden h-full w-full object-contain object-center p-3 opacity-0 transition-opacity duration-500 lg:block lg:group-hover:opacity-100"
                          />
                        )}

                        {/* VIEW ICON */}

                        <span className="absolute bottom-3 right-3 flex h-9 w-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-[#111311] opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">

                          <Eye
                            size={15}
                            strokeWidth={1.7}
                          />

                        </span>

                      </Link>

                      {/* DETAILS */}

                      <div className="mt-3 px-0.5">

                        <Link
                          to={`/shop/${id}`}
                        >

                          <h3 className="line-clamp-1 text-[11px] font-medium text-[#111311] transition-colors duration-300 hover:text-[#9A5937] sm:text-[12px]">
                            {product?.name ||
                              "Ectoo Handbag"}
                          </h3>

                        </Link>

                        {Number.isFinite(
                          Number(product?.price)
                        ) && (
                          <p className="mt-1 text-[11px] font-semibold text-[#111311] sm:text-[12px]">
                            $
                            {Number(
                              product.price
                            ).toFixed(2)}
                          </p>
                        )}

                        {/* BRAND */}

                        {product?.brand && (
                          <p className="mt-1 truncate text-[9px] uppercase tracking-[0.12em] text-[#5E5B57]">
                            {product.brand}
                          </p>
                        )}

                        {/* PRODUCT ACTION */}

                        <Link
                          to={`/shop/${id}`}
                          className="mt-3 flex min-h-[38px] w-full items-center justify-center gap-2 rounded-[6px] bg-[#1F2D22] px-3 text-[9px] font-semibold uppercase tracking-[0.07em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F4C3A] sm:text-[10px]"
                        >
                          <ShoppingBag
                            size={13}
                            strokeWidth={1.7}
                          />

                          View Product
                        </Link>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

          {/* MOBILE VIEW ALL */}

          {!loading &&
            !loadError &&
            latestProducts.length > 0 && (
              <div className="mt-9 text-center sm:hidden">

                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 text-[11px] font-semibold"
                >
                  View All Products

                  <ArrowRight size={14} />
                </Link>

              </div>
            )}

        </div>

      </section>

      {/* =====================================================
          FEATURES STRIP
      ===================================================== */}

      <section className="bg-white px-4 pb-10 sm:px-6 lg:px-8">

        <div data-reveal="scale" className="mx-auto max-w-[1500px] rounded-[18px] bg-[#F5F1EC] px-5 py-7 sm:px-8">

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[#111311]/10">

            <div data-reveal className="flex items-center gap-4 lg:px-6">

              <Leaf
                size={31}
                strokeWidth={1.35}
              />

              <div>
                <h3 className="text-[11px] font-semibold">
                  Thoughtful Design
                </h3>

                <p className="mt-1 text-[10px] text-[#5E5B57]">
                  For Modern Living
                </p>
              </div>

            </div>

            <div data-reveal style={{ transitionDelay: "100ms" }} className="flex items-center gap-4 lg:px-6">

              <Gem
                size={31}
                strokeWidth={1.35}
              />

              <div>
                <h3 className="text-[11px] font-semibold">
                  Curated Selection
                </h3>

                <p className="mt-1 text-[10px] text-[#5E5B57]">
                  Everyday Style
                </p>
              </div>

            </div>

            <div data-reveal style={{ transitionDelay: "200ms" }} className="flex items-center gap-4 lg:px-6">

              <Truck
                size={32}
                strokeWidth={1.35}
              />

              <div>
                <h3 className="text-[11px] font-semibold">
                  Free Shipping
                </h3>

                <p className="mt-1 text-[10px] text-[#5E5B57]">
                  Across The U.S.
                </p>
              </div>

            </div>

            <div data-reveal style={{ transitionDelay: "300ms" }} className="flex items-center gap-4 lg:px-6">

              <PackageCheck
                size={31}
                strokeWidth={1.35}
              />

              <div>
                <h3 className="text-[11px] font-semibold">
                  Easy Returns
                </h3>

                <p className="mt-1 text-[10px] text-[#5E5B57]">
                  Within 30 Days
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          NEWSLETTER / JOURNEY
      ===================================================== */}

      <section className="relative overflow-hidden bg-[#EEE7DF]">

        <div className="mx-auto grid max-w-[1600px] lg:grid-cols-[1fr_0.95fr]">

          {/* LEFT */}

          <div data-reveal="left" className="flex items-center px-6 py-14 sm:px-10 lg:px-16 xl:px-20">

            <div className="w-full max-w-xl">

              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                Stay Connected
              </p>

              <h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-[44px]">
                Be Part Of Our Journey
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#5E5B57]">
                Get updates on new arrivals,
                collections, and Ectoo style
                inspiration.
              </p>

              <form
                onSubmit={handleNewsletter}
                className="mt-7 flex max-w-lg overflow-hidden rounded-[5px] bg-white"
              >

                <div className="relative flex-1">

                  <Mail
                    size={16}
                    strokeWidth={1.6}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5B57]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="Your email address"
                    aria-label="Email address"
                    className="h-12 w-full bg-transparent pl-11 pr-4 text-[11px] outline-none placeholder:text-[#5E5B57]/60"
                  />

                </div>

                <button
                  type="submit"
                  className="home-cta group flex min-w-[125px] items-center justify-center gap-2 bg-[#1F2D22] px-5 text-[10px] font-semibold text-white transition-colors duration-300 hover:bg-[#3F4C3A]"
                >
                  Subscribe

                  <ArrowRight
                    size={13}
                    className="home-arrow transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>

              </form>

            </div>

          </div>

          {/* RIGHT IMAGE */}

          <div data-reveal="scale" className="home-image-wrap relative hidden min-h-[290px] overflow-hidden lg:block">

            <img
              src="/newsletter-banner.png"
              alt="Ectoo handbag"
              className="home-image-zoom absolute inset-0 h-full w-full object-cover object-center"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#EEE7DF]/25 to-[#1F2D22]/20" />

            <div className="home-floating absolute right-12 top-1/2 -translate-y-1/2 rounded-[38px] bg-[#1F2D22]/90 px-8 py-8 text-white backdrop-blur-sm">

              <p className="font-display text-[14px] uppercase leading-7 tracking-[0.26em]">
                More
                <br />
                Than
                <br />
                A Bag
              </p>

              <div className="my-4 h-px w-10 bg-white/50" />

              <p className="text-[8px] uppercase tracking-[0.2em] text-white/70">
                Everyday Confidence
              </p>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;