import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ImageOff,
  Loader2,
  Minus,
  Plus,
  RotateCcw,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";

import { useCart } from "./CartContext";
import { API_BASE_URL } from "../config";
import { BUSINESS_INFO } from "../storeInfo";

const apiBase = String(API_BASE_URL || "").replace(/\/+$/, "");

const getProductId = (product) =>
  String(product?._id || product?.id || "");

const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  const value = image.trim();

  return /^https?:\/\//i.test(value)
    ? value
    : `${apiBase}/${value.replace(/^\/+/, "")}`;
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

const ProductImage = ({ image, alt, thumbnail = false }) => {
  const src = getImageUrl(image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return src && !failed ? (
    <img
      src={src}
      alt={alt}
      decoding="async"
      loading={thumbnail ? "lazy" : "eager"}
      onError={() => setFailed(true)}
    />
  ) : (
    <span className="fbdetail-image-fallback">
      <ImageOff size={thumbnail ? 20 : 36} aria-hidden="true" />
      {!thumbnail && <span>Image unavailable</span>}
    </span>
  );
};

const ShopDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartItems = [] } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notice, setNotice] = useState("");

  const noticeTimer = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    clearTimeout(noticeTimer.current);
    setNotice("");
    setProduct(null);
    setActiveImage(0);
    setQuantity(1);
    setLoading(true);
    setErrorMessage("");

    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("The product link is incomplete.");

        const response = await fetch(
          `${apiBase}/api/products/${encodeURIComponent(id)}`,
          { signal: controller.signal }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to load this product.");
        }

        if (
          !data.product ||
          typeof data.product !== "object" ||
          Array.isArray(data.product) ||
          !getProductId(data.product)
        ) {
          throw new Error("Product details are unavailable.");
        }

        if (active) setProduct(data.product);
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load this product.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, retryCount]);

  useEffect(() => {
    return () => clearTimeout(noticeTimer.current);
  }, []);

  const productId = getProductId(product);
  const rawStock = Number(product?.stock);
  const stock = Number.isFinite(rawStock)
    ? Math.max(0, Math.floor(rawStock))
    : 0;

  const inStock =
    stock > 0 &&
    String(product?.status || "").trim().toLowerCase() !== "out of stock";

  const alreadyInCart = cartItems.reduce((total, item) => {
    if (getProductId(item) !== productId) return total;

    const value = Number(item.quantity);
    return total + (Number.isFinite(value) ? Math.max(0, value) : 0);
  }, 0);

  const availableQuantity = inStock
    ? Math.max(0, Math.floor(stock - alreadyInCart))
    : 0;

  const selectedQuantity = availableQuantity
    ? Math.min(Math.max(1, quantity), availableQuantity)
    : 1;

  const canPurchase = Boolean(productId) && availableQuantity > 0;

  const images = Array.isArray(product?.images)
    ? product.images.filter(
        (image) => typeof image === "string" && image.trim()
      )
    : [];

  if (!images.length && typeof product?.image === "string") {
    if (product.image.trim()) images.push(product.image);
  }

  const imageIndex = Math.min(activeImage, Math.max(0, images.length - 1));

  const changeImage = (direction) => {
    if (images.length < 2) return;

    setActiveImage(
      (current) => (current + direction + images.length) % images.length
    );
  };

  const dismissNotice = () => {
    clearTimeout(noticeTimer.current);
    setNotice("");
  };

  const addSelectedItems = () => {
    if (!product || !canPurchase) return false;

    const cartProduct = {
      ...product,
      id: productId,
      price: Number(product.price),
      image: getImageUrl(images[0]),
    };

    // CartContext adds one unit per call.
    for (let index = 0; index < selectedQuantity; index += 1) {
      addToCart(cartProduct);
    }

    return true;
  };

  const handleAddToCart = () => {
    if (!addSelectedItems()) return;

    clearTimeout(noticeTimer.current);
    setNotice(
      `${selectedQuantity} ${
        selectedQuantity === 1 ? "item" : "items"
      } added to cart.`
    );
    setQuantity(1);

    noticeTimer.current = setTimeout(() => setNotice(""), 3000);
  };

  const handleBuyNow = () => {
    if (addSelectedItems()) navigate("/cart");
  };

  const specifications = [
    ["SKU", product?.sku],
    ["Material", product?.material],
    ["Weight", product?.weight],
  ];

  return (
    <main className="fbdetail">
      <style>{styles}</style>

      <div className="fbdetail-wrap">
        <nav className="fbdetail-top" aria-label="Product navigation">
          <Link to="/shop">
            <ArrowLeft size={17} aria-hidden="true" />
            Back to collection
          </Link>

          <span>{BUSINESS_INFO.businessName}</span>
        </nav>

        {loading ? (
          <div className="fbdetail-state" role="status">
            <Loader2 size={30} className="fbdetail-spin" aria-hidden="true" />
            <p>Loading product details…</p>
          </div>
        ) : errorMessage || !product ? (
          <div className="fbdetail-state" role="alert">
            <ShoppingBag size={32} aria-hidden="true" />
            <h1>Product unavailable</h1>
            <p>{errorMessage || "This product is currently unavailable."}</p>

            <div className="fbdetail-state-actions">
              <button
                type="button"
                className="fbdetail-primary"
                onClick={() => setRetryCount((value) => value + 1)}
              >
                Try again
              </button>

              <Link to="/shop" className="fbdetail-text-link">
                Browse the collection
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <header className="fbdetail-heading">
              <div>
                <p className="fbdetail-eyebrow">
                  {product.category || "The collection"}
                </p>
                <h1>{product.name || "Product"}</h1>
              </div>

              <div className="fbdetail-heading-meta">
                <p className="fbdetail-price">{formatPrice(product.price)}</p>
                <span className="fbdetail-stock">
                  <span aria-hidden="true" />
                  {inStock ? "In stock" : "Out of stock"}
                </span>
              </div>
            </header>

            <section
              className="fbdetail-gallery"
              aria-label="Product image gallery"
            >
              <div className="fbdetail-main-image">
                <ProductImage
                  image={images[imageIndex]}
                  alt={`${product.name || "Product"} — view ${imageIndex + 1}`}
                />

                {product.isFeatured && (
                  <span className="fbdetail-featured">Featured</span>
                )}

                {images.length > 1 && (
                  <div className="fbdetail-image-controls">
                    <button
                      type="button"
                      onClick={() => changeImage(-1)}
                      aria-label="Previous product image"
                    >
                      <ChevronLeft size={20} aria-hidden="true" />
                    </button>

                    <span aria-live="polite" aria-atomic="true">
                      {String(imageIndex + 1).padStart(2, "0")}
                      <span> / </span>
                      {String(images.length).padStart(2, "0")}
                    </span>

                    <button
                      type="button"
                      onClick={() => changeImage(1)}
                      aria-label="Next product image"
                    >
                      <ChevronRight size={20} aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>

              <aside className="fbdetail-gallery-side">
                <div className="fbdetail-gallery-intro">
                  <p className="fbdetail-eyebrow">A closer look</p>
                  <h2>Every angle.<br />Every detail.</h2>
                  <p>Explore the available product views.</p>
                </div>

                {images.length > 1 && (
                  <div className="fbdetail-thumbnails">
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={imageIndex === index ? "is-active" : ""}
                        onClick={() => setActiveImage(index)}
                        aria-label={`Show product image ${index + 1}`}
                        aria-pressed={imageIndex === index}
                      >
                        <ProductImage
                          image={image}
                          alt=""
                          thumbnail
                        />
                        <span aria-hidden="true">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="fbdetail-gallery-signature">
                  <span>{BUSINESS_INFO.businessName}</span>
                  <span>Carry your style.</span>
                </div>
              </aside>
            </section>

            <section
              className="fbdetail-purchase"
              aria-labelledby="fbdetail-purchase-title"
            >
              <div className="fbdetail-purchase-intro">
                <p className="fbdetail-eyebrow">Make it yours</p>
                <h2 id="fbdetail-purchase-title">Your next everyday companion.</h2>
                <p>
                  Select your quantity and add this bag to your cart.
                </p>
              </div>

              <div className="fbdetail-purchase-controls">
                <div className="fbdetail-quantity-row">
                  <span id="fbdetail-quantity-label">Quantity</span>

                  <div
                    className="fbdetail-quantity"
                    role="group"
                    aria-labelledby="fbdetail-quantity-label"
                  >
                    <button
                      type="button"
                      disabled={!canPurchase || selectedQuantity <= 1}
                      onClick={() =>
                        setQuantity(Math.max(1, selectedQuantity - 1))
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} aria-hidden="true" />
                    </button>

                    <span aria-live="polite">{selectedQuantity}</span>

                    <button
                      type="button"
                      disabled={
                        !canPurchase || selectedQuantity >= availableQuantity
                      }
                      onClick={() =>
                        setQuantity(
                          Math.min(availableQuantity, selectedQuantity + 1)
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <div className="fbdetail-buy-buttons">
                  <button
                    type="button"
                    className="fbdetail-primary"
                    disabled={!canPurchase}
                    onClick={handleAddToCart}
                  >
                    {!inStock
                      ? "Out of stock"
                      : !availableQuantity
                      ? "Available stock in cart"
                      : "Add to cart"}
                    <ShoppingBag size={18} aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    className="fbdetail-secondary"
                    disabled={!canPurchase}
                    onClick={handleBuyNow}
                  >
                    Buy it now
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </button>
                </div>

                {inStock && !availableQuantity && (
                  <Link to="/cart" className="fbdetail-cart-hint">
                    Review this item in your cart
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </section>

            <section
              className="fbdetail-information"
              aria-labelledby="fbdetail-info-title"
            >
              <div className="fbdetail-description">
                <p className="fbdetail-eyebrow">About this bag</p>
                <h2 id="fbdetail-info-title">The details that matter.</h2>
                <p className="fbdetail-description-text">
                  {product.description || "A description has not been provided."}
                </p>
              </div>

              <div className="fbdetail-specifications">
                <h3>Product specifications</h3>

                <dl>
                  {specifications.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>
                        {value !== null &&
                        value !== undefined &&
                        String(value).trim()
                          ? String(value)
                          : "Not provided"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </section>

            <section
              className="fbdetail-service"
              aria-label="Shipping and returns information"
            >
              <div>
                <Truck size={23} aria-hidden="true" />
                <h3>Free standard shipping</h3>
                <p>On eligible orders within the contiguous United States.</p>
              </div>

              <div>
                <Clock3 size={23} aria-hidden="true" />
                <h3>1–2 business-day processing</h3>
                <p>
                  Standard transit is generally 3–7 business days after
                  processing.
                </p>
              </div>

              <div>
                <RotateCcw size={23} aria-hidden="true" />
                <h3>30-day returns</h3>
                <p>
                  Eligible items may be returned within 30 days of confirmed
                  delivery, in accordance with our Return and Refund Policy.
                </p>
              </div>
            </section>

            <footer className="fbdetail-footer">
              <div>
                <p className="fbdetail-eyebrow">{BUSINESS_INFO.businessName}</p>
                <h2>Find more to fall for.</h2>
              </div>

              <Link to="/shop" className="fbdetail-text-link">
                Explore the collection
                <ArrowUpRight size={21} aria-hidden="true" />
              </Link>
            </footer>
          </>
        )}
      </div>

      <div
        className={`fbdetail-toast ${notice ? "is-visible" : ""}`}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {notice && (
          <>
            <Check size={19} aria-hidden="true" />
            <span>{notice}</span>
            <Link to="/cart">View cart</Link>
            <button
              type="button"
              onClick={dismissNotice}
              aria-label="Dismiss cart notification"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </main>
  );
};

const styles = `
  .fbdetail {
    --ink: #173f36;
    --deep: #102e28;
    --paper: #fffdf5;
    --bone: #f5f0e6;
    --brass: #a56e4f;
    --muted: #626e67;
    --line: rgba(23, 63, 54, .16);

    min-height: 100vh;
    background: var(--paper);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  .fbdetail *,
  .fbdetail *::before,
  .fbdetail *::after { box-sizing: border-box; }

  .fbdetail a { color: inherit; text-decoration: none; }
  .fbdetail button { font: inherit; cursor: pointer; }
  .fbdetail button:disabled { cursor: not-allowed; opacity: .45; }

  .fbdetail a:focus-visible,
  .fbdetail button:focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 4px;
  }

  .fbdetail-wrap {
    width: min(100%, 1320px);
    margin-inline: auto;
    padding-inline: clamp(20px, 5vw, 64px);
  }

  .fbdetail-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    min-height: 78px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbdetail-top a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
  }

  .fbdetail-top > span { font-weight: 600; }

  .fbdetail-heading {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 35px;
    padding-block: 44px 36px;
    animation: fbdetailEnter .45s ease both;
  }

  .fbdetail-heading > div:first-child { min-width: 0; }

  .fbdetail-eyebrow {
    margin: 0;
    color: var(--brass);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .fbdetail-heading h1 {
    max-width: 850px;
    margin: 14px 0 0;
    font-size: clamp(34px, 4.8vw, 62px);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -.055em;
    overflow-wrap: anywhere;
  }

  .fbdetail-heading-meta {
    flex-shrink: 0;
    padding-bottom: 3px;
    text-align: right;
  }

  .fbdetail-price {
    margin: 0 0 9px;
    font-size: 25px;
    font-weight: 500;
    letter-spacing: -.035em;
  }

  .fbdetail-stock {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    color: var(--muted);
    font-size: 11px;
  }

  .fbdetail-stock > span {
    width: 5px;
    height: 5px;
    background: currentColor;
    border-radius: 50%;
  }

  .fbdetail-gallery {
    display: grid;
    grid-template-columns: minmax(0, 2.3fr) minmax(0, 1fr);
    border: 1px solid var(--line);
    animation: fbdetailEnter .5s ease both;
  }

  .fbdetail-main-image {
    position: relative;
    display: grid;
    place-items: center;
    min-width: 0;
    min-height: 540px;
    background: #eeece5;
    overflow: hidden;
  }

  .fbdetail-main-image > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 55px 50px 90px;
    object-fit: contain;
    transition: transform .5s ease;
  }

  .fbdetail-main-image:hover > img { transform: scale(1.025); }

  .fbdetail-featured {
    position: absolute;
    top: 22px;
    left: 24px;
    padding: 7px 12px;
    background: var(--paper);
    font-size: 10px;
    letter-spacing: .06em;
  }

  .fbdetail-image-controls {
    position: absolute;
    bottom: 22px;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 5px;
    transform: translateX(-50%);
    background: var(--paper);
    border: 1px solid var(--line);
  }

  .fbdetail-image-controls button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
  }

  .fbdetail-image-controls button:hover { background: var(--bone); }
  .fbdetail-image-controls > span { font-size: 11px; white-space: nowrap; }
  .fbdetail-image-controls > span > span { color: var(--muted); }

  .fbdetail-gallery-side {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 30px;
    border-left: 1px solid var(--line);
  }

  .fbdetail-gallery-intro h2 {
    margin: 16px 0 12px;
    font-size: 30px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.045em;
  }

  .fbdetail-gallery-intro > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.8;
  }

  .fbdetail-thumbnails {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    max-height: 300px;
    margin-top: 25px;
    padding: 3px;
    overflow-y: auto;
  }

  .fbdetail-thumbnails button {
    position: relative;
    display: grid;
    place-items: center;
    min-width: 0;
    aspect-ratio: 1;
    padding: 12px;
    border: 1px solid transparent;
    background: #f1eee7;
    color: var(--ink);
    transition: border-color .2s ease;
  }

  .fbdetail-thumbnails button:hover,
  .fbdetail-thumbnails button.is-active { border-color: var(--ink); }

  .fbdetail-thumbnails img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .fbdetail-thumbnails button > span:not(.fbdetail-image-fallback) {
    position: absolute;
    bottom: 4px;
    left: 7px;
    font-size: 8px;
    color: var(--muted);
  }

  .fbdetail-image-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 12px;
    color: var(--muted);
    font-size: 12px;
  }

  .fbdetail-gallery-signature {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: auto;
    padding-top: 25px;
    font-size: 10px;
  }

  .fbdetail-gallery-signature > span:last-child { color: var(--muted); }

  .fbdetail-purchase {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: 60px;
    padding: 38px;
    margin-top: 28px;
    background: var(--bone);
    border: 1px solid var(--line);
  }

  .fbdetail-purchase h2,
  .fbdetail-information h2,
  .fbdetail-footer h2 {
    margin: 14px 0 0;
    font-size: clamp(27px, 3vw, 36px);
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.045em;
  }

  .fbdetail-purchase-intro > p:last-child {
    margin: 14px 0 0;
    color: var(--muted);
    font-size: 12px;
  }

  .fbdetail-purchase-controls { min-width: 0; }

  .fbdetail-quantity-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    margin-bottom: 16px;
    font-size: 12px;
  }

  .fbdetail-quantity {
    display: flex;
    align-items: center;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fbdetail-quantity button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
  }

  .fbdetail-quantity button:hover:not(:disabled) { background: #ece8dd; }

  .fbdetail-quantity > span {
    min-width: 32px;
    text-align: center;
    font-size: 13px;
    font-weight: 500;
  }

  .fbdetail-buy-buttons {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .fbdetail-primary,
  .fbdetail-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 52px;
    padding: 14px 18px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 11px;
    font-weight: 500;
    transition: background .2s ease;
  }

  .fbdetail-primary:hover:not(:disabled) { background: var(--deep); }
  .fbdetail-secondary { background: #a56e4f; border-color: #a56e4f; }
  .fbdetail-secondary:hover:not(:disabled) { background: #8d5c40; }
  .fbdetail-primary > svg,
  .fbdetail-secondary > svg { flex-shrink: 0; }

  .fbdetail-cart-hint {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    margin-top: 8px;
    font-size: 11px;
    text-decoration: underline !important;
    text-underline-offset: 4px;
  }

  .fbdetail-information {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: clamp(30px, 7vw, 100px);
    padding-block: 65px;
  }

  .fbdetail-description-text {
    margin: 24px 0 0;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.95;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }

  .fbdetail-specifications h3 {
    margin: 0 0 20px;
    font-size: 15px;
    font-weight: 500;
  }

  .fbdetail-specifications dl { margin: 0; }

  .fbdetail-specifications dl > div {
    display: grid;
    grid-template-columns: 100px minmax(0, 1fr);
    gap: 20px;
    padding-block: 17px;
    border-top: 1px solid var(--line);
    font-size: 12px;
  }

  .fbdetail-specifications dl > div:last-child {
    border-bottom: 1px solid var(--line);
  }

  .fbdetail-specifications dt { font-weight: 500; }

  .fbdetail-specifications dd {
    margin: 0;
    color: var(--muted);
    overflow-wrap: anywhere;
  }

  .fbdetail-service {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 30px;
    padding-block: 34px;
    border-block: 1px solid var(--line);
  }

  .fbdetail-service > div {
    min-width: 0;
    padding-right: 25px;
    border-right: 1px solid var(--line);
  }

  .fbdetail-service > div:last-child { border-right: 0; padding-right: 0; }
  .fbdetail-service svg { color: var(--brass); }

  .fbdetail-service h3 {
    margin: 16px 0 10px;
    font-size: 13px;
    font-weight: 600;
  }

  .fbdetail-service p {
    margin: 0;
    color: var(--muted);
    font-size: 11px;
    line-height: 1.9;
  }

  .fbdetail-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    padding-block: 45px 60px;
  }

  .fbdetail-text-link {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    min-height: 48px;
    border-bottom: 1px solid var(--ink);
    font-size: 12px;
  }

  .fbdetail-state {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 65vh;
    padding: 45px 20px;
    text-align: center;
  }

  .fbdetail-state h1 {
    margin: 20px 0 0;
    font-size: 34px;
    font-weight: 500;
    letter-spacing: -.045em;
  }

  .fbdetail-state p {
    max-width: 440px;
    color: var(--muted);
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .fbdetail-state-actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
    margin-top: 16px;
  }

  .fbdetail-toast {
    position: fixed;
    right: 22px;
    bottom: calc(22px + env(safe-area-inset-bottom, 0px));
    z-index: 50;
    display: none;
    align-items: center;
    gap: 12px;
    max-width: calc(100% - 36px);
    padding: 10px 12px 10px 18px;
    border: 1px solid var(--line);
    background: var(--paper);
    box-shadow: 0 8px 32px rgba(16, 46, 40, .12);
    font-size: 12px;
  }

  .fbdetail-toast.is-visible { display: flex; }
  .fbdetail-toast > svg { flex-shrink: 0; }

  .fbdetail-toast > a {
    flex-shrink: 0;
    padding-block: 12px;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .fbdetail-toast button {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
  }

  .fbdetail-spin { animation: fbdetailSpin 1s linear infinite; }

  @keyframes fbdetailSpin { to { transform: rotate(360deg); } }

  @keyframes fbdetailEnter {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1000px) {
    .fbdetail-gallery {
      grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    }

    .fbdetail-gallery-side { padding: 22px; }
    .fbdetail-gallery-intro h2 { font-size: 25px; }
    .fbdetail-main-image { min-height: 480px; }
    .fbdetail-purchase { gap: 30px; padding: 28px; }
    .fbdetail-buy-buttons { grid-template-columns: minmax(0, 1fr); }
  }

  @media (max-width: 720px) {
    .fbdetail-top { min-height: 68px; gap: 15px; font-size: 10px; }

    .fbdetail-heading {
      align-items: flex-start;
      flex-direction: column;
      gap: 22px;
      padding-block: 32px 26px;
    }

    .fbdetail-heading h1 { font-size: 38px; }

    .fbdetail-heading-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 20px;
      text-align: left;
    }

    .fbdetail-price { margin: 0; font-size: 23px; }
    .fbdetail-gallery { grid-template-columns: minmax(0, 1fr); }

    .fbdetail-main-image {
      min-height: 0;
      aspect-ratio: 1 / 1;
    }

    .fbdetail-main-image > img { padding: 35px 28px 80px; }

    .fbdetail-gallery-side {
      padding: 18px;
      border-top: 1px solid var(--line);
      border-left: 0;
    }

    .fbdetail-gallery-intro { display: none; }

    .fbdetail-thumbnails {
      display: flex;
      gap: 10px;
      max-height: none;
      margin-top: 0;
      padding: 4px;
      overflow-x: auto;
      overflow-y: hidden;
    }

    .fbdetail-thumbnails button { flex: 0 0 80px; }

    .fbdetail-gallery-signature {
      flex-direction: row;
      justify-content: space-between;
      gap: 15px;
      padding-top: 16px;
    }

    .fbdetail-purchase {
      grid-template-columns: minmax(0, 1fr);
      gap: 25px;
      padding: 26px 22px;
      margin-top: 22px;
    }

    .fbdetail-buy-buttons {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .fbdetail-information {
      grid-template-columns: minmax(0, 1fr);
      gap: 34px;
      padding-block: 42px;
    }

    .fbdetail-service {
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
      padding-block: 28px;
    }

    .fbdetail-service > div {
      padding: 0 0 22px;
      border-right: 0;
      border-bottom: 1px solid var(--line);
    }

    .fbdetail-service > div:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    .fbdetail-service h3 { margin-top: 12px; }

    .fbdetail-footer {
      align-items: flex-start;
      flex-direction: column;
      gap: 25px;
      padding-block: 35px 45px;
    }

    .fbdetail-footer > a { width: 100%; }
  }

  @media (max-width: 420px) {
    .fbdetail-heading h1 { font-size: 32px; }
    .fbdetail-buy-buttons { grid-template-columns: minmax(0, 1fr); }
    .fbdetail-purchase { padding: 24px 18px; }
    .fbdetail-thumbnails button { flex-basis: 70px; }
    .fbdetail-main-image > img { padding: 30px 18px 75px; }
    .fbdetail-featured { top: 16px; left: 16px; }
    .fbdetail-image-controls { bottom: 16px; gap: 14px; }

    .fbdetail-specifications dl > div {
      grid-template-columns: 80px minmax(0, 1fr);
      gap: 16px;
    }

    .fbdetail-toast { right: 18px; flex-wrap: wrap; gap: 8px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbdetail *,
    .fbdetail *::before,
    .fbdetail *::after {
      animation: none !important;
      transition: none !important;
    }

    .fbdetail-main-image:hover > img { transform: none; }
  }
`;

export default ShopDetails;