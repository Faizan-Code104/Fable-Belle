import express from "express";
import multer from "multer";
import fs from "fs";

import {
  createProduct,
  getProducts,
  getFeaturedProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../Controllers/product.js";

import authMiddleware from "../middleware/authmiddleware.js";
import adminMiddleware from "../middleware/adminmiddleware.js";

const router = express.Router();

const uploadDirectory = "uploads/products";

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (req, file, cb) => {
    const extensionMap = {
      "image/jpeg": ".jpg",
      "image/jpg": ".jpg",
      "image/png": ".png",
      "image/webp": ".webp",
    };

    const extension = extensionMap[file.mimetype];

    const fileName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

/*
  IMPORTANT:
  Featured route must come BEFORE /:id
*/
router.get(
  "/featured",
  getFeaturedProducts
);

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 4),
  createProduct
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 4),
  updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default router;