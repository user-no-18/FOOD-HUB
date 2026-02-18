import React, { useState, useEffect } from "react";
import { FaDrumstickBite, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addToCartItems } from "../Redux/user.slice";
import axios from "axios";
import { serverUrl } from "../App";

const FoodCard = ({ data }) => {
  const avgRating = data?.ratings?.average || 0;
  const ratingCount = data?.ratings?.count || 0;
  const [quantity, setQuantity] = useState(0);
  const [added, setAdded] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const dispatch = useDispatch();

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

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (avgRating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
      } else if (avgRating >= i - 0.5) {
        stars.push(
          <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
      }
    }
    return stars;
  };

  const renderClickableStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = (hoverRating || userRating) >= i;
      stars.push(
        <button
          key={i}
          type="button"
          onMouseEnter={() => setHoverRating(i)}
          onMouseLeave={() => setHoverRating(0)}
          onClick={() => setUserRating(i)}
          className="transition-transform hover:scale-110"
        >
          {filled ? (
            <FaStar className="text-yellow-400 text-2xl" />
          ) : (
            <FaRegStar className="text-yellow-400 text-2xl" />
          )}
        </button>
      );
    }
    return stars;
  };

  const submitRating = async () => {
    if (!userRating) {
      alert("Please select a rating");
      return;
    }

    try {
      const res = await axios.post(
        `${serverUrl}/api/item/rate-item/${data._id}`,
        { stars: userRating },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Rating submitted successfully!");
        setShowRatingModal(false);
        window.location.reload();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit rating");
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
      <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
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
              {renderStars()}
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
            <div className="bg-green-50 text-green-700 py-2 rounded-lg text-center text-xs font-semibold">
              ✓ Added to Cart
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
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Rate {data.name}
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Rating
              </label>
              <div className="flex justify-center gap-2">
                {renderClickableStars()}
              </div>
              {userRating > 0 && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  {userRating} star{userRating > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submitRating}
                disabled={!userRating}
                className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodCard;