import React from "react";

import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import CommonNav from "./CommonNav";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import ShopCard from "./ShopCard";

const UserDashboard = () => {
  const { city, shopInMyCity, itemsInMyCity } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Navbar */}
      <CommonNav />
    
      {/* Spacer for fixed navbar */}
      <div className="h-[64px]"></div>

      {/* Inspiration Section */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <h1 className="text-gray-800 text-lg sm:text-xl md:text-2xl font-semibold mb-4 px-1">
          Inspiration for your first order
        </h1>

        {/* Category Scroll */}
        <div className="w-full overflow-x-auto scroll-smooth no-scrollbar">
          <div className="flex gap-3 sm:gap-4 pb-3">
            {categories.map((cate, index) => (
              <CategoryCard data={cate} key={index} />
            ))}
          </div>
        </div>
      </div>
      
      {/* Shops in My City Section */}
      {shopInMyCity && shopInMyCity.shops && shopInMyCity.shops.length > 0 && (
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <h1 className="text-gray-800 text-lg sm:text-xl md:text-2xl font-semibold mb-4 px-1">
            Shops in My City
          </h1>
          <div className="w-full overflow-x-auto scroll-smooth no-scrollbar">
            <div className="flex gap-3 sm:gap-4 pb-3">
              {shopInMyCity.shops.map((shop, idx) => (
                <ShopCard key={shop._id || idx} shop={shop} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggested Items Section */}
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 pb-8">
        <h1 className="text-gray-800 text-lg sm:text-xl md:text-2xl font-semibold mb-4 px-1">
          Suggested Food Items
        </h1>
        <div className="w-full">
          {itemsInMyCity && itemsInMyCity.items && itemsInMyCity.items.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {itemsInMyCity.items.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No items found in your city.</p>
          )}  
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;