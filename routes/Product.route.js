import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProduct,
  getProduct,
  updateProduct,
} from "../controllers/Product.controller.js";
import { isAdminUser, protectRoute } from "../middleWare/Auth.js";
const router = express.Router();

router.post("/create", protectRoute, isAdminUser, createProduct);
router.delete("/delete-product/:id", protectRoute, isAdminUser, deleteProduct);
router.get("/getAll-product", getAllProduct);
router.get("/:id", getProduct);
router.put("/update-product/:id", protectRoute, isAdminUser, updateProduct);

export default router;
