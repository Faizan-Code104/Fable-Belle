import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  ImageOff,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { API_BASE_URL } from "../../config";
import { BUSINESS_INFO } from "../../storeInfo";

const apiBase = String(API_BASE_URL || "").replace(/\/+$/, "");
const API_URL = `${apiBase}/api/products`;
const MAX_IMAGES = 4;

const CATEGORIES = [
  "Shoulder Bags",
  "Handbags",
  "Tote Bags",
  "Crossbody Bags",
  "Hobo Bags",
];

const INITIAL_FORM = {
  name: "",
  category: "Shoulder Bags",
  price: "",
  stock: "",
  sku: "",
  material: "",
  weight: "",
  description: "",
  isFeatured: false,
};

const getId = (product) => String(product?._id || product?.id || "");

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

const getImageUrl = (image) => {
  if (typeof image !== "string" || !image.trim()) return "";

  const value = image.trim();

  return /^https?:\/\//i.test(value)
    ? value
    : `${apiBase}/${value.replace(/^\/+/, "")}`;
};

const getStatus = (product) => {
  const status = String(product.status || "").trim();

  if (["Active", "Low Stock", "Out of Stock"].includes(status)) {
    return status;
  }

  const stock = numeric(product.stock);
  return stock <= 0 ? "Out of Stock" : stock <= 5 ? "Low Stock" : "Active";
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

  return { Authorization: `Bearer ${token}` };
};

const ProductImage = ({ image, name }) => {
  const src = getImageUrl(image);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return src && !failed ? (
    <img
      src={src}
      alt={name || "Product"}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <ImageOff size={26} aria-hidden="true" />
  );
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [fetchError, setFetchError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [featuredFilter, setFeaturedFilter] = useState("All");
  const [sortBy, setSortBy] = useState("latest");

  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [uploads, setUploads] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [actionError, setActionError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formRef = useRef(null);
  const headingRef = useRef(null);
  const uploadUrls = useRef(new Set());
  const mountedRef = useRef(true);
  const mutationRef = useRef(null);
  const mutationLock = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      mutationRef.current?.abort();
      uploadUrls.current.forEach((url) => URL.revokeObjectURL(url));
      uploadUrls.current.clear();
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchProducts = async () => {
      setLoading(true);
      setFetchError("");

      try {
        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Unable to load products.");
        }

        if (!Array.isArray(data.products)) {
          throw new Error("The products response is incomplete.");
        }

        if (active) {
          setProducts(
            data.products.filter(
              (product) =>
                product && typeof product === "object" && getId(product)
            )
          );
          setLoaded(true);
        }
      } catch (error) {
        if (active && error.name !== "AbortError") {
          setFetchError(error.message || "Unable to load products.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      active = false;
      controller.abort();
    };
  }, [refreshCount]);

  const categories = useMemo(
    () => [
      ...new Set([
        ...CATEGORIES,
        ...products.map((product) => product.category).filter(Boolean),
      ]),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    const result = products.filter((product) => {
      const text = [product.name, product.category, product.sku]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!query || text.includes(query)) &&
        (categoryFilter === "All" || product.category === categoryFilter) &&
        (statusFilter === "All" || getStatus(product) === statusFilter) &&
        (featuredFilter === "All" ||
          (featuredFilter === "Featured"
            ? product.isFeatured === true
            : product.isFeatured !== true))
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "price-low") return numeric(a.price) - numeric(b.price);
      if (sortBy === "price-high") return numeric(b.price) - numeric(a.price);
      if (sortBy === "stock-low") return numeric(a.stock) - numeric(b.stock);
      if (sortBy === "featured") {
        return Number(b.isFeatured === true) - Number(a.isFeatured === true);
      }
      return timestamp(b.createdAt) - timestamp(a.createdAt);
    });
  }, [
    products,
    searchTerm,
    categoryFilter,
    statusFilter,
    featuredFilter,
    sortBy,
  ]);

  const releaseUploads = () => {
    uploadUrls.current.forEach((url) => URL.revokeObjectURL(url));
    uploadUrls.current.clear();
    setUploads([]);
  };

  const resetForm = () => {
    releaseUploads();
    setFormData(INITIAL_FORM);
    setErrors({});
  };

  const openCreate = () => {
    resetForm();
    setActionError("");
    setSuccessMessage("");
    setCreating(true);

    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const closeCreate = () => {
    if (mutationLock.current) return;

    resetForm();
    setCreating(false);
    setActionError("");

    requestAnimationFrame(() => headingRef.current?.focus());
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((current) => ({ ...current, [name]: "" }));
    setActionError("");
  };

  const handleImages = (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    let message = "";

    if (uploads.length + files.length > MAX_IMAGES) {
      message = `You can upload a maximum of ${MAX_IMAGES} images.`;
    } else if (
      files.some(
        (file) =>
          !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
            file.type
          )
      )
    ) {
      message = "Only JPG, JPEG, PNG and WEBP images are allowed.";
    } else if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      message = "Each image must be 5MB or less.";
    }

    if (message) {
      setErrors((current) => ({ ...current, images: message }));
      return;
    }

    const additions = files.map((file) => {
      const url = URL.createObjectURL(file);
      uploadUrls.current.add(url);
      return { file, url };
    });

    setUploads((current) => [...current, ...additions]);
    setErrors((current) => ({ ...current, images: "" }));
  };

  const removeImage = (index) => {
    const upload = uploads[index];

    if (upload) {
      URL.revokeObjectURL(upload.url);
      uploadUrls.current.delete(upload.url);
    }

    setUploads((current) => current.filter((_, position) => position !== index));
    setErrors((current) => ({ ...current, images: "" }));
  };

  const validateForm = () => {
    const next = {};

    if (formData.name.trim().length < 3) {
      next.name = "Product name must be at least 3 characters.";
    }

    if (!formData.category) next.category = "Select a category.";

    if (
      formData.price === "" ||
      !Number.isFinite(Number(formData.price)) ||
      Number(formData.price) <= 0
    ) {
      next.price = "Enter a price greater than zero.";
    }

    if (
      formData.stock === "" ||
      !Number.isInteger(Number(formData.stock)) ||
      Number(formData.stock) < 0
    ) {
      next.stock = "Enter a whole stock quantity of zero or more.";
    }

    ["sku", "material", "weight"].forEach((field) => {
      if (!formData[field].trim()) {
        next[field] = `${field === "sku" ? "SKU" : field[0].toUpperCase() + field.slice(1)} is required.`;
      }
    });

    if (formData.description.trim().length < 10) {
      next.description = "Description must be at least 10 characters.";
    }

    if (!uploads.length) next.images = "Add at least one product image.";

    setErrors(next);

    const firstField = Object.keys(next)[0];

    if (firstField) {
      formRef.current?.elements.namedItem(firstField)?.focus();
      return false;
    }

    return true;
  };

  const createProduct = async (event) => {
    event.preventDefault();

    if (mutationLock.current || loading || !validateForm()) return;

    const controller = new AbortController();
    mutationRef.current = controller;
    mutationLock.current = true;
    setSubmitting(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const body = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        body.append(
          key,
          typeof value === "string" ? value.trim() : String(value)
        );
      });

      uploads.forEach(({ file }) => body.append("images", file));

      const response = await fetch(API_URL, {
        method: "POST",
        headers: authHeaders(),
        signal: controller.signal,
        body,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to create product.");
      }

      if (!data.product || !getId(data.product)) {
        throw new Error(
          "The creation response is incomplete. Refresh inventory before trying again."
        );
      }

      if (!mountedRef.current) return;

      setProducts((current) => [
        data.product,
        ...current.filter((product) => getId(product) !== getId(data.product)),
      ]);

      resetForm();
      setCreating(false);
      setSuccessMessage("Product created successfully.");
    } catch (error) {
      if (mountedRef.current && error.name !== "AbortError") {
        setActionError(error.message || "Unable to create product.");
      }
    } finally {
      mutationLock.current = false;
      if (mountedRef.current) setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteProduct || mutationLock.current || loading) return;

    const productId = getId(deleteProduct);
    const controller = new AbortController();

    mutationRef.current = controller;
    mutationLock.current = true;
    setDeleting(true);
    setActionError("");
    setSuccessMessage("");

    try {
      const response = await fetch(
        `${API_URL}/${encodeURIComponent(productId)}`,
        {
          method: "DELETE",
          headers: authHeaders(),
          signal: controller.signal,
        }
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Unable to delete product.");
      }

      if (!mountedRef.current) return;

      setProducts((current) =>
        current.filter((product) => getId(product) !== productId)
      );
      setDeleteProduct(null);
      setSuccessMessage("Product deleted successfully.");
    } catch (error) {
      if (mountedRef.current && error.name !== "AbortError") {
        setActionError(error.message || "Unable to delete product.");
      }
    } finally {
      mutationLock.current = false;
      if (mountedRef.current) setDeleting(false);
    }
  };

  const fields = [
    ["name", "Product name", "text", "Enter product name"],
    ["price", "Price (USD)", "number", "0.00"],
    ["stock", "Stock quantity", "number", "0"],
    ["sku", "SKU", "text", "FB-BAG-001"],
    ["material", "Material", "text", "Enter actual material"],
    ["weight", "Weight", "text", "Enter weight with unit"],
  ];

  return (
    <main className="fbproducts">
      <style>{styles}</style>

      <header className="fbproducts-heading">
        <div>
          <p className="fbproducts-eyebrow">
            {BUSINESS_INFO.businessName} / Inventory
          </p>
          <h1 ref={headingRef} tabIndex={-1}>
            {creating ? "A new addition." : "Your collection."}
          </h1>
          <p>
            {creating
              ? "Add product details, stock and photography."
              : "Manage your products, inventory and featured pieces."}
          </p>
        </div>

        <div className="fbproducts-actions">
          {creating ? (
            <button
              type="button"
              className="fbproducts-secondary"
              onClick={closeCreate}
              disabled={submitting}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Back to inventory
            </button>
          ) : (
            <>
              <button
                type="button"
                className="fbproducts-secondary"
                onClick={() => setRefreshCount((count) => count + 1)}
                disabled={loading || deleting}
              >
                <RefreshCw
                  size={16}
                  className={loading ? "fbproducts-spin" : ""}
                  aria-hidden="true"
                />
                Refresh
              </button>
              <button
                type="button"
                className="fbproducts-primary"
                onClick={openCreate}
                disabled={deleting}
              >
                <Plus size={17} aria-hidden="true" />
                Add product
              </button>
            </>
          )}
        </div>
      </header>

      {fetchError && (
        <div className="fbproducts-error" role="alert">
          {fetchError}
        </div>
      )}

      {actionError && (
        <div className="fbproducts-error" role="alert">
          {actionError}
        </div>
      )}

      <div role="status" aria-live="polite">
        {successMessage && (
          <p className="fbproducts-success">{successMessage}</p>
        )}
      </div>

      {creating ? (
        <form ref={formRef} onSubmit={createProduct} noValidate>
          <fieldset disabled={submitting} className="fbproducts-fieldset">
            <legend className="fbproducts-sr-only">New product details</legend>

            <div className="fbproducts-editor">
              <section className="fbproducts-panel">
                <div className="fbproducts-panel-heading">
                  <span>01</span>
                  <h2>Product information</h2>
                </div>

                <div className="fbproducts-fields">
                  {fields.map(([name, label, type, placeholder]) => (
                    <div key={name} className="fbproducts-field">
                      <label htmlFor={`fbproducts-${name}`}>{label}</label>
                      <input
                        id={`fbproducts-${name}`}
                        name={name}
                        type={type}
                        value={formData[name]}
                        onChange={handleChange}
                        placeholder={placeholder}
                        min={type === "number" ? 0 : undefined}
                        step={name === "price" ? "0.01" : name === "stock" ? "1" : undefined}
                        required
                        aria-invalid={Boolean(errors[name])}
                        aria-describedby={errors[name] ? `fbproducts-${name}-error` : undefined}
                      />
                      {errors[name] && (
                        <p id={`fbproducts-${name}-error`} className="fbproducts-field-error">
                          {errors[name]}
                        </p>
                      )}
                    </div>
                  ))}

                  <div className="fbproducts-field fbproducts-wide">
                    <label htmlFor="fbproducts-category">Category</label>
                    <select
                      id="fbproducts-category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      aria-invalid={Boolean(errors.category)}
                    >
                      {categories.map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="fbproducts-field-error">{errors.category}</p>
                    )}
                  </div>

                  <div className="fbproducts-field fbproducts-wide">
                    <label htmlFor="fbproducts-description">Description</label>
                    <textarea
                      id="fbproducts-description"
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the actual product and its details…"
                      required
                      aria-invalid={Boolean(errors.description)}
                      aria-describedby={errors.description ? "fbproducts-description-error" : undefined}
                    />
                    {errors.description && (
                      <p id="fbproducts-description-error" className="fbproducts-field-error">
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              <section className="fbproducts-panel">
                <div className="fbproducts-panel-heading">
                  <span>02</span>
                  <h2>Photography &amp; visibility</h2>
                </div>

                <p className="fbproducts-help">
                  The first image is the main product image. Upload up to four
                  JPG, PNG or WEBP images, 5MB each.
                </p>

                <div className="fbproducts-previews">
                  {uploads.map((upload, index) => (
                    <div className="fbproducts-preview" key={upload.url}>
                      <img src={upload.url} alt={`Product preview ${index + 1}`} />
                      <span>{index === 0 ? "Main image" : `View ${index + 1}`}</span>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X size={16} aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="fbproducts-field">
                  <label htmlFor="fbproducts-images">
                    Product images · {uploads.length}/{MAX_IMAGES}
                  </label>
                  <input
                    id="fbproducts-images"
                    name="images"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImages}
                    disabled={submitting || uploads.length >= MAX_IMAGES}
                    aria-invalid={Boolean(errors.images)}
                    aria-describedby={errors.images ? "fbproducts-images-error" : undefined}
                  />
                  {errors.images && (
                    <p id="fbproducts-images-error" className="fbproducts-field-error">
                      {errors.images}
                    </p>
                  )}
                </div>

                <label className="fbproducts-featured">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Show in Featured Pieces</strong>
                    <span>
                      Keep this product in its category and also feature it on
                      the homepage.
                    </span>
                  </span>
                </label>

                <div className="fbproducts-form-footer">
                  <button
                    type="button"
                    className="fbproducts-secondary"
                    onClick={closeCreate}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="fbproducts-primary"
                    disabled={submitting || loading}
                  >
                    {submitting && (
                      <Loader2 size={17} className="fbproducts-spin" aria-hidden="true" />
                    )}
                    {submitting ? "Creating…" : "Create product"}
                  </button>
                </div>
              </section>
            </div>
          </fieldset>
        </form>
      ) : (
        <>
          <section className="fbproducts-summary" aria-label="Inventory summary">
            {[
              ["Total products", products.length],
              ["Active", products.filter((product) => getStatus(product) === "Active").length],
              ["Low stock", products.filter((product) => getStatus(product) === "Low Stock").length],
              ["Featured", products.filter((product) => product.isFeatured === true).length],
            ].map(([label, count]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{loaded ? count : "—"}</strong>
              </div>
            ))}
          </section>

          <div className="fbproducts-tools">
            <div className="fbproducts-search">
              <Search size={18} aria-hidden="true" />
              <label htmlFor="fbproducts-search" className="fbproducts-sr-only">
                Search products
              </label>
              <input
                id="fbproducts-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search name, category or SKU…"
              />
            </div>

            {[
              ["category", "Category", categoryFilter, setCategoryFilter, ["All", ...categories]],
              ["status", "Stock status", statusFilter, setStatusFilter, ["All", "Active", "Low Stock", "Out of Stock"]],
              ["featured", "Visibility", featuredFilter, setFeaturedFilter, ["All", "Featured", "Not Featured"]],
            ].map(([key, label, value, setter, options]) => (
              <div className="fbproducts-filter" key={key}>
                <label htmlFor={`fbproducts-filter-${key}`}>{label}</label>
                <select
                  id={`fbproducts-filter-${key}`}
                  value={value}
                  onChange={(event) => setter(event.target.value)}
                >
                  {options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="fbproducts-results">
            <span role="status" aria-live="polite">
              {loading ? "Loading inventory…" : `${filteredProducts.length} products shown`}
            </span>
            <div>
              <label htmlFor="fbproducts-sort">Sort by</label>
              <select
                id="fbproducts-sort"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="latest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock-low">Lowest stock</option>
                <option value="featured">Featured first</option>
              </select>
            </div>
          </div>

          {deleteProduct && (
            <section className="fbproducts-delete" aria-labelledby="fbproducts-delete-title">
              <div>
                <h2 id="fbproducts-delete-title">Delete {deleteProduct.name}?</h2>
                <p>This action cannot be undone.</p>
              </div>
              <div>
                <button
                  type="button"
                  className="fbproducts-secondary"
                  disabled={deleting}
                  onClick={() => {
                    setDeleteProduct(null);
                    setActionError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="fbproducts-danger"
                  disabled={deleting || loading}
                  onClick={confirmDelete}
                >
                  {deleting ? "Deleting…" : "Delete product"}
                </button>
              </div>
            </section>
          )}

          <section className="fbproducts-inventory" aria-label="Products" aria-busy={loading}>
            {loading && !loaded ? (
              <div className="fbproducts-empty" role="status">
                <Loader2 size={28} className="fbproducts-spin" aria-hidden="true" />
                <p>Loading your collection…</p>
              </div>
            ) : !filteredProducts.length ? (
              <div className="fbproducts-empty">
                <p>{fetchError && !loaded ? "Inventory could not load." : "No matching products."}</p>
                <button
                  type="button"
                  className="fbproducts-secondary"
                  onClick={() => {
                    setSearchTerm("");
                    setCategoryFilter("All");
                    setStatusFilter("All");
                    setFeaturedFilter("All");
                    setSortBy("latest");
                  }}
                >
                  Clear filters
                </button>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <article className="fbproducts-product" key={getId(product)}>
                  <div className="fbproducts-product-image">
                    <ProductImage image={product.images?.[0]} name={product.name} />
                  </div>

                  <div className="fbproducts-product-info">
                    <p className="fbproducts-eyebrow">{product.category || "Uncategorised"}</p>
                    <h2>{product.name || "Product"}</h2>
                    <p>SKU: {product.sku || "Not provided"}</p>
                    <div className="fbproducts-badges">
                      <span>{getStatus(product)}</span>
                      {product.isFeatured === true && <span>Featured</span>}
                    </div>
                  </div>

                  <div className="fbproducts-product-values">
                    <strong>{money(product.price)}</strong>
                    <span>{numeric(product.stock)} in stock</span>
                  </div>

                  <div className="fbproducts-product-actions">
                    <Link
                      to={`/shop/${encodeURIComponent(getId(product))}`}
                      aria-label={`View ${product.name || "product"}`}
                    >
                      <ArrowUpRight size={19} aria-hidden="true" />
                    </Link>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={() => {
                        setDeleteProduct(product);
                        setActionError("");
                        setSuccessMessage("");
                      }}
                      aria-label={`Delete ${product.name || "product"}`}
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </>
      )}
    </main>
  );
};

const styles = `
  .fbproducts {
    --ink:#173f36; --deep:#102e28; --paper:#fffdf5;
    --bone:#f5f0e6; --brass:#a56e4f; --muted:#626e67;
    --line:rgba(23,63,54,.17);
    min-width:0; padding:clamp(18px,3vw,36px);
    background:var(--bone); color:var(--ink);
    font-family:'Onest',ui-sans-serif,system-ui,sans-serif;
    line-height:1.6;
  }
  .fbproducts *, .fbproducts *::before, .fbproducts *::after { box-sizing:border-box; }
  .fbproducts a { color:inherit; text-decoration:none; }
  .fbproducts button, .fbproducts input, .fbproducts select, .fbproducts textarea { font:inherit; }
  .fbproducts button { cursor:pointer; }
  .fbproducts button:disabled { cursor:not-allowed; opacity:.5; }
  .fbproducts a:focus-visible, .fbproducts button:focus-visible,
  .fbproducts input:focus-visible, .fbproducts select:focus-visible,
  .fbproducts textarea:focus-visible, .fbproducts h1:focus-visible {
    outline:2px solid var(--brass); outline-offset:4px;
  }
  .fbproducts-heading {
    display:flex; align-items:center; justify-content:space-between;
    gap:25px; padding-bottom:25px; border-bottom:1px solid var(--line);
  }
  .fbproducts-eyebrow {
    margin:0; color:var(--brass); font-size:9px;
    font-weight:600; letter-spacing:.12em; text-transform:uppercase;
  }
  .fbproducts-heading h1 {
    margin:10px 0 8px; font-size:clamp(32px,4vw,44px);
    font-weight:500; line-height:1.15; letter-spacing:-.05em;
  }
  .fbproducts-heading > div > p:last-child { margin:0; color:var(--muted); font-size:12px; }
  .fbproducts-actions { display:flex; gap:10px; flex-shrink:0; }
  .fbproducts-primary, .fbproducts-secondary, .fbproducts-danger {
    display:inline-flex; align-items:center; justify-content:center;
    gap:10px; min-height:46px; padding:12px 17px;
    border:1px solid var(--ink); background:var(--ink);
    color:#fff; font-size:11px;
  }
  .fbproducts-primary:hover:not(:disabled) { background:var(--deep); }
  .fbproducts-secondary { border-color:var(--line); background:var(--paper); color:var(--ink); }
  .fbproducts-danger { border-color:#a13832; background:#a13832; }
  .fbproducts-summary {
    display:grid; grid-template-columns:repeat(4,minmax(0,1fr));
    margin-block:25px; border:1px solid var(--line); background:var(--paper);
  }
  .fbproducts-summary > div { padding:22px; border-right:1px solid var(--line); }
  .fbproducts-summary > div:last-child { border-right:0; background:#e9eddf; }
  .fbproducts-summary span { display:block; color:var(--muted); font-size:10px; }
  .fbproducts-summary strong { display:block; margin-top:8px; font-size:30px; font-weight:500; }
  .fbproducts-tools {
    display:grid; grid-template-columns:minmax(0,1.7fr) repeat(3,minmax(0,1fr)); gap:12px;
  }
  .fbproducts-search {
    display:flex; align-items:center; gap:12px; min-width:0;
    padding-inline:14px; border:1px solid var(--line); background:var(--paper);
  }
  .fbproducts-search > svg { flex-shrink:0; }
  .fbproducts-search input {
    width:100%; min-width:0; min-height:56px; border:0;
    background:transparent; color:var(--ink); font-size:16px;
  }
  .fbproducts-search input::placeholder { color:var(--muted); font-size:11px; }
  .fbproducts-filter { min-width:0; padding:7px 12px; border:1px solid var(--line); background:var(--paper); }
  .fbproducts-filter label { display:block; color:var(--muted); font-size:9px; }
  .fbproducts-filter select {
    width:100%; min-width:0; min-height:32px; border:0;
    background:transparent; color:var(--ink); font-size:16px;
  }
  .fbproducts-results {
    display:flex; align-items:center; justify-content:space-between;
    gap:18px; padding-block:17px; color:var(--muted); font-size:10px;
  }
  .fbproducts-results > div { display:flex; align-items:center; gap:12px; }
  .fbproducts-results select {
    max-width:100%; min-height:44px; padding:8px;
    border:1px solid var(--line); background:var(--paper);
    color:var(--ink); font-size:16px;
  }
  .fbproducts-inventory { border:1px solid var(--line); background:var(--paper); animation:fbproductsEnter .4s ease both; }
  .fbproducts-product {
    display:grid; grid-template-columns:110px minmax(0,1fr) auto auto;
    align-items:center; gap:25px; padding:22px;
    border-bottom:1px solid var(--line);
  }
  .fbproducts-product:last-child { border-bottom:0; }
  .fbproducts-product-image {
    display:grid; place-items:center; width:110px; height:120px;
    background:#eeece5; color:var(--muted);
  }
  .fbproducts-product-image img { width:100%; height:100%; padding:10px; object-fit:contain; }
  .fbproducts-product-info { min-width:0; }
  .fbproducts-product h2 { margin:9px 0 5px; font-size:20px; font-weight:500; letter-spacing:-.035em; overflow-wrap:anywhere; }
  .fbproducts-product-info > p:not(.fbproducts-eyebrow) { margin:0; color:var(--muted); font-size:10px; overflow-wrap:anywhere; }
  .fbproducts-badges { display:flex; gap:7px; flex-wrap:wrap; margin-top:13px; }
  .fbproducts-badges span { padding:4px 8px; background:var(--bone); font-size:9px; }
  .fbproducts-product-values { text-align:right; }
  .fbproducts-product-values strong { display:block; font-size:20px; font-weight:500; }
  .fbproducts-product-values span { display:block; margin-top:7px; color:var(--muted); font-size:10px; }
  .fbproducts-product-actions { display:flex; gap:8px; }
  .fbproducts-product-actions a, .fbproducts-product-actions button {
    display:grid; place-items:center; width:44px; height:44px;
    border:1px solid var(--line); background:transparent; color:var(--ink);
  }
  .fbproducts-product-actions button:hover:not(:disabled) { color:#a13832; border-color:#a13832; }
  .fbproducts-editor {
    display:grid; grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);
    align-items:start; gap:22px; margin-top:25px;
  }
  .fbproducts-panel { min-width:0; padding:26px; border:1px solid var(--line); background:var(--paper); }
  .fbproducts-panel-heading { display:flex; align-items:baseline; gap:14px; margin-bottom:24px; padding-bottom:20px; border-bottom:1px solid var(--line); }
  .fbproducts-panel-heading > span { color:var(--brass); font-size:10px; }
  .fbproducts-panel-heading h2 { margin:0; font-size:22px; font-weight:500; letter-spacing:-.04em; }
  .fbproducts-fieldset { min-width:0; margin:0; padding:0; border:0; }
  .fbproducts-fields { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }
  .fbproducts-wide { grid-column:1 / -1; }
  .fbproducts-field { min-width:0; }
  .fbproducts-field > label { display:block; margin-bottom:9px; font-size:11px; font-weight:500; }
  .fbproducts-field input, .fbproducts-field select, .fbproducts-field textarea {
    width:100%; min-width:0; min-height:48px; padding:12px;
    border:1px solid var(--line); background:#fff; color:var(--ink); font-size:16px;
  }
  .fbproducts-field input::placeholder, .fbproducts-field textarea::placeholder { font-size:11px; color:var(--muted); }
  .fbproducts-field textarea { resize:vertical; }
  .fbproducts-field [aria-invalid="true"] { border-color:#a13832; }
  .fbproducts-field input[type="file"] { font-size:11px; padding:12px 8px; }
  .fbproducts-field input::file-selector-button {
    padding:8px 10px; margin-right:10px; border:1px solid var(--line);
    background:var(--bone); color:var(--ink); cursor:pointer;
  }
  .fbproducts-field-error { margin:8px 0 0; color:#a13832; font-size:11px; }
  .fbproducts-help { margin:0 0 20px; color:var(--muted); font-size:11px; line-height:1.9; }
  .fbproducts-previews { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:12px; margin-bottom:20px; }
  .fbproducts-preview { position:relative; aspect-ratio:1; min-width:0; background:var(--bone); }
  .fbproducts-preview img { width:100%; height:100%; padding:12px; object-fit:contain; }
  .fbproducts-preview > span { position:absolute; bottom:8px; left:8px; padding:4px 7px; background:var(--paper); font-size:9px; }
  .fbproducts-preview button {
    position:absolute; top:6px; right:6px; display:grid; place-items:center;
    width:44px; height:44px; border:1px solid var(--line); background:var(--paper); color:var(--ink);
  }
  .fbproducts-featured { display:flex; align-items:flex-start; gap:12px; padding:18px; margin-top:23px; border:1px solid var(--line); background:var(--bone); cursor:pointer; }
  .fbproducts-featured input { width:17px; height:17px; margin-top:3px; flex-shrink:0; accent-color:var(--ink); }
  .fbproducts-featured strong { display:block; font-size:12px; font-weight:500; }
  .fbproducts-featured > span > span { display:block; margin-top:6px; color:var(--muted); font-size:10px; line-height:1.9; }
  .fbproducts-form-footer { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:10px; margin-top:24px; }
  .fbproducts-delete {
    display:flex; align-items:center; justify-content:space-between; gap:20px;
    padding:22px; margin-bottom:20px; border:1px solid #dfbdb5; background:#fbefec;
  }
  .fbproducts-delete h2 { margin:0; font-size:19px; font-weight:500; overflow-wrap:anywhere; }
  .fbproducts-delete p { margin:8px 0 0; color:#a13832; font-size:11px; }
  .fbproducts-delete > div:last-child { display:flex; flex-shrink:0; gap:10px; }
  .fbproducts-error, .fbproducts-success { margin:20px 0 0; padding:15px 18px; font-size:12px; overflow-wrap:anywhere; }
  .fbproducts-error { border:1px solid #dfbdb5; background:#fbefec; color:#a13832; }
  .fbproducts-success { border:1px solid var(--line); background:#e9eddf; }
  .fbproducts-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; padding:30px; text-align:center; color:var(--muted); font-size:12px; }
  .fbproducts-sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; }
  .fbproducts-spin { animation:fbproductsSpin 1s linear infinite; }
  @keyframes fbproductsSpin { to { transform:rotate(360deg); } }
  @keyframes fbproductsEnter { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  @media(max-width:1100px) {
    .fbproducts-heading { align-items:flex-start; flex-direction:column; }
    .fbproducts-tools { grid-template-columns:repeat(3,minmax(0,1fr)); }
    .fbproducts-search { grid-column:1 / -1; }
    .fbproducts-editor { grid-template-columns:minmax(0,1fr); }
    .fbproducts-product { gap:18px; }
  }
  @media(max-width:720px) {
    .fbproducts-summary { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .fbproducts-summary > div:nth-child(2) { border-right:0; }
    .fbproducts-summary > div:nth-child(3), .fbproducts-summary > div:nth-child(4) { border-top:1px solid var(--line); }
    .fbproducts-tools { grid-template-columns:minmax(0,1fr); }
    .fbproducts-product { grid-template-columns:80px minmax(0,1fr); padding:18px; }
    .fbproducts-product-image { width:80px; height:100px; }
    .fbproducts-product h2 { font-size:18px; }
    .fbproducts-product-values { text-align:left; }
    .fbproducts-product-actions { justify-content:flex-end; }
    .fbproducts-panel { padding:22px; }
    .fbproducts-delete { align-items:flex-start; flex-direction:column; }
    .fbproducts-results { align-items:flex-start; flex-direction:column; gap:10px; }
    .fbproducts-results > div { width:100%; justify-content:space-between; }
  }
  @media(max-width:420px) {
    .fbproducts-fields { grid-template-columns:minmax(0,1fr); }
    .fbproducts-panel { padding:20px 18px; }
    .fbproducts-actions { width:100%; flex-wrap:wrap; }
    .fbproducts-actions > button { flex:1; }
    .fbproducts-delete > div:last-child { flex-wrap:wrap; width:100%; }
    .fbproducts-summary > div { padding:18px; }
    .fbproducts-product-values strong { font-size:18px; }
  }
  @media(prefers-reduced-motion:reduce) {
    .fbproducts *, .fbproducts *::before, .fbproducts *::after {
      animation:none !important; transition:none !important;
    }
  }
`;

export default Products;