import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";

export const placeOrder = async (req, res) => {
  try {
    const { cartItems, address, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!address || !address.text || !address.latitude || !address.longitude) {
      return res.status(400).json({
        success: false,
        message: "Address (text, latitude, longitude) is required",
      });
    }

    const groupedByShop = {};
    cartItems.forEach((item) => {
      const shopId = item.shop;
      if (!groupedByShop[shopId]) groupedByShop[shopId] = [];
      groupedByShop[shopId].push(item);
    });

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
    let totalAmount = shopOrders.reduce((sum, so) => sum + so.subtotal, 0);
    let newOrder = await Order.create({
      user: req.userId,
      address,
      paymentMethod,
      totalAmount,
      shopOrders,
      // razorpayOrderId: razorOrder.id,
      // payment: false,
    });

    return res.status(200).json(newOrder);
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
        .populate("shopOrders.shopOrderItems.item", "name image price");
      const filteredOrders = orders.map((order) => ({
        _id: order._id,
        user: order.user,
        address: order.address,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        shopOrder: order.shopOrders.find(
          (so) => so.owner.toString() === req.userId.toString()
        ),
      }));
      return res.status(200).json(filteredOrders);
    } else {
      return res.status(403).json({ success: false, message: "Invalid role" });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, shopId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const shopOrder = order.shopOrders.find(
      (so) => so.shop.toString() === shopId.toString()
    );

    if (!shopOrder) {
      return res.status(404).json({ success: false, message: "Shop order not found" });
    }

    shopOrder.status = status;
    order.markModified('shopOrders');
    await order.save();

    return res.status(200).json({ 
      success: true, 
      message: "Status updated successfully" 
    });
  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};