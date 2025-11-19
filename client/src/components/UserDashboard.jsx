import React from "react";

import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import CommonNav from "./CommonNav";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";
import ShopCard from "./ShopCard";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { city, shopInMyCity, itemsInMyCity } = useSelector((state) => state.user);
  const [updatedItemsList, setUpdatedItemslist] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate()
  const handleFilter = (category) => {
    setSelectedCategory(category);
    
    if (category === 'All') {
      setUpdatedItemslist(itemsInMyCity?.items || []);
    } else {
      const filteredList = itemsInMyCity?.items?.filter((i) => i.category === category) || [];
      setUpdatedItemslist(filteredList);
    }
  };

  useEffect(() => {
    setUpdatedItemslist(itemsInMyCity?.items || []);
  }, [itemsInMyCity]);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
     
      <CommonNav />
    
      
      <div className="h-[64px]"></div>

    
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
        <h1 className="text-gray-800 text-lg sm:text-xl md:text-2xl font-semibold mb-4 px-1">
          Inspiration for your first order
        </h1>

        
        <div className="w-full overflow-x-auto scroll-smooth no-scrollbar">
          <div className="flex gap-3 sm:gap-4 pb-3">
            {categories.map((cate, index) => (
              <CategoryCard 
                image={cate.image}
                name={cate.category}
                key={index} 
                onClick={() => handleFilter(cate.category)}
              />
            ))}
          </div>
        </div>
      </div>
      

{shopInMyCity && shopInMyCity.shops && shopInMyCity.shops.length > 0 && (
  <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
    <h1 className="text-gray-800 text-lg sm:text-xl md:text-2xl font-semibold mb-4 px-1">
      Shops in My City
    </h1>
    <div className="w-full overflow-x-auto scroll-smooth no-scrollbar">
      <div className="flex gap-3 sm:gap-4 pb-3">
        {shopInMyCity.shops.map((shop, idx) => (
          <div 
            key={shop._id || idx} 
            onClick={() => navigate(`/shop-items/${shop._id}`)}
            className="cursor-pointer"
          >
            <ShopCard shop={shop} />
          </div>
        ))}
      </div>
    </div>
  </div>
)}

      
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 pb-8">
        <h1 className="text-gray-800 text-lg sm:text-xl md:text-2xl font-semibold mb-4 px-1">
          {selectedCategory === 'All' ? 'Suggested Food Items' : `${selectedCategory} Items`}
        </h1>
        <div className="w-full">
          {updatedItemsList && updatedItemsList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {updatedItemsList.map((item) => (
                <FoodCard data={item} key={item._id} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No {selectedCategory !== 'All' ? selectedCategory.toLowerCase() : 'items'} found in your city.
            </p>
          )}  
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;