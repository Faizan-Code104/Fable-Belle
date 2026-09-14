import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

import { API_BASE_URL } from "../config";

const Category = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(null);

  const categoryConfig = [
    {
      id: 1,
      name: "Shoulder Bags",
      image: "/Shoulder Bag.png",
    },
    {
      id: 2,
      name: "Handbags",
      image: "/Handbags.png",
    },
    {
      id: 3,
      name: "Tote Bags",
      image: "/Tote Bags.png",
    },
    {
      id: 4,
      name: "Crossbody Bags",
      image: "/Crossbody Bags.png",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_BASE_URL}/api/products`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch products"
          );
        }

        setProducts(
          Array.isArray(data.products) ? data.products : []
        );
      } catch (error) {
        console.error("Category Products Fetch Error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    return categoryConfig.map((category) => ({
      ...category,
      products: products.filter(
        (product) =>
          product.category?.toLowerCase() ===
          category.name.toLowerCase()
      ).length,
    }));
  }, [products]);

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
        rootMargin: "0px 0px -35px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [loading, categories.length]);

  const createShopLink = (categoryName) => {
    return `/shop?category=${encodeURIComponent(categoryName)}`;
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]"
    >
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 0.65s cubic-bezier(0.22, 1, 0.36, 1),
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        [data-reveal="left"] {
          transform: translateX(-28px);
        }

        [data-reveal="right"] {
          transform: translateX(28px);
        }

        [data-reveal].ectoo-visible {
          opacity: 1;
          transform: translate(0, 0);
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

      <section className="px-5 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16">
        <div className="mx-auto max-w-[1450px] overflow-hidden rounded-[32px] bg-[#EEE7DF]">
          <div className="grid gap-10 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:px-14 lg:py-16 xl:px-16">
            <div data-reveal="left">
              <p className="text-[9px] font-semibold uppercase tracking-[0.32em] text-[#9A5937]">
                Ectoo Collection
              </p>

              <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-[74px]">
                Choose the shape
                <span className="block text-[#3F4C3A]">that fits your day.</span>
              </h1>
            </div>

            <div data-reveal="right" className="lg:justify-self-end">
              <p className="max-w-lg text-sm leading-7 text-[#5E5B57] sm:text-base">
                Browse Ectoo bags by silhouette and move straight into the styles you want to see.
              </p>

              <Link
                to="/shop"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-[#1F2D22] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-[#3F4C3A]"
              >
                Shop All Bags
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1450px]">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div data-reveal>
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9A5937]">
                Browse Categories
              </p>
              <h2 className="mt-2 font-display text-4xl leading-none sm:text-5xl">
                Shop by style.
              </h2>
            </div>

            {!loading && (
              <p
                data-reveal
                className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#7A756F]"
              >
                {categories.reduce((total, category) => total + category.products, 0)} products available
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="min-h-[420px] animate-pulse rounded-[22px] border border-[#E4DED7] bg-white"
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={createShopLink(category.name)}
                  data-reveal
                  className="relative min-h-[420px] overflow-hidden rounded-[22px] border border-[#E4DED7] bg-white"
                >
                  <div className="absolute inset-x-0 top-0 h-[78%] bg-[#F5F1EC]" />

                  <img
                    src={category.image}
                    alt={`${category.name} collection`}
                    loading="lazy"
                    className="absolute left-1/2 top-[39%] h-[58%] w-[74%] -translate-x-1/2 -translate-y-1/2 object-contain object-center"
                  />

                  <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#DCD5CD] bg-white text-[#1F2D22]">
                    <ArrowUpRight size={16} strokeWidth={1.6} />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 border-t border-[#E4DED7] bg-white px-5 py-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-display text-[28px] leading-none text-[#1F2D22]">
                          {category.name}
                        </h3>
                        <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#77716A]">
                          {category.products} {category.products === 1 ? "Product" : "Products"}
                        </p>
                      </div>

                      <span className="pb-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[#1F2D22]">
                        View
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
        <div
          data-reveal
          className="mx-auto grid max-w-[1450px] overflow-hidden rounded-[28px] border border-[#DCE0D7] bg-[#E4E5DD] lg:grid-cols-[0.85fr_1.15fr]"
        >
          <div className="px-7 py-10 sm:px-10 lg:px-12 lg:py-12">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#9A5937]">
              Quick Access
            </p>
            <h2 className="mt-3 max-w-md font-display text-4xl leading-[1.02] sm:text-5xl">
              Go directly to the silhouette you want.
            </h2>
          </div>

          <div className="border-t border-[#CDD3C8] bg-[#F7F6F2] p-5 lg:border-l lg:border-t-0 lg:p-6">
            <div className="grid gap-3 sm:grid-cols-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={createShopLink(category.name)}
                  className="flex min-h-[72px] items-center justify-between rounded-[16px] border border-[#E2DED8] bg-white px-5"
                >
                  <div>
                    <p className="font-display text-2xl leading-none text-[#1F2D22]">
                      {category.name}
                    </p>
                    <p className="mt-1.5 text-[8px] font-semibold uppercase tracking-[0.15em] text-[#827D77]">
                      {category.products} items
                    </p>
                  </div>

                  <ArrowRight
                    size={15}
                    className="text-[#1F2D22]"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Category;
