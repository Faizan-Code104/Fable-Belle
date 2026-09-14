import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock3,
  XCircle,
  MapPin,
  User,
  Mail,
  Phone,
  CalendarDays,
  DollarSign,
  ChevronDown,
  ArrowUpDown,
  ShoppingBag,
  Loader2,
  RefreshCw,
  ImageOff,
} from "lucide-react";

import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/api/orders`;
const SERVER_URL = API_BASE_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const getToken = () => {
    return localStorage.getItem("ectoo-token");
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      "Content-Type": "application/json",
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

  const getCustomerName = (order) => {
    const first = order.shippingAddress?.firstName || "";
    const last = order.shippingAddress?.lastName || "";
    const fullName = `${first} ${last}`.trim();

    return fullName || order.user?.name || "Guest";
  };

  const getCustomerEmail = (order) => {
    return order.shippingAddress?.email || order.user?.email || "—";
  };

  const getFullAddress = (order) => {
    const address = order.shippingAddress;

    if (!address) return "—";

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

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(API_URL, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch orders.");
      }

      setOrders(data.orders || []);
    } catch (error) {
      console.error("Fetch Orders Error:", error);

      setErrorMessage(error.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  

  const getStatusClasses = (status) => {
    const styles = {
      Pending: "bg-amber-50 text-amber-700 ring-amber-200",
      Processing: "bg-blue-50 text-blue-700 ring-blue-200",
      Shipped: "bg-violet-50 text-violet-700 ring-violet-200",
      Delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
      Cancelled: "bg-red-50 text-red-700 ring-red-200",
    };

    return styles[status] || "bg-[#F4F1EB] text-ink/60 ring-line";
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: Clock3,
      Processing: Package,
      Shipped: Truck,
      Delivered: CheckCircle2,
      Cancelled: XCircle,
    };

    const Icon = icons[status] || Clock3;

    return <Icon size={14} />;
  };

  

  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (order) =>
          order.orderNumber?.toLowerCase().includes(search) ||
          getCustomerName(order).toLowerCase().includes(search) ||
          getCustomerEmail(order).toLowerCase().includes(search),
      );
    }

    if (statusFilter !== "All") {
      result = result.filter((order) => order.status === statusFilter);
    }

    if (sortBy === "Highest") {
      result.sort((a, b) => b.totalAmount - a.totalAmount);
    }

    if (sortBy === "Lowest") {
      result.sort((a, b) => a.totalAmount - b.totalAmount);
    }

    if (sortBy === "Items") {
      result.sort((a, b) => (b.items?.length || 0) - (a.items?.length || 0));
    }

    if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [orders, searchTerm, statusFilter, sortBy]);

  

  const totalRevenue = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending",
  ).length;

  const processingOrders = orders.filter(
    (order) => order.status === "Processing",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatusId(orderId);
      setErrorMessage("");

      const response = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update order status.");
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order,
        ),
      );

      if (selectedOrder?._id === orderId) {
        setSelectedOrder(data.order);
      }

      console.log("Order Status Updated:", data.order);
    } catch (error) {
      console.error("Update Order Status Error:", error);

      setErrorMessage(error.message || "Unable to update order status.");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleViewOrder = (order) => {
    console.log("View Order:", order);
    setSelectedOrder(order);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setSortBy("Newest");
  };

  return (
    <section className="min-h-screen bg-[#F4F1EB] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-ink/40">
              Ectoo Admin
            </p>

            <h1 className="font-display text-3xl text-ink sm:text-4xl">
              Orders
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/60">
              Manage customer orders, fulfillment and deliveries from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={loading}
              className="inline-flex items-center gap-2 border border-line bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink/70 transition hover:bg-[#F4F1EB] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <div className="hidden items-center gap-2 border border-line bg-paper px-4 py-3 sm:flex">
              <ShoppingBag size={17} className="text-ink/50" />

              <span className="text-sm font-semibold text-ink/70">
                {orders.length} Total Orders
              </span>
            </div>
          </div>
        </div>

        {}
        {errorMessage && (
          <div className="mb-5 flex items-center justify-between gap-4 border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            <span>{errorMessage}</span>

            <button type="button" onClick={() => setErrorMessage("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink/50">Total Revenue</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  ${totalRevenue.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center bg-ink text-paper">
                <DollarSign size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-emerald-600">
              Excludes cancelled orders
            </p>
          </div>

          <div className="border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink/50">Pending</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  {pendingOrders}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center bg-amber-50 text-amber-600">
                <Clock3 size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Awaiting confirmation
            </p>
          </div>

          <div className="border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink/50">Processing</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  {processingOrders}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center bg-blue-50 text-blue-600">
                <Package size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Being prepared
            </p>
          </div>

          <div className="border border-line bg-paper p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink/50">Delivered</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  {deliveredOrders}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Successfully completed
            </p>
          </div>
        </div>

        {}
        <div className="mb-5 border border-line bg-paper p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order number, customer or email..."
                className="w-full border border-line bg-[#F4F1EB] py-3.5 pl-11 pr-4 text-sm font-medium text-ink outline-none transition focus:bg-paper focus:border-ink"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 border border-line bg-paper px-4 py-3 text-xs font-semibold uppercase tracking-wider text-ink/70 transition hover:border-ink"
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

              <div className="relative">
                <ArrowUpDown
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/50"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none border border-line bg-paper py-3 pl-10 pr-10 text-xs font-semibold text-ink/70 outline-none transition hover:border-ink"
                >
                  <option value="Newest">Newest</option>
                  <option value="Highest">Highest Value</option>
                  <option value="Lowest">Lowest Value</option>
                  <option value="Items">Most Items</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                />
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-5 border-t border-line pt-5">
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                Order Status
              </label>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full max-w-xs border border-line bg-[#F4F1EB] px-4 py-3 text-sm font-semibold text-ink/70 outline-none focus:bg-paper focus:border-ink"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(searchTerm || statusFilter !== "All" || sortBy !== "Newest") && (
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <p className="text-xs font-semibold text-ink/50">
                Showing {filteredOrders.length} of {orders.length} orders
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-ink underline underline-offset-4 hover:text-ink/60"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {}
        {loading ? (
          <div className="flex flex-col items-center justify-center border border-line bg-paper px-6 py-24">
            <Loader2 size={32} className="animate-spin text-ink" />

            <p className="mt-4 text-sm font-medium text-ink/60">
              Loading orders...
            </p>
          </div>
        ) : (
          <>
            {}
            <div className="hidden overflow-hidden border border-line bg-paper lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="border-b border-line bg-[#F4F1EB]">
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Order
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Date
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Items
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-ink/40">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order._id}
                        className="group transition hover:bg-[#F4F1EB]/70"
                      >
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-ink">
                            {order.orderNumber}
                          </p>

                          <p className="mt-1 text-xs font-medium text-ink/40">
                            {order.items?.length || 0} product
                            {(order.items?.length || 0) > 1 ? "s" : ""}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-ink/80">
                            {getCustomerName(order)}
                          </p>

                          <p className="mt-1 text-xs text-ink/40">
                            {getCustomerEmail(order)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-medium text-ink/70">
                            {formatDate(order.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-ink/70">
                            {order.items?.length || 0}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-ink">
                            ${Number(order.totalAmount).toLocaleString()}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="relative inline-block">
                            <select
                              value={order.status}
                              disabled={updatingStatusId === order._id}
                              onChange={(e) =>
                                handleStatusChange(order._id, e.target.value)
                              }
                              className={`appearance-none py-1.5 pl-8 pr-8 text-[11px] font-bold ring-1 ring-inset outline-none disabled:opacity-50 ${getStatusClasses(
                                order.status,
                              )}`}
                            >
                              {statusOptions
                                .filter((status) => status !== "All")
                                .map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                            </select>

                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                              {updatingStatusId === order._id ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                getStatusIcon(order.status)
                              )}
                            </span>

                            <ChevronDown
                              size={12}
                              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                            />
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewOrder(order)}
                              className="flex h-9 w-9 items-center justify-center border border-line bg-paper text-ink/50 transition hover:border-ink hover:bg-ink hover:text-paper"
                              title="View order"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#F4F1EB] text-ink/40">
                    <ShoppingBag size={28} />
                  </div>

                  <h3 className="mt-5 font-display text-lg text-ink">
                    No orders found
                  </h3>

                  <p className="mt-2 text-sm text-ink/50">
                    {orders.length === 0
                      ? "No orders have been placed yet."
                      : "Try adjusting your search or filters."}
                  </p>
                </div>
              )}
            </div>

            {}
            <div className="space-y-4 lg:hidden">
              {filteredOrders.map((order) => (
                <div
                  key={order._id}
                  className="border border-line bg-paper p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {order.orderNumber}
                      </p>

                      <p className="mt-1 text-xs text-ink/40">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold ring-1 ring-inset ${getStatusClasses(
                        order.status,
                      )}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3 border-b border-line pb-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#F4F1EB] text-ink/60">
                      <User size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink/80">
                        {getCustomerName(order)}
                      </p>

                      <p className="truncate text-xs text-ink/40">
                        {getCustomerEmail(order)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Items
                      </p>

                      <p className="mt-1 text-sm font-bold text-ink">
                        {order.items?.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Total
                      </p>

                      <p className="mt-1 text-sm font-bold text-ink">
                        ${Number(order.totalAmount).toLocaleString()}
                      </p>
                    </div>

                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewOrder(order)}
                      className="flex flex-1 items-center justify-center gap-2 bg-ink px-4 py-3 text-xs font-semibold uppercase tracking-wider text-paper transition hover:bg-bottle-dark"
                    >
                      <Eye size={15} />
                      View Order
                    </button>
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="border border-line bg-paper px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center bg-[#F4F1EB] text-ink/40">
                    <ShoppingBag size={28} />
                  </div>

                  <h3 className="mt-5 font-display text-lg text-ink">
                    No orders found
                  </h3>

                  <p className="mt-2 text-sm text-ink/50">
                    {orders.length === 0
                      ? "No orders have been placed yet."
                      : "Try adjusting your search or filters."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto border border-line bg-paper">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
                  Order Details
                </p>

                <h2 className="mt-1 font-display text-xl text-ink">
                  {selectedOrder.orderNumber}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="flex h-10 w-10 items-center justify-center bg-[#F4F1EB] text-ink/50 transition hover:bg-line hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {}
              <div className="bg-[#F4F1EB] p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink/40">
                      Current Status
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold ring-1 ring-inset ${getStatusClasses(
                          selectedOrder.status,
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        {selectedOrder.status}
                      </span>

                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/40">
                      Update Status
                    </label>

                    <select
                      value={selectedOrder.status}
                      disabled={updatingStatusId === selectedOrder._id}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder._id, e.target.value)
                      }
                      className="border border-line bg-paper px-3 py-2 text-sm font-bold text-ink/70 outline-none focus:border-ink disabled:opacity-50"
                    >
                      {statusOptions
                        .filter((status) => status !== "All")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="border border-line p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <User size={17} className="text-ink/50" />

                    <h3 className="text-sm font-bold text-ink">Customer</h3>
                  </div>

                  <p className="text-sm font-semibold text-ink/80">
                    {getCustomerName(selectedOrder)}
                  </p>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-ink/50">
                      <Mail size={14} />
                      {getCustomerEmail(selectedOrder)}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-ink/50">
                      <Phone size={14} />
                      {selectedOrder.shippingAddress?.phone || "—"}
                    </div>
                  </div>
                </div>

                <div className="border border-line p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <MapPin size={17} className="text-ink/50" />

                    <h3 className="text-sm font-bold text-ink">
                      Shipping Address
                    </h3>
                  </div>

                  <p className="text-sm leading-6 text-ink/60">
                    {getFullAddress(selectedOrder)}
                  </p>
                </div>
              </div>

              {}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="bg-[#F4F1EB] p-4">
                  <CalendarDays size={17} className="text-ink/50" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Date
                  </p>

                  <p className="mt-1 text-xs font-bold text-ink/80">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>

                <div className="bg-[#F4F1EB] p-4">
                  <Package size={17} className="text-ink/50" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Items
                  </p>

                  <p className="mt-1 text-xs font-bold text-ink/80">
                    {selectedOrder.items?.length || 0}
                  </p>
                </div>

                <div className="bg-ink p-4 text-paper">
                  <DollarSign size={17} />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-paper/50">
                    Total
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    ${Number(selectedOrder.totalAmount).toLocaleString()}
                  </p>
                </div>
              </div>

              {}
              <div className="border border-line p-5">
                <div className="mb-4 flex items-center gap-2">
                  <ShoppingBag size={17} className="text-ink/50" />

                  <h3 className="text-sm font-bold text-ink">Products</h3>
                </div>

                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, index) => (
                    <div
                      key={`${item.product}-${index}`}
                      className="flex items-center justify-between gap-4 bg-[#F4F1EB] px-4 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-paper text-ink/50">
                          {item.image ? (
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageOff size={15} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-ink/80">
                            {item.name}
                          </p>

                          <p className="text-[10px] text-ink/40">
                            ${Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-[10px] font-bold text-ink/40">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Orders;
