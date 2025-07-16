import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json("Token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json("Invalid Token");
  }
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(401).json("Access denied: Admins only!");
  }
  next();
};

const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(401).json("Access denied: User only!");
  }
  next();
};
export { verifyToken, isAdmin, isUser };
