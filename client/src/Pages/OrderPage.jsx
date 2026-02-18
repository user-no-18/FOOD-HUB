import React from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

const OrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  const circleVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.4, delay: 0.3, ease: "easeOut" },
    },
  };

  const handleTrackOrder = () => {
    if (orderId) {
      navigate(`/track-order/${orderId}`);
    } else {
      navigate("/my-orders");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100"
      >
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 w-20 h-20"
            >
              <motion.circle
                cx="12"
                cy="12"
                r="10"
                className="stroke-green-500"
                variants={circleVariants}
                initial="hidden"
                animate="visible"
              />
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

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight text-center">
            Order Confirmed!
          </h1>
          <p className="text-gray-500 mb-8 text-base leading-relaxed text-center">
            Woohoo! Your payment was successful. We're preparing your delicious
            order.
          </p>

          <div className="bg-gray-50 rounded-xl p-4 mb-8 flex justify-between items-center text-sm border border-gray-100">
            <span className="text-gray-500">Est. Delivery</span>
            <span className="font-bold text-gray-800 flex items-center gap-1">
              35 - 45 mins
            </span>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleTrackOrder}
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

      <p className="absolute bottom-8 text-gray-400 text-sm">
        Need help? Contact support
      </p>
    </div>
  );
};

export default OrderPage;