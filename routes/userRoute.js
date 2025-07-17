import e from "express";

import {
  allUser,
  UserById,
  updateUser,
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
  adminCommentUpdate,
  adminCommentDelete,
  PostUpdateByAdmin,
  PostDeleteByAdmin,
  userCommentUpdate,
} from "../controllers/UserController.js";

import { verifyToken, isAdmin, isUser } from "../middlewares/authMiddleware.js";

const router = e.Router();
router.post("/register", RegisterUser);
router.post("/login", loginUser);

// Admin Routes
router.get("/all-user", verifyToken, isAdmin, allUser); // Test this api on http://localhost:3000/api/users/all-user
router.get("/user/:id", verifyToken, isAdmin, UserById); // Test this api on http://localhost:3000/api/users/user/:id
router.put("/user-update/:id", verifyToken, isAdmin, updateUser); // update user for active on http://localhost:3000/api/users/user-update/:id

router.get("/all-posts", verifyToken, isAdmin, AllPostForAdmin); // Test this api on http://localhost:3000/api/users/all-posts
router.post("/admin-update-post/:id", verifyToken, isAdmin, PostUpdateByAdmin);
router.put("/admin-comment-post/:id", verifyToken, isAdmin, CommentByAdmin);
router.put(
  "/admin-update-comment/:postId/:commentId",
  verifyToken,
  isUser,
  adminCommentUpdate
);
router.delete(
  "/admin-delete-comment/:postId/:commentId",
  verifyToken,
  isAdmin,
  adminCommentDelete
); // Test this api on http://localhost:3000/api/users/admin-delete-comment/:postId/:commentId
router.post("/admin-delete-post/:id", verifyToken, isAdmin, PostDeleteByAdmin);

// User Routes
router.post("/user-login", userLogin);
router.post("/user-create-post", verifyToken, isUser, userPost);
router.get("/all-post-user", verifyToken, isUser, userAllPost);
router.put("/user-comment-post/:id", verifyToken, isUser, CommentByUser);
router.put(
  "/user-update-comment/:postId/:commentId",
  verifyToken,
  isUser,
  userCommentUpdate
);
router.delete(
  "/user-delete-comment/:postId/:commentId",
  verifyToken,
  isUser,
  userCommentDelete
); // Test this api on http://localhost:3000/api/users/user-delete-comment/:postId/:commentId

router.post("/user-post-update/:id", verifyToken, isUser, userPostUpdate);
router.post("/user-post-delete/:id", verifyToken, isUser, userPostDelete);

export default router;
