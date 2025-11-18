import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { acceptOrder, getCurrentOrder, getdeliveryBoyAssignmemts, getMyoders, getOrderbyID, placeOrder, sendDeliveryOtp, updateOrderStatus, verifyDeliveryOtp } from '../controllers/orderController.js';



const orderRouter = express.Router();

orderRouter.post('/place-order',isAuth, placeOrder);
orderRouter.get('/get-orders',isAuth, getMyoders);
orderRouter.get('/get-assignments',isAuth, getdeliveryBoyAssignmemts);
orderRouter.get('/get-current-order', isAuth, getCurrentOrder);
orderRouter.post('/send-otp', isAuth, sendDeliveryOtp);
orderRouter.post('/verify-otp', isAuth, verifyDeliveryOtp);
orderRouter.patch('/update-status/:orderId/:shopId', isAuth, updateOrderStatus);
orderRouter.get('/accept-order/:assignmentId', isAuth, acceptOrder);
orderRouter.get('/get-order-by-id/:orderId', isAuth, getOrderbyID);
export default orderRouter