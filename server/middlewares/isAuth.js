import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const isAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(400).json({ message: "token not found" });
    const decodetoken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodetoken)
      return res.status(400).json({ message: "user not found" });
    console.log(decodetoken)
    req.userId= decodetoken.id
    next();
  }
   catch (error) {
    return res.status(500).json({ message: "isAuth error" });
   }
};
