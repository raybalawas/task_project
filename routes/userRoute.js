import e from "express";

import {
  allUser,
  UserById,
  updateUser,
  deleteUser,
  RegisterUser,
  loginUser,
  logout,
} from "../controllers/UserController.js";

import { verifyToken, isAdmin } from "../middlewares/authMiddleware.js";

const router = e.Router();
router.post("/register", RegisterUser);
router.post("/login", loginUser);

router.get("/all-user", verifyToken, isAdmin, allUser);
router.get("/user-logout", verifyToken, isAdmin, logout);
router.get("/user/:id", verifyToken, isAdmin, UserById);
router.put("/user-update/:id", verifyToken, isAdmin, updateUser);
router.delete("/user-delete/:id", verifyToken, isAdmin, deleteUser);

export default router;
