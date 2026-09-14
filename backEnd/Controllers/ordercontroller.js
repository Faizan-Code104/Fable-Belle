import Order from "../models/order.js";
import Product from "../models/Product.js";

/*
  Generate a unique, human-friendly order number.
  Example: EC-48213076123
*/
const generateOrderNumber = () => {
  const timestampPart = Date.now().toString().slice(-8);
  const randomPart = Math.floor(100 + Math.random() * 900);

  return `EC-${timestampPart}${randomPart}`;
};

/*
  CREATE ORDER
  Requires login. Reads cart items sent from the frontend,
  re-validates stock against the database, deducts stock,
  and creates the order.
*/
export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty.",
      });
    }

    const requiredAddressFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "postalCode",
      "country",
    ];

    for (const field of requiredAddressFields) {
      if (!shippingAddress?.[field]?.toString().trim()) {
        return res.status(400).json({
          success: false,
          message: `Shipping ${field} is required.`,
        });
      }
    }

    const orderItems = [];
    let subtotal = 0;

    for (const cartItem of items) {
      const product = await Product.findById(cartItem.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "A product in your cart is no longer available.",
        });
      }

      const quantity = Number(cartItem.quantity) || 0;

      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid quantity for ${product.name}.`,
        });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} unit(s) of "${product.name}" left in stock.`,
        });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || "",
        price: product.price,
        quantity,
      });

      subtotal += product.price * quantity;
    }

    const shipping = 0;
    const discount = 0;
    const totalAmount = subtotal + shipping - discount;

    for (const orderItem of orderItems) {
      const product = await Product.findById(orderItem.product);

      product.stock -= orderItem.quantity;

      await product.save();
    }

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: req.user?._id || null,
      items: orderItems,
      shippingAddress,
      paymentMethod: "COD",
      subtotal,
      shipping,
      discount,
      totalAmount,
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to place order.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get My Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your orders.",
    });
  }
};

export const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const order = await Order.findOne({ orderNumber });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found with that order number.",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Track Order Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch order.",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get All Orders Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update Order Status Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status.",
    });
  }
};