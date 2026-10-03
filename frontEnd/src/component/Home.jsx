import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ImageOff, Plus } from "lucide-react";

import { API_BASE_URL } from "../config";
import storeInfo from "../storeInfo";

const SERVER_URL = API_BASE_URL.replace(/\/+$/, "");
const API_URL = `${SERVER_URL}/api/products`;

const moments = [
  {
    id: "work",
    name: "On the move",
    description: "commute, errands, everything between",
  },
  {
    id: "weekend",
    name: "Open plans",
    description: "time for wherever the day leads",
  },
  {
    id: "evening",
    name: "After hours",
    description: "one reservation, many possibilities",
  },
];

const carryOptions = [
  { id: "essentials", name: "Just the essentials" },
  { id: "more", name: "A little more" },
];

const getProductId = (product) => product?._id || product?.id;

const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  const source = image.trim();

  if (/^https?:\/\//i.test(source)) return source;

  return `${SERVER_URL}/${source.replace(/^\/+/, "")}`;
};

const getCategory = (product) => {
  if (typeof product?.category === "string") return product.category;

  return product?.category?.name || "Handbag";
};

const getPrice = (product) => {
  if (
    product?.price === null ||
    product?.price === undefined ||
    product?.price === ""
  ) {
    return "";
  }

  const value = Number(product.price);

  return Number.isFinite(value) ? `$${value.toFixed(2)}` : "";
};

const ProductImage = ({ product, className = "", eager = false }) => {
  const source = getImageUrl(product?.images?.[0]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [source]);

  if (!source || failed) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        role="img"
        aria-label="Product image unavailable"
      >
        <ImageOff size={40} strokeWidth={1.3} className="opacity-40" />
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={product?.name || `${storeInfo.businessName} handbag`}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [moment, setMoment] = useState("");
  const [carry, setCarry] = useState("");
  const [openId, setOpenId] = useState(null);

  const rowRefs = useRef({});

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setLoadError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Unable to load products.");
        }

        const data = await response.json();

        if (isMounted) {
          setProducts(Array.isArray(data?.products) ? data.products : []);
        }
      } catch (error) {
        if (isMounted && error.name !== "AbortError") {
          setProducts([]);
          setLoadError(
            "Products are temporarily unavailable. Please try again later.",
          );
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const latestProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => {
          const dateA = new Date(a?.createdAt || 0).getTime() || 0;
          const dateB = new Date(b?.createdAt || 0).getTime() || 0;

          return dateB - dateA;
        })
        .slice(0, 10)
        .filter((product) => getProductId(product)),
    [products],
  );

  /*
   * Each day selects a different product position.
   * "A little more" displays the next product.
   * This is a browsing interaction, not a size/occasion classification.
   */
  const finderMatch = useMemo(() => {
    if (!latestProducts.length || !moment) return null;

    const momentIndex = {
      work: 0,
      weekend: 1,
      evening: 2,
    };

    const baseIndex = momentIndex[moment] ?? 0;
    const carryOffset = carry === "more" ? 1 : 0;
    const productIndex =
      (baseIndex + carryOffset) % latestProducts.length;

    return latestProducts[productIndex];
  }, [moment, carry, latestProducts]);

  const stageProduct = finderMatch || latestProducts[0];
  const stageId = getProductId(stageProduct);

  const stageIndex = latestProducts.findIndex(
    (product) => getProductId(product) === stageId,
  );

  const finderHint = loading
    ? "Loading the collection..."
    : loadError
      ? "The collection is temporarily unavailable."
      : !latestProducts.length
        ? "Your next favourite is coming soon."
        : !moment
          ? "Choose the kind of day to explore a piece."
          : !carry
            ? "Now choose what comes along to explore another view of the collection."
            : "Explore this piece and check its full details for size and fit.";

  const handleMomentChange = (id) => {
    setMoment(id);
    setCarry("");
  };

  const showStageProduct = () => {
    if (!stageId) return;

    setOpenId(stageId);

    requestAnimationFrame(() => {
      const row = rowRefs.current[stageId];

      if (!row) return;

      row.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
          .matches
          ? "auto"
          : "smooth",
        block: "start",
      });

      row.querySelector("button")?.focus({ preventScroll: true });
    });
  };

  return (
    <div className="min-w-0 bg-paper text-navy">
      {/* BAG FINDER */}
      <section
        id="finder"
        className="bg-champagne px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-24"
      >
        <div className="mx-auto max-w-[1520px]">
          <div className="mb-10 grid gap-6 lg:mb-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-end lg:gap-12">
            <div className="min-w-0">
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.15em] sm:text-xs">
                {storeInfo.businessName} / The bag finder
              </p>

              <h1 className="text-[clamp(3.2rem,8vw,8rem)] font-medium leading-[0.98] tracking-[-0.075em]">
                Where are we
                <span className="block text-gold lg:ml-[8%]">
                  going?
                </span>
              </h1>
            </div>

            <div className="max-w-sm">
              <p className="text-sm leading-7 text-navy/85 sm:text-base">
                Start with the day ahead. Click through pieces from the
                collection, then compare their full details below.
              </p>

              <a
                href="#collection"
                className="mt-5 inline-flex min-h-11 items-center gap-5 border-b border-navy text-sm font-semibold"
              >
                Or browse the collection
                <ArrowDown size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid border border-navy shadow-[8px_8px_0_rgba(23,36,59,0.14)] lg:grid-cols-2 lg:shadow-[14px_14px_0_rgba(23,36,59,0.14)]">
            {/* FINDER CONTROLS */}
            <div className="flex min-w-0 flex-col bg-paper p-6 sm:p-9 xl:p-12">
              <fieldset className="min-w-0">
                <legend className="mb-5 flex items-center gap-3 text-lg font-semibold tracking-tight">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-navy text-[10px]">
                    01
                  </span>
                  What kind of day?
                </legend>

                <div className="border-t border-navy/25">
                  {moments.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={moment === item.id}
                      onClick={() => handleMomentChange(item.id)}
                      className={`flex min-h-20 w-full items-center justify-between gap-4 border-b border-navy/25 px-3 py-4 text-left transition-colors ${
                        moment === item.id
                          ? "bg-navy text-white"
                          : "hover:bg-champagne"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-xl font-medium tracking-tight">
                          {item.name}
                        </span>

                        <span className="mt-1 block text-xs leading-5 opacity-80">
                          {item.description}
                        </span>
                      </span>

                      <ArrowUpRight
                        size={20}
                        className="shrink-0"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset
                disabled={!moment}
                className="mt-8 min-w-0 disabled:opacity-45"
              >
                <legend className="mb-5 flex items-center gap-3 text-lg font-semibold tracking-tight">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-navy text-[10px]">
                    02
                  </span>
                  What comes along?
                </legend>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  {carryOptions.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={carry === item.id}
                      onClick={() => setCarry(item.id)}
                      className={`inline-flex min-h-12 items-center justify-between gap-4 border border-navy px-4 py-3 text-sm font-semibold transition-colors ${
                        carry === item.id
                          ? "bg-navy text-white"
                          : "hover:bg-champagne"
                      }`}
                    >
                      {item.name}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </fieldset>

              <p
                role="status"
                className="mt-auto pt-8 text-xs leading-6 text-mute"
              >
                {finderHint}
              </p>
            </div>

            {/* PRODUCT STAGE */}
            <div className="relative flex min-w-0 flex-col overflow-hidden bg-navy p-6 text-paper sm:p-9 xl:p-12">
              <div
                aria-live="polite"
                aria-atomic="true"
                className="relative z-10 flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-champagne">
                    {finderMatch
                      ? "A piece to explore"
                      : "Your starting point"}
                  </p>

                  <p className="mt-2 break-words text-xl font-medium tracking-tight sm:text-2xl">
                    {stageProduct?.name ||
                      (loading
                        ? "Loading collection..."
                        : "The collection")}
                  </p>

                  {stageProduct && (
                    <p className="mt-1 text-sm text-champagne">
                      {getPrice(stageProduct)}
                    </p>
                  )}
                </div>

                {!!latestProducts.length && (
                  <span className="shrink-0 text-[10px] tracking-widest">
                    {String(stageIndex + 1).padStart(2, "0")} /{" "}
                    {String(latestProducts.length).padStart(2, "0")}
                  </span>
                )}
              </div>

              <div className="relative my-5 grid min-h-[280px] flex-1 place-items-center sm:min-h-[380px] lg:min-h-[420px]">
                <div
                  aria-hidden="true"
                  className="absolute aspect-square w-[74%] max-w-[420px] rounded-full bg-[radial-gradient(circle_at_35%_25%,#FFFAF3,#EADCC8_70%,#C8B797)]"
                />

                <div
                  aria-hidden="true"
                  className="animate-orbit absolute aspect-square w-[85%] max-w-[480px] rounded-full border border-champagne/30"
                />

                {stageProduct ? (
                  <div
                    key={stageId}
                    className="animate-fade-down relative z-10 w-full"
                  >
                    <ProductImage
                      product={stageProduct}
                      eager
                      className="h-[280px] w-full object-contain p-3 text-navy drop-shadow-[12px_22px_18px_rgba(0,0,0,0.25)] sm:h-[380px] lg:h-[420px]"
                    />
                  </div>
                ) : (
                  <p className="relative z-10 px-6 text-center text-sm text-navy">
                    {loading
                      ? "Loading products..."
                      : loadError
                        ? "Please check back shortly."
                        : "New pieces are coming soon."}
                  </p>
                )}
              </div>

              <div className="relative z-10 border-t border-paper/35 pt-5">
                <p className="text-xs uppercase tracking-widest text-champagne">
                  {stageProduct
                    ? getCategory(stageProduct)
                    : storeInfo.businessName}
                </p>

                <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
                  <p className="min-w-0 flex-1 break-words text-2xl font-medium tracking-tight sm:text-3xl">
                    {stageProduct?.name || "Find your way to carry"}
                  </p>

                  {stageProduct && (
                    <span className="text-lg font-semibold">
                      {getPrice(stageProduct)}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!stageId}
                  onClick={showStageProduct}
                  className="mt-5 inline-flex min-h-11 items-center gap-4 border-b border-champagne text-left text-sm font-semibold text-champagne disabled:opacity-50"
                >
                  See this bag in the collection
                  <ArrowUpRight
                    size={18}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COLLECTION LEDGER */}
      <section
        id="collection"
        className="scroll-mt-6 px-5 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28"
      >
        <div className="mx-auto max-w-[1520px]">
          <div className="mb-10 flex flex-col gap-6 lg:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mute sm:text-xs">
                {storeInfo.businessName} / Latest collection
              </p>

              <h2 className="mt-4 text-[clamp(2.6rem,5vw,5.8rem)] font-medium leading-none tracking-[-0.065em]">
                The carry ledger.
              </h2>
            </div>

            <div className="max-w-sm">
              <p className="text-sm leading-7 text-mute sm:text-base">
                Ways to take the day with you. Open any line to see the
                piece, then explore its full product details.
              </p>

              <Link
                to="/shop"
                className="mt-3 inline-flex min-h-11 items-center gap-4 text-sm font-semibold"
              >
                View all products
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {loading ? (
            <div
              role="status"
              className="border-y border-navy/25 py-16 text-center text-sm text-mute"
            >
              Loading products...
            </div>
          ) : loadError ? (
            <div
              role="alert"
              className="border border-navy/25 bg-champagne/30 px-6 py-14 text-center"
            >
              <p className="text-sm leading-7 text-mute">{loadError}</p>

              <Link
                to="/shop"
                className="mt-6 inline-flex min-h-12 items-center gap-4 bg-navy px-6 py-3 text-sm font-semibold text-white"
              >
                Visit shop
                <ArrowUpRight size={17} />
              </Link>
            </div>
          ) : !latestProducts.length ? (
            <div className="border border-navy/25 px-6 py-14 text-center">
              <h3 className="text-2xl font-medium tracking-tight">
                Collection coming soon
              </h3>

              <p className="mt-4 text-sm leading-7 text-mute">
                Products are being prepared for the{" "}
                {storeInfo.businessName} collection. Please check back soon.
              </p>
            </div>
          ) : (
            <>
              <div
                aria-hidden="true"
                className="hidden grid-cols-[6%_44%_27%_16%_7%] px-4 pb-4 text-[10px] font-bold uppercase tracking-[0.14em] text-mute md:grid"
              >
                <span>No.</span>
                <span>Piece</span>
                <span>Collection</span>
                <span>Price</span>
                <span className="text-right">Details</span>
              </div>

              <div className="border-b border-navy">
                {latestProducts.map((product, index) => {
                  const id = getProductId(product);
                  const expanded = openId === id;
                  const detailId = `product-detail-${id}`;
                  const triggerId = `product-trigger-${id}`;

                  return (
                    <article
                      key={id}
                      ref={(element) => {
                        if (element) {
                          rowRefs.current[id] = element;
                        } else {
                          delete rowRefs.current[id];
                        }
                      }}
                      className="scroll-mt-6 border-t border-navy"
                    >
                      <h3>
                        <button
                          id={triggerId}
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={detailId}
                          onClick={() =>
                            setOpenId(expanded ? null : id)
                          }
                          className={`grid min-h-24 w-full grid-cols-[24px_minmax(0,1fr)_30px] items-center gap-x-3 gap-y-2 px-2 py-5 text-left transition-colors md:min-h-28 md:grid-cols-[6%_44%_27%_16%_7%] md:gap-0 md:px-4 ${
                            expanded
                              ? "bg-champagne"
                              : "hover:bg-champagne/50"
                          }`}
                        >
                          <span className="row-span-2 text-xs font-semibold text-mute md:row-span-1">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="min-w-0 break-words pr-3 text-xl font-medium leading-tight tracking-[-0.045em] sm:text-2xl lg:text-3xl">
                            {product?.name ||
                              `${storeInfo.businessName} Handbag`}
                          </span>

                          <span className="col-start-2 row-start-2 min-w-0 break-words text-xs text-mute md:col-start-auto md:row-start-auto md:pr-4 md:text-sm">
                            {getCategory(product)}
                          </span>

                          <span className="col-start-2 row-start-3 text-sm font-semibold md:col-start-auto md:row-start-auto">
                            {getPrice(product)}
                          </span>

                          <span className="col-start-3 row-span-3 row-start-1 flex h-7 w-7 items-center justify-center justify-self-end rounded-full border border-navy md:col-start-auto md:row-span-1 md:row-start-auto md:h-9 md:w-9">
                            <Plus
                              size={18}
                              className={`transition-transform ${
                                expanded ? "rotate-45" : ""
                              }`}
                              aria-hidden="true"
                            />
                          </span>
                        </button>
                      </h3>

                      <div
                        id={detailId}
                        hidden={!expanded}
                        role="region"
                        aria-labelledby={triggerId}
                        className="animate-unfold grid bg-paper md:grid-cols-2"
                      >
                        <div className="relative grid min-h-[300px] place-items-center overflow-hidden bg-champagne/75 sm:min-h-[380px] lg:min-h-[480px]">
                          <div
                            aria-hidden="true"
                            className="absolute aspect-square w-[65%] rounded-full border border-navy/20"
                          />

                          <ProductImage
                            product={product}
                            className="relative h-[280px] w-[90%] object-contain p-5 drop-shadow-[10px_18px_16px_rgba(23,36,59,0.15)] sm:h-[350px] lg:h-[430px]"
                          />
                        </div>

                        <div className="flex min-w-0 flex-col items-start justify-center p-6 sm:p-9 lg:p-12">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-mute">
                            A closer look
                          </p>

                          <h4 className="mt-4 break-words text-2xl font-medium leading-tight tracking-[-0.045em] lg:text-3xl">
                            {product?.name ||
                              `${storeInfo.businessName} Handbag`}
                          </h4>

                          <dl className="mb-7 mt-7 w-full border-t border-navy/25 text-sm">
                            <div className="flex justify-between gap-5 border-b border-navy/25 py-3">
                              <dt className="font-semibold">
                                Collection
                              </dt>
                              <dd className="min-w-0 break-words text-right text-mute">
                                {getCategory(product)}
                              </dd>
                            </div>

                            {getPrice(product) && (
                              <div className="flex justify-between gap-5 border-b border-navy/25 py-3">
                                <dt className="font-semibold">Price</dt>
                                <dd>{getPrice(product)}</dd>
                              </div>
                            )}
                          </dl>

                          <Link
                            to={`/shop/${id}`}
                            className="inline-flex min-h-12 w-full items-center justify-between gap-5 bg-navy px-5 py-4 text-sm font-semibold text-white transition-colors hover:bg-navy-dark sm:w-auto"
                          >
                            View product
                            <ArrowUpRight
                              size={19}
                              aria-hidden="true"
                            />
                          </Link>

                          <p className="mt-4 text-xs leading-6 text-mute">
                            See available options and full details on
                            the product page.
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;