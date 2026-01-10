import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: String,
  },
  { _id: false }
);

const shopOrderSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subtotal: { type: Number, required: true },

    shopOrderItems: {
      type: [orderItemSchema],
      required: true,
    },

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
      default: null,
    },

    otpExpires: {
      type: Date,
      default: null,
    },

    deliveredAt: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    address: {
      text: { type: String, required: true },
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    shopOrders: {
      type: [shopOrderSchema],
      required: true,
    },

    payment: {
      type: Boolean,
      default: false,
    },

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

 
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
