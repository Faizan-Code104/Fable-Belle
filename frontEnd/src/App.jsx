import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { CartProvider } from "./component/CartContext";
import ScrollToTop from "./component/ScrollToTop";
import AdminRoute from "./component/AdminRoute";

import Layout from "./component/Layout";
import Home from "./component/Home";
import Shop from "./component/Shop";
import Category from "./component/Category";
import Contact from "./component/Contact";
import About from "./component/About";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Cart from "./component/Cart";
import ShopDetails from "./component/ShopDetails";
import Checkout from "./component/Checkout";
import OrderTracking from "./component/OrderTracking";
import ShippingPolicy from "./component/ShippingPolicy";
import ReturnPolicy from "./component/ReturnPolicy";
import PrivacyPolicy from "./component/PrivacyPolicy";
import FAQs from "./component/FAQs";
import TermsAndConditions from "./component/TermsAndConditions";
import PaymentPolicy from "./component/PaymentPolicy";
import OrderCancellationPolicy from "./component/OrderCancellationPolicy";
import CookiePolicy from "./component/CookiePolicy";

import AdminLayout from "./component/Admin/AdminLayout";
import Dashboard from "./component/Admin/Dashboard";
import Products from "./component/Admin/Products";
import Orders from "./component/Admin/Orders";
import Users from "./component/Admin/Users";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <CartProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          <Route
            path="/shop"
            element={
              <Layout>
                <Shop />
              </Layout>
            }
          />

          <Route
            path="/shop/:id"
            element={
              <Layout>
                <ShopDetails />
              </Layout>
            }
          />

          <Route
            path="/categories"
            element={
              <Layout>
                <Category />
              </Layout>
            }
          />

          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />

          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />

          <Route
            path="/cart"
            element={
              <Layout>
                <Cart />
              </Layout>
            }
          />

          <Route
            path="/checkout"
            element={
              <Layout>
                <Checkout />
              </Layout>
            }
          />

          <Route
            path="/track-order"
            element={
              <Layout>
                <OrderTracking />
              </Layout>
            }
          />

          <Route
            path="/shipping-policy"
            element={
              <Layout>
                <ShippingPolicy />
              </Layout>
            }
          />

          <Route
            path="/return-policy"
            element={
              <Layout>
                <ReturnPolicy />
              </Layout>
            }
          />

          <Route
            path="/privacy-policy"
            element={
              <Layout>
                <PrivacyPolicy />
              </Layout>
            }
          />

          <Route
            path="/payment-policy"
            element={
              <Layout>
                <PaymentPolicy />
              </Layout>
            }
          />

          <Route
            path="/order-cancellation-policy"
            element={
              <Layout>
                <OrderCancellationPolicy />
              </Layout>
            }
          />

          <Route
            path="/cookie-policy"
            element={
              <Layout>
                <CookiePolicy />
              </Layout>
            }
          />

          <Route
            path="/faqs"
            element={
              <Layout>
                <FAQs />
              </Layout>
            }
          />

          <Route
            path="/terms-and-conditions"
            element={
              <Layout>
                <TermsAndConditions />
              </Layout>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Products />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Orders />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminLayout>
                  <Users />
                </AdminLayout>
              </AdminRoute>
            }
          />

          <Route
            path="*"
            element={
              <main
                className="flex min-h-screen items-center justify-center bg-[#FFFAF3] px-5 py-12 text-[#17243B]"
                style={{
                  fontFamily: "'Onest', sans-serif",
                }}
              >
                <div className="w-full max-w-2xl border border-[#17243B]/25 bg-[#FFFAF3] shadow-[10px_10px_0_#EADCC8] sm:shadow-[16px_16px_0_#EADCC8]">
                  <div className="flex items-center justify-between gap-4 border-b border-[#17243B]/25 px-6 py-5 sm:px-10">
                    <Link
                      to="/"
                      className="text-sm font-semibold tracking-tight transition-colors hover:text-[#B58A50] sm:text-base"
                    >
                      FableBelle.com
                    </Link>

                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#535B67]">
                      Page unavailable
                    </span>
                  </div>

                  <div className="px-6 py-12 sm:px-10 sm:py-16">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#B58A50] sm:text-xs">
                      A little off course
                    </p>

                    <h1 className="mt-5 text-[100px] font-medium leading-none tracking-[-0.08em] sm:text-[150px]">
                      404<span className="text-[#B58A50]">.</span>
                    </h1>

                    <h2 className="mt-6 text-3xl font-medium leading-tight tracking-[-0.05em] sm:text-4xl">
                      Let&apos;s find your way back.
                    </h2>

                    <p className="mt-4 max-w-md text-sm leading-7 text-[#535B67] sm:text-base">
                      The page you&apos;re looking for doesn&apos;t exist or
                      may have been moved.
                    </p>

                    <Link
                      to="/"
                      className="mt-8 inline-flex min-h-12 items-center justify-between gap-10 border border-[#17243B] bg-[#17243B] px-6 py-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#263956] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B58A50]"
                    >
                      Back to home
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>

                  <div className="border-t border-[#17243B]/25 bg-[#EADCC8] px-6 py-4 sm:px-10">
                    <p className="text-xs text-[#17243B]">
                      Thoughtfully carried, clearly explained.
                    </p>
                  </div>
                </div>
              </main>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;