import express from "express";
import {
  createPickUpOrder,
  deletePickUpOrder,
  getAllPickUpOrders,
  updateAllPickUpOrder,
  updatePickUpOrder,
} from "../controllers/PickUpOrder.controller.js";
import { isAdminUser, protectRoute } from "../middleWare/Auth.js";
const router = express.Router();
router.post("/create", protectRoute, isAdminUser, createPickUpOrder);
router.get("/getAll", protectRoute, isAdminUser, getAllPickUpOrders);
router.delete("/delete/:id", protectRoute, isAdminUser, deletePickUpOrder);
router.patch("/update/:id", protectRoute, isAdminUser, updatePickUpOrder);
router.put("/update-all/:id", protectRoute, isAdminUser, updateAllPickUpOrder);
export default router;
