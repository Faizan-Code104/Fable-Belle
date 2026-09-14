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

/* =========================================
   ES MODULE PATH SETUP
========================================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================================
   SECURITY HEADERS
========================================= */

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: ["'self'"],

        styleSrc: ["'self'", "'unsafe-inline'"],

        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https:",
          "http://localhost:5000",
        ],

        fontSrc: ["'self'", "data:", "https:"],

        connectSrc: [
          "'self'",
          "http://localhost:5000",
          "http://localhost:5173",
          "http://localhost:3000",
          "https://ectoo.us",
          "https://www.ectoo.us",
          "https://api.ectoo.us",
        ],

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

/* =========================================
   PERMISSIONS POLICY
========================================= */

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

/* =========================================
   CORS
========================================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://ectoo.us",
  "https://www.ectoo.us",
];

app.use(
  cors({
    origin: (origin, callback) => {
      /*
       * Allow requests without an Origin header.
       * Examples:
       * Postman, server-to-server requests,
       * health checks and direct browser navigation.
       */
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

/* =========================================
   BODY PARSERS
========================================= */

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/* =========================================
   STATIC UPLOADS
========================================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res) => {
      /*
       * Product images are intentionally allowed
       * to load from the Ectoo frontend domain.
       */
      res.setHeader(
        "Cross-Origin-Resource-Policy",
        "cross-origin"
      );

      res.setHeader(
        "X-Content-Type-Options",
        "nosniff"
      );
    },
  })
);

/* =========================================
   DATABASE
========================================= */

connectDB();

/* =========================================
   ROUTES
========================================= */

app.use("/api/contact", contactRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

/* =========================================
   HOME ROUTE
========================================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ectoo Backend is running",
  });
});

/* =========================================
   404 HANDLER
========================================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* =========================================
   GLOBAL ERROR HANDLER
========================================= */

app.use((error, req, res, next) => {
  console.error("Server Error:", error.message);

  if (error.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "Origin not allowed",
    });
  }

  res.status(error.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message || "Internal server error",
  });
});

/* =========================================
   SERVER
========================================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Ectoo Backend running on port ${PORT}`
  );
});