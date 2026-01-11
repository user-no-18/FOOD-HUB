// server/socket.js - Improved with error handling
import User from "./models/userModel.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);

    // Handle user identity
    socket.on("identity", async ({ userId }) => {
      try {
        if (!userId) {
          console.error("❌ No userId provided");
          return;
        }

        const user = await User.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true }
        );

        if (user) {
          console.log("✅ User connected:", {
            id: user._id,
            name: user.fullName,
            role: user.role,
            socketId: socket.id
          });
          
          // Confirm identity back to client
          socket.emit("identity_confirmed", {
            userId: user._id,
            socketId: socket.id
          });
        } else {
          console.error("❌ User not found:", userId);
        }
      } catch (error) {
        console.error("❌ Identity error:", error);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async (reason) => {
      console.log("🔌 Client disconnected:", socket.id, "Reason:", reason);
      
      try {
        const user = await User.findOneAndUpdate(
          { socketId: socket.id },
          { 
            socketId: null, 
            isOnline: false 
          },
          { new: true }
        );
        
        if (user) {
          console.log("👋 User disconnected:", user.fullName);
        }
      } catch (error) {
        console.error("❌ Disconnect cleanup error:", error);
      }
    });

    // Optional: Heartbeat to keep connection alive
    socket.on("ping", () => {
      socket.emit("pong");
    });
  });

  // Global error handler
  io.on("error", (error) => {
    console.error("❌ Socket.IO error:", error);
  });
};