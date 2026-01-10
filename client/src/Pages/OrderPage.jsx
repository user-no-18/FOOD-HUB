import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";

const OrderPage = () => {
  const navigate = useNavigate();

  // Animation variants for the tick
  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        delay: 0.2,
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#fff9f6] flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans selection:bg-[#ff4d2d] selection:text-white">
      
      {/* Background Decorative Blobs (Aesthetic touch) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#ff4d2d] rounded-full mix-blend-multiply filter blur-3xl opacity-[0.05] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-[0.05] animate-blob animation-delay-2000"></div>

      {/* Main Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-12 max-w-md w-full text-center relative z-10 border border-gray-100"
      >
        
        {/* Animated Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 flex items-center justify-center bg-green-50 rounded-full">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="100"
              height="100"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 w-12 h-12"
            >
              {/* The Circle */}
              <motion.circle 
                cx="12" 
                cy="12" 
                r="10" 
                className="stroke-green-500"
                variants={circleVariants}
                initial="hidden"
                animate="visible"
              />
              {/* The Checkmark */}
              <motion.path 
                d="M9 12l2 2 4-4" 
                className="stroke-green-500"
                strokeWidth="3"
                variants={checkVariants}
                initial="hidden"
                animate="visible"
              />
            </motion.svg>
          </div>
        </div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mb-8 text-base leading-relaxed">
            Woohoo! Your payment was successful. We are firing up the ovens for order <span className="font-semibold text-gray-800">#82910</span>.
          </p>

          {/* Mini Receipt / Detail Box (SaaS Style) */}
          <div className="bg-gray-50 rounded-xl p-4 mb-8 flex justify-between items-center text-sm border border-gray-100">
            <span className="text-gray-500">Est. Delivery</span>
            <span className="font-bold text-gray-800 flex items-center gap-1">
              35 - 45 mins
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/my-orders")}
              className="w-full bg-[#ff4d2d] hover:bg-[#e03e20] text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg shadow-[#ff4d2d]/20 flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
            >
              Track Order
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="w-full bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 py-4 rounded-xl text-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer / Help text */}
      <p className="mt-8 text-gray-400 text-sm">
        Need help? <span className="text-gray-600 font-medium cursor-pointer underline hover:text-[#ff4d2d]">Contact Support</span>
      </p>

    </div>
  );
};

export default OrderPage;