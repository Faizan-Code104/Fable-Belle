import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  Clock3,
  RotateCcw,
  ChevronDown,
  ArrowLeft,
  Loader2,
  ImageOff,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { useCart } from "./CartContext";
import { API_BASE_URL } from "../config";

const API_URL = `${API_BASE_URL}/api/products`;
const SERVER_URL = API_BASE_URL;

const ShopDetails = () => {
  const pageRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] =
    useState("");

  const [activeImage, setActiveImage] =
    useState(0);

  const [quantity, setQuantity] = useState(1);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  const [openSection, setOpenSection] =
    useState("description");

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${SERVER_URL}${image}`;
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setErrorMessage("");
        setProduct(null);
        setActiveImage(0);

        const response = await fetch(
          `${API_URL}/${id}`
        );

        let data = {};

        try {
          data = await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Product not found."
          );
        }

        setProduct(data.product);
      } catch (error) {
        setErrorMessage(
          error?.message ||
            "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) =>
      Math.max(1, prev - 1)
    );
  };

  const buildCartItem = () => ({
    id: product._id || product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    image: getImageUrl(
      product.images?.[0]
    ),
    quantity,
  });

  const handleAddToCart = () => {
    if (!product) return;

    const cartProduct =
      buildCartItem();

    addToCart(cartProduct);
  };

  const handleBuyNow = () => {
    if (!product) return;

    const checkoutProduct =
      buildCartItem();

    addToCart(checkoutProduct);

    navigate("/cart");
  };


  useEffect(() => {
    const elements = pageRef.current?.querySelectorAll("[data-reveal]");

    if (!elements?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("ectoo-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -25px 0px" }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [product]);

  const toggleSection = (section) => {
    setOpenSection((prev) =>
      prev === section ? "" : section
    );
  };

  

  if (loading) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-3 bg-white px-4">
        <Loader2
          size={30}
          className="animate-spin text-[#111311]"
        />

        <p className="text-sm font-medium text-[#5E5B57]">
          Loading product...
        </p>
      </section>
    );
  }

  

  if (errorMessage || !product) {
    return (
      <section className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-white px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center bg-[#F5F1EC] text-[#5E5B57]/70">
          <ShoppingBag size={26} />
        </div>

        <h1 className="font-display text-3xl text-[#111311]">
          Product not found
        </h1>

        <p className="max-w-md text-sm leading-6 text-[#5E5B57]">
          {errorMessage ||
            "This product may have been removed or the link is incorrect."}
        </p>

        <Link
          to="/shop"
          className="mt-2 inline-flex items-center gap-2 bg-[#1F2D22] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#3F4C3A]"
        >
          <ArrowLeft size={16} />

          Back to Shop
        </Link>
      </section>
    );
  }

  const images =
    product.images &&
    product.images.length > 0
      ? product.images
      : [];

  const currentImage =
    images[activeImage] ||
    images[0];

  const inStock =
    Number(product.stock) > 0;

  return (
    <section ref={pageRef} className="min-h-screen overflow-x-hidden bg-[#FAF8F5]">
      <style>{`
        [data-reveal] {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .8s cubic-bezier(.22,1,.36,1), transform .8s cubic-bezier(.22,1,.36,1);
        }
        [data-reveal="left"] { transform: translateX(-38px); }
        [data-reveal="right"] { transform: translateX(38px); }
        [data-reveal="scale"] { transform: scale(.97); }
        [data-reveal].ectoo-visible { opacity: 1; transform: translate(0,0) scale(1); }
        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
      {}

      <div className="border-b border-[#E4DED7] bg-[#EEE7DF]">
        <div className="mx-auto flex max-w-7xl items-center px-5 py-4 sm:px-8 lg:px-12">
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#5E5B57] transition-colors hover:text-[#111311]"
          >
            <ArrowLeft
              size={17}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />

            Back to Shop
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">

          {}

          <div>
            {}

            <div className="group relative aspect-square overflow-hidden bg-[#F5F1EC]">
              {currentImage ? (
                <img
                  src={getImageUrl(
                    currentImage
                  )}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[#5E5B57]/35">
                  <ImageOff
                    size={40}
                  />
                </div>
              )}

              {product.isFeatured && (
                <div className="absolute left-5 top-5 bg-[#1F2D22] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white">
                  Featured
                </div>
              )}

              {}

              <button
                type="button"
                onClick={() =>
                  setIsWishlisted(
                    !isWishlisted
                  )
                }
                className={`absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition-all duration-300 hover:scale-105 ${
                  isWishlisted
                    ? "text-red-500"
                    : "text-[#5E5B57]"
                }`}
                aria-label="Add to wishlist"
              >
                <Heart
                  size={20}
                  fill={
                    isWishlisted
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            </div>

            {}

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onMouseEnter={() =>
                        setActiveImage(
                          index
                        )
                      }
                      onFocus={() =>
                        setActiveImage(
                          index
                        )
                      }
                      onClick={() =>
                        setActiveImage(
                          index
                        )
                      }
                      className={`group aspect-square overflow-hidden rounded-[14px] border-2 transition-all duration-300 ${
                        activeImage ===
                        index
                          ? "border-[#1F2D22]"
                          : "border-transparent hover:border-[#E4DED7]"
                      }`}
                    >
                      <img
                        src={getImageUrl(
                          image
                        )}
                        alt={`${product.name} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {}

          <div data-reveal="right" className="lg:pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9A5937]">
              {product.category}
            </p>

            <h1 className="mt-3 font-display text-5xl leading-[1.02] text-[#111311] sm:text-6xl">
              {product.name}
            </h1>

            {}

            <div className="mt-6 flex items-center gap-4">
              <span className="text-2xl font-bold text-[#111311]">
                $
                {Number(
                  product.price
                ).toFixed(2)}
              </span>
            </div>

            {}

           <p className="mt-3 text-xs font-bold">
  {inStock ? (
    <span className="text-emerald-600">
      In Stock
    </span>
  ) : (
    <span className="text-red-500">
      Out of Stock
    </span>
  )}
</p>

            {}

            <p className="mt-7 text-sm leading-7 text-[#5E5B57] sm:text-base">
              {product.description}
            </p>

            {}
            <div className="mt-7 overflow-hidden rounded-[20px] border border-[#E4DED7] bg-white px-5">
              <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-[#E4DED7] py-3 text-sm">
                <span className="font-bold text-[#111311]">SKU</span>
                <span className="text-[#5E5B57]">{product.sku || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-4 border-b border-[#E4DED7] py-3 text-sm">
                <span className="font-bold text-[#111311]">Material</span>
                <span className="text-[#5E5B57]">{product.material || "Not provided"}</span>
              </div>
              <div className="grid grid-cols-[110px_1fr] gap-4 py-3 text-sm">
                <span className="font-bold text-[#111311]">Weight</span>
                <span className="text-[#5E5B57]">{product.weight || "Not provided"}</span>
              </div>
            </div>

            <div className="my-8 h-px bg-[#E4DED7]" />

            {}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-[14px] border border-[#E4DED7] bg-[#F5F1EC] px-2 sm:w-36">
                <button
                  type="button"
                  onClick={
                    decreaseQuantity
                  }
                  className="flex h-10 w-10 items-center justify-center text-[#5E5B57] transition-colors hover:bg-white hover:text-[#111311]"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>

                <span className="text-sm font-bold text-[#111311]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={
                    increaseQuantity
                  }
                  className="flex h-10 w-10 items-center justify-center text-[#5E5B57] transition-colors hover:bg-white hover:text-[#111311]"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={!inStock}
                className="flex h-14 flex-1 items-center justify-center gap-3 rounded-[14px] bg-[#1F2D22] px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#3F4C3A] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingBag
                  size={18}
                />

                {inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            </div>

            {}

            <button
              type="button"
              onClick={handleBuyNow}
              disabled={!inStock}
              className="mt-3 flex h-14 w-full items-center justify-center rounded-[14px] border border-[#1F2D22] bg-transparent text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:bg-[#1F2D22] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Buy It Now
            </button>

            {}

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">

              <div className="rounded-[18px] border border-[#E4DED7] bg-[#F5F1EC] p-4">
                <Truck
                  size={20}
                  className="text-[#111311]"
                />

                <p className="mt-3 text-xs font-bold text-[#111311]">
                  Free Standard Shipping
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#5E5B57]/80">
                  Eligible U.S. orders
                </p>
              </div>

              <div className="rounded-[18px] border border-[#E4DED7] bg-[#F5F1EC] p-4">
                <Clock3
                  size={20}
                  className="text-[#111311]"
                />

                <p className="mt-3 text-xs font-bold text-[#111311]">
                  1–2 Business-Day
                  Processing
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#5E5B57]/80">
                  Before shipment
                </p>
              </div>

              <div className="rounded-[18px] border border-[#E4DED7] bg-[#F5F1EC] p-4">
                <RotateCcw
                  size={20}
                  className="text-[#111311]"
                />

                <p className="mt-3 text-xs font-bold text-[#111311]">
                  30-Day Returns
                </p>

                <p className="mt-1 text-[10px] leading-4 text-[#5E5B57]/80">
                  Eligible items
                </p>
              </div>

            </div>
          </div>
        </div>

        {}

        <div data-reveal className="mt-16 rounded-[28px] border border-[#E4DED7] bg-white p-6 sm:p-8 lg:mt-24 lg:p-10">
          <div className="grid gap-12 lg:grid-cols-[280px_1fr]">

            {}

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#9A5937]">
                Product Details
              </p>

              <h2 className="mt-3 font-display text-3xl text-[#111311]">
                Everything you need
                to know.
              </h2>
            </div>

            {}

            <div className="divide-y divide-[#E4DED7]">

              {}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      "description"
                    )
                  }
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-sm font-bold text-[#111311]">
                    Description
                  </span>

                  <ChevronDown
                    size={18}
                    className={`text-[#5E5B57]/70 transition-transform duration-300 ${
                      openSection ===
                      "description"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {openSection ===
                  "description" && (
                  <div className="pb-6 text-sm leading-7 text-[#5E5B57]">
                    <p>
                      {
                        product.description
                      }
                    </p>
                  </div>
                )}
              </div>

              {}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    toggleSection(
                      "shipping"
                    )
                  }
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span className="text-sm font-bold text-[#111311]">
                    Shipping & Returns
                  </span>

                  <ChevronDown
                    size={18}
                    className={`text-[#5E5B57]/70 transition-transform duration-300 ${
                      openSection ===
                      "shipping"
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {openSection ===
                  "shipping" && (
                  <div className="pb-6 text-sm leading-7 text-[#5E5B57]">
                    <p>
                      Orders are
                      processed within
                      1–2 business days.
                    </p>

                    <p className="mt-3">
                      Standard transit
                      time is generally
                      3–7 business days
                      after processing.
                    </p>

                    <p className="mt-3">
                      Free standard
                      shipping is
                      available on
                      eligible orders
                      within the
                      contiguous United
                      States.
                    </p>

                    <p className="mt-3">
                      Eligible products
                      may be returned
                      within 30 days of
                      confirmed delivery
                      in accordance with
                      our Return and
                      Refund Policy.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>

        {}

        <div data-reveal="scale" className="mt-16 rounded-[30px] bg-[#1F2D22] px-6 py-12 text-center text-white shadow-[0_22px_55px_rgba(31,45,34,0.12)] sm:px-10 lg:mt-24 lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
            Ectoo
          </p>

          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl sm:text-4xl">
            Carry your style.
            Wherever life takes
            you.
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70">
            Discover more
            thoughtfully designed
            bags made for modern
            everyday life.
          </p>

          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-[14px] bg-[#F1EEE8] px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#1F2D22] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white"
          >
            Explore Collection

            <ShoppingBag
              size={17}
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ShopDetails;