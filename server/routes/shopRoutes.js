import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { createEditShop, getMyShop, getShopByCity } from '../controllers/shopController.js';
import { upload } from '../middlewares/multer.js';


const shopRouter = express.Router();

shopRouter.post('/create-edit',isAuth,upload.single('image'),createEditShop );
shopRouter.get('/my-shop', isAuth, getMyShop);
shopRouter.get('/get-shop-by-city/:city', isAuth, getShopByCity);

export default shopRouter;