import e from "express";

import {
  allUser,
  UserById,
  updateUser,
  deleteUser,
  RegisterUser,
  loginUser,
  userLogin,
  userPost,
  userAllPost,
  CommentByUser,
  userCommentDelete,
  userPostUpdate,
  userPostDelete,
  AllPostForAdmin,
  CommentByAdmin,
  adminCommentDelete,
  PostUpdateByAdmin,
  PostDeleteByAdmin,
} from "../controllers/UserController.js";

import { verifyToken, isAdmin, isUser } from "../middlewares/authMiddleware.js";

const router = e.Router();
router.post("/register", RegisterUser);
router.post("/login", loginUser);

router.get("/all-user", verifyToken, isAdmin, allUser);
router.get("/user/:id", verifyToken, isAdmin, UserById);
router.put("/user-update/:id", verifyToken, isAdmin, updateUser);
router.delete("/user-delete/:id", verifyToken, isAdmin, deleteUser);

router.get("/all-posts", verifyToken, isAdmin, AllPostForAdmin);
router.post("/admin-update-post/:id", verifyToken, isAdmin, PostUpdateByAdmin);
router.put("/admin-comment-post/:id", verifyToken, isAdmin, CommentByAdmin);
router.delete(
  "/admin-delete-comment/:postId/:commentId",
  verifyToken,
  isAdmin,
  adminCommentDelete
);
router.post("/admin-delete-post/:id", verifyToken, isAdmin, PostDeleteByAdmin);

router.post("/user-login", userLogin);
router.post("/user-create-post", verifyToken, isUser, userPost);
router.get("/all-post-user", verifyToken, isUser, userAllPost);
router.put("/user-comment-post/:id", verifyToken, isUser, CommentByUser);
router.delete(
  "/user-delete-comment/:postId/:commentId",
  verifyToken,
  isUser,
  userCommentDelete
);
router.post("/user-post-update/:id", verifyToken, isUser, userPostUpdate);
router.post("/user-post-delete/:id", verifyToken, isUser, userPostDelete);

export default router;
