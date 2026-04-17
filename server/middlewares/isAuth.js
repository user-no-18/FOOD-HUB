import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isAuth = async (req, res, next) => {
  try {
    // support both cookie and Authorization: Bearer header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized: no token" });

    const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodetoken) return res.status(401).json({ message: "Unauthorized: invalid token" });

    req.userId = decodetoken.id;
    next();
  } catch (error) {
    // JWT errors (expired, malformed) are client errors, not server errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }
    return res.status(401).json({ message: "Unauthorized" });
  }
};
