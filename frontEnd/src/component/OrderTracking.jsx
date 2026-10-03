import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCircle2,
  Copy,
  ImageOff,
  Loader2,
  Package,
  Search,
  Truck,
  XCircle,
} from "lucide-react";
import { API_BASE_URL } from "../config";
import { BUSINESS_INFO } from "../storeInfo";

const STATUS_STEPS = [
  { key: "Pending", title: "Order placed", icon: Package },
  { key: "Processing", title: "Processing", icon: CheckCircle2 },
  { key: "Shipped", title: "Shipped", icon: Truck },
  { key: "Delivered", title: "Delivered", icon: CheckCircle2 },
];

const apiBase = API_BASE_URL.replace(/\/+$/, "");

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatMoney = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  const amount = Number(value);
  return Number.isFinite(amount)
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    : "—";
};

const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  const value = image.trim();
  if (/^https?:\/\//i.test(value)) return value;

  return `${apiBase}/${value.replace(/^\/+/, "")}`;
};

const ProductImage = ({ image, name }) => {
  const [failed, setFailed] = useState(false);
  const src = getImageUrl(image);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="fbtrack-product-image">
      {src && !failed ? (
        <img
          src={src}
          alt={name || "Ordered product"}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageOff size={23} aria-label="Product image unavailable" />
      )}
    </div>
  );
};

const OrderTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");

  const requestRef = useRef(null);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      requestRef.current?.abort();
      clearTimeout(copyTimerRef.current);
    };
  }, []);

  const handleTrackOrder = async (event) => {
    event.preventDefault();
    if (requestRef.current) return;

    const value = trackingNumber.trim().toUpperCase();

    setError("");
    setOrder(null);
    setCopied(false);
    setCopyError("");
    clearTimeout(copyTimerRef.current);

    if (!value) {
      setError("Please enter your order number.");
      return;
    }

    const controller = new AbortController();
    requestRef.current = controller;
    setLoading(true);

    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 20000);

    try {
      const response = await fetch(
        `${apiBase}/api/orders/track/${encodeURIComponent(value)}`,
        { signal: controller.signal }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "We couldn't find an order with this number. Please check and try again."
        );
      }

      if (
        !data?.order ||
        typeof data.order !== "object" ||
        Array.isArray(data.order)
      ) {
        throw new Error(
          "Order details are unavailable right now. Please try again."
        );
      }

      if (!controller.signal.aborted) {
        setOrder(data.order);
      }
    } catch (fetchError) {
      if (timedOut) {
        setError("The request took too long. Please try again.");
      } else if (fetchError?.name !== "AbortError") {
        setError(
          fetchError?.message ||
            "Unable to retrieve this order right now. Please try again."
        );
      }
    } finally {
      clearTimeout(timeout);

      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleCopyOrderNumber = async () => {
    if (!order?.orderNumber) return;

    setCopyError("");

    try {
      await navigator.clipboard.writeText(String(order.orderNumber));
      setCopied(true);
      clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError("Couldn't copy. Please select the order number manually.");
    }
  };

  const status = String(order?.status || "").trim();
  const isCancelled = status.toLowerCase() === "cancelled";
  const currentStepIndex = STATUS_STEPS.findIndex(
    (step) => step.key.toLowerCase() === status.toLowerCase()
  );

  const destination = [
    order?.shippingAddress?.city,
    order?.shippingAddress?.state,
  ]
    .filter(Boolean)
    .join(", ");

  const items = Array.isArray(order?.items) ? order.items : [];

  const supportHref = BUSINESS_INFO.email
    ? `mailto:${BUSINESS_INFO.email}?subject=${encodeURIComponent(
        `${BUSINESS_INFO.businessName} Order Support - ${
          order?.orderNumber || ""
        }`
      )}`
    : "";

  return (
    <main className="fbtrack-page">
      <style>{styles}</style>

      <div className="fbtrack-container">
        <div className="fbtrack-topline">
          <span>{BUSINESS_INFO.businessName} / Order care</span>
          <Link to="/contact">
            Need a hand?
            <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <header className="fbtrack-header">
          <p className="fbtrack-eyebrow">Track your order</p>
          <h1>
            From our door
            <span>to yours.</span>
          </h1>
          <p className="fbtrack-intro">
            Enter the order number from your confirmation to see the
            latest available status.
          </p>
        </header>

        <section
          className="fbtrack-desk"
          aria-label="Order tracking"
          aria-busy={loading}
        >
          <div className="fbtrack-search-strip">
            <div className="fbtrack-search-heading">
              <span className="fbtrack-eyebrow">Your order</span>
              <h2>Find its journey.</h2>
            </div>

            <form onSubmit={handleTrackOrder}>
              <label htmlFor="fbtrack-order-number">Order number</label>
              <div className="fbtrack-input-row">
                <div className="fbtrack-input-wrap">
                  <Package size={19} aria-hidden="true" />
                  <input
                    id="fbtrack-order-number"
                    type="text"
                    value={trackingNumber}
                    onChange={(event) => {
                      setTrackingNumber(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your order number"
                    autoCapitalize="characters"
                    autoCorrect="off"
                    spellCheck={false}
                    maxLength={120}
                    disabled={loading}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                      error ? "fbtrack-error" : "fbtrack-input-help"
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="fbtrack-button"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2
                      size={18}
                      className="fbtrack-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    <Search size={18} aria-hidden="true" />
                  )}
                  {loading ? "Searching…" : "Track order"}
                </button>
              </div>
              <p id="fbtrack-input-help" className="fbtrack-input-help">
                Use the order number exactly as shown in your confirmation.
              </p>
            </form>
          </div>

          {error && (
            <div id="fbtrack-error" className="fbtrack-error" role="alert">
              <XCircle size={20} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="fbtrack-loading" role="status">
              <Loader2
                size={27}
                className="fbtrack-spin"
                aria-hidden="true"
              />
              <p>Looking up your order…</p>
            </div>
          )}

          {!order && !loading && (
            <div className="fbtrack-guide">
              <div className="fbtrack-guide-heading">
                <p className="fbtrack-eyebrow">A few simple steps</p>
                <h2>Stay in the loop.</h2>
              </div>

              <ol>
                <li>
                  <span>01</span>
                  <div>
                    <h3>Find your number</h3>
                    <p>Check your existing order confirmation.</p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <h3>Check the progress</h3>
                    <p>View the current stage and latest available update.</p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <h3>Talk to our team</h3>
                    <p>Contact support if your order needs attention.</p>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {order && (
            <div className="fbtrack-result">
              <div className="fbtrack-order-heading">
                <div>
                  <p className="fbtrack-eyebrow">Latest order status</p>
                  <h2>
                    {isCancelled
                      ? "This order was cancelled."
                      : currentStepIndex === 3
                      ? "Your order has arrived."
                      : currentStepIndex >= 0
                      ? "Here’s where it stands."
                      : "Your order update."}
                  </h2>
                  <span
                    className={`fbtrack-status ${
                      isCancelled ? "is-cancelled" : ""
                    }`}
                  >
                    {status || "Status unavailable"}
                  </span>
                </div>

                <div className="fbtrack-order-number">
                  <p className="fbtrack-eyebrow">Order number</p>
                  <div>
                    <strong>{order.orderNumber || "—"}</strong>
                    {order.orderNumber && (
                      <button
                        type="button"
                        onClick={handleCopyOrderNumber}
                        aria-label="Copy order number"
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                  <p role="status">
                    {copied ? "Order number copied." : copyError}
                  </p>
                </div>
              </div>

              <dl className="fbtrack-metadata">
                <div>
                  <dt>Placed on</dt>
                  <dd>{formatDateTime(order.createdAt)}</dd>
                </div>
                <div>
                  <dt>Destination</dt>
                  <dd>{destination || "—"}</dd>
                </div>
                <div>
                  <dt>Latest update</dt>
                  <dd>{formatDateTime(order.updatedAt)}</dd>
                </div>
              </dl>

              <section
                className="fbtrack-progress"
                aria-labelledby="fbtrack-progress-title"
              >
                <p className="fbtrack-eyebrow">Delivery progress</p>
                <h3 id="fbtrack-progress-title">The journey so far.</h3>

                {isCancelled ? (
                  <div className="fbtrack-cancelled">
                    <XCircle size={25} aria-hidden="true" />
                    <p>
                      This order was cancelled and will not be delivered.
                      Contact support if you believe this is a mistake.
                    </p>
                  </div>
                ) : currentStepIndex < 0 ? (
                  <p className="fbtrack-muted">
                    A delivery stage is not available for this status.
                    Contact our team for more details.
                  </p>
                ) : (
                  <ol className="fbtrack-timeline">
                    {STATUS_STEPS.map((step, index) => {
                      const Icon = step.icon;
                      const isCurrent = index === currentStepIndex;
                      const isPast = index < currentStepIndex;

                      return (
                        <li
                          key={step.key}
                          className={
                            isCurrent
                              ? "is-current"
                              : isPast
                              ? "is-complete"
                              : ""
                          }
                          aria-current={isCurrent ? "step" : undefined}
                        >
                          <span className="fbtrack-step-icon">
                            {isPast ? (
                              <Check size={20} aria-hidden="true" />
                            ) : (
                              <Icon size={20} aria-hidden="true" />
                            )}
                          </span>
                          <div>
                            <h4>{step.title}</h4>
                            <p>
                              {isCurrent
                                ? index === 3
                                  ? "Completed"
                                  : "Current stage"
                                : isPast
                                ? "Completed"
                                : "Not reached yet"}
                            </p>
                            {index === 0 && (
                              <time>{formatDateTime(order.createdAt)}</time>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </section>

              <section
                className="fbtrack-purchase"
                aria-labelledby="fbtrack-purchase-title"
              >
                <div className="fbtrack-purchase-heading">
                  <div>
                    <p className="fbtrack-eyebrow">Your purchase</p>
                    <h3 id="fbtrack-purchase-title">Inside your order.</h3>
                  </div>
                  <span>
                    {items.length} {items.length === 1 ? "item" : "items"}
                  </span>
                </div>

                {items.length ? (
                  <ul className="fbtrack-items">
                    {items.map((item, index) => (
                      <li key={`${item.product || item._id || "item"}-${index}`}>
                        <ProductImage image={item.image} name={item.name} />
                        <div className="fbtrack-item-copy">
                          <h4>{item.name || "Ordered product"}</h4>
                          <span>Quantity: {item.quantity ?? "—"}</span>
                        </div>
                        <div className="fbtrack-item-price">
                          <small>Unit price</small>
                          <strong>{formatMoney(item.price)}</strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="fbtrack-muted">
                    Item details are not available for this order.
                  </p>
                )}

                <div className="fbtrack-total">
                  <span>Order total</span>
                  <strong>{formatMoney(order.totalAmount)}</strong>
                </div>
              </section>
            </div>
          )}

          <footer className="fbtrack-support">
            <div>
              <p className="fbtrack-eyebrow">We’re here to help</p>
              <h3>A question about your order?</h3>
              <p>
                If anything looks incorrect, our support team can help.
              </p>
            </div>

            {supportHref ? (
              <a className="fbtrack-button" href={supportHref}>
                Contact support
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ) : (
              <Link className="fbtrack-button" to="/contact">
                Contact support
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            )}
          </footer>
        </section>
      </div>
    </main>
  );
};

const styles = `
  .fbtrack-page {
    --ink: #173f36;
    --cream: #f5f0e6;
    --paper: #fffdf5;
    --lime: #d7e5a5;
    --accent: #a56e4f;
    --muted: #516b62;
    --line: rgba(23, 63, 54, .23);
    min-height: 100vh;
    padding-bottom: clamp(45px, 7vw, 90px);
    background: var(--cream);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui,
      -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
  }

  .fbtrack-page *,
  .fbtrack-page *::before,
  .fbtrack-page *::after {
    box-sizing: border-box;
  }

  .fbtrack-page a { color: inherit; text-decoration: none; }
  .fbtrack-page button,
  .fbtrack-page input { font: inherit; }
  .fbtrack-page button { cursor: pointer; }
  .fbtrack-page button:disabled { cursor: wait; opacity: .65; }

  .fbtrack-page a:focus-visible,
  .fbtrack-page button:focus-visible,
  .fbtrack-page input:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: 4px;
  }

  .fbtrack-container {
    width: min(100%, 1380px);
    margin-inline: auto;
    padding-inline: clamp(20px, 4.2vw, 65px);
  }

  .fbtrack-topline {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px 20px;
    padding-block: 18px;
    border-bottom: 1px solid var(--line);
    font-size: 11px;
  }

  .fbtrack-topline a {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-height: 44px;
    font-weight: 600;
  }

  .fbtrack-eyebrow {
    margin: 0;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: .13em;
  }

  .fbtrack-header {
    padding-block: clamp(35px, 5vw, 65px);
    animation: fbtrackEnter .6s both;
  }

  .fbtrack-header h1 {
    margin: 20px 0 25px;
    font-size: clamp(52px, 8vw, 112px);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -.07em;
  }

  .fbtrack-header h1 span {
    display: block;
    margin-left: clamp(0px, 13vw, 185px);
    color: var(--accent);
  }

  .fbtrack-intro {
    max-width: 530px;
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.9;
  }

  .fbtrack-desk {
    border: 1px solid var(--ink);
    background: var(--paper);
    box-shadow: 9px 9px 0 rgba(23, 63, 54, .09);
  }

  .fbtrack-search-strip {
    display: grid;
    grid-template-columns: minmax(0, .7fr) minmax(0, 1.3fr);
    align-items: center;
    gap: 30px;
    padding: clamp(24px, 3.5vw, 45px);
    border-bottom: 1px solid var(--ink);
    background: var(--lime);
  }

  .fbtrack-search-heading h2 {
    margin: 12px 0 0;
    font-size: clamp(30px, 3.3vw, 43px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbtrack-search-strip form { min-width: 0; }
  .fbtrack-search-strip label {
    display: block;
    margin-bottom: 10px;
    font-size: 11px;
    font-weight: 600;
  }

  .fbtrack-input-row {
    display: flex;
    gap: 12px;
  }

  .fbtrack-input-wrap {
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: 12px;
    padding-inline: 15px;
    border: 1px solid var(--ink);
    background: var(--paper);
  }

  .fbtrack-input-wrap svg { flex-shrink: 0; }
  .fbtrack-input-wrap input {
    width: 100%;
    min-width: 0;
    min-height: 54px;
    padding: 12px 0;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fbtrack-input-wrap input::placeholder {
    color: var(--muted);
    font-size: 12px;
  }

  .fbtrack-page .fbtrack-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 54px;
    padding: 14px 20px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: background .2s ease;
  }

  .fbtrack-button:hover:not(:disabled) { background: #102e28; }
  .fbtrack-input-help {
    margin: 10px 0 0;
    color: var(--muted);
    font-size: 10px;
    line-height: 1.7;
  }

  .fbtrack-error,
  .fbtrack-cancelled {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 22px;
    background: #fff1ed;
    color: #923c2e;
  }

  .fbtrack-error svg,
  .fbtrack-cancelled svg { flex-shrink: 0; }
  .fbtrack-error p,
  .fbtrack-cancelled p { margin: 0; font-size: 13px; line-height: 1.8; }

  .fbtrack-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
    min-height: 220px;
    padding: 30px;
    font-size: 14px;
  }

  .fbtrack-guide {
    display: grid;
    grid-template-columns: minmax(0, .7fr) minmax(0, 1.3fr);
    gap: 35px;
    padding: clamp(28px, 4vw, 55px);
  }

  .fbtrack-guide h2 {
    margin: 14px 0 0;
    font-size: 36px;
    font-weight: 500;
    letter-spacing: -.05em;
    line-height: 1.1;
  }

  .fbtrack-guide ol { margin: 0; padding: 0; list-style: none; }
  .fbtrack-guide li {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr);
    gap: 18px;
    padding-block: 20px;
    border-bottom: 1px solid var(--line);
  }

  .fbtrack-guide li:first-child { padding-top: 0; }
  .fbtrack-guide li > span { color: var(--accent); font-size: 11px; }
  .fbtrack-guide h3 { margin: 0 0 7px; font-size: 19px; font-weight: 500; }
  .fbtrack-guide li p { margin: 0; font-size: 12px; color: var(--muted); }

  .fbtrack-result { animation: fbtrackEnter .45s both; }
  .fbtrack-order-heading {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 30px;
    padding: clamp(25px, 4vw, 50px);
  }

  .fbtrack-order-heading > div { min-width: 0; }
  .fbtrack-order-heading h2 {
    max-width: 650px;
    margin: 15px 0 20px;
    font-size: clamp(33px, 4vw, 52px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
  }

  .fbtrack-status {
    display: inline-block;
    padding: 7px 12px;
    border: 1px solid var(--ink);
    font-size: 11px;
    background: var(--lime);
  }

  .fbtrack-status.is-cancelled {
    color: #923c2e;
    border-color: #923c2e;
    background: #fff1ed;
  }

  .fbtrack-order-number { max-width: 300px; }
  .fbtrack-order-number > div {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-top: 10px;
  }

  .fbtrack-order-number strong {
    min-width: 0;
    font-size: 21px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fbtrack-order-number button {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border: 1px solid var(--line);
    background: var(--cream);
    color: var(--ink);
  }

  .fbtrack-order-number > p:last-child {
    margin: 8px 0 0;
    font-size: 11px;
    color: var(--muted);
  }

  .fbtrack-metadata {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 0;
    border-block: 1px solid var(--line);
  }

  .fbtrack-metadata > div {
    padding: 24px 30px;
    border-right: 1px solid var(--line);
  }

  .fbtrack-metadata > div:last-child { border-right: 0; }
  .fbtrack-metadata dt { font-size: 10px; color: var(--muted); }
  .fbtrack-metadata dd {
    margin: 8px 0 0;
    font-size: 13px;
    overflow-wrap: anywhere;
  }

  .fbtrack-progress,
  .fbtrack-purchase { padding: clamp(25px, 4vw, 50px); }
  .fbtrack-progress { border-bottom: 1px solid var(--line); }
  .fbtrack-progress h3,
  .fbtrack-purchase-heading h3 {
    margin: 13px 0 25px;
    font-size: clamp(28px, 3vw, 38px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.05em;
  }

  .fbtrack-timeline {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .fbtrack-timeline li {
    position: relative;
    min-width: 0;
    padding-right: 15px;
  }

  .fbtrack-timeline li::before {
    content: '';
    position: absolute;
    top: 23px;
    left: 48px;
    right: 0;
    height: 1px;
    background: var(--line);
  }

  .fbtrack-timeline li:last-child::before { display: none; }
  .fbtrack-timeline li.is-complete::before { background: var(--ink); }

  .fbtrack-step-icon {
    position: relative;
    display: grid;
    place-items: center;
    width: 48px;
    height: 48px;
    border: 1px solid var(--line);
    background: var(--cream);
    color: var(--muted);
  }

  .is-complete .fbtrack-step-icon { background: var(--ink); color: white; }
  .is-current .fbtrack-step-icon {
    background: var(--lime);
    border-color: var(--ink);
    color: var(--ink);
  }

  .fbtrack-timeline h4 {
    margin: 17px 0 6px;
    font-size: 15px;
    font-weight: 600;
  }

  .fbtrack-timeline p { margin: 0; font-size: 11px; color: var(--muted); }
  .fbtrack-timeline time {
    display: block;
    margin-top: 8px;
    font-size: 10px;
    color: var(--muted);
  }

  .fbtrack-purchase-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  .fbtrack-purchase-heading > span { font-size: 11px; color: var(--muted); }
  .fbtrack-items { margin: 0; padding: 0; list-style: none; }
  .fbtrack-items li {
    display: grid;
    grid-template-columns: 90px minmax(0, 1fr) auto;
    align-items: center;
    gap: 22px;
    padding-block: 20px;
    border-top: 1px solid var(--line);
  }

  .fbtrack-product-image {
    display: grid;
    place-items: center;
    width: 90px;
    height: 100px;
    background: var(--cream);
    color: var(--muted);
  }

  .fbtrack-product-image img {
    width: 100%;
    height: 100%;
    padding: 8px;
    object-fit: contain;
  }

  .fbtrack-item-copy h4 {
    margin: 0 0 10px;
    font-size: 16px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fbtrack-item-copy > span { font-size: 11px; color: var(--muted); }
  .fbtrack-item-price { text-align: right; }
  .fbtrack-item-price small { display: block; font-size: 10px; color: var(--muted); }
  .fbtrack-item-price strong { display: block; margin-top: 6px; font-size: 15px; }

  .fbtrack-total {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-top: 15px;
    padding-top: 25px;
    border-top: 1px solid var(--ink);
  }

  .fbtrack-total > span { font-size: 13px; }
  .fbtrack-total strong { font-size: 28px; font-weight: 500; }
  .fbtrack-muted { color: var(--muted); font-size: 13px; line-height: 1.8; }

  .fbtrack-support {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    padding: clamp(25px, 3.5vw, 45px);
    border-top: 1px solid var(--ink);
    background: var(--cream);
  }

  .fbtrack-support h3 {
    margin: 12px 0;
    font-size: 28px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.04em;
  }

  .fbtrack-support div > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.8;
  }

  .fbtrack-support .fbtrack-button { flex-shrink: 0; }

  @keyframes fbtrackEnter {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fbtrackSpin { to { transform: rotate(360deg); } }
  .fbtrack-spin { animation: fbtrackSpin 1s linear infinite; }

  @media (max-width: 950px) {
    .fbtrack-search-strip,
    .fbtrack-guide { grid-template-columns: minmax(0, 1fr); }
    .fbtrack-order-heading { flex-direction: column; }
    .fbtrack-order-number { max-width: 100%; }
  }

  @media (max-width: 650px) {
    .fbtrack-header h1 span { margin-left: 0; }
    .fbtrack-input-row { flex-direction: column; }
    .fbtrack-input-row .fbtrack-button { width: 100%; }
    .fbtrack-metadata { grid-template-columns: minmax(0, 1fr); }
    .fbtrack-metadata > div {
      border-right: 0;
      border-bottom: 1px solid var(--line);
      padding: 18px 24px;
    }
    .fbtrack-metadata > div:last-child { border-bottom: 0; }

    .fbtrack-timeline { grid-template-columns: minmax(0, 1fr); }
    .fbtrack-timeline li {
      display: grid;
      grid-template-columns: 48px minmax(0, 1fr);
      gap: 18px;
      padding: 0 0 28px;
    }
    .fbtrack-timeline li:last-child { padding-bottom: 0; }
    .fbtrack-timeline li::before {
      left: 23px;
      right: auto;
      top: 48px;
      bottom: 0;
      width: 1px;
      height: auto;
    }
    .fbtrack-timeline h4 { margin-top: 3px; }
    .fbtrack-support { flex-direction: column; align-items: stretch; }
    .fbtrack-support .fbtrack-button { width: 100%; }
  }

  @media (max-width: 420px) {
    .fbtrack-header h1 { font-size: 52px; }
    .fbtrack-desk { box-shadow: 5px 5px 0 rgba(23, 63, 54, .09); }
    .fbtrack-items li {
      grid-template-columns: 70px minmax(0, 1fr);
      gap: 15px;
    }
    .fbtrack-product-image { width: 70px; height: 85px; }
    .fbtrack-item-price { grid-column: 2; text-align: left; }
    .fbtrack-item-price small { display: inline; margin-right: 8px; }
    .fbtrack-item-price strong { display: inline; }
    .fbtrack-purchase-heading { align-items: flex-start; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbtrack-page *,
    .fbtrack-page *::before,
    .fbtrack-page *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default OrderTracking;