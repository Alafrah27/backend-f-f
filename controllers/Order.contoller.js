import APIFeatures from "../lib/ApiFeautres.js";
import { generateOrderId } from "../lib/generateId.js";
import Order from "../model/Order.model.js";
import User from "../model/User.model.js";

export const createOrder = async (req, res) => {
  try {
    const { user, cart, name, city, phone, address, totalPrice } = req.body;
    const userInformation = await User.findById(req.user._id);

    if (!userInformation) {
      return res.status(404).json({ message: "User not found." });
    }
    let total = 0;
    // Validate input if necessary
    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: "Cart cannot be empty." });
    }

    const items = cart.map((item) => ({
      product: item.product,
      quantity: item.quantity,
      price: item.price,
    }));

    const itemtotalPrice = items.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    total += itemtotalPrice;

    const ID = generateOrderId();

    const order = new Order({
      user: userInformation._id,
      cart: items,
      name,
      city,
      phone,
      address,
      totalPrice: total,
      orderId: ID,
    });

    const savedOrder = await order.save();
    res.status(201).json({
      message: "Order has been placed successfully",
      result: savedOrder.length,
      savedOrder,
    });
  } catch (error) {
    console.error("Error creating order: ", error.message);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const fratures = new APIFeatures(
      Order.find()
        .sort({ createdAt: -1 })
        .populate({
          path: "user",
          select: "-password -__v -image -isAdmin -createdAt -updatedAt -_id", // Exclude fields from the user
        })
        .populate({
          path: "cart.product",
          select:
            "-_id -createdAt -updatedAt -_id -__v -image -category -discount", // Exclude the _id field from products in cart
        })
        .populate({ path: "cart.quantity", select: " -_id " })

        .sort({ status: -1 }),
      req.query
    )
      .filter()
      .limitFields()
      .paginate()
      .search();

    const orders = await fratures.query;
    res.json({ ordercount: orders.length, orders });
  } catch (error) {
    console.error("Error fetching orders: ", error.message);
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({ message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order: ", error.message);
    res
      .status(500)
      .json({ message: "Failed to delete order", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await Order.findById(orderId)
      .sort({
        createdAt: -1,
      })
      .populate({
        path: "user",
        select: "-password -__v -image -isAdmin -createdAt -updatedAt -_id", // Exclude fields from the user
      })
      .populate({
        path: "cart.product",
        select:
          "-_id -createdAt -updatedAt -_id -__v -image -category -description", // Exclude the _id field from products in cart
      })
      .populate({ path: "cart.quantity", select: " -_id " })

      // Exclude fields from the Order model
      .exec();

    if (!orders) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({
      message: "Order fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching order: ", error.message);
  }
};

// get user orders
export const getUserOrders = async (req, res) => {
  const userId = req.params.id;
  try {
    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password -__v -image -isAdmin -createdAt -updatedAt -_id", // Exclude fields from the user
      })
      .populate({
        path: "cart.product",
        select:
          "-_id -createdAt -updatedAt -_id -__v -image -category -discount", // Exclude the _id field from products in cart
      })
      .populate({ path: "cart.quantity", select: " -_id " })
      // Exclude fields from the Order model
      .exec();
    if (!orders) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: error.message });
    console.error("Error fetching orders: ", error.message);
  }
};

export const updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({ message: "Order status updated successfully", updatedOrder });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update order status", error: error.message });
    console.error("Error updating order status: ", error.message);
  }
};

export const countOrders = async (req, res) => {
  try {
    const counts = await Order.find({ status: "processing" });
    if (!counts) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.send(counts);
  } catch (error) {
    console.error("Error counting orders: ", error);
    res
      .status(500)
      .json({ message: "Failed to count users", error: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate({
        path: "user",
        select: "-password -__v -image -isAdmin -createdAt -updatedAt -_id", // Exclude fields from the user
      })
      .populate({
        path: "cart.product",
        select:
          "-_id -createdAt -updatedAt -_id -__v -image -category -description", // Exclude the _id field from products in cart
      })
      .populate({ path: "cart.quantity", select: " -_id " })
      // Exclude fields from the Order model
      .exec();
    if (!orders) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({
      message: "Order fetched successfully",
      results: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Error fetching order: ", error.message);
  }
};
