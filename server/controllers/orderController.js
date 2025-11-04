import Shop from "../models/shopModel.js";
import User from "../models/userModel.js";
import Order from "../models/orderModel.js";
import DeliveryAssignment from "../models/deliveryAssignmentModel.js";

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
          shop: shopOrder.shop,
          shopOrderId: shopOrder._id,
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

    const updatedShopOrder = order.shopOrders.find(
      (so) => so.shop._id.toString() === shopId.toString()
    );

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


export const getdeliveryBoyAssignmemts = async (req, res) => {
  try {
    const deliveryBoyId = req.userId;
    const assignments = await DeliveryAssignment.find({
      broadcastedTo: deliveryBoyId,
      status: "broadcasted",
    }).populate("order shop");

    const formated  = assignments.map((a) => ({
      id: a._id,
      orderId: a.order._id,
      shopId: a.shop._id,
      shopName: a.shop.name,
      orderAddress: a.order.address,
      items: a.order.shopOrders.find(so => so.shop.toString() === a.shop._id.toString()).shopOrderItems || [],
      subtotal: a.order.shopOrders.find(so => so.shop.toString() === a.shop._id.toString()).subtotal || 0,
      totalAmount: a.order.totalAmount,
      createdAt: a.createdAt,
    }));
    return res.status(200).json({ success: true, assignments: formated });
  } catch (error) {
    console.error("Error fetching delivery boy assignments:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}