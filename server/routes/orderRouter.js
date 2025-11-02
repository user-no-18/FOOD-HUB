import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { getMyoders, placeOrder } from '../controllers/orderController.js';



const orderRouter = express.Router();

orderRouter.post('/place-order',isAuth, placeOrder);
orderRouter.get('/get-orders',isAuth, getMyoders);


export default orderRouter