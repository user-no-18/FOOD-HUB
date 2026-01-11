// client/src/socket.js - Improved configuration
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Create socket connection with better config
const socket = io(SOCKET_URL, {
  autoConnect: false, // Don't connect immediately
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling'], // Try websocket first, fallback to polling
});

// Connection event handlers
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
  
  // Auto-reconnect for certain reasons
  if (reason === "io server disconnect") {
    // Server forced disconnect, manually reconnect
    socket.connect();
  }
});

socket.on("connect_error", (error) => {
  console.error("⚠️ Socket connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log("🔄 Reconnection attempt", attemptNumber);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed");
});

export default socket;