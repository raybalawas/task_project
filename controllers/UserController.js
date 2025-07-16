import userModel from "../models/UserModel.js";
import bcrypt, { compareSync, hash } from "bcryptjs";
import jwt from "jsonwebtoken";

const RegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const pass = await bcrypt.compare(password, hashedPassword);
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
  return res
    .status(200)
    .json({ message: "user created successfully", data: user });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // console.log(email, password);
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
      id: existUser._id,
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

const logout = async (req, res) => {};

const allUser = async (req, res) => {
  const users = await userModel.find();
  return res
    .status(200)
    .json({ message: "Users fetched successfully!", data: users });
};
const UserById = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await userModel.findById(id);

  if (!user) {
    return res.status(400).json("User not exist on this id.");
  }
  return res
    .status(200)
    .json({ message: "user fetched by id successfully!", data: user });
};
const updateUser = async (req, res) => {
  const { name } = req.body;
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
    { name: name },
    { new: true }
  );
  if (!updateUser) {
    return res
      .status(400)
      .json({ message: "user not udpated! due to some issue" });
  }
  return res.status(200).json({
    message: "User udpated successfully",
    data: updateUser,
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
export {
  RegisterUser,
  allUser,
  UserById,
  updateUser,
  deleteUser,
  loginUser,
  logout,
};
