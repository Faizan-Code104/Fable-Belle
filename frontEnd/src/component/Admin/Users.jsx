import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  X,
  User,
  Mail,
  CalendarDays,
  ShoppingBag,
  DollarSign,
  ChevronDown,
  ArrowUpDown,
  Users as UsersIcon,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { API_BASE_URL } from "../../config";

const USERS_API_URL = `${API_BASE_URL}/api/users`;
const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;

const Users = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [selectedUser, setSelectedUser] = useState(null);

  const roleOptions = ["All", "Customer", "Admin"];

  const getToken = () => {
    return localStorage.getItem("ectoo-token");
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const getInitials = (name) => {
    if (!name) return "?";

    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const getRoleLabel = (role) => {
    return role === "admin" ? "Admin" : "Customer";
  };

  const getRoleClasses = (role) => {
    if (role === "admin") {
      return "bg-violet-50 text-violet-700 ring-violet-200";
    }

    return "bg-blue-50 text-blue-700 ring-blue-200";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  

  const fetchData = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [usersResponse, ordersResponse] = await Promise.all([
        fetch(USERS_API_URL, { headers: getHeaders() }),
        fetch(ORDERS_API_URL, { headers: getHeaders() }),
      ]);

      const usersData = await usersResponse.json();
      const ordersData = await ordersResponse.json();

      if (!usersResponse.ok) {
        throw new Error(usersData.message || "Failed to fetch users.");
      }

      if (!ordersResponse.ok) {
        throw new Error(ordersData.message || "Failed to fetch orders.");
      }

      setUsers(usersData.users || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error("Fetch Users Error:", error);

      setErrorMessage(error.message || "Unable to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  

  const getUserStats = (userId) => {
    const userOrders = orders.filter((order) => order.user?._id === userId);

    const spent = userOrders
      .filter((order) => order.status !== "Cancelled")
      .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

    return {
      orderCount: userOrders.length,
      spent,
    };
  };

  

  const filteredUsers = useMemo(() => {
    let result = users.map((user) => ({
      ...user,
      ...getUserStats(user._id),
    }));

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter(
        (user) =>
          user.name?.toLowerCase().includes(search) ||
          user.email?.toLowerCase().includes(search),
      );
    }

    if (roleFilter !== "All") {
      const targetRole = roleFilter === "Admin" ? "admin" : "user";
      result = result.filter((user) => user.role === targetRole);
    }

    if (sortBy === "Highest Spent") {
      result.sort((a, b) => b.spent - a.spent);
    }

    if (sortBy === "Most Orders") {
      result.sort((a, b) => b.orderCount - a.orderCount);
    }

    if (sortBy === "A-Z") {
      result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    }

    if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [users, orders, searchTerm, roleFilter, sortBy]);

  

  const totalUsers = users.length;

  const totalCustomers = users.filter((user) => user.role !== "admin").length;

  const totalAdmins = users.filter((user) => user.role === "admin").length;

  const totalCustomerSpend = orders
    .filter((order) => order.status !== "Cancelled")
    .reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);

  const handleViewUser = (user) => {
    console.log("View User:", user);
    setSelectedUser(user);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("All");
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
              Users
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-ink/50">
              Everyone registered on Ectoo, with real order activity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchData}
              disabled={loading}
              className="inline-flex items-center gap-2  border border-line bg-paper px-4 py-3 text-sm font-bold text-ink/70  transition hover:bg-[#F4F1EB] disabled:opacity-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <div className="hidden items-center gap-2  border border-line bg-paper px-4 py-3  sm:flex">
              <UsersIcon size={17} className="text-ink/50" />

              <span className="text-sm font-bold text-ink/70">
                {totalUsers} Total Users
              </span>
            </div>
          </div>
        </div>

        {}
        {errorMessage && (
          <div className="mb-5 flex items-center justify-between gap-4  border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
            <span>{errorMessage}</span>

            <button type="button" onClick={() => setErrorMessage("")}>
              <X size={16} />
            </button>
          </div>
        )}

        {}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className=" border border-line bg-paper p-5 ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-ink/50">Total Users</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  {totalUsers}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center  bg-ink text-paper">
                <UsersIcon size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Registered accounts
            </p>
          </div>

          <div className=" border border-line bg-paper p-5 ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-ink/50">Customers</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  {totalCustomers}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center  bg-blue-50 text-blue-600">
                <User size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Store customers
            </p>
          </div>

          <div className=" border border-line bg-paper p-5 ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-ink/50">Admins</p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  {totalAdmins}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center  bg-violet-50 text-violet-600">
                <UsersIcon size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Admin accounts
            </p>
          </div>

          <div className=" border border-line bg-paper p-5 ">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-ink/50">
                  Customer Spend
                </p>

                <h3 className="mt-2 font-display text-2xl text-ink">
                  ${totalCustomerSpend.toLocaleString()}
                </h3>
              </div>

              <div className="flex h-11 w-11 items-center justify-center  bg-emerald-50 text-emerald-600">
                <DollarSign size={20} />
              </div>
            </div>

            <p className="mt-4 text-xs font-semibold text-ink/40">
              Across all orders
            </p>
          </div>
        </div>

        {}
        <div className="mb-5  border border-line bg-paper p-4  sm:p-5">
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
                placeholder="Search by name or email..."
                className="w-full  border border-line bg-[#F4F1EB] py-3.5 pl-11 pr-4 text-sm font-medium text-ink outline-none transition focus:border-ink focus:bg-paper focus:ring-4 focus:ring-ink/5"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <SlidersHorizontal
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                />

                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="appearance-none  border border-line bg-paper py-3 pl-9 pr-9 text-sm font-bold text-ink/70 outline-none focus:ring-4 focus:ring-ink/5"
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {role === "All" ? "All Roles" : role}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
              </div>

              <div className="relative">
                <ArrowUpDown
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40"
                />

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none  border border-line bg-paper py-3 pl-10 pr-9 text-sm font-bold text-ink/70 outline-none focus:ring-4 focus:ring-ink/5"
                >
                  <option value="Newest">Newest</option>
                  <option value="Highest Spent">Highest Spent</option>
                  <option value="Most Orders">Most Orders</option>
                  <option value="A-Z">A-Z</option>
                </select>

                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
                />
              </div>
            </div>
          </div>

          {(searchTerm || roleFilter !== "All" || sortBy !== "Newest") && (
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <p className="text-xs font-semibold text-ink/50">
                Showing {filteredUsers.length} of {users.length} users
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-bold text-ink underline underline-offset-4 hover:text-ink/50"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {}
        {loading ? (
          <div className="flex flex-col items-center justify-center  border border-line bg-paper px-6 py-24 ">
            <Loader2 size={32} className="animate-spin text-ink" />

            <p className="mt-4 text-sm font-semibold text-ink/50">
              Loading users...
            </p>
          </div>
        ) : (
          <>
            {}
            <div className="hidden overflow-hidden  border border-line bg-paper  lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-line bg-[#F4F1EB]/70">
                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-ink/40">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-ink/40">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-ink/40">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-ink/40">
                        Orders
                      </th>

                      <th className="px-6 py-4 text-left text-[11px] font-black uppercase tracking-wider text-ink/40">
                        Spent
                      </th>

                      <th className="px-6 py-4 text-right text-[11px] font-black uppercase tracking-wider text-ink/40">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-line">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="group transition hover:bg-[#F4F1EB]/70"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center  bg-ink text-xs font-black text-paper">
                              {getInitials(user.name)}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-black text-ink">
                                {user.name}
                              </p>

                              <p className="mt-1 truncate text-xs text-ink/40">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ring-inset ${getRoleClasses(
                              user.role,
                            )}`}
                          >
                            {getRoleLabel(user.role)}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-semibold text-ink/70">
                            {formatDate(user.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <ShoppingBag size={15} className="text-ink/40" />

                            <span className="text-sm font-bold text-ink/80">
                              {user.orderCount}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <p className="text-sm font-black text-ink">
                            ${user.spent.toLocaleString()}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewUser(user)}
                              className="flex h-9 w-9 items-center justify-center  border border-line bg-paper text-ink/50 transition hover:border-ink hover:bg-ink hover:text-paper"
                              title="View user"
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

              {filteredUsers.length === 0 && (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center  bg-[#F4F1EB] text-ink/40">
                    <UsersIcon size={28} />
                  </div>

                  <h3 className="mt-5 font-display text-lg text-ink">
                    No users found
                  </h3>

                  <p className="mt-2 text-sm text-ink/50">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </div>

            {}
            <div className="space-y-4 lg:hidden">
              {filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className=" border border-line bg-paper p-5 "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center  bg-ink text-xs font-black text-paper">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-black text-ink">
                          {user.name}
                        </p>

                        <p className="truncate text-xs text-ink/40">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ring-1 ring-inset ${getRoleClasses(
                        user.role,
                      )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-4 border-y border-line py-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Joined
                      </p>

                      <p className="mt-1 text-xs font-bold text-ink/70">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Orders
                      </p>

                      <p className="mt-1 text-sm font-black text-ink">
                        {user.orderCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Spent
                      </p>

                      <p className="mt-1 text-sm font-black text-ink">
                        ${user.spent.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewUser(user)}
                    className="flex w-full items-center justify-center gap-2  bg-ink px-4 py-3 text-xs font-bold text-paper transition hover:bg-bottle-dark"
                  >
                    <Eye size={15} />
                    View
                  </button>
                </div>
              ))}

              {filteredUsers.length === 0 && (
                <div className=" border border-line bg-paper px-6 py-16 text-center ">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center  bg-[#F4F1EB] text-ink/40">
                    <UsersIcon size={28} />
                  </div>

                  <h3 className="mt-5 font-display text-lg text-ink">
                    No users found
                  </h3>

                  <p className="mt-2 text-sm text-ink/50">
                    Try changing your search or filters.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto  bg-paper ">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-5 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
                  User Profile
                </p>

                <h2 className="mt-1 font-display text-xl text-ink">
                  {selectedUser.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="flex h-10 w-10 items-center justify-center  bg-[#F4F1EB] text-ink/50 transition hover:bg-line hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-7">
              {}
              <div className=" bg-ink p-6 text-paper">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center  bg-paper text-xl font-black text-ink">
                    {getInitials(selectedUser.name)}
                  </div>

                  <div>
                    <h3 className="font-display text-xl">
                      {selectedUser.name}
                    </h3>

                    <p className="mt-1 text-sm text-ink/40">
                      {selectedUser.email}
                    </p>

                    <div className="mt-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${getRoleClasses(
                          selectedUser.role,
                        )}`}
                      >
                        {getRoleLabel(selectedUser.role)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className=" border border-line p-5">
                <h3 className="mb-4 text-sm font-black text-ink">
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center  bg-[#F4F1EB] text-ink/50">
                      <Mail size={15} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Email
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-ink/70">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center  bg-[#F4F1EB] text-ink/50">
                      <CalendarDays size={15} />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                        Joined
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-ink/70">
                        {formatDate(selectedUser.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div className="grid grid-cols-2 gap-4">
                <div className=" bg-[#F4F1EB] p-4">
                  <ShoppingBag size={17} className="text-ink/50" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Total Orders
                  </p>

                  <p className="mt-1 text-lg font-black text-ink">
                    {selectedUser.orderCount}
                  </p>
                </div>

                <div className=" bg-[#F4F1EB] p-4">
                  <DollarSign size={17} className="text-ink/50" />

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-ink/40">
                    Total Spent
                  </p>

                  <p className="mt-1 text-lg font-black text-ink">
                    ${selectedUser.spent.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Users;
