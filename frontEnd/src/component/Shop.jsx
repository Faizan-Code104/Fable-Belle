import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  ImageOff,
  Loader2,
  Search,
  ShoppingBag,
  X,
} from "lucide-react";

import { useCart } from "../component/CartContext";
import { API_BASE_URL } from "../config";
import { BUSINESS_INFO } from "../storeInfo";

const apiBase = API_BASE_URL.replace(/\/+$/, "");

const getProductId = (product) => product?._id || product?.id || "";

const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  const value = image.trim();
  if (/^https?:\/\//i.test(value)) return value;

  return `${apiBase}/${value.replace(/^\/+/, "")}`;
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") return "—";

  const value = Number(price);
  return Number.isFinite(value) && value >= 0
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value)
    : "—";
};

const isUnavailable = (product) => {
  const stock = Number(product?.stock);
  return (
    !Number.isFinite(stock) ||
    stock <= 0 ||
    String(product?.status || "").toLowerCase() === "out of stock"
  );
};

const ProductImage = ({ image, name }) => {
  const [failed, setFailed] = useState(false);
  const src = getImageUrl(image);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return src && !failed ? (
    <img
      src={src}
      alt={name || `${BUSINESS_INFO.businessName} handbag`}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="fbshop-image-fallback">
      <ImageOff size={32} aria-hidden="true" />
      <span>Image unavailable</span>
    </span>
  );
};

const Shop = () => {
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory = searchParams.get("category") || "All";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [cartNotice, setCartNotice] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(`${apiBase}/api/products`, {
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data?.message || "Unable to load products.");
        }

        if (!Array.isArray(data?.products)) {
          throw new Error("Product details are unavailable. Please try again.");
        }

        if (active) {
          setProducts(
            data.products.filter(
              (product) => product && typeof product === "object"
            )
          );
        }
      } catch (error) {
        if (active && error?.name !== "AbortError") {
          setFetchError(
            error?.message || "Unable to load products. Please try again."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [retryCount]);

  useEffect(() => {
    if (!cartNotice) return;
    const timer = setTimeout(() => setCartNotice(""), 2500);
    return () => clearTimeout(timer);
  }, [cartNotice]);

  const categories = useMemo(() => {
    const counts = new Map();

    products.forEach((product) => {
      const name = String(product.category || "").trim();
      if (!name || name.toLowerCase() === "all") return;

      const key = name.toLowerCase();
      const existing = counts.get(key);

      counts.set(key, {
        name: existing?.name || name,
        count: (existing?.count || 0) + 1,
      });
    });

    if (
      activeCategory.toLowerCase() !== "all" &&
      !counts.has(activeCategory.toLowerCase())
    ) {
      counts.set(activeCategory.toLowerCase(), {
        name: activeCategory,
        count: 0,
      });
    }

    return [
      { name: "All", count: products.length },
      ...counts.values(),
    ];
  }, [products, activeCategory]);

  const filteredProducts = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    const result = products.filter((product) => {
      const category = String(product.category || "").trim().toLowerCase();
      const searchable = [
        product.name,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (activeCategory.toLowerCase() === "all" ||
          category === activeCategory.trim().toLowerCase()) &&
        (!search || searchable.includes(search))
      );
    });

    const price = (product) => {
      const value = Number(product.price);
      return Number.isFinite(value) ? value : 0;
    };

    const date = (product) => {
      const value = new Date(product.createdAt || 0).getTime();
      return Number.isFinite(value) ? value : 0;
    };

    return result.sort((a, b) => {
      if (sortBy === "price-low") return price(a) - price(b);
      if (sortBy === "price-high") return price(b) - price(a);
      if (sortBy === "name-az") {
        return String(a.name || "").localeCompare(String(b.name || ""));
      }
      return date(b) - date(a);
    });
  }, [products, activeCategory, searchQuery, sortBy]);

  const selectCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);

    if (category === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", category);
    }

    setSearchParams(nextParams, { preventScrollReset: true });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSortBy("newest");
    selectCategory("All");
  };

  const handleAddToCart = (product) => {
    const id = getProductId(product);
    if (!id || isUnavailable(product)) return;

    addToCart({
      ...product,
      id,
      image: getImageUrl(product.images?.[0]),
    });

    setCartNotice(`${product.name || "Product"} added to cart.`);
  };

  return (
    <main className="fbshop-page">
      <style>{styles}</style>

      <div className="fbshop-container">
        <div className="fbshop-topline">
          <span>{BUSINESS_INFO.businessName} / The collection</span>
          <Link to="/cart">
            Your cart
            <ShoppingBag size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="fbshop-layout">
          <aside className="fbshop-sidebar">
            <p className="fbshop-eyebrow">Find your favourite</p>
            <h1>
              The bag
              <span>edit.</span>
            </h1>
            <p className="fbshop-sidebar-intro">
              A style for your everyday routine. Explore the collection
              and make it yours.
            </p>

            <nav aria-label="Product categories" className="fbshop-categories">
              {categories.map((category, index) => {
                const selected =
                  activeCategory.toLowerCase() === category.name.toLowerCase();

                return (
                  <button
                    key={category.name}
                    type="button"
                    onClick={() => selectCategory(category.name)}
                    aria-pressed={selected}
                    aria-controls="fbshop-products"
                    className={selected ? "is-active" : ""}
                  >
                    <span className="fbshop-category-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="fbshop-category-name">
                      {category.name === "All" ? "All bags" : category.name}
                    </span>
                    <span className="fbshop-category-count">
                      {loading ? "…" : category.count}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div className="fbshop-sidebar-note">
              <p className="fbshop-eyebrow">A little guidance</p>
              <p>
                Review each product page for its current details and
                specifications.
              </p>
              <Link to="/contact">
                Ask our team
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </aside>

          <section
            id="fbshop-products"
            className="fbshop-catalog"
            aria-labelledby="fbshop-collection-title"
            aria-busy={loading}
          >
            <header className="fbshop-collection-heading">
              <div>
                <p className="fbshop-eyebrow">
                  {BUSINESS_INFO.businessName}
                </p>
                <h2 id="fbshop-collection-title">
                  {activeCategory.toLowerCase() === "all"
                    ? "Everyday, beautifully."
                    : activeCategory}
                </h2>
              </div>
              <span role="status" aria-live="polite" aria-atomic="true">
                {loading
                  ? "Loading collection…"
                  : fetchError
                  ? "Collection unavailable"
                  : `${filteredProducts.length} ${
                      filteredProducts.length === 1 ? "product" : "products"
                    }`}
              </span>
            </header>

            <div className="fbshop-tools">
              <div className="fbshop-search">
                <Search size={18} aria-hidden="true" />
                <label htmlFor="fbshop-search" className="fbshop-sr-only">
                  Search products
                </label>
                <input
                  id="fbshop-search"
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Find a bag…"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                  >
                    <X size={17} />
                  </button>
                )}
              </div>

              <div className="fbshop-sort">
                <label htmlFor="fbshop-sort">Sort by</label>
                <select
                  id="fbshop-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                </select>
              </div>
            </div>

            {(searchQuery || activeCategory.toLowerCase() !== "all") && (
              <div className="fbshop-filter-summary">
                <span>
                  {activeCategory.toLowerCase() === "all"
                    ? "All bags"
                    : activeCategory}
                  {searchQuery && ` / “${searchQuery}”`}
                </span>
                <button type="button" onClick={clearFilters}>
                  Clear filters <X size={14} aria-hidden="true" />
                </button>
              </div>
            )}

            {loading ? (
              <div className="fbshop-state" role="status">
                <Loader2
                  size={30}
                  className="fbshop-spin"
                  aria-hidden="true"
                />
                <p>Loading your next favourite…</p>
              </div>
            ) : fetchError ? (
              <div className="fbshop-state" role="alert">
                <h3>We couldn’t load the collection.</h3>
                <p>{fetchError}</p>
                <button
                  className="fbshop-button"
                  type="button"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length ? (
              <div className="fbshop-grid">
                {filteredProducts.map((product, index) => {
                  const id = getProductId(product);
                  const unavailable = isUnavailable(product);
                  const productLink = `/shop/${encodeURIComponent(id)}`;
                  const imageContent = (
                    <>
                      <ProductImage
                        image={product.images?.[0]}
                        name={product.name}
                      />
                      {unavailable ? (
                        <span className="fbshop-product-badge">Out of stock</span>
                      ) : product.status && product.status !== "Active" ? (
                        <span className="fbshop-product-badge">
                          {product.status}
                        </span>
                      ) : null}
                      {id && (
                        <span className="fbshop-view-icon">
                          <ArrowUpRight size={19} aria-hidden="true" />
                        </span>
                      )}
                    </>
                  );

                  return (
                    <article
                      key={id || `product-${index}`}
                      className="fbshop-product"
                      style={{
                        "--fbshop-delay": `${Math.min(index, 5) * 45}ms`,
                      }}
                    >
                      {id ? (
                        <Link
                          to={productLink}
                          className="fbshop-product-image"
                          aria-label={`View ${product.name || "product"}`}
                        >
                          {imageContent}
                        </Link>
                      ) : (
                        <div className="fbshop-product-image">{imageContent}</div>
                      )}

                      <div className="fbshop-product-info">
                        <p className="fbshop-product-category">
                          {product.category || "The collection"}
                        </p>
                        {id ? (
                          <Link to={productLink}>
                            <h3>{product.name || "Product"}</h3>
                          </Link>
                        ) : (
                          <h3>{product.name || "Product"}</h3>
                        )}

                        <div className="fbshop-product-meta">
                          <strong>{formatPrice(product.price)}</strong>
                          <span>{unavailable ? "Out of stock" : "In stock"}</span>
                        </div>

                        <button
                          type="button"
                          className="fbshop-add"
                          disabled={unavailable || !id}
                          onClick={() => handleAddToCart(product)}
                          aria-label={
                            unavailable
                              ? `${product.name || "Product"} is out of stock`
                              : `Add ${product.name || "product"} to cart`
                          }
                        >
                          {unavailable ? "Out of stock" : "Add to cart"}
                          <ShoppingBag size={17} aria-hidden="true" />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="fbshop-state">
                <Search size={30} aria-hidden="true" />
                <h3>No matching bags.</h3>
                <p>Try another keyword or browse the full collection.</p>
                <button
                  type="button"
                  className="fbshop-button"
                  onClick={clearFilters}
                >
                  View all products
                </button>
              </div>
            )}

            <footer className="fbshop-catalog-footer">
              <span>A little style, wherever the day takes you.</span>
              <span>{BUSINESS_INFO.businessName}</span>
            </footer>
          </section>
        </div>
      </div>

      <div
        className={`fbshop-cart-notice ${cartNotice ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {cartNotice && (
          <>
            <Check size={19} aria-hidden="true" />
            <span>{cartNotice}</span>
            <Link to="/cart">View cart</Link>
          </>
        )}
      </div>
    </main>
  );
};

const styles = `
  .fbshop-page {
    --ink: #173f36;
    --cream: #f5f0e6;
    --paper: #fffdf5;
    --lime: #d7e5a5;
    --accent: #a56e4f;
    --muted: #516b62;
    --line: rgba(23, 63, 54, .23);
    min-height: 100vh;
    padding-bottom: clamp(45px, 6vw, 85px);
    background: var(--cream);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbshop-page *,
  .fbshop-page *::before,
  .fbshop-page *::after { box-sizing: border-box; }

  .fbshop-page a { color: inherit; text-decoration: none; }
  .fbshop-page button,
  .fbshop-page input,
  .fbshop-page select { font: inherit; }
  .fbshop-page button { cursor: pointer; }

  .fbshop-page a:focus-visible,
  .fbshop-page button:focus-visible,
  .fbshop-page input:focus-visible,
  .fbshop-page select:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
  }

  .fbshop-container {
    width: min(100%, 1550px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4vw, 65px);
  }

  .fbshop-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    padding-block: 18px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbshop-topline a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
  }

  .fbshop-layout {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    align-items: start;
    gap: clamp(30px, 4vw, 65px);
    padding-top: 45px;
  }

  .fbshop-sidebar { min-width: 0; }
  .fbshop-eyebrow {
    margin: 0;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .13em;
  }

  .fbshop-sidebar h1 {
    margin: 20px 0;
    font-size: clamp(58px, 5.5vw, 78px);
    font-weight: 500;
    line-height: .98;
    letter-spacing: -.075em;
  }

  .fbshop-sidebar h1 span { display: block; color: var(--accent); }
  .fbshop-sidebar-intro {
    margin: 0 0 30px;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.9;
  }

  .fbshop-categories { border-top: 1px solid var(--ink); }
  .fbshop-categories button {
    display: grid;
    grid-template-columns: 20px minmax(0, 1fr) auto;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-height: 60px;
    padding: 14px 10px;
    border: 0;
    border-bottom: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    text-align: left;
    transition: background .2s ease;
  }

  .fbshop-categories button:hover,
  .fbshop-categories button.is-active { background: var(--lime); }
  .fbshop-category-number { color: var(--accent); font-size: 9px; }
  .fbshop-category-name { font-size: 14px; }
  .fbshop-category-count { color: var(--muted); font-size: 10px; }

  .fbshop-sidebar-note {
    margin-top: 30px;
    padding: 23px;
    border: 1px solid var(--ink);
    background: var(--paper);
  }

  .fbshop-sidebar-note > p:last-of-type {
    margin: 15px 0;
    font-size: 11px;
    line-height: 1.9;
    color: var(--muted);
  }

  .fbshop-sidebar-note a {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    min-height: 44px;
    border-bottom: 1px solid var(--ink);
    font-size: 12px;
  }

  .fbshop-catalog { min-width: 0; }
  .fbshop-collection-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    padding: 25px 28px;
    background: var(--lime);
    border: 1px solid var(--ink);
  }

  .fbshop-collection-heading > div { min-width: 0; }
  .fbshop-collection-heading h2 {
    margin: 14px 0 0;
    font-size: clamp(32px, 3.8vw, 52px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
    overflow-wrap: anywhere;
  }

  .fbshop-collection-heading > span {
    flex-shrink: 0;
    font-size: 10px;
    color: var(--muted);
  }

  .fbshop-tools {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 30px;
    padding-block: 25px;
    margin-bottom: 5px;
  }

  .fbshop-search {
    display: flex;
    align-items: center;
    min-width: 0;
    gap: 12px;
    border-bottom: 1px solid var(--ink);
  }

  .fbshop-search > svg { flex-shrink: 0; }
  .fbshop-search input {
    width: 100%;
    min-width: 0;
    min-height: 48px;
    padding: 10px 0;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fbshop-search input::placeholder { color: var(--muted); font-size: 12px; }
  .fbshop-search input::-webkit-search-cancel-button { display: none; }
  .fbshop-search button {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
  }

  .fbshop-sort {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--ink);
  }

  .fbshop-sort label { color: var(--muted); font-size: 10px; }
  .fbshop-sort select {
    max-width: 100%;
    min-height: 48px;
    padding: 10px 5px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 12px;
  }

  .fbshop-filter-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-bottom: 25px;
    font-size: 11px;
  }

  .fbshop-filter-summary > span {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  .fbshop-filter-summary button {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 8px;
    min-height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 11px;
  }

  .fbshop-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 35px 22px;
  }

  .fbshop-product {
    min-width: 0;
    animation: fbshopEnter .45s both;
    animation-delay: var(--fbshop-delay, 0ms);
  }

  .fbshop-product-image {
    position: relative;
    display: block;
    aspect-ratio: 4 / 5;
    overflow: hidden;
    background: #ebe7db;
    border: 1px solid var(--line);
  }

  .fbshop-product:nth-child(3n + 2) .fbshop-product-image {
    background: #e5e9db;
  }

  .fbshop-product:nth-child(3n + 3) .fbshop-product-image {
    background: #efe1d6;
  }

  .fbshop-product-image img {
    width: 100%;
    height: 100%;
    padding: 18px;
    object-fit: contain;
    transition: transform .45s ease;
  }

  .fbshop-product-image:hover img { transform: scale(1.05); }
  .fbshop-image-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    height: 100%;
    color: var(--muted);
    font-size: 10px;
  }

  .fbshop-product-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    max-width: calc(100% - 24px);
    padding: 7px 10px;
    background: var(--paper);
    color: var(--ink);
    font-size: 9px;
    overflow-wrap: anywhere;
  }

  .fbshop-view-icon {
    position: absolute;
    right: 12px;
    bottom: 12px;
    display: grid;
    place-items: center;
    width: 38px;
    height: 38px;
    background: var(--paper);
    border: 1px solid var(--line);
  }

  .fbshop-product-info { padding-top: 16px; }
  .fbshop-product-category {
    margin: 0 0 8px;
    color: var(--muted);
    font-size: 9px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .08em;
    overflow-wrap: anywhere;
  }

  .fbshop-product h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 500;
    line-height: 1.35;
    letter-spacing: -.025em;
    overflow-wrap: anywhere;
  }

  .fbshop-product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 13px;
  }

  .fbshop-product-meta strong { font-size: 14px; font-weight: 600; }
  .fbshop-product-meta > span { font-size: 10px; color: var(--muted); }

  .fbshop-add {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    min-height: 48px;
    padding: 12px 15px;
    margin-top: 16px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    transition: background .2s ease;
  }

  .fbshop-add:hover:not(:disabled) { background: #102e28; }
  .fbshop-add:disabled { cursor: not-allowed; opacity: .5; }
  .fbshop-add svg { flex-shrink: 0; }

  .fbshop-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 350px;
    padding: 35px 25px;
    text-align: center;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fbshop-state h3 {
    margin: 20px 0 0;
    font-size: 30px;
    font-weight: 500;
    letter-spacing: -.045em;
    line-height: 1.2;
  }

  .fbshop-state p {
    max-width: 420px;
    margin: 15px 0;
    font-size: 13px;
    line-height: 1.8;
    color: var(--muted);
  }

  .fbshop-button {
    min-height: 48px;
    margin-top: 10px;
    padding: 13px 22px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 12px;
  }

  .fbshop-catalog-footer {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 40px;
    padding-top: 25px;
    border-top: 1px solid var(--ink);
    font-size: 10px;
    color: var(--muted);
  }

  .fbshop-cart-notice {
    position: fixed;
    bottom: 20px;
    left: 50%;
    z-index: 50;
    display: none;
    align-items: center;
    gap: 14px;
    width: max-content;
    max-width: calc(100% - 40px);
    padding: 16px 20px;
    transform: translateX(-50%);
    border: 1px solid var(--ink);
    background: var(--paper);
    box-shadow: 5px 5px 0 rgba(23, 63, 54, .12);
    font-size: 12px;
  }

  .fbshop-cart-notice.is-visible { display: flex; }
  .fbshop-cart-notice > svg { flex-shrink: 0; }
  .fbshop-cart-notice > span { min-width: 0; overflow-wrap: anywhere; }
  .fbshop-cart-notice a { flex-shrink: 0; text-decoration: underline; }

  .fbshop-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes fbshopEnter {
    from { opacity: 0; transform: translateY(15px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fbshopSpin { to { transform: rotate(360deg); } }
  .fbshop-spin { animation: fbshopSpin 1s linear infinite; }

  @media (max-width: 1150px) {
    .fbshop-layout { grid-template-columns: 220px minmax(0, 1fr); gap: 30px; }
    .fbshop-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .fbshop-collection-heading { flex-direction: column; align-items: flex-start; }
  }

  @media (max-width: 800px) {
    .fbshop-layout { grid-template-columns: minmax(0, 1fr); padding-top: 30px; }
    .fbshop-sidebar h1 { font-size: 64px; }
    .fbshop-sidebar h1 span { display: inline; margin-left: 12px; }
    .fbshop-sidebar-intro { max-width: 450px; }
    .fbshop-sidebar-note { display: none; }
    .fbshop-categories {
      display: flex;
      gap: 8px;
      padding-block: 12px;
      overflow-x: auto;
      border-bottom: 1px solid var(--ink);
    }
    .fbshop-categories button {
      display: flex;
      flex-shrink: 0;
      width: auto;
      min-height: 48px;
      padding: 12px 16px;
      border: 1px solid var(--line);
      white-space: nowrap;
    }
    .fbshop-category-number { display: none; }
    .fbshop-category-name { font-size: 12px; }
  }

  @media (max-width: 480px) {
    .fbshop-topline { font-size: 10px; }
    .fbshop-sidebar h1 { font-size: 55px; }
    .fbshop-collection-heading { padding: 24px 20px; }
    .fbshop-collection-heading h2 { font-size: 35px; }
    .fbshop-tools { grid-template-columns: minmax(0, 1fr); gap: 12px; }
    .fbshop-sort { justify-content: space-between; }
    .fbshop-grid { gap: 28px 12px; }
    .fbshop-product-image img { padding: 9px; }
    .fbshop-product h3 { font-size: 14px; }
    .fbshop-product-category { font-size: 8px; }
    .fbshop-product-meta strong { font-size: 12px; }
    .fbshop-product-meta > span { font-size: 9px; }
    .fbshop-add { padding: 12px 10px; font-size: 10px; gap: 8px; }
    .fbshop-product-badge { top: 8px; left: 8px; font-size: 8px; padding: 6px; }
    .fbshop-view-icon { width: 30px; height: 30px; right: 8px; bottom: 8px; }
    .fbshop-cart-notice { flex-wrap: wrap; gap: 10px; }
  }

  @media (max-width: 350px) {
    .fbshop-grid { grid-template-columns: minmax(0, 1fr); }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbshop-page *,
    .fbshop-page *::before,
    .fbshop-page *::after {
      animation: none !important;
      transition: none !important;
    }
    .fbshop-product-image:hover img { transform: none; }
  }
`;

export default Shop;