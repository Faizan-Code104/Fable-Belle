import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Users as UsersIcon,
} from "lucide-react";

import { API_BASE_URL } from "../../config";
import storeInfo from "../../storeInfo";

const USERS_API_URL = `${API_BASE_URL}/api/users`;
const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;

const getId = (value) => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return String(value?._id || value?.id || "");
};

const getText = (value, fallback = "") =>
  typeof value === "string" ? value : fallback;

const getAmount = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount : 0;
};

const getTimestamp = (value) => {
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isFinite(timestamp) ? timestamp : 0;
};

const formatDate = (value) => {
  if (!getTimestamp(value)) return "—";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(getAmount(value));

const isCancelled = (order) =>
  ["cancelled", "canceled"].includes(
    getText(order?.status).trim().toLowerCase()
  );

const getRole = (user) => {
  const role = getText(user?.role).trim().toLowerCase();

  if (role === "admin") return "Admin";
  if (!role || role === "user" || role === "customer") return "Customer";

  return role.charAt(0).toUpperCase() + role.slice(1);
};

const getInitials = (name) =>
  getText(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "?";

const styles = `
  .fbusers {
    --forest: #173f36;
    --deep: #102e28;
    --pistachio: #d7e5a5;
    --bone: #f5f0e6;
    --paper: #fffdf5;
    --brass: #a56e4f;
    --muted: #68776f;
    --line: #dde1d5;
    min-height: 100vh;
    padding: 36px 24px 64px;
    background: var(--bone);
    color: var(--deep);
    font-family: "Onest", Arial, sans-serif;
  }

  .fbusers *, .fbusers *::before, .fbusers *::after {
    box-sizing: border-box;
  }

  .fbusers button, .fbusers input, .fbusers select {
    font: inherit;
  }

  .fbusers button { cursor: pointer; }
  .fbusers button:disabled { cursor: wait; opacity: .55; }
  .fbusers button, .fbusers a, .fbusers input, .fbusers select {
    -webkit-tap-highlight-color: transparent;
  }

  .fbusers :focus-visible {
    outline: 3px solid var(--brass);
    outline-offset: 4px;
  }

  .fbusers-shell { max-width: 1440px; margin: auto; }
  .fbusers-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    gap: 24px;
    margin-bottom: 28px;
  }

  .fbusers-eyebrow {
    margin: 0 0 12px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--brass);
  }

  .fbusers h1 {
    margin: 0;
    font-size: clamp(32px, 4vw, 52px);
    line-height: 1.08;
    letter-spacing: -.055em;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .fbusers-subtitle {
    margin: 13px 0 0;
    max-width: 530px;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.7;
  }

  .fbusers-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    min-height: 44px;
    padding: 12px 18px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
    color: var(--forest);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    transition: background .2s, transform .2s;
  }

  .fbusers-button:hover:not(:disabled) {
    background: var(--pistachio);
    transform: translateY(-2px);
  }

  .fbusers-overview {
    display: grid;
    grid-template-columns: 1.3fr repeat(3, 1fr);
    padding: 26px 12px;
    margin-bottom: 28px;
    border-radius: 16px;
    background: var(--forest);
    color: var(--paper);
  }

  .fbusers-stat {
    min-width: 0;
    padding: 0 24px;
    border-right: 1px solid #ffffff24;
  }

  .fbusers-stat:last-child { border: 0; }
  .fbusers-stat small {
    display: block;
    color: #e0e7d2;
    font-size: 11px;
    line-height: 1.5;
  }

  .fbusers-stat strong {
    display: block;
    margin-top: 9px;
    font-size: clamp(22px, 2.5vw, 32px);
    letter-spacing: -.04em;
    font-weight: 500;
    overflow-wrap: anywhere;
  }

  .fbusers-stat:first-child strong { color: var(--pistachio); }
  .fbusers-controls {
    display: grid;
    grid-template-columns: minmax(220px, 1fr) auto;
    gap: 16px;
    align-items: center;
  }

  .fbusers-search { position: relative; }
  .fbusers-search svg {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
  }

  .fbusers-search input, .fbusers-sort select {
    width: 100%;
    min-height: 48px;
    border: 1px solid var(--line);
    border-radius: 10px;
    background: var(--paper);
    color: var(--deep);
    font-size: 13px;
  }

  .fbusers-search input { padding: 13px 16px 13px 45px; }
  .fbusers-sort {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 12px;
  }

  .fbusers-sort select { padding: 12px; width: 190px; }
  .fbusers-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 20px 0;
  }

  .fbusers-tab {
    min-height: 42px;
    padding: 9px 16px;
    border: 1px solid var(--line);
    border-radius: 30px;
    background: transparent;
    color: var(--muted);
    font-size: 12px;
    transition: background .2s, color .2s;
  }

  .fbusers-tab[aria-pressed="true"] {
    color: var(--paper);
    background: var(--forest);
    border-color: var(--forest);
  }

  .fbusers-results {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin: 0 0 18px;
    color: var(--muted);
    font-size: 12px;
  }

  .fbusers-reset {
    border: 0;
    padding: 8px 0;
    background: transparent;
    color: var(--forest);
    text-decoration: underline;
    text-underline-offset: 4px;
  }

  .fbusers-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
  }

  .fbusers-card {
    min-width: 0;
    padding: 24px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--paper);
    animation: fbusers-enter .35s ease both;
    transition: transform .2s, box-shadow .2s;
  }

  .fbusers-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 30px #102e280a;
  }

  .fbusers-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .fbusers-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 54px;
    height: 54px;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--bone);
    color: var(--forest);
    font-size: 17px;
    font-weight: 600;
  }

  .fbusers-role {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 10px;
    border-radius: 30px;
    background: var(--bone);
    color: var(--forest);
    font-size: 10px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .fbusers-role-admin { background: var(--pistachio); }
  .fbusers-card h2 {
    margin: 20px 0 6px;
    font-size: 19px;
    letter-spacing: -.03em;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .fbusers-email {
    margin: 0;
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .fbusers-card-metrics {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 15px;
    margin: 22px 0;
    padding: 18px 0;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }

  .fbusers-card-metrics small, .fbusers-field dt {
    display: block;
    color: var(--muted);
    font-size: 10px;
    line-height: 1.5;
  }

  .fbusers-card-metrics strong {
    display: block;
    margin-top: 6px;
    font-size: 18px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .fbusers-card-footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }

  .fbusers-card-footer span { color: var(--muted); font-size: 10px; }
  .fbusers-open {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 8px 0 8px 8px;
    border: 0;
    background: transparent;
    color: var(--forest);
    font-size: 12px;
    font-weight: 600;
  }

  .fbusers-alert {
    margin-bottom: 22px;
    padding: 16px 18px;
    border: 1px solid #d7b8a6;
    border-radius: 10px;
    background: #fff4ec;
    color: #7c3e23;
    font-size: 13px;
    line-height: 1.6;
  }

  .fbusers-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 260px;
    padding: 35px 20px;
    text-align: center;
    border: 1px dashed var(--line);
    border-radius: 16px;
    background: var(--paper);
    color: var(--muted);
  }

  .fbusers-empty h2 { color: var(--deep); font-size: 20px; }
  .fbusers-empty p { font-size: 13px; line-height: 1.7; }
  .fbusers-back { margin-bottom: 24px; }
  .fbusers-profile {
    display: grid;
    grid-template-columns: minmax(250px, .85fr) minmax(0, 1.7fr);
    gap: 24px;
    align-items: start;
    animation: fbusers-enter .3s ease both;
  }

  .fbusers-identity {
    padding: 30px;
    border-radius: 16px;
    background: var(--forest);
    color: var(--paper);
  }

  .fbusers-identity .fbusers-avatar {
    width: 78px;
    height: 78px;
    font-size: 26px;
    background: var(--pistachio);
  }

  .fbusers-identity h2 {
    margin: 24px 0 8px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 500;
    letter-spacing: -.04em;
    overflow-wrap: anywhere;
  }

  .fbusers-identity .fbusers-email { color: #e0e7d2; }
  .fbusers-identity .fbusers-role { margin-top: 18px; }
  .fbusers-fields { margin: 30px 0 0; }
  .fbusers-field { padding: 17px 0; border-top: 1px solid #ffffff24; }
  .fbusers-field dt { color: #d0dccf; }
  .fbusers-field dd {
    margin: 7px 0 0;
    font-size: 13px;
    line-height: 1.6;
    overflow-wrap: anywhere;
  }

  .fbusers-field dt {
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .fbusers-panel {
    min-width: 0;
    padding: 28px;
    border: 1px solid var(--line);
    border-radius: 16px;
    background: var(--paper);
  }

  .fbusers-panel h2 {
    margin: 0;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: -.03em;
  }

  .fbusers-activity {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    padding-bottom: 25px;
    margin-bottom: 26px;
    border-bottom: 1px solid var(--line);
  }

  .fbusers-activity small { color: var(--muted); font-size: 11px; }
  .fbusers-activity strong {
    display: block;
    margin-top: 9px;
    font-size: clamp(24px, 3vw, 34px);
    font-weight: 500;
    letter-spacing: -.04em;
    overflow-wrap: anywhere;
  }

  .fbusers-note { color: var(--muted); font-size: 11px; line-height: 1.7; }
  .fbusers-history { margin-top: 20px; }
  .fbusers-order {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 16px;
    padding: 18px 0;
    border-top: 1px solid var(--line);
  }

  .fbusers-order strong {
    display: block;
    font-size: 13px;
    font-weight: 600;
    overflow-wrap: anywhere;
  }

  .fbusers-order small {
    display: block;
    margin-top: 7px;
    color: var(--muted);
    font-size: 11px;
  }

  .fbusers-order-value { text-align: right; }
  .fbusers-spin { animation: fbusers-spin 1s linear infinite; }
  @keyframes fbusers-spin { to { transform: rotate(360deg); } }
  @keyframes fbusers-enter {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 1100px) {
    .fbusers-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .fbusers-stat { padding: 0 16px; }
  }

  @media (max-width: 760px) {
    .fbusers { padding: 24px 16px 44px; }
    .fbusers-header { align-items: flex-start; }
    .fbusers-overview {
      grid-template-columns: 1fr 1fr;
      padding: 8px 18px;
    }
    .fbusers-stat { padding: 18px 12px; }
    .fbusers-stat:nth-child(2) { border-right: 0; }
    .fbusers-stat:nth-child(-n+2) { border-bottom: 1px solid #ffffff24; }
    .fbusers-controls { grid-template-columns: 1fr; }
    .fbusers-sort { justify-content: space-between; }
    .fbusers-sort select { width: min(75%, 260px); }
    .fbusers-profile { grid-template-columns: 1fr; }
    .fbusers-identity, .fbusers-panel { padding: 24px; }
  }

  @media (max-width: 480px) {
    .fbusers-header { flex-direction: column; gap: 18px; }
    .fbusers-grid { grid-template-columns: 1fr; }
    .fbusers-card { padding: 22px; }
    .fbusers-overview { padding: 6px; }
    .fbusers-stat { padding: 17px 12px; }
    .fbusers-activity { gap: 12px; }
    .fbusers-identity, .fbusers-panel { padding: 20px; }
    .fbusers-results { align-items: flex-start; }
  }

  @media (prefers-reduced-motion: reduce) {
    .fbusers *, .fbusers *::before, .fbusers *::after {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshCount, setRefreshCount] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedId, setSelectedId] = useState("");

  const profileHeadingRef = useRef(null);
  const directoryHeadingRef = useRef(null);
  const previousSelectionRef = useRef("");

  const brandName = storeInfo.businessName;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchData = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const token = localStorage.getItem("fablebelle-token");

        if (!token) {
          throw new Error("Please sign in with your admin account.");
        }

        const headers = { Authorization: `Bearer ${token}` };

        const fetchCollection = async (url, field, label) => {
          const response = await fetch(url, {
            headers,
            signal: controller.signal,
          });

          const data = await response.json().catch(() => null);

          if (!response.ok) {
            throw new Error(
              data?.message || `Unable to load ${label}. Please try again.`
            );
          }

          if (!Array.isArray(data?.[field])) {
            throw new Error(`The ${label} response is invalid.`);
          }

          return data[field].filter(
            (item) =>
              item && typeof item === "object" && !Array.isArray(item)
          );
        };

        const results = await Promise.allSettled([
          fetchCollection(USERS_API_URL, "users", "users"),
          fetchCollection(ORDERS_API_URL, "orders", "orders"),
        ]);

        if (!active) return;

        const failure = results.find((result) => result.status === "rejected");

        if (failure) throw failure.reason;

        setUsers(results[0].value.filter((user) => getId(user)));
        setOrders(results[1].value);
        setHasLoaded(true);
      } catch (error) {
        if (active && error?.name !== "AbortError") {
          setErrorMessage(error?.message || "Unable to load account activity.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [refreshCount]);

  const userDirectory = useMemo(() => {
    const activity = new Map();

    orders.forEach((order) => {
      const userId = getId(order.user);
      if (!userId) return;

      if (!activity.has(userId)) activity.set(userId, []);
      activity.get(userId).push(order);
    });

    return users.map((user) => {
      const userOrders = [...(activity.get(getId(user)) || [])].sort(
        (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
      );

      return {
        ...user,
        accountId: getId(user),
        roleLabel: getRole(user),
        userOrders,
        orderCount: userOrders.length,
        orderValue: userOrders.reduce(
          (total, order) =>
            total + (isCancelled(order) ? 0 : getAmount(order.totalAmount)),
          0
        ),
      };
    });
  }, [users, orders]);

  const roleOptions = useMemo(
    () => [
      "All",
      "Customer",
      "Admin",
      ...Array.from(new Set(userDirectory.map((user) => user.roleLabel))).filter(
        (role) => role !== "Customer" && role !== "Admin"
      ),
    ],
    [userDirectory]
  );

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    const result = userDirectory.filter((user) => {
      const matchesSearch =
        !search ||
        getText(user.name).toLowerCase().includes(search) ||
        getText(user.email).toLowerCase().includes(search);

      return (
        matchesSearch &&
        (roleFilter === "All" || user.roleLabel === roleFilter)
      );
    });

    result.sort((a, b) => {
      if (sortBy === "Highest Value") return b.orderValue - a.orderValue;
      if (sortBy === "Most Orders") return b.orderCount - a.orderCount;
      if (sortBy === "A-Z") {
        return getText(a.name).localeCompare(getText(b.name));
      }

      return getTimestamp(b.createdAt) - getTimestamp(a.createdAt);
    });

    return result;
  }, [userDirectory, searchTerm, roleFilter, sortBy]);

  const selectedUser = useMemo(
    () => userDirectory.find((user) => user.accountId === selectedId),
    [userDirectory, selectedId]
  );

  useEffect(() => {
    if (hasLoaded && selectedId && !selectedUser) setSelectedId("");
  }, [hasLoaded, selectedId, selectedUser]);

  useEffect(() => {
    const previousId = previousSelectionRef.current;
    previousSelectionRef.current = selectedId;

    if (!selectedId && !previousId) return;

    const frame = requestAnimationFrame(() => {
      const heading = selectedId
        ? profileHeadingRef.current
        : directoryHeadingRef.current;

      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: "start", behavior: "auto" });
    });

    return () => cancelAnimationFrame(frame);
  }, [selectedId]);

  const totalOrderValue = useMemo(
    () =>
      orders.reduce(
        (total, order) =>
          total + (isCancelled(order) ? 0 : getAmount(order.totalAmount)),
        0
      ),
    [orders]
  );

  const customerCount = userDirectory.filter(
    (user) => user.roleLabel === "Customer"
  ).length;

  const adminCount = userDirectory.filter(
    (user) => user.roleLabel === "Admin"
  ).length;

  const filtersActive =
    searchTerm.trim() || roleFilter !== "All" || sortBy !== "Newest";

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("All");
    setSortBy("Newest");
  };

  const refreshButton = (
    <button
      type="button"
      className="fbusers-button"
      disabled={loading}
      onClick={() => setRefreshCount((count) => count + 1)}
    >
      <RefreshCw
        size={15}
        aria-hidden="true"
        className={loading ? "fbusers-spin" : ""}
      />
      {loading ? "Refreshing…" : "Refresh"}
    </button>
  );

  return (
    <section className="fbusers">
      <style>{styles}</style>

      <div className="fbusers-shell">
        {selectedUser ? (
          <>
            <button
              type="button"
              className="fbusers-button fbusers-back"
              onClick={() => setSelectedId("")}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to directory
            </button>

            <header className="fbusers-header">
              <div>
                <p className="fbusers-eyebrow">
                  {brandName} / Account profile
                </p>
                <h1 ref={profileHeadingRef} tabIndex={-1}>
                  Account overview
                </h1>
                <p className="fbusers-subtitle">
                  Registration details and linked order activity.
                </p>
              </div>

              {refreshButton}
            </header>
          </>
        ) : (
          <header className="fbusers-header">
            <div>
              <p className="fbusers-eyebrow">
                {brandName} / Administration
              </p>
              <h1 ref={directoryHeadingRef} tabIndex={-1}>
                People & accounts
              </h1>
              <p className="fbusers-subtitle">
                Explore registered accounts and their activity across the store.
              </p>
            </div>

            {refreshButton}
          </header>
        )}

        {errorMessage && (
          <div className="fbusers-alert" role="alert">
            {errorMessage}
            {hasLoaded && " Previously loaded data is still displayed."}
          </div>
        )}

        {selectedUser ? (
          <div className="fbusers-profile" aria-busy={loading}>
            <aside className="fbusers-identity">
              <div className="fbusers-avatar" aria-hidden="true">
                {getInitials(selectedUser.name)}
              </div>

              <h2>{getText(selectedUser.name) || "Unnamed account"}</h2>

              <p className="fbusers-email">
                {getText(selectedUser.email) || "Email not provided"}
              </p>

              <span
                className={`fbusers-role ${
                  selectedUser.roleLabel === "Admin"
                    ? "fbusers-role-admin"
                    : ""
                }`}
              >
                {selectedUser.roleLabel === "Admin" && (
                  <ShieldCheck size={12} aria-hidden="true" />
                )}
                {selectedUser.roleLabel}
              </span>

              <dl className="fbusers-fields">
                <div className="fbusers-field">
                  <dt>
                    <Mail size={13} aria-hidden="true" />
                    Email address
                  </dt>
                  <dd>{getText(selectedUser.email) || "—"}</dd>
                </div>

                <div className="fbusers-field">
                  <dt>
                    <CalendarDays size={13} aria-hidden="true" />
                    Registered on
                  </dt>
                  <dd>{formatDate(selectedUser.createdAt)}</dd>
                </div>

                <div className="fbusers-field">
                  <dt>Account ID</dt>
                  <dd>{selectedUser.accountId}</dd>
                </div>
              </dl>
            </aside>

            <div className="fbusers-panel">
              <div className="fbusers-activity">
                <div>
                  <small>Total orders</small>
                  <strong>{selectedUser.orderCount}</strong>
                </div>

                <div>
                  <small>Non-cancelled order value</small>
                  <strong>{formatMoney(selectedUser.orderValue)}</strong>
                </div>
              </div>

              <h2>Order history</h2>

              <p className="fbusers-note">
                Order value excludes cancelled orders and does not confirm
                payment collection.
              </p>

              {selectedUser.userOrders.length > 0 ? (
                <div className="fbusers-history">
                  {selectedUser.userOrders.map((order, index) => (
                    <article
                      className="fbusers-order"
                      key={getId(order) || `order-${index}`}
                    >
                      <div>
                        <strong>
                          {order.orderNumber != null
                            ? String(order.orderNumber)
                            : getId(order) || "Order"}
                        </strong>
                        <small>{formatDate(order.createdAt)}</small>
                      </div>

                      <div className="fbusers-order-value">
                        <strong>{formatMoney(order.totalAmount)}</strong>
                        <small>{getText(order.status) || "Unknown status"}</small>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="fbusers-empty">
                  <ShoppingBag size={28} aria-hidden="true" />
                  <h2>No linked orders</h2>
                  <p>This account has no linked order activity yet.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="fbusers-overview" aria-label="Account summary">
              <div className="fbusers-stat">
                <small>Registered accounts</small>
                <strong>{hasLoaded ? users.length : "—"}</strong>
              </div>

              <div className="fbusers-stat">
                <small>Customers</small>
                <strong>{hasLoaded ? customerCount : "—"}</strong>
              </div>

              <div className="fbusers-stat">
                <small>Administrators</small>
                <strong>{hasLoaded ? adminCount : "—"}</strong>
              </div>

              <div className="fbusers-stat">
                <small>All non-cancelled order value</small>
                <strong>
                  {hasLoaded ? formatMoney(totalOrderValue) : "—"}
                </strong>
              </div>
            </div>

            <div className="fbusers-controls">
              <div className="fbusers-search">
                <Search size={17} aria-hidden="true" />
                <input
                  type="search"
                  aria-label="Search accounts by name or email"
                  placeholder="Find a person by name or email"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>

              <label className="fbusers-sort">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="Newest">Newest accounts</option>
                  <option value="Highest Value">Highest order value</option>
                  <option value="Most Orders">Most orders</option>
                  <option value="A-Z">Name: A–Z</option>
                </select>
              </label>
            </div>

            <div className="fbusers-tabs" aria-label="Filter by account role">
              {roleOptions.map((role) => (
                <button
                  key={role}
                  type="button"
                  className="fbusers-tab"
                  aria-pressed={roleFilter === role}
                  onClick={() => setRoleFilter(role)}
                >
                  {role === "All" ? "All accounts" : role}
                  {hasLoaded && (
                    <>
                      {" · "}
                      {role === "All"
                        ? userDirectory.length
                        : userDirectory.filter(
                            (user) => user.roleLabel === role
                          ).length}
                    </>
                  )}
                </button>
              ))}
            </div>

            <div className="fbusers-results">
              <span role="status">
                {hasLoaded
                  ? `${filteredUsers.length} of ${users.length} accounts${
                      loading ? " · Refreshing…" : ""
                    }`
                  : loading
                    ? "Loading accounts…"
                    : "Account data unavailable"}
              </span>

              {filtersActive && (
                <button
                  type="button"
                  className="fbusers-reset"
                  onClick={clearFilters}
                >
                  Reset filters
                </button>
              )}
            </div>

            {loading && !hasLoaded ? (
              <div className="fbusers-empty" role="status">
                <Loader2
                  size={30}
                  className="fbusers-spin"
                  aria-hidden="true"
                />
                <p>Loading accounts and order activity…</p>
              </div>
            ) : !hasLoaded ? (
              <div className="fbusers-empty">
                <UsersIcon size={30} aria-hidden="true" />
                <h2>Accounts could not be loaded</h2>
                <p>Use Refresh to try again.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="fbusers-empty">
                <UsersIcon size={30} aria-hidden="true" />
                <h2>
                  {users.length === 0
                    ? "No registered accounts"
                    : "No matching accounts"}
                </h2>
                <p>
                  {users.length === 0
                    ? "Registered users will appear here."
                    : "Try another name, email address or role filter."}
                </p>
                {filtersActive && (
                  <button
                    type="button"
                    className="fbusers-button"
                    onClick={clearFilters}
                  >
                    Reset filters
                  </button>
                )}
              </div>
            ) : (
              <div className="fbusers-grid" aria-busy={loading}>
                {filteredUsers.map((user) => (
                  <article className="fbusers-card" key={user.accountId}>
                    <div className="fbusers-card-top">
                      <div className="fbusers-avatar" aria-hidden="true">
                        {getInitials(user.name)}
                      </div>

                      <span
                        className={`fbusers-role ${
                          user.roleLabel === "Admin"
                            ? "fbusers-role-admin"
                            : ""
                        }`}
                      >
                        {user.roleLabel === "Admin" && (
                          <ShieldCheck size={12} aria-hidden="true" />
                        )}
                        {user.roleLabel}
                      </span>
                    </div>

                    <h2>{getText(user.name) || "Unnamed account"}</h2>
                    <p className="fbusers-email">
                      {getText(user.email) || "Email not provided"}
                    </p>

                    <div className="fbusers-card-metrics">
                      <div>
                        <small>Orders</small>
                        <strong>{user.orderCount}</strong>
                      </div>
                      <div>
                        <small>Non-cancelled value</small>
                        <strong>{formatMoney(user.orderValue)}</strong>
                      </div>
                    </div>

                    <div className="fbusers-card-footer">
                      <span>Joined {formatDate(user.createdAt)}</span>

                      <button
                        type="button"
                        className="fbusers-open"
                        aria-label={`View profile for ${
                          getText(user.name) || "this account"
                        }`}
                        onClick={() => setSelectedId(user.accountId)}
                      >
                        View profile
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Users;