import express from "express";

import {
  createOrder,
  getMyOrders,
  trackOrder,
  getAllOrders,
  updateOrderStatus,
} from "../Controllers/ordercontroller.js";

import authMiddleware from "../middleware/authmiddleware.js";
import adminMiddleware from "../middleware/adminmiddleware.js";

const router = express.Router();

/*
  CREATE ORDER
  Guest checkout is allowed.
*/
router.post("/", createOrder);

/*
  GET LOGGED-IN USER'S ORDERS
*/
router.get("/mine", authMiddleware, getMyOrders);

/*
  PUBLIC ORDER TRACKING
*/
router.get("/track/:orderNumber", trackOrder);

/*
  GET ALL ORDERS - ADMIN ONLY
*/
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

/*
  UPDATE ORDER STATUS - ADMIN ONLY
*/
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

export default router;