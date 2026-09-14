import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  Store,
  BarChart3,
  User,
} from "lucide-react";

import EctooLogo from "../Logo";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
    },
  ];

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    console.log("Admin Logout");
  };

  return (
    <div className="min-h-screen bg-[#F4F1EB] text-ink">
{sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-ink/50 backdrop-blur-sm lg:hidden"
        />
      )}
<aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-paper transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
<div className="flex h-20 items-center justify-between border-b border-line px-6">
          <Link to="/admin" onClick={closeSidebar}>
            <EctooLogo size="md" />
          </Link>

          <button
            type="button"
            onClick={closeSidebar}
            className="flex h-9 w-9 items-center justify-center text-ink/60 transition-colors hover:bg-[#F4F1EB] hover:text-ink lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
<div className="px-6 pt-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ink/40">
            Administration
          </p>
        </div>
<nav className="flex-1 px-4 py-5">
          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`group flex items-center gap-3 px-4 py-3.5 text-sm font-semibold transition-all duration-200 ${
                    active
                      ? "bg-ink text-paper"
                      : "text-ink/60 hover:bg-[#F4F1EB] hover:text-ink"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.3 : 2}
                    className={`transition-transform duration-200 ${
                      active ? "" : "group-hover:scale-105"
                    }`}
                  />

                  <span>{item.name}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-bottle" />
                  )}
                </Link>
              );
            })}
          </div>
<div className="mt-9">
            <p className="mb-3 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-ink/40">
              Management
            </p>

            <div className="space-y-1.5">
              <button
                type="button"
                className="group flex w-full items-center gap-3 px-4 py-3.5 text-sm font-semibold text-ink/60 transition-all duration-200 hover:bg-[#F4F1EB] hover:text-ink"
              >
                <BarChart3
                  size={19}
                  className="transition-transform duration-200 group-hover:scale-105"
                />
                Analytics
              </button>

              <button
                type="button"
                className="group flex w-full items-center gap-3 px-4 py-3.5 text-sm font-semibold text-ink/60 transition-all duration-200 hover:bg-[#F4F1EB] hover:text-ink"
              >
                <Settings
                  size={19}
                  className="transition-transform duration-200 group-hover:rotate-45"
                />
                Settings
              </button>
            </div>
          </div>
        </nav>
<div className="border-t border-line p-4">
          <Link
            to="/"
            onClick={closeSidebar}
            className="flex items-center gap-3 px-4 py-3.5 text-sm font-semibold text-ink/60 transition-all hover:bg-[#F4F1EB] hover:text-ink"
          >
            <Store size={19} />
            <span>View Store</span>
          </Link>
<div className="mt-2 flex items-center gap-3 bg-[#F4F1EB] p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-sm font-bold text-paper">
              A
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-ink">Admin User</p>
              <p className="truncate text-xs text-ink/50">Administrator</p>
            </div>
          </div>
        </div>
      </aside>
<div className="lg:pl-72">
<header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
<div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open sidebar"
                onClick={() => setSidebarOpen(true)}
                className="flex h-10 w-10 items-center justify-center bg-[#F4F1EB] text-ink/70 transition-colors hover:bg-line lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div className="hidden sm:block">
                <p className="text-xs font-medium text-ink/40">
                  Ectoo Admin
                </p>

                <h1 className="font-display text-xl text-ink">
                  Management Panel
                </h1>
              </div>
            </div>
<div className="flex items-center gap-2 sm:gap-3">
<button
                type="button"
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center text-ink/60 transition-all hover:bg-[#F4F1EB] hover:text-ink"
              >
                <Search size={19} />
              </button>
<button
                type="button"
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center text-ink/60 transition-all hover:bg-[#F4F1EB] hover:text-ink"
              >
                <Bell size={19} />

                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-paper" />
              </button>
<div className="hidden h-8 w-px bg-line sm:block" />
<div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1.5 transition-colors hover:bg-[#F4F1EB]"
                >
                  <div className="flex h-9 w-9 items-center justify-center bg-ink text-xs font-bold text-paper">
                    A
                  </div>

                  <div className="hidden text-left md:block">
                    <p className="text-xs font-bold text-ink">Admin User</p>

                    <p className="text-[10px] text-ink/50">Administrator</p>
                  </div>

                  <ChevronDown
                    size={15}
                    className={`hidden text-ink/40 transition-transform md:block ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
{profileOpen && (
                  <div className="absolute right-0 top-14 w-52 border border-line bg-paper p-2 shadow-lg">
                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold text-ink/60 transition-colors hover:bg-[#F4F1EB] hover:text-ink"
                    >
                      <User size={17} />
                      My Profile
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold text-ink/60 transition-colors hover:bg-[#F4F1EB] hover:text-ink"
                    >
                      <Settings size={17} />
                      Settings
                    </button>

                    <div className="my-1 border-t border-line" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
<main className="min-h-[calc(100vh-5rem)] p-4 sm:p-6 lg:p-8">
          <section className="mx-auto max-w-[1600px]">{children}</section>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
