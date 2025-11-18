import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const shopOrderSchema = new mongoose.Schema({
  shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  subtotal: Number,
  shopOrderItems: [],
  status: {
    type: String,
    enum: [
      "pending",
      "preparing",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryAssignment",
    default: null,
  },
  assignedDeliveryBoy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  deliveryOtp: {
      type: String,
      default:null,
    },
    
    otpExpires: {
      type: Date,
       default:null,
    },
    deliveredAt:{
      type:Date,
      default:null,
    }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  address: {
    text: String,
    latitude: Number,
    longitude: Number,
  },
  paymentMethod: { type: String, enum: ["cod", "online"], required: true },
  totalAmount: Number,
  shopOrders: [shopOrderSchema],

  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model("Order", orderSchema);
export default Order;
