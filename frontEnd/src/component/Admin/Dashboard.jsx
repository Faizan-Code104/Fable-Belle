import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const PRODUCTS_API_URL = `${API_BASE_URL}/api/products`;
const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;
const USERS_API_URL = `${API_BASE_URL}/api/users`;
const SERVER_URL = API_BASE_URL;

const STATUS_ORDER = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const getToken = () => {
    return localStorage.getItem("ectoo-token");
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    return `${SERVER_URL}${image}`;
  };

  

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [productsRes, ordersRes, usersRes] = await Promise.all([
        fetch(PRODUCTS_API_URL, { headers: getHeaders() }),
        fetch(ORDERS_API_URL, { headers: getHeaders() }),
        fetch(USERS_API_URL, { headers: getHeaders() }),
      ]);

      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      const usersData = await usersRes.json();

      if (!productsRes.ok) {
        throw new Error(productsData.message || "Failed to fetch products.");
      }

      if (!ordersRes.ok) {
        throw new Error(ordersData.message || "Failed to fetch orders.");
      }

      if (!usersRes.ok) {
        throw new Error(usersData.message || "Failed to fetch users.");
      }

      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
      setUsers(usersData.users || []);
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);

      setErrorMessage(error.message || "Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  

  const now = new Date();

  const isInMonth = (dateString, year, month) => {
    if (!dateString) return false;

    const date = new Date(dateString);

    return date.getFullYear() === year && date.getMonth() === month;
  };

  const getPercentChange = (current, previous) => {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return ((current - previous) / previous) * 100;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  

  const dashboardStats = useMemo(() => {
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const prevMonthDate = new Date(thisYear, thisMonth - 1, 1);
    const prevMonth = prevMonthDate.getMonth();
    const prevYear = prevMonthDate.getFullYear();

    const nonCancelled = orders.filter((order) => order.status !== "Cancelled");
    const revenueThisMonth = nonCancelled
      .filter((order) => isInMonth(order.createdAt, thisYear, thisMonth))
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const revenueLastMonth = nonCancelled
      .filter((order) => isInMonth(order.createdAt, prevYear, prevMonth))
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    const totalRevenue = nonCancelled.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0,
    );
    const ordersThisMonth = orders.filter((order) =>
      isInMonth(order.createdAt, thisYear, thisMonth),
    ).length;

    const ordersLastMonth = orders.filter((order) =>
      isInMonth(order.createdAt, prevYear, prevMonth),
    ).length;
    const productsThisMonth = products.filter((product) =>
      isInMonth(product.createdAt, thisYear, thisMonth),
    ).length;

    const productsLastMonth = products.filter((product) =>
      isInMonth(product.createdAt, prevYear, prevMonth),
    ).length;
    const customers = users.filter((user) => user.role !== "admin");

    const customersThisMonth = customers.filter((user) =>
      isInMonth(user.createdAt, thisYear, thisMonth),
    ).length;

    const customersLastMonth = customers.filter((user) =>
      isInMonth(user.createdAt, prevYear, prevMonth),
    ).length;

    return [
      {
        title: "Total Revenue",
        value: `$${totalRevenue.toLocaleString()}`,
        change: getPercentChange(revenueThisMonth, revenueLastMonth),
        icon: DollarSign,
        description: "vs. last month",
      },
      {
        title: "Total Orders",
        value: orders.length.toLocaleString(),
        change: getPercentChange(ordersThisMonth, ordersLastMonth),
        icon: ShoppingCart,
        description: "vs. last month",
      },
      {
        title: "Products",
        value: products.length.toLocaleString(),
        change: getPercentChange(productsThisMonth, productsLastMonth),
        icon: Package,
        description: "vs. last month",
      },
      {
        title: "Customers",
        value: customers.length.toLocaleString(),
        change: getPercentChange(customersThisMonth, customersLastMonth),
        icon: Users,
        description: "vs. last month",
      },
    ];
  }, [orders, products, users]);

  const totalRevenueValue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const revenueChangeThisVsLast = dashboardStats[0]?.change || 0;

  

  const salesData = useMemo(() => {
    const months = [];

    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);

      months.push({
        label: date.toLocaleDateString("en-US", { month: "short" }),
        year: date.getFullYear(),
        month: date.getMonth(),
        revenue: 0,
      });
    }

    const nonCancelled = orders.filter((order) => order.status !== "Cancelled");

    nonCancelled.forEach((order) => {
      if (!order.createdAt) return;

      const orderDate = new Date(order.createdAt);

      const bucket = months.find(
        (m) =>
          m.year === orderDate.getFullYear() &&
          m.month === orderDate.getMonth(),
      );

      if (bucket) {
        bucket.revenue += Number(order.totalAmount || 0);
      }
    });

    const maxRevenue = Math.max(...months.map((m) => m.revenue), 1);

    return months.map((m) => ({
      ...m,
      heightPercent: Math.max(
        (m.revenue / maxRevenue) * 100,
        m.revenue > 0 ? 4 : 0,
      ),
    }));
  }, [orders]);

  

  const statusBreakdown = useMemo(() => {
    const total = orders.length || 1;

    return STATUS_ORDER.map((status) => {
      const count = orders.filter((order) => order.status === status).length;

      return {
        status,
        count,
        percent: (count / total) * 100,
      };
    });
  }, [orders]);

  const avgOrderValue =
    orders.filter((order) => order.status !== "Cancelled").length > 0
      ? totalRevenueValue /
        orders.filter((order) => order.status !== "Cancelled").length
      : 0;

  

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  const getOrderCustomer = (order) => {
    const first = order.shippingAddress?.firstName || "";
    const last = order.shippingAddress?.lastName || "";
    const fullName = `${first} ${last}`.trim();

    return fullName || order.user?.name || "Guest";
  };

  const getOrderSummary = (order) => {
    const items = order.items || [];

    if (items.length === 0) return "—";
    if (items.length === 1) return items[0].name;

    return `${items[0].name} +${items.length - 1} more`;
  };

  

  const productCategoryMap = useMemo(() => {
    const map = {};

    products.forEach((product) => {
      map[product._id] = product;
    });

    return map;
  }, [products]);

  const topProducts = useMemo(() => {
    const salesMap = {};

    orders
      .filter((order) => order.status !== "Cancelled")
      .forEach((order) => {
        (order.items || []).forEach((item) => {
          const key = item.product || item.name;

          if (!salesMap[key]) {
            salesMap[key] = {
              key,
              name: item.name,
              unitsSold: 0,
              revenue: 0,
              productId: item.product,
            };
          }

          salesMap[key].unitsSold += Number(item.quantity || 0);
          salesMap[key].revenue +=
            Number(item.price || 0) * Number(item.quantity || 0);
        });
      });

    return Object.values(salesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4)
      .map((entry) => {
        const productDetails = productCategoryMap[entry.productId];

        return {
          ...entry,
          category: productDetails?.category || "—",
          image: productDetails?.images?.[0] || "",
        };
      });
  }, [orders, productCategoryMap]);

  

  const getStatusStyles = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-600";
      case "Processing":
        return "bg-blue-50 text-blue-600";
      case "Shipped":
        return "bg-violet-50 text-violet-600";
      case "Pending":
        return "bg-amber-50 text-amber-600";
      case "Cancelled":
        return "bg-red-50 text-red-600";
      default:
        return "bg-[#F4F1EB] text-ink/60";
    }
  };

  const getStatusBarColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-500";
      case "Processing":
        return "bg-blue-500";
      case "Shipped":
        return "bg-violet-500";
      case "Pending":
        return "bg-amber-400";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-ink/40";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={14} />;
      case "Processing":
        return <Clock3 size={14} />;
      case "Shipped":
        return <Truck size={14} />;
      case "Cancelled":
        return <XCircle size={14} />;
      case "Pending":
        return <Clock3 size={14} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
        <Loader2 size={32} className="animate-spin text-ink" />
        <p className="text-sm font-medium text-ink/60">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
            Overview
          </p>

          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-ink/60">
            Welcome back. Here's what's happening with your store.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchDashboardData}
            className="inline-flex items-center justify-center gap-2 border border-line bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink/70 transition-all hover:bg-[#F4F1EB]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 bg-ink px-5 py-3 text-xs font-semibold uppercase tracking-wider text-paper transition-all duration-300 hover:bg-bottle-dark"
          >
            View Store
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
          {errorMessage}
        </div>
      )}

      {}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          const positive = stat.change >= 0;

          return (
            <div key={stat.title} className="border border-line bg-paper p-5">
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center bg-ink text-paper">
                  <Icon size={20} />
                </div>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold ${
                    positive
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {positive ? (
                    <ArrowUpRight size={13} />
                  ) : (
                    <ArrowDownRight size={13} />
                  )}
                  {Math.abs(stat.change).toFixed(1)}%
                </span>
              </div>

              <p className="mt-5 text-sm font-medium text-ink/60">
                {stat.title}
              </p>

              <div className="mt-1 flex items-end gap-2">
                <h2 className="font-display text-2xl text-ink">{stat.value}</h2>
              </div>

              <p className="mt-1 text-xs text-ink/40">{stat.description}</p>
            </div>
          );
        })}
      </div>

      {}
      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        {}
        <div className="border border-line bg-paper p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
                Revenue
              </p>

              <h2 className="mt-1 font-display text-xl text-ink">
                Sales Overview
              </h2>
            </div>

            <span className="border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink/60">
              Last 12 months
            </span>
          </div>

          <div className="mt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-display text-3xl text-ink">
                  ${totalRevenueValue.toLocaleString()}
                </p>

                <div
                  className={`mt-1 flex items-center gap-1.5 text-xs font-semibold ${
                    revenueChangeThisVsLast >= 0
                      ? "text-emerald-600"
                      : "text-red-500"
                  }`}
                >
                  {revenueChangeThisVsLast >= 0 ? (
                    <TrendingUp size={14} />
                  ) : (
                    <TrendingDown size={14} />
                  )}
                  {Math.abs(revenueChangeThisVsLast).toFixed(1)}% from last
                  month
                </div>
              </div>
            </div>

            {}
            <div className="mt-8">
              {salesData.every((m) => m.revenue === 0) ? (
                <div className="flex h-64 flex-col items-center justify-center text-center">
                  <TrendingUp size={28} className="text-ink/20" />
                  <p className="mt-3 text-sm font-semibold text-ink/40">
                    No sales recorded yet.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex h-64 items-end gap-2 border-b border-line px-1 sm:gap-4">
                    {salesData.map((item, index) => (
                      <div
                        key={`${item.label}-${index}`}
                        className="group relative flex h-full flex-1 flex-col justify-end"
                      >
                        <div
                          className="w-full bg-ink transition-all duration-300 group-hover:bg-bottle"
                          style={{
                            height: `${item.heightPercent}%`,
                          }}
                        />

                        <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap bg-ink px-2 py-1 text-[10px] font-bold text-paper group-hover:block">
                          ${item.revenue.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 flex gap-2 sm:gap-4">
                    {salesData.map((item, index) => (
                      <span
                        key={`${item.label}-label-${index}`}
                        className="flex-1 text-center text-[9px] font-semibold text-ink/40 sm:text-[10px]"
                      >
                        {item.label}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {}
        <div className="border border-line bg-paper p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
              Orders
            </p>

            <h2 className="mt-1 font-display text-xl text-ink">
              Order Summary
            </h2>
          </div>

          <div className="mt-7 space-y-5">
            {statusBreakdown.map((row) => (
              <div key={row.status}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink/70">
                    {row.status}
                  </span>

                  <span className="text-sm font-bold text-ink">
                    {row.percent.toFixed(0)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden bg-[#F4F1EB]">
                  <div
                    className={`h-full ${getStatusBarColor(row.status)}`}
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="bg-[#F4F1EB] p-4">
              <p className="text-xs font-semibold text-ink/40">Total Orders</p>

              <p className="mt-1 text-xl font-bold text-ink">
                {orders.length.toLocaleString()}
              </p>
            </div>

            <div className="bg-[#F4F1EB] p-4">
              <p className="text-xs font-semibold text-ink/40">Avg. Order</p>

              <p className="mt-1 text-xl font-bold text-ink">
                ${avgOrderValue.toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="border border-line bg-paper">
        <div className="flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
              Latest Activity
            </p>

            <h2 className="mt-1 font-display text-xl text-ink">
              Recent Orders
            </h2>
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
          >
            View all orders
            <ArrowRight size={16} />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-ink/40">
              No orders have been placed yet.
            </p>
          </div>
        ) : (
          <>
            {}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-line bg-[#F4F1EB]">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Amount
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b border-line last:border-0 hover:bg-[#F4F1EB]/60"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-ink">
                          {order.orderNumber}
                        </p>

                        <p className="mt-1 text-xs text-ink/40">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-ink/70">
                          {getOrderCustomer(order)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="max-w-[200px] truncate text-sm font-medium text-ink/70">
                          {getOrderSummary(order)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-ink">
                          ${Number(order.totalAmount).toFixed(2)}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                            order.status,
                          )}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          to="/admin/orders"
                          className="inline-flex h-9 w-9 items-center justify-center text-ink/40 transition-colors hover:bg-[#F4F1EB] hover:text-ink"
                          aria-label={`View ${order.orderNumber}`}
                        >
                          <Eye size={17} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {}
            <div className="divide-y divide-line md:hidden">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-ink/40">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold ${getStatusStyles(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-ink/80">
                      {getOrderCustomer(order)}
                    </p>

                    <p className="mt-1 text-xs text-ink/50">
                      {getOrderSummary(order)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-base font-bold text-ink">
                      ${Number(order.totalAmount).toFixed(2)}
                    </p>

                    <Link
                      to="/admin/orders"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-ink/60 hover:text-ink"
                    >
                      View
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {}
      <div className="border border-line bg-paper">
        <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
              Best Sellers
            </p>

            <h2 className="mt-1 font-display text-xl text-ink">Top Products</h2>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-ink/70 transition-colors hover:text-ink"
          >
            Manage
            <ArrowRight size={16} />
          </Link>
        </div>

        {topProducts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="text-sm font-semibold text-ink/40">
              No sales yet — top products will appear here once orders come in.
            </p>
          </div>
        ) : (
          <div className="grid divide-y divide-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            {topProducts.map((product, index) => (
              <div
                key={product.key}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-[#F4F1EB]/60 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden bg-ink text-sm font-bold text-paper">
                  {product.image ? (
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink">
                    {product.name}
                  </p>

                  <p className="mt-1 text-xs text-ink/40">{product.category}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs font-semibold text-ink/50">
                      {product.unitsSold} sold
                    </p>

                    <p className="text-sm font-bold text-ink">
                      ${product.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      <div className="bg-ink p-6 text-paper sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-paper/50">
              Ectoo Admin
            </p>

            <h2 className="mt-2 font-display text-2xl sm:text-3xl">
              Keep your store moving forward.
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-paper/70">
              Manage products, monitor orders, and keep your customers happy
              from one powerful dashboard.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/admin/products"
              className="inline-flex items-center justify-center gap-2 bg-paper px-5 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-[#EFE9DE]"
            >
              Manage Products
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/admin/orders"
              className="inline-flex items-center justify-center gap-2 border border-paper/20 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-paper transition-all hover:bg-paper/10"
            >
              View Orders
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
