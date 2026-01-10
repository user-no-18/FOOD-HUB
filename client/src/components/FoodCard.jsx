import React, { useState } from "react";
import { FaDrumstickBite, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCartItems } from "../Redux/user.slice";

const FoodCard = ({ data }) => {
  const avgRating = data?.averageRating || 0;
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);
  const dispatch = useDispatch();

  /* ---------- Rating stars ---------- */
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (avgRating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (avgRating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  };

  /* ---------- Quantity ---------- */
  const increaseQty = () => {
    setAdded(false);
    setQuantity((prev) => prev + 1);
  };

  const decreaseQty = () => {
    setAdded(false);
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
  };

  /* ---------- Add to cart ---------- */
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
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Image */}
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

      {/* Content */}
      <div className="flex-1 flex flex-col p-3 gap-2">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
          {data.name}
        </h3>

        <div className="flex items-center gap-1">
          {renderStars()}
          <span className="text-gray-600 text-xs ml-1">
            {avgRating.toFixed(1)}
          </span>
        </div>

        <div className="text-base font-bold text-orange-500">
          ₹{data.price}
        </div>

        {/* ---------- Button Logic ---------- */}
        {added ? (
          <button
            disabled
            className="w-full bg-green-500 text-white py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 cursor-default"
          >
            ✓ Added
          </button>
        ) : quantity === 0 ? (
          <button
            onClick={increaseQty}
            className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaShoppingCart className="text-sm" />
            Add
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {/* Quantity */}
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-1">
              <button
                onClick={decreaseQty}
                className="w-8 h-8 bg-white rounded-lg font-bold hover:bg-gray-100 shadow-sm"
              >
                −
              </button>
              <span className="font-semibold text-gray-900 text-sm">
                {quantity}
              </span>
              <button
                onClick={increaseQty}
                className="w-8 h-8 bg-white rounded-lg font-bold hover:bg-gray-100 shadow-sm"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FaShoppingCart className="text-sm" />
              Add ₹{(data.price * quantity).toFixed(0)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
