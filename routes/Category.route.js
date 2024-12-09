import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  updateCategory,
} from "../controllers/Category.controller.js";
import { isAdminUser, protectRoute } from "../middleWare/Auth.js";
const router = express.Router();

router.get("/getAll-category", protectRoute, isAdminUser, getAllCategory);
router.post("/create-category", protectRoute, isAdminUser, createCategory);
router.delete(
  "/delete-category/:id",
  protectRoute,
  isAdminUser,
  deleteCategory
);
router.put("/update-category/:id", protectRoute, isAdminUser, updateCategory);

export default router;
