import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import socket from "../socket"; // Import socket

// Icons
import { MdKeyboardBackspace, MdOutlineShoppingBag, MdSearch } from "react-icons/md";
import { TbReceipt2 } from "react-icons/tb";

// Components
import UserOrderCard from "../components/UserOrderCard";
import OwnerOrdersDemo from "../components/OwnerOrderCard";
import { setMyOrders } from "../Redux/user.slice";

const MyOrderCard = () => {
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  // Listen for new orders via Socket.IO
  useEffect(() => {
    if (!userData) return;

    const handleNewOrder = (orderData) => {
      console.log("New order received via socket:", orderData);
      
      // Validate the data structure before using
      if (!orderData || !orderData._id || !orderData.shopOrder) {
        console.error("invalid order data received:", orderData);
        return;
      }
      
      // For owners, check if this order is for their shop
      if (userData.role === "owner") {
        console.log(" Adding new order to list");
        
        // Add the new order to the beginning of the list
        // Ensure we don't add duplicates
        const isDuplicate = myOrders.some(order => order._id === orderData._id);
        
        if (!isDuplicate) {
          dispatch(setMyOrders([orderData, ...myOrders]));
          
          // Optional: Show browser notification
          if (Notification.permission === "granted") {
            new Notification(" New Order!", {
              body: `Order #${orderData._id.slice(-8)} - ₹${orderData.totalAmount}`,
              icon: "/vite.svg",
              tag: orderData._id, // Prevent duplicate notifications
            });
          }
          
          // Optional: Play sound
          const audio = new Audio('/notification.mp3'); // Add notification sound to public folder
          audio.play().catch(err => console.log("Audio play failed:", err));
        }
      }
    };

    // Listen for the newOrder event
    socket.on("newOrder", handleNewOrder);

    // Request notification permission on mount (for owners)
    if (userData.role === "owner" && Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        console.log("Notification permission:", permission);
      });
    }

    // Cleanup listener on unmount
    return () => {
      socket.off("newOrder", handleNewOrder);
    };
  }, [userData, myOrders, dispatch]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, ease: "easeOut" } 
    },
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <div className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-lg border-b border-slate-200 transition-all">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-sm"
              >
                <MdKeyboardBackspace className="w-5 h-5 text-slate-600" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-md shadow-slate-200">
                  <TbReceipt2 className="text-white text-lg" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold tracking-tight leading-tight">
                    Orders
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">
                    {myOrders?.length || 0} total
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Search */}
            <div className="relative w-full md:w-60 hidden sm:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdSearch className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {myOrders && myOrders.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-4"
          >
            {/* Section Label */}
            <motion.h2
              variants={itemVariants}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 pl-1"
            >
              History
            </motion.h2>

            <AnimatePresence>
              {myOrders.map((order, index) => (
                <motion.div
                  key={order._id || index}
                  variants={itemVariants}
                  layout
                  className=""
                >
                  {userData?.role === "user" ? (
                    <UserOrderCard data={order} />
                  ) : userData?.role === "owner" ? (
                    <OwnerOrdersDemo data={order} />
                  ) : null}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="w-28 h-28 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-6">
              <MdOutlineShoppingBag className="text-5xl text-orange-500 opacity-90" />
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
              No orders yet
            </h3>

            <p className="text-slate-500 text-center max-w-sm text-sm leading-relaxed mb-8">
              You haven't received any orders yet.  
              <br />
              New orders will appear here in real-time.
            </p>

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MyOrderCard;