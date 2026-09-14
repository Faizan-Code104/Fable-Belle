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
              <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] px-5">
                <div className="w-full max-w-xl rounded-[30px] border border-[#E4DED7] bg-white px-6 py-14 text-center shadow-[0_20px_55px_rgba(31,45,34,0.06)] sm:px-10 sm:py-16">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9A5937]">
                    Ectoo
                  </p>

                  <h1 className="mt-4 font-display text-7xl leading-none text-[#1F2D22] sm:text-8xl">
                    404
                  </h1>

                  <h2 className="mt-5 font-display text-3xl text-[#111311]">
                    Page not found
                  </h2>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#5E5B57]">
                    The page you&apos;re looking for doesn&apos;t exist or may have been moved.
                  </p>

                  <Link
                    to="/"
                    className="mt-8 inline-flex min-h-12 items-center justify-center rounded-[14px] bg-[#1F2D22] px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F4C3A]"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
};

export default App;
