import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowUpRight,
  ImageOff,
  Loader2,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { API_BASE_URL } from "../../config";
import { BUSINESS_INFO } from "../../storeInfo";

const apiBase = String(API_BASE_URL || "").replace(/\/+$/, "");
const API_URL = `${apiBase}/api/orders`;

const STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getId = (order) => String(order?._id || order?.id || "");

const numeric = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numeric(value));

const timestamp = (value) => {
  const parsed = new Date(value || 0).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDate = (value) =>
  value && timestamp(value)
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "—";

const customerName = (order) => {
  const address = order.shippingAddress || {};
  const name = `${address.firstName || ""} ${address.lastName || ""}`.trim();

  return name || order.user?.name || "Guest";
};

const customerEmail = (order) =>
  order.shippingAddress?.email || order.user?.email || "";

const shippingAddress = (order) => {
  const address = order.shippingAddress || {};

  return [
    address.address,
    address.apartment,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
};

const orderItems = (order) =>
  Array.isArray(order?.items)
    ? order.items.filter((item) => item && typeof item === "object")
    : [];

const itemCount = (order) =>
  orderItems(order).reduce(
    (sum, item) => sum + Math.max(0, numeric(item.quantity)),
    0
  );

const orderStatus = (order) => {
  const raw = String(order.status || "").trim();

  if (raw.toLowerCase() === "canceled") return "Cancelled";

  return (
    STATUSES.find((status) => status.toLowerCase() === raw.toLowerCase()) ||
    raw ||
    "Unknown"
  );
};

const authHeaders = () => {
  let token;

  try {
    token = localStorage.getItem("fablebelle-token");
  } catch {
    throw new Error("Unable to access your login. Please sign in again.");
  }

  if (!token?.trim()) {
    throw new Error("Please sign in with an admin account.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

const ItemImage = ({ image }) => {
  const value = typeof image === "string" ? image.trim() : "";
  const src = value
    ? /^https?:\/\//i.test(value)
      ? value
      : `${apiBase}/${value.replace(/^\/+/, "")}`
    : "";

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="fborders-item-image">
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageOff size={20} aria-hidden="true" />
      )}
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedId, setSelectedId] = useState("");
  const [draftStatus, setDraftStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [notice, setNotice] = useState("");

  const detailRef = useRef(null);
  const mountedRef = useRef(true);
  const mutationRef = useRef(null);
  const mutationLock = useRef(false);
  const selectionRef = useRef("");

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      mutationRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchOrders = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(API_URL, {
          headers: authHeaders(),
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to load orders.");
        }

        if (!Array.isArray(data.orders)) {
          throw new Error("The orders response is incomplete.");
        }

        if (active) {
          setOrders(
            data.orders.filter(
              (order) => order && typeof order === "object" && getId(order)
            )
          );
          setLoaded(true);
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setFetchError(error.message || "Unable to load orders.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchOrders();

    return () => {
      active = false;
      controller.abort();
    };
  }, [refreshCount]);

  const selectedOrder = orders.find((order) => getId(order) === selectedId);

  const selectedStatus = selectedOrder ? orderStatus(selectedOrder) : "";

  useEffect(() => {
    setDraftStatus(selectedStatus);
  }, [selectedId, selectedStatus]);

  const filteredOrders = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const result = orders.filter((order) => {
      const searchable = [
        order.orderNumber,
        customerName(order),
        customerEmail(order),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (statusFilter === "All" || orderStatus(order) === statusFilter)
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "Highest") {
        return numeric(b.totalAmount) - numeric(a.totalAmount);
      }

      if (sortBy === "Lowest") {
        return numeric(a.totalAmount) - numeric(b.totalAmount);
      }

      if (sortBy === "Items") return itemCount(b) - itemCount(a);

      return timestamp(b.createdAt) - timestamp(a.createdAt);
    });
  }, [orders, searchTerm, statusFilter, sortBy]);

  const summary = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((order) => orderStatus(order) === "Pending").length,
      processing: orders.filter(
        (order) => orderStatus(order) === "Processing"
      ).length,
      delivered: orders.filter(
        (order) => orderStatus(order) === "Delivered"
      ).length,
      value: orders
        .filter((order) => orderStatus(order) !== "Cancelled")
        .reduce((sum, order) => sum + numeric(order.totalAmount), 0),
    }),
    [orders]
  );

  const openOrder = (order) => {
    const orderId = getId(order);

    selectionRef.current = orderId;
    setSelectedId(orderId);
    setDraftStatus(orderStatus(order));
    setUpdateError("");
    setNotice("");

    requestAnimationFrame(() => {
      detailRef.current?.focus();

      if (window.matchMedia("(max-width: 1000px)").matches) {
        detailRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      }
    });
  };

  const closeOrder = () => {
    selectionRef.current = "";
    setSelectedId("");
    setUpdateError("");
    setNotice("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSortBy("Newest");
  };

  const handleStatusUpdate = async (event) => {
    event.preventDefault();

    if (
      mutationLock.current ||
      loading ||
      !selectedOrder ||
      !STATUSES.includes(draftStatus) ||
      draftStatus === selectedStatus
    ) {
      return;
    }

    const orderId = getId(selectedOrder);
    const controller = new AbortController();

    mutationRef.current = controller;
    mutationLock.current = true;
    setUpdating(true);
    setUpdateError("");
    setNotice("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(orderId)}/status`,
        {
          method: "PUT",
          headers: authHeaders(),
          signal: controller.signal,
          body: JSON.stringify({ status: draftStatus }),
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to update order status.");
      }

      if (!data.order || getId(data.order) !== orderId) {
        throw new Error(
          "The update response is incomplete. Refresh to check the current status."
        );
      }

      if (!mountedRef.current) return;

      setOrders((current) =>
        current.map((order) =>
          getId(order) === orderId ? data.order : order
        )
      );

      if (selectionRef.current === orderId) {
        setNotice("Order status updated successfully.");
      }
    } catch (error) {
      if (
        mountedRef.current &&
        error.name !== "AbortError" &&
        selectionRef.current === orderId
      ) {
        setUpdateError(error.message || "Unable to update order status.");
      }
    } finally {
      mutationLock.current = false;

      if (mountedRef.current) setUpdating(false);

      if (mutationRef.current === controller) {
        mutationRef.current = null;
      }
    }
  };

  const stats = [
    ["Total orders", summary.total],
    ["Pending", summary.pending],
    ["Processing", summary.processing],
    ["Delivered", summary.delivered],
  ];

  const filterOptions = [
    "All",
    ...STATUSES,
    ...new Set(
      orders.map(orderStatus).filter((status) => !STATUSES.includes(status))
    ),
  ];

  return (
    <main className="fborders">
      <style>{styles}</style>

      <header className="fborders-heading">
        <div>
          <p className="fborders-eyebrow">
            {BUSINESS_INFO.businessName} / Admin
          </p>
          <h1>Order desk.</h1>
          <p>Review purchases and manage fulfillment from one place.</p>
        </div>

        <button
          type="button"
          className="fborders-refresh"
          onClick={() => setRefreshCount((count) => count + 1)}
          disabled={loading || updating}
        >
          <RefreshCw
            size={16}
            className={loading ? "fborders-spin" : ""}
            aria-hidden="true"
          />
          {loading ? "Loading…" : "Refresh orders"}
        </button>
      </header>

      {fetchError && (
        <div className="fborders-error" role="alert">
          {fetchError}
          {loaded && <p>The list shows the last successfully loaded data.</p>}
        </div>
      )}

      <section className="fborders-summary" aria-label="Order totals">
        {stats.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{loaded ? value.toLocaleString() : "—"}</strong>
          </div>
        ))}

        <div className="fborders-summary-value">
          <span>Non-cancelled order value</span>
          <strong>{loaded ? money(summary.value) : "—"}</strong>
        </div>
      </section>

      <div className="fborders-tools">
        <div className="fborders-search">
          <Search size={18} aria-hidden="true" />
          <label htmlFor="fborders-search" className="fborders-sr-only">
            Search by order number, customer or email
          </label>
          <input
            id="fborders-search"
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Order number, customer or email…"
          />
        </div>

        <div className="fborders-filter">
          <label htmlFor="fborders-status-filter">Status</label>
          <select
            id="fborders-status-filter"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            {filterOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="fborders-filter">
          <label htmlFor="fborders-sort">Sort by</label>
          <select
            id="fborders-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="Newest">Newest</option>
            <option value="Highest">Highest value</option>
            <option value="Lowest">Lowest value</option>
            <option value="Items">Most units</option>
          </select>
        </div>
      </div>

      <div className="fborders-results">
        <span role="status" aria-live="polite">
          {loading
            ? "Loading orders…"
            : loaded
            ? `${filteredOrders.length} of ${orders.length} orders`
            : "Orders unavailable"}
        </span>

        {(searchTerm || statusFilter !== "All" || sortBy !== "Newest") && (
          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="fborders-workspace">
        <section
          className="fborders-list"
          aria-label="Customer orders"
          aria-busy={loading}
        >
          {loading && !loaded ? (
            <div className="fborders-empty" role="status">
              <Loader2 size={28} className="fborders-spin" aria-hidden="true" />
              <p>Loading customer orders…</p>
            </div>
          ) : !loaded ? (
            <div className="fborders-empty">
              <p>Refresh to load your orders.</p>
            </div>
          ) : !filteredOrders.length ? (
            <div className="fborders-empty">
              <p>
                {orders.length ? "No matching orders." : "No orders yet."}
              </p>
              {orders.length > 0 && (
                <button type="button" onClick={clearFilters}>
                  View all orders
                </button>
              )}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const orderId = getId(order);

              return (
                <article
                  key={orderId}
                  className={`fborders-order ${
                    selectedId === orderId ? "is-selected" : ""
                  }`}
                >
                  <div className="fborders-order-top">
                    <strong>{order.orderNumber || "Order"}</strong>
                    <span className="fborders-badge">{orderStatus(order)}</span>
                  </div>

                  <h2>{customerName(order)}</h2>
                  <p>{customerEmail(order) || "Email not provided"}</p>

                  <div className="fborders-order-bottom">
                    <div>
                      <strong>{money(order.totalAmount)}</strong>
                      <span>
                        {itemCount(order)} units · {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => openOrder(order)}
                      aria-label={`View ${order.orderNumber || "order"} details`}
                      aria-pressed={selectedId === orderId}
                    >
                      Details
                      <ArrowUpRight size={17} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <section
          ref={detailRef}
          className="fborders-detail"
          tabIndex={-1}
          aria-labelledby="fborders-detail-title"
        >
          <div className="fborders-detail-heading">
            <div>
              <p className="fborders-eyebrow">Order details</p>
              <h2 id="fborders-detail-title">
                {selectedOrder?.orderNumber || "Review an order"}
              </h2>
            </div>

            {selectedId && (
              <button
                type="button"
                onClick={closeOrder}
                aria-label="Close order details"
              >
                <X size={19} aria-hidden="true" />
              </button>
            )}
          </div>

          {!selectedOrder ? (
            <div className="fborders-empty">
              <p>
                {selectedId
                  ? "This order is no longer in the loaded list."
                  : "Select Details on an order to review its items and shipping information."}
              </p>
            </div>
          ) : (
            <div className="fborders-detail-body">
              <div className="fborders-detail-meta">
                <span>{formatDate(selectedOrder.createdAt)}</span>
                <span className="fborders-badge">{selectedStatus}</span>
              </div>

              <form onSubmit={handleStatusUpdate} className="fborders-update">
                <label htmlFor="fborders-update-status">Fulfillment status</label>

                <div>
                  <select
                    id="fborders-update-status"
                    value={draftStatus}
                    onChange={(event) => setDraftStatus(event.target.value)}
                    disabled={updating || loading}
                  >
                    {!STATUSES.includes(selectedStatus) && (
                      <option value={selectedStatus}>{selectedStatus}</option>
                    )}
                    {STATUSES.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={
                      updating ||
                      loading ||
                      draftStatus === selectedStatus ||
                      !STATUSES.includes(draftStatus)
                    }
                  >
                    {updating ? "Saving…" : "Save status"}
                  </button>
                </div>

                {updateError && (
                  <p className="fborders-update-error" role="alert">
                    {updateError}
                  </p>
                )}

                <p className="fborders-notice" role="status" aria-live="polite">
                  {notice}
                </p>
              </form>

              <div className="fborders-detail-section">
                <h3>Customer</h3>
                <p>{customerName(selectedOrder)}</p>
                {customerEmail(selectedOrder) && (
                  <p>{customerEmail(selectedOrder)}</p>
                )}
                {selectedOrder.shippingAddress?.phone && (
                  <p>{selectedOrder.shippingAddress.phone}</p>
                )}
              </div>

              <div className="fborders-detail-section">
                <h3>Shipping address</h3>
                <p>{shippingAddress(selectedOrder) || "Not provided"}</p>
              </div>

              <div className="fborders-detail-section">
                <h3>Ordered items</h3>

                {!orderItems(selectedOrder).length ? (
                  <p>No item details provided.</p>
                ) : (
                  orderItems(selectedOrder).map((item, index) => (
                    <div className="fborders-item" key={index}>
                      <ItemImage
                        image={
                          item.image ||
                          item.product?.images?.[0] ||
                          item.product?.image
                        }
                      />
                      <div>
                        <h4>{item.name || item.product?.name || "Product"}</h4>
                        <p>
                          {numeric(item.quantity)} × {money(item.price)}
                        </p>
                      </div>
                      <strong>
                        {money(numeric(item.price) * numeric(item.quantity))}
                      </strong>
                    </div>
                  ))
                )}
              </div>

              <div className="fborders-total">
                <span>Order total</span>
                <strong>{money(selectedOrder.totalAmount)}</strong>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

const styles = `
  .fborders {
    --ink: #173f36;
    --deep: #102e28;
    --paper: #fffdf5;
    --bone: #f5f0e6;
    --brass: #a56e4f;
    --muted: #626e67;
    --line: rgba(23,63,54,.17);
    min-width: 0;
    padding: clamp(18px,3vw,36px);
    background: var(--bone);
    color: var(--ink);
    font-family: 'Onest', ui-sans-serif, system-ui, sans-serif;
    line-height: 1.6;
  }

  .fborders *, .fborders *::before, .fborders *::after {
    box-sizing: border-box;
  }

  .fborders button, .fborders input, .fborders select { font: inherit; }
  .fborders button { cursor: pointer; }
  .fborders button:disabled { opacity: .5; cursor: not-allowed; }

  .fborders button:focus-visible,
  .fborders input:focus-visible,
  .fborders select:focus-visible,
  .fborders-detail:focus-visible {
    outline: 2px solid var(--brass);
    outline-offset: 4px;
  }

  .fborders-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 25px;
    padding-bottom: 25px;
    border-bottom: 1px solid var(--line);
  }

  .fborders-eyebrow {
    margin: 0;
    color: var(--brass);
    font-size: 9px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
  }

  .fborders-heading h1 {
    margin: 10px 0 8px;
    font-size: clamp(32px,4vw,44px);
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -.05em;
  }

  .fborders-heading > div > p:last-child {
    margin: 0;
    color: var(--muted);
    font-size: 12px;
  }

  .fborders-refresh {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
    min-height: 46px;
    padding: 12px 17px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 11px;
  }

  .fborders-summary {
    display: grid;
    grid-template-columns: repeat(4,minmax(0,1fr)) minmax(0,1.5fr);
    margin-block: 25px;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fborders-summary > div {
    min-width: 0;
    padding: 22px;
    border-right: 1px solid var(--line);
  }

  .fborders-summary > div:last-child { border-right: 0; }

  .fborders-summary span {
    display: block;
    color: var(--muted);
    font-size: 10px;
  }

  .fborders-summary strong {
    display: block;
    margin-top: 8px;
    font-size: 27px;
    font-weight: 500;
    line-height: 1.2;
    letter-spacing: -.035em;
    overflow-wrap: anywhere;
  }

  .fborders-summary-value { background: #e9eddf; }

  .fborders-tools {
    display: grid;
    grid-template-columns: minmax(0,2fr) minmax(0,1fr) minmax(0,1fr);
    gap: 12px;
  }

  .fborders-search {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    padding-inline: 15px;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fborders-search > svg { flex-shrink: 0; }

  .fborders-search input {
    width: 100%;
    min-width: 0;
    min-height: 56px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fborders-search input::placeholder { font-size: 11px; color: var(--muted); }

  .fborders-filter {
    display: flex;
    flex-direction: column;
    min-width: 0;
    padding: 7px 14px;
    border: 1px solid var(--line);
    background: var(--paper);
  }

  .fborders-filter label { color: var(--muted); font-size: 9px; }

  .fborders-filter select {
    width: 100%;
    min-width: 0;
    min-height: 32px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 16px;
  }

  .fborders-results {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    min-height: 60px;
    color: var(--muted);
    font-size: 10px;
  }

  .fborders-results button {
    min-height: 44px;
    border: 0;
    background: transparent;
    color: var(--ink);
    font-size: 10px;
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .fborders-workspace {
    display: grid;
    grid-template-columns: minmax(0,1.15fr) minmax(0,1fr);
    align-items: start;
    gap: 22px;
    animation: fbordersEnter .4s ease both;
  }

  .fborders-list { min-width: 0; }

  .fborders-order {
    padding: 22px;
    margin-bottom: 12px;
    border: 1px solid var(--line);
    background: var(--paper);
    transition: border-color .2s ease;
  }

  .fborders-order.is-selected {
    border-color: var(--ink);
    box-shadow: inset 3px 0 0 var(--ink);
  }

  .fborders-order-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 12px;
  }

  .fborders-order-top > strong {
    font-size: 11px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fborders-badge {
    padding: 5px 9px;
    background: var(--bone);
    font-size: 9px;
  }

  .fborders-order h2 {
    margin: 18px 0 5px;
    font-size: 20px;
    font-weight: 500;
    letter-spacing: -.035em;
    overflow-wrap: anywhere;
  }

  .fborders-order > p {
    margin: 0;
    color: var(--muted);
    font-size: 11px;
    overflow-wrap: anywhere;
  }

  .fborders-order-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 18px;
    padding-top: 18px;
    margin-top: 20px;
    border-top: 1px solid var(--line);
  }

  .fborders-order-bottom strong {
    display: block;
    font-size: 18px;
    font-weight: 500;
  }

  .fborders-order-bottom span {
    display: block;
    margin-top: 4px;
    color: var(--muted);
    font-size: 9px;
  }

  .fborders-order-bottom button {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: 12px;
    min-height: 44px;
    padding: 10px 14px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
    font-size: 11px;
  }

  .fborders-order-bottom button:hover { border-color: var(--ink); }

  .fborders-detail {
    min-width: 0;
    border: 1px solid var(--line);
    background: var(--paper);
    scroll-margin-top: 25px;
  }

  .fborders-detail-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    padding: 24px;
    border-bottom: 1px solid var(--line);
  }

  .fborders-detail-heading h2 {
    margin: 9px 0 0;
    font-size: 24px;
    font-weight: 500;
    letter-spacing: -.04em;
    overflow-wrap: anywhere;
  }

  .fborders-detail-heading button {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border: 1px solid var(--line);
    background: transparent;
    color: var(--ink);
  }

  .fborders-detail-body { padding: 24px; }

  .fborders-detail-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    color: var(--muted);
    font-size: 10px;
  }

  .fborders-update {
    padding: 18px;
    margin-top: 22px;
    background: var(--bone);
    border: 1px solid var(--line);
  }

  .fborders-update > label {
    display: block;
    margin-bottom: 10px;
    font-size: 11px;
    font-weight: 500;
  }

  .fborders-update > div {
    display: flex;
    gap: 10px;
  }

  .fborders-update select {
    flex: 1;
    min-width: 0;
    min-height: 46px;
    padding: 10px;
    border: 1px solid var(--line);
    background: var(--paper);
    color: var(--ink);
    font-size: 16px;
  }

  .fborders-update button {
    min-height: 46px;
    padding: 12px 14px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 10px;
  }

  .fborders-update-error,
  .fborders-notice {
    margin: 12px 0 0;
    font-size: 11px;
    line-height: 1.8;
  }

  .fborders-update-error { color: #a13832; }
  .fborders-notice:empty { margin: 0; }

  .fborders-detail-section {
    padding-block: 23px;
    border-bottom: 1px solid var(--line);
  }

  .fborders-detail-section h3 {
    margin: 0 0 13px;
    font-size: 12px;
    font-weight: 600;
  }

  .fborders-detail-section > p {
    margin: 5px 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.85;
    overflow-wrap: anywhere;
  }

  .fborders-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-block: 12px;
  }

  .fborders-item-image {
    display: grid;
    place-items: center;
    flex-shrink: 0;
    width: 54px;
    height: 62px;
    background: var(--bone);
    color: var(--muted);
  }

  .fborders-item-image img {
    width: 100%;
    height: 100%;
    padding: 5px;
    object-fit: contain;
  }

  .fborders-item > div:nth-child(2) {
    flex: 1;
    min-width: 0;
  }

  .fborders-item h4 {
    margin: 0;
    font-size: 11px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fborders-item p {
    margin: 5px 0 0;
    color: var(--muted);
    font-size: 10px;
  }

  .fborders-item > strong {
    font-size: 11px;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fborders-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    padding-top: 23px;
    font-size: 12px;
  }

  .fborders-total strong { font-size: 23px; font-weight: 500; }

  .fborders-error {
    margin-top: 20px;
    padding: 16px 20px;
    border: 1px solid #dfbdb5;
    background: #fbefec;
    color: #a13832;
    font-size: 12px;
  }

  .fborders-error p { margin: 8px 0 0; font-size: 11px; }

  .fborders-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    min-height: 250px;
    padding: 30px;
    color: var(--muted);
    text-align: center;
    font-size: 12px;
  }

  .fborders-empty button {
    min-height: 44px;
    padding: 10px 16px;
    border: 1px solid var(--ink);
    background: var(--ink);
    color: #fff;
    font-size: 11px;
  }

  .fborders-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
  }

  .fborders-spin { animation: fbordersSpin 1s linear infinite; }

  @keyframes fbordersSpin { to { transform: rotate(360deg); } }

  @keyframes fbordersEnter {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1100px) {
    .fborders-summary { grid-template-columns: repeat(4,minmax(0,1fr)); }
    .fborders-summary-value { grid-column: 1 / -1; border-top: 1px solid var(--line); }
  }

  @media (max-width: 1000px) {
    .fborders-workspace { grid-template-columns: minmax(0,1fr); }
    .fborders-list { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
    .fborders-order { margin: 0; }
    .fborders-list > .fborders-empty { grid-column: 1 / -1; }
  }

  @media (max-width: 720px) {
    .fborders-heading { align-items: flex-start; flex-direction: column; }
    .fborders-summary { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .fborders-summary > div { padding: 18px; }
    .fborders-summary > div:nth-child(2) { border-right: 0; }
    .fborders-summary > div:nth-child(3),
    .fborders-summary > div:nth-child(4) { border-top: 1px solid var(--line); }
    .fborders-summary > div:nth-child(4) { border-right: 0; }
    .fborders-tools { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .fborders-search { grid-column: 1 / -1; }
    .fborders-list { grid-template-columns: minmax(0,1fr); }
    .fborders-detail-heading, .fborders-detail-body { padding: 20px; }
  }

  @media (max-width: 380px) {
    .fborders-order { padding: 18px; }
    .fborders-order-bottom { gap: 10px; flex-wrap: wrap; }
    .fborders-update > div { flex-direction: column; }
    .fborders-item { flex-wrap: wrap; }
    .fborders-item > strong { margin-left: 66px; }
    .fborders-summary strong { font-size: 24px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fborders *, .fborders *::before, .fborders *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`;

export default Orders;