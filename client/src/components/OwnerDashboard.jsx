import React from "react";

import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import OwnerItemcard from "./OwnerItemcard";
import CommonNav from "./CommonNav";


const OwnerDashboard = () => {
  const { shopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  
  const ShopDetails = ({ children }) => (
    <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
        <FaUtensils className="text-[#ff4d2d] w-14 h-14" />
        Welcome to {shopData.name}
      </h1>

      {/* Shop Info Card */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300 w-full max-w-3xl relative">
        <button
          onClick={() => navigate("/editshop")}
          className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors z-10"
        >
          <FaPen />
        </button>

        <img
          src={shopData.image} 
          alt={shopData.name || "Shop Image"}
          className="w-full h-48 sm:h-64 object-cover"
        />
        <div className="p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {shopData.name}
          </h2>
          <p className="text-gray-500 mb-4">
            {shopData.city}, {shopData.state}
          </p>
          <p className="text-gray-700 mb-4">{shopData.address}</p>
          <div className="text-xs sm:text-sm text-gray-400">
            <p>Created: {new Date(shopData.createdAt).toLocaleString()}</p>
            <p>
              Last Updated: {new Date(shopData.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
      
      {children}
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex flex-col items-center">
      
      <CommonNav />
      
      {!shopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Restaurant
              </h2>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                Join our food delivery platform and reach thousands of hungry
                customers every day.
              </p>
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/editshop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

     
      {shopData && shopData.items?.length === 0 && (
        <ShopDetails>
          <div className="flex items-center justify-center w-full">
            <div className="bg-white border border-orange-200 shadow-lg rounded-xl p-6 sm:p-8 w-full max-w-xl text-center hover:shadow-2xl transition-all duration-300">
              <FaUtensils className="text-orange-500 text-4xl sm:text-5xl mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Items
              </h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Share your delicious creations with our customers by adding them
                to the menu.
              </p>
              <button
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition-colors"
                onClick={() => navigate("/additem")}
              >
                <FaPlus /> Add Item
              </button>
            </div>
          </div>
        </ShopDetails>
      )}

     
      {shopData && shopData.items?.length > 0 && (
        <ShopDetails>
          
          <button
            className="inline-flex items-center gap-2 bg-orange-500 text-white px-5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition-colors"
            onClick={() => navigate("/additem")}
          >
            <FaPlus /> Add New Item
          </button>

          {shopData.items.map((item) => (
            <OwnerItemcard key={item._id} data={item} />
          ))}
        </ShopDetails>
      )}
    </div>
  );
};

export default OwnerDashboard;