import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { upload } from "../middlewares/multer.js";
import { addItem, deleteItemById, getItemById } from "../controllers/itemController.js";
import { editItem } from "../controllers/itemController.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single('image'), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single('image'), editItem);
itemRouter.get("/get-item/:itemId", isAuth, getItemById);
itemRouter.delete("/delete-item/:itemId", isAuth, deleteItemById);

export default itemRouter;
