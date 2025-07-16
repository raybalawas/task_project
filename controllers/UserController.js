import userModel from "../models/UserModel.js";
import postModel from "../models/PostModel.js";
import bcrypt, { compareSync, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const RegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (role !== "user") {
    console.log("Role must be 'user'");
    return res.status(400).json("Role must be 'user'");
  }
  if (!name || !email || !password) {
    console.log("Please provide all required fields: name, email, password");
    return res.status(400).json("Please provide all required fields: name, email, password");
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
  const userWithoutPassword = await userModel.findById(user._id).select("-password");
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
  const lessData = users.map(user => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.verified,
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
    verified: user.verified,
  }
  if (!user) {
    return res.status(400).json("User not exist on this id.");
  }
  return res
    .status(200)
    .json({ message: "user fetched by id successfully!", data: lessData });
};
const updateUser = async (req, res) => {
  const { name, verified } = req.body;
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
    { name, verified },
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
    verified: updateUser.verified,
  }
  return res.status(200).json({
    message: "User udpated successfully",
    data: lessData,
  });
};
const deleteUser = async (req, res) => {
  const id = req.params.id;

  const deletedUser = await userModel.findByIdAndDelete(id);
  if (!deletedUser) {
    console.log("User not found");
    return res.status(400).json("User not found");
  }
  console.log("user deleted successfully!");
  return res.status(200).json("user deleted successfully!");
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
  if (existUser.role !== "user" && existUser.verified === false) {
    console.log("User is not verified or not a user role");
    return res.status(400).json("User is not verified or not a user role");
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
    return res.status(400).json("Please provide title and content for the post");
  }
  const existingPost = await postModel.findOne({
    title,
    author: req.user._id
  });
  console.log("Existing Post:", existingPost);

  if (existingPost) {
    console.log("Post with this title already exists for this user");
    return res.status(400).json("Post with this title already exists for this user");
  }

  if (!req.user || !req.user._id) {
    return res.status(401).json("Unauthorized: Missing user ID");
  }
  console.log("Creating post for user:", req.user._id);
  console.log("Post Data:", { title, content, author: req.user._id });
  const post = await postModel.create({
    title,
    content,
    author: req.user._id
  });
  if (!post) {
    return res.status(400).json("Post not created due to some issue");
  }
  return res.status(200).json({
    message: "Post created successfully",
    data: post,
  });
}

const userAllPost = async (req, res) => {
  const posts = await postModel.find(
    { author: req.user._id }
  ).populate("author", "name email");
  if (!posts || posts.length === 0) {
    return res.status(200).json({ message: "No posts found for this user", data: [] });
  }
  return res.status(200).json({
    message: "Posts fetched successfully",
    data: posts,
  });
};

const userPostUpdate = async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;

  const post = await postModel.findById(postId);

  console.log("Post to update:", post);

  if (!post) {
    return res.status(404).json("Post not found");
  }

  // ✅ Check if author is present
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


export {
  RegisterUser,
  allUser,
  UserById,
  updateUser,
  deleteUser,
  loginUser,
  userLogin,
  userPost,
  userAllPost,
  userPostUpdate
};
