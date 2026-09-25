import Product from "../models/Product.js";
import fs from "fs/promises";
import path from "path";

const MAX_IMAGES = 4;
const UPLOAD_PREFIX = "/uploads/products/";

const uploadedImages = (files = []) =>
  files.map((file) => `${UPLOAD_PREFIX}${file.filename}`);

const removeUploadedFiles = async (files = []) => {
  await Promise.all(
    files
      .filter((file) => file.path)
      .map((file) => fs.unlink(file.path).catch(() => {}))
  );
};

const removeStoredImages = async (images = []) => {
  await Promise.all(
    images
      .filter(
        (image) =>
          typeof image === "string" &&
          image.startsWith(UPLOAD_PREFIX)
      )
      .map((image) => {
        const filename = path.basename(image);
        const filePath = path.join(
          process.cwd(),
          "uploads",
          "products",
          filename
        );

        return fs.unlink(filePath).catch(() => {});
      })
  );
};

const isDuplicateSku = (error) =>
  error?.code === 11000 && Boolean(error?.keyPattern?.sku);

const validPrice = (value) =>
  value !== "" &&
  value !== null &&
  Number.isFinite(Number(value)) &&
  Number(value) >= 0;

const validStock = (value) =>
  value !== "" &&
  value !== null &&
  Number.isSafeInteger(Number(value)) &&
  Number(value) >= 0;

const parseFeatured = (value) =>
  value === true || value === "true";

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      sku,
      material,
      weight,
      description,
      isFeatured,
      rating,
      reviews,
    } = req.body;

    if (
      !name?.trim() ||
      !category?.trim() ||
      price === undefined ||
      stock === undefined ||
      !sku?.trim() ||
      !material?.trim() ||
      !weight?.trim()
    ) {
      await removeUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message:
          "Name, category, price, stock, SKU, material and weight are required.",
      });
    }

    if (!validPrice(price) || !validStock(stock)) {
      await removeUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message:
          "Price must be zero or greater, and stock must be a whole number of zero or greater.",
      });
    }

    if (!req.files?.length || req.files.length > MAX_IMAGES) {
      await removeUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message: `Upload between 1 and ${MAX_IMAGES} product images.`,
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      stock: Number(stock),
      sku: sku.trim(),
      material: material.trim(),
      weight: weight.trim(),
      description: description?.trim() || "",
      images: uploadedImages(req.files),
      isFeatured: parseFeatured(isFeatured),
      rating: Number(rating) || 0,
      reviews: Number(reviews) || 0,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    await removeUploadedFiles(req.files);

    if (isDuplicateSku(error)) {
      return res.status(409).json({
        success: false,
        message: "This SKU already exists. Please use a unique SKU.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create product.",
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
    });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      status: { $ne: "Out of Stock" },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Featured Products Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch featured products.",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product.",
    });
  }
};

export const updateProduct = async (req, res) => {
  let saved = false;

  try {
    if (req.files?.length > MAX_IMAGES) {
      await removeUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message: `You can upload a maximum of ${MAX_IMAGES} images.`,
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      await removeUploadedFiles(req.files);

      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const {
      name,
      category,
      price,
      stock,
      sku,
      material,
      weight,
      description,
      isFeatured,
      rating,
      reviews,
    } = req.body;

    if (price !== undefined && !validPrice(price)) {
      await removeUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "Price must be zero or greater.",
      });
    }

    if (stock !== undefined && !validStock(stock)) {
      await removeUploadedFiles(req.files);

      return res.status(400).json({
        success: false,
        message: "Stock must be a whole number of zero or greater.",
      });
    }

    const oldImages = [...(product.images || [])];

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim();
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (sku !== undefined) product.sku = sku.trim();
    if (material !== undefined) product.material = material.trim();
    if (weight !== undefined) product.weight = weight.trim();
    if (description !== undefined) {
      product.description = description.trim();
    }
    if (isFeatured !== undefined) {
      product.isFeatured = parseFeatured(isFeatured);
    }
    if (rating !== undefined) product.rating = Number(rating);
    if (reviews !== undefined) product.reviews = Number(reviews);

    if (req.files?.length) {
      product.images = uploadedImages(req.files);
    }

    await product.save();
    saved = true;

    if (req.files?.length) {
      await removeStoredImages(oldImages);
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error("Update Product Error:", error);

    if (!saved) {
      await removeUploadedFiles(req.files);
    }

    if (isDuplicateSku(error)) {
      return res.status(409).json({
        success: false,
        message: "This SKU already exists. Please use a unique SKU.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await removeStoredImages(product.images);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product.",
    });
  }
};