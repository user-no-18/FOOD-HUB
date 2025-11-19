import React, { useState } from "react";
import { FaDrumstickBite, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCartItems } from "../Redux/user.slice";

const FoodCard = ({ data }) => {
  const avgRating = data?.averageRating || 0;
  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch();
  // Calculate rating stars
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (avgRating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (avgRating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  // Quantity handlers
  const increaseQty = () => setQuantity((prev) => prev + 1);
  const decreaseQty = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  const handleAddToCart = () => {
    if (quantity > 0) {
      dispatch(
        addToCartItems({
          id: data._id,
          name: data.name,
          price: data.price,
          quantity: quantity,
          image: data.image,
          shop: data.shop,
          foodType: data.type,
        })
      );
    }
  };

  return (
    <div className="w-full rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="relative w-full h-[170px] flex justify-center items-center bg-white">
        <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
          {data.foodType === "veg" ? (
            <FaLeaf className="text-green-600 text-lg" />
          ) : (
            <FaDrumstickBite className="text-red-600 text-lg" />
          )}
        </div>

        <img
          src={data.image}
          alt={data.name || "Food item"}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className="font-semibold text-gray-900 text-base truncate">
          {data.name}
        </h1>

        <div className="flex items-center gap-1 mt-2">
          {renderStars()}
          <span className="text-gray-600 text-sm ml-1">
            {avgRating.toFixed(1)}
          </span>
        </div>

        <div className="mt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-[#ff4d2d]">
            ₹{data.price || "N/A"}
          </span>

          <div className="flex items-center gap-2">
            {/* Quantity Control */}
            <button
              onClick={decreaseQty}
              className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition"
            >
              -
            </button>
            <span className="w-6 text-center font-semibold">{quantity}</span>
            <button
              onClick={increaseQty}
              className="w-7 h-7 bg-gray-200 text-gray-700 rounded-full font-bold hover:bg-gray-300 transition"
            >
              +
            </button>

            <button
              onClick={() => handleAddToCart()}
              className={`p-2 rounded-full transition ${
                quantity > 0
                  ? "bg-[#ff4d2d] text-white hover:bg-orange-600"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              disabled={quantity === 0}
            >
              <FaShoppingCart />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
