import crypto from "crypto";
import Order from "../models/orderModel.js";

export const razorpayWebhook = async (req, res) => {
  try {
    const razorpaySignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false });
    }

    const eventName = req.body.event;
    
    if (eventName === "payment.captured" || eventName === "order.paid") {
      const razorpayOrderId = req.body.payload.payment.entity.order_id;
      const razorpayPaymentId = req.body.payload.payment.entity.id;
      
      const order = await Order.findOne({ razorpayOrderId: razorpayOrderId });
      
      if (order && order.payment === false) {
        order.payment = true;
        order.razorpayPaymentId = razorpayPaymentId;
        await order.save();
        
        const io = req.app.get("io");
        if(io) {
          io.emit("webhook-payment-success", { orderId: order._id });
        }
      }
    }
    
    return res.status(200).send("ok");
  } catch (error) {
    return res.status(500).send("err");
  }
};
