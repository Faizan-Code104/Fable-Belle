import React, { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ImageOff,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "./CartContext";

const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);

const CartImage = ({ src, name }) => {
  const [failedSource, setFailedSource] = useState(null);

  if (!src || failedSource === src) {
    return (
      <div className="fbc-image-placeholder">
        <ImageOff size={32} strokeWidth={1.2} />
        <span>Image unavailable</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Handbag"}
      loading="lazy"
      onError={() => setFailedSource(src)}
    />
  );
};

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
  } = useCart();

  const items = cartItems || [];

  const getQuantity = (item) =>
    Math.max(1, Math.floor(Number(item.quantity) || 1));

  const totalItems = items.reduce(
    (total, item) => total + getQuantity(item),
    0
  );

  const subtotal = Number(cartSubtotal) || 0;
  const shipping = 0;
  const total = subtotal + shipping;

  const handleQuantity = (item, change) => {
    updateQuantity(
      item.id,
      Math.max(1, getQuantity(item) + change)
    );
  };

  return (
    <main className="fbc-page">
      <style>{styles}</style>

      <div className="fbc-container">
        <nav className="fbc-navigation" aria-label="Cart navigation">
          <Link to="/shop" className="fbc-back">
            <ChevronLeft size={17} />
            Back to collection
          </Link>

          <span className="fbc-brand">FableBelle</span>
        </nav>

        {items.length === 0 ? (
          <section className="fbc-empty">
            <div className="fbc-empty-art" aria-hidden="true">
              <span className="fbc-orbit fbc-orbit-one" />
              <span className="fbc-orbit fbc-orbit-two" />
              <div className="fbc-empty-icon">
                <ShoppingBag size={85} strokeWidth={1} />
              </div>
              <span className="fbc-art-caption">
                A little space for something lovely.
              </span>
            </div>

            <div className="fbc-empty-content">
              <p className="fbc-eyebrow">Your collection starts here</p>
              <h1>
                Find your
                <span>everyday muse.</span>
              </h1>
              <p className="fbc-empty-copy">
                Your cart is empty. Discover the pieces that fit your
                routine, your plans, and your personal style.
              </p>

              <Link to="/shop" className="fbc-button">
                Explore handbags
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="fbc-header">
              <div>
                <p className="fbc-eyebrow">
                  The pieces you picked
                </p>
                <h1>
                  Your cart<span>.</span>
                </h1>
              </div>

              <div className="fbc-item-count">
                <ShoppingBag size={21} strokeWidth={1.4} />
                <span>
                  <strong>{totalItems}</strong>
                  {totalItems === 1 ? " piece" : " pieces"}
                </span>
              </div>
            </header>

            <div className="fbc-workspace">
              <aside className="fbc-summary">
                <div className="fbc-summary-heading">
                  <p className="fbc-eyebrow">Ready when you are</p>
                  <ArrowUpRight size={25} strokeWidth={1.3} />
                </div>

                <h2>Make them yours.</h2>

                <p className="fbc-summary-description">
                  Your favourites, together in one place.
                </p>

                <dl className="fbc-summary-lines">
                  <div>
                    <dt>
                      Subtotal · {totalItems}{" "}
                      {totalItems === 1 ? "item" : "items"}
                    </dt>
                    <dd>{formatPrice(subtotal)}</dd>
                  </div>

                  <div>
                    <dt>Shipping</dt>
                    <dd>Free</dd>
                  </div>
                </dl>

                <div
                  className="fbc-order-total"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  <span>Order total</span>
                  <strong>{formatPrice(total)}</strong>
                </div>

                <Link to="/checkout" className="fbc-button">
                  Proceed to checkout
                  <ArrowRight size={18} />
                </Link>

                <p className="fbc-checkout-note">
                  Review your items and quantities before checkout.
                </p>

                <div className="fbc-delivery">
                  <Truck size={24} strokeWidth={1.3} />
                  <div>
                    <strong>Free U.S. shipping</strong>
                    <p>No shipping charge added to this order.</p>
                  </div>
                </div>

                <div className="fbc-summary-signature">
                  <span>Chosen with a little intention.</span>
                  <strong>FableBelle</strong>
                </div>
              </aside>

              <section
                className="fbc-products"
                aria-labelledby="fbc-selection-title"
              >
                <div className="fbc-products-heading">
                  <h2 id="fbc-selection-title">Your selection</h2>
                  <span>
                    {items.length}{" "}
                    {items.length === 1 ? "style" : "styles"}
                  </span>
                </div>

                <div className="fbc-product-grid">
                  {items.map((item, index) => {
                    const quantity = getQuantity(item);

                    return (
                      <article
                        key={item.id}
                        className="fbc-product-card"
                        style={{
                          "--fbc-delay": `${
                            Math.min(index, 5) * 70
                          }ms`,
                        }}
                      >
                        <div className="fbc-product-visual">
                          <span
                            className="fbc-product-number"
                            aria-hidden="true"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <button
                            type="button"
                            className="fbc-remove"
                            onClick={() => removeFromCart(item.id)}
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <Trash2 size={17} strokeWidth={1.5} />
                          </button>

                          <Link
                            to={`/shop/${item.id}`}
                            className="fbc-image-link"
                            aria-label={`View ${item.name}`}
                          >
                            <CartImage
                              src={item.image}
                              name={item.name}
                            />
                          </Link>

                          <Link
                            to={`/shop/${item.id}`}
                            className="fbc-view-product"
                            aria-label={`View details for ${item.name}`}
                          >
                            View piece
                            <ArrowUpRight size={15} />
                          </Link>
                        </div>

                        <div className="fbc-product-details">
                          <p className="fbc-product-category">
                            {item.category || "FableBelle collection"}
                          </p>

                          <Link to={`/shop/${item.id}`}>
                            <h3>{item.name}</h3>
                          </Link>

                          <p className="fbc-unit-price">
                            {formatPrice(item.price)} each
                          </p>

                          <div className="fbc-product-bottom">
                            <div className="fbc-quantity-group">
                              <span className="fbc-field-label">
                                Quantity
                              </span>

                              <div className="fbc-quantity">
                                <button
                                  type="button"
                                  disabled={quantity <= 1}
                                  onClick={() =>
                                    handleQuantity(item, -1)
                                  }
                                  aria-label={`Decrease quantity of ${item.name}`}
                                >
                                  <Minus size={14} />
                                </button>

                                <span
                                  aria-live="polite"
                                  aria-atomic="true"
                                >
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuantity(item, 1)
                                  }
                                  aria-label={`Increase quantity of ${item.name}`}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="fbc-line-total">
                              <span className="fbc-field-label">
                                Item total
                              </span>
                              <strong>
                                {formatPrice(
                                  Number(item.price) * quantity
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                <Link to="/shop" className="fbc-continue-panel">
                  <div>
                    <span className="fbc-eyebrow">
                      There is more to discover
                    </span>
                    <strong>Find another favourite.</strong>
                  </div>

                  <span className="fbc-continue-icon">
                    <ArrowUpRight size={25} strokeWidth={1.4} />
                  </span>
                </Link>
              </section>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

const styles = `
  .fbc-page {
    --fbc-forest: #173f36;
    --fbc-deep: #102e28;
    --fbc-pistachio: #d7e5a5;
    --fbc-bone: #f5f0e6;
    --fbc-paper: #fffdf5;
    --fbc-brass: #a56e4f;
    --fbc-line: rgba(23, 63, 54, .22);
    min-height: 80vh;
    padding-bottom: clamp(50px, 7vw, 100px);
    background: var(--fbc-bone);
    color: var(--fbc-forest);
    font-family: 'Onest', ui-sans-serif, system-ui, -apple-system,
      BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbc-page *,
  .fbc-page *::before,
  .fbc-page *::after {
    box-sizing: border-box;
  }

  .fbc-page a {
    color: inherit;
    text-decoration: none;
  }

  .fbc-page button {
    font: inherit;
    cursor: pointer;
  }

  .fbc-page a:focus-visible,
  .fbc-page button:focus-visible {
    outline: 3px solid var(--fbc-brass);
    outline-offset: 4px;
  }

  .fbc-container {
    width: min(100%, 1450px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 70px);
  }

  .fbc-navigation {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding-block: 20px;
    border-bottom: 1px solid var(--fbc-line);
  }

  .fbc-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    font-size: 12px;
    font-weight: 600;
  }

  .fbc-back svg {
    transition: transform .25s ease;
  }

  .fbc-back:hover svg {
    transform: translateX(-4px);
  }

  .fbc-brand {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: -.03em;
  }

  .fbc-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 24px;
    padding-block: clamp(32px, 5vw, 66px);
    animation: fbcReveal .65s both;
  }

  .fbc-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: .13em;
    text-transform: uppercase;
  }

  .fbc-header h1 {
    margin: 10px 0 0;
    font-size: clamp(55px, 8vw, 110px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -.075em;
  }

  .fbc-header h1 > span {
    color: var(--fbc-brass);
  }

  .fbc-item-count {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 13px 18px;
    border: 1px solid var(--fbc-line);
    background: var(--fbc-paper);
    font-size: 13px;
  }

  .fbc-item-count strong {
    font-weight: 700;
  }

  .fbc-workspace {
    display: grid;
    grid-template-columns: 335px minmax(0, 1fr);
    align-items: start;
    gap: clamp(28px, 4vw, 60px);
  }

  .fbc-summary {
    position: sticky;
    top: 120px;
    min-width: 0;
    padding: 30px;
    background: var(--fbc-pistachio);
    border: 1px solid var(--fbc-forest);
    box-shadow: 8px 8px 0 rgba(23, 63, 54, .1);
    animation: fbcReveal .65s .08s both;
  }

  .fbc-summary-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .fbc-summary-heading svg {
    flex-shrink: 0;
  }

  .fbc-summary h2 {
    margin: 32px 0 13px;
    font-size: 46px;
    font-weight: 500;
    line-height: 1.03;
    letter-spacing: -.065em;
  }

  .fbc-summary-description {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
  }

  .fbc-summary-lines {
    display: grid;
    gap: 18px;
    margin: 30px 0 0;
    padding-top: 24px;
    border-top: 1px solid var(--fbc-line);
  }

  .fbc-summary-lines > div {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    font-size: 12px;
  }

  .fbc-summary-lines dd {
    margin: 0;
    font-weight: 700;
    text-align: right;
  }

  .fbc-order-total {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
    margin-block: 24px;
    padding-top: 22px;
    border-top: 1px solid var(--fbc-forest);
  }

  .fbc-order-total > span {
    font-size: 11px;
    font-weight: 600;
  }

  .fbc-order-total strong {
    max-width: 100%;
    font-size: 44px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.055em;
    overflow-wrap: anywhere;
  }

  .fbc-page .fbc-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    min-height: 56px;
    padding: 16px 18px;
    background: var(--fbc-forest);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    transition: background .25s ease, transform .25s ease;
  }

  .fbc-button svg {
    flex-shrink: 0;
    transition: transform .25s ease;
  }

  .fbc-button:hover {
    background: var(--fbc-deep);
    transform: translateY(-2px);
  }

  .fbc-button:hover svg {
    transform: translateX(4px);
  }

  .fbc-checkout-note {
    margin: 13px 0 26px;
    font-size: 10px;
    line-height: 1.8;
  }

  .fbc-delivery {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding-top: 21px;
    border-top: 1px solid var(--fbc-line);
  }

  .fbc-delivery > svg {
    flex-shrink: 0;
    margin-top: 2px;
  }

  .fbc-delivery strong {
    font-size: 12px;
  }

  .fbc-delivery p {
    margin: 4px 0 0;
    font-size: 10px;
    line-height: 1.7;
  }

  .fbc-summary-signature {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 30px;
  }

  .fbc-summary-signature > span {
    font-size: 10px;
  }

  .fbc-summary-signature > strong {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -.06em;
  }

  .fbc-products {
    min-width: 0;
  }

  .fbc-products-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--fbc-forest);
  }

  .fbc-products-heading h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -.045em;
  }

  .fbc-products-heading > span {
    font-size: 12px;
  }

  .fbc-product-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 22px;
  }

  .fbc-product-card {
    min-width: 0;
    border: 1px solid var(--fbc-line);
    background: var(--fbc-paper);
    animation: fbcReveal .65s both;
    animation-delay: var(--fbc-delay, 0ms);
  }

  .fbc-product-visual {
    position: relative;
    isolation: isolate;
    min-height: 245px;
    overflow: hidden;
    background: #e6eadb;
  }

  .fbc-product-card:nth-child(4n + 2) .fbc-product-visual {
    background: #e9dfcf;
  }

  .fbc-product-card:nth-child(4n + 3) .fbc-product-visual {
    background: #dce5da;
  }

  .fbc-product-card:nth-child(4n + 4) .fbc-product-visual {
    background: #ede5dc;
  }

  .fbc-product-visual::before {
    content: "";
    position: absolute;
    z-index: -1;
    width: 180px;
    height: 180px;
    top: 50%;
    left: 50%;
    border: 1px solid rgba(23, 63, 54, .13);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: transform .6s ease;
  }

  .fbc-product-card:hover .fbc-product-visual::before {
    transform: translate(-50%, -50%) scale(1.12);
  }

  .fbc-product-number {
    position: absolute;
    top: 17px;
    left: 18px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: .08em;
  }

  .fbc-remove {
    position: absolute;
    z-index: 2;
    top: 9px;
    right: 9px;
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 0;
    background: transparent;
    color: var(--fbc-forest);
    transition: background .25s ease, color .25s ease;
  }

  .fbc-remove:hover {
    background: var(--fbc-paper);
    color: #a33c32;
  }

  .fbc-image-link {
    display: grid;
    place-items: center;
    height: 255px;
    padding: 36px 25px 30px;
  }

  .fbc-image-link img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 0;
    object-fit: contain;
    transition: transform .6s cubic-bezier(.2, .8, .25, 1);
  }

  .fbc-product-card:hover .fbc-image-link img {
    transform: translateY(-5px) scale(1.045);
  }

  .fbc-image-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    font-size: 11px;
  }

  .fbc-view-product {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 44px;
    padding: 10px 18px;
    border-top: 1px solid rgba(23, 63, 54, .13);
    font-size: 10px;
    font-weight: 600;
    transition: background .25s ease;
  }

  .fbc-view-product:hover {
    background: rgba(255, 253, 245, .5);
  }

  .fbc-product-details {
    padding: 22px;
  }

  .fbc-product-category {
    margin: 0;
    color: var(--fbc-brass);
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .11em;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .fbc-product-details h3 {
    margin: 9px 0;
    font-size: 25px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.045em;
    overflow-wrap: anywhere;
    transition: color .2s ease;
  }

  .fbc-product-details a:hover h3 {
    color: var(--fbc-brass);
  }

  .fbc-unit-price {
    margin: 0;
    color: #516b62;
    font-size: 12px;
  }

  .fbc-product-bottom {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 18px 12px;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid var(--fbc-line);
  }

  .fbc-field-label {
    display: block;
    margin-bottom: 8px;
    color: #516b62;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .fbc-quantity {
    display: inline-grid;
    grid-template-columns: 38px minmax(28px, auto) 38px;
    align-items: center;
    border: 1px solid var(--fbc-line);
  }

  .fbc-quantity button {
    display: grid;
    place-items: center;
    height: 44px;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--fbc-forest);
    transition: background .2s ease, color .2s ease;
  }

  .fbc-quantity button:hover:not(:disabled) {
    background: var(--fbc-forest);
    color: #fff;
  }

  .fbc-quantity button:disabled {
    opacity: .3;
    cursor: not-allowed;
  }

  .fbc-quantity > span {
    padding-inline: 3px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
  }

  .fbc-line-total {
    margin-left: auto;
    padding-bottom: 7px;
    text-align: right;
  }

  .fbc-line-total strong {
    font-size: 22px;
    font-weight: 500;
    letter-spacing: -.04em;
    overflow-wrap: anywhere;
  }

  .fbc-continue-panel {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 26px;
    padding: 26px;
    border: 1px solid var(--fbc-line);
    transition: background .25s ease;
  }

  .fbc-continue-panel:hover {
    background: var(--fbc-pistachio);
  }

  .fbc-continue-panel strong {
    display: block;
    margin-top: 8px;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.05em;
  }

  .fbc-continue-icon {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border: 1px solid var(--fbc-forest);
    border-radius: 50%;
    transition: transform .25s ease;
  }

  .fbc-continue-panel:hover .fbc-continue-icon {
    transform: rotate(8deg);
  }

  .fbc-empty {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
    margin-top: clamp(35px, 5vw, 70px);
    border: 1px solid var(--fbc-forest);
    animation: fbcReveal .7s both;
  }

  .fbc-empty-art {
    position: relative;
    isolation: isolate;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 34px;
    min-height: 440px;
    padding: 35px;
    overflow: hidden;
    background: var(--fbc-forest);
    color: var(--fbc-pistachio);
  }

  .fbc-empty-icon {
    display: grid;
    place-items: center;
    width: 190px;
    height: 190px;
    border-radius: 50%;
    background: var(--fbc-pistachio);
    color: var(--fbc-forest);
    animation: fbcFloat 5s ease-in-out infinite;
  }

  .fbc-orbit {
    position: absolute;
    z-index: -1;
    width: 320px;
    height: 320px;
    border: 1px solid rgba(215, 229, 165, .2);
    border-radius: 50%;
  }

  .fbc-orbit-two {
    width: 440px;
    height: 440px;
  }

  .fbc-art-caption {
    max-width: 210px;
    text-align: center;
    font-size: 13px;
    line-height: 1.7;
  }

  .fbc-empty-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: clamp(30px, 5vw, 75px);
    background: var(--fbc-paper);
  }

  .fbc-empty-content h1 {
    margin: 20px 0 0;
    font-size: clamp(40px, 5vw, 72px);
    font-weight: 500;
    line-height: 1.03;
    letter-spacing: -.065em;
  }

  .fbc-empty-content h1 span {
    display: block;
    color: var(--fbc-brass);
  }

  .fbc-empty-copy {
    max-width: 400px;
    margin: 23px 0 30px;
    color: #516b62;
    font-size: 14px;
    line-height: 1.8;
  }

  .fbc-empty-content .fbc-button {
    width: min(100%, 290px);
  }

  @keyframes fbcReveal {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fbcFloat {
    0%, 100% {
      transform: translateY(0) rotate(-4deg);
    }
    50% {
      transform: translateY(-9px) rotate(3deg);
    }
  }

  @media (max-width: 1150px) {
    .fbc-workspace {
      grid-template-columns: 290px minmax(0, 1fr);
      gap: 28px;
    }

    .fbc-summary {
      padding: 24px;
    }

    .fbc-summary h2 {
      font-size: 40px;
    }

    .fbc-product-grid {
      gap: 16px;
    }

    .fbc-product-details {
      padding: 18px;
    }

    .fbc-image-link {
      height: 230px;
      padding-inline: 18px;
    }

    .fbc-product-visual {
      min-height: 0;
    }
  }

  @media (max-width: 850px) {
    .fbc-workspace {
      grid-template-columns: minmax(0, 1fr);
      gap: 35px;
    }

    .fbc-products {
      grid-row: 1;
    }

    .fbc-summary {
      position: static;
      grid-row: 2;
      padding: 30px;
    }

    .fbc-summary h2 {
      margin-top: 20px;
    }

    .fbc-order-total {
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }

    .fbc-order-total strong {
      font-size: 36px;
    }

    .fbc-empty {
      grid-template-columns: minmax(0, 1fr);
    }

    .fbc-empty-art {
      min-height: 300px;
      gap: 22px;
    }

    .fbc-empty-icon {
      width: 150px;
      height: 150px;
    }

    .fbc-empty-content {
      padding: 36px;
    }
  }

  @media (max-width: 520px) {
    .fbc-navigation {
      padding-block: 12px;
    }

    .fbc-back {
      font-size: 11px;
    }

    .fbc-brand {
      font-size: 12px;
    }

    .fbc-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
      padding-block: 32px;
    }

    .fbc-header h1 {
      font-size: clamp(55px, 16vw, 80px);
    }

    .fbc-item-count {
      padding: 10px 14px;
    }

    .fbc-product-grid {
      grid-template-columns: minmax(0, 1fr);
      gap: 24px;
    }

    .fbc-image-link {
      height: 280px;
      padding: 38px 35px 26px;
    }

    .fbc-product-details {
      padding: 22px;
    }

    .fbc-product-details h3 {
      font-size: 27px;
    }

    .fbc-products-heading h2 {
      font-size: 23px;
    }

    .fbc-summary {
      padding: 26px 22px;
      box-shadow: 6px 6px 0 rgba(23, 63, 54, .1);
    }

    .fbc-summary h2 {
      font-size: 43px;
    }

    .fbc-order-total {
      flex-wrap: wrap;
    }

    .fbc-continue-panel {
      padding: 22px 18px;
      gap: 12px;
    }

    .fbc-continue-panel strong {
      font-size: 25px;
    }

    .fbc-continue-panel .fbc-eyebrow {
      font-size: 9px;
    }

    .fbc-continue-icon {
      width: 42px;
      height: 42px;
    }

    .fbc-empty-content {
      padding: 32px 24px;
    }

    .fbc-empty-content h1 {
      font-size: clamp(37px, 11vw, 55px);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbc-page *,
    .fbc-page *::before,
    .fbc-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Cart;