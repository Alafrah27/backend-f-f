import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  deleteOrder,
  getUserOrders,
  updateOrderStatus,
  countOrders,
  getOrder,
} from "../controllers/Order.contoller.js";
import { isAdminUser, protectRoute } from "../middleWare/Auth.js";
const router = express.Router();

router.post("/create", protectRoute, createOrder);
router.get("/getAll-order", protectRoute, isAdminUser, getAllOrders);
router.get("/user-order", protectRoute, getOrder);
router.get("/order-detail/:id", protectRoute, getOrderById);
router.get("/:id", protectRoute, getUserOrders);
router.get("/count-orders", protectRoute, countOrders);
router.delete("/delete-order/:id", protectRoute, isAdminUser, deleteOrder);
router.patch("/update-order/:id", protectRoute, isAdminUser, updateOrderStatus);

export default router;
