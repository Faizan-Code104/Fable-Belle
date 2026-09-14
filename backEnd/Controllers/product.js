import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

/*
  CREATE PRODUCT
*/
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      sku,
      brand,
      material,
      weight,
      description,
      isFeatured,
      rating,
      reviews,
    } = req.body;

    if (
      !name ||
      !category ||
      price === undefined ||
      stock === undefined ||
      !sku ||
      !material ||
      !weight
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, category, price, stock, SKU, material and weight are required.",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product image is required.",
      });
    }

    if (req.files.length > 4) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 4 images.",
      });
    }

    const stockValue = Number(stock);

    let status = "Active";

    if (stockValue === 0) {
      status = "Out of Stock";
    } else if (stockValue <= 5) {
      status = "Low Stock";
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      price: Number(price),
      stock: stockValue,

      // Product specifications
      sku: sku.trim(),
      brand: brand?.trim() || "",
      material: material.trim(),
      weight: weight.trim(),

      description: description?.trim() || "",

      images: req.files.map(
        (file) => `/uploads/products/${file.filename}`
      ),

      isFeatured:
        isFeatured === true ||
        isFeatured === "true",

      status,

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

    /*
      If database creation fails after image upload,
      remove any uploaded images.
    */
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    /*
      Duplicate SKU error
    */
    if (
      error?.code === 11000 &&
      error?.keyPattern?.sku
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This SKU already exists. Please use a unique SKU.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create product.",
    });
  }
};

/*
  GET ALL PRODUCTS
*/
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch products.",
    });
  }
};

/*
  GET FEATURED PRODUCTS
*/
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isFeatured: true,
      status: {
        $ne: "Out of Stock",
      },
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error(
      "Get Featured Products Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch featured products.",
    });
  }
};

/*
  GET SINGLE PRODUCT
*/
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

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
    console.error(
      "Get Product By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch product.",
    });
  }
};

/*
  UPDATE PRODUCT
*/
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const oldImages = product.images;

    const {
      name,
      category,
      price,
      stock,
      sku,
      brand,
      material,
      weight,
      description,
      isFeatured,
      rating,
      reviews,
    } = req.body;

    if (name !== undefined) {
      product.name = name.trim();
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    /*
      Update product specifications
    */
    if (sku !== undefined) {
      product.sku = sku.trim();
    }

    if (brand !== undefined) {
      product.brand = brand.trim();
    }

    if (material !== undefined) {
      product.material = material.trim();
    }

    if (weight !== undefined) {
      product.weight = weight.trim();
    }

    if (description !== undefined) {
      product.description = description.trim();
    }

    if (isFeatured !== undefined) {
      product.isFeatured =
        isFeatured === true ||
        isFeatured === "true";
    }

    if (rating !== undefined) {
      product.rating = Number(rating);
    }

    if (reviews !== undefined) {
      product.reviews = Number(reviews);
    }

    /*
      Replace all images only when new images
      have been uploaded (1-4 files).
    */
    if (req.files && req.files.length > 0) {
      if (req.files.length > 4) {
        return res.status(400).json({
          success: false,
          message:
            "You can upload a maximum of 4 images.",
        });
      }

      product.images = req.files.map(
        (file) =>
          `/uploads/products/${file.filename}`
      );
    }

    await product.save();

    /*
      Delete all previous images after successful save.
    */
    if (
      req.files &&
      req.files.length > 0 &&
      Array.isArray(oldImages)
    ) {
      oldImages.forEach((oldImage) => {
        if (
          oldImage &&
          oldImage.startsWith(
            "/uploads/products/"
          )
        ) {
          const oldImagePath = path.join(
            process.cwd(),
            oldImage.replace(/^\/+/, "")
          );

          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Update Product Error:",
      error
    );

    /*
      Duplicate SKU error
    */
    if (
      error?.code === 11000 &&
      error?.keyPattern?.sku
    ) {
      return res.status(409).json({
        success: false,
        message:
          "This SKU already exists. Please use a unique SKU.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update product.",
    });
  }
};

/*
  DELETE PRODUCT
*/
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    /*
      Delete all product images from uploads folder.
    */
    if (Array.isArray(product.images)) {
      product.images.forEach((image) => {
        if (
          image &&
          image.startsWith(
            "/uploads/products/"
          )
        ) {
          const imagePath = path.join(
            process.cwd(),
            image.replace(/^\/+/, "")
          );

          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          }
        }
      });
    }

    await Product.findByIdAndDelete(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    console.error(
      "Delete Product Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete product.",
    });
  }
};