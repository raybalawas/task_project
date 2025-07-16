import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" },
  verified: { type: Boolean, default: false },
  login_jwt_token: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);
export default userModel;
