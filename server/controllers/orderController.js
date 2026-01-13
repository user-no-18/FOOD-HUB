import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import DeliveryAssignment from "../models/deliveryAssignmentModel.js";
import { sendDeliveryAcceptedMail } from "../utils/mail.js";
import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

let instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});



export const placeOrder = async (req, res) => {
  try {
    const { cartItems, address, paymentMethod, totalAmount } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!address || !address.text || !address.latitude || !address.longitude) {
      return res.status(400).json({
        success: false,
        message: "Address (text, latitude, longitude) is required",
      });
    }

    // Group cart items by shop
    const groupedByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupedByShop[shopId]) groupedByShop[shopId] = [];
      groupedByShop[shopId].push(item);
    });

    // Create shop orders
    const shopOrders = await Promise.all(
      Object.keys(groupedByShop).map(async (shopId) => {
        const shop = await Shop.findById(shopId).populate("owner");
        if (!shop) throw new Error(`Shop not found: ${shopId}`);

        const items = groupedByShop[shopId];
        const subtotal = items.reduce(
          (sum, i) => sum + Number(i.price) * Number(i.quantity),
          0
        );

        return {
          shop: shop._id,
          owner: shop.owner._id,
          shopOrderItems: items.map((i) => ({
            item: i.id,
            name: i.name,
            price: Number(i.price),
            quantity: Number(i.quantity),
            image: i.image,
          })),
          subtotal,
          status: "pending",
        };
      })
    );

    // For online payment, create Razorpay order
    if (paymentMethod === "online") {
      const razorOrder = await instance.orders.create({
        amount: totalAmount * 100,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      });

      const newOrder = await Order.create({
        user: req.userId,
        address,
        paymentMethod,
        totalAmount,
        shopOrders,
        razorpayOrderId: razorOrder.id,
        payment: false,
      });

      return res.status(200).json({
        success: true,
        razorOrder,
        order_id: newOrder._id,
      });
    }

    // For COD, create order directly
    const newOrder = await Order.create({
      user: req.userId,
      address,
      paymentMethod,
      totalAmount,
      shopOrders,
      payment: false,
    });

    // Populate ALL necessary fields for socket emission
    await newOrder.populate("shopOrders.shop", "name");
    await newOrder.populate("shopOrders.owner", "name email mobile socketId");
    await newOrder.populate(
      "shopOrders.shopOrderItems.item",
      "name image price"
    );
    await newOrder.populate("user", "fullName email mobile");

    // Get Socket.IO instance
    const io = req.app.get("io");

    // Emit to each shop owner with COMPLETE order data
    newOrder.shopOrders.forEach((shopOrder) => {
      const owner = shopOrder.owner;

      console.log({
        ownerId: owner._id,
        socketId: owner.socketId,
        shopName: shopOrder.shop.name,
      });

      if (owner && owner.socketId) {
        const orderForOwner = {
          _id: newOrder._id,
          user: {
            _id: newOrder.user._id,
            fullName: newOrder.user.fullName,
            email: newOrder.user.email,
            mobile: newOrder.user.mobile,
          },
          address: newOrder.address,
          paymentMethod: newOrder.paymentMethod,
          payment: newOrder.payment,
          totalAmount: newOrder.totalAmount,
          razorpayOrderId: newOrder.razorpayOrderId || null,
          razorpayPaymentId: newOrder.razorpayPaymentId || null,
          createdAt: newOrder.createdAt,
          shopOrder: {
            _id: shopOrder._id,
            shop: {
              _id: shopOrder.shop._id,
              name: shopOrder.shop.name,
            },
            owner: {
              _id: owner._id,
              name: owner.name,
              email: owner.email,
              mobile: owner.mobile,
            },
            subtotal: shopOrder.subtotal,
            status: shopOrder.status,
            shopOrderItems: shopOrder.shopOrderItems.map((item) => ({
              item: item.item,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            assignedDeliveryBoy: shopOrder.assignedDeliveryBoy || null,
          },
        };

        io.to(owner.socketId).emit("newOrder", orderForOwner);

        console.log(" Order notification sent to:", owner.email);
      } else {
        console.log(" Owner not connected:", owner.email);
      }
    });

    return res.status(200).json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to place order",
    });
  }
};
export const verifyPayment = async (req, res) => {
  try {
    const { razorpayPaymentId, orderId } = req.body;
    const payment = await instance.payments.fetch(razorpayPaymentId);

    if (!payment || payment.status != "captured") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not successful" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.payment = true;
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();

    await order.populate("shopOrders.shop", "name");
    await order.populate("shopOrders.owner", "name email mobile socketId");
    await order.populate("shopOrders.shopOrderItems.item", "name image price");
    await order.populate("user", "fullName email mobile");

    const io = req.app.get("io");

    order.shopOrders.forEach((shopOrder) => {
      const owner = shopOrder.owner;

      if (owner && owner.socketId) {
        const orderForOwner = {
          _id: order._id,
          user: {
            _id: order.user._id,
            fullName: order.user.fullName,
            email: order.user.email,
            mobile: order.user.mobile,
          },
          address: order.address,
          paymentMethod: order.paymentMethod,
          payment: order.payment,
          totalAmount: order.totalAmount,
          razorpayOrderId: order.razorpayOrderId || null,
          razorpayPaymentId: order.razorpayPaymentId || null,
          createdAt: order.createdAt,
          shopOrder: {
            _id: shopOrder._id,
            shop: {
              _id: shopOrder.shop._id,
              name: shopOrder.shop.name,
            },
            owner: {
              _id: owner._id,
              name: owner.name,
              email: owner.email,
              mobile: owner.mobile,
            },
            subtotal: shopOrder.subtotal,
            status: shopOrder.status,
            shopOrderItems: shopOrder.shopOrderItems.map((item) => ({
              item: item.item,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image,
            })),
            assignedDeliveryBoy: shopOrder.assignedDeliveryBoy || null,
          },
        };

        io.to(owner.socketId).emit("newOrder", orderForOwner);
      }
    });

    return res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        totalAmount: order.totalAmount,
      },
    });
  } catch (error) {
    console.error("Verify Razorpay Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyoders = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let orders;

    if (user.role === "user") {
      orders = await Order.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("shopOrders.shop", "name ")
        .populate("shopOrders.owner", "name email mobile")
        .populate("shopOrders.shopOrderItems.item", "name image price");
      return res.status(200).json(orders);
    } else if (user.role === "owner") {
      orders = await Order.find({ "shopOrders.owner": req.userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("shopOrders.shop", "name")
        .populate("user", "-password -resetOtp -otpExpires -isOtpVerified")
        .populate("shopOrders.shopOrderItems.item", "name image price")
        .populate("shopOrders.assignedDeliveryBoy", "fullName mobile ");
      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        user: order.user,
        address: order.address,
        paymentMethod: order.paymentMethod,
        payment: order.payment,
        totalAmount: order.totalAmount,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        createdAt: order.createdAt,
        shopOrder: order.shopOrders.find(
          (so) => so.owner.toString() === req.userId.toString()
        ),
      }));
      return res.status(200).json(filteredOrders);
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
//this controller is used for updating order status by shop owner and assigning delivery boy
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (so) => so.shop.toString() === shopId.toString()
    );

    if (!shopOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Shop order not found" });
    }

    shopOrder.status = status;
    order.markModified("shopOrders");

    let deliveryboyPayload = [];

    if (status === "out-for-delivery") {
      const { longitude, latitude } = order.address;

      const nearbyDeliveryBoy = await User.find({
        role: "deliveryBoy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [Number(longitude), Number(latitude)],
            },
            $maxDistance: 5000,
          },
        },
      });

      if (nearbyDeliveryBoy.length === 0) {
        await order.save();
        return res.status(200).json({
          success: true,
          message:
            "Status updated successfully, but no delivery boys found in 5km radius",
          shopOrder: shopOrder,
          assignedDeliveryBoy: null,
          availableBoys: [],
          assignment: null,
        });
      }

      const nearbyId = nearbyDeliveryBoy.map((user) => user._id);

      const busyId = await DeliveryAssignment.find({
        assignedTo: { $in: nearbyId },
        status: { $nin: ["delivered", "completed", "cancelled", "expired"] },
      }).distinct("assignedTo");

      const busyIdSet = new Set(busyId.map((id) => id.toString()));
      const availableBoys = nearbyDeliveryBoy.filter(
        (user) => !busyIdSet.has(user._id.toString())
      );

      const candidates = availableBoys.map((b) => b._id);

      if (candidates.length === 0) {
        await order.save();
        return res.status(200).json({
          success: true,
          message:
            "Status updated successfully, but all delivery boys are busy",
          shopOrder: shopOrder,
          assignedDeliveryBoy: null,
          availableBoys: [],
          assignment: null,
        });
      }

      if (!shopOrder.assignment) {
        const deliveryAssignment = await DeliveryAssignment.create({
          order: order._id,
          shop: shopId,
          shopOrderId: shopId,
          broadcastedTo: candidates,
          status: "broadcasted",
        });

        shopOrder.assignment = deliveryAssignment._id;
      }

      deliveryboyPayload = availableBoys.map((b) => ({
        id: b._id,
        fullName: b.fullName,
        mobile: b.mobile,
        longitude: b.location.coordinates[0],
        latitude: b.location.coordinates[1],
      }));
    }

    await order.save();
    await order.populate("shopOrders.shop", "name");
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName mobile email"
    );
    await order.populate("user", "fullName email mobile socketId");

    const updatedShopOrder = order.shopOrders.find(
      (so) => so.shop._id.toString() === shopId.toString()
    );

    const io = req.app.get("io");
    const user = order.user;

    if (user && user.socketId) {
      io.to(user.socketId).emit("update-order", {
        orderId: order._id,
        shopId: shopId,
        status: status,
        timestamp: new Date(),
      });
    }

    return res.status(200).json({
      success: true,
      shopOrder: updatedShopOrder,
      assignedDeliveryBoy: updatedShopOrder?.assignedDeliveryBoy || null,
      availableBoys: deliveryboyPayload,
      assignment: updatedShopOrder?.assignment || null,
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// This controller is used for fetching deliveryboy orders assigned to him with status broadcasted
export const getdeliveryBoyAssignmemts = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    }).populate("order shop");

    const formated = assignments.map((a) => ({
      id: a._id,
      orderId: a.order._id,
      shopId: a.shop._id,
      shopName: a.shop.name,
      orderAddress: a.order.address,
      items:
        a.order.shopOrders.find(
          (so) => so.shop.toString() === a.shop._id.toString()
        ).shopOrderItems || [],
      subtotal:
        a.order.shopOrders.find(
          (so) => so.shop.toString() === a.shop._id.toString()
        ).subtotal || 0,
      totalAmount: a.order.totalAmount,
      createdAt: a.createdAt,
    }));
    return res.status(200).json({ success: true, assignments: formated });
  } catch (error) {
    console.error("Error fetching delivery boy assignments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// Accept an order assignment
export const acceptOrder = async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const assignment = await DeliveryAssignment.findById(assignmentId);
    if (!assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }
    if (assignment.status !== "broadcasted") {
      return res.status(400).json({
        success: false,
        message: "Assignment is not available for acceptance",
      });
    }
    const alreadyAssigned = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: { $in: ["broadcasted", "completed"] },
    });
    if (alreadyAssigned) {
      return res.status(400).json({
        success: false,
        message: "You already have an active assignment",
      });
    }
    assignment.assignedTo = req.userId;
    assignment.status = "assigned";
    assignment.acceptedAt = new Date();
    await assignment.save();

    const order = await Order.findById(assignment.order);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    const shopOrder = order.shopOrders.find(
      (so) => so._id.toString() === assignment.shopOrderId.toString()
    );
    shopOrder.assignedDeliveryBoy = req.userId;
    order.markModified("shopOrders");
    await order.save();
    await order.populate(
      "shopOrders.assignedDeliveryBoy",
      "fullName mobile email"
    );
    return res
      .status(200)
      .json({ success: true, message: "Order accepted successfully" });
  } catch (error) {
    console.error("Error accepting order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get current order assigned to delivery

export const getCurrentOrder = async (req, res) => {
  try {
    const order = await DeliveryAssignment.findOne({
      assignedTo: req.userId,
      status: "assigned",
    })
      .populate("shop", "name")
      .populate("assignedTo", "fullName mobile email location")
      .populate({
        path: "order",
        populate: [{ path: "user", select: "fullName mobile email location" }],
      });

    if (!order) {
      return res
        .status(200)
        .json({ success: false, message: "Order Delivered Or No order found" });
    }
    if (!order.order) {
      return res
        .status(404)
        .json({ success: false, message: "order not found" });
    }

    const shopOrder = order.order.shopOrders.find(
      (so) => so.shop.toString() === order.shop._id.toString()
    );
    if (!shopOrder) {
      return res
        .status(404)
        .json({ success: false, message: "shop order not found" });
    }
    let deliveryBoyLocation = { lat: null, lng: null };
    if (order.assignedTo.location.coordinates.length == 2) {
      deliveryBoyLocation.lat = order.assignedTo.location.coordinates[1];
      deliveryBoyLocation.lng = order.assignedTo.location.coordinates[0];
    }
    console.log("Delivery Boy Location:", deliveryBoyLocation);
    let orderLocation = { lat: null, lng: null };
    if (order.order.address.latitude && order.order.address.longitude) {
      orderLocation.lat = order.order.address.latitude;
      orderLocation.lng = order.order.address.longitude;
    }
    console.log("Order Location:", orderLocation);

    return res.status(200).json({
      success: true,
      _id: order._id,
      user: order.order.user,
      shopOrder,
      deliveryAddress: order.order.address,
      deliveryBoyLocation,
      orderLocation,
    });
  } catch (error) {
    console.error("Error fetching current order:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
// this controller is used for fetching order by ID with proper population and formatting and connected to frontend with orderDetails page

export const getOrderbyID = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Fetch order with only valid populate paths
    const order = await Order.findById(orderId)
      .populate("user", "fullName mobile email location")
      .populate({ path: "shopOrders.shop", model: "Shop" })
      .populate({ path: "shopOrders.assignedDeliveryBoy", model: "User" })
      .lean(); // ✅ convert to plain JS object

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.shopOrders = order.shopOrders.map((shopOrder) => {
      return {
        ...shopOrder,
        shopOrderItems: shopOrder.shopOrderItems.map((item) => ({
          itemId: item.item?._id || item.item || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      };
    });

    return res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching order by ID" });
  }
};

export const sendDeliveryOtp = async (req, res) => {
  try {
    const { shopOrderId } = req.body;
    const order = await Order.findOne({
      "shopOrders._id": shopOrderId,
    }).populate("user");
    console.log("Fetched order:", order);
    const shopOrder = order.shopOrders?.id(shopOrderId);
    if (!shopOrder)
      return res
        .status(404)
        .json({ message: "enter valid order/shopOrder id" });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    shopOrder.deliveryOtp = otp;
    shopOrder.otpExpires = Date.now() + 5 * 60 * 1000;
    await order.save();
    await sendDeliveryAcceptedMail(order.user, otp);
    return res
      .status(200)
      .json({ message: `otp sent to ${order?.user?.fullName}` });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `send deliveryOtp error : ${error}` });
  }
};

export const verifyDeliveryOtp = async (req, res) => {
  try {
    const { shopOrderId, otp } = req.body;

    if (!shopOrderId || !otp) {
      return res
        .status(400)
        .json({ message: "shopOrderId and otp are required" });
    }

    const order = await Order.findOne({
      "shopOrders._id": shopOrderId,
    }).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const shopOrder = order.shopOrders.id(shopOrderId);

    if (!shopOrder) {
      return res.status(404).json({ message: "Shop order not found" });
    }

    if (!shopOrder.deliveryOtp) {
      return res.status(400).json({ message: "OTP not generated yet" });
    }

    if (
      shopOrder.deliveryOtp !== otp ||
      !shopOrder.otpExpires ||
      shopOrder.otpExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    shopOrder.status = "delivered";
    shopOrder.deliveredAt = Date.now();

    shopOrder.deliveryOtp = null;
    shopOrder.otpExpires = null;

    await order.save();

    await DeliveryAssignment.deleteOne({
      shop: shopOrder.shop,
      order: order._id,
      assignedTo: shopOrder.assignedDeliveryBoy,
    });

    return res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: `verify deliveryOtp error : ${error}` });
  }
};
