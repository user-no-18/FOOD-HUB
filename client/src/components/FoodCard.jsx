import React, { useState, useEffect } from "react";
import { FaDrumstickBite, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addToCartItems } from "../Redux/user.slice";
import axios from "axios";
import { serverUrl } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
const FoodCard = ({ data, onRatingUpdate }) => {
  const avgRating = data?.ratings?.average || 0;
  const ratingCount = data?.ratings?.count || 0;
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    fetchUserRating();
  }, [data._id]);

  const fetchUserRating = async () => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/item/user-rating/${data._id}`,
        { withCredentials: true }
      );
      if (res.data.rating) {
        setUserRating(res.data.rating.stars);
      }
    } catch (error) {
      console.log("Error fetching user rating:", error);
    }
  };

  const playSuccessSound = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE="
    );
    audio.volume = 0.3;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  };

  const renderStars = (rating = avgRating, isClickable = false) => {
    const stars = [];
    const displayRating = isClickable ? hoverRating || userRating : rating;

    for (let i = 1; i <= 5; i++) {
      const starProps = isClickable
        ? {
            onMouseEnter: () => setHoverRating(i),
            onMouseLeave: () => setHoverRating(0),
            onClick: () => handleStarClick(i),
            className: "cursor-pointer transition-all hover:scale-125",
          }
        : {};

      if (displayRating >= i) {
        stars.push(
          <span key={i} {...starProps}>
            <FaStar className="text-yellow-400 text-xs" />
          </span>
        );
      } else if (displayRating >= i - 0.5 && !isClickable) {
        stars.push(
          <span key={i} {...starProps}>
            <FaStarHalfAlt className="text-yellow-400 text-xs" />
          </span>
        );
      } else {
        stars.push(
          <span key={i} {...starProps}>
            <FaRegStar className="text-yellow-400 text-xs" />
          </span>
        );
      }
    }
    return stars;
  };

  const handleStarClick = async (stars) => {
    setUserRating(stars);
    await submitRating(stars);
  };

  const submitRating = async (stars = userRating) => {
    if (!stars || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        `${serverUrl}/api/item/rate-item/${data._id}`,
        { stars },
        { withCredentials: true }
      );

      if (res.data.success) {
        setShowRatingModal(false);
        setShowSuccessAnimation(true);
        playSuccessSound();

        if (onRatingUpdate) {
          onRatingUpdate(data._id, res.data.item);
        }

        setTimeout(() => {
          setShowSuccessAnimation(false);
        }, 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const increaseQty = () => {
    setAdded(false);
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    setAdded(false);
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleAddToCart = () => {
    if (quantity === 0) return;

    dispatch(
      addToCartItems({
        id: data._id,
        name: data.name,
        price: data.price,
        quantity,
        image: data.image,
        shop: data.shop,
        foodType: data.foodType,
      })
    );

    setAdded(true);
    setQuantity(0);
  };

  return (
    <>
      <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col relative">
        <div className="relative w-full aspect-square bg-gray-50">
          <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md z-10">
            {data.foodType === "veg" ? (
              <FaLeaf className="text-green-600 text-sm" />
            ) : (
              <FaDrumstickBite className="text-red-600 text-sm" />
            )}
          </div>

          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 flex flex-col p-3 gap-2">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
            {data.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {renderStars(avgRating, true)}
              <span className="text-gray-600 text-xs ml-1">
                {avgRating.toFixed(1)}
              </span>
              <span className="text-gray-400 text-xs">({ratingCount})</span>
            </div>
            <button
              onClick={() => setShowRatingModal(true)}
              className="text-xs text-orange-500 hover:text-orange-600 font-medium"
            >
              Rate
            </button>
          </div>

          <div className="text-base font-bold text-orange-500">
            ₹{data.price}
          </div>

          {added ? (
            <div className="flex items-center gap-2">
  <div className="flex-1 bg-green-50 text-green-700">
    ✓ Added
  </div>
  <button onClick={() => navigate("/checkout")} className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-xs transition-colors">
    Buy
  </button>
</div>
          ) : quantity > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg flex-1">
                <button
                  onClick={decreaseQty}
                  className="px-3 py-1.5 text-orange-600 font-bold hover:bg-orange-100 transition rounded-l-lg"
                >
                  -
                </button>
                <span className="flex-1 text-center font-semibold text-sm text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={increaseQty}
                  className="px-3 py-1.5 text-orange-600 font-bold hover:bg-orange-100 transition rounded-r-lg"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Add
              </button>
            </div>
          ) : (
            <button
              onClick={increaseQty}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <FaShoppingCart className="text-sm" />
              Add to Cart
            </button>
          )}
        </div>

        <AnimatePresence>
          {showSuccessAnimation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute inset-0 bg-white bg-opacity-95 flex flex-col items-center justify-center z-20 rounded-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-3"
              >
                ⭐
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg font-bold text-orange-500"
              >
                Thank You!
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-gray-600"
              >
                Rating submitted successfully
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showRatingModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRatingModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rate {data.name}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Tap a star to rate
              </label>
              <div className="flex justify-center gap-3">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || userRating) >= star;
                  return (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleStarClick(star)}
                      className="transition-all"
                    >
                      {filled ? (
                        <FaStar className="text-yellow-400 text-3xl drop-shadow-md" />
                      ) : (
                        <FaRegStar className="text-yellow-400 text-3xl" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
              {userRating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-gray-600 mt-3"
                >
                  {userRating} star{userRating > 1 ? "s" : ""} selected
                </motion.p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default FoodCard;