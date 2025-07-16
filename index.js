import e from "express";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = e();
app.use(cors());
app.use(e.json());
app.use("/api/users", userRoute);

const db = process.env.MONGO_URI;
mongoose
  .connect("mongodb://127.0.0.1:27017/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Mongo Error:", err));

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`server is started on http://localhost:${port}/`);
});
