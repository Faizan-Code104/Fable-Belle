import React, { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../../config";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Package,
  ChevronDown,
  X,
  Upload,
  Star,
  CheckCircle2,
  AlertCircle,
  XCircle,
  SlidersHorizontal,
  Loader2,
  RefreshCw,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";

const API_URL = `${API_BASE_URL}/api/products`;

const SERVER_URL = API_BASE_URL;

const MAX_PRODUCT_IMAGES = 4;

const initialFormData = {
  name: "",
  category: "Shoulder Bags",
  price: "",
  stock: "",
  sku: "",
  material: "",
  weight: "",
  description: "",
  images: [],
  isFeatured: false,
};

const Products = () => {
  const [products, setProducts] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [featuredFilter, setFeaturedFilter] = useState("All");

  const [sortBy, setSortBy] = useState("latest");

  const [showAddModal, setShowAddModal] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);

  const [deleteProduct, setDeleteProduct] = useState(null);

  const [formData, setFormData] = useState(initialFormData);

  const [imagePreviews, setImagePreviews] = useState([]);

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const categories = [
    "All",
    "Shoulder Bags",
    "Handbags",
    "Tote Bags",
    "Crossbody Bags",
    "Hobo Bags",
  ];

  const statuses = ["All", "Active", "Low Stock", "Out of Stock"];

  const featuredOptions = ["All", "Featured", "Not Featured"];

  const getToken = () => {
    return localStorage.getItem("ectoo-token");
  };

  const getHeaders = () => {
    const token = getToken();

    return {
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  const getImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    return `${SERVER_URL}${image}`;
  };

  

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(API_URL);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch products.");
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch Products Error:", error);

      setErrorMessage(error.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        product.name?.toLowerCase().includes(search) ||
        product.category?.toLowerCase().includes(search);

      const matchesCategory =
        categoryFilter === "All" || product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" || product.status === statusFilter;

      const matchesFeatured =
        featuredFilter === "All" ||
        (featuredFilter === "Featured" && product.isFeatured === true) ||
        (featuredFilter === "Not Featured" && product.isFeatured !== true);

      return (
        matchesSearch && matchesCategory && matchesStatus && matchesFeatured
      );
    });

    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortBy === "price-high") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortBy === "stock-low") {
      result = [...result].sort((a, b) => Number(a.stock) - Number(b.stock));
    }

    if (sortBy === "latest") {
      result = [...result].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    }

    if (sortBy === "featured") {
      result = [...result].sort(
        (a, b) => Number(b.isFeatured) - Number(a.isFeatured),
      );
    }

    return result;
  }, [
    products,
    searchTerm,
    categoryFilter,
    statusFilter,
    featuredFilter,
    sortBy,
  ]);

  

  const totalProducts = products.length;

  const activeProducts = products.filter(
    (product) => product.status === "Active",
  ).length;

  const lowStockProducts = products.filter(
    (product) => product.status === "Low Stock",
  ).length;

  const featuredProducts = products.filter(
    (product) => product.isFeatured === true,
  ).length;

  

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    setErrorMessage("");
  };

  

  const handleImageChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";

    if (selectedFiles.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const currentCount = formData.images.length;

    const remainingSlots = MAX_PRODUCT_IMAGES - currentCount;

    if (remainingSlots <= 0) {
      setErrors((previous) => ({
        ...previous,
        image: `You can only upload up to ${MAX_PRODUCT_IMAGES} images.`,
      }));

      return;
    }

    const filesToAdd = selectedFiles.slice(0, remainingSlots);

    for (const file of filesToAdd) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((previous) => ({
          ...previous,
          image: "Only JPG, JPEG, PNG and WEBP images are allowed.",
        }));

        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((previous) => ({
          ...previous,
          image: "Each image must be less than 5MB.",
        }));

        return;
      }
    }

    setFormData((previous) => ({
      ...previous,
      images: [...previous.images, ...filesToAdd],
    }));

    setImagePreviews((previous) => [
      ...previous,
      ...filesToAdd.map((file) => URL.createObjectURL(file)),
    ]);

    if (selectedFiles.length > filesToAdd.length) {
      setErrors((previous) => ({
        ...previous,
        image: `Only ${MAX_PRODUCT_IMAGES} images allowed — some files were skipped.`,
      }));
    } else {
      setErrors((previous) => ({
        ...previous,
        image: "",
      }));
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((previous) => ({
      ...previous,
      images: previous.images.filter((_, index) => index !== indexToRemove),
    }));

    setImagePreviews((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  };

  

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Product name must be at least 3 characters.";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category.";
    }

    if (formData.price === "") {
      newErrors.price = "Price is required.";
    } else if (Number(formData.price) <= 0) {
      newErrors.price = "Price must be greater than 0.";
    }

    if (formData.stock === "") {
      newErrors.stock = "Stock quantity is required.";
    } else if (Number(formData.stock) < 0) {
      newErrors.stock = "Stock cannot be negative.";
    }

    if (!formData.sku.trim()) newErrors.sku = "SKU is required.";
    if (!formData.material.trim()) newErrors.material = "Material is required.";
    if (!formData.weight.trim()) newErrors.weight = "Weight is required.";

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    if (!formData.images || formData.images.length === 0) {
      newErrors.image = "At least one product image is required.";
    } else if (formData.images.length > MAX_PRODUCT_IMAGES) {
      newErrors.image = `You can upload a maximum of ${MAX_PRODUCT_IMAGES} images.`;
    }

    return newErrors;
  };

  

  const handleAddProduct = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const stockValue = Number(formData.stock);

    let productStatus = "Active";

    if (stockValue === 0) {
      productStatus = "Out of Stock";
    } else if (stockValue <= 5) {
      productStatus = "Low Stock";
    }

    const consoleValues = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: stockValue,
      sku: formData.sku.trim(),
      material: formData.material.trim(),
      weight: formData.weight.trim(),
      description: formData.description.trim(),
      images: formData.images.map((file) => file.name),
      isFeatured: formData.isFeatured,
      status: productStatus,
    };

    console.log("Add Product Form Values:", consoleValues);

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const token = getToken();

      if (!token) {
        setErrorMessage("Authentication token not found. Please login again.");
        return;
      }

      const body = new FormData();

      body.append("name", formData.name.trim());

      body.append("category", formData.category);

      body.append("price", Number(formData.price));

      body.append("stock", stockValue);
      body.append("sku", formData.sku.trim());
      body.append("material", formData.material.trim());
      body.append("weight", formData.weight.trim());

      body.append("description", formData.description.trim());

      body.append("isFeatured", formData.isFeatured);

      formData.images.forEach((file) => {
        body.append("images", file);
      });

      const response = await fetch(API_URL, {
        method: "POST",
        headers: getHeaders(),
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create product.");
      }

      console.log("Product Created:", data.product);

      setProducts((previous) => [data.product, ...previous]);

      setSuccessMessage("Product created successfully.");

      resetForm();

      setTimeout(() => {
        setShowAddModal(false);
        setSuccessMessage("");
      }, 1000);
    } catch (error) {
      console.error("Create Product Error:", error);

      setErrorMessage(error.message || "Unable to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return;

    const productId = deleteProduct._id || deleteProduct.id;

    console.log("Delete Product:", deleteProduct);

    try {
      setDeleting(true);
      setErrorMessage("");

      const token = getToken();

      if (!token) {
        setErrorMessage("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(`${API_URL}/${productId}`, {
        method: "DELETE",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete product.");
      }

      console.log("Product Deleted:", data.product);

      setProducts((previous) =>
        previous.filter((product) => (product._id || product.id) !== productId),
      );

      setSuccessMessage("Product deleted successfully.");

      setDeleteProduct(null);
      setOpenMenu(null);

      setTimeout(() => {
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      console.error("Delete Product Error:", error);

      setErrorMessage(error.message || "Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  

  const handleViewProduct = (product) => {
    console.log("View Product:", product);

    setOpenMenu(null);
  };

  

  const handleEditProduct = (product) => {
    console.log("Edit Product:", product);

    setOpenMenu(null);
  };

  

  const getStatusStyles = (status) => {
    if (status === "Active") {
      return "bg-emerald-50 text-emerald-600";
    }

    if (status === "Low Stock") {
      return "bg-amber-50 text-amber-600";
    }

    return "bg-red-50 text-red-600";
  };

  const getStatusIcon = (status) => {
    if (status === "Active") {
      return <CheckCircle2 size={13} />;
    }

    if (status === "Low Stock") {
      return <AlertCircle size={13} />;
    }

    return <XCircle size={13} />;
  };

  const resetForm = () => {
    setFormData(initialFormData);

    setImagePreviews([]);
    setErrors({});
  };

  const closeModal = () => {
    if (submitting) return;

    setShowAddModal(false);
    resetForm();
  };

  

  return (
    <div className="space-y-6">
      {}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
            Inventory
          </p>

          <h1 className="mt-1 font-display text-3xl text-ink sm:text-4xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-ink/50">
            Manage your Ectoo products, inventory and featured pieces.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2  border border-line bg-paper px-4 py-3 text-sm font-bold text-ink/70 transition-all hover:bg-[#F4F1EB] disabled:opacity-50"
          >
            <RefreshCw size={17} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2  bg-ink px-5 py-3 text-sm font-bold text-paper  transition-all hover:-translate-y-0.5 hover:bg-bottle-dark"
          >
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      {}

      {successMessage && (
        <div className=" border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      {}

      {errorMessage && (
        <div className="flex items-center justify-between gap-4  border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
          <span>{errorMessage}</span>

          <button type="button" onClick={() => setErrorMessage("")}>
            <X size={17} />
          </button>
        </div>
      )}

      {}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className=" border border-line bg-paper p-5 ">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center  bg-ink text-paper">
              <Package size={20} />
            </div>

            <span className="text-xs font-bold text-ink/40">TOTAL</span>
          </div>

          <p className="mt-5 text-sm font-medium text-ink/50">Total Products</p>

          <p className="mt-1 text-2xl font-black text-ink">{totalProducts}</p>
        </div>

        <div className=" border border-line bg-paper p-5 ">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center  bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={20} />
            </div>

            <span className="text-xs font-bold text-emerald-600">LIVE</span>
          </div>

          <p className="mt-5 text-sm font-medium text-ink/50">
            Active Products
          </p>

          <p className="mt-1 text-2xl font-black text-ink">{activeProducts}</p>
        </div>

        <div className=" border border-line bg-paper p-5 ">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center  bg-amber-50 text-amber-600">
              <AlertCircle size={20} />
            </div>

            <span className="text-xs font-bold text-amber-600">ATTENTION</span>
          </div>

          <p className="mt-5 text-sm font-medium text-ink/50">Low Stock</p>

          <p className="mt-1 text-2xl font-black text-ink">
            {lowStockProducts}
          </p>
        </div>

        <div className=" border border-line bg-paper p-5 ">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center  bg-violet-50 text-violet-600">
              <Sparkles size={20} />
            </div>

            <span className="text-xs font-bold text-violet-600">HOME</span>
          </div>

          <p className="mt-5 text-sm font-medium text-ink/50">
            Featured Pieces
          </p>

          <p className="mt-1 text-2xl font-black text-ink">
            {featuredProducts}
          </p>
        </div>
      </div>

      {}

      <div className=" border border-line bg-paper p-4  sm:p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-md">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search products..."
              className="h-11 w-full  border border-line bg-[#F4F1EB] pl-11 pr-4 text-sm font-medium text-ink/80 outline-none transition-all focus:border-ink focus:bg-paper focus:ring-4 focus:ring-line"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="h-11 w-full appearance-none  border border-line bg-paper px-4 pr-10 text-sm font-semibold text-ink/60 outline-none"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 w-full appearance-none  border border-line bg-paper px-4 pr-10 text-sm font-semibold text-ink/60 outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
            </div>

            <div className="relative">
              <select
                value={featuredFilter}
                onChange={(event) => setFeaturedFilter(event.target.value)}
                className="h-11 w-full appearance-none  border border-line bg-paper px-4 pr-10 text-sm font-semibold text-ink/60 outline-none"
              >
                {featuredOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="h-11 w-full appearance-none  border border-line bg-paper px-4 pr-10 text-sm font-semibold text-ink/60 outline-none"
              >
                <option value="latest">Latest</option>

                <option value="featured">Featured First</option>

                <option value="price-low">Price: Low to High</option>

                <option value="price-high">Price: High to Low</option>

                <option value="stock-low">Stock: Low to High</option>
              </select>

              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-ink/40">
          <SlidersHorizontal size={14} />
          Showing{" "}
          <span className="font-black text-ink">
            {filteredProducts.length}
          </span>{" "}
          of {products.length} products
        </div>
      </div>

      {}

      <div className="overflow-hidden  border border-line bg-paper ">
        <div className="flex items-center justify-between border-b border-line p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink/40">
              Catalog
            </p>

            <h2 className="mt-1 font-display text-xl text-ink">All Products</h2>
          </div>

          <Package size={21} className="text-ink/30" />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center px-6 py-24">
            <Loader2 size={32} className="animate-spin text-ink" />

            <p className="mt-4 text-sm font-semibold text-ink/50">
              Loading products...
            </p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            {}

            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="border-b border-line bg-[#F4F1EB]/70">
                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Featured
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-ink/40">
                      Stock
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
                  {filteredProducts.map((product) => {
                    const productId = product._id || product.id;

                    return (
                      <tr
                        key={productId}
                        className="border-b border-line last:border-0 hover:bg-[#F4F1EB]/60"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 shrink-0 overflow-hidden  bg-[#F4F1EB]">
                              {product.images?.[0] ? (
                                <img
                                  src={getImageUrl(product.images[0])}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-ink/30">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[230px] truncate text-sm font-black text-ink">
                                {product.name}
                              </p>

                              <p className="mt-1 text-xs text-ink/40">
                                SKU-EC-
                                {String(productId).slice(-6)}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-ink/60">
                            {product.category}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {product.isFeatured ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600">
                              <Sparkles size={13} />
                              Featured
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-ink/40">
                              No
                            </span>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-ink">
                            ${Number(product.price).toFixed(2)}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span className="text-sm font-bold text-ink/70">
                            {product.stock}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyles(
                              product.status,
                            )}`}
                          >
                            {getStatusIcon(product.status)}

                            {product.status}
                          </span>
                        </td>

                        <td className="relative px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === productId ? null : productId,
                              )
                            }
                            className="inline-flex h-9 w-9 items-center justify-center  text-ink/40 transition-colors hover:bg-[#F4F1EB] hover:text-ink"
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          {openMenu === productId && (
                            <div className="absolute right-6 top-14 z-20 w-44 overflow-hidden  border border-line bg-paper p-1.5 text-left ">
                              <button
                                type="button"
                                onClick={() => handleViewProduct(product)}
                                className="flex w-full items-center gap-3  px-3 py-2.5 text-xs font-semibold text-ink/60 hover:bg-[#F4F1EB] hover:text-ink"
                              >
                                <Eye size={15} />
                                View Product
                              </button>

                              <button
                                type="button"
                                onClick={() => handleEditProduct(product)}
                                className="flex w-full items-center gap-3  px-3 py-2.5 text-xs font-semibold text-ink/60 hover:bg-[#F4F1EB] hover:text-ink"
                              >
                                <Edit3 size={15} />
                                Edit Product
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteProduct(product);

                                  setOpenMenu(null);
                                }}
                                className="flex w-full items-center gap-3  px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                                Delete Product
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {}

            <div className="divide-y divide-line lg:hidden">
              {filteredProducts.map((product) => {
                const productId = product._id || product.id;

                return (
                  <div key={productId} className="p-5">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden  bg-[#F4F1EB]">
                        {product.images?.[0] ? (
                          <img
                            src={getImageUrl(product.images[0])}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-ink/30">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-black text-ink">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-ink/40">
                              {product.category}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenu(
                                openMenu === productId ? null : productId,
                              )
                            }
                            className="flex h-8 w-8 shrink-0 items-center justify-center  text-ink/40 hover:bg-[#F4F1EB]"
                          >
                            <MoreHorizontal size={18} />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <span className="text-base font-black text-ink">
                            ${Number(product.price).toFixed(2)}
                          </span>

                          {product.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-bold text-violet-600">
                              <Sparkles size={11} />
                              Featured
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs font-semibold text-ink/50">
                            Stock:{" "}
                            <span className="font-black text-ink/80">
                              {product.stock}
                            </span>
                          </span>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${getStatusStyles(
                              product.status,
                            )}`}
                          >
                            {getStatusIcon(product.status)}

                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {openMenu === productId && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewProduct(product)}
                          className="flex items-center justify-center gap-1.5  bg-[#F4F1EB] py-2.5 text-xs font-bold text-ink/60"
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEditProduct(product)}
                          className="flex items-center justify-center gap-1.5  bg-[#F4F1EB] py-2.5 text-xs font-bold text-ink/60"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteProduct(product);

                            setOpenMenu(null);
                          }}
                          className="flex items-center justify-center gap-1.5  bg-red-50 py-2.5 text-xs font-bold text-red-500"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center  bg-ink text-paper">
              <Search size={25} />
            </div>

            <h2 className="mt-6 text-2xl font-black text-ink">
              No products found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink/50">
              Try another search, category or filter.
            </p>
          </div>
        )}
      </div>

      {}

      {showAddModal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-ink/60 px-4 py-6 backdrop-blur-sm">
          <div className="mx-auto w-full max-w-2xl border border-line bg-paper">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-paper px-6 py-5 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">
                  Catalog
                </p>

                <h2 className="mt-1 font-display text-xl text-ink">
                  Add New Product
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={submitting}
                className="flex h-10 w-10 items-center justify-center  text-ink/40 hover:bg-[#F4F1EB] hover:text-ink"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-5 p-6 sm:p-7">
              {}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Premium Travel Duffle"
                  className={`h-12 w-full  border ${
                    errors.name ? "border-red-300" : "border-line"
                  } bg-paper px-4 text-sm font-medium text-ink outline-none focus:border-ink`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              {}

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                    Category
                  </label>

                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="h-12 w-full appearance-none  border border-line bg-paper px-4 pr-10 text-sm font-semibold text-ink/70 outline-none focus:border-ink"
                    >
                      {categories
                        .filter((category) => category !== "All")
                        .map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink/40"
                    />
                  </div>

                  {errors.category && (
                    <p className="mt-1.5 text-xs font-semibold text-red-500">
                      {errors.category}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                    Price
                  </label>

                  <input
                    type="number"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="129"
                    className="h-12 w-full  border border-line bg-paper px-4 text-sm font-medium text-ink outline-none focus:border-ink"
                  />

                  {errors.price && (
                    <p className="mt-1.5 text-xs font-semibold text-red-500">
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                  Stock Quantity
                </label>

                <input
                  type="number"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="h-12 w-full  border border-line bg-paper px-4 text-sm font-medium text-ink outline-none focus:border-ink"
                />

                {errors.stock && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.stock}
                  </p>
                )}
              </div>

              {}
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">SKU</label><input type="text" name="sku" value={formData.sku} onChange={handleInputChange} placeholder="ECT-NCSB-001" className={`h-12 w-full border ${errors.sku ? "border-red-300" : "border-line"} bg-paper px-4 text-sm font-medium text-ink outline-none focus:border-ink`} />{errors.sku && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.sku}</p>}</div>
                <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">Material</label><input type="text" name="material" value={formData.material} onChange={handleInputChange} placeholder="e.g. Genuine Leather" className={`h-12 w-full border ${errors.material ? "border-red-300" : "border-line"} bg-paper px-4 text-sm font-medium text-ink outline-none focus:border-ink`} />{errors.material && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.material}</p>}</div>
              </div>
              <div><label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">Weight</label><input type="text" name="weight" value={formData.weight} onChange={handleInputChange} placeholder="e.g. 0.65 kg" className={`h-12 w-full border ${errors.weight ? "border-red-300" : "border-line"} bg-paper px-4 text-sm font-medium text-ink outline-none focus:border-ink`} />{errors.weight && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.weight}</p>}</div>

              {}

              <div
                className={` border p-4 transition-all ${
                  formData.isFeatured
                    ? "border-violet-200 bg-violet-50"
                    : "border-line bg-[#F4F1EB]"
                }`}
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 rounded border-line accent-bottle"
                  />

                  <span>
                    <span className="flex items-center gap-2 text-sm font-black text-ink">
                      <Sparkles
                        size={16}
                        className={
                          formData.isFeatured
                            ? "text-violet-600"
                            : "text-ink/40"
                        }
                      />
                      Show in Featured Pieces
                    </span>

                    <span className="mt-1 block text-xs leading-5 text-ink/50">
                      This product will keep its selected category and will also
                      appear in the Featured Pieces section on the Home page.
                    </span>
                  </span>
                </label>
              </div>

              {}

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/50">
                    Product Images
                  </label>

                  <span className="text-xs font-semibold text-ink/40">
                    {imagePreviews.length}/{MAX_PRODUCT_IMAGES}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {}
                  <div
                    className={`relative col-span-4 aspect-video overflow-hidden  border-2 sm:col-span-2 ${
                      imagePreviews[0]
                        ? "border-line"
                        : "border-dashed border-line bg-[#F4F1EB]"
                    }`}
                  >
                    {imagePreviews[0] ? (
                      <>
                        <img
                          src={imagePreviews[0]}
                          alt="Main preview"
                          className="h-full w-full object-cover"
                        />

                        <span className="absolute left-2 top-2 rounded-full bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-paper">
                          Main
                        </span>

                        <button
                          type="button"
                          onClick={() => handleRemoveImage(0)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-paper/90 text-ink/70  transition hover:bg-red-500 hover:text-paper"
                          aria-label="Remove main image"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center hover:bg-paper">
                        <div className="flex h-10 w-10 items-center justify-center  bg-paper text-ink/50 ">
                          <Upload size={18} />
                        </div>
                        <p className="mt-2 text-xs font-bold text-ink/70">
                          Main image
                        </p>
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          multiple
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>

                  {}
                  {[1, 2, 3].map((slotIndex) => {
                    const preview = imagePreviews[slotIndex];

                    return (
                      <div
                        key={slotIndex}
                        className={`relative aspect-square overflow-hidden  border-2 ${
                          preview
                            ? "border-line"
                            : "border-dashed border-line bg-[#F4F1EB]"
                        }`}
                      >
                        {preview ? (
                          <>
                            <img
                              src={preview}
                              alt={`Preview ${slotIndex + 1}`}
                              className="h-full w-full object-cover"
                            />

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(slotIndex)}
                              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-paper/90 text-ink/70  transition hover:bg-red-500 hover:text-paper"
                              aria-label={`Remove image ${slotIndex + 1}`}
                            >
                              <X size={12} />
                            </button>
                          </>
                        ) : imagePreviews.length === slotIndex ? (
                          <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-center hover:bg-paper">
                            <Plus size={18} className="text-ink/40" />
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              multiple
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-ink/30">
                            <ImageIcon size={16} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-2 text-xs text-ink/40">
                  First image is the main image shown on product cards. JPG, PNG
                  or WEBP • Max 5MB each • Up to {MAX_PRODUCT_IMAGES} images.
                </p>

                {errors.image && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.image}
                  </p>
                )}
              </div>

              {}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-ink/50">
                  Description
                </label>

                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the product..."
                  className="w-full resize-none  border border-line bg-paper px-4 py-3 text-sm font-medium text-ink outline-none focus:border-ink"
                />

                {errors.description && (
                  <p className="mt-1.5 text-xs font-semibold text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {}

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={submitting}
                  className=" border border-line px-6 py-3 text-sm font-bold text-ink/70 transition-colors hover:bg-[#F4F1EB] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2  bg-ink px-6 py-3 text-sm font-bold text-paper transition-all hover:bg-bottle-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}

      {deleteProduct && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md border border-line bg-paper p-6 sm:p-7">
            <div className="flex h-12 w-12 items-center justify-center bg-red-50 text-red-500">
              <Trash2 size={21} />
            </div>

            <h2 className="mt-5 font-display text-xl text-ink">
              Delete Product?
            </h2>

            <p className="mt-2 text-sm leading-6 text-ink/50">
              Are you sure you want to delete{" "}
              <span className="font-bold text-ink/80">
                {deleteProduct.name}
              </span>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setDeleteProduct(null)}
                disabled={deleting}
                className=" border border-line px-5 py-3 text-sm font-bold text-ink/70 hover:bg-[#F4F1EB] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="inline-flex items-center justify-center gap-2  bg-red-500 px-5 py-3 text-sm font-bold text-paper hover:bg-red-600 disabled:opacity-60"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
