import User from "./models/userModel.js";
import DeliveryAssignment from "./models/deliveryAssignmentModel.js";
import Order from "./models/orderModel.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("⚡ New socket connection:", socket.id);

    // Handle user identity
    socket.on("identity", async ({ userId }) => {
      try {
        // basic guard: userId must be a non-empty string
        if (!userId || typeof userId !== "string") {
          console.log("❌ Invalid userId on identity event");
          return;
        }
        const user = await User.findById(userId);
        if (user) {
          user.socketId = socket.id;
          await user.save();
          console.log(`✅ User ${user.fullName} connected with socket ${socket.id}`);
        }
      } catch (error) {
        console.error("Identity error:", error);
      }
    });

    // Handle delivery boy location updates
    socket.on("update-location", async ({ userId, latitude, longitude }) => {
      try {
        console.log(`📍 Location update from ${userId}:`, { latitude, longitude });
        
        const deliveryBoy = await User.findById(userId);
        
        if (!deliveryBoy || deliveryBoy.role !== "deliveryBoy") {
          console.log("❌ User is not a delivery boy");
          return;
        }

        // Update delivery boy's location in database
        deliveryBoy.location = {
          type: "Point",
          coordinates: [longitude, latitude]
        };
        await deliveryBoy.save();

        // Find active assignments for this delivery boy
        const activeAssignment = await DeliveryAssignment.findOne({
          assignedTo: userId,
          status: "assigned"
        }).populate("order");

        if (activeAssignment && activeAssignment.order) {
          const order = activeAssignment.order;
          
          // Find the customer's socket ID
          const customer = await User.findById(order.user);
          
          if (customer && customer.socketId) {
            // Emit location update to customer
            io.to(customer.socketId).emit("deliveryboy-location-update", {
              orderId: order._id.toString(),
              location: {
                latitude,
                longitude
              }
            });
            
            console.log(`✅ Location sent to customer ${customer.fullName}`);
          }
        }
      } catch (error) {
        console.error("❌ Location update error:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      try {
        const user = await User.findOne({ socketId: socket.id });
        if (user) {
          console.log(`👋 User ${user.fullName} disconnected`);
          user.socketId = null;
          await user.save();
        }
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });
  });
};