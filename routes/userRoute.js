import e from "express";

import {
  allUser,
  UserById,
  updateUser,
  deleteUser,
  RegisterUser,
  loginUser,
  userLogin
} from "../controllers/UserController.js";

import { verifyToken, isAdmin, isUser } from "../middlewares/authMiddleware.js";

const router = e.Router();
router.post("/register", RegisterUser);
router.post("/login", isAdmin, loginUser);

router.get("/all-user", verifyToken, isAdmin, allUser);
router.get("/user/:id", verifyToken, isAdmin, UserById);
router.put("/user-update/:id", verifyToken, isAdmin, updateUser);
router.delete("/user-delete/:id", verifyToken, isAdmin, deleteUser);

router.post("/user-login", userLogin);


export default router;
