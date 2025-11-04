import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { getdeliveryBoyAssignmemts, getMyoders, placeOrder, updateOrderStatus } from '../controllers/orderController.js';



const orderRouter = express.Router();

orderRouter.post('/place-order',isAuth, placeOrder);
orderRouter.get('/get-orders',isAuth, getMyoders);
orderRouter.get('/get-assignments',isAuth, getdeliveryBoyAssignmemts);
orderRouter.patch('/update-status/:orderId/:shopId', isAuth, updateOrderStatus);

export default orderRouter