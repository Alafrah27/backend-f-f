import express from "express";
import {
  Login,
  SignUP,
  logout,
  getCurrentUser,
  getAllUser,
  updateUser,
  deleteUser,
  Checkrole,
  countUsers,
} from "../controllers/User.controller.js";

import { protectRoute, isAdminUser } from "../middleWare/Auth.js";
import { VerifyRole } from "../middleWare/VerifyRole.js";
const router = express.Router();

router.post("/signup", SignUP);
router.post("/login", Login);
router.post("/logout", logout);
router.get("/count", protectRoute, isAdminUser, countUsers);
router.get("/me", protectRoute, getCurrentUser);
router.get("/All-Users", protectRoute, isAdminUser, getAllUser);
router.get("/admin", protectRoute, VerifyRole("admin"), Checkrole);
router.put("/update/:id", protectRoute, updateUser);
router.delete("/delete/:id", protectRoute, isAdminUser, deleteUser);

export default router;
