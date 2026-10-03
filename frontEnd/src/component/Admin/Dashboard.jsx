import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Loader2,
  Package,
  RefreshCw,
  ShoppingCart,
  Users,
} from "lucide-react";

import { API_BASE_URL } from "../../config";
import { BUSINESS_INFO } from "../../storeInfo";

const apiBase = String(API_BASE_URL || "").replace(/\/+$/, "");

const STATUS_ORDER = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(number(value));

const timestamp = (value) => {
  const date = new Date(value || 0).getTime();
  return Number.isFinite(date) ? date : 0;
};

const formatDate = (value) => {
  if (!value || !timestamp(value)) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const getId = (value) => {
  if (value && typeof value === "object") {
    return String(value._id || value.id || "");
  }

  return value ? String(value) : "";
};

const getStatus = (order) => {
  const raw = String(order.status || "").trim();
  return (
    STATUS_ORDER.find(
      (status) => status.toLowerCase() === raw.toLowerCase()
    ) || raw || "Unknown"
  );
};

const isCancelled = (order) =>
  ["cancelled", "canceled"].includes(
    String(order.status || "").trim().toLowerCase()
  );

const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  const value = image.trim();

  return /^https?:\/\//i.test(value)
    ? value
    : `${apiBase}/${value.replace(/^\/+/, "")}`;
};

const getCustomer = (order) => {
  const address = order.shippingAddress || {};
  const name = `${address.firstName || ""} ${address.lastName || ""}`.trim();

  return name || order.user?.name || "Guest";
};

const getOrderSummary = (order) => {
  const items = Array.isArray(order.items) ? order.items : [];

  if (!items.length) return "No item details";

  const firstName = items[0]?.name || "Product";

  return items.length > 1
    ? `${firstName} +${items.length - 1} more`
    : firstName;
};

const getChange = (current, previous) => {
  if (previous === 0) {
    return current > 0
      ? "No previous-month baseline"
      : "No change this month";
  }

  const change = ((current - previous) / previous) * 100;

  return `${change > 0 ? "+" : ""}${change.toFixed(1)}% vs. previous month`;
};

const ProductThumbnail = ({ image, rank }) => {
  const src = getImageUrl(image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="fbadmin-product-image">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <span>{String(rank).padStart(2, "0")}</span>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchDashboard = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        let token;

        try {
          token = localStorage.getItem("fablebelle-token");
        } catch {
          throw new Error("Unable to access your login. Please sign in again.");
        }

        if (!token?.trim()) {
          throw new Error("Please sign in with an admin account.");
        }

        const headers = { Authorization: `Bearer ${token}` };

        const results = await Promise.allSettled(
          ["products", "orders", "users"].map(async (resource) => {
            const response = await fetch(`${apiBase}/api/${resource}`, {
              headers,
              signal: controller.signal,
            });

            const body = await response.json().catch(() => ({}));

            if (!response.ok) {
              throw new Error(
                body.message ||
                  (response.status === 401 || response.status === 403
                    ? "Your admin access could not be verified. Please sign in again."
                    : `Unable to load ${resource}.`)
              );
            }

            if (!Array.isArray(body[resource])) {
              throw new Error(`The ${resource} response is incomplete.`);
            }

            return body[resource].filter(
              (item) => item && typeof item === "object"
            );
          })
        );

        const failed = results.find((result) => result.status === "rejected");
        if (failed) throw failed.reason;

        if (active) {
          setData({
            products: results[0].value,
            orders: results[1].value,
            users: results[2].value,
            updatedAt: new Date(),
          });
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load dashboard data.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchDashboard();

    return () => {
      active = false;
      controller.abort();
    };
  }, [refreshCount]);

  const overview = useMemo(() => {
    if (!data) return null;

    const { orders, products, users, updatedAt } = data;
    const year = updatedAt.getFullYear();
    const month = updatedAt.getMonth();
    const previous = new Date(year, month - 1, 1);

    const inMonth = (item, targetYear, targetMonth) => {
      if (!item.createdAt || !timestamp(item.createdAt)) return false;

      const date = new Date(item.createdAt);

      return (
        date.getFullYear() === targetYear &&
        date.getMonth() === targetMonth
      );
    };

    const countCurrent = (items) =>
      items.filter((item) => inMonth(item, year, month)).length;

    const countPrevious = (items) =>
      items.filter((item) =>
        inMonth(item, previous.getFullYear(), previous.getMonth())
      ).length;

    const eligibleOrders = orders.filter((order) => !isCancelled(order));
    const customers = users.filter(
      (user) => String(user.role || "").toLowerCase() !== "admin"
    );

    const totalValue = eligibleOrders.reduce(
      (sum, order) => sum + number(order.totalAmount),
      0
    );

    const currentValue = eligibleOrders
      .filter((order) => inMonth(order, year, month))
      .reduce((sum, order) => sum + number(order.totalAmount), 0);

    const previousValue = eligibleOrders
      .filter((order) =>
        inMonth(order, previous.getFullYear(), previous.getMonth())
      )
      .reduce((sum, order) => sum + number(order.totalAmount), 0);

    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(year, month - 11 + index, 1);

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        year: date.getFullYear(),
        month: date.getMonth(),
        label: date.toLocaleDateString("en-US", { month: "short" }),
        fullLabel: date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        value: 0,
      };
    });

    eligibleOrders.forEach((order) => {
      if (!order.createdAt || !timestamp(order.createdAt)) return;

      const date = new Date(order.createdAt);
      const bucket = months.find(
        (item) =>
          item.year === date.getFullYear() &&
          item.month === date.getMonth()
      );

      if (bucket) bucket.value += number(order.totalAmount);
    });

    const maxValue = Math.max(...months.map((item) => item.value), 1);
    const periodValue = months.reduce((sum, item) => sum + item.value, 0);

    const statusNames = [
      ...STATUS_ORDER,
      ...new Set(
        orders.map(getStatus).filter((status) => !STATUS_ORDER.includes(status))
      ),
    ];

    const statuses = statusNames.map((status) => {
      const count = orders.filter((order) => getStatus(order) === status).length;

      return {
        status,
        count,
        percent: orders.length ? (count / orders.length) * 100 : 0,
      };
    });

    const productMap = new Map(
      products.map((product) => [getId(product), product])
    );
    const sales = new Map();

    eligibleOrders.forEach((order) => {
      const items = Array.isArray(order.items) ? order.items : [];

      items.forEach((item) => {
        if (!item || typeof item !== "object") return;

        const productId = getId(item.product);
        const key = productId || String(item.name || "Unknown product");
        const product = productMap.get(productId);
        const entry = sales.get(key) || {
          key,
          name: product?.name || item.name || "Product",
          category: product?.category || "Uncategorised",
          image: product?.images?.[0] || item.image || "",
          units: 0,
          value: 0,
        };

        const quantity = Math.max(0, number(item.quantity));
        entry.units += quantity;
        entry.value += number(item.price) * quantity;
        sales.set(key, entry);
      });
    });

    return {
      totalValue,
      currentValue,
      periodValue,
      average: eligibleOrders.length
        ? totalValue / eligibleOrders.length
        : 0,
      valueChange: getChange(currentValue, previousValue),
      months: months.map((item) => ({
        ...item,
        height: Math.max(0, (item.value / maxValue) * 100),
      })),
      statuses,
      recentOrders: [...orders]
        .sort((a, b) => timestamp(b.createdAt) - timestamp(a.createdAt))
        .slice(0, 5),
      topProducts: [...sales.values()]
        .sort((a, b) => b.value - a.value)
        .slice(0, 4),
      stats: [
        {
          title: "Orders",
          value: orders.length,
          change: getChange(countCurrent(orders), countPrevious(orders)),
          Icon: ShoppingCart,
          href: "/admin/orders",
        },
        {
          title: "Products",
          value: products.length,
          change: getChange(countCurrent(products), countPrevious(products)),
          Icon: Package,
          href: "/admin/products",
        },
        {
          title: "Customers",
          value: customers.length,
          change: getChange(countCurrent(customers), countPrevious(customers)),
          Icon: Users,
          href: "/admin/users",
        },
      ],
    };
  }, [data]);

  return (
    <main className="fbadmin">
      <style>{styles}</style>

      <header className="fbadmin-heading">
        <div>
          <p className="fbadmin-eyebrow">
            {BUSINESS_INFO.businessName} / Admin
          </p>
          <h1>Store overview.</h1>
          <p>Your orders, collection and customers at a glance.</p>
        </div>

        <div className="fbadmin-actions">
          <button
            type="button"
            disabled={loading}
            onClick={() => setRefreshCount((value) => value + 1)}
            className="fbadmin-refresh"
          >
            <RefreshCw
              size={16}
              className={loading ? "fbadmin-spin" : ""}
              aria-hidden="true"
            />
            {loading ? "Loading…" : "Refresh"}
          </button>

          <Link to="/shop" className="fbadmin-primary">
            View store
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </header>

      {errorMessage && (
        <div className="fbadmin-error" role="alert">
          {errorMessage}
          {data && <p>The figures below show the last successful update.</p>}
        </div>
      )}

      {!data ? (
        <div className="fbadmin-state" role={loading ? "status" : undefined}>
          {loading ? (
            <>
              <Loader2 size={30} className="fbadmin-spin" aria-hidden="true" />
              <p>Loading your store overview…</p>
            </>
          ) : (
            <p>Dashboard figures will appear once the data loads successfully.</p>
          )}
        </div>
      ) : (
        <div className="fbadmin-content" aria-busy={loading}>
          <div className="fbadmin-update">
            <span>Last updated</span>
            <time dateTime={data.updatedAt.toISOString()}>
              {data.updatedAt.toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </time>
          </div>

          <section className="fbadmin-overview" aria-label="Store totals">
            <div className="fbadmin-value-panel">
              <p className="fbadmin-eyebrow">All-time order value</p>
              <h2>{money(overview.totalValue)}</h2>
              <p className="fbadmin-value-note">
                Total of non-cancelled orders; this is not a confirmed
                payment or net-profit figure.
              </p>

              <div className="fbadmin-value-bottom">
                <div>
                  <span>This month</span>
                  <strong>{money(overview.currentValue)}</strong>
                </div>
                <div>
                  <span>Average order value</span>
                  <strong>{money(overview.average)}</strong>
                </div>
              </div>

              <p className="fbadmin-comparison">{overview.valueChange}</p>
            </div>

            <div className="fbadmin-stats">
              {overview.stats.map(({ title, value, change, Icon, href }) => (
                <Link to={href} className="fbadmin-stat" key={title}>
                  <Icon size={20} aria-hidden="true" />
                  <div>
                    <span>{title}</span>
                    <strong>{value.toLocaleString()}</strong>
                    <p>{change}</p>
                  </div>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>

          <section className="fbadmin-panel fbadmin-sales">
            <div className="fbadmin-section-heading">
              <div>
                <p className="fbadmin-eyebrow">Monthly activity</p>
                <h2>Order value over time</h2>
              </div>
              <div className="fbadmin-period-total">
                <strong>{money(overview.periodValue)}</strong>
                <span>Last 12 months · non-cancelled orders</span>
              </div>
            </div>

            <div className="fbadmin-chart-scroll">
              <div className="fbadmin-chart" aria-label="Monthly order values">
                {overview.months.map((month) => (
                  <div className="fbadmin-chart-column" key={month.key}>
                    <div className="fbadmin-chart-track">
                      <div
                        className="fbadmin-chart-bar"
                        style={{ height: `${month.height}%` }}
                      />
                    </div>
                    <span>{month.label}</span>
                    <span className="fbadmin-chart-value">
                      {money(month.value)}
                    </span>
                    <span className="fbadmin-sr-only">{month.fullLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="fbadmin-panel fbadmin-orders">
            <div className="fbadmin-section-heading">
              <div>
                <p className="fbadmin-eyebrow">Latest activity</p>
                <h2>Recent orders</h2>
              </div>
              <Link to="/admin/orders" className="fbadmin-text-link">
                All orders
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>

            {!overview.recentOrders.length ? (
              <p className="fbadmin-empty">No orders have been placed yet.</p>
            ) : (
              <div className="fbadmin-order-list">
                {overview.recentOrders.map((order, index) => (
                  <article
                    className="fbadmin-order"
                    key={getId(order) || index}
                  >
                    <div className="fbadmin-order-id">
                      <strong>{order.orderNumber || "Order"}</strong>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>

                    <div className="fbadmin-order-customer">
                      <strong>{getCustomer(order)}</strong>
                      <span>{getOrderSummary(order)}</span>
                    </div>

                    <span className="fbadmin-badge">{getStatus(order)}</span>
                    <strong className="fbadmin-order-price">
                      {money(order.totalAmount)}
                    </strong>

                    <Link
                      to="/admin/orders"
                      className="fbadmin-order-link"
                      aria-label={`Open orders to review ${
                        order.orderNumber || "this order"
                      }`}
                    >
                      <ArrowUpRight size={19} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </section>

          <div className="fbadmin-bottom-grid">
            <section className="fbadmin-panel">
              <div className="fbadmin-section-heading">
                <div>
                  <p className="fbadmin-eyebrow">Order distribution</p>
                  <h2>Fulfillment status</h2>
                </div>
              </div>

              <div className="fbadmin-status-list">
                {overview.statuses.map((row) => (
                  <div className="fbadmin-status" key={row.status}>
                    <div>
                      <span>{row.status}</span>
                      <strong>
                        {row.count} <span> / {row.percent.toFixed(0)}%</span>
                      </strong>
                    </div>
                    <div className="fbadmin-progress" aria-hidden="true">
                      <span style={{ width: `${row.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="fbadmin-panel">
              <div className="fbadmin-section-heading">
                <div>
                  <p className="fbadmin-eyebrow">Ranked by order item value</p>
                  <h2>Top products</h2>
                </div>
                <Link to="/admin/products" className="fbadmin-text-link">
                  Manage
                  <ArrowUpRight size={17} aria-hidden="true" />
                </Link>
              </div>

              {!overview.topProducts.length ? (
                <p className="fbadmin-empty">
                  Products will appear here when order activity is available.
                </p>
              ) : (
                <div className="fbadmin-product-list">
                  {overview.topProducts.map((product, index) => (
                    <div className="fbadmin-product" key={product.key}>
                      <ProductThumbnail image={product.image} rank={index + 1} />
                      <div>
                        <h3>{product.name}</h3>
                        <p>{product.category}</p>
                        <span>{product.units.toLocaleString()} units ordered</span>
                      </div>
                      <strong>{money(product.value)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          <footer className="fbadmin-footer">
            <span>{BUSINESS_INFO.businessName} / Store management</span>
            <div>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/orders">Orders</Link>
              <Link to="/admin/users">Customers</Link>
            </div>
          </footer>
        </div>
      )}
    </main>
  );
};

const styles = `
  .fbadmin {
    --ink: #173f36;
    --deep: #102e28;
    --paper: #fffdf5;
    --bone: #f5f0e6;
    --muted: #626e67;
    --brass: #a56e4f;
    --line: rgba(23, 63, 54, .16);

    width: 100%;
    min-width: 0;
    padding: clamp(18px, 3vw, 36px);
    background: var(--bone);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui, sans-serif;
    line-height: 1.6;
  }

  .fbadmin *, .fbadmin *::before, .fbadmin *::after {
    box-sizing: border-box;
  }

  .fbadmin a { color: inherit; text-decoration: none; }
  .fbadmin button { font: inherit; cursor: pointer; }

  .fbadmin a:focus-visible, .fbadmin button:focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 4px;
  }

  .fbadmin-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 25px;
    padding-bottom: 26px;
    border-bottom: 1px solid var(--line);
  }

  .fbadmin-eyebrow {
    margin: 0;
    color: var(--brass);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .fbadmin-heading h1 {
    margin: 10px 0 8px;
    font-size: clamp(30px, 4vw, 44px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.05em;
  }

  .fbadmin-heading > div > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 12px;
  }

  .fbadmin-actions {
    display: flex;
    flex-shrink: 0;
    gap: 10px;
  }

  .fbadmin-primary, .fbadmin-refresh {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 46px;
    padding: 12px 17px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff !important;
    font-size: 11px;
    font-weight: 500;
  }

  .fbadmin-primary:hover { background: var(--deep); }

  .fbadmin-refresh {
    border-color: var(--line);
    background: var(--paper);
    color: var(--ink) !important;
  }

  .fbadmin-refresh:disabled { cursor: not-allowed; opacity: .6; }

  .fbadmin-update {
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    gap: 12px;
    padding-block: 18px;
    color: var(--muted);
    font-size: 10px;
  }

  .fbadmin-overview {
    display: grid;
    grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr);
    gap: 20px;
  }

  .fbadmin-value-panel {
    padding: 30px;
    background: var(--ink);
    color: #fffdf5;
  }

  .fbadmin-value-panel .fbadmin-eyebrow { color: #d7e5a5; }

  .fbadmin-value-panel h2 {
    margin: 20px 0 14px;
    font-size: clamp(34px, 4.6vw, 58px);
    font-weight: 500;
    line-height: 1.1;
    letter-spacing: -.055em;
    overflow-wrap: anywhere;
  }

  .fbadmin-value-note {
    max-width: 440px;
    margin: 0;
    color: #d0d9ce;
    font-size: 11px;
    line-height: 1.8;
  }

  .fbadmin-value-bottom {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 25px;
    margin-top: 30px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,.2);
  }

  .fbadmin-value-bottom span {
    display: block;
    color: #d0d9ce;
    font-size: 10px;
  }

  .fbadmin-value-bottom strong {
    display: block;
    margin-top: 6px;
    font-size: 20px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fbadmin-comparison {
    margin: 20px 0 0;
    color: #d7e5a5;
    font-size: 10px;
  }

  .fbadmin-stats {
    display: grid;
    gap: 12px;
  }

  .fbadmin-stat {
    display: flex;
    align-items: center;
    gap: 18px;
    min-width: 0;
    padding: 20px;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fbadmin-stat > svg { flex-shrink: 0; }
  .fbadmin-stat > svg:first-child { color: var(--brass); }
  .fbadmin-stat > svg:last-child { margin-left: auto; }
  .fbadmin-stat > div { min-width: 0; }
  .fbadmin-stat span { color: var(--muted); font-size: 10px; }

  .fbadmin-stat strong {
    display: block;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.25;
    overflow-wrap: anywhere;
  }

  .fbadmin-stat p {
    margin: 5px 0 0;
    color: var(--muted);
    font-size: 9px;
  }

  .fbadmin-panel {
    min-width: 0;
    margin-top: 22px;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fbadmin-section-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 22px;
    padding: 24px;
    border-bottom: 1px solid var(--line);
  }

  .fbadmin-section-heading h2 {
    margin: 8px 0 0;
    font-size: 23px;
    font-weight: 500;
    letter-spacing: -.04em;
    line-height: 1.25;
  }

  .fbadmin-period-total { text-align: right; }
  .fbadmin-period-total strong { display: block; font-size: 22px; font-weight: 500; }
  .fbadmin-period-total span { color: var(--muted); font-size: 9px; }

  .fbadmin-chart-scroll { overflow-x: auto; padding: 28px 24px; }

  .fbadmin-chart {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 15px;
    min-width: 670px;
  }

  .fbadmin-chart-column { min-width: 0; text-align: center; }

  .fbadmin-chart-track {
    display: flex;
    align-items: flex-end;
    height: 190px;
    border-bottom: 1px solid var(--line);
    background: repeating-linear-gradient(
      to top,
      transparent 0,
      transparent 46px,
      rgba(23,63,54,.07) 47px,
      transparent 48px
    );
  }

  .fbadmin-chart-bar {
    width: 100%;
    background: var(--ink);
    transition: height .35s ease;
  }

  .fbadmin-chart-column:nth-child(even) .fbadmin-chart-bar {
    background: #a56e4f;
  }

  .fbadmin-chart-column > span {
    display: block;
    margin-top: 10px;
    color: var(--muted);
    font-size: 10px;
  }

  .fbadmin-chart-column > .fbadmin-chart-value {
    margin-top: 4px;
    color: var(--ink);
    font-size: 9px;
    overflow-wrap: anywhere;
  }

  .fbadmin-text-link {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
    min-height: 44px;
    font-size: 11px;
  }

  .fbadmin-order {
    display: grid;
    grid-template-columns:
      minmax(0, 1fr)
      minmax(0, 1.4fr)
      auto
      minmax(90px, .6fr)
      44px;
    align-items: center;
    gap: 20px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--line);
  }

  .fbadmin-order:last-child { border-bottom: 0; }

  .fbadmin-order-id, .fbadmin-order-customer { min-width: 0; }

  .fbadmin-order strong { font-size: 12px; font-weight: 500; overflow-wrap: anywhere; }

  .fbadmin-order-id span, .fbadmin-order-customer span {
    display: block;
    margin-top: 5px;
    color: var(--muted);
    font-size: 10px;
    overflow-wrap: anywhere;
  }

  .fbadmin-badge {
    padding: 6px 10px;
    background: var(--bone);
    font-size: 9px;
  }

  .fbadmin-order-price { text-align: right; }

  .fbadmin-order-link {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border: 1px solid var(--line);
  }

  .fbadmin-bottom-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
    gap: 22px;
  }

  .fbadmin-status-list { padding: 24px; }
  .fbadmin-status + .fbadmin-status { margin-top: 20px; }

  .fbadmin-status > div:first-child {
    display: flex;
    justify-content: space-between;
    gap: 15px;
    margin-bottom: 9px;
    font-size: 11px;
  }

  .fbadmin-status strong { font-weight: 500; }
  .fbadmin-status strong > span { color: var(--muted); font-size: 10px; }

  .fbadmin-progress { height: 5px; background: var(--bone); }
  .fbadmin-progress > span { display: block; height: 100%; background: var(--ink); }

  .fbadmin-status:nth-child(even) .fbadmin-progress > span {
    background: var(--brass);
  }

  .fbadmin-product {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    border-bottom: 1px solid var(--line);
  }

  .fbadmin-product:last-child { border-bottom: 0; }
  .fbadmin-product > div:nth-child(2) { min-width: 0; flex: 1; }

  .fbadmin-product-image {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 62px;
    height: 70px;
    background: var(--bone);
    color: var(--brass);
    font-size: 12px;
  }

  .fbadmin-product-image img {
    width: 100%;
    height: 100%;
    padding: 6px;
    object-fit: contain;
  }

  .fbadmin-product h3 {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .fbadmin-product p { margin: 4px 0; color: var(--muted); font-size: 9px; }
  .fbadmin-product > div > span { color: var(--muted); font-size: 9px; }
  .fbadmin-product > strong { font-size: 11px; font-weight: 500; }

  .fbadmin-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    padding-top: 25px;
    margin-top: 25px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 10px;
  }

  .fbadmin-footer > div { display: flex; gap: 20px; }
  .fbadmin-footer a { display: inline-flex; align-items: center; min-height: 44px; }

  .fbadmin-error {
    margin-top: 22px;
    padding: 16px 20px;
    border: 1px solid #dfbdb5;
    background: #fbefec;
    color: #a13832;
    font-size: 12px;
  }

  .fbadmin-error p { margin: 8px 0 0; font-size: 11px; }

  .fbadmin-state {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    min-height: 350px;
    padding: 30px;
    text-align: center;
    color: var(--muted);
    font-size: 13px;
  }

  .fbadmin-empty {
    padding: 38px 24px;
    margin: 0;
    color: var(--muted);
    font-size: 12px;
    text-align: center;
  }

  .fbadmin-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
  }

  .fbadmin-spin { animation: fbadminSpin 1s linear infinite; }

  @keyframes fbadminSpin { to { transform: rotate(360deg); } }

  @media (max-width: 1050px) {
    .fbadmin-heading { align-items: flex-start; flex-direction: column; }
    .fbadmin-overview { grid-template-columns: minmax(0, 1fr); }
    .fbadmin-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .fbadmin-stat { align-items: flex-start; gap: 12px; padding: 18px; }
    .fbadmin-stat > svg:last-child { display: none; }
    .fbadmin-bottom-grid { grid-template-columns: minmax(0, 1fr); }
  }

  @media (max-width: 720px) {
    .fbadmin-stats { grid-template-columns: minmax(0, 1fr); }
    .fbadmin-stat > svg:last-child { display: block; }
    .fbadmin-stat { align-items: center; }
    .fbadmin-value-panel { padding: 24px; }
    .fbadmin-section-heading { padding: 20px; flex-wrap: wrap; gap: 12px; }
    .fbadmin-period-total { text-align: left; }
    .fbadmin-order { grid-template-columns: minmax(0, 1fr) auto; gap: 12px; padding: 20px; }
    .fbadmin-order-id { grid-column: 1; }
    .fbadmin-order-customer { grid-column: 1; grid-row: 2; }
    .fbadmin-badge { grid-column: 2; grid-row: 1; }
    .fbadmin-order-price { grid-column: 1; grid-row: 3; text-align: left; }
    .fbadmin-order-link { grid-column: 2; grid-row: 3; justify-self: end; }
    .fbadmin-product { padding: 18px 20px; gap: 12px; flex-wrap: wrap; }
    .fbadmin-status-list { padding: 20px; }
  }

  @media (max-width: 380px) {
    .fbadmin-actions { width: 100%; flex-wrap: wrap; }
    .fbadmin-actions > * { flex: 1; }
    .fbadmin-value-bottom { grid-template-columns: minmax(0, 1fr); gap: 18px; }
    .fbadmin-value-panel h2 { font-size: 34px; }
    .fbadmin-product > strong { margin-left: 74px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbadmin *, .fbadmin *::before, .fbadmin *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Dashboard;