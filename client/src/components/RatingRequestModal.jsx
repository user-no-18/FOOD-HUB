import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaStar, FaRegStar } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";

const RatingRequestModal = ({ items, orderId, onClose, onRatingComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [ratings, setRatings] = useState({});
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentItem = items[currentIndex];

  const playSuccessSound = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE="
    );
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  const handleStarClick = async (stars) => {
    setRatings({ ...ratings, [currentItem._id]: stars });

    setIsSubmitting(true);
    try {
      await axios.post(
        `${serverUrl}/api/item/rate-item/${currentItem._id}`,
        { stars },
        { withCredentials: true }
      );

      playSuccessSound();

      if (currentIndex < items.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setHoverRating(0);
          setIsSubmitting(false);
        }, 800);
      } else {
        setShowSuccess(true);
        setTimeout(() => {
          if (onRatingComplete) onRatingComplete();
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Rating error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50 }}
          className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
        >
          {!showSuccess ? (
            <>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order Delivered!
                </h2>
                <p className="text-sm text-gray-600">
                  Rate your experience with each item
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  {currentItem.image && (
                    <img
                      src={currentItem.image}
                      alt={currentItem.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">
                      {currentItem.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Item {currentIndex + 1} of {items.length}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center gap-3 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const filled =
                      (hoverRating || ratings[currentItem._id] || 0) >= star;
                    return (
                      <motion.button
                        key={star}
                        type="button"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => !isSubmitting && setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => !isSubmitting && handleStarClick(star)}
                        className="transition-all disabled:opacity-50"
                      >
                        {filled ? (
                          <FaStar className="text-yellow-400 text-3xl drop-shadow-lg" />
                        ) : (
                          <FaRegStar className="text-yellow-400 text-3xl" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {(hoverRating || ratings[currentItem._id]) > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-gray-600"
                  >
                    {hoverRating || ratings[currentItem._id]} star
                    {(hoverRating || ratings[currentItem._id]) > 1 ? "s" : ""}
                  </motion.p>
                )}
              </div>

              <div className="flex gap-2 mb-2">
                {items.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1 flex-1 rounded-full transition-all ${
                      idx < currentIndex
                        ? "bg-green-500"
                        : idx === currentIndex
                        ? "bg-orange-500"
                        : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={onClose}
                className="w-full text-sm text-gray-500 hover:text-gray-700 font-medium mt-2"
              >
                Skip for now
              </button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{ duration: 0.6 }}
                className="text-7xl mb-4"
              >
                ⭐
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Thank You!
              </h3>
              <p className="text-gray-600">Your feedback means a lot to us</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RatingRequestModal;