import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
  Frontend origins:
  FRONTEND_URL may contain one URL or multiple comma-separated URLs.
  Example: FRONTEND_URL=https://enflips.example,https://www.enflips.example
*/
const frontendOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:3000",
  ...frontendOrigins,
]);

/* Security headers */
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        fontSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", ...frontendOrigins],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
      },
    },
    referrerPolicy: {
      policy: "strict-origin-when-cross-origin",
    },
    frameguard: {
      action: "deny",
    },
    noSniff: true,
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "usb=()",
      "fullscreen=(self)",
      "picture-in-picture=()",
    ].join(", ")
  );

  next();
});

/* CORS */
app.use(
  cors({
    origin: (origin, callback) => {
      // Direct navigation and server-to-server requests have no Origin.
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* Body parsers */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Product images */
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      res.setHeader(
        "Cross-Origin-Resource-Policy",
        "cross-origin"
      );
      res.setHeader("X-Content-Type-Options", "nosniff");
    },
  })
);

/* Database */
connectDB();

/* API routes */
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Enflips Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  return res.json({
    success: true,
    message: "Enflips API is running",
  });
});

/* 404 */
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* Global error handler */
app.use((error, req, res, next) => {
  console.error("Server Error:", error);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  return res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Enflips Backend running on port ${PORT}`);
});