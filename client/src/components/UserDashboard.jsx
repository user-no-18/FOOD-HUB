import React from "react";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import CommonNav from "./CommonNav";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import ShopCard from "./ShopCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrendingUp, FiMapPin, FiX } from "react-icons/fi";
import { IoRestaurantOutline, IoSearchOutline } from "react-icons/io5";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { BiStore } from "react-icons/bi";

const UserDashboard = () => {
  const { city, shopInMyCity, itemsInMyCity, searchItems } = useSelector(
    (state) => state.user
  );
  const [updatedItemsList, setUpdatedItemslist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const handleFilter = (category) => {
    setSelectedCategory(category);

    if (category === "All") {
      setUpdatedItemslist(itemsInMyCity?.items || []);
    } else {
      const filteredList =
        itemsInMyCity?.items?.filter((i) => i.category === category) || [];
      setUpdatedItemslist(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemslist(itemsInMyCity?.items || []);
  }, [itemsInMyCity]);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      <CommonNav />

      {/* Spacer for fixed navbar */}
      <div className="h-20"></div>

      {/* Hero Section with City Info */}
     <div className="w-full bg-gradient-to-r from-orange-50 via-amber-50 to-red-50 border-b border-orange-100/50 overflow-x-hidden">
  <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 min-w-0">

      {/* Left Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
            <FiMapPin className="text-orange-500 text-lg" />
          </div>
          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
            Delivering to
          </span>
        </div>
<h1 className="text-4xl sm:text-5xl lg:text-6xl font-funnel tracking-wider bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 leading-tight">
  {city || "Your City"}
</h1>


        <p className="text-gray-600 text-base sm:text-lg max-w-2xl leading-relaxed mb-6">
          Discover delicious meals from the best local restaurants and get them delivered fresh to your doorstep
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-orange-200/50 hover:shadow-md transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <FiTrendingUp className="text-white text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Available Items</p>
              <p className="text-xl font-bold text-gray-900">
                {updatedItemsList?.length || 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-5 py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-orange-200/50 hover:shadow-md transition-all duration-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <BiStore className="text-white text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Restaurants</p>
              <p className="text-xl font-bold text-gray-900">
                {shopInMyCity?.shops?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Image */}
      <div className="flex-1 flex justify-center lg:justify-end md:jus w-full">
        <div className="relative w-full max-w-md lg:max-w-lg">
          <img
            src="/FoodImg.png"
            alt="Delicious food"
            className="w-full h-auto object-contain drop-shadow-2xl select-none pointer-events-none"
          />
        </div>
      </div>

    </div>
  </div>
</div>


      {/* Search Results Banner */}
      {searchItems?.length > 0 && (
        <div className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <IoSearchOutline className="text-white text-lg" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base">
                  Found {searchItems.length} results for your search
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Section */}
      <section className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
              <MdOutlineRestaurantMenu className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Inspiration for your first order
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Explore cuisines from around the world
              </p>
            </div>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="relative group">
          <div className="w-full overflow-x-auto scroll-smooth pb-6 scrollbar-hide">
            <div className="flex gap-4 sm:gap-5">
              {categories.map((cate, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 transition-all duration-300 ${
                    selectedCategory === cate.category
                      ? "scale-110 ring-4 ring-orange-400 ring-offset-4 rounded-[20px] shadow-xl"
                      : "hover:scale-105"
                  }`}
                >
                  <CategoryCard
                    image={cate.image}
                    name={cate.category}
                    onClick={() => handleFilter(cate.category)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gradient Fade Edges */}
          <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-white via-white/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden"></div>
          <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden"></div>
        </div>
      </section>

      {/* Shops Section */}
      {shopInMyCity && shopInMyCity.shops && shopInMyCity.shops.length > 0 && (
        <section className="w-full bg-gradient-to-b from-orange-50/30 via-transparent to-transparent border-y border-orange-100/30">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-12">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <IoRestaurantOutline className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                    Shops in My City
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    {shopInMyCity.shops.length} amazing restaurants near you
                  </p>
                </div>
              </div>
            </div>

            {/* Shops Horizontal Scroll */}
            <div className="relative group">
              <div className="w-full overflow-x-auto scroll-smooth pb-6 scrollbar-hide">
                <div className="flex gap-5 sm:gap-6">
                  {shopInMyCity.shops.map((shop, idx) => (
                    <div
                      key={shop._id || idx}
                      onClick={() => navigate(`/shop-items/${shop._id}`)}
                      className="flex-shrink-0 cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-2xl"
                    >
                      <ShopCard shop={shop} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Gradient Fade Edges */}
              <div className="absolute left-0 top-0 bottom-6 w-16 bg-gradient-to-r from-orange-50/30 via-orange-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden"></div>
              <div className="absolute right-0 top-0 bottom-6 w-16 bg-gradient-to-l from-orange-50/30 via-orange-50/50 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity lg:block hidden"></div>
            </div>
          </div>
        </section>
      )}

    <section className="w-full bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6 sm:py-8 pb-12">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-orange-500 flex items-center justify-center shadow-md">
                <MdOutlineRestaurantMenu className="text-white text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {selectedCategory === "All"
                    ? "Suggested Food Items"
                    : `${selectedCategory} Items`}
                </h2>
                <p className="text-sm text-gray-600 mt-0.5">
                  {updatedItemsList?.length || 0} options available
                </p>
              </div>
            </div>

            {/* Clear Filter Button */}
            {selectedCategory !== "All" && (
              <button
                onClick={() => handleFilter("All")}
                className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 rounded-xl font-semibold text-sm hover:bg-orange-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <FiX className="text-base" />
                <span>Clear Filter</span>
              </button>
            )}
          </div>

          {/* Food Items Grid */}
          {updatedItemsList && updatedItemsList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {updatedItemsList.map((item) => (
                <div
                  key={item._id}
                  className="transform hover:scale-105 transition-all duration-300"
                >
                  <FoodCard data={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              {/* Empty State Illustration */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center shadow-lg">
                  <MdOutlineRestaurantMenu className="text-5xl text-gray-400" />
                </div>
                <div className="absolute -top-1 -right-1 w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                  <IoSearchOutline className="text-white text-xl" />
                </div>
              </div>

              {/* Empty State Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                No Items Found
              </h3>
              <p className="text-gray-600 text-center max-w-md mb-6 text-sm sm:text-base">
                {selectedCategory !== "All"
                  ? `Sorry, we couldn't find any ${selectedCategory.toLowerCase()} items in your area.`
                  : "No items available in your city at the moment."}
              </p>

              {/* Action Button */}
              {selectedCategory !== "All" && (
                <button
                  onClick={() => handleFilter("All")}
                  className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg hover:bg-orange-600 transition-all duration-300 flex items-center gap-2"
                >
                  <MdOutlineRestaurantMenu className="text-lg" />
                  <span>Browse All Items</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Bottom Decorative Gradient */}
      <div className="w-full h-40 bg-gradient-to-t from-orange-50 via-orange-25 to-transparent"></div>
    </div>
  );
};

export default UserDashboard;