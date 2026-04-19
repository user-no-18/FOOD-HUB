import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const token = jwt.sign(
  { id: "68c953077520603f8715fb08" }, // existing user from DB
  process.env.JWT_SECRET || "secret",
  { expiresIn: "1d" }
);

console.log(token);
