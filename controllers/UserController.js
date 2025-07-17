import userModel from "../models/UserModel.js";
import postModel from "../models/PostModel.js";
import bcrypt, { compareSync, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const RegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    console.log("Please provide all required fields: name, email, password");
    return res
      .status(400)
      .json("Please provide all required fields: name, email, password");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  // const pass = await bcrypt.compare(password, hashedPassword);
  // console.log(pass);
  // if ((pass === true)) {
  //   console.log("password matched successfully");
  // }
  const existUser = await userModel.findOne({ email });
  console.log(existUser);
  if (existUser) {
    console.log("user already exist:", existUser.email);
    return res.status(400).json("user already exist!");
  }
  if (role === "admin") {
    const adminUser = await userModel.findOne({ role: "admin" });
    if (adminUser) {
      return res
        .status(400)
        .json("Admin user Already exists, cannot create more.");
    }
  }
  if (role !== "user") {
    console.log("Role must be user");
    return res.status(400).json("Role must be user");
  }
  const user = await userModel.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  console.log("user created successfully!");
  if (!user) {
    console.log("user not created due to some issue");
    return res.status(400).json("user not created due to some issue");
  }
  const userWithoutPassword = await userModel
    .findById(user._id)
    .select("-password");
  return res
    .status(200)
    .json({ message: "user created successfully", data: userWithoutPassword });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  if (!email || !password) {
    console.log("Please provide email and password");
    return res.status(400).json("Please provide email and password");
  }
  const existUser = await userModel.findOne({ email });
  if (!existUser) {
    console.log("user not exists");
    return res.status(200).json("user not found! Please signup first.");
  }
  const passConfrm = await bcrypt.compare(password, existUser.password);
  console.log("Password confiramtion:", passConfrm);
  if (!passConfrm) {
    console.log("Invalid Password!");
  }

  console.log("JWT FROM ENV", process.env.JWT_SECRET);
  const token = jwt.sign(
    {
      _id: existUser._id,
      role: existUser.role,
    },
    process.env.JWT_SECRET || "mysecret"
  );
  console.log(token);
  existUser.login_jwt_token = token;
  await existUser.save();
  return res.status(200).json({
    message: "Login Successful",
    token,
    role: existUser.role,
  });
};

const allUser = async (req, res) => {
  const users = await userModel.find();
  if (!users || users.length === 0) {
    console.log("No users found");
    return res.status(200).json({ message: "No users found", data: [] });
  }
  console.log("Users fetched successfully!");
  const lessData = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }));
  return res
    .status(200)
    .json({ message: "Users fetched successfully!", data: lessData });
};
const UserById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await userModel.findById(id);
  const lessData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
  if (!user) {
    return res.status(400).json("User not exist on this id.");
  }
  return res
    .status(200)
    .json({ message: "user fetched by id successfully!", data: lessData });
};
const updateUser = async (req, res) => {
  const { name, status } = req.body;
  console.log(name);
  //   return false;
  const id = req.params.id;
  console.log(id);
  const findUser = await userModel.findById(id);
  if (!findUser) {
    console.log("user not find");
    return res.status(400).json("User not exists in our database!");
  }
  console.log("userId", findUser._id);
  const updateUser = await userModel.findByIdAndUpdate(
    id,
    { name, status },
    { new: true }
  );
  if (!updateUser) {
    return res
      .status(400)
      .json({ message: "user not udpated! due to some issue" });
  }
  const lessData = {
    _id: updateUser._id,
    name: updateUser.name,
    email: updateUser.email,
    role: updateUser.role,
    status: updateUser.status,
  };
  return res.status(200).json({
    message: "User udpated successfully",
    data: lessData,
  });
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
  if (!email || !password) {
    console.log("Please provide email and password");
    return res.status(400).json("Please provide email and password");
  }
  const existUser = await userModel.findOne({ email });
  if (!existUser) {
    console.log("user not exists");
    return res.status(200).json("user not found! Please signup first.");
  }
  const passConfrm = await bcrypt.compare(password, existUser.password);
  console.log("Password confiramtion:", passConfrm);
  if (!passConfrm) {
    console.log("Invalid Password!");
  }
  console.log("User role:", existUser.role);
  if (existUser.role !== "user") {
    console.log("User is not Active yet or not a user role");
    return res.status(400).json("User is not Active yet or not a user role");
  }
  if (!existUser.status || existUser.status !== 1) {
    console.log("User is not Active");
    return res
      .status(400)
      .json("User is not Active yet. Please contact admin.");
  }
  console.log("JWT FROM ENV", process.env.JWT_SECRET);
  const token = jwt.sign(
    {
      _id: existUser._id,
      role: existUser.role,
    },
    process.env.JWT_SECRET || "mysecret"
  );
  console.log(token);
  existUser.login_jwt_token = token;
  await existUser.save();
  return res.status(200).json({
    message: "User Login Successful",
    token,
    role: existUser.role,
  });
};

const userPost = async (req, res) => {
  // return res.status(200).json("User post route is working fine");
  const { title, content } = req.body;
  if (!title || !content) {
    return res
      .status(400)
      .json("Please provide title and content for the post");
  }
  const existingPost = await postModel.findOne({
    title,
    author: req.user._id,
  });
  console.log("Existing Post:", existingPost);

  if (existingPost) {
    console.log("Post with this title already exists for this user");
    return res
      .status(400)
      .json("Post with this title already exists for this user");
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json("Unauthorized: Missing user ID");
  }
  console.log("Creating post for user:", req.user._id);
  console.log("Post Data:", { title, content, author: req.user._id });
  const post = await postModel.create({
    title,
    content,
    author: req.user._id,
  });
  if (!post) {
    return res.status(400).json("Post not created due to some issue");
  }
  return res.status(200).json({
    message: "Post created successfully",
    data: post,
  });
};

const userAllPost = async (req, res) => {
  const posts = await postModel
    .find()
    .populate("comments.commentedBy", "name email");
  if (!posts || posts.length === 0) {
    return res
      .status(200)
      .json({ message: "No posts found for this user", data: [] });
  }
  return res.status(200).json({
    message: "Posts fetched successfully",
    data: posts,
  });
};

const CommentByUser = async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;
  const post = await postModel.findById(postId);
  if (!comment || !postId) {
    return res.status(400).json("Please provide comment and post ID");
  }
  post.comments.push({
    text: comment,
    commentedBy: req.user._id,
  });

  await post.save();
  return res.status(200).json({
    message: "Comment added successfully",
    data: post.comments[post.comments.length - 1],
  });
};

const userCommentUpdate = async (req, res) => {
  const { comment } = req.body;
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  if (!comment || !postId || !commentId) {
    return res.status(400).json({ message: "Missing required data." });
  }

  try {
    const result = await postModel.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
        "comments.commentedBy": userId,
      },
      {
        $set: {
          "comments.$.text": comment,
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        message: "Post or comment not found, or you're not authorized.",
      });
    }

    const updatedComment = result.comments.find(
      (c) => c._id.toString() === commentId
    );

    return res.status(200).json({
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userCommentDelete = async (req, res) => {
  const { postId, commentId } = req.params;
  const userId = req.user._id;

  if (!commentId || !postId) {
    return res
      .status(400)
      .json({ message: "Post ID and Comment ID are required" });
  }

  try {
    const post = await postModel.findOne({
      _id: postId,
      "comments._id": commentId,
      "comments.commentedBy": userId,
    });

    if (!post) {
      return res.status(404).json({ message: "Post or comment not found" });
    }

    post.comments = post.comments.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await post.save();

    return res.status(200).json({
      message: "Comment deleted successfully",
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const userPostUpdate = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  const post = await postModel.findById(postId);

  console.log("Post to update:", post);

  if (!post) {
    return res.status(404).json("Post not found");
  }

  if (!post.author) {
    return res.status(400).json("Post author is missing");
  }

  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json("You are not authorized to update this post");
  }

  post.content = content || post.content;
  await post.save();

  return res.status(200).json({
    message: "Post updated successfully",
    data: post,
  });
};

const userPostDelete = async (req, res) => {
  const postId = req.params.id;

  const post = await postModel.findById(postId);
  console.log("Post to delete:", post);
  if (!post) {
    return res.status(404).json("Post not found");
  }
  if (!post.author) {
    return res.status(400).json("Post author is missing");
  }
  if (post.author.toString() !== req.user._id.toString()) {
    return res.status(403).json("You are not authorized to delete this post");
  }
  await postModel.findByIdAndDelete(postId);
  return res.status(200).json({
    message: "Post deleted successfully",
  });
};

const AllPostForAdmin = async (req, res) => {
  const posts = await postModel.find().populate("author", "name email");
  if (!posts || posts.length === 0) {
    return res.status(200).json({ message: "No posts found", data: [] });
  }
  return res.status(200).json({
    message: "All posts fetched successfully",
    data: posts,
  });
};
const CommentByAdmin = async (req, res) => {
  const { comment } = req.body;
  const postId = req.params.id;
  const post = await postModel
    .findById(postId)
    .populate("author", "name email");
  console.log("comment on this Post", post);
  if (!post) {
    return res.status(404).json("Post not found");
  }
  post.comments.push({
    text: comment,
    commentedBy: req.user._id,
  });

  await post.save();
  console.log(
    "Comment added by admin:",
    post.comments[post.comments.length - 1]
  );
  return res.status(200).json({
    message: "Comment added successfully",
    data: post.comments[post.comments.length - 1],
  });
};

const adminCommentUpdate = async (req, res) => {
  const { comment } = req.body;
  const { postId, commentId } = req.params;

  if (!comment || !postId || !commentId) {
    return res.status(400).json({ message: "Missing required data." });
  }

  try {
    const result = await postModel.findOneAndUpdate(
      {
        _id: postId,
        "comments._id": commentId,
      },
      {
        $set: {
          "comments.$.text": comment,
        },
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        message: "Post or comment not found",
      });
    }

    const updatedComment = result.comments.find(
      (c) => c._id.toString() === commentId
    );

    return res.status(200).json({
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const adminCommentDelete = async (req, res) => {
  const { postId, commentId } = req.params;
  if (!postId || !commentId) {
    return res
      .status(400)
      .json({ message: "Post ID and Comment ID are required" });
  }
  try {
    const post = await postModel.findById(postId);
    // return res.status(404).json({ data: post});
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.filter(
      (comment) => comment._id.toString() === commentId
    );

    if (commentIndex === -1 || commentIndex.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.status(200).json({ message: "Comment deleted by admin" });
  } catch (err) {
    console.error("Admin delete error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

const PostUpdateByAdmin = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  const post = await postModel.findById(postId);

  console.log("Post to update:", post);

  if (!post) {
    return res.status(404).json("Post not found");
  }

  post.content = content || post.content;
  await post.save();

  return res.status(200).json({
    message: "Post updated successfully",
    data: post,
  });
};
const PostDeleteByAdmin = async (req, res) => {
  const postId = req.params.id;

  const post = await postModel.findById(postId);
  if (!post) {
    return res.status(404).json("Post not found");
  }
  await postModel.findByIdAndDelete(postId);
  return res.status(200).json({
    message: "Post deleted successfully",
  });
};
export {
  RegisterUser,
  allUser,
  UserById,
  updateUser,
  loginUser,
  userLogin,
  userPost,
  userAllPost,
  CommentByUser,
  userCommentUpdate,
  userCommentDelete,
  userPostUpdate,
  userPostDelete,
  AllPostForAdmin,
  CommentByAdmin,
  adminCommentUpdate,
  adminCommentDelete,
  PostUpdateByAdmin,
  PostDeleteByAdmin,
};
