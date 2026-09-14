import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ArrowDownUp,
  ChevronDown,
  ImageOff,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  Link,
  useSearchParams,
} from "react-router-dom";

import { useCart } from "../component/CartContext";
import { API_BASE_URL } from "../config";

const Shop = () => {
  const pageRef = useRef(null);
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();

  const categoryFromUrl =
    searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [activeCategory, setActiveCategory] =
    useState(categoryFromUrl || "All");

  const [searchQuery, setSearchQuery] =
    useState("");

  const [sortBy, setSortBy] =
    useState("newest");

  const [showFilters, setShowFilters] =
    useState(false);

  

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setFetchError("");

        const response = await fetch(
          `${API_BASE_URL}/api/products`
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
              "Unable to load products."
          );
        }

        if (!isMounted) return;

        setProducts(
          Array.isArray(data?.products)
            ? data.products
            : []
        );
      } catch (error) {
        if (!isMounted) return;

        setFetchError(
          error?.message ||
            "Unable to load products. Please try again."
        );
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

  

  useEffect(() => {
    setActiveCategory(
      categoryFromUrl || "All"
    );
  }, [categoryFromUrl]);

  

  const categories = useMemo(() => {
    const databaseCategories = products
      .map((product) => product?.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set(databaseCategories),
    ];
  }, [products]);

  

  const getImageUrl = (image) => {
    if (
      !image ||
      typeof image !== "string"
    ) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${API_BASE_URL}${image}`;
  };

  

  const formatPrice = (price) => {
    const value = Number(price);

    if (!Number.isFinite(value)) {
      return "$0.00";
    }

    return `$${value.toFixed(2)}`;
  };

  

  const handleAddToCart = (product) => {
    if (
      !product ||
      Number(product.stock) <= 0
    ) {
      return;
    }

    addToCart({
      ...product,
      id: product._id,
      image: getImageUrl(
        product.images?.[0]
      ),
    });
  };

  

  const filteredProducts = useMemo(() => {
    const search = searchQuery
      .trim()
      .toLowerCase();

    let result = products.filter(
      (product) => {
        const category =
          product?.category
            ?.toString()
            .toLowerCase() || "";

        const name =
          product?.name
            ?.toString()
            .toLowerCase() || "";

        const description =
          product?.description
            ?.toString()
            .toLowerCase() || "";

        const matchesCategory =
          activeCategory === "All" ||
          category ===
            activeCategory.toLowerCase();

        const matchesSearch =
          !search ||
          name.includes(search) ||
          category.includes(search) ||
          description.includes(search);

        return (
          matchesCategory &&
          matchesSearch
        );
      }
    );

    if (sortBy === "price-low") {
      result = [...result].sort(
        (a, b) =>
          Number(a?.price || 0) -
          Number(b?.price || 0)
      );
    }

    if (sortBy === "price-high") {
      result = [...result].sort(
        (a, b) =>
          Number(b?.price || 0) -
          Number(a?.price || 0)
      );
    }

    if (sortBy === "name-az") {
      result = [...result].sort(
        (a, b) =>
          (a?.name || "").localeCompare(
            b?.name || ""
          )
      );
    }

    if (sortBy === "newest") {
      result = [...result].sort(
        (a, b) => {
          const dateA = new Date(
            a?.createdAt || 0
          ).getTime();

          const dateB = new Date(
            b?.createdAt || 0
          ).getTime();

          return dateB - dateA;
        }
      );
    }

    return result;
  }, [
    products,
    activeCategory,
    searchQuery,
    sortBy,
  ]);

  

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
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [loading, filteredProducts?.length]);

  const handleCategoryChange = (
    category
  ) => {
    setActiveCategory(category);
    setShowFilters(false);
  };

  return (
    <div ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#FAF8F5] text-[#111311]">
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .75s cubic-bezier(.22,1,.36,1), transform .75s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal="left"] { transform: translateX(-38px); }
        [data-reveal="right"] { transform: translateX(38px); }
        [data-reveal="scale"] { transform: scale(.97); }
        [data-reveal].ectoo-visible { opacity: 1; transform: translate(0,0) scale(1); }
        .ectoo-product { transition: transform .35s ease; }
        .ectoo-product:hover { transform: translateY(-5px); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
          .ectoo-product:hover { transform: none; }
        }
      `}</style>

      

      <section className="relative overflow-hidden border-b border-[#E4DED7] bg-[#EEE7DF] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-20">
        <div data-reveal="scale" className="relative mx-auto max-w-7xl">

          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
            Ectoo Collection
          </p>

          <div className="mt-4 flex flex-col justify-between gap-7 lg:flex-row lg:items-end">

            <div className="max-w-3xl">

              <h1 className="font-display text-5xl leading-[0.98] text-[#111311] sm:text-6xl lg:text-7xl">
                Find your
                <span className="block text-[#3F4C3A]">
                  everyday carry.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#5E5B57] sm:mt-6 sm:text-base">
                Explore handbags designed for
                everyday use, practical
                organization, and modern style.
              </p>

            </div>

            <div className="flex items-center gap-3 rounded-full border border-[#1F2D22]/10 bg-white/60 px-5 py-3 text-[#1F2D22]">

              <ShoppingBag
                size={22}
                aria-hidden="true"
              />

              <span className="text-sm font-medium">
                {products.length}{" "}
                {products.length === 1
                  ? "Product"
                  : "Products"}
              </span>

            </div>

          </div>

        </div>
      </section>

      

      <section className="sticky top-0 z-30 border-b border-[#E4DED7] bg-[#FAF8F5]/95 backdrop-blur-xl">

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            

            <div className="hidden max-w-full items-center gap-2 overflow-x-auto lg:flex">

              {categories.map(
                (category) => {
                  const selected =
                    activeCategory.toLowerCase() ===
                    category.toLowerCase();

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          category
                        )
                      }
                      aria-pressed={selected}
                      className={`min-h-11 whitespace-nowrap rounded-full border px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] transition-all ${
                        selected
                          ? "border-[#1F2D22] bg-[#1F2D22] text-white"
                          : "border-[#E4DED7] bg-white text-[#5E5B57] hover:border-[#1F2D22] hover:text-[#111311]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                }
              )}

            </div>

            

            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              <div className="relative min-w-0 flex-1 sm:min-w-[240px] lg:w-72">

                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#5E5B57]/70"
                />

                <label
                  htmlFor="shop-search"
                  className="sr-only"
                >
                  Search products
                </label>

                <input
                  id="shop-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="min-h-12 w-full rounded-[14px] border border-[#E4DED7] bg-white py-3 pl-11 pr-11 text-base text-[#111311] outline-none transition-all placeholder:text-[#5E5B57]/60 focus:border-[#1F2D22] focus:shadow-[0_0_0_4px_rgba(31,45,34,0.05)] sm:text-sm"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchQuery("")
                    }
                    aria-label="Clear search"
                    className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-[#5E5B57]/70 transition-colors hover:text-[#111311]"
                  >
                    <X
                      size={16}
                      aria-hidden="true"
                    />
                  </button>
                )}

              </div>

              <div className="relative sm:min-w-[190px]">

                <ArrowDownUp
                  size={16}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#5E5B57]"
                />

                <label
                  htmlFor="shop-sort"
                  className="sr-only"
                >
                  Sort products
                </label>

                <select
                  id="shop-sort"
                  value={sortBy}
                  onChange={(event) =>
                    setSortBy(
                      event.target.value
                    )
                  }
                  className="min-h-12 w-full appearance-none rounded-[14px] border border-[#E4DED7] bg-white py-3 pl-9 pr-9 text-xs font-semibold text-[#111311] outline-none transition-colors hover:border-[#1F2D22] focus:border-[#1F2D22]"
                >
                  <option value="newest">
                    Newest
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="name-az">
                    Name: A to Z
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#5E5B57]/70"
                />

              </div>

            </div>

            

            <button
              type="button"
              onClick={() =>
                setShowFilters(
                  (previous) => !previous
                )
              }
              aria-expanded={showFilters}
              aria-controls="mobile-shop-categories"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[14px] bg-[#1F2D22] px-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white lg:hidden"
            >
              <SlidersHorizontal
                size={16}
                aria-hidden="true"
              />

              Categories
            </button>

          </div>

          

          {showFilters && (
            <div
              id="mobile-shop-categories"
              className="mt-4 flex flex-wrap gap-2 border-t border-[#E4DED7] pt-4 lg:hidden"
            >
              {categories.map(
                (category) => {
                  const selected =
                    activeCategory.toLowerCase() ===
                    category.toLowerCase();

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          category
                        )
                      }
                      aria-pressed={selected}
                      className={`min-h-11 border px-4 py-2 text-xs font-semibold uppercase tracking-wide ${
                        selected
                          ? "border-[#1F2D22] bg-[#1F2D22] text-white"
                          : "border-[#E4DED7] bg-white text-[#5E5B57]"
                      }`}
                    >
                      {category}
                    </button>
                  );
                }
              )}
            </div>
          )}

        </div>
      </section>

      

      <section className="px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">

        <div className="mx-auto max-w-7xl">

          

          <div className="mb-8 flex flex-wrap items-center justify-between gap-3">

            <p
              className="text-sm text-[#5E5B57]"
              aria-live="polite"
            >
              Showing{" "}
              <span className="font-bold text-[#111311]">
                {filteredProducts.length}
              </span>{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </p>

            {activeCategory !== "All" && (
              <button
                type="button"
                onClick={() =>
                  setActiveCategory("All")
                }
                className="min-h-11 px-2 text-xs font-semibold text-[#5E5B57] underline underline-offset-4 hover:text-[#111311]"
              >
                Clear category
              </button>
            )}

          </div>

          

          {loading && (
            <div
              className="flex min-h-[350px] items-center justify-center"
              role="status"
            >
              <div className="text-center">

                <div
                  className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#E4DED7] border-t-[#1F2D22]"
                  aria-hidden="true"
                />

                <p className="mt-5 text-sm font-medium text-[#5E5B57]">
                  Loading products...
                </p>

              </div>
            </div>
          )}

          

          {!loading && fetchError && (
            <div
              role="alert"
              className="rounded-[26px] border border-red-200 bg-red-50 px-5 py-14 text-center sm:px-6 sm:py-16"
            >

              <div className="mx-auto flex h-16 w-16 items-center justify-center bg-red-100 text-red-600">
                <X
                  size={25}
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-6 font-display text-3xl text-[#111311]">
                Unable to load products
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5E5B57]">
                {fetchError}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 min-h-12 bg-[#1F2D22] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#3F4C3A]"
              >
                Try Again
              </button>

            </div>
          )}

          

          {!loading &&
            !fetchError &&
            filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {filteredProducts.map(
                  (product) => {
                    const productId =
                      product?._id;

                    const image =
                      getImageUrl(
                        product?.images?.[0]
                      );

                    const stock =
                      Number(
                        product?.stock || 0
                      );

                    const outOfStock =
                      stock <= 0 ||
                      product?.status ===
                        "Out of Stock";

                    return (
                      <article
                        key={productId}
                        data-reveal className="ectoo-product group min-w-0 overflow-hidden rounded-[22px] border border-[#E4DED7] bg-white p-3 shadow-[0_10px_30px_rgba(31,45,34,0.035)]"
                      >

                        

                        <div className="relative aspect-square overflow-hidden rounded-[17px] bg-[#F5F1EC]">

                          <Link
                            to={`/shop/${productId}`}
                            aria-label={`View ${product?.name || "product"}`}
                            className="block h-full w-full"
                          >

                            {image ? (
                              <img
                                src={image}
                                alt={
                                  product?.name ||
                                  "Ectoo handbag"
                                }
                                loading="lazy"
                                className="h-full w-full object-cover object-center transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[#5E5B57]/40">
                                <ImageOff
                                  size={30}
                                  aria-hidden="true"
                                />
                              </div>
                            )}

                          </Link>

                          

                          {product?.status &&
                            product.status !==
                              "Active" && (
                              <div
                                className={`absolute left-3 top-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                  outOfStock
                                    ? "bg-red-600 text-white"
                                    : "bg-[#F5F1EC] text-[#111311]"
                                }`}
                              >
                                {
                                  product.status
                                }
                              </div>
                            )}

                        </div>

                        

                        <div className="min-w-0 px-1 pb-1 pt-4">

                          {product?.category && (
                            <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#5E5B57]/70">
                              {
                                product.category
                              }
                            </p>
                          )}

                          <Link
                            to={`/shop/${productId}`}
                            className="block"
                          >
                            <h2 className="mt-1 line-clamp-2 break-words text-sm font-bold leading-5 text-[#111311] transition-colors hover:text-[#3F4C3A]">
                              {product?.name ||
                                "Product"}
                            </h2>
                          </Link>

                          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">

                            <span className="text-sm font-bold text-[#111311]">
                              {formatPrice(
                                product?.price
                              )}
                            </span>

                            <span className="text-xs font-medium text-[#5E5B57]/80">
                              {outOfStock
                                ? "Out of Stock"
                                : "In Stock"}
                            </span>

                          </div>

                          

                          <button
                            type="button"
                            disabled={outOfStock}
                            onClick={() =>
                              handleAddToCart(
                                product
                              )
                            }
                            className={`mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-[13px] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.13em] text-white transition-all ${
                              outOfStock
                                ? "cursor-not-allowed bg-[#1F2D22]/40"
                                : "bg-[#1F2D22] hover:bg-[#3F4C3A]"
                            }`}
                          >
                            <ShoppingBag
                              size={16}
                              aria-hidden="true"
                            />

                            {outOfStock
                              ? "Out of Stock"
                              : "Add to Cart"}
                          </button>

                        </div>

                      </article>
                    );
                  }
                )}

              </div>
            )}

          

          {!loading &&
            !fetchError &&
            filteredProducts.length === 0 && (
              <div className="rounded-[26px] border border-[#E4DED7] bg-[#F5F1EC] px-5 py-16 text-center sm:px-6 sm:py-20">

                <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#1F2D22] text-white">
                  <Search
                    size={25}
                    aria-hidden="true"
                  />
                </div>

                <h2 className="mt-6 font-display text-3xl text-[#111311]">
                  No products found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5E5B57]">
                  We couldn't find a product
                  matching your search or selected
                  category. Try another keyword or
                  browse all products.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory(
                      "All"
                    );
                  }}
                  className="mt-6 min-h-12 bg-[#1F2D22] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#3F4C3A]"
                >
                  View All Products
                </button>

              </div>
            )}

        </div>
      </section>

      

      <section className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8 lg:pb-24">

        <div data-reveal="scale" className="mx-auto max-w-7xl rounded-[30px] bg-[#1F2D22] px-5 py-12 text-center shadow-[0_22px_55px_rgba(31,45,34,0.12)] sm:px-12 sm:py-14 lg:py-20">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            Ectoo
          </p>

          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl leading-tight text-white sm:text-4xl lg:text-5xl">
            Find a bag for your everyday routine.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70">
            Explore available styles and review
            each product page for its current
            details and specifications.
          </p>

        </div>

      </section>

    </div>
  );
};

export default Shop;